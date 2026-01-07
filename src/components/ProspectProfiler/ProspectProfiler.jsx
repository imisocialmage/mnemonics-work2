import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import '../shared-tool-styles.css';

const ProspectProfiler = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [prospectData, setProspectData] = useState(() => {
        const saved = localStorage.getItem('imi-prospect-data');
        return saved ? JSON.parse(saved) : {};
    });

    // Save prospect data to localStorage
    React.useEffect(() => {
        localStorage.setItem('imi-prospect-data', JSON.stringify(prospectData));
    }, [prospectData]);
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
            2: ['jobTitle', 'painPoints'],
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
            displayMessage('Please fill in all required fields');
        }
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateAnalysis = () => {
        if (validateStep()) {
            generateMessages();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Mark tool as completed
            window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'prospectProfiler' }));
            setCurrentStep(5);
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
        const titles = {
            authority: 'Authority & Expertise Approach',
            curiosity: 'Curiosity Gap Strategy',
            data_driven: 'Data-Driven Evidence Method',
            connection: 'Personal Connection Focus',
            pain_point: 'Pain Point Solution Strategy'
        };
        return titles[type];
    };

    const generateDynamicMessage = (type) => {
        const industry = prospectData.industry || 'your industry';
        const role = prospectData.jobTitle || 'leadership role';
        const painPoint = prospectData.painPoints?.split('.')[0] || 'operational challenges';

        const openings = {
            authority: `After working with 200+ ${role} professionals, I've uncovered a critical pattern in ${industry}.`,
            curiosity: `I discovered something counterintuitive about ${industry} companies that most overlook.`,
            data_driven: `Recent data from 300+ ${industry} companies shows a surprising trend affecting ${role} leaders.`,
            connection: `I noticed your innovative approach at [Company] in ${industry}.`,
            pain_point: `While researching ${industry} challenges, one issue keeps surfacing: ${painPoint}.`
        };

        const credibility = `This approach has helped clients achieve 35% efficiency improvement in 8 weeks.`;
        const cta = `Would you be open to a 15-minute conversation about applying this to your situation?`;

        return `Hi [First Name],<br><br>${openings[type]}<br><br>${credibility}<br><br>${cta}<br><br>Best regards,<br>[Your Name]`;
    };

    const calculateDynamicRatings = (type) => {
        const baseRatings = {
            authority: { clarity: 8, relevance: 8, distinctiveness: 9, memorability: 8, scalability: 7 },
            curiosity: { clarity: 7, relevance: 9, distinctiveness: 9, memorability: 9, scalability: 8 },
            data_driven: { clarity: 9, relevance: 8, distinctiveness: 7, memorability: 7, scalability: 9 },
            connection: { clarity: 8, relevance: 9, distinctiveness: 8, memorability: 8, scalability: 6 },
            pain_point: { clarity: 9, relevance: 9, distinctiveness: 8, memorability: 8, scalability: 8 }
        };
        return baseRatings[type];
    };

    const calculateOverallScore = (ratings) => {
        const scores = Object.values(ratings);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return Math.round(average * 10) / 10;
    };

    const getPersonalityType = () => {
        const triggers = prospectData.triggers || [];
        if (triggers.includes('roi') && triggers.includes('efficiency')) {
            return "Analytical Driver - Focused on data-driven results and measurable outcomes";
        } else if (triggers.includes('growth') && triggers.includes('innovation')) {
            return "Visionary Innovator - Forward-thinking leader focused on scaling";
        }
        return "Balanced Professional - Motivated by multiple strategic factors";
    };

    const startNewAnalysis = () => {
        if (window.confirm('Start a new analysis? All current data will be cleared.')) {
            setProspectData({});
            setMessages([]);
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
            {['Target Audience', 'Prospect Profile', 'Psychology', 'Digital Footprint', 'AI Analysis'].map((label, idx) => (
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
                        <h1>IMI AI Profiler Analyzer</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}

                {/* Step 1 */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">Target Audience & Niche Analysis</h2>
                        <p className="section-subtitle">Define your ideal prospect's market segment and audience characteristics</p>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>Industry/Niche *</label>
                                <select value={prospectData.industry || ''} onChange={(e) => updateField('industry', e.target.value)}>
                                    <option value="">Select Industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="education">Education</option>
                                    <option value="retail">Retail/E-commerce</option>
                                    <option value="consulting">Consulting</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Company Size</label>
                                <select value={prospectData.companySize || ''} onChange={(e) => updateField('companySize', e.target.value)}>
                                    <option value="">Select Size</option>
                                    <option value="startup">Startup (1-10 employees)</option>
                                    <option value="small">Small (11-50 employees)</option>
                                    <option value="medium">Medium (51-200 employees)</option>
                                    <option value="large">Large (201-1000 employees)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Target Audience Description *</label>
                            <textarea value={prospectData.targetDescription || ''} onChange={(e) => updateField('targetDescription', e.target.value)} placeholder="Describe your ideal prospect's characteristics, challenges, and goals..." />
                        </div>

                        <div className="navigation-buttons">
                            <div></div>
                            <button className="btn" onClick={nextStep}>Next: Prospect Profile</button>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">Prospect Profile Details</h2>
                        <p className="section-subtitle">Build a detailed profile of your ideal prospect</p>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>Job Title/Role *</label>
                                <input type="text" value={prospectData.jobTitle || ''} onChange={(e) => updateField('jobTitle', e.target.value)} placeholder="e.g., Marketing Director, CEO" />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={prospectData.location || ''} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g., North America, Global" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Primary Pain Points *</label>
                            <textarea value={prospectData.painPoints || ''} onChange={(e) => updateField('painPoints', e.target.value)} placeholder="What are their biggest challenges and frustrations?" />
                        </div>

                        <div className="form-group">
                            <label>Goals & Aspirations</label>
                            <textarea value={prospectData.goals || ''} onChange={(e) => updateField('goals', e.target.value)} placeholder="What do they want to achieve?" />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={nextStep}>Next: Psychology Analysis</button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <h2 className="section-title">Psychology & Personality Analysis</h2>
                        <p className="section-subtitle">Understand the psychological drivers and personality traits</p>

                        <div className="form-group">
                            <label>Communication Style Preferences</label>
                            <div className="checkbox-group">
                                {['direct', 'analytical', 'relationship', 'innovative'].map(style => (
                                    <div key={style} className="checkbox-item">
                                        <input type="checkbox" checked={(prospectData.commStyles || []).includes(style)} onChange={() => toggleCheckbox('commStyles', style)} />
                                        <label>{style.charAt(0).toUpperCase() + style.slice(1)}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Core Values & Beliefs *</label>
                            <textarea value={prospectData.values || ''} onChange={(e) => updateField('values', e.target.value)} placeholder="What values drive their decisions?" />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={nextStep}>Next: Digital Footprint</button>
                        </div>
                    </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                    <div className="form-section">
                        <h2 className="section-title">Digital Footprint & Social Presence</h2>
                        <p className="section-subtitle">Map their online behavior and social media presence</p>

                        <div className="form-group">
                            <label>Primary Social Media Platforms</label>
                            <div className="checkbox-group">
                                {['linkedin', 'twitter', 'facebook', 'instagram'].map(platform => (
                                    <div key={platform} className="checkbox-item">
                                        <input type="checkbox" checked={(prospectData.platforms || []).includes(platform)} onChange={() => toggleCheckbox('platforms', platform)} />
                                        <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Content Consumption Preferences *</label>
                            <textarea value={prospectData.contentConsumption || ''} onChange={(e) => updateField('contentConsumption', e.target.value)} placeholder="What type of content do they engage with?" />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={generateAnalysis}>Generate AI Analysis</button>
                        </div>
                    </div>
                )}

                {/* Step 5 - Results */}
                {currentStep === 5 && (
                    <div className="form-section">
                        <div className="ai-badge">AI-Powered Analysis</div>
                        <h2 className="section-title">AI Analysis & Connection Messages</h2>
                        <p className="section-subtitle">Dynamically generated prospect analysis and personalized connection messages</p>

                        <div className="results-section">
                            <h3>AI Prospect Analysis</h3>
                            <div className="analysis-card">
                                <h4>Personality Type</h4>
                                <p>{getPersonalityType()}</p>
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
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button className="btn" onClick={generateMessages}>Regenerate Messages</button>
                                <button className="btn btn-secondary" onClick={startNewAnalysis}>New Analysis</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProspectProfiler;
