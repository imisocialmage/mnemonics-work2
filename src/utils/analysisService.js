import { getGeminiResponse } from './geminiClient';
import { getTemplate, getAssetBatch } from './AssetTemplates';
import { analyzeOffline } from './offlineAnalyzer';

/**
 * Analysis Service
 * Provides structured AI analysis for all IMI Compass tools.
 */

const TOOL_SCHEMAS = {
    brandEvaluator: {
        systemPrompt: "You are a Master Brand Strategist. Analyze the following brand foundation using Aaker's Brand Identity Model. CRITICAL: Evaluate the 'Core Identity' (timeless essence) vs 'Extended Identity' (functional and emotional benefits). Use the user's ACTUAL industry, product type, and audience. If they are B2B, focus on trust, efficiency, and ROI. If they are B2C, focus on lifestyle, emotion, and personal transformation. Do NOT use generic tech/SaaS templates.",
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
        systemPrompt: "You are the Lead Growth Strategist. Synthesize results from Brand Audit, Product Profile, Prospect Profile, and Conversation Guide into a coherent Master Strategic Roadmap. CRITICAL: Perform a 'Gap Analysis' between the Brand Identity and Sales Execution. Provide recommendations grounded in deep industry specificity. Avoid generic advice. Return JSON.",
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
        systemPrompt: "You are a Product Design Expert and Marketing Strategist. Create a detailed Product Profile using the 'Jobs-to-be-Done' (JTBD) framework. CRITICAL: Identify the 'Job' the user is hiring this product for and map the 'Value Proposition Canvas'. Base ALL recommendations on the user's ACTUAL product type and industry. Return JSON.",
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
        systemPrompt: "You are a Sales Psychology Expert. Analyze this prospect/product and create 5 distinct messages grounded in Cialdini’s Principles of Persuasion (Reciprocity, Authority, Scarcity). CRITICAL: Tailor to B2B (ROI/Efficiency) or B2C (Emotion/Lifestyle). Use the user's specific industry vocabulary. Return JSON.",
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
    },
    compass_profiler: {
        systemPrompt: "You are an expert Strategic Business Consultant. Analyze the business description to create a comprehensive 'Strategic Compass Profile'. Generate a 4-part profile (Identity, Offer, Audience, Execution), a detailed Brand & Sales System, and extract structured data to pre-fill other tools. CRITICAL: Match the industry exactly. If they sell clothes, use fashion terms. If they sell tech, use tech terms. AVOID words like 'enterprise', 'solution', or 'B2B complexity' unless they are actually in that field. Return JSON.",
        jsonStructure: {
            brand: {
                name: "The business name",
                description: "A professional, expanded version of the user's description (3-4 sentences).",
                fonts: {
                    headers: "font-family name (e.g., Montserrat, Playfair Display)",
                    body: "font-family name (e.g., Lato, Open Sans)"
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
            },
            profiles: {
                identity: {
                    archetype: "Brand Archetype (e.g. The Ruler)",
                    voice: "Brand Voice description",
                    values: ["Value 1", "Value 2", "Value 3"]
                },
                offer: {
                    coreOffer: "Concise product/service definition",
                    differentiator: "Key differentiator",
                    uvp: "One sentence UVP"
                },
                audience: {
                    avatarName: "Name of the target avatar",
                    primaryPain: "Main pain point",
                    coreDesire: "Core desire"
                },
                execution: {
                    channel: "Primary marketing channel",
                    contentPillar: "Main content theme",
                    immediateAction: "One concrete next step"
                }
            },
            toolData: {
                compass: {
                    brandName: "string",
                    objective: "acquisition, conversion, or retention",
                    focus: "focus area",
                    audience: "summary",
                    challenge: "summary"
                },
                brand: {
                    brandName: "string",
                    whatOffer: "string",
                    whoTarget: "string",
                    howAccessible: "string"
                },
                product: {
                    productName: "string",
                    problemSolved: "string",
                    topFeatures: "string",
                    differentiator: "string",
                    tangibleBenefit: "string",
                    typicalUsers: "string"
                },
                prospect: {
                    prospectType: "B2B or B2C",
                    industry: "string",
                    targetDescription: "string",
                    painPoints: "string",
                    values: "string"
                }
            },
            optimizationTips: [
                "Tip 1: How to refine the brand voice.",
                "Tip 2: A specific improvement for the target audience definition.",
                "Tip 3: A suggestion for a more unique selling proposition."
            ],
            strategicAdvice: {
                immediateFocus: "The one thing to do right now.",
                longTermPlay: "Where the big opportunity lies in 12 months.",
                assetRecommendation: "Which asset (Landing Page, Social, etc.) to build first."
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
    // 1. Attempt Real AI Analysis
    try {
        // Handle AssetAI specifically with a hybrid approach
        if (toolId === 'assetAI') {
            console.log("[assetAI] Attempting Real AI Analysis...");
            const result = await runAIAnalysis(toolId, data, language);
            if (result) return result;
        }

        return await runAIAnalysis(toolId, data, language);
    } catch (error) {
        console.warn(`[${toolId}] AI Analysis failed or rate-limited. Falling back to Heuristic Engine.`, error);

        // 2. Fallback to Offline Heuristic Engine
        try {
            // Context mapping for offline engine
            const name = data.brandName || data.productName || data.brand?.brandName || 'Business';
            const description = data.description || data.whatOffer || data.problemSolved || '';

            const offlineResult = analyzeOffline({ name, description, language });

            // Special handling for AssetAI fallback (uses templates)
            if (toolId === 'assetAI') {
                return generateAssetFallback(data);
            }

            // Map offline result to tool-specific structure
            return mapOfflineResultToTool(toolId, offlineResult, language);
        } catch (fallbackError) {
            console.error(`[${toolId}] Critical Fallback Failure:`, fallbackError);
            throw error; // Throw original AI error if fallback also fails
        }
    }
};

/**
 * Isolated AI Analysis call
 */
const runAIAnalysis = async (toolId, data, language) => {
    const schema = TOOL_SCHEMAS[toolId];
    if (!schema) throw new Error(`Unsupported tool: ${toolId}`);

    const images = data.visuals ? Object.values(data.visuals).filter(Boolean) : [];
    const industryContext = data.industry || data.product?.industry || data.brand?.industry || 'specified industry';
    const productType = data.product?.productName || data.productName || 'product/service';
    const targetAudience = data.product?.typicalUsers || data.typicalUsers || 'target audience';

    const prompt = `
    ${schema.systemPrompt}
    Language: ${language === 'fr' ? 'French' : 'English'}
    CONTEXT: Industry: ${industryContext}, Product: ${productType}, Audience: ${targetAudience}
    ${images.length > 0 ? `Visuals: ${images.length} images provided.` : ''}
    Data: ${JSON.stringify(data)}
    Structure: ${JSON.stringify(schema.jsonStructure)}
    `;

    const responseText = await getGeminiResponse(
        [{ role: 'user', content: prompt, images }],
        { objective: `Strategic Analysis for ${toolId}` },
        schema.systemPrompt
    );

    try {
        // Advanced cleaning: remove markdown code blocks and any leading/trailing whitespace
        const cleanJSON = responseText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsed = JSON.parse(cleanJSON);
        // Sanitize the result based on the tool's schema structure
        return sanitizeAnalysisResult(toolId, parsed);
    } catch (parseError) {
        console.error(`[analysisService] JSON Parse Error for ${toolId}:`, parseError);
        console.debug("Raw Response:", responseText);

        // Final attempt: try to find the first '{' and last '}'
        try {
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                const innerJSON = responseText.substring(firstBrace, lastBrace + 1);
                const parsed = JSON.parse(innerJSON);
                return sanitizeAnalysisResult(toolId, parsed);
            }
        } catch (innerError) {
            console.error("[analysisService] Secondary parsing attempt failed.");
        }

        throw new Error(`Failed to parse AI response for ${toolId}`);
    }
};

/**
 * Ensures AI results match the expected structure to prevent UI crashes.
 */
const sanitizeAnalysisResult = (toolId, result) => {
    const schema = TOOL_SCHEMAS[toolId];
    if (!schema || !schema.jsonStructure) return result;

    const sanitize = (template, target) => {
        if (target === null || target === undefined) return template;

        if (Array.isArray(template)) {
            if (!Array.isArray(target)) return template;
            return target.map(item => {
                if (typeof template[0] === 'object' && template[0] !== null) {
                    return sanitize(template[0], item);
                }
                return item !== undefined ? item : template[0];
            });
        }

        if (typeof template === 'object' && template !== null) {
            const sanitized = {};
            for (const key in template) {
                sanitized[key] = sanitize(template[key], target[key]);
            }
            return sanitized;
        }

        // Handle number types explicitly (e.g. scores)
        if (typeof template === 'number') {
            const num = Number(target);
            return isNaN(num) ? template : num;
        }

        return target !== undefined ? target : template;
    };

    return sanitize(schema.jsonStructure, result);
};

/**
 * Maps general offline analysis to specific tool requirements
 */
const mapOfflineResultToTool = (toolId, offline, language = 'en') => {
    // Inject defaults into the offline result first
    const sanitizedOffline = sanitizeAnalysisResult(toolId, offline);

    // Ensure offline scores exists to prevent crashes
    const scores = sanitizedOffline.scores || { clarity: 60, precision: 60, differentiation: 60 };
    const isFR = language === 'fr';

    const loc = {
        brandEvaluator: {
            analysis: isFR ? "Analyse heuristique terminée." : "Heuristic analysis complete.",
            recommendationTitle: isFR ? "Conseil Stratégique" : "Strategic Clip",
            recommendationDesc: isFR ? "Conseil exploitable." : "Actionable advice."
        },
        productProfiler: {
            uvp: isFR ? "Proposition de valeur directe pour votre marché." : "Direct value proposition for your market.",
            niche: isFR ? "Marché Général" : "General Market",
            avatarRole: isFR ? "Client Idéal" : "Ideal Customer",
            avatarPain: isFR ? "Identification des défis principaux" : "Identifying core challenges",
            avatarHook: isFR ? "Résolution stratégique pour vos besoins primaires." : "Strategic resolution for your primary needs."
        },
        prospectProfiler: {
            personality: isFR ? "Décideur Analytique" : "Analytical Decision Maker",
            angle: isFR ? "Approche basée sur les bénéfices" : "Benefit-driven outreach",
            msgTitle: isFR ? "Approche d'Autorité" : "Authority Approach",
            msgContent: isFR ? "J'ai remarqué votre travail dans le domaine et je voulais partager une perspective spécifique..." : "I noticed your work in the field and wanted to share a specific insight..."
        },
        strategicRoadmap: {
            summary: isFR ? "Alignement stratégique établi entre la marque et le produit." : "Strategic alignment established between brand and product.",
            advantage: isFR ? "Positionnement professionnel basé sur un cadre structuré." : "Framework-grounded professional positioning.",
            pillarTitle: isFR ? "Pilier Central" : "Core Pillar",
            pillarDesc: isFR ? "Consolider l'identité de marque autour de la proposition de valeur principale." : "Consolidate brand identity around primary UVP.",
            action1: isFR ? "Réviser l'alignement" : "Review alignment",
            action2: isFR ? "Définir la cible principale" : "Define core target",
            vision: isFR ? "Établir le leadership sur votre niche de marché." : "Establish market leadership in your niche."
        }
    };

    switch (toolId) {
        case 'brandEvaluator':
            return {
                overallScore: (Number(scores.clarity || 60) + Number(scores.precision || 60) + Number(scores.differentiation || 60)) / 60,
                analysis: sanitizedOffline.analysis || sanitizedOffline.rationale || loc.brandEvaluator.analysis,
                recommendations: (sanitizedOffline.recommendations || sanitizedOffline.optimizationTips || []).map(tip => ({
                    title: typeof tip === 'string' ? loc.brandEvaluator.recommendationTitle : (tip.title || loc.brandEvaluator.recommendationTitle),
                    description: typeof tip === 'string' ? tip : (tip.description || loc.brandEvaluator.recommendationDesc)
                })),
                scores: {
                    clarity: Number(scores.clarity || 60) / 20,
                    relevance: 4,
                    emotionalResonance: sanitizedOffline.profiles?.identity?.archetype === (isFR ? 'Le Magicien' : 'The Magician') ? 5 : 3,
                    originality: Number(scores.differentiation || 60) / 20,
                    storytelling: 3,
                    scalability: 4,
                    commercialAppeal: 4,
                    consistency: 5
                }
            };
        case 'productProfiler':
            return {
                uvp: sanitizedOffline.uvp || sanitizedOffline.profiles?.offer?.uvp || loc.productProfiler.uvp,
                targetNiches: sanitizedOffline.targetNiches || [sanitizedOffline.industry || loc.productProfiler.niche],
                avatars: sanitizedOffline.avatars || [
                    {
                        role: sanitizedOffline.profiles?.audience?.avatarName || loc.productProfiler.avatarRole,
                        pain: sanitizedOffline.profiles?.audience?.primaryPain || loc.productProfiler.avatarPain,
                        hook: loc.productProfiler.avatarHook
                    }
                ]
            };
        case 'prospectProfiler':
            return {
                personalityType: sanitizedOffline.personalityType || loc.prospectProfiler.personality,
                strategicAngle: sanitizedOffline.strategicAngle || loc.prospectProfiler.angle,
                messages: sanitizedOffline.messages || [
                    {
                        title: loc.prospectProfiler.msgTitle,
                        content: loc.prospectProfiler.msgContent,
                        ratings: { clarity: 8, relevance: 8, distinctiveness: 8, memorability: 8, scalability: 8 }
                    }
                ]
            };
        case 'strategicRoadmap':
            return {
                executiveSummary: loc.strategicRoadmap.summary,
                primaryCompetitiveAdvantage: loc.strategicRoadmap.advantage,
                strategicPillars: [
                    { title: loc.strategicRoadmap.pillarTitle, description: loc.strategicRoadmap.pillarDesc }
                ],
                immediateActionPlan: [loc.strategicRoadmap.action1, loc.strategicRoadmap.action2],
                longTermVision: loc.strategicRoadmap.vision
            };
        case 'compass_profiler':
        case 'coreProfiler':
            return sanitizedOffline;
        default:
            return sanitizedOffline;
    }
};

/**
 * Enhanced Asset Fallback using templates
 */
const generateAssetFallback = (data) => {
    const compass = data.compass || {};
    const product = data.product || {};
    const brand = data.brand || {};
    const prospect = data.prospect || {};

    const context = {
        industry: brand.industry || product.industry || "Growth",
        productName: brand.brandName || product.productName || "Your Brand",
        targetAudience: prospect.targetAudience || product.typicalUsers || "Customers",
        prospectType: prospect.types || (data.prospect?.industry ? "B2B" : "B2C"),
        uvp: product.aiResults?.uvp || product.differentiator || compass.uvp,
        uploadedImage: data.visuals?.main,
        uploadedImages: data.visuals?.all || []
    };

    return getAssetBatch(context);
};

// --- REST OF FILE TRUNCATED ---
