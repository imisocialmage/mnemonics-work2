import { jsPDF } from 'jspdf';
import { STRATEGIC_ADVICE, COMPASS_NODES } from '../../data/compassData';

export const generateMasterReport = (profileIndex = 0) => {
    const prefix = `imi-p${profileIndex}-`;
    // 1. Get all data from localStorage with profile-specific keys
    const compassData = JSON.parse(localStorage.getItem(`${prefix}imi-compass-data`) || localStorage.getItem('imi-compass-data') || '{}');
    const brandData = JSON.parse(localStorage.getItem(`${prefix}imi-brand-data`) || localStorage.getItem('imi-brand-data') || '{}');
    const productData = JSON.parse(localStorage.getItem(`${prefix}imi-product-data`) || localStorage.getItem('imi-product-data') || '{}');
    const prospectData = JSON.parse(localStorage.getItem(`${prefix}imi-prospect-data`) || localStorage.getItem('imi-prospect-data') || '{}');
    const conversationData = JSON.parse(localStorage.getItem(`${prefix}imi-conversation-data`) || localStorage.getItem('imi-conversation-data') || '{}');

    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (2 * margin);

    const addTitle = (text, size = 22, color = [41, 121, 255]) => {
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(text, margin, y);
        y += size / 2;
    };

    const addSubtitle = (text, size = 14, color = [50, 50, 50]) => {
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(text, margin, y);
        y += size / 1.5;
    };

    const addText = (text, size = 10, color = [80, 80, 80]) => {
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 2;
        checkPage(10);
    };

    const checkPage = (needed) => {
        if (y + needed > 280) {
            doc.addPage();
            y = 20;
        }
    };

    const addSeparator = () => {
        doc.setDrawColor(200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    };

    // --- COVER PAGE ---
    addTitle("IMI STRATEGIC MASTER BLUEPRINT", 26);
    y += 10;
    addSubtitle("Your Consolidated Marketing & Brand Strategy");
    y += 20;
    addText("Brand: " + (compassData.brandName || "Not specified"), 12);
    addText("Generated on: " + new Date().toLocaleDateString(), 12);
    y += 40;
    addText("This master report consolidates insights from the full IMI strategic workflow, combining marketing strategy, brand evaluation, product positioning, prospect intelligence, and sales conversation guides.");

    doc.addPage();
    y = 20;

    // --- SECTION 1: MARKETING COMPASS ---
    addTitle("1. Strategic Marketing Direction");
    y += 5;
    if (compassData.objective) {
        const advice = STRATEGIC_ADVICE[compassData.objective];
        addSubtitle("Core Objective: " + compassData.objective.toUpperCase());
        addText("Strategic Path: " + (compassData.focus || "Core").toUpperCase() + " focus");
        y += 5;
        addSubtitle("Strategic Mission");
        addText(advice.mission);
    } else {
        addText("Data from Marketing Compass not found.");
    }

    // AI Strategic Roadmap Synthesis (If exists)
    const deepAnalysis = JSON.parse(localStorage.getItem(`${prefix}deep-analysis`) || localStorage.getItem('imi-p0-deep-analysis') || 'null');
    if (deepAnalysis) {
        y += 5;
        addSubtitle("AI MASTER STRATEGY SUMMARY", 16, [41, 121, 255]);
        addText(deepAnalysis.executiveSummary);
        y += 3;
        addSubtitle("Primary Edge");
        addText(deepAnalysis.primaryCompetitiveAdvantage);
    }
    addSeparator();

    // --- SECTION 2: BRAND EVALUATION ---
    checkPage(50);
    addTitle("2. Brand Equity & Strength");
    y += 5;
    if (brandData.overallScore) {
        addSubtitle("Overall Brand Score: " + (brandData.aiResults?.overallScore || (brandData.overallScore / 20).toFixed(1)) + "/5.0");
        if (brandData.aiResults?.analysis) {
            y += 2;
            addText(brandData.aiResults.analysis);
        }
        y += 5;
        addSubtitle("Strategic Recommendations");
        const recs = brandData.aiResults?.recommendations || [];
        if (recs.length > 0) {
            recs.forEach(r => addText(`• ${r.title}: ${r.description}`));
        } else {
            addText("Focus on improving clarity, relevance, and emotional resonance.");
        }
    } else {
        addText("Data from Brand Evaluator not found.");
    }
    addSeparator();

    // --- SECTION 3: PRODUCT POSITIONING ---
    checkPage(50);
    addTitle("3. Product Positioning & UVP");
    y += 5;
    if (productData.productName) {
        addSubtitle("Product Name: " + productData.productName);
        y += 5;
        addSubtitle("Unique Value Proposition (AI-Optimized)");
        addText(productData.aiResults?.uvp || productData.tangibleBenefit || "Not defined");

        if (productData.aiResults?.avatars) {
            y += 5;
            addSubtitle("Ideal Client Avatars");
            productData.aiResults.avatars.forEach(avatar => {
                checkPage(30);
                addText(`• ${avatar.role}: ${avatar.description}`);
                addText(`  Pains: ${avatar.pains}`);
                addText(`  Triggers: ${avatar.buyingTriggers}`);
            });
        }
    } else {
        addText("Data from Product Profiler not found.");
    }
    addSeparator();

    // --- SECTION 4: PROSPECT INTELLIGENCE ---
    checkPage(50);
    addTitle("4. Prospect Persona & Intelligence");
    y += 5;
    if (prospectData.jobTitle) {
        addSubtitle("Personality Type: " + (prospectData.aiResults?.personalityType || "Analyzed"));
        if (prospectData.aiResults?.strategicAngle) {
            addText("Strategic Angle: " + prospectData.aiResults.strategicAngle);
        }
        y += 5;
        addSubtitle("Outreach Strategy");
        const msgs = prospectData.aiResults?.messages || [];
        if (msgs.length > 0) {
            msgs.slice(0, 2).forEach(m => {
                addSubtitle(m.title, 11);
                addText(m.content.replace(/<br>/g, '\n'));
            });
        } else {
            addText("Pain Points: " + (prospectData.painPoints || "Not specified"));
        }
    } else {
        addText("Data from Prospect Profiler not found.");
    }
    addSeparator();

    // --- SECTION 5: SALES CONVERSATION STRATEGY ---
    checkPage(50);
    addTitle("5. Conversion & Sales Flow");
    y += 5;
    if (conversationData.aiResults || conversationData.matchScore) {
        addSubtitle("Product-Prospect Match Score: " + (conversationData.aiResults?.matchScore || conversationData.matchScore) + "/10");
        if (conversationData.aiResults?.scoreAnalysis) {
            addText(conversationData.aiResults.scoreAnalysis);
        }

        if (conversationData.aiResults?.storyFramework) {
            y += 5;
            addSubtitle("Story Framework");
            const framework = conversationData.aiResults.storyFramework;
            addText("• Situation: " + framework.situation);
            addText("• Conflict: " + framework.conflicts);
            addText("• Change: " + framework.changes);
            addText("• Result: " + framework.results);
        }
    } else {
        addText("Data from Conversation Guide not found.");
    }



    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text("© 2026 IMI Compass Master Strategic Blueprint - Confidentially Generated for " + (compassData.brandName || "Client"), margin, 290);
        doc.text("Page " + i + " of " + totalPages, pageWidth - margin - 20, 290);
    }

    doc.save("IMI_Master_Strategic_Blueprint.pdf");
};
