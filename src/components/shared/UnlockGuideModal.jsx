import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle2, Circle, ArrowRight, Sparkles, Lock } from 'lucide-react';
import './UnlockGuideModal.css';

const UnlockGuideModal = ({ isOpen, onClose, completions, onNavigate }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const steps = [
        { id: 'compass', label: t('nav.compass'), icon: '🧭', isDone: completions.compass || completions.compassProfiler, toolId: 'compass' },
        { id: 'brand', label: t('nav.brand'), icon: '🏆', isDone: completions.brandEvaluator, toolId: 'brand-evaluator' },
        { id: 'product', label: t('nav.product'), icon: '📦', isDone: completions.productProfiler, toolId: 'product-profiler' },
        { id: 'prospect', label: t('nav.prospect'), icon: '👥', isDone: completions.prospectProfiler, toolId: 'prospect-profiler' },
        { id: 'guide', label: t('nav.guide'), icon: '💬', isDone: completions.conversationGuide, toolId: 'conversation-guide' }
    ];

    const allDone = steps.every(s => s.isDone);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="unlock-guide-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X /></button>

                <div className="modal-content">
                    <div className="guide-header">
                        <div className="header-icon">
                            <Sparkles size={32} color="var(--electric-blue)" />
                        </div>
                        <h2>{t('unlock_guide.title') || 'Unlock Pitch Master'}</h2>
                        <p>{t('unlock_guide.description') || 'Complete the foundation tools to activate the Strategic Pitch Master AI.'}</p>
                    </div>

                    <div className="steps-list">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`step-item ${step.isDone ? 'completed' : 'pending'}`}
                                onClick={() => !step.isDone && onNavigate(step.toolId)}
                            >
                                <div className="step-status">
                                    {step.isDone ? (
                                        <CheckCircle2 size={24} className="text-green-500" />
                                    ) : (
                                        <Circle size={24} className="text-gray-600" />
                                    )}
                                </div>
                                <div className="step-info">
                                    <span className="step-label">
                                        <span className="step-icon">{step.icon}</span> {step.label}
                                    </span>
                                    {!step.isDone && <span className="step-action">{t('unlock_guide.go_to_tool') || 'Fix this now'} <ArrowRight size={14} /></span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="guide-footer">
                        {allDone ? (
                            <button className="premium-btn w-full justify-center" onClick={() => onNavigate('pitch-master')}>
                                <Sparkles size={18} /> {t('unlock_guide.launch_now') || 'Launch Pitch Master'}
                            </button>
                        ) : (
                            <div className="lock-notice">
                                <Lock size={16} />
                                <span>{t('unlock_guide.remaining_msg', { count: steps.filter(s => !s.isDone).length }) || `${steps.filter(s => !s.isDone).length} steps remaining`}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnlockGuideModal;
