import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useTranslation } from 'react-i18next';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'benefits' }) => {
    const { t } = useTranslation();
    const { signUp, signIn, resendConfirmation } = useAuth();
    const [mode, setMode] = useState(initialMode); // 'benefits', 'signup', 'login'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleResend = async () => {
        try {
            setLoading(true);
            await resendConfirmation(email);
            alert("Confirmation email resent! Please check your inbox.");
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                await signUp(email, password);
                alert(t('auth.signup_success'));
                onClose();
            } else if (mode === 'login') {
                await signIn(email, password);
                onClose();
            }
        } catch (err) {
            setError(err.message || t('auth.error_generic'));
        } finally {
            setLoading(false);
        }
    };

    const renderBenefits = () => (
        <div className="auth-benefits">
            <div className="auth-icon">
                <Sparkles size={48} color="var(--electric-blue)" />
            </div>
            <h2>{t('auth.unlock_title')}</h2>
            <p className="auth-subtitle">{t('auth.unlock_subtitle')}</p>

            <div className="benefits-list">
                <div className="benefit-item">
                    <Sparkles size={20} className="benefit-icon" />
                    <div>
                        <h4>{t('auth.benefit_1_title')}</h4>
                        <p>{t('auth.benefit_1_desc')}</p>
                    </div>
                </div>
                <div className="benefit-item">
                    <Sparkles size={20} className="benefit-icon" />
                    <div>
                        <h4>{t('auth.benefit_2_title')}</h4>
                        <p>{t('auth.benefit_2_desc')}</p>
                    </div>
                </div>
                <div className="benefit-item">
                    <Sparkles size={20} className="benefit-icon" />
                    <div>
                        <h4>{t('auth.benefit_3_title')}</h4>
                        <p>{t('auth.benefit_3_desc')}</p>
                    </div>
                </div>
            </div>

            <div className="auth-actions">
                <button className="premium-btn" onClick={() => setMode('signup')}>
                    {t('auth.get_started')}
                </button>
                <button className="text-btn" onClick={() => setMode('login')}>
                    {t('auth.already_have_account')}
                </button>
            </div>

            <button className="continue-without" onClick={onClose}>
                {t('auth.continue_without')}
            </button>
        </div>
    );

    const renderForm = () => (
        <div className="auth-form-container">
            <h2>{mode === 'signup' ? t('auth.create_account') : t('auth.welcome_back')}</h2>
            <p className="auth-subtitle">
                {mode === 'signup' ? t('auth.signup_subtitle') : t('auth.login_subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>
                        <Mail size={16} />
                        {t('auth.email')}
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.email_placeholder')}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        <Lock size={16} />
                        {t('auth.password')}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.password_placeholder')}
                        minLength={6}
                        required
                    />
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <div>
                            {error}
                            {error.toLowerCase().includes('email not confirmed') && (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    style={{
                                        display: 'block',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--electric-blue)',
                                        textDecoration: 'underline',
                                        marginTop: '5px',
                                        cursor: 'pointer',
                                        fontSize: '0.9em',
                                        padding: 0
                                    }}
                                >
                                    {t('auth.resend_confirmation') || "Resend Confirmation Email"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <button type="submit" className="premium-btn" disabled={loading}>
                    {loading ? t('auth.loading') : mode === 'signup' ? t('auth.sign_up') : t('auth.sign_in')}
                </button>
            </form>

            <div className="auth-switch">
                {mode === 'signup' ? (
                    <p>
                        {t('auth.already_have_account')}{' '}
                        <button onClick={() => setMode('login')}>{t('auth.sign_in')}</button>
                    </p>
                ) : (
                    <p>
                        {t('auth.no_account')}{' '}
                        <button onClick={() => setMode('signup')}>{t('auth.sign_up')}</button>
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X />
                </button>
                {mode === 'benefits' ? renderBenefits() : renderForm()}
            </div>
        </div>
    );
};

export default AuthModal;
