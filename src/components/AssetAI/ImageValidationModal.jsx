import React from 'react';
import { X, AlertTriangle, CheckCircle, Crop } from 'lucide-react';
import './AssetAI.css';

const ImageValidationModal = ({ analysis, onCancel, onUseOriginal, onCrop }) => {
    if (!analysis) return null;

    const hasWarnings = analysis.warnings.length > 0;
    const recommended = analysis.recommended.map(r => r.label).join(', ');

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h3>Image Check</h3>
                    <button className="close-btn" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="analysis-summary">
                        <div className="stat-row">
                            <span className="label">Dimensions:</span>
                            <span className="value">{analysis.width} x {analysis.height} px</span>
                        </div>
                        <div className="stat-row">
                            <span className="label">Aspect Ratio:</span>
                            <span className="value">{analysis.aspect.toFixed(2)}</span>
                        </div>
                        <div className="stat-row">
                            <span className="label">Best For:</span>
                            <span className="value">{recommended || 'General Use'}</span>
                        </div>
                    </div>

                    {hasWarnings ? (
                        <div className="analysis-warnings">
                            {analysis.warnings.map((w, i) => (
                                <div key={i} className="warning-item">
                                    <AlertTriangle size={16} /> {w}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="analysis-success">
                            <CheckCircle size={16} /> Image looks good for most platforms!
                        </div>
                    )}

                    <p className="modal-text">
                        Would you like to use this image as is, or crop it for a specific platform?
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn-outline" onClick={onUseOriginal}>
                        Use Original
                    </button>
                    <button className="btn-primary" onClick={onCrop}>
                        <Crop size={16} /> Crop & Resize
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageValidationModal;
