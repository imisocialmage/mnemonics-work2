import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { analyzeToolData } from '../../utils/analysisService';
import '../shared-tool-styles.css';

const ConversationGuide = ({ allToolsCompleted = false, profileIndex }) => {
    const { t } = useTranslation();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-conversation-data'));
        if (saved) return JSON.parse(saved);

        // Fallback to product and prospect data
        const product = JSON.parse(localStorage.getItem(getProfileKey('imi-product-data')) || '{}');
        const prospect = JSON.parse(localStorage.getItem(getProfileKey('imi-prospect-data')) || '{}');
        const brand = JSON.parse(localStorage.getItem(getProfileKey('imi-brand-data')) || '{}');

        return {
            productName: product.productName || brand.brandName || '',
            problemSolved: product.problemSolved || '',
            tangibleBenefit: product.tangibleBenefit || '',
            emotionalBenefit: '',
            painPoints: prospect.painPoints || '',
            motivations: '',
            clarity: 5, relevance: 5, distinctiveness: 5, memorability: 5, scalability: 5
        };
    });

    const [isLoading, setIsLoading] = useState(false);
    const [aiResults, setAiResults] = useState(null);
    const [matchScore, setMatchScore] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    // Save conversation data and score to localStorage
    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-conversation-data'), JSON.stringify({
            ...formData,
            matchScore: matchScore
        }));
    }, [formData, matchScore, getProfileKey]);

    const totalSteps = 4;

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = () => {
        const requiredFields = {
            1: ['productName', 'problemSolved'],
            2: ['painPoints'],
            3: []
        };

        const fields = requiredFields[currentStep] || [];
        return fields.every(field => formData[field]?.trim?.());
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            displayMessage(t('conversation_guide.required_fields'));
        }
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateMatchAnalysis = async () => {
        if (validateStep()) {
            setIsLoading(true);
            try {
                const results = await analyzeToolData('conversationGuide', formData, t('common.lang_code'));
                setAiResults(results);
                setMatchScore(results.matchScore);
                setCurrentStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'conversationGuide' }));
            } catch (error) {
                console.error("AI Analysis failed:", error);
                displayMessage(t('common.error_occurred'));
                // Fallback to local logic
                calculateMatchScore();
                setCurrentStep(4);
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'conversationGuide' }));
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

    const calculateMatchScore = () => {
        let score = 0;

        // Product completeness (2 points)
        if (formData.productName && formData.problemSolved && formData.tangibleBenefit) score += 2;

        // Prospect completeness (2 points)
        if (formData.painPoints && formData.motivations) score += 2;

        // Pain point alignment (2 points)
        if (formData.problemSolved && formData.painPoints) {
            const problemWords = formData.problemSolved.toLowerCase().split(' ');
            const painWords = formData.painPoints.toLowerCase().split(' ');
            const overlap = problemWords.some(word => painWords.includes(word) && word.length > 4);
            if (overlap) score += 2;
        }

        // Benefit-motivation alignment (1.5 points)
        if (formData.emotionalBenefit && formData.motivations) score += 1.5;

        // Brand strength (2 points max)
        const brandAvg = (
            parseInt(formData.clarity) + parseInt(formData.relevance) +
            parseInt(formData.distinctiveness) + parseInt(formData.memorability) +
            parseInt(formData.scalability)
        ) / 5;
        score += (brandAvg / 10) * 2;

        // Readiness bonus (0.5 point)
        if (formData.buyerStage === 'decision') score += 0.5;

        score = Math.min(10, Math.max(1, score)).toFixed(1);
        setMatchScore(score);
    };

    const getScoreDescription = () => {
        if (matchScore >= 8) return t('conversation_guide.score_excellent');
        if (matchScore >= 6) return t('conversation_guide.score_good');
        if (matchScore >= 4) return t('conversation_guide.score_moderate');
        return t('conversation_guide.score_limited');
    };

    const generateConversationGuides = () => {
        const productName = formData.productName || '[product]';
        const problem = formData.problemSolved || '[area your product solves]';
        const painPoint = formData.painPoints?.split(',')[0]?.trim() || '[specific conflict]';
        const desire = formData.motivations?.split(',')[0]?.trim() || '[desired result]';

        return [
            {
                key: 'connection',
                context: { problem }
            },
            {
                key: 'rapport_desire',
                context: { problem }
            },
            {
                key: 'rapport_conflict',
                context: {}
            },
            {
                key: 'presenting',
                context: { productName, painPoint }
            },
            {
                key: 'closing',
                context: { painPoint, desire }
            }
        ].map(config => ({
            stage: t(`conversation_guide.guides.${config.key}.stage`),
            title: t(`conversation_guide.guides.${config.key}.title`),
            guide: t(`conversation_guide.guides.${config.key}.guide`, config.context),
            why: t(`conversation_guide.guides.${config.key}.why`)
        }));
    };

    const startNewAnalysis = () => {
        if (window.confirm(t('conversation_guide.new_analysis_confirm'))) {
            setFormData({ clarity: 5, relevance: 5, distinctiveness: 5, memorability: 5, scalability: 5 });
            setMatchScore(0);
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayMessage(t('conversation_guide.new_analysis_started'));
        }
    };

    const renderProgressBar = () => (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {t('conversation_guide.progress_steps', { returnObjects: true }).map((label, idx) => (
                <div key={idx} className={`step ${currentStep === idx + 1 ? 'active' : ''} ${currentStep > idx + 1 ? 'completed' : ''}`}>
                    <div className="step-number">{idx + 1}</div>
                    <span className="step-label">{label}</span>
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
                        <h1>{t('conversation_guide.title')}</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}

                {/* Step 1 - Product Profile */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('conversation_guide.step1_title')}</h2>
                        <p className="section-subtitle">{t('conversation_guide.step1_subtitle')}</p>

                        <div className="form-group">
                            <label>{t('conversation_guide.product_name')} *</label>
                            <input type="text" value={formData.productName || ''} onChange={(e) => updateField('productName', e.target.value)} placeholder="Product Name" />
                        </div>

                        <div className="form-group">
                            <label>{t('conversation_guide.problem_solved')} *</label>
                            <textarea value={formData.problemSolved || ''} onChange={(e) => updateField('problemSolved', e.target.value)} placeholder={t('conversation_guide.problem_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('conversation_guide.differentiator')}</label>
                            <textarea value={formData.differentiator || ''} onChange={(e) => updateField('differentiator', e.target.value)} placeholder={t('conversation_guide.differentiator_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('conversation_guide.tangible_benefits')}</label>
                            <textarea value={formData.tangibleBenefit || ''} onChange={(e) => updateField('tangibleBenefit', e.target.value)} placeholder={t('conversation_guide.benefits_placeholder')} />
                        </div>

                        <div className="navigation-buttons">
                            <div></div>
                            <button className="btn" onClick={nextStep}>{t('conversation_guide.next_prospect')}</button>
                        </div>
                    </div>
                )}

                {/* Step 2 - Prospect Profile */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('conversation_guide.step2_title')}</h2>
                        <p className="section-subtitle">{t('conversation_guide.step2_subtitle')}</p>

                        <div className="form-group">
                            <label>{t('conversation_guide.pain_points')} *</label>
                            <textarea value={formData.painPoints || ''} onChange={(e) => updateField('painPoints', e.target.value)} placeholder={t('conversation_guide.pain_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('conversation_guide.motivations')}</label>
                            <textarea value={formData.motivations || ''} onChange={(e) => updateField('motivations', e.target.value)} placeholder={t('conversation_guide.motivations_placeholder')} />
                        </div>

                        <div className="form-group">
                            <label>{t('conversation_guide.readiness')}</label>
                            <select value={formData.buyerStage || ''} onChange={(e) => updateField('buyerStage', e.target.value)}>
                                <option value="">{t('conversation_guide.select_stage')}</option>
                                <option value="awareness">{t('conversation_guide.stage_awareness')}</option>
                                <option value="consideration">{t('conversation_guide.stage_consideration')}</option>
                                <option value="decision">{t('conversation_guide.stage_decision')}</option>
                            </select>
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('conversation_guide.previous')}</button>
                            <button className="btn" onClick={nextStep}>{t('conversation_guide.next_brand')}</button>
                        </div>
                    </div>
                )}

                {/* Step 3 - Brand Attributes */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <h2 className="section-title">{t('conversation_guide.step3_title')}</h2>
                        <p className="section-subtitle">{t('conversation_guide.step3_subtitle')}</p>

                        {['clarity', 'relevance', 'distinctiveness', 'memorability', 'scalability'].map(attr => (
                            <div key={attr} className="slider-group">
                                <div className="slider-label">
                                    <span>{t(`conversation_guide.attributes.${attr}`)}</span>
                                    <span className="slider-value">{formData[attr]}</span>
                                </div>
                                <input type="range" min="1" max="10" value={formData[attr]} onChange={(e) => updateField(attr, e.target.value)} />
                                <div className="slider-scale">
                                    <span>{t('conversation_guide.low')}</span>
                                    <span>{t('conversation_guide.high')}</span>
                                </div>
                            </div>
                        ))}

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('conversation_guide.previous')}</button>
                            <button className="btn" onClick={generateMatchAnalysis} disabled={isLoading}>
                                {isLoading ? t('common.generating') : t('conversation_guide.generate')}
                            </button>
                        </div>

                        {isLoading && (
                            <div className="loading-overlay">
                                <div className="loader"></div>
                                <p>{t('common.analyzing_match')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4 - Results */}
                {currentStep === 4 && (
                    <div className="form-section">
                        <div className="ai-badge">{t('conversation_guide.ai_badge')}</div>
                        <h2 className="section-title">{t('conversation_guide.step4_title')}</h2>
                        <p className="section-subtitle">{t('conversation_guide.step4_subtitle')}</p>

                        <div style={{ textAlign: 'center', padding: '40px', margin: '30px 0' }}>
                            <div style={{ width: '200px', height: '200px', margin: '0 auto 20px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--electric-blue), var(--coral-red))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 40px rgba(41, 121, 255, 0.3)' }}>
                                <div style={{ fontSize: '4rem', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif' }}>{matchScore}</div>
                                <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>{t('conversation_guide.match_score')}</div>
                            </div>
                            <p style={{ fontSize: '1.2rem', color: 'var(--slate-gray)', maxWidth: '600px', margin: '0 auto' }}>
                                {aiResults?.scoreAnalysis || getScoreDescription()}
                            </p>
                        </div>

                        <div className="results-section">
                            <h3>{t('conversation_guide.story_framework')}</h3>
                            <div className="grid-3">
                                {aiResults?.storyFramework ? (
                                    Object.entries(aiResults.storyFramework).map(([key, val], idx) => (
                                        <div key={idx} className="analysis-card">
                                            <h4 style={{ color: 'var(--electric-blue)' }}>{t(`conversation_guide.framework.${key}`)}</h4>
                                            <p>{val}</p>
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { key: 'situation', val: formData.painPoints },
                                        { key: 'desires', val: formData.motivations },
                                        { key: 'conflicts', val: formData.painPoints },
                                        { key: 'changes', val: `Implementing ${formData.productName || 'your solution'}` },
                                        { key: 'results', val: formData.tangibleBenefit }
                                    ].map((stage, idx) => (
                                        <div key={idx} className="analysis-card">
                                            <h4 style={{ color: 'var(--electric-blue)' }}>{t(`conversation_guide.framework.${stage.key}`)}</h4>
                                            <p>{stage.val || t(`conversation_guide.framework.desc_${stage.key}`, { product: formData.productName || 'your solution' })}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>{t('conversation_guide.conversation_title')}</h3>
                            {(aiResults?.guides || generateConversationGuides()).map((guide, idx) => (
                                <div key={idx} className="analysis-card" style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', borderLeft: '4px solid #ff9800', marginBottom: '20px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', marginBottom: '5px' }}>{guide.stage}</div>
                                    <h4 style={{ color: '#f57c00', marginBottom: '10px' }}>{guide.title}</h4>
                                    <div style={{ fontStyle: 'italic', background: 'white', padding: '12px', borderRadius: '8px', margin: '10px 0', color: 'var(--midnight-black)' }}
                                        dangerouslySetInnerHTML={{ __html: guide.content || guide.guide }} />
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}><strong>{t('conversation_guide.why_works')}</strong> {guide.why}</div>
                                </div>
                            ))}
                        </div>

                        {/* Completion CTA */}
                        <div className="next-step-cta" style={{ marginTop: '40px', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', borderColor: '#4caf50' }}>
                            <div className="cta-header">
                                <h3>{t('conversation_guide.completion_title')}</h3>
                                <p>{t('conversation_guide.completion_subtitle')}</p>
                            </div>
                            <div className="cta-content" style={{ flexDirection: 'column', textAlign: 'center' }}>
                                <div className="cta-info">
                                    <h4>{t('conversation_guide.you_now_have')}</h4>
                                    <ul className="cta-benefits" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                                        {t('conversation_guide.benefits_unlocked', { returnObjects: true }).map((benefit, idx) => (
                                            <li key={idx}>✓ {benefit}</li>
                                        ))}
                                    </ul>

                                    {allToolsCompleted && (
                                        <>
                                            <div style={{
                                                background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                                                border: '3px solid #ff9800',
                                                borderRadius: '15px',
                                                padding: '25px',
                                                marginTop: '30px',
                                                boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)'
                                            }}>
                                                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '1.3rem' }}>{t('conversation_guide.master_report_title')}</h4>
                                                <p style={{ marginBottom: '20px', color: '#666' }}>
                                                    {t('conversation_guide.master_report_desc')}
                                                </p>
                                                <button
                                                    className="cta-button"
                                                    onClick={() => window.dispatchEvent(new CustomEvent('download-master-report'))}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                                                        margin: '0 auto'
                                                    }}
                                                >
                                                    <Download size={20} /> {t('conversation_guide.download_master')}
                                                </button>
                                            </div>

                                            <div style={{
                                                background: 'linear-gradient(135deg, var(--midnight-black), #2a2a2a)',
                                                border: '3px solid var(--electric-blue)',
                                                borderRadius: '15px',
                                                padding: '25px',
                                                marginTop: '20px',
                                                color: 'white',
                                                boxShadow: '0 8px 25px rgba(41, 121, 255, 0.2)'
                                            }}>
                                                <h4 style={{ color: 'var(--electric-blue)', marginBottom: '15px', fontSize: '1.3rem' }}>{t('conversation_guide.pitch_master_title')}</h4>
                                                <p style={{ marginBottom: '20px', opacity: 0.9 }}>
                                                    {t('conversation_guide.pitch_master_desc')}
                                                </p>
                                                <button
                                                    className="cta-button"
                                                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'pitch-master' }))}
                                                    style={{
                                                        background: 'var(--electric-blue)',
                                                        margin: '0 auto'
                                                    }}
                                                >
                                                    {t('conversation_guide.enter_pitch_master')} <Sparkles size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <p style={{ marginTop: '25px', fontSize: '1.1rem', fontWeight: '500' }}>{t('conversation_guide.ready_text')}</p>
                                </div>
                                <button
                                    className="cta-button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'compass' }))}
                                    style={{ margin: '20px auto 0' }}
                                >
                                    {t('conversation_guide.return_compass')} <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>{t('conversation_guide.previous')}</button>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button className="btn" onClick={generateMatchAnalysis}>{t('conversation_guide.regenerate')}</button>
                                <button className="btn btn-secondary" onClick={startNewAnalysis}>{t('conversation_guide.new_analysis')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ConversationGuide;
