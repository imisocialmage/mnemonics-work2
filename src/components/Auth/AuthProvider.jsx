import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                fetchCredits(session.user.id);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchCredits(session.user.id);
            } else {
                setCredits(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchCredits = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_credits')
                .select('credits_remaining')
                .eq('user_id', userId)
                .single();

            if (!error && data) {
                setCredits(data.credits_remaining);
            }
        } catch (err) {
            console.error('Error fetching credits:', err);
        }
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });
        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setCredits(null);
    };

    const resendConfirmation = async (email) => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });
        if (error) throw error;
    };

    const refreshCredits = () => {
        if (user) {
            fetchCredits(user.id);
        }
    };

    const value = {
        user,
        session,
        loading,
        credits,
        signUp,
        signIn,
        signOut,
        resendConfirmation,
        refreshCredits,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
