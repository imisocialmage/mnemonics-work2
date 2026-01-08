import React, { useState } from 'react';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import '../shared-tool-styles.css';

const ConversationGuide = ({ allToolsCompleted = false }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('imi-conversation-data');
        return saved ? JSON.parse(saved) : {
            clarity: 5, relevance: 5, distinctiveness: 5, memorability: 5, scalability: 5
        };
    });

    // Save conversation data and score to localStorage
    React.useEffect(() => {
        localStorage.setItem('imi-conversation-data', JSON.stringify({
            ...formData,
            matchScore: matchScore
        }));
    }, [formData, matchScore]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [matchScore, setMatchScore] = useState(0);
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
            displayMessage('Please fill in all required fields');
        }
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateMatchAnalysis = () => {
        setCurrentStep(4);
        calculateMatchScore();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Mark this tool as completed
        window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'conversationGuide' }));
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
        if (matchScore >= 8) return 'Excellent alignment! Your product, prospect, and brand are strongly matched.';
        if (matchScore >= 6) return 'Good alignment with optimization opportunities.';
        if (matchScore >= 4) return 'Moderate alignment. Consider refining your messaging.';
        return 'Limited alignment detected. Review your product positioning.';
    };

    const generateConversationGuides = () => {
        const productName = formData.productName || '[product]';
        const problem = formData.problemSolved || '[area your product solves]';
        const painPoint = formData.painPoints?.split(',')[0]?.trim() || '[specific conflict]';
        const desire = formData.motivations?.split(',')[0]?.trim() || '[desired result]';

        return [
            {
                stage: '1. Connection',
                title: 'Situation Hook',
                guide: `"I'd love to hear where you are right now in ${problem}."`,
                why: 'Surfaces the Situation early and shows genuine curiosity.'
            },
            {
                stage: '2. Building Rapport',
                title: 'Desire Discovery',
                guide: `"If you had the ideal outcome in ${problem}, what would it look like for you?"`,
                why: 'Shifts from where they are → where they want to be.'
            },
            {
                stage: '2. Building Rapport',
                title: 'Conflict Validation',
                guide: `"What's been the biggest challenge keeping you from that result?"`,
                why: 'Gets to the Conflict, allows empathy, and builds trust.'
            },
            {
                stage: '3. Presenting',
                title: 'Mapping Product to Prospect',
                guide: `"What you've just described connects directly with how ${productName} works. For example, you mentioned ${painPoint}, and our approach addresses that."`,
                why: 'Directly links their story to your product.'
            },
            {
                stage: '4. Booking/Closing',
                title: 'Trial Close',
                guide: `"If we could solve ${painPoint} and help you reach ${desire}, would you feel comfortable moving forward with a trial/next step?"`,
                why: 'Checks readiness and leads toward decision.'
            }
        ];
    };

    const startNewAnalysis = () => {
        if (window.confirm('Start a new analysis? All current data will be cleared.')) {
            setFormData({ clarity: 5, relevance: 5, distinctiveness: 5, memorability: 5, scalability: 5 });
            setMatchScore(0);
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayMessage('New analysis started!');
        }
    };

    const renderProgressBar = () => (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {['Product Profile', 'Prospect Profile', 'Brand Attributes', 'Match Analysis'].map((label, idx) => (
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
                        <h1>Product-Prospect Match & Conversation Guide</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}

                {/* Step 1 - Product Profile */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">Product Profile - 5 Key Dimensions</h2>
                        <p className="section-subtitle">Define your product across the core attributes</p>

                        <div className="form-group">
                            <label>Product Name *</label>
                            <input type="text" value={formData.productName || ''} onChange={(e) => updateField('productName', e.target.value)} placeholder="Product Name" />
                        </div>

                        <div className="form-group">
                            <label>Problem Solved *</label>
                            <textarea value={formData.problemSolved || ''} onChange={(e) => updateField('problemSolved', e.target.value)} placeholder="What specific problem does it solve?" />
                        </div>

                        <div className="form-group">
                            <label>Unique Differentiator</label>
                            <textarea value={formData.differentiator || ''} onChange={(e) => updateField('differentiator', e.target.value)} placeholder="What makes your product unique?" />
                        </div>

                        <div className="form-group">
                            <label>Tangible Benefits</label>
                            <textarea value={formData.tangibleBenefit || ''} onChange={(e) => updateField('tangibleBenefit', e.target.value)} placeholder="Tangible benefits (saves time, increases revenue, etc.)" />
                        </div>

                        <div className="navigation-buttons">
                            <div></div>
                            <button className="btn" onClick={nextStep}>Next: Prospect Profile</button>
                        </div>
                    </div>
                )}

                {/* Step 2 - Prospect Profile */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">Prospect Profile - 5 Core Attributes</h2>
                        <p className="section-subtitle">Define your ideal prospect across key dimensions</p>

                        <div className="form-group">
                            <label>Pain Points & Needs *</label>
                            <textarea value={formData.painPoints || ''} onChange={(e) => updateField('painPoints', e.target.value)} placeholder="What problems are they struggling with?" />
                        </div>

                        <div className="form-group">
                            <label>Motivations</label>
                            <textarea value={formData.motivations || ''} onChange={(e) => updateField('motivations', e.target.value)} placeholder="What motivates them?" />
                        </div>

                        <div className="form-group">
                            <label>Readiness to Take Action</label>
                            <select value={formData.buyerStage || ''} onChange={(e) => updateField('buyerStage', e.target.value)}>
                                <option value="">Select Stage</option>
                                <option value="awareness">Awareness - Just learning about the problem</option>
                                <option value="consideration">Consideration - Evaluating solutions</option>
                                <option value="decision">Decision - Ready to purchase</option>
                            </select>
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={nextStep}>Next: Brand Attributes</button>
                        </div>
                    </div>
                )}

                {/* Step 3 - Brand Attributes */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <h2 className="section-title">Brand Attributes - 5 Core Qualities</h2>
                        <p className="section-subtitle">Rate your brand strength on each attribute (1-10)</p>

                        {['clarity', 'relevance', 'distinctiveness', 'memorability', 'scalability'].map(attr => (
                            <div key={attr} className="slider-group">
                                <div className="slider-label">
                                    <span>{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                                    <span className="slider-value">{formData[attr]}</span>
                                </div>
                                <input type="range" min="1" max="10" value={formData[attr]} onChange={(e) => updateField(attr, e.target.value)} />
                                <div className="slider-scale">
                                    <span>Low</span>
                                    <span>High</span>
                                </div>
                            </div>
                        ))}

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={generateMatchAnalysis}>Generate Match Analysis</button>
                        </div>
                    </div>
                )}

                {/* Step 4 - Results */}
                {currentStep === 4 && (
                    <div className="form-section">
                        <div className="ai-badge">AI-Powered Match Analysis</div>
                        <h2 className="section-title">Your Product-Prospect Match Report</h2>
                        <p className="section-subtitle">Complete analysis with conversation strategies</p>

                        <div style={{ textAlign: 'center', padding: '40px', margin: '30px 0' }}>
                            <div style={{ width: '200px', height: '200px', margin: '0 auto 20px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--electric-blue), var(--coral-red))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 40px rgba(41, 121, 255, 0.3)' }}>
                                <div style={{ fontSize: '4rem', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif' }}>{matchScore}</div>
                                <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>Match Score</div>
                            </div>
                            <p style={{ fontSize: '1.2rem', color: 'var(--slate-gray)', maxWidth: '600px', margin: '0 auto' }}>{getScoreDescription()}</p>
                        </div>

                        <div className="results-section">
                            <h3>Story Framework Map</h3>
                            <div className="grid-3">
                                {['Situation', 'Desires', 'Conflicts', 'Changes', 'Results'].map((stage, idx) => (
                                    <div key={idx} className="analysis-card">
                                        <h4 style={{ color: 'var(--electric-blue)' }}>{stage}</h4>
                                        <p>{idx === 0 ? formData.painPoints || 'Prospect current challenges' :
                                            idx === 1 ? formData.motivations || 'What they want to achieve' :
                                                idx === 2 ? formData.painPoints || 'Obstacles preventing success' :
                                                    idx === 3 ? `Implementing ${formData.productName || 'your solution'}` :
                                                        formData.tangibleBenefit || 'Desired outcome achieved'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Complete Sales Flow - Conversation Guides</h3>
                            {generateConversationGuides().map((guide, idx) => (
                                <div key={idx} className="analysis-card" style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', borderLeft: '4px solid #ff9800', marginBottom: '20px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', marginBottom: '5px' }}>{guide.stage}</div>
                                    <h4 style={{ color: '#f57c00', marginBottom: '10px' }}>{guide.title}</h4>
                                    <div style={{ fontStyle: 'italic', background: 'white', padding: '12px', borderRadius: '8px', margin: '10px 0', color: 'var(--midnight-black)' }}>{guide.guide}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}><strong>Why it works:</strong> {guide.why}</div>
                                </div>
                            ))}
                        </div>

                        {/* Completion CTA */}
                        <div className="next-step-cta" style={{ marginTop: '40px', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', borderColor: '#4caf50' }}>
                            <div className="cta-header">
                                <h3>🎉 Congratulations! Your Strategic Foundation is Complete</h3>
                                <p>You've completed the full IMI strategic workflow</p>
                            </div>
                            <div className="cta-content" style={{ flexDirection: 'column', textAlign: 'center' }}>
                                <div className="cta-info">
                                    <h4>You Now Have:</h4>
                                    <ul className="cta-benefits" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                                        <li>✓ Strategic marketing direction from the Compass</li>
                                        <li>✓ Comprehensive brand evaluation and recommendations</li>
                                        <li>✓ Defined product positioning and ideal client avatar</li>
                                        <li>✓ AI-generated prospect connection messages</li>
                                        <li>✓ Complete conversation guide for your sales flow</li>
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
                                                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '1.3rem' }}>🏆 Master Report Available!</h4>
                                                <p style={{ marginBottom: '20px', color: '#666' }}>
                                                    You've completed all 5 strategic tools! Download your comprehensive Master Report containing all insights, recommendations, and strategies in one unified document.
                                                </p>
                                                <button
                                                    className="cta-button"
                                                    onClick={() => window.dispatchEvent(new CustomEvent('download-master-report'))}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                                                        margin: '0 auto'
                                                    }}
                                                >
                                                    <Download size={20} /> Download Master Report (PDF)
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
                                                <h4 style={{ color: 'var(--electric-blue)', marginBottom: '15px', fontSize: '1.3rem' }}>✨ Performance Tool Unlocked: Pitch Master</h4>
                                                <p style={{ marginBottom: '20px', opacity: 0.9 }}>
                                                    Your strategic foundation is now integrated. Enter the **Strategic Pitch Master** to instantly generate winning sales pitches, outreach messages, and expert Q&A tailored to your exact data.
                                                </p>
                                                <button
                                                    className="cta-button"
                                                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'pitch-master' }))}
                                                    style={{
                                                        background: 'var(--electric-blue)',
                                                        margin: '0 auto'
                                                    }}
                                                >
                                                    Enter Pitch Master <Sparkles size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <p style={{ marginTop: '25px', fontSize: '1.1rem', fontWeight: '500' }}>Ready to implement? Start with the Compass tool to refine your strategy, or revisit any tool to update your approach.</p>
                                </div>
                                <button
                                    className="cta-button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'compass' }))}
                                    style={{ margin: '20px auto 0' }}
                                >
                                    Return to Compass <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button className="btn" onClick={generateMatchAnalysis}>Regenerate Analysis</button>
                                <button className="btn btn-secondary" onClick={startNewAnalysis}>New Analysis</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ConversationGuide;
