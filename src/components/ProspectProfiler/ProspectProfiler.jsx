import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../Auth/AuthProvider';
import { analyzeToolData } from '../../utils/analysisService';
import {
    generateIntelligentMessage,
    determinePersonalityType,
    generateStrategicAngle
} from '../../utils/prospectIntelligence';
import '../shared-tool-styles.css';

const ProspectProfiler = ({ profileIndex }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [currentStep, setCurrentStep] = useState(1);
    const [prospectData, setProspectData] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-prospect-data'));
        if (saved) return JSON.parse(saved);

        // Fallback to compass data
        const compass = JSON.parse(localStorage.getItem(getProfileKey('imi-compass-data')) || '{}');
        return {
            prospectType: 'b2b', // Default to B2B
            industry: '',
            targetDescription: compass.audience || '',
            painPoints: compass.challenge || '',
            aiResults: null
        };
    });

    const [isLoading, setIsLoading] = useState(false);

    // Save prospect data to localStorage
    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-prospect-data'), JSON.stringify(prospectData));
    }, [prospectData, getProfileKey]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const totalSteps = 5;

    const updateField = (field, value) => {
        setProspectData(prev => ({ ...prev, [field]: value }));
    };

    const toggleCheckbox = (field, value) => {
        setProspectData(prev => {
            const current = prev[field] || [];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const validateStep = () => {
        const requiredFields = {
            1: ['industry', 'targetDescription'],
            2: prospectData.prospectType === 'b2b' ? ['jobTitle', 'painPoints'] : ['painPoints'], // B2C doesn't require lifestyle
            3: ['values'],
            4: ['contentConsumption']
        };

        const fields = requiredFields[currentStep] || [];
        return fields.every(field => prospectData[field]?.trim?.());
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

            if (!isAuthenticated) {
                // Skip API for guests and use local fallback immediately
                generateMessages();
                setCurrentStep(5);
                setIsLoading(false);
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'prospectProfiler' }));
                return;
            }

            try {
                // Get product and brand context for better personalization
                const product = JSON.parse(localStorage.getItem(getProfileKey('imi-product-data')) || '{}');
                const brand = JSON.parse(localStorage.getItem(getProfileKey('imi-brand-data')) || '{}');

                const context = {
                    ...prospectData,
                    productName: product.productName,
                    productUVP: product.aiResults?.uvp || product.tangibleBenefit,
                    brandTone: brand.brandVoice
                };

                const results = await analyzeToolData('prospectProfiler', context, t('common.lang_code'));
                setProspectData(prev => ({ ...prev, aiResults: results }));
                setMessages(results.messages);

                setCurrentStep(5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'prospectProfiler' }));
            } catch (error) {
                console.error("AI Analysis failed:", error);
                displayMessage(t('common.error_occurred'));
                // Fallback to local logic
                generateMessages();
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

    const generateMessages = () => {
        const messageTypes = ['authority', 'curiosity', 'data_driven', 'connection', 'pain_point'];
        const generated = messageTypes.map(type => ({
            title: getMessageTitle(type),
            content: generateDynamicMessage(type),
            ratings: calculateDynamicRatings(type)
        }));
        setMessages(generated);
    };

    const getMessageTitle = (type) => {
        return t(`prospect_profiler.titles.${type}`);
    };

    const generateDynamicMessage = (type) => {
        // Get product context for better personalization
        const product = JSON.parse(localStorage.getItem(getProfileKey('imi-product-data')) || '{}');

        // Use intelligent message generation
        const intelligentContent = generateIntelligentMessage(type, prospectData, product);

        // Wrap in email format
        const firstName = t('prospect_profiler.analysis.messages.first_name_placeholder');
        const yourName = t('prospect_profiler.analysis.messages.name_placeholder');
        const regards = t('prospect_profiler.analysis.messages.regards');

        return `Hi ${firstName},<br><br>${intelligentContent}<br><br>${regards}<br>${yourName}`;
    };

    const calculateDynamicRatings = (type) => {
        // Enhanced ratings based on prospect psychographics
        const baseRatings = {
            authority: { clarity: 8, relevance: 8, distinctiveness: 9, memorability: 8, scalability: 7 },
            curiosity: { clarity: 7, relevance: 9, distinctiveness: 9, memorability: 9, scalability: 8 },
            data_driven: { clarity: 9, relevance: 8, distinctiveness: 7, memorability: 7, scalability: 9 },
            connection: { clarity: 8, relevance: 9, distinctiveness: 8, memorability: 8, scalability: 6 },
            pain_point: { clarity: 9, relevance: 9, distinctiveness: 8, memorability: 8, scalability: 8 }
        };

        // Adjust ratings based on prospect data
        const ratings = { ...baseRatings[type] };

        // Boost relevance if we have strong psychographic data
        if (prospectData.emotionalDrivers?.length > 2 || prospectData.purchaseMotivations?.length > 2) {
            ratings.relevance = Math.min(10, ratings.relevance + 1);
            ratings.distinctiveness = Math.min(10, ratings.distinctiveness + 1);
        }

        // Boost clarity if decision style is defined
        if (prospectData.decisionStyle) {
            ratings.clarity = Math.min(10, ratings.clarity + 1);
        }

        return ratings;
    };

    const calculateOverallScore = (ratings) => {
        const scores = Object.values(ratings);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return Math.round(average * 10) / 10;
    };

    const getPersonalityType = () => {
        // Use intelligent personality determination
        return determinePersonalityType(prospectData);
    };

    const startNewAnalysis = () => {
        if (window.confirm(t('tracker.ui.delete_confirm_all'))) {
            setProspectData({});
            setMessages([]);
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayMessage(t('common.success'));
        }
    };

    const renderProgressBar = () => (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {['market', 'pains', 'values', 'behavior', 'analysis'].map((key, idx) => (
                <div key={idx} className={`step ${currentStep === idx + 1 ? 'active' : ''} ${currentStep > idx + 1 ? 'completed' : ''}`}>
                    <div className="step-number">{idx + 1}</div>
                    <span className="step-label">{t(`prospect_profiler.steps.${key}`)}</span>
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
                        <h1>{t('prospect_profiler.title')}</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}

                {/* Step 1 */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('prospect_profiler.steps.market')}</h2>
                        <p className="section-subtitle">{t('prospect_profiler.subtitle')}</p>

                        {/* Prospect Type Selector */}
                        <div className="form-group">
                            <label>Prospect Type *</label>
                            <select value={prospectData.prospectType || 'b2b'} onChange={(e) => updateField('prospectType', e.target.value)}>
                                <option value="b2b">B2B (Business/Professional)</option>
                                <option value="b2c">B2C (Consumer/Individual)</option>
                            </select>
                            <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                {prospectData.prospectType === 'b2b'
                                    ? 'Profile a business decision-maker or professional'
                                    : 'Profile an individual consumer or end-user'}
                            </small>
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>{prospectData.prospectType === 'b2b' ? 'Industry' : 'Category'} *</label>
                                <select value={prospectData.industry || ''} onChange={(e) => updateField('industry', e.target.value)}>
                                    <option value="">{t('common.select')}</option>
                                    {prospectData.prospectType === 'b2b' ? (
                                        <>
                                            <option value="technology">Technology</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="finance">Finance</option>
                                            <option value="education">Education</option>
                                            <option value="retail">Retail/E-commerce</option>
                                            <option value="consulting">Consulting</option>
                                            <option value="manufacturing">Manufacturing</option>
                                            <option value="other">Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="fashion">Fashion & Apparel</option>
                                            <option value="health">Health & Wellness</option>
                                            <option value="home">Home & Garden</option>
                                            <option value="beauty">Beauty & Personal Care</option>
                                            <option value="food">Food & Beverage</option>
                                            <option value="electronics">Electronics & Tech</option>
                                            <option value="entertainment">Entertainment & Media</option>
                                            <option value="travel">Travel & Leisure</option>
                                            <option value="other">Other</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {prospectData.prospectType === 'b2b' ? (
                                <div className="form-group">
                                    <label>Company Size</label>
                                    <select value={prospectData.companySize || ''} onChange={(e) => updateField('companySize', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        <option value="startup">Startup (1-10 employees)</option>
                                        <option value="small">Small (11-50 employees)</option>
                                        <option value="medium">Medium (51-200 employees)</option>
                                        <option value="large">Large (201-1000 employees)</option>
                                        <option value="enterprise">Enterprise (1000+ employees)</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Age Range</label>
                                    <select value={prospectData.ageRange || ''} onChange={(e) => updateField('ageRange', e.target.value)}>
                                        <option value="">{t('common.select')}</option>
                                        <option value="18-24">18-24</option>
                                        <option value="25-34">25-34</option>
                                        <option value="35-44">35-44</option>
                                        <option value="45-54">45-54</option>
                                        <option value="55-64">55-64</option>
                                        <option value="65+">65+</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Target Audience Description' : 'Consumer Profile'} *</label>
                            <textarea
                                value={prospectData.targetDescription || ''}
                                onChange={(e) => updateField('targetDescription', e.target.value)}
                                placeholder={prospectData.prospectType === 'b2b'
                                    ? 'Describe the business professionals you want to reach (e.g., Marketing Directors at mid-size tech companies)'
                                    : 'Describe your ideal consumer (e.g., Young professionals who value sustainable fashion and quality craftsmanship)'}
                            />
                        </div>

                        <div className="navigation-buttons">
                            <div></div>
                            <button className="btn" onClick={nextStep}>{t('common.next')}: {t('prospect_profiler.steps.pains')}</button>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('prospect_profiler.steps.pains')}</h2>
                        <p className="section-subtitle">{t('prospect_profiler.subtitle')}</p>

                        <div className="grid-2">
                            {prospectData.prospectType === 'b2b' ? (
                                <div className="form-group">
                                    <label>Job Title / Role *</label>
                                    <input
                                        type="text"
                                        value={prospectData.jobTitle || ''}
                                        onChange={(e) => updateField('jobTitle', e.target.value)}
                                        placeholder="e.g., Marketing Director, CEO, Operations Manager"
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Lifestyle / Interests</label>
                                    <input
                                        type="text"
                                        value={prospectData.lifestyle || ''}
                                        onChange={(e) => updateField('lifestyle', e.target.value)}
                                        placeholder="e.g., Fitness enthusiast, Urban professional, Eco-conscious parent"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Location / Region</label>
                                <input
                                    type="text"
                                    value={prospectData.location || ''}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    placeholder={prospectData.prospectType === 'b2b' ? 'e.g., North America, Global' : 'e.g., Urban areas, Coastal cities'}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Professional Pain Points' : 'Personal Frustrations'} *</label>
                            <textarea
                                value={prospectData.painPoints || ''}
                                onChange={(e) => updateField('painPoints', e.target.value)}
                                placeholder={prospectData.prospectType === 'b2b'
                                    ? 'What are their biggest business challenges and frustrations? (e.g., Struggling with lead generation, overwhelmed by manual processes)'
                                    : 'What frustrates them in their daily life? (e.g., Hard to find sustainable fashion that fits their style, tired of fast fashion quality)'}
                            />
                        </div>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Business Goals' : 'Personal Desires'}</label>
                            <textarea
                                value={prospectData.goals || ''}
                                onChange={(e) => updateField('goals', e.target.value)}
                                placeholder={prospectData.prospectType === 'b2b'
                                    ? 'What do they want to achieve professionally? (e.g., Increase revenue by 30%, streamline operations)'
                                    : 'What do they aspire to? (e.g., Express their unique style, live more sustainably, feel confident)'}
                            />
                        </div>

                        {/* B2C: Purchase Motivations */}
                        {prospectData.prospectType === 'b2c' && (
                            <div className="form-group">
                                <label>Purchase Motivations</label>
                                <div className="checkbox-group">
                                    {['quality', 'status', 'convenience', 'ethical', 'innovation', 'emotional'].map(motivation => (
                                        <div key={motivation} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={(prospectData.purchaseMotivations || []).includes(motivation)}
                                                onChange={() => toggleCheckbox('purchaseMotivations', motivation)}
                                            />
                                            <label>{motivation.charAt(0).toUpperCase() + motivation.slice(1)}</label>
                                        </div>
                                    ))}
                                </div>
                                <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                    What drives their buying decisions?
                                </small>
                            </div>
                        )}

                        {/* B2C: Decision-Making Style */}
                        {prospectData.prospectType === 'b2c' && (
                            <div className="form-group">
                                <label>Decision-Making Style</label>
                                <select value={prospectData.decisionStyle || ''} onChange={(e) => updateField('decisionStyle', e.target.value)}>
                                    <option value="">Select style...</option>
                                    <option value="impulsive">Impulsive - Quick decisions, acts on emotion</option>
                                    <option value="research_heavy">Research-Heavy - Reads reviews, compares options</option>
                                    <option value="brand_loyal">Brand Loyal - Sticks with trusted brands</option>
                                    <option value="deal_seeker">Deal Seeker - Looks for best value</option>
                                    <option value="influencer_driven">Influencer-Driven - Follows recommendations</option>
                                    <option value="community_oriented">Community-Oriented - Values shared experiences</option>
                                </select>
                            </div>
                        )}

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                            <button className="btn" onClick={nextStep}>{t('common.next')}: {t('prospect_profiler.steps.values')}</button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('prospect_profiler.steps.values')}</h2>
                        <p className="section-subtitle">{t('prospect_profiler.subtitle')}</p>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Communication Style' : 'Shopping Preferences'}</label>
                            <div className="checkbox-group">
                                {prospectData.prospectType === 'b2b' ? (
                                    ['direct', 'analytical', 'relationship', 'innovative'].map(style => (
                                        <div key={style} className="checkbox-item">
                                            <input type="checkbox" checked={(prospectData.commStyles || []).includes(style)} onChange={() => toggleCheckbox('commStyles', style)} />
                                            <label>{style.charAt(0).toUpperCase() + style.slice(1)}</label>
                                        </div>
                                    ))
                                ) : (
                                    ['online', 'in-store', 'mobile', 'social-media'].map(pref => (
                                        <div key={pref} className="checkbox-item">
                                            <input type="checkbox" checked={(prospectData.shoppingPrefs || []).includes(pref)} onChange={() => toggleCheckbox('shoppingPrefs', pref)} />
                                            <label>{pref.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Professional Values' : 'Personal Values'} *</label>
                            <textarea
                                value={prospectData.values || ''}
                                onChange={(e) => updateField('values', e.target.value)}
                                placeholder={prospectData.prospectType === 'b2b'
                                    ? 'What professional values drive their decisions? (e.g., ROI, efficiency, innovation, risk mitigation, growth)'
                                    : 'What personal values are important to them? (e.g., Sustainability, quality, self-expression, family, health, convenience)'}
                            />
                        </div>

                        {/* B2C: Emotional Drivers */}
                        {prospectData.prospectType === 'b2c' && (
                            <div className="form-group">
                                <label>Emotional Drivers</label>
                                <div className="checkbox-group">
                                    {[
                                        { value: 'fomo', label: 'Fear of Missing Out (FOMO)' },
                                        { value: 'belonging', label: 'Desire for Belonging' },
                                        { value: 'achievement', label: 'Need for Achievement' },
                                        { value: 'security', label: 'Security/Safety' },
                                        { value: 'self_expression', label: 'Self-Expression' },
                                        { value: 'excitement', label: 'Adventure/Excitement' }
                                    ].map(driver => (
                                        <div key={driver.value} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={(prospectData.emotionalDrivers || []).includes(driver.value)}
                                                onChange={() => toggleCheckbox('emotionalDrivers', driver.value)}
                                            />
                                            <label>{driver.label}</label>
                                        </div>
                                    ))}
                                </div>
                                <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                    What emotions influence their decisions?
                                </small>
                            </div>
                        )}

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                            <button className="btn" onClick={nextStep}>{t('common.next')}: {t('prospect_profiler.steps.behavior')}</button>
                        </div>
                    </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('prospect_profiler.steps.behavior')}</h2>
                        <p className="section-subtitle">{t('prospect_profiler.subtitle')}</p>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Professional Channels' : 'Social Media & Platforms'}</label>
                            <div className="checkbox-group">
                                {prospectData.prospectType === 'b2b' ? (
                                    ['linkedin', 'twitter', 'industry-blogs', 'webinars'].map(platform => (
                                        <div key={platform} className="checkbox-item">
                                            <input type="checkbox" checked={(prospectData.platforms || []).includes(platform)} onChange={() => toggleCheckbox('platforms', platform)} />
                                            <label>{platform.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</label>
                                        </div>
                                    ))
                                ) : (
                                    ['instagram', 'tiktok', 'facebook', 'youtube', 'pinterest'].map(platform => (
                                        <div key={platform} className="checkbox-item">
                                            <input type="checkbox" checked={(prospectData.platforms || []).includes(platform)} onChange={() => toggleCheckbox('platforms', platform)} />
                                            <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{prospectData.prospectType === 'b2b' ? 'Content Consumption' : 'Content Preferences'} *</label>
                            <textarea
                                value={prospectData.contentConsumption || ''}
                                onChange={(e) => updateField('contentConsumption', e.target.value)}
                                placeholder={prospectData.prospectType === 'b2b'
                                    ? 'What type of professional content do they engage with? (e.g., Case studies, whitepapers, industry reports, LinkedIn thought leadership)'
                                    : 'What type of content do they consume? (e.g., Influencer reviews, styling videos, user-generated content, brand stories)'}
                            />
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
                                <p>{t('common.analyzing_prospect')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 5 - Results */}
                {currentStep === 5 && (
                    <div className="form-section">
                        <div className="ai-badge">AI-Powered Analysis</div>
                        <h2 className="section-title">{t('prospect_profiler.steps.analysis')}</h2>
                        <p className="section-subtitle">{t('prospect_profiler.subtitle')}</p>

                        <div className="results-section">
                            <h3>Prospect Intelligence</h3>
                            <div className="analysis-card">
                                <h4>Personality Type & Angle</h4>
                                <p><strong>{prospectData.aiResults?.personalityType || getPersonalityType()}</strong></p>
                                <p style={{ marginTop: '10px', fontStyle: 'italic', opacity: 0.8 }}>
                                    Strategy: {prospectData.aiResults?.strategicAngle || generateStrategicAngle(prospectData)}
                                </p>
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>AI-Generated Connection Messages</h3>
                            {messages.map((msg, idx) => (
                                <div key={idx} className="analysis-card" style={{ marginBottom: '25px' }}>
                                    <h4 style={{ color: 'var(--electric-blue)', marginBottom: '15px' }}>{msg.title}</h4>
                                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: msg.content }} />
                                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                        {Object.entries(msg.ratings).map(([key, value]) => (
                                            <div key={key} style={{ background: '#e3f2fd', padding: '8px 12px', borderRadius: '8px', textAlign: 'center', minWidth: '80px' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--electric-blue)' }}>{value}/10</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--slate-gray)' }}>{key}</div>
                                            </div>
                                        ))}
                                        <div style={{ background: '#ffe0b2', padding: '8px 12px', borderRadius: '8px', textAlign: 'center', minWidth: '80px' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--coral-red)' }}>{calculateOverallScore(msg.ratings)}/10</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Overall</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Step CTA */}
                        <div className="next-step-cta" style={{ marginTop: '40px' }}>
                            <div className="cta-header">
                                <h3>💬 Master the Conversation</h3>
                                <p>You know your prospects. Now learn how to connect and convert them.</p>
                            </div>
                            <div className="cta-content">
                                <div className="cta-info">
                                    <h4>Get Your Conversation Guide</h4>
                                    <p>Use the <strong>Conversation Guide</strong> to analyze product-prospect match, get a match score, and receive personalized conversation strategies for every stage of the sales flow.</p>
                                    <ul className="cta-benefits">
                                        <li>✓ Product-prospect match scoring</li>
                                        <li>✓ Story framework mapping</li>
                                        <li>✓ 10 conversation guides</li>
                                        <li>✓ Stage-by-stage sales strategies</li>
                                    </ul>
                                </div>
                                <button
                                    className="cta-button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'conversation-guide' }))}
                                >
                                    Get Conversation Guide <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button className="btn" onClick={generateMessages}>{t('common.generate')}</button>
                                <button className="btn btn-secondary" onClick={startNewAnalysis}>{t('tracker.ui.reset_data')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProspectProfiler;
