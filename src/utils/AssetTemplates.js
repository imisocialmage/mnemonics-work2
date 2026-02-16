/**
 * Asset AI Templates
 * specialized templates for different industries to avoid hitting AI rate limits.
 */

export const ASSET_TEMPLATES = {
    // Default fallback if no specific match
    default: {
        assetType: "High-Conversion Landing Page",
        headline: (ctx) => `Transform Your ${ctx.targetAudience} Experience with ${ctx.productName}`,
        subheadline: (ctx) => ctx.uvp || `The ultimate solution for ${ctx.industry} professionals who refuse to settle for less.`,
        heroImageDescription: (ctx) => `A clean, modern workspace featuring ${ctx.productName} as the centerpiece, with soft natural lighting.`,
        valueProps: (ctx) => [
            { title: "Efficiency Boost", description: "Streamline your workflow in record time." },
            { title: "Premium Quality", description: "Built with the highest standards for lasting results." },
            { title: "Proven Results", description: `Trusted by leaders across the ${ctx.industry} industry.` }
        ],
        ctaButtons: [
            { text: "Get Started Now", style: "primary", action: "scroll-to-pricing" },
            { text: "View Demo", style: "secondary", action: "open-modal" }
        ],
        colorPalette: ["#2563EB", "#1E40AF", "#F3F4F6", "#111827", "#DBEAFE"],
        layoutStructure: "Hero -> Problem/Agitation -> Solution -> Social Proof -> CTA",
        fontPairing: "Inter (Headers) + Roboto (Body)",
        secondaryVisuals: [
            { type: "icon", label: "Reliability" },
            { type: "feature", label: "Dashboard View" }
        ],
        strategicAdvice: {
            usage: "Use this layout to explain your value proposition clearly.",
            tip: "Keep the headline under 7 words for maximum impact.",
            placement: "Ideal for: General Traffic, Paid Search."
        }
    },

    // B2B Service / Consulting
    b2b_service: {
        assetType: "Strategic Consultation Lander",
        headline: (ctx) => ctx.problemSolved ? `Stop Struggling With ${ctx.problemSolved}` : `Scale Your ${ctx.industry} Business With Authority`,
        subheadline: (ctx) => ctx.uvp || `Start attracting high-value clients with a proven ${ctx.productName} framework.`,
        heroImageDescription: (ctx) => `A confident professional presenting a strategic roadmap on a glass whiteboard.`,
        valueProps: (ctx) => [
            { title: "Strategic Clarity", description: "Eliminate guesswork with a clear, actionable roadmap." },
            { title: "High-Ticket Positioning", description: "Command premium rates by positioning yourself as the authority." },
            { title: "Systematized Growth", description: "Build a scalable engine that generates leads while you sleep." }
        ],
        ctaButtons: [
            { text: "Book Your Strategy Call", style: "primary", action: "calendly-embed" },
            { text: "Read Case Studies", style: "outline", action: "scroll-to-proof" }
        ],
        colorPalette: ["#0F172A", "#334155", "#F8FAFC", "#3B82F6", "#64748B"],
        layoutStructure: "Hero -> Authority Logos -> Value Pillars -> Founder Note -> Application Form",
        fontPairing: "Playfair Display (Headers) + Lato (Body)",
        strategicAdvice: {
            usage: "Best for high-ticket services where trust is the main barrier.",
            tip: "Use the 'Founder Note' section to build a personal connection.",
            placement: "Ideal for: Retargeting, Email Sequences, Webinar Follow-up."
        }
    },

    // B2C / E-commerce / Physical Product
    b2c_product: {
        assetType: "Viral Product Launch Page",
        headline: (ctx) => `Experience ${ctx.productName} Like Never Before`,
        subheadline: (ctx) => ctx.emotionalBenefit ? `Feel ${ctx.emotionalBenefit} every single day.` : `The smart way to upgrade your daily routine.`,
        heroImageDescription: (ctx) => `A dynamic, lifestyle-focused shot of ${ctx.productName} in action.`,
        valueProps: (ctx) => [
            { title: "Designed for You", description: "Crafted to fit seamlessly into your lifestyle." },
            { title: "Premium Quality", description: "Materials that look good and last longer." },
            { title: "Risk-Free Trial", description: "Love it or your money back. 30-day guarantee." }
        ],
        ctaButtons: [
            { text: "Shop The Collection", style: "primary", action: "add-to-cart" },
            { text: "See It In Action", style: "secondary", action: "play-video" }
        ],
        colorPalette: ["#EC4899", "#DB2777", "#FFF1F2", "#18181B", "#FBCFE8"],
        layoutStructure: "Hero (Video Background) -> Feature Grid -> User Reviews -> Urgency Banner -> Checkout",
        fontPairing: "Montserrat (Headers) + Open Sans (Body)",
        secondaryVisuals: [
            { type: "detail", label: "Close-up Shot" },
            { type: "lifestyle", label: "In-Context Photo" }
        ],
        strategicAdvice: {
            usage: "Designed for impulse buys and emotional connection.",
            tip: "Ensure your 'Hero' visual shows the product IN USE, not just a studio shot.",
            placement: "Ideal for: Instagram/TikTok Ads, Influencer Traffic."
        }
    },

    // SaaS / Tech
    saas: {
        assetType: "SaaS Growth Platform",
        headline: (ctx) => `The Operating System for ${ctx.industry}`,
        subheadline: (ctx) => ctx.differentiator ? `Unlike others, we ${ctx.differentiator}.` : `Unlock data-driven insights and automate your ${ctx.productName} workflow.`,
        heroImageDescription: (ctx) => `A sleek, dark-mode dashboard interface floating in 3D space.`,
        valueProps: (ctx) => [
            { title: "Automated Workflows", description: "Save 20+ hours per week with intelligent automation." },
            { title: "Real-Time Analytics", description: "Make decisions based on data, not gut feeling." },
            { title: "Seamless Integration", description: "Works correctly with the tools you already use." }
        ],
        ctaButtons: [
            { text: "Start Free Trial", style: "primary", action: "signup" },
            { text: "View API Docs", style: "text-link", action: "docs" }
        ],
        colorPalette: ["#7C3AED", "#5B21B6", "#111827", "#F3F4F6", "#A78BFA"],
        layoutStructure: "Hero -> Interactive Demo -> Feature Toggles -> Pricing Grid -> FAQ",
        fontPairing: "Inter (Headers) + Inter (Body)"
    },

    // Social Media - Instagram (B2C focus)
    social_instagram: {
        assetType: "Instagram Feed Post",
        headline: (ctx) => `POV: You just found ${ctx.productName}`,
        subheadline: (ctx) => `Tag a friend who needs this ${ctx.emotionalBenefit ? ctx.emotionalBenefit : 'in their life'}.`,
        heroImageDescription: (ctx) => `A high-aesthetic, curated lifestyle shot for Instagram.`,
        ctaButtons: [
            { text: "Shop Link in Bio", style: "primary", action: "link-bio" }
        ],
        colorPalette: ["#FF0050", "#000000", "#FFFFFF", "#ADADAD"],
        layoutStructure: "Square Image -> Caption -> Engagement CTA",
        fontPairing: "System Sans (Headers) + System Sans (Body)"
    },

    // Social Media - LinkedIn (B2B focus)
    social_linkedin: {
        assetType: "LinkedIn Thought Leadership",
        headline: (ctx) => `Unpopular Opinion: ${ctx.problemSolved || 'Legacy systems'} are killing your ${ctx.industry} growth.`,
        subheadline: (ctx) => `Here is how ${ctx.productName} is changing the game for ${ctx.targetAudience}.`,
        heroImageDescription: (ctx) => `A professional, data-driven infographic or authority headshot.`,
        ctaButtons: [
            { text: "Register for Webinar", style: "primary", action: "register" }
        ],
        colorPalette: ["#0077B5", "#004182", "#FFFFFF", "#CFEDFB"],
        layoutStructure: "Value Hook -> Body Text -> Visual Asset -> Resource CTA",
        fontPairing: "Segoe UI (Headers) + Open Sans (Body)"
    },

    // Email Header
    email_header: {
        assetType: "Email Marketing Header",
        headline: (ctx) => `Exclusive: Your ${ctx.industry} Strategy Inside`,
        subheadline: (ctx) => `A quick update from the ${ctx.productName} team.`,
        heroImageDescription: (ctx) => `A wide, horizontal banner with clean typography.`,
        ctaButtons: [
            { text: "Read The Story", style: "primary", action: "read-more" }
        ],
        colorPalette: ["#1F2937", "#4B5563", "#F9FAFB", "#2563EB"],
        layoutStructure: "Logo -> Banner headline -> Hero Image -> Body Link",
        fontPairing: "Helvetica (Headers) + Georgia (Body)"
    }
};

