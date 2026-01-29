import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const NodeAdviceModal = ({ isOpen, onClose, advice, nodeNames }) => {
    const { t } = useTranslation();
    if (!advice) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <motion.div
                        className="node-advice-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="modal-content">
                            <h2 className="modal-title">{advice.title}</h2>

                            <div className="node-tags">
                                {nodeNames.map((nodeId, index) => (
                                    <span key={index} className="node-tag">{t(`nodes.${nodeId}`)}</span>
                                ))}
                            </div>

                            <div className="highlight-box">
                                <p>{advice.highlight}</p>
                            </div>

                            <div className="advice-section">
                                <h3 className="section-subtitle">{t('modal.focus_areas')}</h3>
                                <div className="focus-areas">
                                    {advice.focusAreas.map((area, index) => (
                                        <div key={index} className="focus-area-item">
                                            <span className="area-name">{t(`nodes.${area.name.toLowerCase().replace(/[^a-z]/g, '')}`)} -</span>
                                            <span className="area-desc">{area.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="advice-section">
                                <h3 className="section-subtitle">{t('modal.key_actions')}</h3>
                                <p className="section-text">{advice.keyActions}</p>
                            </div>

                            {advice.sevenDayPlan && (
                                <div className="advice-section">
                                    <h3 className="section-subtitle">{t('modal.implementation_plan')}</h3>
                                    <div className="plan-list">
                                        {advice.sevenDayPlan.map((step, idx) => (
                                            <div key={idx} className="plan-item">
                                                <strong>{step.day}:</strong> {step.focus}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {advice.thirtyDayCalendar && (
                                <div className="advice-section">
                                    <h3 className="section-subtitle">{t('modal.strategic_focus')}</h3>
                                    <div className="calendar-grid">
                                        {advice.thirtyDayCalendar.map((week, idx) => (
                                            <div key={idx} className="calendar-week">
                                                <strong>{week.week} ({week.theme}):</strong>
                                                <ul className="calendar-items">
                                                    {week.items.map((item, iidx) => (
                                                        <li key={iidx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="remember-section">
                                <div className="remember-divider"></div>
                                <h3 className="section-subtitle">{t('modal.remember')}</h3>
                                <p className="section-text italic">{advice.remember}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NodeAdviceModal;
