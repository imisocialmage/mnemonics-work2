import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Sparkles, Palette, Type, CheckCircle, Zap, Upload, X, LogIn, ImageIcon, History, Lock, HelpCircle, Plus, RefreshCw, Maximize2, RectangleHorizontal, RectangleVertical, Square, Monitor, Smartphone, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, ThumbsUp, Link as LinkIcon, AlertTriangle, Save } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { uploadAssetImage, saveAiAsset, fetchUserAssets } from '../../utils/assetUtils';
import { analyzeToolData } from '../../utils/analysisService';
import { analyzeImage } from '../../utils/ImageAnalysisService';
import ImageValidationModal from './ImageValidationModal';
import ImageCropper from './ImageCropper';
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
    const [activePlatform, setActivePlatform] = useState('instagram');
    const [activeCoverType, setActiveCoverType] = useState('facebook');
    const [activeFormat, setActiveFormat] = useState(null);
    const colorInputRef = useRef(null);
    const [editingColorIdx, setEditingColorIdx] = useState(0);
    const [showProspectWarning, setShowProspectWarning] = useState(false);
    const [activeLinkIdx, setActiveLinkIdx] = useState(0);
    const [brandProfile, setBrandProfile] = useState(null);

    // Image Optimization State
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [cropperImage, setCropperImage] = useState(null); // URL string defined
    const [pendingFile, setPendingFile] = useState(null); // Store file while analyzing

    useEffect(() => {
        const brandData = JSON.parse(localStorage.getItem(getProfileKey('imi-brand-data')) || '{}');
        setBrandProfile(brandData);
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

        // Check for prospect data
        const prospectData = JSON.parse(localStorage.getItem(getProfileKey('imi-prospect-data')) || '{}');
        if (!prospectData.role && !prospectData.industry) {
            setShowProspectWarning(true);
        }
    }, [isAuthenticated, user, profileIndex, getProfileKey]);

    // Autosave to LocalStorage on change
    useEffect(() => {
        if (aiResults) {
            localStorage.setItem(getProfileKey('imi-asset-ai-results'), JSON.stringify(aiResults));
        }
    }, [aiResults, getProfileKey]);

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

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const file = files[0]; // Process one at a time for analysis

            if (file.size > 5 * 1024 * 1024) {
                setError(`Image ${file.name} is too large (>5MB).`);
                return;
            }

            // Analyze Image
            try {
                const result = await analyzeImage(file);
                setAnalysisResult(result);
                setPendingFile(file);
                // Show validation modal
            } catch (err) {
                console.error("Image analysis failed", err);
                // Fallback to normal add if analysis fails
                addImagesToContext([file]);
            }
        }
    };

    const addImagesToContext = (files) => {
        if (files.length > 0) {
            setVisualContext(prev => [...prev, ...files].slice(0, 3));
            const newPreviews = files.map(f => URL.createObjectURL(f));
            setUploadPreviews(prev => [...prev, ...newPreviews].slice(0, 3));
            setError(null);
        }
    };

    const handleAnalysisDecision = (decision) => {
        if (decision === 'use_original' && pendingFile) {
            addImagesToContext([pendingFile]);
            setAnalysisResult(null);
            setPendingFile(null);
        } else if (decision === 'crop' && pendingFile) {
            setCropperImage(URL.createObjectURL(pendingFile));
            setShowCropper(true);
            setAnalysisResult(null);
        } else {
            // Cancel
            setAnalysisResult(null);
            setPendingFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCropComplete = async (blobUrl) => {
        // Convert blob URL back to file object for consistency with context
        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
            addImagesToContext([file]);
            setShowCropper(false);
            setCropperImage(null);
            setPendingFile(null);
        } catch (e) {
            console.error("Crop save failed", e);
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
            } else if (aiResults?.landingPage?.visuals?.all?.length > 0) {
                // FALLBACK: Use existing visuals if regenerating without new uploads
                imageUrls = aiResults.landingPage.visuals.all;
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

    const saveCurrentAsset = async () => {
        if (!aiResults || !user) return;
        setIsSaving(true);
        try {
            const assetRecord = {
                user_id: user.id,
                profile_index: profileIndex,
                type: aiResults.landingPage?.assetType || "Mixed Asset Bundle",
                results: aiResults,
                image_urls: aiResults.landingPage?.visuals || null
            };
            await saveAiAsset(assetRecord);
            loadUserAssets(); // Refresh gallery
        } catch (err) {
            console.error("Manual save failed:", err);
            setError("Failed to save changes.");
        } finally {
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

            const updated = { ...prev };
            if (updated.landingPage) updated.landingPage = updateMain(updated.landingPage);

            if (updated.socialPosts) {
                Object.keys(updated.socialPosts).forEach(key => {
                    updated.socialPosts[key] = updateMain(updated.socialPosts[key]);
                });
            } else if (updated.socialPost) {
                updated.socialPost = updateMain(updated.socialPost);
            }

            if (updated.socialCover) {
                Object.keys(updated.socialCover).forEach(key => {
                    updated.socialCover[key] = updateMain(updated.socialCover[key]);
                });
            } else if (updated.emailHeader) {
                updated.emailHeader = updateMain(updated.emailHeader);
            }

            return updated;
        });
    };

    const getActiveAssetData = () => {
        if (!aiResults) return null;
        if (!aiResults.landingPage) return aiResults; // Legacy fallback

        switch (activeTab) {
            case 'Social Post': return aiResults.socialPosts?.[activePlatform] || aiResults.socialPost;
            case 'Social Cover': return aiResults.socialCover?.[activeCoverType] || aiResults.emailHeader;
            default: return aiResults.landingPage;
        }
    };

    const activeAsset = getActiveAssetData();

    // Platform format definitions
    const PLATFORM_FORMATS = {
        instagram: [
            { key: 'square', label: 'Feed (1:1)', ratio: '1 / 1', maxWidth: '500px', icon: Square },
            { key: 'portrait', label: 'Portrait (4:5)', ratio: '4 / 5', maxWidth: '500px', icon: RectangleVertical },
            { key: 'story', label: 'Story (9:16)', ratio: '9 / 16', maxWidth: '400px', icon: Smartphone },
        ],
        facebook: [
            { key: 'portrait', label: 'Feed (4:5)', ratio: '4 / 5', maxWidth: '500px', icon: RectangleVertical },
            { key: 'square', label: 'Square (1:1)', ratio: '1 / 1', maxWidth: '500px', icon: Square },
        ],
        tiktok: [
            { key: 'vertical', label: 'Vertical (9:16)', ratio: '9 / 16', maxWidth: '400px', icon: Smartphone },
        ],
        linkedin: [
            { key: 'landscape', label: 'Landscape (1.91:1)', ratio: '1.91 / 1', maxWidth: '100%', icon: RectangleHorizontal },
            { key: 'square', label: 'Square (1:1)', ratio: '1 / 1', maxWidth: '600px', icon: Square },
        ],
    };

    const COVER_FORMATS = {
        facebook: { label: 'Facebook Cover (820×312)', ratio: '820 / 312', maxWidth: '100%' },
        youtube: { label: 'YouTube Banner (16:9)', ratio: '16 / 9', maxWidth: '100%' },
    };

    const getPreviewStyle = () => {
        if (activeTab === 'Landing Page') {
            return { maxWidth: activeFormat === 'mobile' ? '400px' : '100%', margin: activeFormat === 'mobile' ? '0 auto 32px' : '0 0 32px' };
        }
        if (activeTab === 'Social Post') {
            const formats = PLATFORM_FORMATS[activePlatform] || [];
            const fmt = formats.find(f => f.key === activeFormat) || formats[0];
            return { maxWidth: fmt?.maxWidth || '500px', margin: '0 auto 32px' };
        }
        if (activeTab === 'Social Cover') {
            const fmt = COVER_FORMATS[activeCoverType];
            return { maxWidth: fmt?.maxWidth || '100%', margin: '0 0 32px' };
        }
        return {};
    };

    const getPreviewAspectRatio = () => {
        if (activeTab === 'Social Post') {
            const formats = PLATFORM_FORMATS[activePlatform] || [];
            const fmt = formats.find(f => f.key === activeFormat) || formats[0];
            return fmt?.ratio || '1 / 1';
        }
        if (activeTab === 'Social Cover') {
            const fmt = COVER_FORMATS[activeCoverType];
            return fmt?.ratio || '16 / 9';
        }
        return null; // Landing page uses min-height instead
    };

    const updateAssetColor = (colorIndex, newColor) => {
        setAiResults(prev => {
            if (!prev) return prev;
            const updated = JSON.parse(JSON.stringify(prev));

            const updatePalette = (asset) => {
                if (asset?.colorPalette && Array.isArray(asset.colorPalette)) {
                    asset.colorPalette[colorIndex] = newColor;
                }
            };

            // Update the current active asset's palette
            if (activeTab === 'Landing Page') updatePalette(updated.landingPage);
            else if (activeTab === 'Social Post') updatePalette(updated.socialPosts?.[activePlatform]);
            else if (activeTab === 'Social Cover') updatePalette(updated.socialCover?.[activeCoverType]);

            return updated;
        });
    };

    const updateAssetLink = (btnIndex, newLink) => {
        setAiResults(prev => {
            if (!prev) return prev;
            const updated = JSON.parse(JSON.stringify(prev));

            const updateButtons = (asset) => {
                if (asset?.ctaButtons && asset.ctaButtons[btnIndex]) {
                    asset.ctaButtons[btnIndex].link = newLink;
                }
            };

            if (activeTab === 'Landing Page') updateButtons(updated.landingPage);
            else if (activeTab === 'Social Post') updateButtons(updated.socialPosts?.[activePlatform]);
            else if (activeTab === 'Social Cover') updateButtons(updated.socialCover?.[activeCoverType]);

            return updated;
        });
    };

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
                        <div className="results-header">
                            <div className="results-header-info">
                                <span className="asset-badge">{activeAsset?.assetType || 'Visual Asset'}</span>
                                <h3 className="results-title">Strategic Visual Concept</h3>
                                {showProspectWarning && (
                                    <div className="prospect-warning" title="Complete Prospect Guide for better targeting">
                                        <AlertTriangle size={14} color="#f59e0b" />
                                        <span>Tip: Complete Prospect Guide for better targeting</span>
                                        <button onClick={() => setShowProspectWarning(false)}><X size={12} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="results-header-actions">
                                <button className="btn-new" onClick={() => setAiResults(null)}>
                                    <Plus size={16} /> New
                                </button>
                                <button className="btn-regenerate" onClick={runAssetAnalysis} disabled={isLoading}>
                                    <RefreshCw size={16} className={isLoading ? 'spin-icon' : ''} />
                                    {isLoading ? t('common.generating') : 'Regenerate'}
                                </button>
                                <button className="btn-save" onClick={saveCurrentAsset} disabled={isSaving}>
                                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Asset Type Tabs */}
                        <div className="asset-tabs">
                            {['Landing Page', 'Social Post', 'Social Cover'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setActiveTab(type);
                                        setActiveFormat(null);
                                    }}
                                    className={`tab-btn ${activeTab === type ? 'active' : ''}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Platform Sub-Tabs for Social Post */}
                        {activeTab === 'Social Post' && (
                            <div className="platform-subtabs">
                                {[
                                    { key: 'instagram', label: '📸 Instagram' },
                                    { key: 'facebook', label: '👍 Facebook' },
                                    { key: 'tiktok', label: '🎵 TikTok' },
                                    { key: 'linkedin', label: '💼 LinkedIn' },
                                ].map(p => (
                                    <button
                                        key={p.key}
                                        className={`platform-btn ${activePlatform === p.key ? 'active' : ''}`}
                                        onClick={() => { setActivePlatform(p.key); setActiveFormat(null); }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Cover Sub-Tabs for Social Cover */}
                        {activeTab === 'Social Cover' && (
                            <div className="platform-subtabs">
                                {[
                                    { key: 'facebook', label: '📘 Facebook Cover' },
                                    { key: 'youtube', label: '▶️ YouTube Banner' },
                                ].map(c => (
                                    <button
                                        key={c.key}
                                        className={`platform-btn ${activeCoverType === c.key ? 'active' : ''}`}
                                        onClick={() => setActiveCoverType(c.key)}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Interactive Controls Bar */}
                        <div className="asset-controls-bar">
                            {/* Color Palette Picker */}
                            <div className="control-group">
                                <label className="control-label"><Palette size={14} /> Colors</label>
                                <div className="color-swatch-row">
                                    {activeAsset?.colorPalette?.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="color-swatch-editable"
                                            style={{ background: color }}
                                            title={`Click to edit: ${color}`}
                                            onClick={() => {
                                                setEditingColorIdx(idx);
                                                if (colorInputRef.current) {
                                                    colorInputRef.current.value = color;
                                                    colorInputRef.current.click();
                                                }
                                            }}
                                        />
                                    ))}
                                    <input
                                        ref={colorInputRef}
                                        type="color"
                                        className="hidden-color-input"
                                        value={activeAsset?.colorPalette?.[editingColorIdx] || '#000000'}
                                        onChange={(e) => {
                                            if (editingColorIdx !== null) {
                                                updateAssetColor(editingColorIdx, e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Image Upload Control */}
                            <div className="control-group">
                                <label className="control-label"><ImageIcon size={14} /> Image</label>
                                <div className="image-control-wrapper" style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn-outline-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                        onClick={() => document.getElementById('result-image-upload').click()}
                                    >
                                        <Upload size={12} className="mr-1" /> Replace
                                    </button>
                                    <input
                                        id="result-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                const url = URL.createObjectURL(e.target.files[0]);
                                                selectMainImage(url);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Image Optimization Modals */}
                            {analysisResult && (
                                <ImageValidationModal
                                    analysis={analysisResult}
                                    onCancel={() => handleAnalysisDecision('cancel')}
                                    onUseOriginal={() => handleAnalysisDecision('use_original')}
                                    onCrop={() => handleAnalysisDecision('crop')}
                                />
                            )}

                            {showCropper && cropperImage && (
                                <ImageCropper
                                    imageSrc={cropperImage}
                                    targetAspect={1} // Default square for now, could be dynamic
                                    onCancel={() => setShowCropper(false)}
                                    onCrop={handleCropComplete}
                                />
                            )}

                            {/* Link Editor */}
                            {activeAsset?.ctaButtons?.length > 0 && (
                                <div className="control-group link-control">
                                    <label className="control-label"><LinkIcon size={14} /> Links</label>
                                    <div className="link-input-wrapper">
                                        <select
                                            className="link-btn-select"
                                            value={activeLinkIdx}
                                            onChange={(e) => setActiveLinkIdx(Number(e.target.value))}
                                        >
                                            {activeAsset.ctaButtons.map((btn, idx) => (
                                                <option key={idx} value={idx}>{btn.text}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            className="link-input"
                                            value={activeAsset.ctaButtons[activeLinkIdx]?.link || '#'}
                                            onChange={(e) => updateAssetLink(activeLinkIdx, e.target.value)}
                                            placeholder="https://"
                                        />
                                    </div>
                                </div>
                            )}



                            {/* Format Selector */}
                            {activeTab === 'Social Post' && PLATFORM_FORMATS[activePlatform] && (
                                <div className="control-group">
                                    <label className="control-label"><Maximize2 size={14} /> Format</label>
                                    <div className="format-pills">
                                        {PLATFORM_FORMATS[activePlatform].map(fmt => {
                                            const IconComp = fmt.icon;
                                            return (
                                                <button
                                                    key={fmt.key}
                                                    className={`format-pill ${(activeFormat || PLATFORM_FORMATS[activePlatform][0]?.key) === fmt.key ? 'active' : ''}`}
                                                    onClick={() => setActiveFormat(fmt.key)}
                                                >
                                                    <IconComp size={14} /> {fmt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Landing Page' && (
                                <div className="control-group">
                                    <label className="control-label"><Maximize2 size={14} /> View</label>
                                    <div className="format-pills">
                                        <button className={`format-pill ${activeFormat !== 'mobile' ? 'active' : ''}`} onClick={() => setActiveFormat('desktop')}>
                                            <Monitor size={14} /> Desktop
                                        </button>
                                        <button className={`format-pill ${activeFormat === 'mobile' ? 'active' : ''}`} onClick={() => setActiveFormat('mobile')}>
                                            <Smartphone size={14} /> Mobile
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="asset-preview-frame" style={getPreviewStyle()}>
                            {/* Preview Header — context-aware */}
                            {activeTab === 'Landing Page' ? (
                                <div className="browser-header">
                                    <div className="browser-dot red"></div>
                                    <div className="browser-dot yellow"></div>
                                    <div className="browser-dot green"></div>
                                    <div className="browser-url">your-strategy-in-action.com</div>
                                </div>
                            ) : activeTab === 'Social Cover' ? (
                                <div className="cover-preview-header">
                                    <span className="cover-label">{activeCoverType === 'youtube' ? '▶️ YouTube Channel Art' : '📘 Facebook Page Cover'}</span>
                                </div>
                            ) : (
                                <div className={`social-preview-header ${activePlatform}`}>
                                    <div className="social-avatar">
                                        {activeAsset?.visuals?.logo || brandProfile?.logo || user?.user_metadata?.avatar_url ? (
                                            <img
                                                src={activeAsset?.visuals?.logo || brandProfile?.logo || user?.user_metadata?.avatar_url}
                                                alt="Profile"
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '1.2rem' }}>
                                                {(activeAsset?.brandName || brandProfile?.brandName || 'B').charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="social-username">
                                        {activeAsset?.brandName || brandProfile?.brandName || 'Your Brand'}
                                        {activePlatform === 'linkedin' ? ' • 1st' : activePlatform === 'tiktok' ? ` @${(activeAsset?.brandName || brandProfile?.brandName || 'brand').replace(/\s/g, '').toLowerCase()}` : '_Official'}
                                        {activePlatform === 'facebook' && <span className="post-timestamp"> • 2h</span>}
                                    </div>
                                    <div className="social-header-actions">
                                        {activePlatform === 'tiktok' ? <span className="tiktok-badge">🎵 Original Sound</span> : <MoreHorizontal size={16} color="white" />}
                                    </div>
                                </div>
                            )}

                            {/* Social Post Content Container */}
                            <div className={`preview-content-wrapper ${activeTab === 'Social Post' ? activePlatform : ''}`}>

                                {/* Text ABOVE Media (Facebook, LinkedIn) */}
                                {activeTab === 'Social Post' && (activePlatform === 'facebook' || activePlatform === 'linkedin') && (
                                    <div className="post-caption-top">
                                        <p className="post-text">{activeAsset?.caption}</p>
                                        <p className="post-hashtags">{activeAsset?.hashtags}</p>
                                    </div>
                                )}

                                <div className="hero-preview" style={{
                                    background: activeAsset?.visuals?.main
                                        ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url(${activeAsset.visuals.main}) center/cover no-repeat`
                                        : `linear-gradient(135deg, ${activeAsset?.colorPalette?.[0] || '#2979ff'} 0%, ${activeAsset?.colorPalette?.[1] || '#1565c0'} 100%)`,
                                    color: activeAsset?.visuals?.main ? 'white' : 'white',
                                    aspectRatio: getPreviewAspectRatio() || undefined,
                                    minHeight: !getPreviewAspectRatio() ? (activeFormat === 'mobile' ? '600px' : '400px') : undefined,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {/* TikTok UI Overlay */}
                                    {activePlatform === 'tiktok' && activeTab === 'Social Post' && (
                                        <div className="tiktok-overlay">
                                            <div className="tiktok-side-actions">
                                                <div className="tiktok-a-btn"><Heart size={24} fill="rgba(255,255,255,0.9)" /><span>8.5k</span></div>
                                                <div className="tiktok-a-btn"><MessageCircle size={24} fill="rgba(255,255,255,0.9)" /><span>243</span></div>
                                                <div className="tiktok-a-btn"><Bookmark size={24} fill="rgba(255,255,255,0.9)" /><span>1.2k</span></div>
                                                <div className="tiktok-a-btn"><Share2 size={24} fill="rgba(255,255,255,0.9)" /><span>Share</span></div>
                                            </div>
                                            <div className="tiktok-bottom-text">
                                                <div className="tiktok-user">@yourbrand</div>
                                                <p className="tiktok-caption">{activeAsset?.caption} {activeAsset?.hashtags}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Main Headline Content (Unless it's just a raw image) */}
                                    {(!activeAsset?.visuals?.main || activeTab === 'Landing Page' || activeTab === 'Social Cover') && (
                                        <div className="preview-text-content">
                                            <h1 className="preview-headline" style={{
                                                fontSize: activeTab === 'Social Cover' ? '1.8rem' : undefined,
                                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                            }}>
                                                {activeAsset?.headline}
                                            </h1>
                                            {activeAsset?.subheadline && (
                                                <p className="preview-subheadline" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                                                    {activeAsset?.subheadline}
                                                </p>
                                            )}

                                            <div className="preview-ctas">
                                                {activeAsset?.ctaButtons?.map((btn, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={btn.link || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`btn ${btn.style === 'primary' ? 'btn-primary' : 'btn-outline'}`}
                                                        style={{
                                                            background: btn.style === 'primary' ? (activeAsset.colorPalette?.[0] || '#2979ff') : 'transparent',
                                                            borderColor: btn.style === 'primary' ? 'transparent' : (activeAsset?.visuals?.main ? 'rgba(255,255,255,0.5)' : '#ddd'),
                                                            color: btn.style === 'primary' ? 'white' : (activeAsset?.visuals?.main ? 'white' : '#333'),
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        onClick={(e) => {
                                                            if (!btn.link || btn.link === '#') e.preventDefault();
                                                        }}
                                                    >
                                                        {btn.text}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Platform Format Label */}
                                    {activeAsset?.platformFormat && activeTab === 'Social Post' && (
                                        <div className="format-label-badge inside">
                                            {activeAsset.platformFormat.label}
                                        </div>
                                    )}
                                </div>

                                {/* Social Action Bar (Non-TikTok) */}
                                {activeTab === 'Social Post' && activePlatform !== 'tiktok' && (
                                    <div className="social-action-bar">
                                        <div className="action-left">
                                            {activePlatform === 'facebook' || activePlatform === 'linkedin' ? (
                                                <><ThumbsUp size={20} /> <MessageCircle size={20} /> <Share2 size={20} /></>
                                            ) : ( /* Instagram */
                                                <><Heart size={24} /> <MessageCircle size={24} /> <Send size={24} /></>
                                            )}
                                        </div>
                                        <div className="action-right">
                                            {activePlatform !== 'facebook' && activePlatform !== 'linkedin' && <Bookmark size={24} />}
                                        </div>
                                    </div>
                                )}

                                {/* Text BELOW Media (Instagram) */}
                                {activeTab === 'Social Post' && activePlatform === 'instagram' && (
                                    <div className="post-caption-bottom">
                                        <p className="post-likes">1,243 likes</p>
                                        <p className="post-text">
                                            <strong>yourbrand_official</strong> {activeAsset?.caption}
                                        </p>
                                        <p className="post-hashtags">{activeAsset?.hashtags}</p>
                                        <p className="post-time">2 HOURS AGO</p>
                                    </div>
                                )}
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
