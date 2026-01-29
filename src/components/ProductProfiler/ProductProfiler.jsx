import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analyzeToolData } from '../../utils/analysisService';
import '../shared-tool-styles.css';

const ProductProfiler = ({ profileIndex }) => {
    const { t } = useTranslation();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [currentStep, setCurrentStep] = useState(1);
    const [productData, setProductData] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-product-data'));
        if (saved) return JSON.parse(saved);

        // Fallback to compass or brand data
        const compass = JSON.parse(localStorage.getItem(getProfileKey('imi-compass-data')) || '{}');
        const brand = JSON.parse(localStorage.getItem(getProfileKey('imi-brand-data')) || '{}');
        return {
            productName: compass.brandName || brand.brandName || '',
            typicalUsers: compass.audience || brand.targetAudience || '',
            problemSolved: compass.challenge || '',
            aiResults: null
        };
    });

    const [isLoading, setIsLoading] = useState(false);

    // Save product data to localStorage
    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-product-data'), JSON.stringify(productData));
    }, [productData, getProfileKey]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const totalSteps = 5;

    const updateField = (field, value) => {
        setProductData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = () => {
        const requiredFields = {
            1: ['productName', 'problemSolved'],
            2: ['topFeatures', 'differentiator'],
            3: ['tangibleBenefit'],
            4: ['priceRange', 'deliveryFormat', 'typicalUsers']
        };

        const fields = requiredFields[currentStep] || [];
        return fields.every(field => productData[field]?.trim());
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            displayMessage(t('common.required_fields'));
        }
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateAnalysis = async () => {
        if (validateStep()) {
            setIsLoading(true);
            try {
                const results = await analyzeToolData('productProfiler', productData, t('common.lang_code'));
                console.log("ProductProfiler AI Results:", results);
                setProductData(prev => ({ ...prev, aiResults: results }));
                setCurrentStep(5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'productProfiler' }));
            } catch (error) {
                console.error("AI Analysis failed:", error);
                displayMessage(t('common.error_occurred'));
                // Just move to step 5, fallback helper functions are already there
                setCurrentStep(5);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const displayMessage = (msg) => {
        setMessage(msg);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    // Helper functions from original
    const extractAudience = (users) => {
        if (!users) return 'your target audience';
        // Just return the first few words of the actual input instead of a rigid categorizer
        return users.split(' ').slice(0, 5).join(' ') + (users.split(' ').length > 5 ? '...' : '');
    };

    const extractCoreResult = (benefits) => {
        if (!benefits) return 'meaningful results';
        return benefits.split(' ').slice(0, 5).join(' ') + (benefits.split(' ').length > 5 ? '...' : '');
    };

    const extractDifferentiator = (unique) => {
        if (!unique) return 'a unique professional approach';
        return unique.split(' ').slice(0, 5).join(' ') + (unique.split(' ').length > 5 ? '...' : '');
    };

    const identifyNiches = () => {
        const niches = [];
        const users = productData.typicalUsers?.toLowerCase() || '';

        // Only add specific niches if they're explicitly mentioned
        if (users.includes('coach')) niches.push(t('product_profiler.analysis.niches.coaches'));
        if (users.includes('freelancer')) niches.push(t('product_profiler.analysis.niches.freelance'));
        if (users.includes('small business')) niches.push(t('product_profiler.analysis.niches.smb'));

        // Generic fallback that doesn't assume entrepreneurship
        if (niches.length === 0) {
            niches.push(t('product_profiler.analysis.niches.pro'));
        }

        return niches.slice(0, 4);
    };

    const generateDemographics = () => {
        const price = productData.priceRange || 'mid-range';
        const demographics = [];

        if (price === 'luxury' || price === 'premium') {
            demographics.push(t('product_profiler.analysis.demographics.income_luxury'));
        } else if (price === 'budget') {
            demographics.push(t('product_profiler.analysis.demographics.income_budget'));
        } else {
            demographics.push(t('product_profiler.analysis.demographics.income_mid'));
        }

        demographics.push(t('product_profiler.analysis.demographics.age'));
        demographics.push(t('product_profiler.analysis.demographics.location'));
        demographics.push(t('product_profiler.analysis.demographics.work_style'));

        return demographics;
    };

    const generatePsychographics = () => {
        const psychographics = [];
        const emotional = productData.emotionalBenefit?.toLowerCase() || '';

        if (emotional.includes('confidence')) psychographics.push(t('product_profiler.analysis.psychographics.confidence'));
        if (emotional.includes('freedom')) psychographics.push(t('product_profiler.analysis.psychographics.freedom'));
        if (emotional.includes('peace')) psychographics.push(t('product_profiler.analysis.psychographics.peace'));

        psychographics.push(t('product_profiler.analysis.psychographics.motivation'));
        psychographics.push(t('product_profiler.analysis.psychographics.values'));

        return psychographics;
    };

    const generateBuyingTriggers = () => {
        return t('product_profiler.analysis.triggers', { returnObjects: true });
    };

    const generateInterestHooks = () => {
        const problem = productData.problemSolved || t('common.common_challenges');
        const name = productData.productName || t('common.this_solution');

        const hooks = t('product_profiler.analysis.hooks', { returnObjects: true });
        return hooks.map(hook => {
            let h = hook.replace('{{problem}}', problem.split(' ').slice(0, 3).join(' '));
            h = h.replace('{{name}}', name);
            return h;
        });
    };

    const generateIntentSignals = () => {
        return t('product_profiler.analysis.signals', { returnObjects: true });
    };

    const generateCTAs = () => {
        const format = productData.deliveryFormat || 'default';
        const name = productData.productName || t('common.this_solution');

        let ctas = t(`product_profiler.analysis.ctas.${format}`, { returnObjects: true });
        if (!Array.isArray(ctas)) {
            ctas = t('product_profiler.analysis.ctas.default', { returnObjects: true });
        }
        return ctas.map(cta => cta.replace('{{name}}', name));
    };

    const startNewAnalysis = () => {
        if (window.confirm(t('tracker.ui.delete_confirm_all'))) {
            setProductData({});
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayMessage(t('common.success'));
        }
    };

    const downloadResults = () => {
        // Simplified download - would generate full HTML in production
        displayMessage('Download feature coming soon!');
    };

    const renderProgressBar = () => (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {['foundation', 'features', 'benefits', 'delivery', 'analysis'].map((key, idx) => (
                <div key={idx} className={`step ${currentStep === idx + 1 ? 'active' : ''} ${currentStep > idx + 1 ? 'completed' : ''}`}>
                    <div className="step-number">{idx + 1}</div>
                    <span className="step-label">{t(`product_profiler.steps.${key}`)}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="tool-wrapper">
            {showMessage && <div className="success-message">{message}</div>}

            <header>
                <div className="container">
                    <div className="header-content">
                        <div className="brand-section">
                            <div className="logo-container">
                                <img src="/assets/imi-logo.png" alt="IMI Logo" />
                            </div>
                            <div className="brand-text">
                                <div className="brand-name">IMI CORE</div>
                                <div className="brand-tagline">I Make Image</div>
                            </div>
                        </div>
                        <h1>{t('product_profiler.title')}</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}

                {/* Step 1 */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('product_profiler.steps.foundation')}</h2>
                        <p className="section-subtitle">{t('product_profiler.subtitle')}</p>

                        <div className="form-group">
                            <label>{t('form.brand_name_label')}</label>
                            <input type="text" value={productData.productName || ''} onChange={(e) => updateField('productName', e.target.value)} placeholder={t('form.brand_name_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('form.challenge_label')} *</label>
                            <textarea value={productData.problemSolved || ''} onChange={(e) => updateField('problemSolved', e.target.value)} placeholder={t('form.challenge_placeholder')} />
                        </div>

                        <div className="navigation-buttons">
                            <div></div>
                            <button className="btn" onClick={nextStep}>{t('common.next')}: {t('product_profiler.steps.features')}</button>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('product_profiler.steps.features')}</h2>
                        <p className="section-subtitle">{t('product_profiler.steps.features')}</p>

                        <div className="form-group">
                            <label>{t('product_profiler.questions.features_label')} *</label>
                            <textarea value={productData.topFeatures || ''} onChange={(e) => updateField('topFeatures', e.target.value)} placeholder={t('product_profiler.questions.features_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('product_profiler.questions.differentiator_label')} *</label>
                            <textarea value={productData.differentiator || ''} onChange={(e) => updateField('differentiator', e.target.value)} placeholder={t('product_profiler.questions.differentiator_placeholder')} />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                            <button className="btn" onClick={nextStep}>{t('common.next')}: {t('product_profiler.steps.benefits')}</button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('product_profiler.steps.benefits')}</h2>
                        <p className="section-subtitle">{t('product_profiler.steps.benefits')}</p>

                        <div className="form-group">
                            <label>{t('product_profiler.questions.tangible_label')} *</label>
                            <textarea value={productData.tangibleBenefit || ''} onChange={(e) => updateField('tangibleBenefit', e.target.value)} placeholder={t('product_profiler.questions.tangible_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('product_profiler.questions.emotional_label')}</label>
                            <textarea value={productData.emotionalBenefit || ''} onChange={(e) => updateField('emotionalBenefit', e.target.value)} placeholder={t('product_profiler.questions.emotional_placeholder')} />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                            <button className="btn" onClick={nextStep}>{t('common.next')}: {t('product_profiler.steps.delivery')}</button>
                        </div>
                    </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('product_profiler.steps.delivery')}</h2>
                        <p className="section-subtitle">{t('product_profiler.steps.delivery')}</p>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>{t('product_profiler.questions.price_label')} *</label>
                                <select value={productData.priceRange || ''} onChange={(e) => updateField('priceRange', e.target.value)}>
                                    <option value="">{t('common.select')}</option>
                                    <option value="budget">Budget (Low-cost/Affordable)</option>
                                    <option value="mid-range">Mid-Range (Fair value)</option>
                                    <option value="premium">Premium (High-value)</option>
                                    <option value="luxury">Luxury (Exclusive/Elite)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{t('product_profiler.questions.delivery_label')} *</label>
                                <select value={productData.deliveryFormat || ''} onChange={(e) => updateField('deliveryFormat', e.target.value)}>
                                    <option value="">{t('common.select')}</option>
                                    <option value="digital">Digital Product</option>
                                    <option value="saas">SaaS/Subscription</option>
                                    <option value="service">Service/Consulting</option>
                                    <option value="physical">Physical Product</option>
                                    <option value="hybrid">Hybrid (Multiple formats)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('product_profiler.questions.users_label')} *</label>
                            <textarea value={productData.typicalUsers || ''} onChange={(e) => updateField('typicalUsers', e.target.value)} placeholder={t('product_profiler.questions.users_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('product_profiler.questions.context_label')}</label>
                            <textarea value={productData.usageContext || ''} onChange={(e) => updateField('usageContext', e.target.value)} placeholder={t('product_profiler.questions.context_placeholder')} />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                            <button className="btn" onClick={generateAnalysis} disabled={isLoading}>
                                {isLoading ? t('common.generating') : t('common.generate')}
                            </button>
                        </div>

                        {isLoading && (
                            <div className="loading-overlay">
                                <div className="loader"></div>
                                <p>{t('common.analyzing_product')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 5 - Results */}
                {currentStep === 5 && (
                    <div className="form-section">
                        <div className="ai-badge">AI-Powered Product Analysis</div>
                        <h2 className="section-title">Your Product Profile & Target Market</h2>
                        <p className="section-subtitle">Comprehensive analysis with ideal customer avatar and positioning strategy</p>

                        <div className="results-section">
                            <h3>Unique Value Proposition (UVP)</h3>
                            <div style={{ background: 'linear-gradient(135deg, #f8f9fa, #e3f2fd)', border: '3px solid var(--electric-blue)', padding: '30px', borderRadius: '15px', textAlign: 'center', fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.8' }}>
                                {productData.aiResults?.uvp ? (
                                    `"${productData.aiResults.uvp}"`
                                ) : (
                                    `"${productData.productName || 'This product'} helps ${extractAudience(productData.typicalUsers)} achieve ${extractCoreResult(productData.tangibleBenefit)} by ${extractDifferentiator(productData.differentiator)}."`
                                )}
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Target Niche Options</h3>
                            <div className="analysis-card">
                                <h4>Recommended Target Niches</h4>
                                <ul>
                                    {(productData.aiResults?.targetNiches || identifyNiches()).map((niche, idx) => (
                                        <li key={idx}>✓ {niche}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Ideal Client Avatar Profile</h3>
                            <div className="grid-3">
                                <div className="analysis-card">
                                    <h4>Demographics</h4>
                                    <ul>
                                        {(productData.aiResults?.avatars?.[0]?.demographics || generateDemographics()).map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="analysis-card">
                                    <h4>Psychographics</h4>
                                    <ul>
                                        {productData.aiResults?.avatars?.[0]?.description ? (
                                            <>
                                                <li style={{ fontWeight: '500', marginBottom: '10px' }}>{productData.aiResults.avatars[0].role}</li>
                                                <li>{productData.aiResults.avatars[0].description}</li>
                                                {productData.aiResults.avatars[0].pains?.slice(0, 2).map((pain, pidx) => (
                                                    <li key={`pain-${pidx}`} style={{ color: 'var(--coral-red)', fontSize: '0.9rem' }}>• {pain}</li>
                                                ))}
                                            </>
                                        ) : (
                                            generatePsychographics().map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                                <div className="analysis-card">
                                    <h4>Buying Triggers</h4>
                                    <ul>
                                        {(productData.aiResults?.avatars?.[0]?.buyingTriggers || generateBuyingTriggers()).map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Messaging & Marketing Suggestions</h3>
                            <div className="analysis-card">
                                <h4>Interest Hooks</h4>
                                <ul>
                                    {(productData.aiResults?.marketing?.interestHooks || generateInterestHooks()).map((hook, idx) => (
                                        <li key={idx}>• "{hook}"</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="analysis-card">
                                <h4>Intent Signals</h4>
                                <ul>
                                    {(productData.aiResults?.marketing?.intentSignals || generateIntentSignals()).map((signal, idx) => (
                                        <li key={idx}>• {signal}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="analysis-card">
                                <h4>Call-to-Action Ideas</h4>
                                <ul>
                                    {(productData.aiResults?.marketing?.ctas || generateCTAs()).map((cta, idx) => (
                                        <li key={idx}>• "{cta}"</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Next Step CTA */}
                        <div className="next-step-cta" style={{ marginTop: '40px' }}>
                            <div className="cta-header">
                                <h3>💼 Know Your Ideal Prospect</h3>
                                <p>Your product is defined. Now identify and understand your perfect customer.</p>
                            </div>
                            <div className="cta-content">
                                <div className="cta-info">
                                    <h4>Profile Your Prospects</h4>
                                    <p>Use the <strong>Prospect Profiler</strong> to build advanced prospect intelligence with AI-generated connection messages tailored to different personality types and decision-making triggers.</p>
                                    <ul className="cta-benefits">
                                        <li>✓ Deep personality analysis</li>
                                        <li>✓ 5 AI-generated connection messages</li>
                                        <li>✓ Rated messaging strategies</li>
                                        <li>✓ Decision-making triggers</li>
                                    </ul>
                                </div>
                                <button
                                    className="cta-button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'prospect-profiler' }))}
                                >
                                    Profile Your Prospects <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button className="btn btn-secondary" onClick={startNewAnalysis}>New Analysis</button>
                                <button className="btn" onClick={downloadResults}>Download Results</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductProfiler;
