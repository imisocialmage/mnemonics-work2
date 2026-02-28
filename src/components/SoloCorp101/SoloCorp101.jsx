import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Calendar,
    Bot,
    MessageSquare,
    Zap,
    Send,
    Eraser,
    HelpCircle,
    Plus,
    ClipboardList,
    CheckCircle2,
    Flame,
    Sparkles,
    Trash2,
    X,
    Layout,
    ExternalLink,
    Lock,
    Image as ImageIcon,
    Coins
} from 'lucide-react';
import { SOLO_CORP_KNOWLEDGE } from '../../data/soloCorpData';
import { getLocalizedStrategicAdvice } from '../../data/compassData';
import AIFeatureGate from '../Auth/AIFeatureGate';
import { useAuth } from '../Auth/AuthProvider';
import {
    classifyIntent,
    extractEntities,
    initConversationContext,
    updateConversationContext,
    generateSmartFallback,
    learnFromInteraction,
    getProactiveSuggestions,
    generateGeminiPrompt
} from '../../utils/aiEngine';
import { getGeminiResponse } from '../../utils/geminiClient';
import './SoloCorp101.css';

const SoloCorp101 = ({ profileIndex }) => {
    const { t, i18n } = useTranslation();
    const { credits, refreshCredits } = useAuth();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [currentTab, setCurrentTab] = useState('coach');

    // Journey State
    const [soloData, setSoloData] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-solocorp-data'));
        const parsed = saved ? JSON.parse(saved) : {};
        return {
            startDate: parsed.startDate || new Date().toISOString().split('T')[0],
            activities: parsed.activities || [],
            completedDays: parsed.completedDays || [],
            exercises: parsed.exercises || []
        };
    });

    // Chat State
    const [soloInput, setSoloInput] = useState('');
    const [soloMessages, setSoloMessages] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-solocorp-chat-standalone'));
        return saved ? JSON.parse(saved) : [];
    });
    const [isSoloTyping, setIsSoloTyping] = useState(false);
    const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
    const [syncStatus, setSyncStatus] = useState('idle');

    // --- EFFECT: Load Data ---
    const [quickChoices, setQuickChoices] = useState([]);
    const [chatState, setChatState] = useState('idle'); // idle | context | tactic | exercise | logging
    const [conversationContext, setConversationContext] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-solocorp-context'));
        return saved ? JSON.parse(saved) : initConversationContext();
    });
    const soloMessagesEndRef = useRef(null);

    // Activity Form State
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [activityForm, setActivityForm] = useState({
        day: 1,
        title: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Exercise State
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const [exerciseForm, setExerciseForm] = useState({
        day: 1,
        title: '',
        content: '',
        link: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const savedData = localStorage.getItem(getProfileKey('imi-solocorp-data'));
        const parsed = savedData ? JSON.parse(savedData) : {};
        setSoloData({
            startDate: parsed.startDate || new Date().toISOString().split('T')[0],
            activities: parsed.activities || [],
            completedDays: parsed.completedDays || [],
            exercises: parsed.exercises || []
        });

        const savedMessages = localStorage.getItem(getProfileKey('imi-solocorp-chat-standalone'));
        setSoloMessages(savedMessages ? JSON.parse(savedMessages) : []);

        const savedContext = localStorage.getItem(getProfileKey('imi-solocorp-context'));
        setConversationContext(savedContext ? JSON.parse(savedContext) : initConversationContext());
    }, [profileIndex, getProfileKey]);

    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-solocorp-data'), JSON.stringify(soloData));
    }, [soloData, profileIndex, getProfileKey]);

    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-solocorp-chat-standalone'), JSON.stringify(soloMessages));
        localStorage.setItem(getProfileKey('imi-solocorp-context'), JSON.stringify(conversationContext));
        // Only scroll if there are messages
        if (soloMessages.length > 0) {
            soloMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [soloMessages, conversationContext, getProfileKey]);

    const getCurrentDay = () => {
        const start = new Date(soloData.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.min(30, Math.max(1, diffDays));
    };

    const getDayProgress = () => {
        return (soloData.completedDays.length / 30) * 100;
    };

    // Enhanced AI Engine Logic
    const generateSoloResponse = (input) => {
        const lowerInput = input.toLowerCase();
        const day = getCurrentDay();
        const memberProfile = JSON.parse(localStorage.getItem('imi-user-profile') || '{}');
        const name = memberProfile.memberName || 'Elite Member';

        // Data Extraction
        const compassData = JSON.parse(localStorage.getItem(getProfileKey('imi-compass-data')) || '{}');
        const objectiveId = compassData.objective;
        const brand = compassData.brandName || 'your business';
        const prospectData = JSON.parse(localStorage.getItem(getProfileKey('imi-prospect-data')) || '{}');
        const industry = prospectData.industry || 'your niche';

        // Get localized strategic advice
        const allAdvice = getLocalizedStrategicAdvice(i18n.language);
        const specificAdvice = allAdvice[objectiveId] || {};
        const timeline = specificAdvice.implementationTimeline || [];

        let dayData = null;
        for (const week of SOLO_CORP_KNOWLEDGE.weeks) {
            dayData = week.days.find(d => d.day === day);
            if (dayData) break;
        }

        // AI Context Construction
        const availableData = {
            brandName: brand !== 'your business' ? brand : null,
            objective: objectiveId,
            industry: industry !== 'your niche' ? industry : null,
            day: day,
            title: dayData?.title
        };

        const context = {
            ...availableData,
            name, brand, objectiveId, industry, day,
            input, messageCount: conversationContext.messageCount,
            lastIntent: conversationContext.lastIntent,
            followUpCount: conversationContext.followUpCount,
            topicsDiscussed: conversationContext.topics
        };

        const entities = extractEntities(input, availableData);

        // Custom intent classification including state-specific keywords
        let intents = classifyIntent(input, context);

        // Manual boosts for state-specific keywords to ensure flow continuity
        if (lowerInput.includes('tactic') || (chatState === 'context' && intents[0]?.intent === 'nextSteps')) {
            intents.unshift({ intent: 'showTactic', score: 0.95 });
        } else if (lowerInput.includes('exercise') || lowerInput.includes('task') || (chatState === 'tactic' && intents[0]?.intent === 'nextSteps')) {
            intents.unshift({ intent: 'showExercise', score: 0.95 });
        } else if (lowerInput.includes('log') || lowerInput.includes('accomplished') || (chatState === 'exercise' && (intents[0]?.intent === 'dataCompletion' || lowerInput.includes('done')))) {
            intents.unshift({ intent: 'logActivity', score: 0.95 });
        } else if (lowerInput.includes('calendar')) {
            intents.unshift({ intent: 'showCalendar', score: 0.95 });
        }

        const primaryIntent = intents[0] || { intent: 'unknown', score: 0 };

        // Learning
        learnFromInteraction(conversationContext, primaryIntent);

        // Update context
        setConversationContext(prev => updateConversationContext(prev, input, primaryIntent, entities));

        // 0. Proactive Data Warning
        const isMissingBrand = !availableData.brandName;
        if (isMissingBrand && primaryIntent.intent !== 'greeting') {
            setQuickChoices([t('advisor.ai_responses.fix_brand'), t('advisor.ai_responses.show_tactic'), t('advisor.ai_responses.why_needed')]);
            return t('advisor.solocorp.responses.missing_brand', { day });
        }

        // Handle Intents
        switch (primaryIntent.intent) {
            case 'greeting': {
                setChatState('context');
                setQuickChoices([t('advisor.ai_responses.show_tactic'), t('advisor.ai_responses.explain_roadmap'), t('advisor.ai_responses.improve_pitch')]);

                let greetingText = '';
                if (soloMessages.length > 3) {
                    greetingText = t('advisor.solocorp.responses.greeting_returning', { name, day, brand, objectiveId });
                } else {
                    greetingText = t('advisor.solocorp.responses.greeting_new', {
                        name, day, brand, objectiveId,
                        title: dayData?.title, quote: dayData?.quote,
                        authority: specificAdvice.title || 'authority'
                    });
                }

                // Append Proactive Suggestion
                const proactive = getProactiveSuggestions(conversationContext, soloData);
                if (proactive.length > 0) {
                    greetingText += `\n\n💡 ${t('advisor.ai_responses.proactive_tip')}: ${t(proactive[0].label)}`;
                }
                return greetingText;
            }

            case 'nextSteps':
            case 'showCalendar': {
                if (primaryIntent.intent === 'showCalendar' || lowerInput.includes('roadmap')) {
                    setChatState('idle');
                    setQuickChoices([t('advisor.ai_responses.back_day', { day }), t('advisor.ai_responses.show_week_focus', { week: Math.ceil(day / 7) })]);
                    return t('advisor.solocorp.responses.roadmap_week', {
                        week: Math.ceil(day / 7), title: SOLO_CORP_KNOWLEDGE.weeks[Math.ceil(day / 7) - 1]?.title,
                        completed: soloData.completedDays.length, available: day
                    });
                }
                const currentPeriod = timeline.find(t => t.period.includes('Week')) || timeline[0];
                setQuickChoices([t('advisor.ai_responses.show_tactic'), t('advisor.solocorp.responses.day_preview', { day: day + 1 }), t('nav.tracker')]);
                return t('advisor.solocorp.responses.roadmap_milestone', {
                    objectiveId, period: currentPeriod?.period, day, title: dayData?.title, focus: currentPeriod?.focus
                });
            }

            case 'pitchHelp': {
                setQuickChoices([t('advisor.ai_responses.give_exercise'), t('advisor.ai_responses.back_tactic'), t('advisor.ai_responses.explain_roadmap')]);
                return t('advisor.solocorp.responses.improve_pitch', { industry, tactic: dayData?.tactic, day });
            }

            case 'showTactic': {
                setChatState('tactic');
                setQuickChoices([t('advisor.ai_responses.give_exercise'), t('advisor.ai_responses.why_this_tactic'), t('common.next')]);
                return t('advisor.solocorp.responses.tactic_strategy', {
                    day, tactic: dayData?.tactic, brand, objectiveId,
                    highlight: specificAdvice.highlight ? specificAdvice.highlight.split('.')[0] : 'scaling your authority'
                });
            }

            case 'showExercise': {
                setChatState('exercise');
                setQuickChoices([t('advisor.ai_responses.mission_accomplished'), t('advisor.ai_responses.need_help'), t('advisor.ai_responses.back_tactic')]);
                return t('advisor.solocorp.responses.exercise_mission', { day, exercise: dayData?.exercise, week: Math.ceil(day / 7) });
            }

            case 'logActivity': {
                setChatState('logging');
                const isAlreadyCompleted = soloData.completedDays.includes(day);
                if (!isAlreadyCompleted) {
                    const autoLog = {
                        id: Date.now(),
                        day: day,
                        title: `Completed Day ${day}: ${dayData?.title}`,
                        notes: `Automatically logged via Playbook Strategy Engine.`,
                        date: new Date().toISOString().split('T')[0]
                    };
                    setSoloData(prev => ({
                        ...prev,
                        activities: [...prev.activities, autoLog],
                        completedDays: [...new Set([...prev.completedDays, day])]
                    }));
                }
                setQuickChoices([t('advisor.ai_responses.log_full'), t('common.next'), t('nav.tracker')]);
                return t('advisor.solocorp.responses.mission_logged', {
                    ref: isAlreadyCompleted ? '(Reference Update)' : '', name, day, brand,
                    nextDay: day + 1, nextTitle: day + 1 <= 30 ? 'Locked until tomorrow' : 'Journey Complete'
                });
            }

            case 'dataCompletion': { // Explicit log full request
                if (lowerInput.includes('log full') || lowerInput.includes('exercises')) {
                    setChatState('idle');
                    setExerciseForm({
                        day: day,
                        title: dayData?.title,
                        content: '',
                        link: '',
                        imageUrl: '',
                        date: new Date().toISOString().split('T')[0]
                    });
                    setIsExerciseModalOpen(true);
                    return t('advisor.solocorp.responses.exercise_vault', { day });
                }
                break;
            }

            default: {
                // Smart Fallback
                const fallback = generateSmartFallback(input, context);
                setQuickChoices(fallback.suggestionKeys.map(key => t(key)));
                return t(fallback.messageKey, {
                    input,
                    context: brand,
                    options: fallback.intents ? fallback.intents.map(i => i.intent).join(', ') : ''
                });
            }
        }

        return t('advisor.solocorp.responses.unknown', { input, day, title: dayData?.title, brand });
    };

    const handleChoiceClick = (choice) => {
        // Navigation Map: Text -> Route ID
        const navMap = {
            [t('nav.brand')]: 'brand-evaluator',
            [t('nav.product')]: 'product-profiler',
            [t('nav.prospect')]: 'prospect-profiler',
            [t('nav.compass')]: 'compass',
            [t('advisor.ai_responses.fix_brand')]: 'brand-evaluator',
            [t('advisor.ai_responses.show_capabilities')]: 'conversation-guide'
        };

        if (navMap[choice]) {
            window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: navMap[choice] }));
            return;
        }

        setSoloInput(choice);
        handleSendSoloMessage(null, choice);
    };

    const handleSendSoloMessage = async (e, overrideInput) => {
        if (e) e.preventDefault();
        const finalInput = overrideInput || soloInput;
        if (!finalInput.trim()) return;

        const userMsg = { role: 'user', content: finalInput, id: Date.now() };
        setSoloMessages(prev => [...prev, userMsg]);
        setSoloInput('');
        setIsSoloTyping(true);
        setQuickChoices([]);

        const compassData = JSON.parse(localStorage.getItem(getProfileKey('imi-compass-data')) || '{}');
        const bEvalData = JSON.parse(localStorage.getItem(getProfileKey('imi-brand-data')) || '{}'); // Corrected from imi-brand-evaluator-data
        const pProfData = JSON.parse(localStorage.getItem(getProfileKey('imi-product-data')) || '{}');
        const prProfData = JSON.parse(localStorage.getItem(getProfileKey('imi-prospect-data')) || '{}');
        const cGuideData = JSON.parse(localStorage.getItem(getProfileKey('imi-conversation-data')) || '{}');

        const brand = compassData?.brandName || bEvalData?.brandName || 'your business';
        const industry = prProfData?.industry || 'your industry';
        const product = pProfData?.productName || 'product';
        const mission = bEvalData?.mission || 'excellence';
        const values = prProfData?.values || 'core values';

        const geminiContext = {
            ...conversationContext,
            brand: brand,
            industry: industry,
            objective: compassData?.objective,
            day: getCurrentDay(),
            product: product,
            mission: mission,
            values: values,
            conversationGuide: cGuideData?.guideContent // Added conversationGuide
        };

        const history = [...soloMessages, userMsg].map(m => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : 'Content'
        }));

        try {
            // Run side-effects from local engine first (to set Quick Choices / UI State)
            // We ignore the text response from local engine if Gemini works
            // Note: This relies on generateSoloResponse being synchronous and side-effect heavy (setState)
            generateSoloResponse(finalInput);

            // Attempt Gemini API
            const aiText = await getGeminiResponse(history, geminiContext, 'solocorp');

            // Refresh credits after successful call
            refreshCredits();

            setIsSoloTyping(false);

            // Create empty message for streaming effect
            const aiMsgId = Date.now() + 1;
            const aiMsg = {
                role: 'assistant',
                content: '',
                id: aiMsgId,
                isStreaming: true
            };
            setSoloMessages(prev => [...prev, aiMsg]);

            // Stream the content (Typewriter Effect)
            let currentText = '';
            let index = 0;
            const chunkSize = 3;

            const streamInterval = setInterval(() => {
                if (index < aiText.length) {
                    const chunk = aiText.slice(index, index + chunkSize);
                    currentText += chunk;
                    index += chunkSize;
                    setSoloMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: currentText } : m));
                } else {
                    clearInterval(streamInterval);
                    setSoloMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiText, isStreaming: false } : m));

                    // Basic UI Triggers based on text content (optional enhancement)
                    if (aiText.toLowerCase().includes('exercises tab')) setCurrentTab('exercises');
                    if (aiText.toLowerCase().includes('roadmap')) setCurrentTab('calendar');
                    if (aiText.toLowerCase().includes('activity log')) setCurrentTab('log');
                }
            }, 15);

        } catch (error) {
            console.log('Gemini Fallback:', error);

            // Fallback to purely local
            setTimeout(() => {
                let response = generateSoloResponse(finalInput);

                // DIAGNOSTIC INFO - Logged to console instead of user UI
                console.warn("Falling back to local engine due to API error:", error);
                response += `\n\nI recommend booking a one-on-one calibration meeting with a coach if you need further assistance: https://calendly.com/imi-socialmediaimage/30min`;

                setIsSoloTyping(false);

                const aiMsgId = Date.now() + 1;
                const newAiMsg = { role: 'assistant', content: '', id: aiMsgId, isStreaming: true };
                setSoloMessages(prev => [...prev, newAiMsg]);

                let currentText = '';
                let index = 0;
                const streamInterval = setInterval(() => {
                    if (index < response.length) {
                        currentText += response[index];
                        setSoloMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: currentText } : m));
                        index++;
                    } else {
                        clearInterval(streamInterval);
                        setSoloMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));

                        // UI Action Triggers (Local fallback logic)
                        if (response.toLowerCase().includes('exercises tab')) setCurrentTab('exercises');
                        if (response.toLowerCase().includes('switching to your roadmap')) setCurrentTab('calendar');
                        if (response.toLowerCase().includes('activity log')) setCurrentTab('log');
                    }
                }, 10);
            }, 1000);
        }
    };

    const handleSaveActivity = (e) => {
        e.preventDefault();
        const newActivity = { ...activityForm, id: Date.now() };
        setSoloData(prev => {
            const newActivities = [...prev.activities, newActivity];
            const newCompletedDays = [...new Set([...prev.completedDays, activityForm.day])];
            return { ...prev, activities: newActivities, completedDays: newCompletedDays };
        });
        setIsActivityModalOpen(false);
    };

    const handleSaveExercise = (e) => {
        e.preventDefault();
        const newExercise = { ...exerciseForm, id: Date.now() };
        setSoloData(prev => ({
            ...prev,
            exercises: [...prev.exercises, newExercise]
        }));
        setIsExerciseModalOpen(false);
    };

    const resetEngine = () => {
        if (!window.confirm(t('common.delete_confirm'))) return;
        setSoloMessages([]);
        setChatState('idle');
        setQuickChoices([]);
        localStorage.removeItem(getProfileKey('imi-solocorp-chat-standalone'));
    };

    const handleSoloSync = () => {
        const bData = JSON.parse(localStorage.getItem(getProfileKey('imi-brand-data')) || '{}');
        const cData = JSON.parse(localStorage.getItem(getProfileKey('imi-compass-data')) || '{}');
        const pData = JSON.parse(localStorage.getItem(getProfileKey('imi-prospect-data')) || '{}');

        const exportContext = {
            ...conversationContext,
            brand: bData.brandName,
            industry: pData.industry,
            objective: cData.objective,
            day: getCurrentDay()
        };

        const prompt = generateGeminiPrompt(exportContext, soloMessages, 'solocorp');
        navigator.clipboard.writeText(prompt);
        setSyncStatus('copied');
        setTimeout(() => setSyncStatus('idle'), 3000);
    };

    const deleteActivity = (id) => {
        setSoloData(prev => {
            const activityToDelete = prev.activities.find(a => a.id === id);
            const newActivities = prev.activities.filter(a => a.id !== id);
            // Check if any other activity exists for that day before removing from completed
            const otherForDay = newActivities.some(a => a.day === activityToDelete.day);
            const newCompletedDays = otherForDay
                ? prev.completedDays
                : prev.completedDays.filter(d => d !== activityToDelete.day);
            return { ...prev, activities: newActivities, completedDays: newCompletedDays };
        });
    };

    const deleteExercise = (id) => {
        if (!window.confirm("Delete this exercise entry?")) return;
        setSoloData(prev => ({
            ...prev,
            exercises: prev.exercises.filter(e => e.id !== id)
        }));
    };

    return (
        <div className="solocorp-container">
            {/* Solo Corp Header */}
            <header className="solocorp-header">
                <div className="header-main">
                    <div className="title-area">
                        <Flame className="icon-burn" />
                        <div>
                            <h1>Solo Corp 101</h1>
                            <p className="subtitle">{t('solocorp.protocol.subtitle')}</p>
                        </div>
                    </div>
                    <div className="progress-badge">
                        <div className="progress-label">{t('solocorp.protocol.progress')}</div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${getDayProgress()}%` }}></div>
                        </div>
                        <div className="progress-stats">{t('solocorp.protocol.day_stats', { day: getCurrentDay() })}</div>
                    </div>
                </div>

                <nav className="solocorp-tabs">
                    <button className={currentTab === 'coach' ? 'active' : ''} onClick={() => setCurrentTab('coach')}>
                        <Bot size={18} /> {t('advisor.tabs.solocorp')}
                    </button>
                    <button className={currentTab === 'calendar' ? 'active' : ''} onClick={() => setCurrentTab('calendar')}>
                        <Calendar size={18} /> {t('solocorp.tabs.calendar')}
                    </button>
                    <button className={currentTab === 'log' ? 'active' : ''} onClick={() => setCurrentTab('log')}>
                        <ClipboardList size={18} /> {t('solocorp.tabs.log')}
                    </button>
                    <button className={currentTab === 'exercises' ? 'active' : ''} onClick={() => setCurrentTab('exercises')}>
                        <Layout size={18} /> {t('solocorp.tabs.exercises')}
                    </button>
                </nav>
            </header>

            <div className="solocorp-content">
                {currentTab === 'coach' && (
                    <div className="coach-pane solocorp-chat-area">
                        <AIFeatureGate featureName={t('solocorp.chat.engine_title')} onProceedWithoutAuth={() => { }}>
                            <div className="chat-interface">
                                <div className="chat-header">
                                    <div className="header-info">
                                        <Sparkles size={20} color="var(--electric-blue)" />
                                        <div>
                                            <h3>{t('solocorp.chat.engine_title')}</h3>
                                            <p className="subtitle">{t('solocorp.chat.playbook_subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        {credits !== null && (
                                            <div className="credit-badge" title="Remaining AI Credits">
                                                <Coins size={16} />
                                                <span>{credits}</span>
                                            </div>
                                        )}
                                        <button className="icon-btn" title={t('advisor.ai_responses.gemini_sync')} onClick={handleSoloSync} style={{ width: 'auto', gap: '5px', padding: '0 8px' }}>
                                            <Sparkles size={18} /> <span className="mobile-label-hidden">{syncStatus === 'copied' ? t('advisor.ai_responses.gemini_copied') : t('advisor.ai_responses.gemini_sync')}</span>
                                        </button>
                                        <button className="icon-btn" title={t('solocorp.chat.ai_guide')} onClick={() => setIsAIGuideOpen(true)}><HelpCircle size={18} /><span className="mobile-label-hidden"> {t('solocorp.chat.ai_guide')}</span></button>
                                        <button className="icon-btn" title={t('solocorp.chat.reset_engine')} onClick={resetEngine}><Eraser size={18} /><span className="mobile-label-hidden"> {t('solocorp.chat.reset_engine')}</span></button>
                                    </div>
                                </div>
                                <div className="chat-messages">
                                    <div className="msg bubble assistant-message" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                                        <div className="bubble-content" style={{ color: '#ffffff', opacity: 1 }}>
                                            {t('advisor.solocorp.welcome') || "Welcome to the Strategy Engine. Consult the Playbook to map your 30-day transition."}
                                            <p style={{ marginTop: '10px', fontSize: '0.9em', opacity: 1, color: '#ffffff' }}>
                                                {t('advisor.solocorp.book_call_instruction') || "If you need further assistance, I recommend booking a one-on-one calibration meeting with a coach."}
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
                                                {t('solocorp.chat.book_calibration')}
                                            </a>
                                        </div>
                                    </div>
                                    {soloMessages.map((m, i) => {
                                        const hasBookingLink = typeof m.content === 'string' && m.content.includes('calendly.com/imi-socialmediaimage/30min');
                                        return (
                                            <div key={m.id || i} className={`msg bubble ${m.role === 'user' ? 'user-message' : 'assistant-message'}`} style={m.role === 'assistant' ? { backgroundColor: '#1e293b', border: '1px solid #475569' } : {}}>
                                                <div className="bubble-content" style={{ color: '#ffffff', opacity: 1 }}>
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
                                                            {t('solocorp.chat.book_calibration')}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {isSoloTyping && (
                                        <div className="msg bubble assistant-message typing">
                                            <div className="bubble-content">{t('solocorp.chat.thinking')}</div>
                                        </div>
                                    )}
                                    <div ref={soloMessagesEndRef} />
                                </div>

                                {/* Choice Bubbles */}
                                {quickChoices.length > 0 && (
                                    <div className="choice-container no-scrollbar">
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

                                <form onSubmit={handleSendSoloMessage} className="chat-input-row">
                                    <input
                                        type="text"
                                        value={soloInput}
                                        onChange={(e) => setSoloInput(e.target.value)}
                                        placeholder={t('solocorp.chat.placeholder')}
                                    />
                                    <button type="submit" className="send-btn" disabled={!soloInput.trim()}>
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </AIFeatureGate>
                    </div>
                )}

                {currentTab === 'calendar' && (
                    <div className="calendar-pane">
                        <div className="calendar-grid">
                            {[...Array(30)].map((_, i) => {
                                const dayNum = i + 1;
                                const isCompleted = soloData.completedDays.includes(dayNum);
                                const isCurrent = dayNum === getCurrentDay();
                                return (
                                    <div key={dayNum} className={`day-card ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                        <div className="day-header">
                                            <span className="day-num">{t('common.day')} {dayNum}</span>
                                            {isCompleted && <CheckCircle2 size={14} color="var(--amber-gold)" />}
                                        </div>
                                        <div className="day-status">{isCompleted ? t('solocorp.logs.status_logged') : t('solocorp.logs.status_pending')}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {currentTab === 'log' && (
                    <div className="log-pane">
                        <div className="log-header">
                            <h3>{t('solocorp.logs.mission_logs')}</h3>
                            <button className="add-log-btn" onClick={() => setIsActivityModalOpen(true)}>
                                <Plus size={16} /> {t('solocorp.logs.new_entry')}
                            </button>
                        </div>
                        <div className="log-list">
                            {soloData.activities.length === 0 ? (
                                <p className="empty-msg">{t('solocorp.logs.empty_msg', { day: getCurrentDay() })}</p>
                            ) : (
                                [...soloData.activities].reverse().map((act) => (
                                    <div key={act.id} className="log-item">
                                        <div className="log-date">{act.date} — {t('common.day')} {act.day}</div>
                                        <h4>{act.title}</h4>
                                        <p>{act.notes}</p>
                                        <button className="log-del" onClick={() => deleteActivity(act.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {currentTab === 'exercises' && (
                    <div className="exercises-combined-view">
                        <section className="protocol-section">
                            <div className="pane-header">
                                <div className="pane-info">
                                    <Flame className="protocol-icon" size={24} />
                                    <div>
                                        <h3>{t('protocol.title')}</h3>
                                        <p>{t('protocol.subtitle')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="protocol-calendar">
                                {[...Array(30)].map((_, i) => {
                                    const dayNum = i + 1;
                                    const isCompleted = soloData.completedDays.includes(dayNum);
                                    const isUnlocked = dayNum === 1 || soloData.completedDays.includes(dayNum - 1);
                                    const isLocked = !isUnlocked;
                                    const hasExerciseContent = soloData.exercises?.some(ex => ex.day === dayNum);

                                    return (
                                        <div
                                            key={dayNum}
                                            className={`protocol-day ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : 'available'}`}
                                            onClick={() => {
                                                if (isLocked) return;
                                                if (isCompleted && !hasExerciseContent) {
                                                    setExerciseForm({
                                                        day: dayNum, title: `${t('protocol.day')} ${dayNum} Proof-of-Work`, content: '', link: '', imageUrl: '', date: new Date().toISOString().split('T')[0]
                                                    });
                                                    setIsExerciseModalOpen(true);
                                                } else if (!isCompleted) {
                                                    setCurrentTab('coach');
                                                    handleSendSoloMessage(null, `What's my mission for Day ${dayNum}?`);
                                                }
                                            }}
                                        >
                                            <div className="day-card-header">
                                                <span className="day-number">{t('protocol.day')} {dayNum}</span>
                                                {isLocked && <Lock size={12} />}
                                                {isCompleted && <CheckCircle2 size={12} color="var(--electric-blue)" />}
                                            </div>
                                            <div className="day-card-body">
                                                {isLocked ? (
                                                    <div className="locked-state">{t('protocol.locked')}</div>
                                                ) : (
                                                    <div className="mission-state">{isCompleted ? (hasExerciseContent ? t('protocol.portfolio_logged') : t('protocol.log_results')) : t('protocol.start_mission')}</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="protocol-legend">
                                <div className="legend-item"><div className="dot completed"></div> {t('protocol.completed')}</div>
                                <div className="legend-item"><div className="dot available"></div> {t('protocol.available')}</div>
                                <div className="legend-item"><div className="dot locked"></div> {t('protocol.legend_locked')}</div>
                            </div>
                        </section>

                        <hr className="protocol-divider" />

                        <section className="portfolio-section">
                            <div className="pane-header">
                                <div className="pane-info">
                                    <Sparkles className="protocol-icon" size={24} color="var(--electric-blue)" />
                                    <div>
                                        <h3>{t('protocol.portfolio_title')}</h3>
                                        <p>{t('protocol.portfolio_subtitle')}</p>
                                    </div>
                                </div>
                                <button className="add-btn" onClick={() => {
                                    setExerciseForm({
                                        day: getCurrentDay(), title: '', content: '', link: '', imageUrl: '', date: new Date().toISOString().split('T')[0]
                                    });
                                    setIsExerciseModalOpen(true);
                                }}>
                                    <Plus size={16} /> {t('protocol.new_entry')}
                                </button>
                            </div>

                            <div className="exercises-grid">
                                {(!soloData.exercises || soloData.exercises.length === 0) ? (
                                    <div className="empty-state">
                                        <Zap size={40} />
                                        <p>{t('protocol.empty_portfolio')}</p>
                                    </div>
                                ) : (
                                    [...(soloData.exercises || [])].reverse().map((ex) => (
                                        <div key={ex.id} className="exercise-card">
                                            <div className="card-header">
                                                <span className="day-tag">{t('protocol.day')} {ex.day}</span>
                                                <button className="del-btn" onClick={() => deleteExercise(ex.id)}><Trash2 size={14} /></button>
                                            </div>
                                            {ex.imageUrl && <div className="card-image"><img src={ex.imageUrl} alt={ex.title} /></div>}
                                            <div className="card-body">
                                                <h4>{ex.title}</h4>
                                                <p>{ex.content}</p>
                                                <div className="card-footer">
                                                    <span className="date">{ex.date}</span>
                                                    {ex.link && <a href={ex.link} target="_blank" rel="noopener noreferrer" className="link-icon"><ExternalLink size={14} /></a>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isActivityModalOpen && (
                <div className="solocorp-modal-overlay">
                    <div className="solocorp-modal">
                        <div className="modal-top">
                            <h2>{t('protocol.modal.log_mission')}</h2>
                            <button onClick={() => setIsActivityModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSaveActivity} className="solocorp-form">
                            <div className="f-row">
                                <div className="f-group">
                                    <label>{t('protocol.modal.day_number')}</label>
                                    <input type="number" min="1" max="30" value={activityForm.day} onChange={e => setActivityForm({ ...activityForm, day: parseInt(e.target.value) })} />
                                </div>
                                <div className="f-group">
                                    <label>{t('protocol.modal.date')}</label>
                                    <input type="date" value={activityForm.date} onChange={e => setActivityForm({ ...activityForm, date: e.target.value })} />
                                </div>
                            </div>
                            <div className="f-group">
                                <label>{t('protocol.modal.mission_title')}</label>
                                <input required value={activityForm.title} onChange={e => setActivityForm({ ...activityForm, title: e.target.value })} placeholder="e.g. Identity Shift Exercise" />
                            </div>
                            <div className="f-group">
                                <label>{t('protocol.modal.notes')}</label>
                                <textarea value={activityForm.notes} onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })} placeholder="What did you learn today?" />
                            </div>
                            <button type="submit" className="save-btn">{t('protocol.modal.save_strategy')}</button>
                        </form>
                    </div>
                </div>
            )}

            {isExerciseModalOpen && (
                <div className="solocorp-modal-overlay">
                    <div className="solocorp-modal">
                        <div className="modal-top">
                            <h2>{t('protocol.modal.log_detailed')}</h2>
                            <button onClick={() => setIsExerciseModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSaveExercise} className="solocorp-form">
                            <div className="f-row">
                                <div className="f-group">
                                    <label>{t('protocol.modal.day_number')}</label>
                                    <input type="number" min="1" max="30" value={exerciseForm.day} onChange={e => setExerciseForm({ ...exerciseForm, day: parseInt(e.target.value) })} />
                                </div>
                                <div className="f-group">
                                    <label>{t('protocol.modal.date')}</label>
                                    <input type="date" value={exerciseForm.date} onChange={e => setExerciseForm({ ...exerciseForm, date: e.target.value })} />
                                </div>
                            </div>
                            <div className="f-group">
                                <label>{t('protocol.modal.exercise_title')}</label>
                                <input required value={exerciseForm.title} onChange={e => setExerciseForm({ ...exerciseForm, title: e.target.value })} placeholder="e.g. Market Research Phase 1" />
                            </div>
                            <div className="f-group">
                                <label>{t('protocol.modal.content')}</label>
                                <textarea required rows="4" value={exerciseForm.content} onChange={e => setExerciseForm({ ...exerciseForm, content: e.target.value })} placeholder="Describe what you built or accomplished..." />
                            </div>
                            <div className="f-row">
                                <div className="f-group">
                                    <label>{t('protocol.modal.project_link')}</label>
                                    <div className="input-with-icon">
                                        <ExternalLink size={14} className="input-icon" />
                                        <input type="url" value={exerciseForm.link} onChange={e => setExerciseForm({ ...exerciseForm, link: e.target.value })} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="f-group">
                                    <label>{t('protocol.modal.image_url')}</label>
                                    <div className="input-with-icon">
                                        <ImageIcon size={14} className="input-icon" />
                                        <input type="url" value={exerciseForm.imageUrl} onChange={e => setExerciseForm({ ...exerciseForm, imageUrl: e.target.value })} placeholder="Paste image link..." />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="save-btn">{t('protocol.modal.save_portfolio')}</button>
                        </form>
                    </div>
                </div>
            )}

            {isAIGuideOpen && (
                <div className="solocorp-modal-overlay" onClick={() => setIsAIGuideOpen(false)}>
                    <div className="solocorp-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-top">
                            <h2>{t('solocorp.chat.support_guide')}</h2>
                            <button onClick={() => setIsAIGuideOpen(false)}><X /></button>
                        </div>
                        <div className="guide-content">
                            <div className="guide-section">
                                <h3>🚀 Capabilities</h3>
                                <ul>
                                    {t('advisor.solocorp.capabilities', { returnObjects: true }).map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SoloCorp101;
