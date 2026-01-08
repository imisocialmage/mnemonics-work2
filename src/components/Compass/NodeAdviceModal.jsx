import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const NodeAdviceModal = ({ isOpen, onClose, advice, nodeNames }) => {
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
                                {nodeNames.map((name, index) => (
                                    <span key={index} className="node-tag">{name}</span>
                                ))}
                            </div>

                            <div className="highlight-box">
                                <p>{advice.highlight}</p>
                            </div>

                            <div className="advice-section">
                                <h3 className="section-subtitle">Focus Areas:</h3>
                                <div className="focus-areas">
                                    {advice.focusAreas.map((area, index) => (
                                        <div key={index} className="focus-area-item">
                                            <span className="area-name">{area.name} -</span>
                                            <span className="area-desc">{area.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="advice-section">
                                <h3 className="section-subtitle">Key Actions:</h3>
                                <p className="section-text">{advice.keyActions}</p>
                            </div>

                            {advice.sevenDayPlan && (
                                <div className="advice-section">
                                    <h3 className="section-subtitle">7-Day Implementation Plan:</h3>
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
                                    <h3 className="section-subtitle">30-Day Strategic Focus:</h3>
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
                                <h3 className="section-subtitle">Remember:</h3>
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
