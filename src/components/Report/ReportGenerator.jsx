import React from 'react';
import { STRATEGIC_ADVICE, getHighlightedPositions, COMPASS_NODES, getRandomQuote, getLocalizedStrategicAdvice } from '../../data/compassData';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { Download, Calendar, CheckCircle, AlertTriangle, ArrowRight, BookOpen, Users, Video, Zap } from 'lucide-react';
import { analyzeToolData } from '../../utils/analysisService';
import './Report.css';

const ReportGenerator = ({ formData, selectedObjective }) => {
    const { t, i18n } = useTranslation();

    const [isLoading, setIsLoading] = React.useState(false);
    const [deepAnalysis, setDeepAnalysis] = React.useState(() => {
        const saved = localStorage.getItem(`imi-p${formData.profileIndex || 0}-deep-analysis`);
        return saved ? JSON.parse(saved) : null;
    });

    if (!selectedObjective) return null;

    const localizedAdvice = getLocalizedStrategicAdvice(i18n.language);
    const advice = localizedAdvice[selectedObjective.id];
    const apexPos = selectedObjective.targetPosition;
    const highlighted = getHighlightedPositions(apexPos).map(pos => t(`nodes.${COMPASS_NODES[pos].id}`));
    const quote = getRandomQuote(i18n.language);

    const runDeepAnalysis = async () => {
        setIsLoading(true);
        try {
            const profileIndex = formData.profileIndex || 0;
            const brandData = JSON.parse(localStorage.getItem(`imi-p${profileIndex}-imi-compass-data`) || '{}');
            const bEvalData = JSON.parse(localStorage.getItem(`imi-p${profileIndex}-imi-brand-evaluator-data`) || '{}');
            const pProfData = JSON.parse(localStorage.getItem(`imi-p${profileIndex}-imi-product-data`) || '{}');
            const prProfData = JSON.parse(localStorage.getItem(`imi-p${profileIndex}-imi-prospect-data`) || '{}');
            const cGuideData = JSON.parse(localStorage.getItem(`imi-p${profileIndex}-imi-guide-data`) || '{}');

            const brandName = brandData?.brandName || 'Your Brand';

            const allData = {
                objective: t(`objectives.${selectedObjective.id}`),
                brand: bEvalData, // Using bEvalData for brand
                product: pProfData, // Using pProfData for product
                prospect: prProfData, // Using prProfData for prospect
                conversation: cGuideData // Using cGuideData for conversation
            };

            const results = await analyzeToolData('strategicRoadmap', allData, i18n.language);
            setDeepAnalysis(results);
            localStorage.setItem(`imi-p${profileIndex}-deep-analysis`, JSON.stringify(results));
        } catch (error) {
            console.error("Deep Analysis failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        let y = 20;
        const pageHeight = 280; // approximate useful height
        const margin = 20;
        const contentWidth = 210 - 2 * margin;

        const checkPage = (heightNeeded) => {
            if (y + heightNeeded > pageHeight) {
                doc.addPage();
                y = 20;
            }
        };

        // Title & Metadata
        doc.setFontSize(22);
        doc.setTextColor(41, 121, 255);
        doc.text(`${t('header.title')} ${t('report.title_suffix')}`, margin, y);
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(t('report.generated_on', { date: new Date().toLocaleDateString(i18n.language) }), margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`${t('report.brand')}: ${formData.brandName || t('report.metadata.not_specified')} `, margin, y);
        y += 6;
        doc.text(`${t('report.objective')}: ${t(`objectives.${selectedObjective.id}`)} `, margin, y);
        y += 6;
        doc.text(`${t('report.focus')}: ${t(`form.focus_${formData.focus}`).toUpperCase()} `, margin, y);
        y += 15;

        // Challenge
        if (formData.challenge) {
            checkPage(30);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.current_challenge'), margin, y);
            y += 8;
            doc.setFontSize(11);
            doc.setTextColor(60);
            const splitChallenge = doc.splitTextToSize(formData.challenge, contentWidth);
            doc.text(splitChallenge, margin, y);
            y += (splitChallenge.length * 6) + 10;
        }

        // Strategic Insight Highlight
        if (advice.highlight) {
            checkPage(30);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.strategic_insight'), margin, y);
            y += 8;
            doc.setFontSize(11);
            doc.setTextColor(60);
            const splitHighlight = doc.splitTextToSize(advice.highlight, contentWidth);
            doc.text(splitHighlight, margin, y);
            y += (splitHighlight.length * 6) + 10;
        }

        // Key Focus Areas
        if (advice.focusAreas && advice.focusAreas.length > 0) {
            checkPage(40);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.key_focus_areas'), margin, y);
            y += 10;
            advice.focusAreas.forEach(area => {
                checkPage(20);
                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.setFont("helvetica", "bold");
                doc.text(t(`nodes.${area.name.toLowerCase().replace(/[^a-z]/g, '')}`), margin, y);
                y += 6;
                doc.setFontSize(11);
                doc.setTextColor(60);
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(area.desc, contentWidth);
                doc.text(splitDesc, margin, y);
                y += (splitDesc.length * 6) + 8;
            });
            y += 5;
        }

        // Core Philosophy
        if (advice.corePhilosophy) {
            checkPage(40);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.core_philosophy'), margin, y);
            y += 8;
            doc.setFontSize(11);
            doc.setTextColor(60);
            const splitPhil = doc.splitTextToSize(advice.corePhilosophy, contentWidth);
            doc.text(splitPhil, margin, y);
            y += (splitPhil.length * 6) + 10;
        }

        // 10 Essential Tips
        if (advice.tips && advice.tips.length > 0) {
            checkPage(80);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.essential_tips'), margin, y);
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(0);
            advice.tips.forEach((tip, i) => {
                checkPage(10);
                const splitTip = doc.splitTextToSize(`${i + 1}. ${tip} `, contentWidth);
                doc.text(splitTip, margin, y);
                y += (splitTip.length * 5) + 2;
            });
            y += 10;
        }

        // 7-Day Plan
        if (advice.sevenDayPlan && advice.sevenDayPlan.length > 0) {
            checkPage(60);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.launch_prep'), margin, y);
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(0);
            advice.sevenDayPlan.forEach(item => {
                checkPage(15);
                doc.setFont("helvetica", "bold");
                doc.text(`${item.day}: `, margin, y);
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(item.focus, contentWidth - 25); // Indent description
                doc.text(splitDesc, margin + 25, y);
                y += (splitDesc.length * 5) + 4;
            });
            y += 10;
        }

        // 30-Day Calendar
        if (advice.thirtyDayCalendar && advice.thirtyDayCalendar.length > 0) {
            checkPage(80);
            doc.addPage(); y = 20; // Start fresh for calendar
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.calendar'), margin, y);
            y += 10;
            advice.thirtyDayCalendar.forEach(week => {
                checkPage(40);
                doc.setFontSize(11);
                doc.setTextColor(0);
                doc.setFont("helvetica", "bold");
                doc.text(`${week.week} - ${week.theme} `, margin, y);
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                week.items.forEach(item => {
                    checkPage(8);
                    const splitItem = doc.splitTextToSize(`• ${item} `, contentWidth - 5);
                    doc.text(splitItem, margin + 5, y);
                    y += (splitItem.length * 5);
                });
                y += 8;
            });
        }

        // Top 5 Strategic Recommendations
        if (advice.strategicRecommendations && advice.strategicRecommendations.length > 0) {
            checkPage(60);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.strategic_recommendations'), margin, y);
            y += 10;
            doc.setTextColor(0);
            doc.setFontSize(10);
            advice.strategicRecommendations.forEach((rec, i) => {
                checkPage(8);
                const splitRec = doc.splitTextToSize(`${i + 1}. ${rec} `, contentWidth);
                doc.text(splitRec, margin, y);
                y += (splitRec.length * 5) + 2;
            });
            y += 10;
        }

        // Red Flags
        if (advice.redFlags && advice.redFlags.length > 0) {
            checkPage(60);
            doc.setFontSize(14);
            doc.setTextColor(220, 38, 38); // Red
            doc.text(t('report.critical_red_flags'), margin, y);
            y += 10;
            doc.setTextColor(0);
            doc.setFontSize(10);
            advice.redFlags.forEach(flag => {
                checkPage(8);
                const splitFlag = doc.splitTextToSize(`• ${flag} `, contentWidth);
                doc.text(splitFlag, margin, y);
                y += (splitFlag.length * 5) + 2;
            });
            y += 10;
        }

        // Implementation Timeline
        if (advice.implementationTimeline && advice.implementationTimeline.length > 0) {
            checkPage(60);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.timeline'), margin, y);
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(0);
            advice.implementationTimeline.forEach(item => {
                checkPage(15);
                doc.setFont("helvetica", "bold");
                doc.text(`${item.period}: `, margin, y);
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(item.focus, contentWidth - 25);
                doc.text(splitDesc, margin + 25, y);
                y += (splitDesc.length * 5) + 4;
            });
            y += 10;
        }

        // Next Steps
        if (advice.nextSteps && advice.nextSteps.length > 0) {
            checkPage(60);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text(t('report.next_steps'), margin, y);
            y += 10;
            doc.setTextColor(0);
            doc.setFontSize(10);
            advice.nextSteps.forEach((step, i) => {
                checkPage(8);
                const splitStep = doc.splitTextToSize(`${i + 1}. ${step} `, contentWidth);
                doc.text(splitStep, margin, y);
                y += (splitStep.length * 5) + 2;
            });
            y += 10;
        }

        // Quote
        checkPage(30);
        y += 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100);
        const splitQuote = doc.splitTextToSize(`"${quote.quote}" - ${quote.author} `, contentWidth);
        doc.text(splitQuote, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += (splitQuote.length * 6) + 10;

        // CTA & Footer (Simplified for PDF)
        checkPage(40);
        doc.setFontSize(14);
        doc.setTextColor(41, 121, 255);
        doc.text(t('report.cta.book_assessment'), margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text(t('report.cta.one_on_one'), margin, y);
        y += 15;

        doc.text(`${t('report.cta.resources')}: ${t('report.cta.team')} | ${t('report.cta.support')} | ${t('report.cta.youtube')}`, margin, y);
        y += 10;


        // Deep Analysis / Strategic Roadmap
        if (deepAnalysis) {
            doc.addPage();
            y = 20;
            doc.setFontSize(18);
            doc.setTextColor(41, 121, 255);
            doc.text("AI STRATEGIC ROADMAP", margin, y);
            y += 12;

            doc.setFontSize(14);
            doc.text("Executive Summary", margin, y);
            y += 8;
            doc.setFontSize(11);
            doc.setTextColor(60);
            const splitSummary = doc.splitTextToSize(deepAnalysis.executiveSummary, contentWidth);
            doc.text(splitSummary, margin, y);
            y += (splitSummary.length * 6) + 10;

            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text("Primary Competitive Advantage", margin, y);
            y += 8;
            doc.setFontSize(11);
            doc.setTextColor(60);
            const splitAdv = doc.splitTextToSize(deepAnalysis.primaryCompetitiveAdvantage, contentWidth);
            doc.text(splitAdv, margin, y);
            y += (splitAdv.length * 6) + 10;

            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text("Strategic Pillars", margin, y);
            y += 10;
            deepAnalysis.strategicPillars.forEach(pillar => {
                checkPage(30);
                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.setFont("helvetica", "bold");
                doc.text(pillar.title, margin, y);
                y += 6;
                doc.setFontSize(11);
                doc.setTextColor(60);
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(pillar.description, contentWidth);
                doc.text(splitDesc, margin, y);
                y += (splitDesc.length * 6) + 8;
            });

            checkPage(40);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text("Immediate Action Plan", margin, y);
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(0);
            deepAnalysis.immediateActionPlan.forEach((action, i) => {
                checkPage(10);
                const splitAction = doc.splitTextToSize(`${i + 1}. ${action}`, contentWidth);
                doc.text(splitAction, margin, y);
                y += (splitAction.length * 5) + 2;
            });
            y += 10;

            checkPage(30);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text("Long-Term Vision", margin, y);
            y += 8;
            doc.setFontSize(11);
            doc.setTextColor(60);
            const splitVision = doc.splitTextToSize(deepAnalysis.longTermVision, contentWidth);
            doc.text(splitVision, margin, y);
            y += (splitVision.length * 6) + 15;
        }

        doc.save(`IMI - Strategy - ${selectedObjective.id}.pdf`);
    };

    return (
        <div className="report-container">
            {/* Header */}
            <div className="report-header">
                <h2>{advice.title}</h2>
                <div className="report-subtitle">{t('header.subtitle')}</div>
                <div className="focus-badges">
                    {highlighted.map((label, idx) => (
                        <span key={idx} className="badge">{label}</span>
                    ))}
                </div>
            </div>

            <div className="report-content">
                {/* Deep Analysis Mode */}
                <div className="deep-analysis-teaser" style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #1a237e, #0d47a1)', padding: '30px', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Zap size={24} color="var(--warning-yellow)" fill="var(--warning-yellow)" />
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>AI Deep Strategic Analysis</h3>
                        </div>
                        {deepAnalysis ? (
                            <div className="deep-analysis-content">
                                <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '20px' }}>{deepAnalysis.executiveSummary}</p>

                                <div className="grid-areas" style={{ marginTop: '20px' }}>
                                    <div className="area-card" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        <h4 style={{ color: 'var(--electric-blue)' }}>Competitive Edge</h4>
                                        <p style={{ color: 'white', opacity: 0.9 }}>{deepAnalysis.primaryCompetitiveAdvantage}</p>
                                    </div>
                                    {deepAnalysis.strategicPillars.slice(0, 2).map((pillar, idx) => (
                                        <div key={idx} className="area-card" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            <h4 style={{ color: 'var(--electric-blue)' }}>{pillar.title}</h4>
                                            <p style={{ color: 'white', opacity: 0.9 }}>{pillar.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <button className="btn" onClick={runDeepAnalysis} disabled={isLoading} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white' }}>
                                        {isLoading ? 'Regenerating...' : 'Update Analysis'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '20px' }}>
                                    Synthesize all your tools (Brand, Product, Prospect, Conversation) into a single, cohesive strategic roadmap using Gemini AI.
                                </p>
                                <button className="btn" onClick={runDeepAnalysis} disabled={isLoading} style={{ background: 'var(--digital-white)', color: 'var(--midnight-black)' }}>
                                    {isLoading ? 'Analyzing...' : 'Run Deep Analysis'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="report-metadata-grid">
                    <div>
                        <span className="meta-label">{t('report.metadata.brand_product')}</span>
                        <span className="meta-value">{formData.brandName || t('report.metadata.not_specified')}</span>
                    </div>
                    <div>
                        <span className="meta-label">{t('report.metadata.target_audience')}</span>
                        <span className="meta-value">{formData.audience || t('report.metadata.not_specified')}</span>
                    </div>
                    <div>
                        <span className="meta-label">{t('report.metadata.compass_focus')}</span>
                        <span className="meta-value">{t(`form.focus_${formData.focus}`).toUpperCase()}</span>
                    </div>
                    <div>
                        <span className="meta-label">{t('report.metadata.date_generated')}</span>
                        <span className="meta-value">{new Date().toLocaleDateString(i18n.language)}</span>
                    </div>
                </div>

                {/* Challenge */}
                {formData.challenge && (
                    <div className="challenge-section">
                        <h4>{t('report.current_challenge')}:</h4>
                        <p>"{formData.challenge}"</p>
                    </div>
                )}

                {/* Strategic Insight Highlight */}
                {advice.highlight && (
                    <div className="section-block">
                        <h3>{t('report.strategic_insight')}</h3>
                        <p className="highlight-text">{advice.highlight}</p>
                    </div>
                )}

                {/* Key Focus Areas */}
                {advice.focusAreas && advice.focusAreas.length > 0 && (
                    <div className="section-block">
                        <h3>{t('report.key_focus_areas')}</h3>
                        <div className="grid-areas">
                            {advice.focusAreas.map((area, idx) => (
                                <div key={idx} className="area-card">
                                    <h4>{t(`nodes.${area.name.toLowerCase().replace(/[^a-z]/g, '')}`)}</h4>
                                    <p>{area.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Core Philosophy */}
                {advice.corePhilosophy && (
                    <div className="section-block">
                        <h3>{t('report.core_philosophy')}</h3>
                        <div className="philosophy-box">
                            <p>{advice.corePhilosophy}</p>
                        </div>
                    </div>
                )}

                {/* 10 Essentials */}
                {advice.tips && advice.tips.length > 0 && (
                    <div className="section-block">
                        <h3>{t('report.essential_tips')}</h3>
                        <ul className="check-list">
                            {advice.tips.map((tip, idx) => (
                                <li key={idx}><CheckCircle size={18} className="icon-check" /> {tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Plans Grid */}
                <div className="plans-grid">
                    {/* 7-Day Plan */}
                    {advice.sevenDayPlan && advice.sevenDayPlan.length > 0 && (
                        <div className="plan-column">
                            <h3>{t('report.launch_prep')}</h3>
                            <div className="timeline-simple">
                                {advice.sevenDayPlan.map((item, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <strong>{item.day}</strong>
                                            <p>{item.focus}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    {advice.implementationTimeline && advice.implementationTimeline.length > 0 && (
                        <div className="plan-column">
                            <h3>{t('report.timeline')}</h3>
                            <div className="timeline-simple">
                                {advice.implementationTimeline.map((item, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-marker orange"></div>
                                        <div className="timeline-content">
                                            <strong>{item.period}</strong>
                                            <p>{item.focus}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 30-Day Calendar */}
                {advice.thirtyDayCalendar && advice.thirtyDayCalendar.length > 0 && (
                    <div className="section-block">
                        <h3>{t('report.calendar')}</h3>
                        <div className="calendar-grid">
                            {advice.thirtyDayCalendar.map((week, idx) => (
                                <div key={idx} className="calendar-card">
                                    <div className="calendar-header">
                                        <Calendar size={18} />
                                        <span>{week.week}</span>
                                    </div>
                                    <div className="calendar-body">
                                        <strong>{week.theme}</strong>
                                        <ul>
                                            {week.items.map((it, i) => <li key={i}>{it}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Strategic Recs & Red Flags */}
                <div className="plans-grid">
                    {advice.strategicRecommendations && advice.strategicRecommendations.length > 0 && (
                        <div className="plan-column">
                            <h3>{t('report.strategic_recommendations')}</h3>
                            <ul className="star-list">
                                {advice.strategicRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    )}

                    {advice.redFlags && advice.redFlags.length > 0 && (
                        <div className="plan-column">
                            <h3 className="text-red">{t('report.critical_red_flags')}</h3>
                            <ul className="alert-list">
                                {advice.redFlags.map((flag, i) => (
                                    <li key={i}><AlertTriangle size={16} className="icon-alert" /> {flag}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Next Steps */}
                {advice.nextSteps && advice.nextSteps.length > 0 && (
                    <div className="section-block">
                        <h3>{t('report.next_steps')}</h3>
                        <ul className="check-list">
                            {advice.nextSteps.map((step, idx) => (
                                <li key={idx}><ArrowRight size={18} className="icon-arrow" /> {step}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Quote */}
                <div className="quote-section">
                    <p>"{quote.quote}"</p>
                    <cite>— {quote.author}</cite>
                </div>

                {/* CTA & Footer */}
                <div className="cta-section">
                    <h3>📅 {t('report.cta.book_assessment')}</h3>
                    <p>{t('report.cta.one_on_one')}</p>
                    <a
                        href="https://calendly.com/imi-socialmediaimage/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="book-btn"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                    >
                        {t('report.cta.schedule_session')} <ArrowRight size={16} />
                    </a>
                </div>

                <div className="footer-links">
                    <h4>📚 {t('report.cta.resources')}</h4>
                    <div className="links-row">
                        <span><Users size={14} /> {t('report.cta.team')}</span>
                        <span><BookOpen size={14} /> {t('report.cta.support')}</span>
                        <span><Video size={14} /> {t('report.cta.youtube')}</span>
                    </div>
                </div>

                <div className="download-section">
                    <button className="premium-btn" onClick={handleDownloadPDF}>
                        <Download size={20} style={{ marginRight: '8px' }} />
                        {t('report.cta.download_pdf')}
                    </button>
                </div>
            </div>

            {/* Next Step CTA */}
            <div className="next-step-cta">
                <div className="cta-header">
                    <h3>🎯 {t('report.next_step_cta.ready')}</h3>
                    <p>{t('report.next_step_cta.now_that')}</p>
                </div>
                <div className="cta-content">
                    <div className="cta-info">
                        <h4>{t('report.next_step_cta.evaluate_brand')}</h4>
                        <p>{t('report.next_step_cta.tool_desc')}</p>
                        <ul className="cta-benefits">
                            <li>✓ {t('report.next_step_cta.benefit_1')}</li>
                            <li>✓ {t('report.next_step_cta.benefit_2')}</li>
                            <li>✓ {t('report.next_step_cta.benefit_3')}</li>
                        </ul>
                    </div>
                    <button
                        className="cta-button"
                        onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'brand-evaluator' }))}
                    >
                        {t('report.next_step_cta.evaluate_button')} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
