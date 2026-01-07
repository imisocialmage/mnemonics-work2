// Node definitions and positions
export const COMPASS_NODES = {
    1: { id: 'conversion', label: 'Conversion', position: 1 },
    2: { id: 'retention', label: 'Retention', position: 2 },
    3: { id: 'how', label: 'How?', position: 3 },
    4: { id: 'calltoact', label: 'Call to act', position: 4 },
    5: { id: 'intentions', label: 'Intentions', position: 5 },
    6: { id: 'interest', label: 'Interest', position: 6 },
    7: { id: 'what', label: 'What?', position: 7 },
    8: { id: 'acquisition', label: 'Acquisition', position: 8 },
};

export const OBJECTIVES = {
    acquisition: { id: 'acquisition', label: 'Acquisition - Attract New Customers', targetPosition: 8 },
    conversion: { id: 'conversion', label: 'Conversion - Turn Leads into Customers', targetPosition: 1 },
    retention: { id: 'retention', label: 'Retention - Keep Existing Customers', targetPosition: 2 },
};

// Logic to determine highlighted nodes based on apex position
export const getHighlightedPositions = (apexPosition) => {
    // Logic from original: base1 is +3 positions, base2 is +5 positions
    const base1 = ((apexPosition - 1 + 3) % 8) + 1;
    const base2 = ((apexPosition - 1 + 5) % 8) + 1;
    return [apexPosition, base1, base2];
};

