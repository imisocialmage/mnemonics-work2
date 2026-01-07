import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import '../shared-tool-styles.css';

const ProductProfiler = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [productData, setProductData] = useState(() => {
        const saved = localStorage.getItem('imi-product-data');
        return saved ? JSON.parse(saved) : {};
    });

    // Save product data to localStorage
    React.useEffect(() => {
        localStorage.setItem('imi-product-data', JSON.stringify(productData));
    }, [productData]);
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
            displayMessage('Please fill in all required fields');
        }
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateAnalysis = () => {
        if (validateStep()) {
            setCurrentStep(5);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Mark tool as completed
            window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'productProfiler' }));
        }
    };

    const displayMessage = (msg) => {
        setMessage(msg);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    // Helper functions from original
    const extractAudience = (users) => {
        if (!users) return 'busy professionals';
        const lower = users.toLowerCase();
        if (lower.includes('entrepreneur')) return 'entrepreneurs and business owners';
        if (lower.includes('coach')) return 'coaches and consultants';
        if (lower.includes('freelancer')) return 'freelancers and solopreneurs';
        return 'professionals looking to grow';
    };

    const extractCoreResult = (benefits) => {
        if (!benefits) return 'better results in less time';
        const lower = benefits.toLowerCase();
        if (lower.includes('save time')) return 'more time and efficiency';
        if (lower.includes('revenue')) return 'increased revenue and profitability';
        if (lower.includes('productivity')) return 'maximum productivity';
        return 'meaningful improvements in their work';
    };

    const extractDifferentiator = (unique) => {
        if (!unique) return 'a proven systematic approach';
        const lower = unique.toLowerCase();
        if (lower.includes('ai')) return 'leveraging AI-powered automation';
        if (lower.includes('simple')) return 'making complex processes simple and intuitive';
        if (lower.includes('custom')) return 'providing fully customized solutions';
        return 'using a unique methodology that eliminates common bottlenecks';
    };

    const identifyNiches = () => {
        const niches = [];
        const users = productData.typicalUsers?.toLowerCase() || '';

        if (users.includes('entrepreneur')) niches.push('Startup founders and early-stage entrepreneurs');
        if (users.includes('coach')) niches.push('Coaches, consultants, and service providers');
        if (users.includes('freelancer')) niches.push('Freelancers and solopreneurs building their practice');
        if (users.includes('small business')) niches.push('Small to medium-sized businesses (SMBs)');

        if (niches.length === 0) {
            niches.push('Professionals seeking efficiency and better results');
            niches.push('Business owners looking to streamline operations');
        }

        return niches.slice(0, 4);
    };

    const generateDemographics = () => {
        const price = productData.priceRange || 'mid-range';
        const demographics = [];

        if (price === 'luxury' || price === 'premium') {
            demographics.push('Income: $80K-$200K+ annually');
        } else if (price === 'budget') {
            demographics.push('Income: $35K-$80K annually');
        } else {
            demographics.push('Income: $50K-$120K annually');
        }

        demographics.push('Age: 28-50 years');
        demographics.push('Location: Global (remote-first professionals)');
        demographics.push('Work Style: Independent or small team environments');

        return demographics;
    };

    const generatePsychographics = () => {
        const psychographics = [];
        const emotional = productData.emotionalBenefit?.toLowerCase() || '';

        if (emotional.includes('confidence')) psychographics.push('Desires: Confidence and mastery in their field');
        if (emotional.includes('freedom')) psychographics.push('Desires: Autonomy and control over their work');
        if (emotional.includes('peace')) psychographics.push('Desires: Peace of mind and reduced overwhelm');

        psychographics.push('Motivated by: Growth, efficiency, and results');
        psychographics.push('Values: Innovation and continuous improvement');

        return psychographics;
    };

    const generateBuyingTriggers = () => {
        return [
            'Already struggling with time management',
            'Looking for ways to increase income or revenue',
            'Seeking to optimize workflows and processes',
            'Ready to invest in quality solutions',
            'Values proven results over experimenting'
        ];
    };

    const generateInterestHooks = () => {
        const problem = productData.problemSolved || 'common challenges';
        const name = productData.productName || 'this solution';

        return [
            `Tired of ${problem.split(' ').slice(0, 3).join(' ')}? There's a better way.`,
            `${name} - the approach you've been missing.`,
            `Stop struggling. Start achieving with ${name}.`,
            `What if you could solve ${problem.split(' ').slice(0, 4).join(' ')} in half the time?`
        ];
    };

    const generateIntentSignals = () => {
        return [
            'Mentions working long hours or feeling overwhelmed',
            'Talks about wanting to scale or increase revenue',
            'Complains about inefficient systems or processes',
            'Actively researching solutions in your category',
            'Has budget allocated for problem-solving tools'
        ];
    };

    const generateCTAs = () => {
        const format = productData.deliveryFormat || '';
        const name = productData.productName || 'this solution';

        if (format === 'saas' || format === 'digital') {
            return [
                `Try ${name} free for 14 days - no credit card required.`,
                `See ${name} in action - book a quick 10-minute demo.`,
                `Get started with ${name} today - see results within 30 days.`
            ];
        } else if (format === 'service') {
            return [
                `Book a free 20-minute consultation to see if ${name} is right for you.`,
                `Schedule a strategy call to explore how ${name} can help.`,
                `Ready to transform your results? Let's talk about ${name}.`
            ];
        }

        return [
            `Get started with ${name} today.`,
            `Join hundreds of satisfied customers.`,
            `Ready to transform your results? Let's connect.`
        ];
    };

    const startNewAnalysis = () => {
        if (window.confirm('Start a new analysis? All current data will be cleared.')) {
            setProductData({});
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayMessage('New analysis started!');
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
            {['Product Core', 'Features', 'Benefits', 'Market Position', 'AI Analysis'].map((label, idx) => (
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
                        <h1>IMI Product Profiler</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}

                {/* Step 1 */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">Define Your Product Core</h2>
                        <p className="section-subtitle">Let's start by understanding what your product is and what problem it solves</p>

                        <div className="form-group">
                            <label>Product/Service Name *</label>
                            <input type="text" value={productData.productName || ''} onChange={(e) => updateField('productName', e.target.value)} placeholder="e.g., FocusFlow Planner" />
                        </div>

                        <div className="form-group">
                            <label>Short Description</label>
                            <textarea value={productData.productDescription || ''} onChange={(e) => updateField('productDescription', e.target.value)} placeholder="Describe what your product is in simple terms..." />
                        </div>

                        <div className="form-group">
                            <label>What specific problem does it solve? *</label>
                            <textarea value={productData.problemSolved || ''} onChange={(e) => updateField('problemSolved', e.target.value)} placeholder="What pain point or challenge does your product address?" />
                        </div>

                        <div className="navigation-buttons">
                            <div></div>
                            <button className="btn" onClick={nextStep}>Next: Features & Differentiators</button>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">Features & What Makes You Unique</h2>
                        <p className="section-subtitle">Identify your key features and competitive advantages</p>

                        <div className="form-group">
                            <label>Top 3 Features (one per line) *</label>
                            <textarea value={productData.topFeatures || ''} onChange={(e) => updateField('topFeatures', e.target.value)} placeholder="Feature 1:&#10;Feature 2:&#10;Feature 3:" />
                        </div>

                        <div className="form-group">
                            <label>What makes your product different or unique? *</label>
                            <textarea value={productData.differentiator || ''} onChange={(e) => updateField('differentiator', e.target.value)} placeholder="What sets you apart from competitors in the market?" />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={nextStep}>Next: Benefits & Value</button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <h2 className="section-title">Benefits & Value Proposition</h2>
                        <p className="section-subtitle">Define the tangible and emotional value your product delivers</p>

                        <div className="form-group">
                            <label>Tangible Benefits *</label>
                            <textarea value={productData.tangibleBenefit || ''} onChange={(e) => updateField('tangibleBenefit', e.target.value)} placeholder="What measurable outcomes do users get? (saves time, saves money, increases revenue, etc.)" />
                        </div>

                        <div className="form-group">
                            <label>Emotional Benefits</label>
                            <textarea value={productData.emotionalBenefit || ''} onChange={(e) => updateField('emotionalBenefit', e.target.value)} placeholder="How does your product make people feel? (confidence, peace of mind, freedom, status, etc.)" />
                        </div>

                        <div className="navigation-buttons">
                            <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                            <button className="btn" onClick={nextStep}>Next: Market Position</button>
                        </div>
                    </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                    <div className="form-section">
                        <h2 className="section-title">Market Position & Use Cases</h2>
                        <p className="section-subtitle">Define your pricing strategy and target usage scenarios</p>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>Price Range/Market Position *</label>
                                <select value={productData.priceRange || ''} onChange={(e) => updateField('priceRange', e.target.value)}>
                                    <option value="">Select Position</option>
                                    <option value="budget">Budget (Low-cost/Affordable)</option>
                                    <option value="mid-range">Mid-Range (Fair value)</option>
                                    <option value="premium">Premium (High-value)</option>
                                    <option value="luxury">Luxury (Exclusive/Elite)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Delivery Format *</label>
                                <select value={productData.deliveryFormat || ''} onChange={(e) => updateField('deliveryFormat', e.target.value)}>
                                    <option value="">Select Format</option>
                                    <option value="digital">Digital Product</option>
                                    <option value="saas">SaaS/Subscription</option>
                                    <option value="service">Service/Consulting</option>
                                    <option value="physical">Physical Product</option>
                                    <option value="hybrid">Hybrid (Multiple formats)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Who typically uses your product? *</label>
                            <textarea value={productData.typicalUsers || ''} onChange={(e) => updateField('typicalUsers', e.target.value)} placeholder="Describe the types of people or businesses that benefit most from your product..." />
                        </div>

                        <div className="form-group">
                            <label>When or where is your product most often used?</label>
                            <textarea value={productData.usageContext || ''} onChange={(e) => updateField('usageContext', e.target.value)} placeholder="Describe the situations, contexts, or scenarios where your product is used..." />
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
                        <div className="ai-badge">AI-Powered Product Analysis</div>
                        <h2 className="section-title">Your Product Profile & Target Market</h2>
                        <p className="section-subtitle">Comprehensive analysis with ideal customer avatar and positioning strategy</p>

                        <div className="results-section">
                            <h3>Unique Value Proposition (UVP)</h3>
                            <div style={{ background: 'linear-gradient(135deg, #f8f9fa, #e3f2fd)', border: '3px solid var(--electric-blue)', padding: '30px', borderRadius: '15px', textAlign: 'center', fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.8' }}>
                                "{productData.productName || 'This product'} helps {extractAudience(productData.typicalUsers)} achieve {extractCoreResult(productData.tangibleBenefit)} by {extractDifferentiator(productData.differentiator)}."
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Target Niche Options</h3>
                            <div className="analysis-card">
                                <h4>Recommended Target Niches</h4>
                                <ul>
                                    {identifyNiches().map((niche, idx) => (
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
                                        {generateDemographics().map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="analysis-card">
                                    <h4>Psychographics</h4>
                                    <ul>
                                        {generatePsychographics().map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="analysis-card">
                                    <h4>Buying Triggers</h4>
                                    <ul>
                                        {generateBuyingTriggers().map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="results-section">
                            <h3>Messaging & Marketing Suggestions</h3>
                            <div className="analysis-card">
                                <h4>Interest Hooks (Attention Grabbers)</h4>
                                <ul>
                                    {generateInterestHooks().map((hook, idx) => (
                                        <li key={idx}>• "{hook}"</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="analysis-card">
                                <h4>Intent Signals (What to look for)</h4>
                                <ul>
                                    {generateIntentSignals().map((signal, idx) => (
                                        <li key={idx}>• {signal}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="analysis-card">
                                <h4>Call-to-Action Ideas</h4>
                                <ul>
                                    {generateCTAs().map((cta, idx) => (
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
