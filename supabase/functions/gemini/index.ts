import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get('Authorization')

        // Initialize client with authorization from the user
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: {
                        Authorization: authHeader || '',
                        apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? ''
                    }
                }
            }
        )

        // Force a light credit check or user check to verify JWT
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            console.error('Edge Function Auth Error:', authError)
            return new Response(JSON.stringify({
                error: 'Authentication Required',
                detail: authError?.message || 'No valid session found. Please log in.'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Check credits
        const { data: credits, error: creditError } = await supabaseClient
            .from('user_credits')
            .select('credits_remaining')
            .eq('user_id', user.id)
            .single()

        if (creditError || !credits || credits.credits_remaining <= 0) {
            return new Response(JSON.stringify({ error: 'Credit limit reached', detail: creditError }), {
                status: 402,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Parse request body
        const { prompt, history, systemInstruction, model } = await req.json()
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Server configuration error: GEMINI_API_KEY missing' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Call Gemini API 
        // Robust history handling: check if history is provided and not empty
        let finalContents = history && Array.isArray(history) && history.length > 0
            ? history
            : [{ role: 'user', parts: [{ text: prompt || '' }] }];

        // Ensure the prompt includes the system instructions in the first message for "High Compatibility"
        // Only if it's the beginning of a conversation or if we want to force context
        if (systemInstruction && finalContents.length > 0 && finalContents[0].parts && finalContents[0].parts[0]) {
            const firstMsgText = finalContents[0].parts[0].text;
            if (!firstMsgText.includes('SYSTEM INSTRUCTIONS:')) {
                finalContents[0].parts[0].text = `SYSTEM INSTRUCTIONS:\n${systemInstruction}\n\nUSER MESSAGE:\n${firstMsgText}`;
            }
        }

        const selectedModel = model || 'gemini-1.5-flash';

        const payload = {
            contents: finalContents,
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2048,
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            return new Response(JSON.stringify({ error: 'Gemini API logic error', detail: errorData }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            return new Response(JSON.stringify({ error: 'Empty AI response' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Deduct credit
        await supabaseClient
            .from('user_credits')
            .update({ credits_remaining: credits.credits_remaining - 1, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)

        return new Response(JSON.stringify({ text, credits_remaining: credits.credits_remaining - 1 }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
