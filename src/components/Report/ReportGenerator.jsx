import React from 'react';
import { STRATEGIC_ADVICE, getHighlightedPositions, COMPASS_NODES, getRandomQuote } from '../../data/compassData';
import { jsPDF } from 'jspdf';
import { Download, Calendar, CheckCircle, AlertTriangle, ArrowRight, BookOpen, Users, Video } from 'lucide-react';
import './Report.css';

const ReportGenerator = ({ formData, selectedObjective }) => {
    if (!selectedObjective) return null;

    const advice = STRATEGIC_ADVICE[selectedObjective.id];
    const apexPos = selectedObjective.targetPosition;
    const highlighted = getHighlightedPositions(apexPos).map(pos => COMPASS_NODES[pos].label);
    const quote = getRandomQuote();

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        let y = 20;
        const lineHeight = 7;
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
        doc.text("IMI Marketing Compass Strategy", margin, y);
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleDateString()} `, margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Brand: ${formData.brandName || 'Not specified'} `, margin, y);
        y += 6;
        doc.text(`Objective: ${selectedObjective.label} `, margin, y);
        y += 6;
        doc.text(`Focus: ${formData.focus.toUpperCase()} `, margin, y);
        y += 15;

        // Challenge
        if (formData.challenge) {
            checkPage(30);
            doc.setFontSize(14);
            doc.setTextColor(41, 121, 255);
            doc.text("Current Challenge", margin, y);
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
            doc.text("Strategic Insight", margin, y);
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
            doc.text("Key Focus Areas", margin, y);
            y += 10;
            advice.focusAreas.forEach(area => {
                checkPage(20);
                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.setFont("helvetica", "bold");
                doc.text(area.name, margin, y);
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
            doc.text("Core Philosophy", margin, y);
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
            doc.text("10 Essential Online Marketing Tips", margin, y);
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
            doc.text("7-Day Launch Preparation", margin, y);
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
            doc.text("30-Day Promotional Calendar", margin, y);
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
            doc.text("Top 5 Strategic Recommendations", margin, y);
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
            doc.text("Critical Red Flags to Avoid", margin, y);
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
            doc.text("Implementation Timeline", margin, y);
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
            doc.text("Next Steps", margin, y);
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
        doc.text("Book Your Personalized Assessment", margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text("Dive deeper into your strategy with a one-on-one session.", margin, y);
        y += 15;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Helpful Resources: Team Section | Main Support Hub | YouTube Channel", margin, y);
        y += 10;


        doc.save(`IMI - Strategy - ${selectedObjective.id}.pdf`);
    };

    return (
        <div className="report-container">
            {/* Header */}
            <div className="report-header">
                <h2>{advice.title}</h2>
                <div className="report-subtitle">Navigate Your Strategy Through Conversation, Not Coercion</div>
                <div className="focus-badges">
                    {highlighted.map((label, idx) => (
                        <span key={idx} className="badge">{label}</span>
                    ))}
                </div>
            </div>

            <div className="report-content">
                {/* Metadata */}
                <div className="report-metadata-grid">
                    <div>
                        <span className="meta-label">Brand / Product</span>
                        <span className="meta-value">{formData.brandName || 'Not specified'}</span>
                    </div>
                    <div>
                        <span className="meta-label">Target Audience</span>
                        <span className="meta-value">{formData.audience || 'Not specified'}</span>
                    </div>
                    <div>
                        <span className="meta-label">Compass Focus</span>
                        <span className="meta-value">{formData.focus.toUpperCase()}</span>
                    </div>
                    <div>
                        <span className="meta-label">Date Generated</span>
                        <span className="meta-value">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Challenge */}
                {formData.challenge && (
                    <div className="challenge-section">
                        <h4>Current Challenge/Goal:</h4>
                        <p>"{formData.challenge}"</p>
                    </div>
                )}

                {/* Strategic Insight Highlight */}
                {advice.highlight && (
                    <div className="section-block">
                        <h3>Strategic Insight</h3>
                        <p className="highlight-text">{advice.highlight}</p>
                    </div>
                )}

                {/* Key Focus Areas */}
                {advice.focusAreas && advice.focusAreas.length > 0 && (
                    <div className="section-block">
                        <h3>Key Focus Areas</h3>
                        <div className="grid-areas">
                            {advice.focusAreas.map((area, idx) => (
                                <div key={idx} className="area-card">
                                    <h4>{area.name}</h4>
                                    <p>{area.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Core Philosophy */}
                {advice.corePhilosophy && (
                    <div className="section-block">
                        <h3>Core Philosophy</h3>
                        <div className="philosophy-box">
                            <p>{advice.corePhilosophy}</p>
                        </div>
                    </div>
                )}

                {/* 10 Essentials */}
                {advice.tips && advice.tips.length > 0 && (
                    <div className="section-block">
                        <h3>10 Essential Online Marketing Tips</h3>
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
                            <h3>7-Day Launch Preparation</h3>
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
                            <h3>Implementation Timeline</h3>
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
                        <h3>30-Day Promotional Calendar</h3>
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
                            <h3>Top 5 Strategic Recommendations</h3>
                            <ul className="star-list">
                                {advice.strategicRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    )}

                    {advice.redFlags && advice.redFlags.length > 0 && (
                        <div className="plan-column">
                            <h3 className="text-red">5 Critical Red Flags</h3>
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
                        <h3>Next Steps</h3>
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
                    <h3>📅 Book Your Personalized Assessment</h3>
                    <p>Dive deeper into your strategy with a one-on-one session.</p>
                    <button className="book-btn">Schedule Your 30-Minute Session <ArrowRight size={16} /></button>
                </div>

                <div className="footer-links">
                    <h4>📚 Helpful Resources & Links</h4>
                    <div className="links-row">
                        <span><Users size={14} /> Team Section</span>
                        <span><BookOpen size={14} /> Main Support Hub</span>
                        <span><Video size={14} /> YouTube Channel</span>
                    </div>
                </div>

                <div className="download-section">
                    <button className="premium-btn" onClick={handleDownloadPDF}>
                        <Download size={20} style={{ marginRight: '8px' }} />
                        Download Full Strategy PDF
                    </button>
                </div>
            </div>

            {/* Next Step CTA */}
            <div className="next-step-cta">
                <div className="cta-header">
                    <h3>🎯 Ready for the Next Step?</h3>
                    <p>Now that you have your strategic direction, strengthen your brand foundation</p>
                </div>
                <div className="cta-content">
                    <div className="cta-info">
                        <h4>Evaluate Your Brand Strength</h4>
                        <p>Use the <strong>Brand Evaluation Tool</strong> to assess your brand across 8 critical metrics including clarity, relevance, and emotional resonance. Get AI-powered recommendations to strengthen your positioning.</p>
                        <ul className="cta-benefits">
                            <li>✓ Comprehensive 8-metric brand analysis</li>
                            <li>✓ AI-generated strategic recommendations</li>
                            <li>✓ Downloadable evaluation report</li>
                        </ul>
                    </div>
                    <button
                        className="cta-button"
                        onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tool', { detail: 'brand-evaluator' }))}
                    >
                        Evaluate Your Brand <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
