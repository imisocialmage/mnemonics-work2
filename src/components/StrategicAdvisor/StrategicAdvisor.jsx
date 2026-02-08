import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, MessageSquare, Send, Award, Copy, CheckCircle, Bot, Eraser, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    classifyIntent,
    extractEntities,
    initConversationContext,
    updateConversationContext,
    detectStuckUser,
    scoreResponse,
    generateSmartFallback,
    classifyAllIntents,
    learnFromInteraction,
    getProactiveSuggestions,
    generateGeminiPrompt
} from '../../utils/aiEngine';
import { getGeminiResponse } from '../../utils/geminiClient';
import { useAuth } from '../Auth/AuthProvider';
import AIFeatureGate from '../Auth/AIFeatureGate';
import './StrategicAdvisor.css';

const StrategicAdvisor = ({ profileIndex }) => {
    const { t } = useTranslation();
    const { isAuthenticated, credits, refreshCredits } = useAuth();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [activeTab, setActiveTab] = useState('pitches');
    const [data, setData] = useState({
        compass: {},
        brand: {},
        product: {},
        prospect: {},
        conversation: {},
        eliteData: {},
        lastAdvice: {}
    });
    const [variationIndices, setVariationIndices] = useState({
        pitches: 0,
        outreach: 0,
        qa: 0
    });
    const [copiedId, setCopiedId] = useState(null);

    // AI Chat State
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-advisor-chat'));
        return saved ? JSON.parse(saved) : [];
    });
    const [isTyping, setIsTyping] = useState(false);
    const [quickChoices, setQuickChoices] = useState([]);
    const [syncStatus, setSyncStatus] = useState('idle');

    // --- EFFECT: Load Data ---
    const [conversationContext, setConversationContext] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-advisor-context'));
        return saved ? JSON.parse(saved) : initConversationContext();
    });
    const messagesEndRef = React.useRef(null);

    useEffect(() => {
        const loadAllData = () => {
            const currentIdx = parseInt(localStorage.getItem('imi-active-profile') || '0');

            const getProfileData = (idx) => {
                const prefix = `imi-p${idx}-`;
                return {
                    index: idx,
                    compass: JSON.parse(localStorage.getItem(`${prefix}imi-compass-data`) || '{}'),
                    brand: JSON.parse(localStorage.getItem(`${prefix}imi-brand-data`) || '{}'),
                    product: JSON.parse(localStorage.getItem(`${prefix}imi-product-data`) || '{}'),
                    prospect: JSON.parse(localStorage.getItem(`${prefix}imi-prospect-data`) || '{}'),
                    conversation: JSON.parse(localStorage.getItem(`${prefix}imi-conversation-data`) || '{}'),
                };
            };

            const profiles = [0, 1, 2].map(getProfileData);
            const current = profiles[currentIdx];

            const prefix = `imi-p${currentIdx}-`;
            const eliteData = JSON.parse(localStorage.getItem(`${prefix}myProgressData`) || '{}');
            const lastAdvice = JSON.parse(localStorage.getItem(`${prefix}imi-last-advice`) || '{}');

            setData({
                ...current,
                profiles, // All profiles for AI context
                eliteData,
                lastAdvice
            });
        };
        loadAllData();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-advisor-chat'), JSON.stringify(messages));
        localStorage.setItem(getProfileKey('imi-advisor-context'), JSON.stringify(conversationContext));
    }, [messages, conversationContext, getProfileKey]);

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
        const values = data.prospect.values || 'core market values';
        const objective = data.compass.objective || 'growth';
        const adviceTextRaw = data.lastAdvice?.advice?.highlight || data.lastAdvice?.advice?.mission || '';
        const adviceText = typeof adviceTextRaw === 'string' ? ` ${adviceTextRaw.split('.')[0]}.` : '';
        const userLevel = data.eliteData?.skillLevel ? ` as an expert ${data.eliteData.skillLevel}` : '';

        const context = { brand, product, role, industry, pain, benefit, diff, values, objective, adviceText, userLevel };
        const templates = t('advisor.pitches', { returnObjects: true }) || [];

        if (!templates[v]) return [];

        return templates[v].map((p, idx) => ({
            id: `p${idx}_${v}`,
            tag: p.tag,
            content: t(`advisor.pitches.${v}.${idx}.content`, context)
        }));
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
        const diff = data.product.differentiator || 'unique approach';

        const context = { brand, product, role, industry, pain, benefit, objective, diff };
        const templates = t('advisor.outreach', { returnObjects: true }) || [];

        if (!templates[v]) return [];

        return templates[v].map((m, idx) => ({
            id: `o${idx}_${v}`,
            tag: m.tag,
            content: t(`advisor.outreach.${v}.${idx}.content`, context)
        }));
    };

    const getQuestions = () => {
        const v = variationIndices.qa;
        const objective = data.compass.objective || 'growth';
        const product = data.product.productName || 'product';
        const brand = data.brand.brandName || 'brand';
        const industry = data.prospect.industry || 'industry';
        const role = data.prospect.jobTitle || 'prospect';
        const voice = data.brand.brandVoice?.join(', ') || 'brand guidelines';
        const diff = data.product.differentiator || 'uniqueness';
        const values = data.prospect.values || 'core values';
        const bottlenecks = data.prospect.painPoints?.split('.')[1] || 'current bottlenecks';
        const channels = data.prospect.platforms?.join(', ') || 'communications';

        const context = { objective, product, brand, industry, role, voice, diff, values, bottlenecks, channels, variation: v };
        const templates = t('advisor.qa', { returnObjects: true }) || [];

        if (!templates[v]) return [];

        return templates[v].map((q, idx) => ({
            q: t(`advisor.qa.${v}.${idx}.q`, context),
            a: t(`advisor.qa.${v}.${idx}.a`, context)
        }));
    };

    // Enhanced AI Engine Logic with Intent Classification
    const generateAIResponse = (input) => {
        // --- GLOBAL DATA SYNTHESIS ---
        // Use the pre-loaded data from props/state which already respects the profileIndex
        const bData = data.brand || {};
        const pData = data.prospect || {};
        const cData = data.compass || {};
        const eData = data.eliteData || {};

        const availableData = {
            brandName: bData.brandName,
            usp: bData.differentiator,
            jobTitle: pData.jobTitle,
            industry: pData.industry,
            prospectType: pData.prospectType,
            painPoints: pData.painPoints,
            painPoint: pData.painPoints?.split('.')[0],
            level: eData.skillLevel,
            objective: cData.objective,
            compassData: data.lastAdvice?.nodeId ? true : false
        };

        const brand = availableData.brandName || 'your brand';
        const role = availableData.jobTitle || 'target audience';
        const targetIndustry = availableData.industry || 'your market';
        const prospectType = availableData.prospectType || 'B2B';
        const painPoint = availableData.painPoint || 'strategic gaps';
        const level = availableData.level || 'Elite Member';
        const objective = availableData.objective || 'Growth';
        const lastHighlight = data.lastAdvice?.advice?.highlight || data.lastAdvice?.advice?.mission || '';
        const nodeId = data.lastAdvice?.nodeId || 'Strategic Alignment';

        const context = {
            ...availableData,
            brand, usp: availableData.usp, role, targetIndustry, prospectType,
            painPoint, level, objective, highlight: lastHighlight, nodeId,
            input, messageCount: conversationContext.messageCount,
            lastIntent: conversationContext.lastIntent,
            followUpCount: conversationContext.followUpCount,
            topicsDiscussed: conversationContext.topics
        };

        // Extract entities from input
        const entities = extractEntities(input, availableData);

        // Classify intent with confidence scoring
        const intents = classifyIntent(input, {
            ...context,
            messageCount: conversationContext.messageCount,
            lastIntent: conversationContext.lastIntent,
            followUpCount: conversationContext.followUpCount,
            topics: conversationContext.topics
        });

        // Check if user seems stuck
        const stuckDetection = detectStuckUser(conversationContext);
        if (stuckDetection.shouldIntervene) {
            setQuickChoices([
                t('advisor.ai_responses.try_different'),
                t('advisor.ai_responses.show_capabilities'),
                t('nav.compass')
            ]);
            return t('advisor.ai_responses.stuck_detection', {
                topic: conversationContext.lastIntent || 'this topic'
            });
        }

        // Multi-intent handling - show secondary intents as quick actions
        const allIntents = classifyAllIntents(input, context);
        if (allIntents.length > 1) {
            const secondaryChoices = allIntents.slice(1, 4).map(intent => {
                const intentLabels = {
                    nextSteps: t('advisor.ai_responses.explain_roadmap'),
                    pitchHelp: t('advisor.ai_responses.improve_pitch'),
                    compassAnalysis: t('nav.compass'),
                    profileCheck: t('nav.brand'),
                    helpRequest: t('common.help') || 'Help'
                };
                return intentLabels[intent.intent] || intent.intent;
            });
            setQuickChoices(secondaryChoices);
        }

        // Handle no clear intent or ambiguous input
        if (intents.length === 0 || intents[0].score < 0.2) {
            const fallback = generateSmartFallback(input, context);
            setQuickChoices(fallback.suggestionKeys.map(key => t(key)));
            return t(fallback.messageKey, {
                input,
                context: level,
                options: fallback.intents ? fallback.intents.map(i => i.intent).join(', ') : ''
            });
        }

        const primaryIntent = intents[0];

        // 3. Learning & Adaptation
        learnFromInteraction(conversationContext, primaryIntent);
        // In a full backend, we'd save these preferences. For now, we just log them or use them to adjust tone locally if needed.

        // Generate response based on primary intent
        let responseText = '';

        switch (primaryIntent.intent) {
            case 'greeting':
                setQuickChoices([t('nav.brand'), t('elite.tabs.milestones'), t('advisor.tabs.pitches')]);
                responseText = conversationContext.messageCount > 3
                    ? t('advisor.ai_responses.greeting_returning', context)
                    : t('advisor.ai_responses.greeting_new', context);
                break;

            case 'nextSteps': {
                setQuickChoices([
                    t('advisor.ai_responses.explain_roadmap'),
                    t('advisor.ai_responses.show_tactic'),
                    t('advisor.ai_responses.why_needed')
                ]);
                responseText = t('advisor.ai_responses.next_step', context);

                // Proactive Suggestion Check
                const currentIdx = parseInt(localStorage.getItem('imi-active-profile') || '0');
                const prefix = `imi-p${currentIdx}-`;
                const soloData = JSON.parse(localStorage.getItem(`${prefix}imi-solocorp-data`) || '{}');
                const proactive = getProactiveSuggestions(conversationContext, soloData);
                if (proactive.length > 0) {
                    responseText += `\n\n💡 ${t('advisor.ai_responses.proactive_tip')}: ${t(proactive[0].label)}`;
                }
                break;
            }

            case 'pitchHelp':
                setQuickChoices([
                    t('advisor.tabs.pitches'),
                    t('advisor.ai_responses.improve_pitch'),
                    t('advisor.ai_responses.why_this_tactic')
                ]);
                responseText = t('advisor.ai_responses.pitch_improve', context);
                break;

            case 'compassAnalysis':
                setQuickChoices([
                    t('advisor.ai_responses.why_needed'),
                    t('advisor.ai_responses.explain_roadmap'),
                    t('nav.compass')
                ]);
                responseText = lastHighlight
                    ? t('advisor.ai_responses.compass_analysis', context)
                    : t('advisor.ai_responses.compass_missing', context);
                break;

            case 'profileCheck':
                setQuickChoices([t('nav.brand'), t('nav.prospect'), t('elite.tabs.milestones')]);
                responseText = t('advisor.ai_responses.who_am_i', context);
                break;

            case 'helpRequest':
                setQuickChoices([
                    t('advisor.ai_responses.guided_tour'),
                    t('advisor.ai_responses.show_capabilities'),
                    t('nav.compass')
                ]);
                responseText = t('advisor.ai_responses.no_match', { input, context: brand });
                break;

            case 'dataCompletion': {
                const missingData = ['brandName', 'industry', 'objective']
                    .filter(key => !availableData[key]);
                setQuickChoices(missingData.map(d => t(`nav.${d.replace('Name', '')}`)));
                responseText = t('advisor.ai_responses.suggest_completion', {
                    missing: missingData.join(', ')
                });
                break;
            }

            default:
                setQuickChoices([t('nav.compass'), t('nav.brand'), t('common.help') || 'Help']);
                responseText = t('advisor.ai_responses.who_am_i', context);
        }

        // Add confidence indicator for low-confidence responses
        const responseQuality = scoreResponse(primaryIntent, context, availableData);
        if (responseQuality.confidence < 0.6) {
            responseText = t('advisor.ai_responses.confidence_low', { context: brand }) + '\n\n' + responseText;
        }

        // Update conversation context
        setConversationContext(prev =>
            updateConversationContext(prev, input, primaryIntent, entities)
        );

        return responseText;
    };

    const handleGeminiSync = () => {
        const bData = JSON.parse(localStorage.getItem('imi-brand-data') || '{}');
        const cData = JSON.parse(localStorage.getItem('imi-compass-data') || '{}');
        const pData = JSON.parse(localStorage.getItem('imi-prospect-data') || '{}');

        const exportContext = {
            ...conversationContext,
            brand: bData.brandName,
            industry: pData.industry,
            prospectType: pData.prospectType,
            painPoints: pData.painPoints,
            objective: cData.objective
        };

        const prompt = generateGeminiPrompt(exportContext, messages, 'strategic');
        navigator.clipboard.writeText(prompt);
        setSyncStatus('copied');
        setTimeout(() => setSyncStatus('idle'), 3000);
    };

    const handleChoiceClick = (choice) => {
        // Navigation Map: Text -> Route ID
        const navMap = {
            [t('nav.brand')]: 'brand-evaluator',
            [t('nav.product')]: 'product-profiler',
            [t('nav.prospect')]: 'prospect-profiler',
            [t('nav.compass')]: 'compass',
            [t('advisor.ai_responses.fix_brand')]: 'brand-evaluator',
            [t('advisor.ai_responses.show_tactic')]: 'solocorp',
            [t('advisor.ai_responses.show_capabilities')]: 'conversation-guide'
        };

        if (navMap[choice]) {
            window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: navMap[choice] }));
            return;
        }

        setChatInput(choice);
        handleSendMessage(null, choice);
    };

    const handleLocalFallback = (finalInput, error = null) => {
        if (error) {
            console.log('Gemini API failed or skipped, using local engine fallback:', error);
        }

        setTimeout(() => {
            let fullResponse = generateAIResponse(finalInput);

            // Only append error message if it was a real API failure, not just a deliberate skip
            if (error) {
                // Log error but don't show to user for a seamless experience
                console.warn("Falling back to local engine due to API error:", error);
            }

            // Always add calibration link
            fullResponse += `\n\nI recommend booking a one-on-one calibration meeting with a coach if you need further assistance: https://calendly.com/imi-socialmediaimage/30min`;

            setIsTyping(false);

            const aiMsgId = Date.now() + 1;
            const newAiMsg = { role: 'assistant', content: '', id: aiMsgId, isStreaming: true };
            setMessages(prev => [...prev, newAiMsg]);

            let currentText = '';
            let index = 0;
            const streamInterval = setInterval(() => {
                if (index < fullResponse.length) {
                    currentText += fullResponse[index];
                    setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: currentText } : m));
                    index++;
                } else {
                    clearInterval(streamInterval);
                    setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
                }
            }, 10);
        }, 600);
    };

    const handleSendMessage = async (e, overrideInput) => {
        if (e) e.preventDefault();
        const finalInput = overrideInput || chatInput;
        if (!finalInput.trim()) return;

        const userMsg = { role: 'user', content: finalInput, id: Date.now() };

        // Optimistic UI updates
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);
        setQuickChoices([]);

        // If NOT authenticated, skip API entirely and use local engine
        if (!isAuthenticated) {
            handleLocalFallback(finalInput);
            return;
        }

        const currentIdx = parseInt(localStorage.getItem('imi-active-profile') || '0');
        const prefix = `imi-p${currentIdx}-`;

        const bData = JSON.parse(localStorage.getItem(`${prefix}imi-brand-data`) || '{}');
        const cData = JSON.parse(localStorage.getItem(`${prefix}imi-compass-data`) || '{}');
        const pData = JSON.parse(localStorage.getItem(`${prefix}imi-prospect-data`) || '{}');

        // Total profiles context for inconsistency check
        const allProfilesSummary = data.profiles?.map(p => ({
            id: p.index + 1,
            brand: p.brand.brandName || 'Untitled',
            audience: p.prospect.audience || p.compass.audience || 'Not set',
            objective: p.compass.objective || 'Not set'
        })) || [];

        const geminiContext = {
            ...conversationContext,
            brand: bData.brandName,
            industry: pData.industry,
            prospectType: pData.prospectType,
            painPoints: pData.painPoints,
            objective: cData.objective,
            allProfiles: allProfilesSummary // Pass all profiles to Gemini
        };

        const history = [...messages, userMsg].map(m => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : 'Content'
        }));

        try {
            // Attempt Gemini API Call
            const aiText = await getGeminiResponse(history, geminiContext, 'strategic');

            setIsTyping(false);

            // Create empty message for streaming effect
            const aiMsgId = Date.now() + 1;
            const aiMsg = {
                role: 'assistant',
                content: '',
                id: aiMsgId,
                isStreaming: true
            };
            setMessages(prev => [...prev, aiMsg]);

            // Stream the content (Typewriter Effect)
            let currentText = '';
            let index = 0;
            const chunkSize = 3; // Add characters in chunks for better speed/feel

            const streamInterval = setInterval(() => {
                if (index < aiText.length) {
                    const chunk = aiText.slice(index, index + chunkSize);
                    currentText += chunk;
                    index += chunkSize;
                    setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: currentText } : m));
                } else {
                    clearInterval(streamInterval);
                    setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiText, isStreaming: false } : m));
                    refreshCredits();
                }
            }, 15);

            // Update tracking context
            const primaryIntent = classifyIntent(finalInput).sort((a, b) => b.score - a.score)[0];
            setConversationContext(prev => updateConversationContext(prev, finalInput, primaryIntent, extractEntities(finalInput)));

        } catch (error) {
            handleLocalFallback(finalInput, error);
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem(getProfileKey('imi-advisor-chat'));
    };

    return (
        <div className="strategic-advisor tool-wrapper">
            <div className="advisor-hero">
                <Sparkles size={48} className="locked-icon" style={{ color: 'var(--electric-blue)' }} />
                <h2>{t('advisor.title')}</h2>
                <p>{t('advisor.description')}</p>
            </div>

            <div className="container">
                <div className="advisor-tabs">
                    <button className={`tab-btn ${activeTab === 'pitches' ? 'active' : ''}`} onClick={() => setActiveTab('pitches')}>
                        <Award size={18} /> {t('advisor.tabs.pitches')}
                    </button>
                    <button className={`tab-btn ${activeTab === 'outreach' ? 'active' : ''}`} onClick={() => setActiveTab('outreach')}>
                        <Send size={18} /> {t('advisor.tabs.outreach')}
                    </button>
                    <button className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>
                        <MessageSquare size={18} /> {t('advisor.tabs.qa')}
                    </button>
                    <button className={`tab-btn ${activeTab === 'advisor' ? 'active' : ''}`} onClick={() => setActiveTab('advisor')}>
                        <Bot size={18} /> {t('advisor.tabs.ai')}
                    </button>
                </div>

                {activeTab === 'pitches' && (
                    <div className="tool-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3>{t('advisor.pitches_header')}</h3>
                                <p className="section-subtitle">{t('advisor.variation_indicator', { current: variationIndices.pitches + 1, total: 5 })}</p>
                            </div>
                            <button className="regenerate-btn" onClick={() => regenerate('pitches')}>
                                <Sparkles size={16} /> {t('advisor.regenerate_pitches')}
                            </button>
                        </div>
                        {getPitches().map(pitch => (
                            <div key={pitch.id} className="output-card">
                                <span className="output-tag">{pitch.tag}</span>
                                <div className="output-content">{pitch.content}</div>
                                <button className="copy-btn" onClick={() => handleCopy(pitch.content, pitch.id)}>
                                    {copiedId === pitch.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copiedId === pitch.id ? t('advisor.copied') : t('advisor.copy_button')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'outreach' && (
                    <div className="tool-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3>{t('advisor.outreach_header')}</h3>
                                <p className="section-subtitle">{t('advisor.variation_indicator', { current: variationIndices.outreach + 1, total: 5 })}</p>
                            </div>
                            <button className="regenerate-btn" onClick={() => regenerate('outreach')}>
                                <Sparkles size={16} /> {t('advisor.regenerate_outreach')}
                            </button>
                        </div>
                        {getOutreach().map(msg => (
                            <div key={msg.id} className="output-card">
                                <span className="output-tag">{msg.tag}</span>
                                <div className="output-content">{msg.content}</div>
                                <button className="copy-btn" onClick={() => handleCopy(msg.content, msg.id)}>
                                    {copiedId === msg.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copiedId === msg.id ? t('advisor.copied') : t('advisor.copy_button')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'qa' && (
                    <div className="tool-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3>{t('advisor.qa_header')}</h3>
                                <p className="section-subtitle">{t('advisor.variation_indicator', { current: variationIndices.qa + 1, total: 5 })}</p>
                            </div>
                            <button className="regenerate-btn" onClick={() => regenerate('qa')}>
                                <Sparkles size={16} /> {t('advisor.regenerate_qa')}
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

                {activeTab === 'advisor' && (
                    <AIFeatureGate
                        featureName={t('advisor.ai_header')}
                        onProceedWithoutAuth={() => { }}
                    >
                        <div className="tool-panel ai-advisor-panel">
                            <div className="chat-header">
                                <div className="header-info">
                                    <Bot size={20} color="var(--electric-blue)" />
                                    <div>
                                        <h3>{t('advisor.ai_header')}</h3>
                                        <p className="section-subtitle">{t('advisor.ai_version')}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {credits !== null && (
                                        <div className="credit-badge" title="Remaining AI Credits" style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px',
                                            marginRight: '8px'
                                        }}>
                                            <Coins size={16} color="var(--amber-gold)" />
                                            <span style={{ fontWeight: 'bold', color: 'var(--amber-gold)' }}>{credits}</span>
                                        </div>
                                    )}
                                    <button className="clear-btn" onClick={handleGeminiSync} title={t('advisor.ai.gemini_sync')} style={{ width: 'auto', padding: '0 8px', gap: '5px' }}>
                                        <Sparkles size={16} /> {syncStatus === 'copied' ? t('advisor.ai.gemini_copied') : t('advisor.ai.gemini_sync')}
                                    </button>
                                    <button className="clear-btn" onClick={clearChat} title={t('advisor.ai.clear')}>
                                        <Eraser size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="chat-container">
                                <div className="msg bubble assistant-message">
                                    <div className="bubble-content">
                                        {t('advisor.ai.welcome')}
                                        <p style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.9 }}>
                                            {t('advisor.ai.book_call_instruction')}
                                        </p>
                                        <a
                                            href="https://calendly.com/imi-socialmediaimage/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="booking-btn"
                                            style={{
                                                display: 'inline-block',
                                                marginTop: '8px',
                                                padding: '8px 16px',
                                                backgroundColor: 'var(--amber-gold)',
                                                color: '#000',
                                                borderRadius: '20px',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                fontSize: '0.9em',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s'
                                            }}
                                        >
                                            {t('advisor.ai.book_calibration')}
                                        </a>
                                    </div>
                                </div>

                                {messages.map((m, i) => {
                                    const hasBookingLink = typeof m.content === 'string' && m.content.includes('calendly.com/imi-socialmediaimage/30min');
                                    return (
                                        <div key={m.id || i} className={`msg bubble ${m.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                                            <div className="bubble-content">
                                                {m.content}
                                                {m.isStreaming && <span className="streaming-cursor">|</span>}
                                                {hasBookingLink && !m.isStreaming && (
                                                    <a
                                                        href="https://calendly.com/imi-socialmediaimage/30min"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="booking-btn"
                                                        style={{
                                                            display: 'inline-block',
                                                            marginTop: '10px',
                                                            padding: '8px 16px',
                                                            backgroundColor: 'var(--amber-gold)',
                                                            color: '#000',
                                                            borderRadius: '20px',
                                                            textDecoration: 'none',
                                                            fontWeight: '600',
                                                            fontSize: '0.9em',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {t('advisor.ai.book_calibration')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>);
                                })}

                                {isTyping && (
                                    <div className="msg bubble assistant-message typing">
                                        <div className="bubble-content">{t('advisor.ai.thinking')}</div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Choice Bubbles */}
                            {quickChoices.length > 0 && (
                                <div className="choice-container">
                                    {quickChoices.map((choice, idx) => (
                                        <button
                                            key={idx}
                                            className="choice-bubble"
                                            onClick={() => handleChoiceClick(choice)}
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="chat-input-area">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder={t('advisor.ai.placeholder')}
                                />
                                <button type="submit" className="send-btn" disabled={!chatInput.trim()}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </AIFeatureGate>
                )}
            </div>
        </div >
    );
};

export default StrategicAdvisor;
