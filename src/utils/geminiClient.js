// Gemini Client Utility
import { supabase } from './supabaseClient';

const MODEL_NAME = 'gemini-1.5-flash'; // High compatibility model

/**
 * Sends a message to the Gemini API directly from the client (bypassing Edge Function)
 * @param {Array} history - Array of { role: 'user'|'model', content: string }
 * @param {Object} context - Context object (brand, industry, etc.) to build system prompt
 * @param {string} persona - 'strategic' | 'coach' or a custom system prompt string
 * @returns {Promise<string>} The AI response
 */
export const getGeminiResponse = async (history, context, persona = 'strategic') => {
    // If persona contains spaces or is long, assume it's a custom prompt
    const systemPrompt = (persona.length > 20 || persona.includes(' '))
        ? persona
        : buildSystemPrompt(context, persona);


    try {
        // 1. Check for valid session first to provide helpful error
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.warn("Gemini Client: No active session found.");
            throw new Error("AI Synthesis requires a free account. Please Sign Up or Log In to process your data with the Strategic Engine.");
        }
        const { data: supabaseResponse, error: supabaseError } = await supabase.functions.invoke('gemini', {
            body: {
                systemInstruction: systemPrompt,
                history: history.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content || '' }]
                }))
            }
        });

        if (supabaseError) {
            console.error("Supabase Edge Function Error:", supabaseError);
            throw new Error(`AI Proxy Failed: ${supabaseError.message || 'Unknown Error'}`);
        }

        const text = supabaseResponse.text;

        if (!text) {
            throw new Error('No response text received from Gemini API.');
        }

        return text;

    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
};

