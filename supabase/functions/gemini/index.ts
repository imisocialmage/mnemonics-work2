import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

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
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // Get user from JWT
        const authHeader = req.headers.get('Authorization')!
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Check credits
        const { data: credits, error: creditError } = await supabase
            .from('user_credits')
            .select('credits_remaining')
            .eq('user_id', user.id)
            .single()

        if (creditError || !credits || credits.credits_remaining <= 0) {
            return new Response(JSON.stringify({ error: 'Credit limit reached' }), {
                status: 402,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Parse request body
        const { prompt, history, systemInstruction } = await req.json()

        // Call Gemini API
        const MODEL_NAME = 'gemini-2.0-flash'; // Using a stable model name
        const payload = {
            contents: history || [{ role: 'user', parts: [{ text: prompt }] }],
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2048,
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            return new Response(JSON.stringify({ error: 'Gemini API error', detail: errorData }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            return new Response(JSON.stringify({ error: 'Empty response from Gemini' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Deduct credit
        const { error: updateError } = await supabase
            .from('user_credits')
            .update({ credits_remaining: credits.credits_remaining - 1, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)

        if (updateError) {
            console.error('Failed to deduct credit:', updateError)
            // We still return the text because the AI call succeeded
        }

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
