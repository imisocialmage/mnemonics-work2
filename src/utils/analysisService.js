import { getGeminiResponse } from './geminiClient';
import { getTemplate, getAssetBatch } from './AssetTemplates';

/**
 * Analysis Service
 * Provides structured AI analysis for all IMI Compass tools.
 */

const TOOL_SCHEMAS = {
    brandEvaluator: {
        systemPrompt: "You are a Brand Strategist. Analyze the following brand foundation data and provide a structured review in JSON format. CRITICAL: Use the user's ACTUAL industry, product type, and audience from the data provided. If they are B2B, focus on trust, efficiency, and ROI. If they are B2C, focus on lifestyle, emotion, and personal transformation. Do NOT use generic tech/SaaS templates unless explicitly specified.",
        jsonStructure: {
            overallScore: "A single float from 0-5 representing the overall brand strength.",
            analysis: "A concise paragraph (2-3 sentences) evaluating the brand's clarity and uniqueness, tailored to their specific industry.",
            recommendations: [
                { title: "Recommendation Title", description: "Actionable advice grounded in their industry context." }
            ],
            scores: {
                clarity: 0 - 5,
                relevance: 0 - 5,
                emotionalResonance: 0 - 5,
                originality: 0 - 5,
                storytelling: 0 - 5,
                scalability: 0 - 5,
                commercialAppeal: 0 - 5,
                consistency: 0 - 5
            }
        }
    },

    strategicRoadmap: {
        systemPrompt: "You are the Lead Growth Strategist. Synthesize results from Brand Audit, Product Profile, Prospect Profile, and Conversation Guide into a coherent Master Strategic Roadmap. CRITICAL: Recommendations must be deeply industry-specific. If they sell physical goods (B2C), focus on logistics, branding, and repeat purchases. If they offer high-ticket B2B services, focus on lead quality, authority building, and long sales cycles. Avoid generic advice. Return JSON.",
        jsonStructure: {
            executiveSummary: "A high-level overview of the strategic direction.",
            primaryCompetitiveAdvantage: "What truly sets them apart after analyzing everything.",
            strategicPillars: [
                { title: "Pillar Name", description: "Why it's a pillar and how to execute." }
            ],
            immediateActionPlan: ["Action 1", "Action 2", "Action 3"],
            longTermVision: "Where this brand should be in 12 months."
        }
    },
    productProfiler: {
        systemPrompt: "You are a Product Design Expert and Marketing Strategist. Create a detailed Product Profile based on the user's description. CRITICAL: Base ALL recommendations on the user's ACTUAL product type and industry. If they sell fashion, use fashion terminology. If they offer consulting, use consulting language. Do NOT default to 'entrepreneur' or 'business owner' unless that is their explicit target market. Return JSON.",
        jsonStructure: {
            uvp: "A compelling Unique Value Proposition.",
            targetNiches: ["Niche 1", "Niche 2"],
            avatars: [
                {
                    role: "Avatar Name",
                    description: "Deep psychographic profile",
                    pains: ["Pain 1", "Pain 2"],
                    dreams: ["Dream 1"],
                    demographics: ["Demographic 1", "Demographic 2"],
                    buyingTriggers: ["Trigger 1", "Trigger 2"]
                }
            ],
            marketing: {
                interestHooks: ["Hook mentioning the ACTUAL product name and industry-specific pain point", "A hook using the specific vocabulary of their audience (e.g., professional, social, or technical)"],
                intentSignals: ["A behavioral signal specific to their market (e.g., 'looking for bulk pricing' for B2B or 'checking reviews for style' for B2C)", "Another signal based on the actual customer profile"],
                ctas: ["CTA mentioning the actual product/service and the specific benefit", "Action-oriented CTA relevant to their sales cycle (e.g., 'Book a Demo' vs 'Buy Now')"]
            }
        }
    },
    prospectProfiler: {
        systemPrompt: "You are a Sales Psychology Expert. Analyze this prospect and product to create 5 distinct connection messages. CRITICAL: The prospect type can be either B2B (professional/business) or B2C (consumer/individual). For B2B prospects, focus on professional pain points, ROI, business outcomes, and use formal business language. For B2C prospects, focus on personal desires, lifestyle fit, emotional benefits, and use conversational consumer language. AVOID tech/SaaS tropes unless specified. Use the user's specific industry and vocabulary. Return JSON.",
        jsonStructure: {
            messages: [
                {
                    type: "authority",
                    title: "Authority Message",
                    content: "Message content with HTML <br> for spacing.",
                    ratings: { clarity: 0 - 10, relevance: 0 - 10, distinctiveness: 0 - 10, memorability: 0 - 10, scalability: 0 - 10 }
                }
            ],
            personalityType: "A name for the prospect's personality type.",
            strategicAngle: "The best psychological angle to approach this specific person."
        }
    },
    conversationGuide: {
        systemPrompt: "You are a High-Stakes Sales Consultant. Analyze the product-prospect match and create a sales story framework. Return JSON.",
        jsonStructure: {
            matchScore: 85,
            scoreAnalysis: "Why this product fits (or doesn't fit) the prospect.",
            storyFramework: {
                situation: "The prospect's current reality.",
                desires: "What they truly want.",
                conflicts: "What's stopping them.",
                changes: "How the product changes their situation.",
                results: "The ultimate outcome."
            },
            conversationRoadmap: [
                { phase: "Opening", goal: "Establish rapport.", talkPoints: ["Point 1"] }
            ]
        }
    },
    assetAI: {
        systemPrompt: "You are a World-Class Visual Designer and Conversion Rate Optimizer. Based on the brand strategy, product positioning, and visual context provided (if any), generate a high-converting website/asset concept. CRITICAL: Analyze any uploaded images for brand colors, vibe, and audience demographics. If no images are provided, use the text context to infer the design direction. Return JSON.",
        jsonStructure: {
            assetType: "e.g. High-Conversion Landing Page",
            headline: "A punchy, benefit-driven headline.",
            subheadline: "A supporting sentence that clarifies the value.",
            ctaText: "A high-friction/low-friction CTA button text.",
            exampleStatement: "A consolidated 'elevator pitch' that summarizes the strategy.",
            colorPalette: {
                primary: "#HEX",
                secondary: "#HEX",
                accent: "#HEX"
            },
            typography: "Suggested font pairings (e.g., 'Inter for body, Playfair Display for headers')",
            sections: [
                { title: "Section Name", content: "Brief description of what goes in this section and why." }
            ],
            visualAdvice: "Strategic advice on what kind of photography or illustration to use based on the context."
        }
    },
    coreProfiler: {
        systemPrompt: "You are an Expert Brand Architect and Systems Strategist. Based on a business description, synthesize a full brand identity and sales system. Provide colors, fonts, keywords, and a multi-tab sales strategy. Use your deep knowledge of psychology and marketing to make these entries punchy and effective. Return JSON.",
        jsonStructure: {
            brand: {
                name: "The business name",
                description: "A professional, expanded version of the user's description (3-4 sentences).",
                fonts: {
                    headers: "font-family name (e.g., Montserrat, Playfair Display, Roboto)",
                    body: "font-family name (e.g., Lato, Open Sans, Inter)"
                },
                colors: {
                    primary: "#HEX",
                    secondary: "#HEX"
                },
                keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
            },
            salesSystem: {
                product: "Detailed description of the new customer acquisition system.",
                reorder: "Strategy for getting customers to reorder or stay loyal.",
                opportunity: "How to identify and seize new market opportunities.",
                upsell: "Concrete upsell strategies to increase average order value.",
                team: "Strategy for building or managing the necessary team/talent."
            }
        }
    }
};