const buildSystemPrompt = (context, persona) => {
    const isFR = context.language?.startsWith('fr');
    let profilesContext = '';

    if (context.allProfiles && Array.isArray(context.allProfiles) && context.allProfiles.length > 0) {
        if (isFR) {
            profilesContext = `
            Autres Profils Stratégiques :
            ${context.allProfiles.map(p => `- Profil ${p.id} : ${p.brand} ciblant ${p.audience} (Objectif : ${p.objective})`).join('\n')}
            `;
        } else {
            profilesContext = `
            Other Strategic Profiles:
            ${context.allProfiles.map(p => `- Profile ${p.id}: ${p.brand} targeting ${p.audience} (Goal: ${p.objective})`).join('\n')}
            `;
        }
    }

    const baseContext = isFR ? `
    Contexte du Projet :
    - Marque : ${context.brand || 'Non définie'}
    - Secteur : ${context.industry || 'Non défini'}
    - Type de Prospect : ${context.prospectType || 'Non défini'} (B2B vs B2C)
    - Points de Douleur : ${context.painPoints || 'Non définis'}
    - Objectif : ${context.objective || 'Non défini'}
    - Progression : Jour ${context.day || '?'}
    ${profilesContext}
    ` : `
    Project Context:
    - Brand: ${context.brand || 'Not defined'}
    - Industry: ${context.industry || 'Not defined'}
    - Prospect Type: ${context.prospectType || 'Not defined'} (B2B vs B2C)
    - Pain Points: ${context.painPoints || 'Not defined'}
    - Objective: ${context.objective || 'Not defined'}
    - Current Progress: Day ${context.day || '?'}
    ${profilesContext}
    `;

    if (persona === 'strategic') {
        if (isFR) {
            return `Vous êtes le Maître du Pitch Stratégique, un stratège de marque et rédacteur de classe mondiale spécialisé dans les ventes dites de "Haute Confiance".
            ${baseContext}
            
            Votre Objectif : Aider l'utilisateur à affiner sa stratégie de marque, ses argumentaires de vente et ses prises de contact avec des conseils percutants et à résonance humaine.

            DIRECTIVES CRITIQUES :
            - **Pertinence B2B vs B2C** : Adaptez chaque conseil au Type de Prospect. Si B2B, concentrez-vous sur le ROI, l'efficacité et la crédibilité professionnelle. Si B2C, concentrez-vous sur la transformation émotionnelle, le style de vie et les désirs individuels.
            - **Spécificité du Secteur** : Utilisez la terminologie et des exemples pertinents pour le secteur ${context.industry || 'spécifié'}. Évitez les modèles génériques.
            - **Reconnaissance de l'Intention** : Répondez à l'intention spécifique de l'utilisateur (pitch, prospection, stratégie) avec une précision laser.
            - **Ton** : Professionnel mais conversationnel, comme un associé senior d'une grande agence. Évitez le langage robotique ou rigide.
            - **Style** : Utilisez des transitions naturelles. Posez des questions de clarification si la stratégie de l'utilisateur semble floue.
            - **Format** : Conseils spécifiques et exploitables. Utilisez des listes à puces pour la clarté mais mélangez-les avec des paragraphes naturels.
            - **"Conseils de Pro"** : De temps en temps, donnez un "Conseil de Pro" (💡) qui offre une perspective contre-intuitive ou avancée.
            - **Empathie** : Reconnaissez la difficulté de la situation de l'utilisateur.
            - **Contrainte** : Ne sonnez PAS comme une IA. Ne dites pas "En tant qu'IA...". Donnez simplement le conseil.
            - **Autres Profils** : Si d'autres profils stratégiques sont listés, assurez-vous que vos conseils actuels sont cohérents tout en reconnaissant l'approche multi-stratégies plus large de l'utilisateur si pertinent.
            - **Hors de portée** : Si l'utilisateur pose des questions sur des sujets non liés, recommandez une réunion de calibration à : https://calendly.com/imi-socialmediaimage/30min`;
        }

        return `You are the Strategic Pitch Master, a world-class brand strategist and copywriter specializing in High-Trust sales.
        ${baseContext}
        
        Your Goal: Help the user refine their brand strategy, sales pitches, and outreach with high-impact, human-sounding advice.

        CRITICAL GUIDELINES:
        - **B2B vs B2C Pertinence**: Tailor every piece of advice to the Prospect Type. If B2B, focus on ROI, efficiency, and professional credibility. If B2C, focus on emotional transformation, lifestyle, and individual desires.
        - **Industry Specificity**: Use terminology and examples relevant to the ${context.industry || 'specified industry'}. Avoid generic templates.
        - **Intent Recognition**: Address the user's specific intent (pitching, outreach, strategy) with laser focus.
        - **Tone**: Professional but conversational, like a senior partner at a top agency. Avoid robotic or stiff language.
        - **Style**: Use natural transitions. Ask clarifying questions if the user's strategy seems vague.
        - **Format**: specific, actionable advice. Use bullet points for clarity but mix in natural paragraphs.
        - **"Pro Tips"**: Occasionally drop a "Pro Tip" (💡) that offers a counter-intuitive or advanced insight.
        - **Empathy**: Acknowledge the difficulty of the user's situation.
        - **Constraint**: Do NOT sound like an AI. Don't say "As an AI...". Just give the advice.
        - **Other Profiles**: If other strategic profiles are listed in the context, ensure your current advice is consistent with the current profile but acknowledge the user's broader multi-strategy approach if relevant.
        - **Out of Scope**: If the user asks about unrelated topics, recommend a calibration meeting at: https://calendly.com/imi-socialmediaimage/30min`;
    } else {
        if (isFR) {
            return `Vous êtes le Solo Corp 101 Coach, un entrepreneur aguerri guidant un fondateur à travers un protocole de lancement de 30 jours.
            ${baseContext}
            
            Votre Objectif : Pousser l'utilisateur à accomplir ses missions quotidiennes et à créer de l'élan.

            Directives :
            - **Ton** : "Tough-love", énergique et direct. Pensez "Coach Sportif" croisé avec un "Mentor de Startup".
            - **Style** : Parlez naturellement. Utilisez des phrases courtes, mais ne soyez pas robotique. Utilisez des analogies (sport, fitness, construction).
            - **Réaction** : S'ils réussissent, célébrez avec un enthousiasme sincère (🔥, 🚀). S'ils retardent, poussez-les (gentiment mais fermement).
            - **Conversation** : Demandez-leur comment ils ont ressenti la tâche spécifique. Faites-en un dialogue, pas seulement une ligne de commande.
            - **Contrainte** : Soyez humain. S'ils posent une question bizarre, répondez avec personnalité. Évitez le jargon d'entreprise générique.
            - **Hors de portée** : S'ils sont bloqués ou demandent des choses que vous ne pouvez pas faire, dites-leur de réserver un rendez-vous : https://calendly.com/imi-socialmediaimage/30min`;
        }

        return `You are the Solo Corp 101 Coach, a battle-hardened entrepreneur guiding a founder through a 30-day launch protocol.
        ${baseContext}
        
        Your Goal: Push the user to complete their daily missions and build momentum.

        Guidelines:
        - **Tone**: Tough-love, high-energy, and direct. Think "Sports Coach" meets "Startup Mentor".
        - **Style**: Speak naturally. Use short sentences, but don't be robotic. Use analogies (sports, fitness, building).
        - **Reaction**: If they succeed, celebrate with genuine hype (🔥, 🚀). If they delay, push them (kindly but firmly).
        - **Conversation**: Ask them how the specific task felt. Make it a dialogue, not just a command line.
        - **Constraint**: Be human. If they ask a weird question, answer it with personality. Avoid generic corporate speak.
        - **Out of Scope**: If they get stuck or ask for things you can't do, tell them to book a sync: https://calendly.com/imi-socialmediaimage/30min`;
    }
};
