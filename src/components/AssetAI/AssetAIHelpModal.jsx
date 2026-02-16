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
                    <h2>How to Use Asset AI</h2>
                    <p>Transform your strategy into stunning visual mockups</p>
                </div>

                <div className="help-modal-body">
                    <div className="help-step">
                        <div className="help-step-number">1</div>
                        <div className="help-step-content">
                            <h3>Complete Your Foundation</h3>
                            <p>Before generating mockups, make sure you've completed:</p>
                            <ul>
                                <li><CheckCircle size={16} /> <strong>Compass</strong> - Define your strategic objective</li>
                                <li><CheckCircle size={16} /> <strong>Brand Evaluator</strong> - Analyze your brand positioning</li>
                                <li><CheckCircle size={16} /> <strong>Product Profiler</strong> - Detail your offer</li>
                                <li><CheckCircle size={16} /> <strong>Prospect Profiler</strong> - Understand your audience</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-number">2</div>
                        <div className="help-step-content">
                            <h3><ImageIcon size={20} /> Add Visual Context (Optional)</h3>
                            <p>Upload up to 3 images to guide the AI's design direction:</p>
                            <ul>
                                <li>Your logo or brand assets</li>
                                <li>Current website or landing page</li>
                                <li>Design inspiration or competitor examples</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-number">3</div>
                        <div className="help-step-content">
                            <h3><Zap size={20} /> Generate Your Mockup</h3>
                            <p>Click the <strong>"Generate Design Mockup"</strong> button. The AI will:</p>
                            <ul>
                                <li>Analyze your strategic data from all completed tools</li>
                                <li>Create a tailored landing page concept</li>
                                <li>Design component layouts and wireframes</li>
                                <li>Generate color palettes and typography suggestions</li>
                                <li>Craft high-converting headlines and copy</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-step">
                        <div className="help-step-number">4</div>
                        <div className="help-step-content">
                            <h3>Review & Iterate</h3>
                            <p>Your mockup is automatically saved. You can:</p>
                            <ul>
                                <li><strong>Regenerate</strong> for new variations</li>
                                <li><strong>View History</strong> to see all past mockups</li>
                                <li><strong>Restore</strong> any previous version</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-tip">
                        <strong>💡 Pro Tip:</strong> The more complete your profile data, the more tailored and effective your visual mockup will be!
                    </div>
                </div>

                <div className="help-modal-footer">
                    <button className="help-modal-cta" onClick={onClose}>
                        Got it, let's create!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetAIHelpModal;
