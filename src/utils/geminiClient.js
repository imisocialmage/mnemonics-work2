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

    // Format history for Gemini API
    const contents = history.map(msg => {
        const parts = [{ text: msg.content || '' }];
        return {
            role: msg.role === 'user' ? 'user' : 'model',
            parts: parts
        };
    });

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
    let profilesContext = '';
    if (context.allProfiles && Array.isArray(context.allProfiles) && context.allProfiles.length > 0) {
        profilesContext = `
        Other Strategic Profiles:
        ${context.allProfiles.map(p => `- Profile ${p.id}: ${p.brand} targeting ${p.audience} (Goal: ${p.objective})`).join('\n')}
        `;
    }

    const baseContext = `
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
