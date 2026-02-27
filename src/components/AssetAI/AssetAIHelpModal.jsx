import React from 'react';
import { X, Sparkles, ImageIcon, Zap, CheckCircle } from 'lucide-react';
import './AssetAIHelpModal.css';

const AssetAIHelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="help-modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="help-modal-header">
                    <Sparkles size={48} color="#E91E63" />
                    <h2>{t('asset_ai.help.title')}</h2>
                    <p>{t('asset_ai.help.subtitle')}</p>
                </div>

                <div className="help-modal-body">
                    <div className="help-step">
                        <div className="help-step-number">1</div>
                        <div className="help-step-content">
                            <h3>{t('asset_ai.help.step1_title')}</h3>
                            <p>{t('asset_ai.help.step1_desc')}</p>
                            <ul>
                                <li><CheckCircle size={16} /> <strong>{t('nav.compass')}</strong> - {t('compassData.objectives_title')}</li>
                                <li><CheckCircle size={16} /> <strong>{t('brand_evaluator.title')}</strong> - {t('brand_evaluator.subtitle')}</li>
                                <li><CheckCircle size={16} /> <strong>{t('nav.product')}</strong> - {t('product_profiler.title')}</li>
                                <li><CheckCircle size={16} /> <strong>{t('nav.prospect')}</strong> - {t('prospect_intelligence.title')}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-number">2</div>
                        <div className="help-step-content">
                            <h3><ImageIcon size={20} /> {t('asset_ai.help.step2_title')}</h3>
                            <p>{t('asset_ai.help.step2_desc')}</p>
                            <ul>
                                {t('asset_ai.help.step2_list', { returnObjects: true }).map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-number">3</div>
                        <div className="help-step-content">
                            <h3><Zap size={20} /> {t('asset_ai.help.step3_title')}</h3>
                            <p>{t('asset_ai.help.step3_desc')}</p>
                            <ul>
                                {t('asset_ai.help.step3_list', { returnObjects: true }).map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-number">4</div>
                        <div className="help-step-content">
                            <h3>{t('asset_ai.help.step4_title')}</h3>
                            <p>{t('asset_ai.help.step4_desc')}</p>
                            <ul>
                                {t('asset_ai.help.step4_list', { returnObjects: true }).map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="help-tip">
                        <strong>{t('asset_ai.help.pro_tip_label')}</strong> {t('asset_ai.help.pro_tip')}
                    </div>
                </div>

                <div className="help-modal-footer">
                    <button className="help-modal-cta" onClick={onClose}>
                        {t('asset_ai.help.got_it')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetAIHelpModal;