/**
 * Generates AI analysis for a specific tool.
 * @param {string} toolId - ID of the tool (e.g., 'brandEvaluator')
 * @param {Object} data - The data collected from the tool forms
 * @param {string} language - 'en' or 'fr'
 * @returns {Promise<Object>} The parsed structured analysis
 */

export const analyzeToolData = async (toolId, data, language = 'en') => {
    // TEMPORARY BYPASS: Use templates for AssetAI to avoid API limits
    if (toolId === 'assetAI') {
        console.log("Using Template Mode for AssetAI due to API Limits");
        return new Promise(resolve => {
            setTimeout(() => {
                // meaningful context extraction
                const compass = data.compass || {};
                const product = data.product || {};
                const brand = data.brand || {};
                const prospect = data.prospect || {};

                const industry = brand.industry || product.industry || "Growth";
                const productName = brand.brandName || product.productName || "Your Brand";
                const audience = prospect.targetAudience || product.typicalUsers || "Customers";

                // Detect B2B vs B2C
                let type = prospect.types || "B2B";
                const b2cKeywords = ['consumer', 'individual', 'families', 'students', 'women', 'men', 'kids', 'fashion', 'apparel', 'clothing', 'wear', 'lifestyle', 'beauty', 'health'];

                const combinedContext = (audience + ' ' + industry + ' ' + productName).toLowerCase();

                if (b2cKeywords.some(kw => combinedContext.includes(kw))) {
                    type = "B2C";
                }

                // Extract visual context if available
                const uploadedImages = (data.visuals && Array.isArray(data.visuals.all)) ? data.visuals.all : (data.visuals?.main ? [data.visuals.main] : []);
                const mainImage = uploadedImages[0] || null;

                const context = {
                    industry,
                    productName,
                    targetAudience: audience,
                    prospectType: type,
                    // New enriched fields
                    uvp: product.aiResults?.uvp || product.differentiator || compass.uvp,
                    problemSolved: product.problemSolved || compass.challenge,
                    differentiator: product.differentiator,
                    emotionalBenefit: product.emotionalBenefit,
                    brandColors: brand.brandColors,
                    uploadedImage: mainImage,
                    uploadedImages: uploadedImages
                };

                const batch = getAssetBatch(context);

                // Ensure visuals are correctly mapped in the batch
                const enrichVisuals = (asset) => {
                    if (!asset) return asset;
                    return {
                        ...asset,
                        visuals: {
                            main: mainImage,
                            all: uploadedImages,
                            secondary: uploadedImages.slice(1)
                        }
                    };
                };

                batch.landingPage = enrichVisuals(batch.landingPage);

                // Enrich all social post platforms
                if (batch.socialPosts) {
                    Object.keys(batch.socialPosts).forEach(platform => {
                        batch.socialPosts[platform] = enrichVisuals(batch.socialPosts[platform]);
                    });
                }

                // Enrich all social cover formats
                if (batch.socialCover) {
                    Object.keys(batch.socialCover).forEach(coverType => {
                        batch.socialCover[coverType] = enrichVisuals(batch.socialCover[coverType]);
                    });
                }

                resolve(batch);
            }, 1000); // Simulate "thinking" time
        });
    }

    const schema = TOOL_SCHEMAS[toolId];
    if (!schema) throw new Error(`Unsupported tool: ${toolId}`);

    // Extract images if provided (specific to assetAI)
    const images = data.visuals ? Object.values(data.visuals).filter(Boolean) : [];

    // Extract key context from data to emphasize in prompt
    const industryContext = data.industry || data.product?.industry || data.brand?.industry ||
        data.product?.productName || data.brand?.brandName || 'the user\'s business';
    const productType = data.product?.productName || data.productName || 'product/service';
    const targetAudience = data.product?.typicalUsers || data.typicalUsers ||
        data.prospect?.role || data.audience || 'target audience';

    console.log(`[${toolId}] Extracted Context:`, { industryContext, productType, targetAudience });
    console.log(`[${toolId}] Full Data:`, data);

    const prompt = `
    ${schema.systemPrompt}
    
    Language: ${language === 'fr' ? 'French' : 'English'}
    
    CONTEXT REMINDER: 
    - Industry/Product: ${industryContext}
    - Product/Service: ${productType}
    - Target Audience: ${targetAudience}
    ${images.length > 0 ? `- Visual Context: Found ${images.length} uploaded reference images.` : ''}
    
    Use this EXACT context in your analysis. Do NOT substitute generic business terms.
    
    Data to analyze: ${JSON.stringify(data, null, 2)}
    
    CRITICAL JSON FORMATTING RULES:
    1. Return ONLY valid JSON - no markdown, no code blocks, no \`\`\`json
    2. All string values must use properly escaped quotes
    3. No unescaped newlines in strings - use \\n instead
    4. Structure must exactly match this schema:
    ${JSON.stringify(schema.jsonStructure, null, 2)}
    `;

    try {
        const responseText = await getGeminiResponse(
            [{ role: 'user', content: prompt, images }],
            { objective: `Structured Analysis for ${toolId}` },
            schema.systemPrompt
        );

        // Sanitize response (Gemini sometimes includes markdown blocks or unescaped newlines)
        let sanitized = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Fix common JSON malformations from AI:
        // 1. Remove potentially dangerous control characters (excluding common whitespace)
        // eslint-disable-next-line no-control-regex
        sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");

        // 2. Try parsing first
        try {
            return JSON.parse(sanitized);
        } catch (e) {
            console.error("Initial JSON parse failed, attempting aggressive whitespace normalization...", e);
            console.error("Problematic JSON (first 800 chars):", sanitized.substring(0, 800));

            // 3. More aggressive cleaning for common AI issues
            let deepCleaned = sanitized
                // Replace ALL types of whitespace/newlines with single spaces
                .replace(/\r\n/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/\r/g, ' ')
                .replace(/\t/g, ' ')
                // Normalize multiple spaces
                .replace(/  +/g, ' ');

            try {
                return JSON.parse(deepCleaned);
            } catch (e2) {
                console.error("Deep clean also failed:", e2);
                console.error("Failed JSON:", deepCleaned.substring(0, 500));
                throw new Error(`Failed to parse AI response as JSON: ${e2.message}`);
            }
        }
    } catch (error) {
        console.error(`AI Analysis failed for ${toolId}:`, error);
        throw error;
    }
};
