import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Sparkles, ArrowRight, MousePointer2, Palette, Type, CheckCircle, Zap } from 'lucide-react';
import { analyzeToolData } from '../../utils/analysisService';
import '../shared-tool-styles.css';
import './AssetAI.css';

const AssetAI = ({ profileIndex }) => {
    const { t, i18n } = useTranslation();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiResults, setAiResults] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-asset-ai-results'));
        return saved ? JSON.parse(saved) : null;
    });

    const runAssetAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const getStored = (key) => JSON.parse(localStorage.getItem(getProfileKey(key)) || '{}');
            const brand = getStored('imi-brand-data');
            const product = getStored('imi-product-data');
            const prospect = getStored('imi-prospect-data');
            const compass = getStored('imi-compass-data');

            // Validation: Ensure at least product data exists
            if (!product.productName && !product.problemSolved) {
                throw new Error("Please complete the Product Profiler first to provide enough context for the AI designer.");
            }

            const allData = { brand, product, prospect, compass };
            const results = await analyzeToolData('assetAI', allData, i18n.language);

            setAiResults(results);
            localStorage.setItem(getProfileKey('imi-asset-ai-results'), JSON.stringify(results));
            window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'assetAI' }));
        } catch (err) {
            console.error("Asset AI analysis failed:", err);
            setError(err.message || "Failed to generate design mockup. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tool-container asset-ai-container">
            <div className="tool-header">
                <div className="tool-icon-label">
                    <div className="tool-icon-circle" style={{ background: 'linear-gradient(135deg, #FF4081, #EC407A)' }}>
                        <Layout size={24} color="white" />
                    </div>
                    <span className="tool-label">Asset AI</span>
                </div>
                <h2 className="tool-title">Visual Marketing Asset Mockup</h2>
                <p className="tool-description">
                    Transform your strategy into a visual masterpiece. Generate high-converting landing page concepts and funnel structures tailored to your brand.
                </p>
            </div>

            <div className="tool-card main-card">
                {!aiResults ? (
                    <div className="empty-state">
                        <div className="empty-illustration">
                            <Sparkles size={64} color="var(--electric-blue)" />
                        </div>
                        <h3>Ready to visualize your offer?</h3>
                        <p>We'll combine your brand, product, and prospect data to design the perfect entry point for your customer.</p>
                        <button className="btn btn-primary btn-large" onClick={runAssetAnalysis} disabled={isLoading}>
                            {isLoading ? (
                                <><div className="spinner-inline"></div> Generating Concept...</>
                            ) : (
                                <><Zap size={18} /> Generate Design Mockup</>
                            )}
                        </button>
                        {error && (
                            <div className="error-message mt-4" style={{ color: 'var(--coral-red)', background: '#fff5f5', padding: '15px', borderRadius: '8px', border: '1px solid #ffcdd2' }}>
                                <strong>Setup Needed:</strong> {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="asset-results">
                        <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span className="badge">{aiResults.assetType}</span>
                                <h3 className="mt-2">Strategic Visual Concept</h3>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={runAssetAnalysis} disabled={isLoading}>
                                {isLoading ? t('common.generating') : 'Regenerate'}
                            </button>
                        </div>

                        {/* Interactive Browser Preview */}
                        <div className="asset-preview-card">
                            <div className="browser-header">
                                <div className="browser-dot red"></div>
                                <div className="browser-dot yellow"></div>
                                <div className="browser-dot green"></div>
                                <div className="browser-url">your-strategy-in-action.com</div>
                            </div>
                            <div className="hero-preview" style={{ background: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), ${aiResults.colorPalette.primary}10` }}>
                                <h1 className="preview-headline" style={{ color: aiResults.colorPalette.primary }}>{aiResults.headline}</h1>
                                <p className="preview-subheadline">{aiResults.subheadline}</p>
                                <a href="#" className="preview-cta" style={{ background: aiResults.colorPalette.primary, boxShadow: `0 10px 20px ${aiResults.colorPalette.primary}40` }}>
                                    {aiResults.ctaText}
                                </a>
                            </div>
                        </div>

                        {/* Example Statement */}
                        <div className="example-statement-card">
                            <h4>Consolidated Strategy Statement</h4>
                            <p className="statement-text">{aiResults.exampleStatement}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="asset-details-grid">
                            {aiResults.sections.map((section, idx) => (
                                <div key={idx} className="asset-part-card">
                                    <h4>{section.title}</h4>
                                    <p style={{ color: 'var(--slate-gray)', fontSize: '0.95rem', lineHeight: '1.5' }}>{section.content}</p>
                                </div>
                            ))}

                            <div className="asset-part-card">
                                <h4>Design Specs</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <Palette size={16} color="var(--electric-blue)" />
                                    <span style={{ fontSize: '0.9rem' }}>Dynamic Palette</span>
                                </div>
                                <div className="palette-preview">
                                    <div className="color-swatch" style={{ background: aiResults.colorPalette.primary }} title={`Primary: ${aiResults.colorPalette.primary}`}></div>
                                    <div className="color-swatch" style={{ background: aiResults.colorPalette.secondary }} title={`Secondary: ${aiResults.colorPalette.secondary}`}></div>
                                    <div className="color-swatch" style={{ background: aiResults.colorPalette.accent }} title={`Accent: ${aiResults.colorPalette.accent}`}></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px' }}>
                                    <Type size={16} color="var(--electric-blue)" />
                                    <span style={{ fontSize: '0.9rem' }}>{aiResults.typography}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'var(--soft-blue)', borderRadius: '12px', display: 'flex', gap: '15px' }}>
                            <CheckCircle size={24} color="var(--electric-blue)" />
                            <div>
                                <h4 style={{ margin: 0, color: 'var(--midnight-black)' }}>Ready for Implementation</h4>
                                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--slate-gray)' }}>
                                    This asset is designed to bridge the gap between your Brand Identity and Prospect Motivations. Use these details to brief your designer or copywriter.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <h3>Designing your asset...</h3>
                        <p>We're weaving your brand story into a high-converting layout.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetAI;
