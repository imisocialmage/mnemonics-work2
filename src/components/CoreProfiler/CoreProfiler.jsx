import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeToolData } from '../../utils/analysisService';
import AIFeatureGate from '../Auth/AIFeatureGate';
import './CoreProfiler.css';

const CoreProfiler = () => {
    const { t, i18n } = useTranslation();
    const [showModal, setShowModal] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('product');
    const [formData, setFormData] = useState({
        language: i18n.language || 'en',
        name: '',
        description: ''
    });

    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('imi_core_profile');
        if (saved) {
            setProfileData(JSON.parse(saved));
            setShowModal(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStartAnalysis = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description) return;

        setLoading(true);
        setError(null);
        try {
            const result = await analyzeToolData('coreProfiler', {
                name: formData.name,
                description: formData.description,
                language: formData.language
            });

            if (result) {
                setProfileData(result);
                localStorage.setItem('imi_core_profile', JSON.stringify(result));
                setShowModal(false);
            }
        } catch (error) {
            console.error('Core Profiler Analysis failed:', error);
            setError(error.message || 'An unexpected error occurred. Please check your API key.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeToolData('coreProfiler', {
                name: profileData.brand.name,
                description: profileData.brand.description,
                language: formData.language
            });

            if (result) {
                setProfileData(result);
                localStorage.setItem('imi_core_profile', JSON.stringify(result));
            }
        } catch (error) {
            console.error('Regeneration failed:', error);
            setError(error.message || 'Regeneration failed. Please check your API key.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoMode = () => {
        const demoData = {
            brand: {
                name: "Elevate Apparel",
                description: "A premium lifestyle brand dedicated to minimalist design and sustainable production. We empower modern professionals to feel confident and comfortable in their daily attire through high-quality fabrics and timeless silhouettes.",
                fonts: {
                    headers: "Playfair Display",
                    body: "Inter"
                },
                colors: {
                    primary: "#1A202C",
                    secondary: "#E2E8F0"
                },
                keywords: ["Minimalist", "Sustainable", "Premium", "Confident", "Timeless"]
            },
            salesSystem: {
                product: "A subscription-based model offering curated seasonal wardrobes, reducing decision fatigue for busy professionals.",
                reorder: "Exclusive early access to limited edition drops for loyal subscribers and tiered rewards for long-term members.",
                opportunity: "Expanding into home-office essentials to capture the increasing 'work from home' market segment.",
                upsell: "In-cart recommendations for matching accessories and premium garment care kits.",
                team: "Decentralized production units focused on specialized craftsmanship and a high-touch customer success team."
            }
        };
        setProfileData(demoData);
        localStorage.setItem('imi_core_profile', JSON.stringify(demoData));
        setShowModal(false);
    };

    const handleNavigate = (toolId) => {
        window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: toolId }));
    };

    const renderContent = () => {
        if (showModal) {
            return (
                <div className="core-profiler-modal-overlay">
                    <div className="core-profiler-modal">
                        <div className="modal-header">
                            <h2>{t('core_profiler.modal.title')}</h2>
                            <p className="subtitle">{t('core_profiler.subtitle')}</p>
                        </div>

                        <form onSubmit={handleStartAnalysis} className="modal-form">
                            <div className="form-group">
                                <label>{t('core_profiler.modal.language')}</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="modal-input"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{t('core_profiler.modal.name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Acme SaaS"
                                    className="modal-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('core_profiler.modal.description')}</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder={t('core_profiler.modal.placeholder')}
                                    className="modal-textarea"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="error-message-banner">
                                    <p>⚠️ {error}</p>
                                    {error.includes('API key') && (
                                        <small style={{ display: 'block', marginTop: '5px', opacity: 0.8 }}>
                                            Hint: Your API key might be leaked or revoked. Update it in your .env file.
                                        </small>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`submit-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loader-container">
                                        <div className="loader"></div>
                                        {t('advisor.ai.thinking')}
                                    </span>
                                ) : t('core_profiler.modal.submit')}
                            </button>

                            <div className="demo-mode-container">
                                <button
                                    type="button"
                                    onClick={handleDemoMode}
                                    className="demo-mode-btn"
                                >
                                    🧪 Try Demo Mode (Manual Results)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

        if (!profileData) return null;

        return (
            <div className="core-profiler-container">
                <header className="profiler-header">
                    <div className="header-content">
                        <span className="ai-badge">{t('core_profiler.ai_badge')}</span>
                        <h1>{profileData.brand.name}</h1>
                        <p className="brand-desc">{profileData.brand.description}</p>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn outline">{t('core_profiler.actions.save')}</button>
                        <button onClick={() => setShowModal(true)} className="action-btn">{t('core_profiler.actions.regenerate_top')}</button>
                    </div>
                </header>

                <div className="profiler-grid">
                    {/* Left Column: Brand Identity */}
                    <section className="brand-column card">
                        <div className="card-header">
                            <h3>{t('core_profiler.brand.title')}</h3>
                        </div>

                        <div className="brand-section">
                            <label>{t('core_profiler.brand.keywords_label')}</label>
                            <div className="keywords-cloud">
                                {profileData.brand.keywords.map((kw, i) => (
                                    <span key={i} className="keyword-tag">{kw}</span>
                                ))}
                            </div>
                        </div>

                        <div className="brand-section">
                            <label>{t('core_profiler.brand.fonts_label')}</label>
                            <div className="font-pair">
                                <div className="font-item">
                                    <span className="font-name">{profileData.brand.fonts.headers}</span>
                                    <span className="font-type">{t('core_profiler.brand.headers')}</span>
                                </div>
                                <div className="font-item">
                                    <span className="font-name">{profileData.brand.fonts.body}</span>
                                    <span className="font-type">{t('core_profiler.brand.body')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="brand-section">
                            <label>{t('core_profiler.brand.colors_label')}</label>
                            <div className="color-palette">
                                <div className="color-item">
                                    <div
                                        className="color-swatch"
                                        style={{ backgroundColor: profileData.brand.colors.primary }}
                                    ></div>
                                    <span className="color-hex">{profileData.brand.colors.primary}</span>
                                </div>
                                <div className="color-item">
                                    <div
                                        className="color-swatch"
                                        style={{ backgroundColor: profileData.brand.colors.secondary }}
                                    ></div>
                                    <span className="color-hex">{profileData.brand.colors.secondary}</span>
                                </div>
                            </div>
                        </div>

                        <div className="brand-actions-bottom">
                            <button
                                onClick={() => handleNavigate('asset-ai')}
                                className="magic-btn"
                            >
                                {t('core_profiler.actions.build_website')}
                            </button>
                            <button
                                onClick={() => handleNavigate('pitch-master')}
                                className="magic-btn"
                            >
                                {t('core_profiler.actions.build_email')}
                            </button>
                        </div>
                    </section>

                    {/* Right Column: Sales System */}
                    <section className="system-column card">
                        <div className="card-header">
                            <h3>{t('core_profiler.sales_system.title')}</h3>
                            <div className="system-tabs">
                                {Object.keys(profileData.salesSystem).map(tab => (
                                    <button
                                        key={tab}
                                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {t(`core_profiler.sales_system.tabs.${tab}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="tab-content glass-content">
                            <div className="content-text">
                                {profileData.salesSystem[activeTab]}
                            </div>
                        </div>

                        <div className="system-footer">
                            <button
                                onClick={handleRegenerate}
                                className={`regenerate-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? t('advisor.ai.thinking') : t('core_profiler.sales_system.regenerate')}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        );
    };

    return (
        <AIFeatureGate featureName={t('core_profiler.title')}>
            {renderContent()}
        </AIFeatureGate>
    );
};

export default CoreProfiler;
