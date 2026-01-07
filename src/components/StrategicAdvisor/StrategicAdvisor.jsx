import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Send, Award, Copy, CheckCircle } from 'lucide-react';
import './StrategicAdvisor.css';

const StrategicAdvisor = () => {
    const [activeTab, setActiveTab] = useState('pitches');
    const [data, setData] = useState({
        compass: {},
        brand: {},
        product: {},
        prospect: {},
        conversation: {}
    });
    const [variationIndices, setVariationIndices] = useState({
        pitches: 0,
        outreach: 0,
        qa: 0
    });
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const loadAllData = () => {
            const compass = JSON.parse(localStorage.getItem('imi-compass-data') || '{}');
            const brand = JSON.parse(localStorage.getItem('imi-brand-data') || '{}');
            const product = JSON.parse(localStorage.getItem('imi-product-data') || '{}');
            const prospect = JSON.parse(localStorage.getItem('imi-prospect-data') || '{}');
            const conversation = JSON.parse(localStorage.getItem('imi-conversation-data') || '{}');

            setData({ compass, brand, product, prospect, conversation });
        };
        loadAllData();
    }, []);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const regenerate = (type) => {
        setVariationIndices(prev => ({
            ...prev,
            [type]: (prev[type] + 1) % 5
        }));
    };

    const getPitches = () => {
        const v = variationIndices.pitches;
        const brand = data.brand.brandName || 'your brand';
        const product = data.product.productName || 'our solution';
        const role = data.prospect.jobTitle || 'business leaders';
        const industry = data.prospect.industry || 'your industry';
        const pain = data.prospect.painPoints?.split('.')[0] || 'efficiency gaps';
        const benefit = data.product.tangibleBenefit || 'maximum results';
        const diff = data.product.differentiator || 'unique methodology';
        const objective = data.compass.objective || 'growth';

        const variations = [
            // Variation 0: Classic/Direct
            [
                { id: 'p1_0', tag: 'The Elevator Pitch (30s)', content: `You know how ${role} struggle with ${pain}? I've developed ${product} that specifically helps ${industry} companies achieve ${benefit}. Unlike traditional approaches, we focus on ${diff} to ensure ${brand} stays ahead.` },
                { id: 'p2_0', tag: 'The Strategic Hook', content: `Most ${industry} competitors ignore ${data.prospect.values || 'core market values'}. At ${brand}, we align your ${product} with ${objective} goals to bypass ${pain} entirely.` }
            ],
            // Variation 1: Problem-Solution Focused
            [
                { id: 'p1_1', tag: 'The Pain-Point Pivot', content: `Stop letting ${pain} drain your resources. ${product} was engineered for ${industry} to turn that specific bottleneck into ${benefit}. This is the ${diff} your ${role} teams have been waiting for.` },
                { id: 'p2_1', tag: 'The Efficiency Pitch', content: `Efficiency in ${industry} isn't just about software; it's about ${objective}. ${brand} combines your current ${product} with a focus on ${diff} to deliver ${benefit} in record time.` }
            ],
            // Variation 2: Visionary/Future-First
            [
                { id: 'p1_2', tag: 'The Visionary Pitch', content: `The future of ${industry} belongs to those who master ${objective}. With ${product}, ${brand} is redefining how ${role} achieve ${benefit}. We don't just solve ${pain}; we automate excellence.` },
                { id: 'p2_2', tag: 'The Capability Hook', content: `Imagine a world where ${pain} no longer limits your ${brand}. By leveraging ${product} and our ${diff}, you can finally scale ${objective} without compromise.` }
            ],
            // Variation 3: Data-Driven/Authority
            [
                { id: 'p1_3', tag: 'The Authority Pitch', content: `After analyzing 200+ ${industry} companies, we found ${pain} is the #1 killer of ${objective}. ${product} is the only solution that utilizes ${diff} to guarantee ${benefit} for ${role}.` },
                { id: 'p2_3', tag: 'The Analytics Hook', content: `The data is clear: ${industry} needs better ${product}. ${brand} delivers ${benefit} by mapping your ${objective} against ${data.prospect.values || 'proven values'}.` }
            ],
            // Variation 4: Relatable/Connection
            [
                { id: 'p1_4', tag: 'The Authentic Pitch', content: `We started ${brand} because we were tired of seeing ${role} struggle with ${pain}. ${product} is our answer—a simple, ${diff} approach to ${benefit} in the ${industry} space.` },
                { id: 'p2_4', tag: 'The Community Hook', content: `Join the ${industry} leaders who have moved beyond ${pain} and into ${objective}. Our ${product} makes the transition to ${benefit} feel natural and rewarding.` }
            ]
        ];
        return variations[v];
    };

    const getOutreach = () => {
        const v = variationIndices.outreach;
        const brand = data.brand.brandName || 'our team';
        const product = data.product.productName || 'solution';
        const role = data.prospect.jobTitle || 'leader';
        const industry = data.prospect.industry || 'sector';
        const pain = data.prospect.painPoints?.split('.')[0] || 'strategic gaps';
        const benefit = data.product.tangibleBenefit || 'growth';
        const objective = data.compass.objective || 'scaling';

        const variations = [
            // Variation 0
            [
                { id: 'o1_0', tag: 'LinkedIn Connection', content: `Hi [First Name], I noticed your work in ${industry}. As a fellow professional focused on ${objective}, I'd love to connect and share insights on how ${role}s are tackling ${pain}.` },
                { id: 'o2_0', tag: 'Direct Email', content: `Subject: Solving ${pain} at [Company]\n\nHi [Name],\n\nI've followed [Company] in ${industry}. We recently helped a similar brand achieve ${benefit} by focusing on ${objective}. Worth a 10-minute chat about ${product}?` }
            ],
            // Variation 1
            [
                { id: 'o1_1', tag: 'The Curiosity Invite', content: `Hi [Name], wondered if you've seen the recent shift in ${industry} regarding ${pain}. I'm seeing a lot of ${role}s moving toward ${objective}—would love to connect.` },
                { id: 'o2_1', tag: 'The Case Study Email', content: `Subject: ${benefit} for your ${role} team\n\nHi [Name], we just finished a project in ${industry} that reduced ${pain} by 40%. Given your focus on ${objective}, I thought our ${brand} approach might interest you.` }
            ],
            // Variation 2
            [
                { id: 'o1_2', tag: 'The Value Prop Request', content: `Hi [Name], I'm researching how ${role}s manage ${pain} in the ${industry} space. At ${brand}, we've found a way to automate ${objective}. Love to connect.` },
                { id: 'o2_2', tag: 'The Direct Offer', content: `Subject: A better way to ${objective}?\n\nHi [Name], are you still dealing with ${pain}? Our ${product} was designed to help ${industry} brands like yours hit ${benefit} without the usual headache.` }
            ],
            // Variation 3
            [
                { id: 'o1_3', tag: 'The Local/Industry Peer', content: `Hi [Name], connecting with fellow ${industry} experts. I specialize in helping ${role} transitions from ${pain} to ${objective}. Hope to learn more about [Company]!` },
                { id: 'o2_3', tag: 'The Referral Style', content: `Subject: Referral intro: ${brand} & [Company]\n\nHi [Name], I was looking at your ${industry} footprint and noticed a potential for ${benefit}. Our ${product} has been a game-changer for ${role}s struggling with ${pain}.` }
            ],
            // Variation 4
            [
                { id: 'o1_4', tag: 'The Soft Intro', content: `Hi [Name], love what you're doing at [Company]. I'm working with ${industry} leaders on ${objective} strategies. Let's connect and trade notes.` },
                { id: 'o2_4', tag: 'The No-Pressure Email', content: `Subject: Quick question about ${industry} growth\n\nHi [Name], I have a quick idea on how to solve ${pain} for [Company] using ${data.product.differentiator || 'a new method'}. No pitch, just a 5-min intro if you're curious?` }
            ]
        ];
        return variations[v];
    };

    const getQuestions = () => {
        const v = variationIndices.qa;
        const objective = data.compass.objective || 'growth';
        const product = data.product.productName || 'product';
        const brand = data.brand.brandName || 'brand';
        const industry = data.prospect.industry || 'industry';
        const role = data.prospect.jobTitle || 'prospect';

        const variations = [
            [
                { q: "How does this alignment improve my ROI?", a: `By focusing on your ${objective}, we eliminate the 30% waste usually spent on misaligned marketing efforts. This ensures every dollar spent on ${product} directly supports your outcome.` },
                { q: "What makes this different from other strategies?", a: `Most strategies are generic. Yours is built on the unique intersection of ${brand} personality and the deep emotional triggers of your ${role}s.` }
            ],
            [
                { q: "How quickly can I expect results?", a: `Because we leverage your existing ${data.brand.brandVoice?.join(', ') || 'brand voice'} and pair it with ${product}, most clients see a shift in prospect engagement within the first 14 days of implementation.` },
                { q: "Is this scalable for larger teams?", a: `Absolutely. The ${data.product.differentiator || 'methodology'} we've defined is designed for ${objective} scenarios, making it easy to replicate across multiple ${industry} teams.` }
            ],
            [
                { q: "What are the common pitfalls to avoid?", a: `The biggest risk in ${industry} is falling back into ${data.prospect.painPoints?.split('.')[0] || 'old habits'}. Stay focused on your ${objective} and the specific ${data.prospect.values || 'values'} we've identified.` },
                { q: "How do I handle objections about price?", a: `Shift the focus from cost to the ${data.product.tangibleBenefit || 'strategic benefit'}. Your ${product} isn't an expense; it's the antidote to the ${data.prospect.painPoints?.split('.')[1] || 'current bottlenecks'} they are facing.` }
            ],
            [
                { q: "Can this work for a brand new product?", a: `Yes, in fact it's better. By starting with the ${brand} foundation and mapping directly to ${role} needs, you bypass the 'testing' phase most brands waste months on.` },
                { q: "How do I maintain brand consistency?", a: `Use the ${data.brand.brandVoice?.join(', ') || 'brand guidelines'} we established in the Brand Evaluator. They are designed to keep your messaging cohesive across all ${data.prospect.platforms?.join(', ') || 'communications'}.` }
            ],
            [
                { q: "What should my first 24 hours look like?", a: `Start by sending the ${variationIndices.outreach === 0 ? 'Variation 0' : 'Regenerated'} outreach messages to 5 key ${role}s. Use the ${product} UVP as your central hook.` },
                { q: "How do I measure success beyond sales?", a: `Track the quality of the conversations. If ${role}s are responding with curiosity about your ${data.product.differentiator || 'uniqueness'}, your ${objective} strategy is working.` }
            ]
        ];
        return variations[v];
    };


    return (
        <div className="strategic-advisor tool-wrapper">
            <div className="advisor-hero">
                <Sparkles size={48} className="locked-icon" style={{ color: 'var(--electric-blue)' }} />
                <h2>Strategic Pitch Master</h2>
                <p>All your IMI insights consolidated into winning pitches and messages.</p>
            </div>

            <div className="container">
                <div className="advisor-tabs">
                    <button className={`tab-btn ${activeTab === 'pitches' ? 'active' : ''}`} onClick={() => setActiveTab('pitches')}>
                        <Award size={18} /> Sales Pitches
                    </button>
                    <button className={`tab-btn ${activeTab === 'outreach' ? 'active' : ''}`} onClick={() => setActiveTab('outreach')}>
                        <Send size={18} /> Outreach Messages
                    </button>
                    <button className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>
                        <MessageSquare size={18} /> Strategic Q&A
                    </button>
                </div>

                {activeTab === 'pitches' && (
                    <div className="tool-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3>Dynamic Sales Pitches</h3>
                                <p className="section-subtitle">Variation {variationIndices.pitches + 1} of 5</p>
                            </div>
                            <button className="regenerate-btn" onClick={() => regenerate('pitches')}>
                                <Sparkles size={16} /> Regenerate Variations
                            </button>
                        </div>
                        {getPitches().map(pitch => (
                            <div key={pitch.id} className="output-card">
                                <span className="output-tag">{pitch.tag}</span>
                                <div className="output-content">{pitch.content}</div>
                                <button className="copy-btn" onClick={() => handleCopy(pitch.content, pitch.id)}>
                                    {copiedId === pitch.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copiedId === pitch.id ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'outreach' && (
                    <div className="tool-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3>Connection & Outreach</h3>
                                <p className="section-subtitle">Variation {variationIndices.outreach + 1} of 5</p>
                            </div>
                            <button className="regenerate-btn" onClick={() => regenerate('outreach')}>
                                <Sparkles size={16} /> Regenerate Messages
                            </button>
                        </div>
                        {getOutreach().map(msg => (
                            <div key={msg.id} className="output-card">
                                <span className="output-tag">{msg.tag}</span>
                                <div className="output-content">{msg.content}</div>
                                <button className="copy-btn" onClick={() => handleCopy(msg.content, msg.id)}>
                                    {copiedId === msg.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copiedId === msg.id ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'qa' && (
                    <div className="tool-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3>Interactive Strategic Q&A</h3>
                                <p className="section-subtitle">Variation {variationIndices.qa + 1} of 5</p>
                            </div>
                            <button className="regenerate-btn" onClick={() => regenerate('qa')}>
                                <Sparkles size={16} /> Regenerate Q&A
                            </button>
                        </div>
                        <div className="qa-container">
                            {getQuestions().map((item, idx) => (
                                <div key={idx} className="output-card" style={{ marginBottom: '20px' }}>
                                    <h4 style={{ color: 'var(--electric-blue)', marginBottom: '10px' }}>Q: {item.q}</h4>
                                    <div className="output-content" style={{ fontSize: '1rem', borderLeft: '3px solid var(--electric-blue)', paddingLeft: '15px' }}>
                                        {item.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StrategicAdvisor;
