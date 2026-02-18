import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, Target, Users, Zap, Layout, Save, CheckCircle, Bot, RotateCcw } from 'lucide-react';
import { analyzeToolData } from '../../utils/analysisService';
import { analyzeOffline } from '../../utils/offlineAnalyzer';
import './CoreProfiler.css';

const CoreProfiler = ({ profileIndex, allToolsCompleted }) => {
    const { t, i18n } = useTranslation();
    const [showModal, setShowModal] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('product');
    const [analysisSource, setAnalysisSource] = useState(null); // 'ai' | 'offline' | 'demo'
    const [resetCounter, setResetCounter] = useState(0); // Forces full UI rebuild on reset

    // Helper to get profile-specific keys
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [formData, setFormData] = useState({
        language: i18n.language || 'en',
        name: '',
        description: ''
    });

    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(getProfileKey('imi-compass-data'));
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.brand) {
                    setProfileData(parsed);
                    setAnalysisSource(parsed._meta?.source || 'ai');
                    setShowModal(false);
                } else {
                    console.warn("Found incomplete profile data, resetting.");
                    setProfileData(null);
                    setShowModal(true);
                }
            } catch (e) {
                console.error("Error parsing saved profile:", e);
                setProfileData(null);
                setShowModal(true);
            }
        } else {
            console.log('[CoreProfiler] No saved data found, showing modal');
            setProfileData(null);
            setShowModal(true);
        }
    }, [profileIndex, resetCounter, getProfileKey]);

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
            // Try AI first
            const result = await analyzeToolData('compass_profiler', {
                brandName: formData.name,
                projectDescription: formData.description,
                name: formData.name,
                description: formData.description,
                language: formData.language
            });

            if (result) {
                setProfileData(result);
                setAnalysisSource('ai');
                localStorage.setItem(getProfileKey('imi-compass-data'), JSON.stringify(result));
                setShowModal(false);
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'compassProfiler' }));
            }
        } catch (apiError) {
            console.warn('AI Analysis failed, falling back to offline engine:', apiError.message);
            // Fallback to offline analyzer
            try {
                const offlineResult = analyzeOffline({
                    name: formData.name,
                    description: formData.description,
                    language: formData.language
                });
                setProfileData(offlineResult);
                setAnalysisSource('offline');
                localStorage.setItem(getProfileKey('imi-compass-data'), JSON.stringify(offlineResult));
                setShowModal(false);
                setError(null);
            } catch (offlineError) {
                console.error('Offline analysis also failed:', offlineError);
                setError('Analysis failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Direct reset — no confirmation dialog, instant clear
    const handleDirectReset = () => {
        console.log('[CoreProfiler] handleDirectReset called');
        // 1. Clear localStorage FIRST
        localStorage.removeItem(getProfileKey('imi-compass-data'));
        localStorage.removeItem(getProfileKey('imi_core_profile'));
        console.log('[CoreProfiler] localStorage cleared');
        // 2. Clear all state
        setProfileData(null);
        setAnalysisSource(null);
        setFormData({ language: i18n.language || 'en', name: '', description: '' });
        setError(null);
        setActiveTab('product');
        setShowModal(true);
        // 3. Bump resetCounter to force useEffect to re-run and confirm data is gone
        setResetCounter(c => c + 1);
        console.log('[CoreProfiler] state cleared, modal should be showing');
    };

    // Reset with confirmation
    const handleReset = () => {
        console.log('[CoreProfiler] handleReset called');
        const confirmed = window.confirm('Are you sure you want to start a new analysis? All current data will be cleared.');
        console.log('[CoreProfiler] User confirmed:', confirmed);
        if (confirmed) {
            handleDirectReset();
        }
    };

    const applyToTools = () => {
        if (!profileData) return;
        const tools = profileData.toolData || {};

        // 1. Compass Data (already saved)
        localStorage.setItem(getProfileKey('imi-compass-data'), JSON.stringify(profileData));

        // 2. Brand Data — use toolData.brand when available (offline engine provides this)
        const brandData = {
            industry: tools.brand?.industry || "General",
            targetAudience: tools.brand?.whoTarget || profileData.profiles?.audience?.avatarName || "",
            brandName: tools.brand?.brandName || profileData.brand?.name || "",
            tagline: profileData.profiles?.identity?.archetype || "",
            brandPersonality: tools.brand?.personality || profileData.profiles?.identity?.values || [],
            brandVoice: [],
            competitors: "",
            whatOffer: tools.brand?.whatOffer || profileData.profiles?.offer?.coreOffer || "",
            whoTarget: tools.brand?.whoTarget || profileData.profiles?.audience?.avatarName || "",
            howAccessible: tools.brand?.howAccessible || profileData.profiles?.execution?.channel || "",
            scores: null,
            overallScore: 0
        };
        localStorage.setItem(getProfileKey('imi-brand-data'), JSON.stringify(brandData));

        // 3. Product Data — use toolData.product for richer pre-fill
        const productData = {
            productName: tools.product?.productName || profileData.brand?.name || "",
            typicalUsers: tools.product?.typicalUsers || profileData.profiles?.audience?.avatarName || "",
            problemSolved: tools.product?.problemSolved || profileData.profiles?.audience?.primaryPain || "",
            topFeatures: tools.product?.topFeatures || "",
            differentiator: tools.product?.differentiator || profileData.profiles?.offer?.uvp || "",
            tangibleBenefit: tools.product?.tangibleBenefit || "",
            emotionalBenefit: "",
            priceRange: "mid-range",
            deliveryFormat: "digital",
            aiResults: null
        };
        localStorage.setItem(getProfileKey('imi-product-data'), JSON.stringify(productData));

        // 4. Prospect Data — use toolData.prospect for accurate B2B/B2C
        const prospectData = {
            prospectType: tools.prospect?.prospectType || "b2b",
            industry: tools.prospect?.industry || tools.brand?.industry || "general",
            targetDescription: tools.prospect?.targetDescription || profileData.profiles?.audience?.avatarName || "",
            painPoints: tools.prospect?.painPoints || profileData.profiles?.audience?.primaryPain || "",
            values: tools.prospect?.values || "",
            goals: "",
            aiResults: null
        };
        localStorage.setItem(getProfileKey('imi-prospect-data'), JSON.stringify(prospectData));

        // 5. Strategic Advisor Context
        const advisorContext = {
            brand: brandData,
            product: productData,
            prospect: prospectData,
            compass: profileData.profiles,
            optimization: profileData.optimizationTips
        };
        localStorage.setItem(getProfileKey('imi-advisor-context'), JSON.stringify(advisorContext));

        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
        window.dispatchEvent(new CustomEvent('compass-data-updated'));

        // Mark these tools as completed since they are now pre-filled
        const toolsToComplete = ['brandEvaluator', 'productProfiler', 'prospectProfiler'];
        toolsToComplete.forEach(tool => {
            window.dispatchEvent(new CustomEvent('tool-completed', { detail: tool }));
        });
    };

    const handleDemoMode = () => {
        // Use the offline analyzer with a rich demo description
        const demoResult = analyzeOffline({
            name: 'Elevate Apparel',
            description: 'A premium lifestyle brand dedicated to minimalist design and sustainable fashion production. We help conscious professionals build effortless wardrobes through subscription-based seasonal collections made with zero-waste manufacturing. Our target audience is style-conscious individuals aged 28-45 who value quality over quantity and want to look good while doing good for the environment. We differentiate through transparent supply chains and exclusive limited-edition drops.',
            language: formData.language || 'en'
        });
        setProfileData(demoResult);
        setAnalysisSource('demo');
        localStorage.setItem(getProfileKey('imi-compass-data'), JSON.stringify(demoResult));
        setShowModal(false);
        // Mark tool as completed
        window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'compassProfiler' }));
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
                            <h2>{t('compass_profiler.title') || "Compass Profiler"}</h2>
                            <p className="subtitle">{t('compass_profiler.input_subtitle') || "Tell us about your business, and we'll map out your entire strategy."}</p>
                        </div>
                        <form onSubmit={handleStartAnalysis} className="modal-form">
                            <div className="form-group">
                                <label>{t('core_profiler.modal.language')}</label>
                                <select name="language" value={formData.language} onChange={handleInputChange} className="modal-input">
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t('core_profiler.modal.name')}</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Acme Corp" className="modal-input" required />
                            </div>
                            <div className="form-group">
                                <label>Detailed Business Description (Mega-Input)</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your business in detail here. Who are you? What do you sell? Who is it for? What makes you different? (The more detail, the better the analysis)" className="modal-textarea" required rows={8} />
                            </div>
                            {error && <div className="error-message-banner"><p>⚠️ {error}</p></div>}
                            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                                {loading ? <span className="loader-container"><div className="loader"></div>{t('advisor.ai.thinking')}</span> : <><Sparkles size={20} /> Analyze & Generate Compass</>}
                            </button>
                            <div className="demo-mode-container">
                                <button type="button" onClick={handleDemoMode} className="demo-mode-btn">🧪 Try Demo Mode</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

        if (!profileData || !profileData.brand) return null;

        return (
            <div className="core-profiler-container">
                <header className="profiler-header">
                    <div className="header-content">
                        <span className="ai-badge">{analysisSource === 'offline' ? '⚡ Intelligence Engine V2' : analysisSource === 'demo' ? '🧪 Demo Mode' : '✨ Compass AI'}</span>
                        <h1>{profileData.brand?.name || "Untitled Brand"}</h1>
                        <p className="brand-desc">{profileData.brand?.description || "No description available."}</p>
                    </div>
                    <div className="header-actions">
                        {profileData.toolData && (
                            <button className="action-btn success-btn" onClick={applyToTools}>
                                {showSaveSuccess ? <CheckCircle size={18} /> : <Save size={18} />}
                                {showSaveSuccess ? "Data Applied!" : "Apply to All Tools"}
                            </button>
                        )}
                        <button onClick={handleDirectReset} className="action-btn"><RotateCcw size={16} /> Reset Tool</button>
                        <button onClick={handleReset} className="action-btn">{t('core_profiler.actions.new_analysis') || "New Analysis"}</button>
                    </div>
                </header>

                {/* NEW: Strategic Scores & Rationale */}
                <div className="strategic-overview-section mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {profileData.scores && Object.entries(profileData.scores).map(([key, value]) => (
                            <div key={key} className="score-card card p-6">
                                <div className="score-header mb-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">{key}</h4>
                                    <span className="score-value text-3xl font-bold text-indigo-400">{Math.round(value)}%</span>
                                </div>
                                <div className="score-bar-bg h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="score-bar-fill h-full bg-indigo-500 rounded-full" style={{ width: `${value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {profileData.rationale && (
                        <div className="rationale-box card p-6 border-l-4 border-indigo-500 bg-indigo-500/5">
                            <h3 className="flex items-center gap-2 text-indigo-300 font-bold mb-2">
                                <Bot size={20} /> Strategic Rationale
                            </h3>
                            <p className="text-white/80 leading-relaxed italic">"{profileData.rationale}"</p>
                        </div>
                    )}
                </div>

                {/* NEW: Optimization Tips */}
                {profileData.optimizationTips && profileData.optimizationTips.length > 0 && (
                    <div className="optimization-section card mb-8">
                        <div className="card-header">
                            <h3><Sparkles size={18} style={{ display: 'inline', marginRight: '8px', color: '#F59E0B' }} />Optimization Tips</h3>
                        </div>
                        <div className="tips-content" style={{ padding: '1.5rem' }}>
                            <ul className="tips-list">
                                {profileData.optimizationTips.map((tip, idx) => (
                                    <li key={idx} className="tip-item">{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* NEW: 4-Profile Compass Display */}
                {profileData.profiles && (
                    <div className="compass-grid-section">
                        <div className="profile-card">
                            <div className="card-header color-1"><Zap size={20} /> <h3>Identity</h3></div>
                            <div className="card-content">
                                <p><strong>Archetype:</strong> {profileData.profiles.identity.archetype}</p>
                                <p><strong>Voice:</strong> {profileData.profiles.identity.voice}</p>
                                {profileData.profiles.identity.shadow && (
                                    <p className="mt-2 text-xs text-red-300/60"><strong>Shadow:</strong> {profileData.profiles.identity.shadow}</p>
                                )}
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className="card-header color-2"><Target size={20} /> <h3>Offer</h3></div>
                            <div className="card-content">
                                <p><strong>Offer:</strong> {profileData.profiles.offer.coreOffer}</p>
                                <p><strong>UVP:</strong> {profileData.profiles.offer.uvp}</p>
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className="card-header color-3"><Users size={20} /> <h3>Audience</h3></div>
                            <div className="card-content">
                                <p><strong>Avatar:</strong> {profileData.profiles.audience.avatarName}</p>
                                <p><strong>Desire:</strong> {profileData.profiles.audience.coreDesire}</p>
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className="card-header color-4"><Layout size={20} /> <h3>Execution</h3></div>
                            <div className="card-content">
                                <p><strong>Channel:</strong> {profileData.profiles.execution.channel}</p>
                                <p><strong>Next:</strong> {profileData.profiles.execution.immediateAction}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="profiler-grid">
                    {/* Left Column: Brand Identity (Legacy) */}
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
                                <div className="font-item"><span className="font-name">{profileData.brand.fonts.headers}</span><span className="font-type">{t('core_profiler.brand.headers')}</span></div>
                                <div className="font-item"><span className="font-name">{profileData.brand.fonts.body}</span><span className="font-type">{t('core_profiler.brand.body')}</span></div>
                            </div>
                        </div>
                        <div className="brand-section">
                            <label>{t('core_profiler.brand.colors_label')}</label>
                            <div className="color-palette">
                                <div className="color-item"><div className="color-swatch" style={{ backgroundColor: profileData.brand.colors.primary }}></div><span className="color-hex">{profileData.brand.colors.primary}</span></div>
                                <div className="color-item"><div className="color-swatch" style={{ backgroundColor: profileData.brand.colors.secondary }}></div><span className="color-hex">{profileData.brand.colors.secondary}</span></div>
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Sales System (Legacy) */}
                    <section className="system-column card">
                        <div className="card-header">
                            <h3>{t('core_profiler.sales_system.title')}</h3>
                            <div className="system-tabs">
                                {profileData.salesSystem && Object.keys(profileData.salesSystem).map(tab => (
                                    <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                        {t(`core_profiler.sales_system.tabs.${tab}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="tab-content glass-content">
                            <div className="content-text">{profileData.salesSystem?.[activeTab]}</div>
                        </div>
                        <div className="system-footer">
                            {/* Partial regeneration not yet supported */}
                        </div>
                    </section>
                </div>

                {/* NEW: Strategic Roadmap Navigation */}
                <div className="roadmap-section">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Your Strategic Roadmap</h2>
                    <div className="roadmap-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <button
                            className="roadmap-card card-purple"
                            onClick={() => { applyToTools(); handleNavigate('brand-evaluator'); }}
                        >
                            <div className="icon-wrapper">
                                <Zap size={20} />
                            </div>
                            <div className="text-wrapper">
                                <h4 className="card-title">Refine Identity</h4>
                                <p className="card-subtitle">Brand Evaluator</p>
                            </div>
                        </button>

                        <button
                            className="roadmap-card card-blue"
                            onClick={() => { applyToTools(); handleNavigate('product-profiler'); }}
                        >
                            <div className="icon-wrapper">
                                <Target size={20} />
                            </div>
                            <div className="text-wrapper">
                                <h4 className="card-title">Deep Dive Offer</h4>
                                <p className="card-subtitle">Product Profiler</p>
                            </div>
                        </button>

                        <button
                            className="roadmap-card card-green"
                            onClick={() => { applyToTools(); handleNavigate('prospect-profiler'); }}
                        >
                            <div className="icon-wrapper">
                                <Users size={20} />
                            </div>
                            <div className="text-wrapper">
                                <h4 className="card-title">Analyze Audience</h4>
                                <p className="card-subtitle">Prospect Profiler</p>
                            </div>
                        </button>

                        <button
                            className="roadmap-card card-pink"
                            onClick={() => { applyToTools(); handleNavigate('asset-ai'); }}
                        >
                            <div className="icon-wrapper">
                                <Layout size={20} />
                            </div>
                            <div className="text-wrapper">
                                <h4 className="card-title">Generate Visuals</h4>
                                <p className="card-subtitle">Asset AI</p>
                            </div>
                        </button>

                        <button
                            className={`roadmap-card card-amber ${!allToolsCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}
                            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'pitch-master' }))}
                        >
                            <div className="icon-wrapper">
                                <Bot size={20} />
                            </div>
                            <div className="text-wrapper">
                                <h4 className="card-title">Craft Messaging</h4>
                                <p className="card-subtitle">{allToolsCompleted ? 'Pitch Master' : 'Locked'}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return renderContent();
};

export default CoreProfiler;
