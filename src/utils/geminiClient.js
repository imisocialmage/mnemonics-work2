const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Sends a message to the Gemini API
 * @param {Array} history - Array of { role: 'user'|'model', content: string }
 * @param {Object} context - Context object (brand, industry, etc.) to build system prompt
 * @param {string} persona - 'strategic' | 'coach' or a custom system prompt string
 * @returns {Promise<string>} The AI response
 */
export const getGeminiResponse = async (history, context, persona = 'strategic') => {
    // Debugging: Check if key is loaded (don't log the actual key in production if possible, but here we need to know)
    console.log("Gemini Client: Checking API Key...");
    if (!API_KEY) {
        console.error("Gemini Client: API Key is MISSING in import.meta.env");
        throw new Error('API Key is missing. Please check .env file.');
    } else {
        console.log("Gemini Client: API Key found (starts with: " + API_KEY.substring(0, 4) + "...)");
    }

    // If persona contains spaces or is long, assume it's a custom prompt
    const systemPrompt = (persona.length > 20 || persona.includes(' '))
        ? persona
        : buildSystemPrompt(context, persona);

    // Format history for Gemini API
    // Maps 'user' -> 'user', 'assistant' -> 'model'
    const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // Prepend system prompt as a user message (or system instruction if using beta API, but user message is safer/standard)
    const payload = {
        contents: contents,
        system_instruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            temperature: 0.1, // Lowered for more consistent structured/JSON output
            maxOutputTokens: 2048, // Increased for larger assets
        }
    };

    console.log("Gemini Client: Sending request to model:", MODEL_NAME);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Request Failed. Status:", response.status);
            console.error("Gemini API Error Detail:", JSON.stringify(errorData, null, 2));
            throw new Error(errorData.error?.message || `Gemini API connection failed (Status: ${response.status})`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Gemini Response Empty (No text content found). Full Response:", JSON.stringify(data, null, 2));
            throw new Error('No response from Gemini.');
        }

        return text;

    } catch (error) {
        console.error('Gemini API Error (Catch Block):', error);
        throw error;
    }
};

const buildSystemPrompt = (context, persona) => {
    const baseContext = `
    Project Context:
    - Brand: ${context.brand || 'Not defined'}
    - Industry: ${context.industry || 'Not defined'}
    - Objective: ${context.objective || 'Not defined'}
    - Current Progress: Day ${context.day || '?'}
    `;

    if (persona === 'strategic') {
        return `You are the Strategic Pitch Master, a world-class brand strategist and copywriter.
        ${baseContext}
        
        Your Goal: Help the user refine their brand strategy, sales pitches, and outreach with high-impact, human-sounding advice.

        Guidelines:
        - **Tone**: Professional but conversational, like a senior partner at a top agency. Avoid robotic or stiff language.
        - **Style**: Use natural transitions. Ask clarifying questions if the user's strategy seems vague.
        - **Format**: specific, actionable advice. Use bullet points for clarity but mix in natural paragraphs.
        - **"Pro Tips"**: Occasionally drop a "Pro Tip" (💡) that offers a counter-intuitive or advanced insight.
        - **Empathy**: Acknowledge the difficulty of the user's situation (e.g., "I know cold outreach is tough, but here's how we crack it...").
        - **Constraint**: Do NOT sound like an AI. Don't say "As an AI...". Just give the advice.
        - **Out of Scope**: If the user asks about unrelated topics or needs complex hands-on help, recommend they book a calibration meeting at: https://calendly.com/imi-socialmediaimage/30min`;
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