export const STRATEGIC_ADVICE = {
    acquisition: {
        title: 'Acquisition Strategy Insight',
        highlight: 'Your acquisition strategy starts with a clear statement of value, benefits, and confidence.',
        focusAreas: [
            { name: 'HOW?', desc: 'Define your methodology and delivery approach.' },
            { name: 'INTENTIONS', desc: 'Clarify your brand purpose and mission.' },
            { name: 'ACQUISITION', desc: 'Build awareness through multiple channels.' }
        ],
        corePhilosophy: "The IMI Marketing Compass is built on the principle that the psychology of a valued relationship will always win over the psychology of hard sales. Your marketing strategy should center around understanding WHO you serve and building genuine connections through conversation, not coercion.",
        tips: [
            "Optimize your website for search engines with targeted keywords relevant to your audience",
            "Create valuable content that addresses your audience's pain points and questions",
            "Leverage social proof through customer testimonials and case studies",
            "Engage actively on social media platforms where your target audience spends time",
            "Use lead magnets (free resources, guides, webinars) to capture contact information",
            "Implement retargeting campaigns to reach visitors who didn't convert initially",
            "Collaborate with influencers or partners in your niche for expanded reach",
            "Optimize your landing pages for conversion with clear value propositions",
            "Use video content to increase engagement and explain complex offerings",
            "Test different messaging and channels to find what resonates with your audience"
        ],
        sevenDayPlan: [
            { day: "Day 1-2", focus: "Define your Unique Value Proposition (UVP) and target audience personas" },
            { day: "Day 3", focus: "Audit your current digital presence (website, social media, content)" },
            { day: "Day 4-5", focus: "Create or optimize landing pages with clear CTAs" },
            { day: "Day 6", focus: "Develop a content calendar for the launch period" },
            { day: "Day 7", focus: "Set up analytics and tracking tools to measure campaign performance" }
        ],
        thirtyDayCalendar: [
            {
                week: "Week 1 (Days 1-7)",
                theme: "Foundation & Awareness",
                items: [
                    "Launch teaser campaign across social channels",
                    "Publish cornerstone content piece (blog, video, guide)",
                    "Begin daily social media engagement (2-3 posts/day)",
                    "Start email sequence for existing list"
                ]
            },
            {
                week: "Week 2 (Days 8-14)",
                theme: "Engagement & Education",
                items: [
                    "Host webinar or live Q&A session",
                    "Share customer success stories or case studies",
                    "Launch paid advertising campaigns (if budget allows)",
                    "Collaborate with influencer or partner for co-promotion"
                ]
            },
            {
                week: "Week 3 (Days 15-21)",
                theme: "Momentum Building",
                items: [
                    "Release lead magnet (free guide, template, toolkit)",
                    "Run social media contest or giveaway",
                    "Publish user-generated content",
                    "Send personalized outreach to warm leads"
                ]
            },
            {
                week: "Week 4 (Days 22-30)",
                theme: "Conversion Focus",
                items: [
                    "Launch limited-time offer or special promotion",
                    "Increase email frequency with value-driven content",
                    "Retarget website visitors with specific messaging",
                    "Gather testimonials and social proof from new customers"
                ]
            }
        ],
        strategicRecommendations: [
            "Start with a clear understanding of your ideal customer profile (ICP)",
            "Focus on channels where your audience is most active, not every channel",
            "Create content that educates first, sells second",
            "Build an email list from day one - it's your most valuable asset",
            "Test small, measure everything, then scale what works"
        ],
        redFlags: [
            "Targeting everyone instead of a specific niche - dilutes your message",
            "Ignoring SEO and organic search opportunities",
            "Copying competitors without understanding why their tactics work",
            "Launching without a clear call-to-action or conversion path",
            "Neglecting to track and analyze your marketing metrics"
        ],
        implementationTimeline: [
            { period: "Week 1-2", focus: "Strategy setup, audience research, and content planning" },
            { period: "Week 3-4", focus: "Launch initial campaigns and begin execution" },
            { period: "Month 2", focus: "Monitor performance metrics and optimize based on early results" },
            { period: "Month 3+", focus: "Scale successful initiatives and refine approach based on data" }
        ],
        nextSteps: [
            "Deep dive into understanding your audience (WHO) through surveys, interviews, and data analysis",
            "Align your messaging with the highlighted focus areas: Acquisition, How?, Intentions",
            "Create content and campaigns that prioritize conversation over coercion",
            "Set up tracking systems to monitor engagement and conversion metrics",
            "Continuously refine based on feedback, results, and market changes"
        ]
    },
    conversion: {
        title: 'Conversion Strategy Insight',
        highlight: 'Your conversion strategy succeeds through authentic conversation and guiding prospects naturally.',
        focusAreas: [
            { name: 'CONVERSION', desc: 'Turn interest into commitment through trust.' },
            { name: 'CALL TO ACT', desc: 'Create clear, compelling invitations.' },
            { name: 'INTEREST', desc: 'Maintain engagement through valuable content.' }
        ],
        corePhilosophy: "Conversion is not about convincing; it's about connecting. The IMI approach ensures that you provide the right value at the right time, allowing the customer to choose you naturally.",
        tips: [
            "Simplify your conversion funnel to reduce friction",
            "Use social proof strategically near conversion points",
            "Implement live chat for real-time answers",
            "Create urgency with limited-time offers where authentic",
            "Optimize page load speed to prevent drop-offs",
            "Use clear, action-oriented button copy",
            "Offer a risk-free guarantee to build trust",
            "Segment your audience for personalized messaging",
            "Use exit-intent popups to capture abandoning visitors",
            "Follow up consistently with value, not just sales pitches"
        ],
        sevenDayPlan: [
            { day: "Day 1-2", focus: "Audit current conversion funnels and identify drop-off points" },
            { day: "Day 3", focus: "Optimize landing page copy and calls-to-action" },
            { day: "Day 4-5", focus: "Set up or refine email automation sequences" },
            { day: "Day 6", focus: "Implement retargeting pixels and basic campaigns" },
            { day: "Day 7", focus: "Test purchase/signup flow on all devices" }
        ],
        thirtyDayCalendar: [
            { week: "Week 1", theme: "Audit & Optimize", items: ["Fix technical errors", "Improve page speed", "Clarify value props"] },
            { week: "Week 2", theme: "Trust Building", items: ["Add testimonials", "Display security badges", "Publish case studies"] },
            { week: "Week 3", theme: "Engagement", items: ["Start retargeting", "Launch email nurture series", "Interactive content"] },
            { week: "Week 4", theme: "Closing", items: ["Limited time offer", "Personalized outreach", "Review analytics"] }
        ],
        strategicRecommendations: [
            "Treat every click as a person, not a stat",
            "Remove every unnecessary form field",
            "Test one variable at a time (A/B testing)",
            "Match your landing page message to your ad copy",
            "Focus on the benefits, not just features"
        ],
        redFlags: [
            "Over-promising and under-delivering",
            "Cluttered designs that confuse the user",
            "Hidden costs or surprises at checkout",
            "Generic calls-to-action like 'Submit'",
            "Ignoring mobile users"
        ],
        implementationTimeline: [
            { period: "Week 1", focus: "Audit and quick wins" },
            { period: "Week 2-3", focus: "Deep optimization and automation" },
            { period: "Month 2", focus: "Traffic scaling and testing" },
            { period: "Month 3+", focus: "Advanced personalization" }
        ],
        nextSteps: [
            "Review your current conversion rates",
            "Identify the top 3 friction points",
            "Rewrite your primary Call to Action",
            "Set up a heat map tool (like Hotjar)",
            "Schedule a funnel review meeting"
        ]
    },
    retention: {
        title: 'Retention Strategy Insight',
        highlight: 'Your retention strategy thrives on consistent value delivery and relationship building.',
        focusAreas: [
            { name: 'RETENTION', desc: 'Perfect your delivery methods and experience.' },
            { name: 'INTENTIONS', desc: 'Keep customers engaged with fresh content.' },
            { name: 'WHAT?', desc: 'Turn satisfied customers into advocates.' }
        ],
        corePhilosophy: "The sale is just the starting line. IMI believes that retention is the result of continuous care, turning customers into a community that advocates for your brand.",
        tips: [
            "Implement a customer onboarding sequence immediately after purchase",
            "Create a loyalty or rewards program",
            "Send regular, valuable content (not just sales)",
            "Proactively reach out before problems arise",
            "Celebrate customer milestones (birthdays, anniversaries)",
            "Create a community group (FB, Slack, Circle)",
            "Ask for feedback and actually act on it",
            "Surprise and delight with unexpected bonuses",
            "Share user-generated content to build belonging",
            "Offer exclusive access to new products for existing customers"
        ],
        sevenDayPlan: [
            { day: "Day 1-2", focus: "Map out the post-purchase customer journey" },
            { day: "Day 3", focus: "Draft welcome/onboarding email sequence" },
            { day: "Day 4-5", focus: "Set up feedback collection points (surveys)" },
            { day: "Day 6", focus: "Plan loyalty/reward structure" },
            { day: "Day 7", focus: "Launch community engagement initiative" }
        ],
        thirtyDayCalendar: [
            { week: "Week 1", theme: "Onboarding", items: ["Welcome emails", "Usage guides", "Check-in call"] },
            { week: "Week 2", theme: "Value Add", items: ["Exclusive tips", "Webinar invite", "Unexpected bonus"] },
            { week: "Week 3", theme: "Community", items: ["Highlight success stories", "Forum discussion", "Peer connection"] },
            { week: "Week 4", theme: "Advocacy", items: ["Ask for review", "Referral offer", "Case study interview"] }
        ],
        strategicRecommendations: [
            "Focus on 'Time to First Value' (TTFV)",
            "Build a community, not just a customer list",
            "Personalize communication based on usage",
            "Reward advocacy, not just purchases",
            "Turn support tickets into relationship opportunities"
        ],
        redFlags: [
            "Ghosting customers after the sale",
            "Generic, robotic support responses",
            "Changing terms/pricing without notice",
            "Ignoring negative feedback",
            "Treating existing customers worse than new prospects"
        ],
        implementationTimeline: [
            { period: "Week 1", focus: "Onboarding optimization" },
            { period: "Week 2-4", focus: "Engagement campaigns" },
            { period: "Month 2", focus: "Loyalty program launch" },
            { period: "Month 3+", focus: "Advocacy and referral systems" }
        ],
        nextSteps: [
            "Audit your unboxing/onboarding experience",
            "Call 5 recent customers for honest feedback",
            "Draft a re-engagement email for inactive users",
            "Set up a 'Customer Win' slack channel",
            "Review your churn metrics"
        ]
    }
};

export const MARKETING_QUOTES = [
    { quote: "Content is fire. Social media is gasoline.", author: "Jay Baer" },
    { quote: "The aim of marketing is to know and understand the customer so well the product or service fits him and sells itself.", author: "Peter Drucker" },
    { quote: "Marketing is no longer about the stuff that you make, but about the stories you tell.", author: "Seth Godin" },
    { quote: "Don't find customers for your products, find products for your customers.", author: "Seth Godin" }
];

export const getRandomQuote = () => {
    return MARKETING_QUOTES[Math.floor(Math.random() * MARKETING_QUOTES.length)];
};
