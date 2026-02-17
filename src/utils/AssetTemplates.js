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
            { text: "Get Started Now", style: "primary", action: "scroll-to-pricing", link: "#" },
            { text: "View Demo", style: "secondary", action: "open-modal", link: "#" }
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
            { text: "Book Your Strategy Call", style: "primary", action: "calendly-embed", link: "#" },
            { text: "Read Case Studies", style: "outline", action: "scroll-to-proof", link: "#" }
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
            { text: "Shop The Collection", style: "primary", action: "add-to-cart", link: "#" },
            { text: "See It In Action", style: "secondary", action: "play-video", link: "#" }
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
            { text: "Start Free Trial", style: "primary", action: "signup", link: "#" },
            { text: "View API Docs", style: "text-link", action: "docs", link: "#" }
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
        caption: (ctx) => `Run, don't walk 🏃‍♀️💨 ${ctx.productName} is finally here to change the way you ${ctx.industry}. \n\n✨ Why we love it:\n• ${ctx.uvp || 'Unmatched quality'}\n• ${ctx.emotionalBenefit || 'Pure joy'}\n• 100% Worth the hype\n\nDrop a comment if you're ready to upgrade your routine! 👇`,
        hashtags: (ctx) => `#${ctx.productName.replace(/\s/g, '')} #${ctx.industry.replace(/\s/g, '')} #MustHave #Trending #LifeHack`,
        heroImageDescription: (ctx) => `A high-aesthetic, curated lifestyle shot for Instagram.`,
        ctaButtons: [
            { text: "Shop Link in Bio", style: "primary", action: "link-bio", link: "#" }
        ],
        colorPalette: ["#FF0050", "#000000", "#FFFFFF", "#ADADAD"],
        layoutStructure: "Square Image -> Caption -> Engagement CTA",
        fontPairing: "System Sans (Headers) + System Sans (Body)",
        platformFormat: { width: 1080, height: 1080, aspectRatio: "1:1", label: "Instagram Feed" },
        strategicAdvice: {
            usage: "Ideal for visually-driven product showcases and lifestyle branding.",
            tip: "Use carousel posts (swipe) for 3-5x more engagement than single images.",
            placement: "Instagram Feed, Explore Page, Reels Cover"
        }
    },

    // Social Media - Facebook
    social_facebook: {
        assetType: "Facebook Engagement Post",
        headline: (ctx) => `${ctx.productName} is changing the game for ${ctx.targetAudience}`,
        subheadline: (ctx) => ctx.uvp || `Discover how ${ctx.productName} can transform your approach to ${ctx.industry}.`,
        caption: (ctx) => `Are you tired of struggling with ${ctx.problemSolved || 'outdated methods'}? 🤔\n\nWe hear you. That's why we built ${ctx.productName} — the ${ctx.industry} solution designed for ${ctx.targetAudience}.\n\n✅ ${ctx.uvp || 'Better results, faste'}\n✅ Trusted by experts\n\nClick below to learn more! 👇`,
        hashtags: (ctx) => `#${ctx.productName.replace(/\s/g, '')} #${ctx.industry} #Community`,
        heroImageDescription: (ctx) => `A bold, scroll-stopping image optimized for Facebook's feed algorithm.`,
        ctaButtons: [
            { text: "Learn More", style: "primary", action: "link-click", link: "#" },
            { text: "Share With Friends", style: "secondary", action: "share", link: "#" }
        ],
        colorPalette: ["#1877F2", "#42b72a", "#FFFFFF", "#F0F2F5", "#1C1E21"],
        layoutStructure: "Attention Hook -> Visual Asset -> Value Statement -> Share CTA",
        fontPairing: "Helvetica Neue (Headers) + Roboto (Body)",
        platformFormat: { width: 1080, height: 1350, aspectRatio: "4:5", label: "Facebook Post" },
        strategicAdvice: {
            usage: "Best for community building, shares, and comment-driven engagement.",
            tip: "Posts with questions get 100% more comments. End your caption with a question.",
            placement: "Facebook Feed, Groups, Boosted Posts"
        }
    },

    // Social Media - TikTok
    social_tiktok: {
        assetType: "TikTok Vertical Video Cover",
        headline: (ctx) => `Wait till you see what ${ctx.productName} does 🤯`,
        subheadline: (ctx) => ctx.emotionalBenefit ? `This is your sign to ${ctx.emotionalBenefit}.` : `Your ${ctx.industry} glow-up starts here.`,
        caption: (ctx) => `This is your sign to try ${ctx.productName}! ✨ ${ctx.uvp} #fyp`,
        hashtags: (ctx) => `#${ctx.productName.replace(/\s/g, '')} #${ctx.industry.replace(/\s/g, '')} #TikTokMadeMeBuyIt #Viral`,
        heroImageDescription: (ctx) => `A vertical, high-energy cover frame with bold text overlay and trending aesthetic.`,
        ctaButtons: [
            { text: "Watch Now", style: "primary", action: "play-video", link: "#" },
            { text: "Follow for More", style: "secondary", action: "follow", link: "#" }
        ],
        colorPalette: ["#FE2C55", "#25F4EE", "#000000", "#FFFFFF", "#161823"],
        layoutStructure: "Hook (0-3s) -> Value Drop -> Reveal -> CTA Overlay",
        fontPairing: "Proxima Nova Bold (Headers) + System Sans (Body)",
        platformFormat: { width: 1080, height: 1920, aspectRatio: "9:16", label: "TikTok / Reels" },
        strategicAdvice: {
            usage: "Designed for virality. Hook viewers in the first 1 second.",
            tip: "Use trending audio + text overlays for 5x the reach. Front-load the hook.",
            placement: "TikTok For You Page, Instagram Reels, YouTube Shorts"
        }
    },

    // Social Media - LinkedIn (B2B focus)
    social_linkedin: {
        assetType: "LinkedIn Thought Leadership",
        headline: (ctx) => `Unpopular Opinion: ${ctx.problemSolved || 'Legacy systems'} are killing your ${ctx.industry} growth.`,
        subheadline: (ctx) => `Here is how ${ctx.productName} is changing the game for ${ctx.targetAudience}.`,
        caption: (ctx) => `Let's talk about ${ctx.problemSolved || 'efficiency'}.\n\nIn the ${ctx.industry} world, we often settle for "good enough." But is it really?\n\n${ctx.productName} helps ${ctx.targetAudience} achieve:\n🚀 ${ctx.uvp || 'Scalable growth'}\n💡 Data-driven insights\n\nRead the full case study below. 👇`,
        hashtags: (ctx) => `#${ctx.productName.replace(/\s/g, '')} #${ctx.industry.replace(/\s/g, '')} #Leadership #Innovation`,
        heroImageDescription: (ctx) => `A professional, data-driven infographic or authority headshot.`,
        ctaButtons: [
            { text: "Register for Webinar", style: "primary", action: "register", link: "#" }
        ],
        colorPalette: ["#0077B5", "#004182", "#FFFFFF", "#CFEDFB", "#F3F2EF"],
        layoutStructure: "Value Hook -> Body Text -> Visual Asset -> Resource CTA",
        fontPairing: "Segoe UI (Headers) + Open Sans (Body)",
        platformFormat: { width: 1200, height: 627, aspectRatio: "1.91:1", label: "LinkedIn Post" },
        strategicAdvice: {
            usage: "Best for B2B authority building and thought leadership positioning.",
            tip: "LinkedIn rewards long-form text posts. Pair a strong visual with a 150+ word caption.",
            placement: "LinkedIn Feed, LinkedIn Articles, Company Page"
        }
    },

    // Social Cover - Facebook
    cover_facebook: {
        assetType: "Facebook Cover Photo",
        headline: (ctx) => `${ctx.productName} — ${ctx.uvp || `Empowering ${ctx.targetAudience}`}`,
        subheadline: (ctx) => `Your ${ctx.industry} partner for growth and innovation.`,
        heroImageDescription: (ctx) => `A wide, panoramic brand banner with centered text and clean branding.`,
        ctaButtons: [
            { text: "Learn More", style: "primary", action: "about-page", link: "#" }
        ],
        colorPalette: ["#1877F2", "#ffffff", "#F0F2F5", "#1C1E21"],
        layoutStructure: "Brand Logo (left) -> Tagline (center) -> CTA (right)",
        fontPairing: "Poppins (Headers) + Open Sans (Body)",
        platformFormat: { width: 820, height: 312, aspectRatio: "2.63:1", label: "Facebook Cover" },
        strategicAdvice: {
            usage: "First impression visitors see on your Facebook Page. Make it count.",
            tip: "Keep text in the safe zone (center 60%). Mobile crops sides heavily.",
            placement: "Facebook Business Page, Personal Profile"
        }
    },

    // Social Cover - YouTube
    cover_youtube: {
        assetType: "YouTube Channel Banner",
        headline: (ctx) => `${ctx.productName} | ${ctx.industry} Insights & Strategy`,
        subheadline: (ctx) => `New videos every week helping ${ctx.targetAudience} succeed.`,
        heroImageDescription: (ctx) => `A cinematic, wide-format channel art with brand colors and upload schedule.`,
        ctaButtons: [
            { text: "Subscribe", style: "primary", action: "subscribe", link: "#" },
            { text: "Watch Latest", style: "secondary", action: "latest-video", link: "#" }
        ],
        colorPalette: ["#FF0000", "#282828", "#FFFFFF", "#AAAAAA", "#0D0D0D"],
        layoutStructure: "Brand Identity (center) -> Schedule/CTA (right) -> Social Links (bottom)",
        fontPairing: "Roboto (Headers) + Roboto (Body)",
        platformFormat: { width: 2560, height: 1440, aspectRatio: "16:9", label: "YouTube Banner" },

        strategicAdvice: {
            usage: "Your YouTube storefront. Essential for channel authority and subscriber conversion.",
            tip: "Design for the safe area (1546×423px center). Text outside this gets cropped on mobile/TV.",
            placement: "YouTube Channel Page, YouTube TV Display"
        }
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
        caption: resolve(templateRaw.caption),
        hashtags: resolve(templateRaw.hashtags),
        heroImageDescription: resolve(templateRaw.heroImageDescription),
        valueProps: resolve(templateRaw.valueProps),
        // Color palette override if provided by brand context
        colorPalette: (context.brandColors && context.brandColors.length > 0) ? context.brandColors : templateRaw.colorPalette,
        // Brand Identity
        brandName: context.productName,
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

    // 2. Social Posts — all 4 platforms
    const socialPosts = {
        instagram: getTemplate(context, 'social_instagram'),
        facebook: getTemplate(context, 'social_facebook'),
        tiktok: getTemplate(context, 'social_tiktok'),
        linkedin: getTemplate(context, 'social_linkedin')
    };

    // 3. Social Covers
    const socialCover = {
        facebook: getTemplate(context, 'cover_facebook'),
        youtube: getTemplate(context, 'cover_youtube')
    };

    return {
        landingPage,
        socialPosts,
        socialCover
    };
};
