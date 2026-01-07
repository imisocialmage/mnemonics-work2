import { jsPDF } from 'jspdf';
import { STRATEGIC_ADVICE, COMPASS_NODES } from '../../data/compassData';

export const generateMasterReport = () => {
    // 1. Get all data from localStorage
    const compassData = JSON.parse(localStorage.getItem('imi-compass-data') || '{}');
    const brandData = JSON.parse(localStorage.getItem('imi-brand-data') || '{}');
    const productData = JSON.parse(localStorage.getItem('imi-product-data') || '{}');
    const prospectData = JSON.parse(localStorage.getItem('imi-prospect-data') || '{}');
    const conversationData = JSON.parse(localStorage.getItem('imi-conversation-data') || '{}');

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
        addText("Strategic Path: " + compassData.focus.toUpperCase() + " focus");
        y += 5;
        addSubtitle("Strategic Mission");
        addText(advice.mission);
        y += 5;
        addSubtitle("Action Plan & Recommendations");
        advice.nextSteps.forEach(step => addText("• " + step));
    } else {
        addText("Data from Marketing Compass not found.");
    }
    addSeparator();

    // --- SECTION 2: BRAND EVALUATION ---
    checkPage(50);
    addTitle("2. Brand Equity & Strength");
    y += 5;
    if (brandData.overallScore) {
        addSubtitle("Overall Brand Strength: " + brandData.overallScore + "/100");
        y += 5;
        addSubtitle("Attribute Scores");
        if (brandData.scores) {
            Object.entries(brandData.scores).forEach(([attr, score]) => {
                addText(`• ${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${score}/10`);
            });
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
        addSubtitle("Unique Value Proposition");
        addText(`Helping target users achieve results by ${productData.differentiator || 'differentiation'}.`);
        y += 5;
        addSubtitle("Ideal Client Avatar Profile");
        addText("Core Problem: " + (productData.problemSolved || "Not defined"));
        addText("Primary Benefit: " + (productData.tangibleBenefit || "Not defined"));
    } else {
        addText("Data from Product Profiler not found.");
    }
    addSeparator();

    // --- SECTION 4: PROSPECT INTELLIGENCE ---
    checkPage(50);
    addTitle("4. Prospect Persona & Intelligence");
    y += 5;
    if (prospectData.jobTitle) {
        addSubtitle("Target Role: " + prospectData.jobTitle);
        addText("Industry: " + (prospectData.industry || "General"));
        y += 5;
        addSubtitle("Psychological Profile");
        addText("Pain Points: " + (prospectData.painPoints || "Not specified"));
        addText("Values: " + (prospectData.values || "Not specified"));
    } else {
        addText("Data from Prospect Profiler not found.");
    }
    addSeparator();

    // --- SECTION 5: SALES CONVERSATION STRATEGY ---
    checkPage(50);
    addTitle("5. Conversion & Sales Flow");
    y += 5;
    if (conversationData.clarity) {
        addSubtitle("Product-Prospect Match Score: " + (matchScorePlaceholder(conversationData) || "Analyzed"));
        y += 5;
        addSubtitle("Core Messaging Strategy");
        addText("The strategy focuses on bridging the gap between current conflicts and desired results through your unique product framework.");
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

const matchScorePlaceholder = (data) => {
    // Basic recreation of score logic if needed, but we should probably save the actual score
    return "Consolidated";
};
