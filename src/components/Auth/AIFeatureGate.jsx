import React, { useState } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import { useTranslation } from 'react-i18next';

/**
 * AIFeatureGate - Wrapper component for AI-powered features
 * Shows upgrade prompt for unauthenticated users, with option to continue with local fallback
 */
const AIFeatureGate = ({ children, featureName, onProceedWithoutAuth }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('benefits');
    const [userChoice, setUserChoice] = useState(null); // null | 'auth' | 'local'

    const handleOpenAuth = (mode = 'benefits') => {
        setAuthModalMode(mode);
        setShowAuthModal(true);
    };

    // If authenticated, show the feature directly
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // If user chose to proceed with local engine
    if (userChoice === 'local') {
        return <>{children}</>;
    }

    // Show upgrade prompt
    return (
        <>
            <div className="ai-feature-gate">
                <div className="gate-content">
                    <div className="gate-icon">
                        <Lock size={40} color="var(--electric-blue)" />
                    </div>
                    <h3>{t('auth.ai_locked_title', { feature: featureName })}</h3>
                    <p>{t('auth.ai_locked_desc')}</p>

                    <div className="gate-actions">
                        <button
                            className="premium-btn"
                            onClick={() => handleOpenAuth('benefits')}
                        >
                            <Sparkles size={18} />
                            {t('auth.unlock_ai')}
                        </button>
                        {onProceedWithoutAuth && (
                            <button
                                className="secondary-btn"
                                onClick={() => {
                                    setUserChoice('local');
                                    if (onProceedWithoutAuth) onProceedWithoutAuth();
                                }}
                            >
                                {t('auth.use_basic_mode')}
                            </button>
                        )}
                        <button
                            className="text-btn"
                            onClick={() => handleOpenAuth('signin')}
                        >
                            {t('auth.sign_in')}
                        </button>
                    </div>

                    <p className="gate-note">
                        {t('auth.free_credits_note')}
                    </p>
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                mode={authModalMode}
            />
        </>
    );
};

export default AIFeatureGate;