/**
 * Selects and populates a template based on context
 */
export const getTemplate = (context, forcedKey = null) => {
    // Determine the best template key
    let key = forcedKey || 'default';
    if (!forcedKey) {
        const industry = context.industry?.toLowerCase() || '';
        const type = context.prospectType?.toLowerCase() || '';

        if (industry.includes('tech') || industry.includes('saas') || industry.includes('software')) {
            key = 'saas';
        } else if (type === 'b2b' || industry.includes('consulting') || industry.includes('agency')) {
            key = 'b2b_service';
        } else if (type === 'b2c' || industry.includes('fashion') || industry.includes('health')) {
            key = 'b2c_product';
        }
    }

    const templateRaw = ASSET_TEMPLATES[key];

    // Execute dynamic functions
    const resolve = (val) => typeof val === 'function' ? val(context) : val;

    const template = {
        ...templateRaw,
        templateKey: key,
        headline: resolve(templateRaw.headline),
        subheadline: resolve(templateRaw.subheadline),
        heroImageDescription: resolve(templateRaw.heroImageDescription),
        valueProps: resolve(templateRaw.valueProps),
        // Color palette override if provided by brand context
        colorPalette: (context.brandColors && context.brandColors.length > 0) ? context.brandColors : templateRaw.colorPalette,
        // Visuals enrichment for multi-image support
        visuals: {
            main: context.uploadedImage || '',
            all: context.uploadedImages || (context.uploadedImage ? [context.uploadedImage] : []),
            secondary: (context.uploadedImages && context.uploadedImages.length > 1) ? context.uploadedImages.slice(1) : []
        }
    };

    return template;
};

/**
 * Returns a batch of related assets for different channels
 */
export const getAssetBatch = (context) => {
    // 1. Primary Asset (Landing Page)
    const landingPage = getTemplate(context);

    // 2. Social Asset (Context-aware)
    const isB2C = context.prospectType === 'B2C' || landingPage.templateKey === 'b2c_product';
    const socialKey = isB2C ? 'social_instagram' : 'social_linkedin';
    const socialPost = getTemplate(context, socialKey);

    // 3. Email Asset
    const emailHeader = getTemplate(context, 'email_header');

    return {
        landingPage,
        socialPost,
        emailHeader
    };
};
