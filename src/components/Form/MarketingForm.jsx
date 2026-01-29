import React from 'react';
import { useTranslation } from 'react-i18next';
import { OBJECTIVES } from '../../data/compassData';
import './MarketingForm.css';

const MarketingForm = ({ formData, setFormData, onObjectiveChange, onGenerate }) => {
    const { t } = useTranslation();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'objective') {
            onObjectiveChange(value);
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('form.title')}</h2>

            <div className="form-group">
                <label className="form-label">{t('form.objective_label')}</label>
                <select
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    className="form-input"
                >
                    <option value="">{t('form.objective_placeholder')}</option>
                    {Object.values(OBJECTIVES).map(obj => (
                        <option key={obj.id} value={obj.id}>{t(`objectives.${obj.id}`)}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">{t('form.focus_label')}</label>
                <select
                    name="focus"
                    value={formData.focus}
                    onChange={handleChange}
                    className="form-input"
                >
                    <option value="who">{t('form.focus_who')}</option>
                    <option value="brand">{t('form.focus_brand')}</option>
                    <option value="product">{t('form.focus_product')}</option>
                    <option value="service">{t('form.focus_service')}</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">{t('form.brand_name_label')}</label>
                <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder={t('form.brand_name_placeholder')}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">{t('form.audience_label')}</label>
                <input
                    type="text"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    placeholder={t('form.audience_placeholder')}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">{t('form.challenge_label')}</label>
                <textarea
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    placeholder={t('form.challenge_placeholder')}
                    className="form-input"
                    rows="4"
                    style={{ resize: 'vertical' }}
                />
            </div>

            <button
                onClick={onGenerate}
                style={{
                    width: '100%',
                    backgroundColor: '#1E40AF', // Primary blue
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginTop: '20px',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#1E40AF'}
            >
                {t('common.generate_strategy')}
            </button>
        </div>
    );
};

export default MarketingForm;
