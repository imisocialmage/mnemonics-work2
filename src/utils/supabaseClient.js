import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn('Supabase credentials missing. Edge Function calls and Auth will be disabled.');
}

// Only create the client if we have a URL, otherwise export a dummy/null-safe proxy or just null
// Most Supabase methods will fail if URL is empty, so we should guard them in usage.
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
            signUp: () => Promise.reject(new Error('Supabase not configured')),
            signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
                })
            })
        })
    };
