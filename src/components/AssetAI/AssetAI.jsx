import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Sparkles, Palette, Type, CheckCircle, Zap, Upload, X, LogIn, ImageIcon, History, Lock, HelpCircle } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { uploadAssetImage, saveAiAsset, fetchUserAssets } from '../../utils/assetUtils';
import { analyzeToolData } from '../../utils/analysisService';
import AssetAIHelpModal from './AssetAIHelpModal';
import '../shared-tool-styles.css';
import './AssetAI.css';
import './AssetAIHeader.css';
import './AssetAIButton.css';

const AssetAI = ({ profileIndex }) => {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated } = useAuth();
    const fileInputRef = useRef(null);
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [visualContext, setVisualContext] = useState([]); // Now an array
    const [uploadPreviews, setUploadPreviews] = useState([]); // Now an array
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Landing Page');
    const [aiResults, setAiResults] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-asset-ai-results'));
        return saved ? JSON.parse(saved) : null;
    });
    const [previousAssets, setPreviousAssets] = useState([]);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(getProfileKey('imi-asset-ai-results'));
        setAiResults(saved ? JSON.parse(saved) : null);

        if (isAuthenticated && user) {
            loadUserAssets();

            // Persistence Fix: If no local results, check Supabase for the latest one
            // We check localstorage again here in case the direct set hasn't propagated yet
            if (!saved) {
                syncLatestAsset();
            }
        }
    }, [isAuthenticated, user, profileIndex, getProfileKey]);

    const syncLatestAsset = async () => {
        try {
            const assets = await fetchUserAssets(user.id, profileIndex);
            if (assets && assets.length > 0) {
                const latest = assets[0].results;
                setAiResults(latest);
                localStorage.setItem(getProfileKey('imi-asset-ai-results'), JSON.stringify(latest));
            }
        } catch (err) {
            console.error("Failed to sync latest asset:", err);
        }
    };

    const loadUserAssets = async () => {
        try {
            const assets = await fetchUserAssets(user.id, profileIndex);
            setPreviousAssets(assets);
        } catch (err) {
            console.error("Failed to load assets:", err);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const validFiles = files.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    setError(`Image ${file.name} is too large (>5MB).`);
                    return false;
                }
                return true;
            });

            if (validFiles.length > 0) {
                setVisualContext(prev => [...prev, ...validFiles].slice(0, 3)); // Limit to 3
                const newPreviews = validFiles.map(f => URL.createObjectURL(f));
                setUploadPreviews(prev => [...prev, ...newPreviews].slice(0, 3));
                setError(null);
            }
        }
    };

    const removeContextImage = (idx) => {
        setVisualContext(prev => prev.filter((_, i) => i !== idx));
        setUploadPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const clearVisualContext = () => {
        setVisualContext([]);
        setUploadPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const runAssetAnalysis = async () => {
        if (!isAuthenticated) {
            setError("Please sign in to use this tool and save your results.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const getStored = (key) => JSON.parse(localStorage.getItem(getProfileKey(key)) || '{}');
            const brand = getStored('imi-brand-data');
            const product = getStored('imi-product-data');
            const prospect = getStored('imi-prospect-data');
            const compass = getStored('imi-compass-data');

            if (!product.productName && !product.problemSolved) {
                throw new Error("Please complete the Product Profiler first to provide enough context for the AI designer.");
            }

            let imageUrls = [];
            if (visualContext.length > 0) {
                setIsSaving(true);
                // Upload all context images
                imageUrls = await Promise.all(
                    visualContext.map(file => uploadAssetImage(file, user.id))
                );
            }

            const allData = {
                brand,
                product,
                prospect,
                compass,
                visuals: imageUrls.length > 0 ? {
                    main: imageUrls[0],
                    all: imageUrls
                } : null
            };

            const results = await analyzeToolData('assetAI', allData, i18n.language);

            // Save to database
            const assetRecord = {
                user_id: user.id,
                profile_index: profileIndex,
                type: results.landingPage?.assetType || "Mixed Asset Bundle",
                results: results,
                image_urls: imageUrls.length > 0 ? { main: imageUrls[0], all: imageUrls } : null
            };

            await saveAiAsset(assetRecord);

            setAiResults(results);
            localStorage.setItem(getProfileKey('imi-asset-ai-results'), JSON.stringify(results));
            window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'assetAI' }));
            loadUserAssets(); // Refresh gallery
            clearVisualContext(); // Clean up context after success
        } catch (err) {
            console.error("Asset AI analysis failed:", err);
            setError(err.message || "Failed to generate design mockup. Please try again.");
        } finally {
            setIsLoading(false);
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const urls = files.map(f => URL.createObjectURL(f));
            setAiResults(prev => {
                if (!prev) return prev;

                const updateAssetVisuals = (asset) => {
                    if (!asset) return asset;
                    const v = asset.visuals || { main: '', all: [] };
                    return {
                        ...asset,
                        visuals: {
                            ...v,
                            all: [...(v.all || []), ...urls],
                            main: v.main || urls[0]
                        }
                    };
                };

                if (prev.landingPage) {
                    return {
                        ...prev,
                        landingPage: updateAssetVisuals(prev.landingPage),
                        socialPost: updateAssetVisuals(prev.socialPost),
                        emailHeader: updateAssetVisuals(prev.emailHeader)
                    };
                } else {
                    return updateAssetVisuals(prev);
                }
            });
        }
    };

    const selectMainImage = (url) => {
        setAiResults(prev => {
            if (!prev) return prev;

            const updateMain = (asset) => {
                if (!asset || !asset.visuals) return asset;
                return {
                    ...asset,
                    visuals: { ...asset.visuals, main: url }
                };
            };

            if (prev.landingPage) {
                return {
                    ...prev,
                    landingPage: updateMain(prev.landingPage),
                    socialPost: updateMain(prev.socialPost),
                    emailHeader: updateMain(prev.emailHeader)
                };
            } else {
                return updateMain(prev);
            }
        });
    };

    const getActiveAssetData = () => {
        if (!aiResults) return null;
        if (!aiResults.landingPage) return aiResults; // Legacy fallback

        switch (activeTab) {
            case 'Social Post': return aiResults.socialPost;
            case 'Email Header': return aiResults.emailHeader;
            default: return aiResults.landingPage;
        }
    };

    const activeAsset = getActiveAssetData();

    if (!isAuthenticated) {
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
                </div>
                <div className="tool-card gate-card">
                    <Lock size={48} color="var(--slate-gray)" className="mb-4" />
                    <h3>Authenticated Access Only</h3>
                    <p>Unlock the power of AI-driven visual strategy. Sign in to generate and save your marketing assets.</p>
                    <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('show-auth-modal'))}>
                        <LogIn size={18} /> Sign In to Proceed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="tool-container asset-ai-container">
            <div className="tool-header">
                <button className="asset-ai-help-btn" onClick={() => setShowHelpModal(true)} title="How to use Asset AI">
                    <HelpCircle size={20} />
                </button>
                <div className="tool-icon-label">
                    <div className="tool-icon-circle" style={{ background: 'linear-gradient(135deg, #FF4081, #EC407A)' }}>
                        <Layout size={24} color="white" />
                    </div>
                    <span className="tool-label">Asset AI</span>
                </div>
                <div className="header-actions">
                    <h2 className="tool-title">Visual Marketing Asset Mockup</h2>
                    {previousAssets.length > 0 && (
                        <button className="gallery-toggle" onClick={() => setShowGallery(!showGallery)}>
                            <History size={18} /> {showGallery ? 'Hide History' : 'View History'}
                        </button>
                    )}
                </div>
                <p className="tool-description">
                    Transform your strategy into a visual masterpiece. Generate high-converting landing page concepts and funnel structures tailored to your brand.
                </p>
            </div>

            <div className="tool-card main-card">
                {!aiResults || showGallery ? (
                    showGallery ? (
                        <div className="asset-gallery">
                            <h3 className="mb-6">Your Generated Assets</h3>
                            <div className="gallery-grid">
                                {previousAssets.map((asset) => (
                                    <div key={asset.id} className="gallery-item-card" onClick={() => {
                                        setAiResults(asset.results);
                                        setShowGallery(false);
                                    }}>
                                        <div className="item-preview" style={{ background: (asset.results.landingPage?.colorPalette?.[0] || asset.results.colorPalette?.[0] || '#2563EB') + '20' }}>
                                            <span style={{ color: asset.results.landingPage?.colorPalette?.[0] || asset.results.colorPalette?.[0] || '#2563EB' }}>
                                                {(asset.results.landingPage?.headline || asset.results.headline || '').substring(0, 30)}...
                                            </span>
                                        </div>
                                        <div className="item-info">
                                            <h4>{asset.type}</h4>
                                            <p>{new Date(asset.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-secondary mt-8" onClick={() => setShowGallery(false)}>Back to Generator</button>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="upload-section">
                                <div className={`upload-dropzone ${uploadPreviews.length > 0 ? 'has-file' : ''}`} onClick={() => fileInputRef.current.click()}>
                                    {uploadPreviews.length > 0 ? (
                                        <div className="previews-grid">
                                            {uploadPreviews.map((url, idx) => (
                                                <div key={idx} className="preview-item">
                                                    <img src={url} alt={`Context ${idx}`} />
                                                    <button className="remove-file" onClick={(e) => { e.stopPropagation(); removeContextImage(idx); }}>
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {uploadPreviews.length < 3 && (
                                                <div className="add-more-placeholder">
                                                    <Upload size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <ImageIcon size={32} color="var(--slate-gray)" />
                                            <p>Add Visual Context (Up to 3)</p>
                                            <span>Drop images or click to upload</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="empty-illustration">
                                <Sparkles size={64} color="var(--electric-blue)" />
                            </div>
                            <h3>Ready to visualize your offer?</h3>
                            <p>We'll combine your brand, product, and prospect data to design the perfect entry point for your customer.</p>

                            <button className="btn btn-primary btn-large" onClick={runAssetAnalysis} disabled={isLoading}>
                                {isLoading ? (
                                    <><div className="spinner-inline"></div> {isSaving ? 'Uploading...' : 'Designing...'}</>
                                ) : (
                                    <><Zap size={18} /> Generate Design Mockup</>
                                )}
                            </button>
                            {error && (
                                <div className="error-message mt-4">
                                    <strong>Setup Needed:</strong> {error}
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <div className="asset-results-view">
                        <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            <div>
                                <span className="badge">{activeAsset?.assetType || 'Visual Asset'}</span>
                                <h3 className="mt-2">Strategic Visual Concept</h3>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-outline" onClick={() => setAiResults(null)}>New</button>
                                <button className="btn btn-secondary" onClick={runAssetAnalysis} disabled={isLoading}>
                                    {isLoading ? t('common.generating') : 'Regenerate'}
                                </button>
                            </div>
                        </div>

                        {/* Asset Type Tabs */}
                        <div className="asset-tabs">
                            {['Landing Page', 'Social Post', 'Email Header'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveTab(type)}
                                    className={`tab-btn ${activeTab === type ? 'active' : ''}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="asset-preview-frame" style={{
                            maxWidth: activeTab === 'Social Post' ? '500px' : '100%',
                            margin: activeTab === 'Social Post' ? '0 auto 32px' : '0 0 32px'
                        }}>
                            {activeTab !== 'Social Post' ? (
                                <div className="browser-header">
                                    <div className="browser-dot red"></div>
                                    <div className="browser-dot yellow"></div>
                                    <div className="browser-dot green"></div>
                                    <div className="browser-url">
                                        {activeTab === 'Email Header' ? 'Inbox • Welcome Sequence' : 'your-strategy-in-action.com'}
                                    </div>
                                </div>
                            ) : (
                                <div className="social-preview-header">
                                    <div className="social-avatar"></div>
                                    <div className="social-username">YourBrand_Official</div>
                                </div>
                            )}

                            <div className="hero-preview" style={{
                                background: activeAsset?.visuals?.main
                                    ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${activeAsset.visuals.main}) center/cover no-repeat`
                                    : `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), ${activeAsset?.colorPalette?.[0] || '#2979ff'}10`,
                                color: activeAsset?.visuals?.main ? 'white' : 'inherit',
                                minHeight: activeTab === 'Social Post' ? '400px' : 'auto'
                            }}>
                                <h1 className="preview-headline" style={{
                                    color: activeAsset?.visuals?.main ? 'white' : (activeAsset?.colorPalette?.[0] || '#2979ff'),
                                    textShadow: activeAsset?.visuals?.main ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
                                }}>
                                    {activeAsset?.headline}
                                </h1>
                                <p className="preview-subheadline" style={{
                                    color: activeAsset?.visuals?.main ? 'rgba(255,255,255,0.9)' : '#555',
                                    textShadow: activeAsset?.visuals?.main ? '0 1px 4px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {activeAsset?.subheadline}
                                </p>

                                <div className="preview-ctas">
                                    {activeAsset?.ctaButtons?.map((btn, idx) => (
                                        <button key={idx} className={`btn ${btn.style === 'primary' ? 'btn-primary' : 'btn-outline'}`} style={{
                                            background: btn.style === 'primary' ? (activeAsset.colorPalette?.[0] || '#2979ff') : 'transparent',
                                            borderColor: btn.style === 'primary' ? 'transparent' : (activeAsset?.visuals?.main ? 'rgba(255,255,255,0.5)' : '#ddd'),
                                            color: btn.style === 'primary' ? 'white' : (activeAsset?.visuals?.main ? 'white' : '#333')
                                        }}>
                                            {btn.text}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Visuals Section (New) */}
                            {activeTab === 'Landing Page' && activeAsset?.visuals?.secondary?.length > 0 && (
                                <div className="secondary-visuals-section">
                                    <h5 className="section-subtitle">Feature Showcase</h5>
                                    <div className="features-grid">
                                        {activeAsset.visuals.secondary.map((img, idx) => (
                                            <div key={idx} className="feature-card">
                                                <div className="feature-img" style={{ backgroundImage: `url(${img})` }}></div>
                                                <div className="feature-info">
                                                    <h6>{activeAsset.valueProps?.[idx]?.title || `Feature ${idx + 1}`}</h6>
                                                    <p>{activeAsset.valueProps?.[idx]?.description || 'Key highlight from your product strategy.'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="asset-details-grid">
                            <div className="asset-part-card">
                                <h4>Layout Structure</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {activeAsset?.layoutStructure?.split('->').map((step, idx) => (
                                        <div key={idx} style={{
                                            background: '#f3f4f6',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            color: '#374151'
                                        }}>
                                            {idx + 1}. {step.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="asset-part-card full-width">
                                <h4>💡 Strategic Context & Advice</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
                                    <div className="advice-item">
                                        <strong>Best For:</strong>
                                        <p style={{ margin: '4px 0 0 0', color: '#555' }}>{activeAsset?.strategicAdvice?.usage || "General high-conversion landing pages."}</p>
                                    </div>
                                    <div className="advice-item">
                                        <strong>Pro Tip:</strong>
                                        <p style={{ margin: '4px 0 0 0', color: '#555' }}>{activeAsset?.strategicAdvice?.tip || "Focus on clarity above all else."}</p>
                                    </div>
                                    <div className="advice-item">
                                        <strong>Placement:</strong>
                                        <p style={{ margin: '4px 0 0 0', color: '#555' }}>{activeAsset?.strategicAdvice?.placement || "Website, Email, or Social."}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="asset-part-card">
                                <h4>Design Specs</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <Palette size={16} color="var(--electric-blue)" />
                                    <span style={{ fontSize: '0.9rem' }}>Dynamic Palette</span>
                                </div>
                                <div className="palette-preview">
                                    {activeAsset?.colorPalette?.map((color, idx) => (
                                        <div key={idx} className="color-swatch" style={{ background: color }} title={color}></div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px' }}>
                                    <Type size={16} color="var(--electric-blue)" />
                                    <span style={{ fontSize: '0.9rem' }}>{activeAsset?.fontPairing}</span>
                                </div>
                            </div>

                            <div className="asset-part-card full-width" style={{ border: '2px dashed #e5e7eb', background: '#f9fafb', textAlign: 'center' }}>
                                <h4>Visuals Gallery</h4>
                                <p style={{ marginBottom: '16px', color: '#666', fontSize: '0.9rem' }}>Upload multiple product images to test different visuals in your mockup.</p>
                                <label className="upload-btn-secondary" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    <Upload size={18} />
                                    <span>Upload Media Library</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>

                                {activeAsset?.visuals?.all?.length > 0 && (
                                    <div className="visuals-gallery-grid">
                                        {activeAsset.visuals.all.map((img, idx) => (
                                            <div key={idx}
                                                className={`gallery-thumb ${activeAsset.visuals.main === img ? 'active' : ''}`}
                                                onClick={() => selectMainImage(img)}
                                                style={{ backgroundImage: `url(${img})` }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="asset-footer-note" style={{ marginTop: '30px', padding: '20px', background: '#f0f7ff', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <CheckCircle size={24} color="var(--electric-blue)" />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>Ready for Implementation</h4>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#4b5563' }}>
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
                        <h3>{isSaving ? 'Uploading context...' : 'Designing your asset...'}</h3>
                        <p>{isSaving ? 'Securing your visual assets in our premium vault.' : 'We\'re weaving your brand story into a high-converting layout.'}</p>
                    </div>
                </div>
            )}

            <AssetAIHelpModal
                isOpen={showHelpModal}
                onClose={() => setShowHelpModal(false)}
            />
        </div>
    );
};

export default AssetAI;
