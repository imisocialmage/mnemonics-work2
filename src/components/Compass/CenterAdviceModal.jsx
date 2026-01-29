import React from 'react';
import { X, Target, Shield, Package, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Compass.css'; // Reusing compass styles for consistency

const CenterAdviceModal = ({ isOpen, onClose, advice, type }) => {
    const { t } = useTranslation();

    if (!isOpen || !advice) return null;

    const getIcon = () => {
        switch (type) {
            case 'who': return <Target size={32} className="text-blue-400" />;
            case 'brand': return <Shield size={32} className="text-purple-400" />;
            case 'product': return <Package size={32} className="text-amber-400" />;
            case 'service': return <Zap size={32} className="text-green-400" />;
            default: return <Target size={32} />;
        }
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    className="center-advice-modal"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>

                    <div className="modal-header flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            {getIcon()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                {t(`center_advice.${type}.title`)}
                            </h2>
                            <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">
                                {t(`center_advice.${type}.value`)}
                            </p>
                        </div>
                    </div>

                    <div className="modal-body space-y-6">
                        <div className="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500">
                            <h3 className="text-sm font-semibold text-blue-300 mb-2">{t('center_advice.who.labels.definition')}</h3>
                            <p className="text-gray-200 leading-relaxed italic">
                                "{t(`center_advice.${type}.definition`)}"
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-purple-300 mb-2">{t('center_advice.who.labels.system')}</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {t(`center_advice.${type}.system`)}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-amber-300 mb-3">{t('center_advice.who.labels.questions')}</h3>
                            <ul className="space-y-2">
                                {t(`center_advice.${type}.questions`, { returnObjects: true })?.map((q, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                        <span className="text-amber-500 mt-1">▹</span>
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                            {t('center_advice.who.labels.continue')}
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CenterAdviceModal;
