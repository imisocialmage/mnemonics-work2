import React from 'react';
import { OBJECTIVES } from '../../data/compassData';
import './MarketingForm.css';

const MarketingForm = ({ formData, setFormData, onObjectiveChange, onGenerate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'objective') {
            onObjectiveChange(value);
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Define Your Objective</h2>

            <div className="form-group">
                <label className="form-label">Primary Marketing Objective *</label>
                <select
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    className="form-input"
                >
                    <option value="">Select your objective...</option>
                    {Object.values(OBJECTIVES).map(obj => (
                        <option key={obj.id} value={obj.id}>{obj.label}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Compass Center Focus *</label>
                <select
                    name="focus"
                    value={formData.focus}
                    onChange={handleChange}
                    className="form-input"
                >
                    <option value="who">WHO? (The Audience)</option>
                    <option value="brand">BRAND</option>
                    <option value="product">PRODUCT</option>
                    <option value="service">SERVICE</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Brand/Product Name *</label>
                <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Enter your brand or product name"
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Target Audience</label>
                <input
                    type="text"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    placeholder="Describe your target audience"
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Current Challenge/Goal</label>
                <textarea
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    placeholder="Describe your main marketing challenge or goal..."
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
                Generate Strategy Report
            </button>
        </div>
    );
};

export default MarketingForm;
