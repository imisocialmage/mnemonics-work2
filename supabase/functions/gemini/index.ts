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
        // Create a Supabase client with the Auth context of the logged in user.
        // This is the CRITICAL fix for 401s in Edge Functions.
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // Get user from JWT
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            console.error('Auth Error:', authError)
            return new Response(JSON.stringify({
                error: 'Unauthorized',
                detail: authError?.message || 'Check your login status.'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Check credits (using service role key for DB operations if necessary, but anon is fine if RLS is set)
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
        const { prompt, history, systemInstruction } = await req.json()
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Server configuration error: GEMINI_API_KEY not set in Supabase Secrets' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Call Gemini API with "High Compatibility"
        const finalContents = history || [{ role: 'user', parts: [{ text: prompt }] }];
        if (finalContents.length > 0 && finalContents[0].parts && finalContents[0].parts[0]) {
            finalContents[0].parts[0].text = `SYSTEM INSTRUCTIONS:\n${systemInstruction}\n\nUSER MESSAGE:\n${finalContents[0].parts[0].text}`;
        }

        const payload = {
            contents: finalContents,
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2048,
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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
