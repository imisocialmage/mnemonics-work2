import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../Auth/AuthProvider';
import { analyzeToolData } from '../../utils/analysisService';
import './BrandEvaluator.css';

const BrandEvaluator = ({ profileIndex }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);

    const [currentStep, setCurrentStep] = useState(1);
    const [brandData, setBrandData] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('imi-brand-data'));
        if (saved) return JSON.parse(saved);

        // Fallback to compass data for pre-filling
        const compass = JSON.parse(localStorage.getItem(getProfileKey('imi-compass-data')) || '{}');
        return {
            industry: '',
            targetAudience: compass.audience || '',
            brandName: compass.brandName || '',
            tagline: '',
            brandPersonality: [],
            brandVoice: [],
            competitors: '',
            scores: null,
            overallScore: 0,
            analysis: '',
            recommendations: [],
            whoTarget: compass.audience || '', // Added for consistency with validation
            whatOffer: compass.brandName || '' // Added for consistency
        };
    });

    const [isLoading, setIsLoading] = useState(false);

    // Save brand data to localStorage
    useEffect(() => {
        localStorage.setItem(getProfileKey('imi-brand-data'), JSON.stringify(brandData));
    }, [brandData, getProfileKey]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    const totalSteps = 4;

    // Validation
    const validateCurrentStep = () => {
        let value = '';
        if (currentStep === 1) value = brandData.whatOffer;
        else if (currentStep === 2) value = brandData.whoTarget;
        else if (currentStep === 3) value = brandData.howAccessible;

        if (!value.trim() || value.trim().length < 20) {
            displayMessage(t('common.min_chars', { min: 20 }));
            return false;
        }
        return true;
    };

    // Navigation
    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateEvaluation = async () => {
        if (validateCurrentStep()) {
            setIsLoading(true);

            if (!isAuthenticated) {
                // Fallback to local logic if unauthenticated
                const scores = calculateScores();
                const overallScore = calculateOverallScore(scores);
                setBrandData(prev => ({
                    ...prev,
                    scores,
                    overallScore,
                    analysis: "AI Analysis currently unavailable. Using local evaluation engine.",
                    recommendations: []
                }));
                setCurrentStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'brandEvaluator' }));
                setIsLoading(false);
                return;
            }

            try {
                const results = await analyzeToolData('brandEvaluator', {
                    whatOffer: brandData.whatOffer,
                    whoTarget: brandData.whoTarget,
                    howAccessible: brandData.howAccessible
                }, t('common.lang_code')); // Assuming there's a lang_code in i18n or just use 'en'

                setBrandData(prev => ({
                    ...prev,
                    scores: results.scores,
                    overallScore: results.overallScore,
                    analysis: results.analysis,
                    recommendations: results.recommendations
                }));

                setCurrentStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Mark tool as completed
                window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'brandEvaluator' }));
            } catch (error) {
                console.error("AI Analysis failed:", error);
                displayMessage(t('common.error_occurred'));

                // Fallback to local logic if AI fails
                const scores = calculateScores();
                const overallScore = calculateOverallScore(scores);
                setBrandData(prev => ({
                    ...prev,
                    scores,
                    overallScore,
                    analysis: "AI Analysis currently unavailable. Using local evaluation engine.",
                    recommendations: []
                }));
                setCurrentStep(4);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Scoring Functions (Direct port from original)
    const calculateScores = () => {
        return {
            clarity: evaluateClarity(),
            relevance: evaluateRelevance(),
            emotionalResonance: evaluateEmotionalResonance(),
            originality: evaluateOriginality(),
            storytelling: evaluateStorytelling(),
            scalability: evaluateScalability(),
            commercialAppeal: evaluateCommercialAppeal(),
            consistency: evaluateConsistency()
        };
    };

    const evaluateClarity = () => {
        const text = brandData.whatOffer + ' ' + brandData.howAccessible;
        const wordCount = text.split(/\s+/).length;
        const hasSpecifics = /\b(app|platform|service|product|solution|system|tool)\b/i.test(text);
        const hasClearValue = /\b(help|provide|solve|enable|allow|create|deliver)\b/i.test(text);

        let score = 3.0;
        if (wordCount > 30 && wordCount < 150) score += 0.5;
        if (hasSpecifics) score += 0.5;
        if (hasClearValue) score += 0.5;
        if (brandData.whatOffer.length > 100) score += 0.5;

        return Math.min(5, score);
    };

    const evaluateRelevance = () => {
        const combined = (brandData.whatOffer + ' ' + brandData.whoTarget).toLowerCase();
        const hasPainPoint = /\b(problem|challenge|struggle|difficulty|issue|pain|frustration)\b/.test(combined);
        const hasSolution = /\b(solution|solve|address|fix|resolve|improve|enhance)\b/.test(combined);
        const hasTargetDetail = brandData.whoTarget.split(/\s+/).length > 20;
        const hasSpecificAudience = /\b(parents|families|students|professionals|businesses|entrepreneurs|creators|users)\b/.test(combined);

        let score = 3.0;
        if (hasPainPoint) score += 0.5;
        if (hasSolution) score += 0.5;
        if (hasTargetDetail) score += 0.5;
        if (hasSpecificAudience) score += 0.5;

        return Math.min(5, score);
    };

    const evaluateEmotionalResonance = () => {
        const text = (brandData.whatOffer + ' ' + brandData.whoTarget).toLowerCase();
        const emotionalWords = /\b(love|family|connection|memory|memories|bond|together|share|care|trust|joy|happiness|peace|comfort|security|belonging)\b/g;
        const matches = text.match(emotionalWords);
        const emotionCount = matches ? matches.length : 0;
        const hasEmotionalBenefit = /\b(feel|experience|enjoy|appreciate|cherish|celebrate)\b/.test(text);
        const hasRelationalElement = /\b(relationship|family|friend|loved ones|community|team|together)\b/.test(text);

        let score = 2.5;
        score += Math.min(1.0, emotionCount * 0.2);
        if (hasEmotionalBenefit) score += 0.5;
        if (hasRelationalElement) score += 1.0;

        return Math.min(5, score);
    };

    const evaluateOriginality = () => {
        const text = (brandData.whatOffer + ' ' + brandData.howAccessible).toLowerCase();
        const hasUniqueAngle = /\b(first|only|unique|innovative|revolutionary|breakthrough|novel|new approach|different)\b/.test(text);
        const hasSpecificNiche = brandData.whoTarget.split(',').length > 1;
        const avoidsCliche = !/\b(cutting-edge|world-class|best-in-class|leading|premier|ultimate)\b/.test(text);
        const wordCount = text.split(/\s+/).length;
        const isDetailed = wordCount > 100;
        const hasSpecificFeatures = (text.match(/\b(feature|capability|function|allows|enables)\b/g) || []).length >= 2;

        let score = 2.5;
        if (hasUniqueAngle) score += 0.8;
        if (hasSpecificNiche) score += 0.5;
        if (avoidsCliche) score += 0.4;
        if (isDetailed) score += 0.5;
        if (hasSpecificFeatures) score += 0.3;

        return Math.min(5, score);
    };

    const evaluateStorytelling = () => {
        const combined = brandData.whatOffer + ' ' + brandData.whoTarget + ' ' + brandData.howAccessible;
        const hasClearNarrative = /\b(because|so that|when|while|after|before|helps|enables|allows)\b/i.test(combined);
        const hasContext = brandData.whoTarget.length > 50 && brandData.whatOffer.length > 50;
        const hasJourney = /\b(from|to|become|transform|change|grow|evolve)\b/i.test(combined);
        const sentenceCount = combined.split(/[.!?]+/).length;
        const isWellStructured = sentenceCount >= 4;
        const connectsWhatAndWho = brandData.whatOffer.length > 40 && brandData.whoTarget.length > 40;

        let score = 2.5;
        if (hasClearNarrative) score += 0.7;
        if (hasContext) score += 0.6;
        if (hasJourney) score += 0.5;
        if (isWellStructured) score += 0.4;
        if (connectsWhatAndWho) score += 0.3;

        return Math.min(5, score);
    };

    const evaluateScalability = () => {
        const text = (brandData.whoTarget + ' ' + brandData.howAccessible).toLowerCase();
        const hasBroadAudience = (text.match(/\b(anyone|everyone|all|any|families|businesses|people|users|individuals)\b/g) || []).length >= 2;
        const hasMultipleSegments = brandData.whoTarget.split(/,|and|or/).length > 2;
        const hasPlatformMention = /\b(app|platform|online|digital|cloud|web|mobile|software|system)\b/.test(text);
        const hasAccessibilityDetail = brandData.howAccessible.length > 50;
        const hasGrowthPotential = /\b(scale|grow|expand|reach|multiple|various|different)\b/.test(text);

        let score = 3.0;
        if (hasBroadAudience) score += 0.5;
        if (hasMultipleSegments) score += 0.5;
        if (hasPlatformMention) score += 0.5;
        if (hasAccessibilityDetail) score += 0.3;
        if (hasGrowthPotential) score += 0.2;

        return Math.min(5, score);
    };

    const evaluateCommercialAppeal = () => {
        const text = (brandData.whatOffer + ' ' + brandData.howAccessible).toLowerCase();
        const hasPricingModel = /\b(free|premium|subscription|pricing|paid|freemium|tier|plan|cost|affordable)\b/.test(text);
        const hasValueProp = /\b(save|increase|improve|reduce|boost|enhance|optimize|maximize|grow|profit)\b/.test(text);
        const hasMonetization = /\b(revenue|monetize|business model|income|charge|fee)\b/.test(text);
        const hasClearDelivery = brandData.howAccessible.length > 40;
        const hasMarketFit = brandData.whoTarget.length > 60;

        let score = 3.0;
        if (hasPricingModel) score += 0.6;
        if (hasValueProp) score += 0.5;
        if (hasMonetization) score += 0.3;
        if (hasClearDelivery) score += 0.3;
        if (hasMarketFit) score += 0.3;

        return Math.min(5, score);
    };

    const evaluateConsistency = () => {
        const whatWords = new Set(brandData.whatOffer.toLowerCase().split(/\W+/).filter(w => w.length > 4));
        const whoWords = new Set(brandData.whoTarget.toLowerCase().split(/\W+/).filter(w => w.length > 4));
        const howWords = new Set(brandData.howAccessible.toLowerCase().split(/\W+/).filter(w => w.length > 4));

        const whatWhoOverlap = [...whatWords].filter(w => whoWords.has(w)).length;
        const whatHowOverlap = [...whatWords].filter(w => howWords.has(w)).length;
        const totalOverlap = whatWhoOverlap + whatHowOverlap;

        const allComplete = brandData.whatOffer.length > 40 && brandData.whoTarget.length > 40 && brandData.howAccessible.length > 40;
        const hasThematicUnity = totalOverlap >= 3;
        const balancedLength = Math.abs(brandData.whatOffer.length - brandData.whoTarget.length) < 200;

        let score = 3.0;
        if (totalOverlap >= 2) score += 0.5;
        if (totalOverlap >= 4) score += 0.5;
        if (allComplete) score += 0.5;
        if (hasThematicUnity) score += 0.3;
        if (balancedLength) score += 0.2;

        return Math.min(5, score);
    };

    const calculateOverallScore = (scores) => {
        const values = Object.values(scores);
        const sum = values.reduce((acc, val) => acc + val, 0);
        const average = sum / values.length;
        return Math.round(average * 10) / 10;
    };

    // Helper Functions
    const getStarRating = (score) => {
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '⯨';
        stars += '☆'.repeat(5 - Math.ceil(score));
        return stars;
    };

    const getRatingLevel = (score) => {
        if (score >= 4.5) return { label: t('brand_evaluator.results.rating_excellent'), class: 'rating-excellent' };
        if (score >= 4.0) return { label: t('brand_evaluator.results.rating_strong'), class: 'rating-good' };
        if (score >= 3.5) return { label: t('brand_evaluator.results.rating_good'), class: 'rating-good' };
        if (score >= 3.0) return { label: t('brand_evaluator.results.rating_fair'), class: 'rating-fair' };
        return { label: t('brand_evaluator.results.rating_needs_work'), class: 'rating-needs-work' };
    };

    const getRecommendationForMetric = (metric) => {
        const title = t(`brand_evaluator.recommendations.${metric}.title`);
        const description = t(`brand_evaluator.recommendations.${metric}.desc`);

        if (title && description && title !== `brand_evaluator.recommendations.${metric}.title`) {
            return { title, description };
        }

        return {
            title: t('brand_evaluator.recommendations.general.title'),
            description: t('brand_evaluator.recommendations.general.desc')
        };
    };

    const generateRecommendations = () => {
        const recommendations = [];
        const scores = brandData.scores;

        const sortedScores = Object.entries(scores).sort((a, b) => a[1] - b[1]);

        sortedScores.slice(0, 3).forEach(([metric, score]) => {
            if (score < 4.0) {
                recommendations.push(getRecommendationForMetric(metric));
            }
        });

        if (brandData.overallScore < 3.5) {
            recommendations.push({
                title: t('brand_evaluator.recommendations.refinement_needed.title'),
                description: t('brand_evaluator.recommendations.refinement_needed.desc')
            });
        }

        if (brandData.overallScore >= 4.0) {
            recommendations.push({
                title: t('brand_evaluator.recommendations.ready_to_scale.title'),
                description: t('brand_evaluator.recommendations.ready_to_scale.desc')
            });
        }

        return recommendations;
    };

    const displayMessage = (msg) => {
        setMessage(msg);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    const startNewEvaluation = () => {
        if (window.confirm(t('tracker.ui.delete_confirm_all'))) {
            setBrandData({
                whatOffer: '',
                whoTarget: '',
                howAccessible: '',
                scores: null,
                overallScore: 0
            });
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayMessage(t('common.success'));
        }
    };

    const downloadResults = () => {
        const results = generateDownloadContent();
        const blob = new Blob([results], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'brand-evaluation-' + new Date().toISOString().slice(0, 10) + '.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        displayMessage('Results downloaded successfully!');
    };

    const generateDownloadContent = () => {
        const currentDate = new Date().toLocaleDateString();
        const ratingInfo = getRatingLevel(brandData.overallScore);

        const scoreMetrics = [
            { key: 'clarity', label: 'Clarity' },
            { key: 'relevance', label: 'Relevance' },
            { key: 'emotionalResonance', label: 'Emotional Resonance' },
            { key: 'originality', label: 'Originality' },
            { key: 'storytelling', label: 'Storytelling Strength' },
            { key: 'scalability', label: 'Market Scalability' },
            { key: 'commercialAppeal', label: 'Commercial Appeal' },
            { key: 'consistency', label: 'Consistency & Flow' }
        ];

        const recommendations = generateRecommendations();

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IMI Brand Evaluation Results - ${currentDate}</title>
<style>
body {
font-family: 'Arial', sans-serif;
max-width: 900px;
margin: 0 auto;
padding: 20px;
background: #fafafa;
color: #1A1A1A;
line-height: 1.6;
}
.header {
text-align: center;
margin-bottom: 40px;
background: linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 100%);
color: white;
padding: 40px;
border-radius: 20px;
}
.brand-info h1 {
font-size: 2.5rem;
margin: 10px 0;
background: linear-gradient(135deg, #2979FF, #FF5C57);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
}
.overall-score-section {
background: linear-gradient(135deg, #2979FF, #FF5C57);
color: white;
padding: 40px;
border-radius: 20px;
text-align: center;
margin: 30px 0;
}
.overall-score-value {
font-size: 4rem;
font-weight: bold;
margin: 20px 0;
}
.rating-badge {
display: inline-block;
padding: 10px 20px;
border-radius: 25px;
font-weight: bold;
margin-top: 10px;
background: rgba(255,255,255,0.3);
}
.section {
background: white;
padding: 30px;
margin: 25px 0;
border-radius: 15px;
box-shadow: 0 4px 15px rgba(0,0,0,0.1);
border-left: 5px solid #2979FF;
}
.score-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
margin: 20px 0;
}
.score-card {
background: #f8f9fa;
padding: 20px;
border-radius: 12px;
text-align: center;
border: 2px solid #e0e0e0;
}
.score-value {
font-size: 2rem;
font-weight: bold;
color: #2979FF;
margin-bottom: 10px;
}
.score-label {
font-weight: 600;
color: #1A1A1A;
margin-bottom: 5px;
}
.stars {
color: #FFB300;
font-size: 1.2rem;
}
.recommendation-item {
padding: 15px;
margin: 10px 0;
background: #f8f9fa;
border-radius: 10px;
border-left: 4px solid #2979FF;
}
.brand-response {
padding: 20px;
background: #f8f9fa;
border-radius: 12px;
margin: 15px 0;
border-left: 4px solid #2979FF;
}
h2 {
color: #1A1A1A;
border-bottom: 3px solid #2979FF;
padding-bottom: 10px;
margin-bottom: 20px;
}
h3 {
color: #2979FF;
margin-top: 20px;
}
.footer {
background: #1A1A1A;
color: white;
padding: 30px;
border-radius: 15px;
text-align: center;
margin-top: 40px;
}
.promo-section {
background: linear-gradient(135deg, #2979FF 0%, #FF5C57 100%);
color: white;
padding: 40px;
border-radius: 20px;
text-align: center;
margin: 30px 0;
}
.cta-button {
display: inline-block;
background: white;
color: #1A1A1A;
padding: 15px 30px;
border-radius: 50px;
text-decoration: none;
font-weight: bold;
margin: 10px;
}
</style>
</head>
<body>
<div class="header">
<div class="brand-info">
<h1>IMI CORE</h1>
<p style="color: #2979FF; font-size: 1.1rem;">I Make Image</p>
<p style="margin-top: 10px; opacity: 0.9;">Brand Evaluation Tool</p>
<p><strong>Generated:</strong> ${currentDate}</p>
</div>
</div>

<div class="overall-score-section">
<div style="font-size: 1.5rem; margin-bottom: 10px;">Overall Brand Strength</div>
<div class="overall-score-value">${brandData.overallScore.toFixed(1)}/5.0</div>
<div class="rating-badge">${ratingInfo.label}</div>
</div>

<div class="section">
<h2>📊 Detailed Score Breakdown</h2>
<div class="score-grid">
${scoreMetrics.map(metric => {
            const score = brandData.scores[metric.key];
            const stars = getStarRating(score);
            return `
<div class="score-card">
<div class="score-value">${score.toFixed(1)}/5</div>
<div class="score-label">${metric.label}</div>
<div class="stars">${stars}</div>
</div>
`;
        }).join('')}
</div>
</div>

<div class="section">
<h2>💡 Strategic Recommendations</h2>
${recommendations.map(rec => `
<div class="recommendation-item"><strong>${rec.title}:</strong> ${rec.description}</div>
`).join('')}
</div>

<div class="section">
<h2>📋 Your Brand Foundation</h2>
<h3>❶ What You Offer:</h3>
<div class="brand-response">${brandData.whatOffer}</div>
<h3>❷ Who You Target:</h3>
<div class="brand-response">${brandData.whoTarget}</div>
<h3>❸ How It's Accessible:</h3>
<div class="brand-response">${brandData.howAccessible}</div>
</div>

<div class="promo-section">
<h2 style="color: white; border: none; margin-bottom: 20px;">Ready to Transform Your Brand?</h2>
<p style="font-size: 1.2rem; margin-bottom: 25px;">Get personalized guidance to take your brand to the next level</p>
<a href="https://imicoretribe.com/assessment" class="cta-button" target="_blank">Book Your Strategic Assessment</a>
<a href="https://imicoretribe.com" class="cta-button" target="_blank">Join IMI CORE TRIBE</a>
</div>

<div class="footer">
<h2 style="color: white; border: none;">IMI CORE - I Make Image</h2>
<p><strong>Brand Evaluation Tool</strong> | Strategic Brand Assessment System</p>
<p style="margin-top: 20px; opacity: 0.8; font-size: 0.9rem;">
This evaluation uses AI-powered analysis to assess your brand across 8 critical metrics.
</p>
</div>
</body>
</html>`;
    };

    // Render Functions
    const renderProgressBar = () => (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {[
                { num: 1, label: t('brand_evaluator.steps.what') },
                { num: 2, label: t('brand_evaluator.steps.who') },
                { num: 3, label: t('brand_evaluator.steps.how') },
                { num: 4, label: '✓', labelText: t('brand_evaluator.steps.score') }
            ].map(step => (
                <div key={step.num} className={`step ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}>
                    <div className="step-number">{step.num === 4 ? '✓' : step.num}</div>
                    <span className="step-label">{step.labelText || step.label}</span>
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="form-section">
            <div className="ai-badge">{t('brand_evaluator.ai_badge')}</div>
            <h2 className="section-title">{t('brand_evaluator.steps.what')}</h2>
            <p className="section-subtitle">{t('brand_evaluator.subtitle')}</p>

            <div className="question-card">
                <div className="question-number">1</div>
                <h3 className="question-title">{t('brand_evaluator.questions.what_label')}</h3>
                <p className="question-description">{t('brand_evaluator.questions.what_label')}</p>
                <div className="form-group">
                    <label htmlFor="whatOffer">{t('brand_evaluator.your_answer')}</label>
                    <textarea
                        id="whatOffer"
                        value={brandData.whatOffer}
                        onChange={(e) => setBrandData({ ...brandData, whatOffer: e.target.value })}
                        placeholder={t('brand_evaluator.questions.what_placeholder')}
                    />
                </div>
            </div>

            <div className="navigation-buttons">
                <div></div>
                <button className="btn" onClick={nextStep}>{t('common.next')}: {t('brand_evaluator.steps.who')}</button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-section">
            <h2 className="section-title">{t('brand_evaluator.steps.who')}</h2>
            <p className="section-subtitle">{t('brand_evaluator.steps.who')}</p>

            <div className="question-card">
                <div className="question-number">2</div>
                <h3 className="question-title">{t('brand_evaluator.questions.who_label')}</h3>
                <p className="question-description">{t('brand_evaluator.questions.who_label')}</p>
                <div className="form-group">
                    <label htmlFor="whoTarget">{t('brand_evaluator.your_answer')}</label>
                    <textarea
                        id="whoTarget"
                        value={brandData.whoTarget}
                        onChange={(e) => setBrandData({ ...brandData, whoTarget: e.target.value })}
                        placeholder={t('brand_evaluator.questions.who_placeholder')}
                    />
                </div>
            </div>

            <div className="navigation-buttons">
                <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                <button className="btn" onClick={nextStep}>{t('common.next')}: {t('brand_evaluator.steps.how')}</button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-section">
            <h2 className="section-title">{t('brand_evaluator.steps.how')}</h2>
            <p className="section-subtitle">{t('brand_evaluator.steps.how')}</p>

            <div className="question-card">
                <div className="question-number">3</div>
                <h3 className="question-title">{t('brand_evaluator.questions.how_label')}</h3>
                <p className="question-description">{t('brand_evaluator.questions.how_label')}</p>
                <div className="form-group">
                    <label htmlFor="howAccessible">{t('brand_evaluator.your_answer')}</label>
                    <textarea
                        id="howAccessible"
                        value={brandData.howAccessible}
                        onChange={(e) => setBrandData({ ...brandData, howAccessible: e.target.value })}
                        placeholder={t('brand_evaluator.questions.how_placeholder')}
                    />
                </div>
            </div>

            <div className="navigation-buttons">
                <button className="btn btn-secondary" onClick={previousStep}>{t('common.back')}</button>
                <button className="btn" onClick={generateEvaluation} disabled={isLoading}>
                    {isLoading ? t('common.generating') : t('common.generate')}
                </button>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>{t('common.analyzing_brand')}</p>
                </div>
            )}
        </div>
    );

    const renderStep4 = () => {
        if (!brandData.scores) return null;

        const scoreMetrics = [
            { key: 'clarity', label: t('brand_evaluator.metrics.clarity') },
            { key: 'relevance', label: t('brand_evaluator.metrics.relevance') },
            { key: 'emotionalResonance', label: t('brand_evaluator.metrics.emotionalResonance') },
            { key: 'originality', label: t('brand_evaluator.metrics.originality') },
            { key: 'storytelling', label: t('brand_evaluator.metrics.storytelling') },
            { key: 'scalability', label: t('brand_evaluator.metrics.scalability') },
            { key: 'commercialAppeal', label: t('brand_evaluator.metrics.commercialAppeal') },
            { key: 'consistency', label: t('brand_evaluator.metrics.consistency') }
        ];

        const ratingInfo = getRatingLevel(brandData.overallScore);

        return (
            <div className="form-section">
                <div className="ai-badge">{t('brand_evaluator.ai_badge')}</div>
                <h2 className="section-title">{t('brand_evaluator.results.title')}</h2>
                <p className="section-subtitle">{t('brand_evaluator.results.subtitle')}</p>

                <div className="overall-score">
                    <div className="overall-score-label">{t('brand_evaluator.results.overall_strength')}</div>
                    <div className="overall-score-value">{brandData.overallScore.toFixed(1)}/5.0</div>
                    <div className={`rating-badge ${ratingInfo.class}`}>{ratingInfo.label}</div>
                    {brandData.analysis && (
                        <div className="ai-analysis-text" style={{ marginTop: '20px', fontSize: '1.1rem', color: 'var(--midnight-black)', opacity: 0.8, fontStyle: 'italic' }}>
                            "{brandData.analysis}"
                        </div>
                    )}
                </div>

                <div className="score-display">
                    {scoreMetrics.map(metric => {
                        const score = brandData.scores[metric.key];
                        const stars = getStarRating(score);
                        return (
                            <div key={metric.key} className="score-item">
                                <div className="score-value">{score.toFixed(1)}/5</div>
                                <div className="score-label">{metric.label}</div>
                                <div style={{ marginTop: '10px', color: 'var(--warning-yellow)', fontSize: '1.2rem' }}>{stars}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="recommendation-section">
                    <h3 className="recommendation-title">
                        <span style={{ fontSize: '1.8rem' }}>💡</span>
                        {t('brand_evaluator.results.recommendations_title')}
                    </h3>
                    <ul className="recommendation-list">
                        {brandData.recommendations && brandData.recommendations.length > 0 ? (
                            brandData.recommendations.map((rec, idx) => (
                                <li key={idx}>
                                    <strong>{rec.title}:</strong> {rec.description}
                                </li>
                            ))
                        ) : (
                            generateRecommendations().map((rec, idx) => (
                                <li key={idx}>
                                    <strong>{rec.title}:</strong> {rec.description}
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="results-section">
                    <h3 style={{ marginBottom: '20px' }}>{t('brand_evaluator.results.foundation_title')}</h3>
                    <div className="evaluation-card">
                        <h4 style={{ color: 'var(--electric-blue)', marginBottom: '20px' }}>{t('brand_evaluator.steps.what')}</h4>
                        <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ color: 'var(--midnight-black)', marginBottom: '10px' }}>❶ {t('brand_evaluator.questions.what_label')}</h5>
                            <p style={{ padding: '15px', background: 'white', borderRadius: '10px', borderLeft: '4px solid var(--electric-blue)' }}>{brandData.whatOffer}</p>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ color: 'var(--midnight-black)', marginBottom: '10px' }}>❷ {t('brand_evaluator.questions.who_label')}</h5>
                            <p style={{ padding: '15px', background: 'white', borderRadius: '10px', borderLeft: '4px solid var(--electric-blue)' }}>{brandData.whoTarget}</p>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ color: 'var(--midnight-black)', marginBottom: '10px' }}>❸ {t('brand_evaluator.questions.how_label')}</h5>
                            <p style={{ padding: '15px', background: 'white', borderRadius: '10px', borderLeft: '4px solid var(--electric-blue)' }}>{brandData.howAccessible}</p>
                        </div>
                    </div>
                </div>

                {/* Next Step CTA */}
                <div className="next-step-cta" style={{ marginTop: '40px' }}>
                    <div className="cta-header">
                        <h3>🚀 {t('brand_evaluator.results.next_step_title')}</h3>
                        <p>{t('brand_evaluator.results.next_step_desc')}</p>
                    </div>
                    <div className="cta-content">
                        <div className="cta-info">
                            <h4>{t('brand_evaluator.results.next_step_button')}</h4>
                            <p>Use the <strong>Product Profiler</strong> to create your Unique Value Proposition, identify target niches, and build your ideal client avatar with AI-powered insights.</p>
                            <ul className="cta-benefits">
                                <li>✓ Generate compelling UVP statements</li>
                                <li>✓ Identify 3-4 profitable target niches</li>
                                <li>✓ Create detailed client avatars</li>
                                <li>✓ Get interest hooks and CTAs</li>
                            </ul>
                        </div>
                        <button
                            className="cta-button"
                            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'product-profiler' }))}
                        >
                            {t('brand_evaluator.results.next_step_button')} <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="navigation-buttons">
                    <button className="btn btn-secondary" onClick={previousStep}>Previous</button>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button className="btn" onClick={startNewEvaluation}>New Evaluation</button>
                        <button className="btn" onClick={downloadResults}>Download Results</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="brand-evaluator">
            {showMessage && (
                <div className="success-message">{message}</div>
            )}

            <header>
                <div className="container">
                    <div className="header-content">
                        <div className="brand-section">
                            <div className="logo-container">
                                <img src="/assets/imi-logo.png" alt="IMI Logo" />
                            </div>
                            <div className="brand-text">
                                <div className="brand-name">IMI CORE</div>
                                <div className="brand-tagline">I Make Image</div>
                            </div>
                        </div>
                        <h1>Brand Evaluation Tool</h1>
                    </div>
                </div>
            </header>

            <main className="container">
                {renderProgressBar()}
                {renderStepIndicator()}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
            </main>
        </div>
    );
};

export default BrandEvaluator;
