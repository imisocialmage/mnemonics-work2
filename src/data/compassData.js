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
        mission: 'Attract high-value prospects through authentic conversion and value demonstration.',
        highlight: 'Your acquisition strategy starts with a clear statement of value, benefits, and confidence in the approach and use of assets.',
        focusAreas: [
            { name: 'ACQUISITION', desc: 'Build awareness through multiple channels that resonate with your ideal audience.' },
            { name: 'HOW?', desc: 'Define your methodology and delivery approach. What makes your process unique and effective?' },
            { name: 'INTENTIONS', desc: "Clarify your brand's purpose and mission. Why do you exist beyond making sales?" }
        ],
        keyActions: "Create content that showcases your value proposition clearly. Demonstrate the benefits of your offering through case studies, testimonials, and authentic storytelling.",
        remember: "Acquisition is about attracting the right people, not just more people. Focus on quality over quantity.",
        corePhilosophy: "The IMI Marketing Compass is built on the principle that the psychology of a valued relationship will always win over the psychology of hard sales.",
        tips: [
            "Optimize your website for search engines with targeted keywords",
            "Create valuable content that addresses audience pain points",
            "Leverage social proof through customer testimonials",
            "Engage actively on social media platforms",
            "Use lead magnets to capture contact information",
            "Run targeted ad campaigns on relevant platforms",
            "Collaborate with influencers in your niche",
            "Optimize your landing pages for conversion",
            "Utilize email marketing to nurture leads",
            "Monitor and analyze your acquisition metrics"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'Identify your top 3 acquisition channels.' },
            { day: 'Day 2', focus: 'Audit your current value proposition.' },
            { day: 'Day 3', focus: 'Create a lead magnet that solves a core problem.' },
            { day: 'Day 4', focus: 'Set up a basic landing page for the lead magnet.' },
            { day: 'Day 5', focus: 'Draft 5 social media posts promoting the offer.' },
            { day: 'Day 6', focus: 'Set up automated email follow-ups.' },
            { day: 'Day 7', focus: 'Launch your first campaign and track results.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'Foundation & Awareness', items: ['Optimize SEO', 'Launch lead magnet', 'Daily social updates'] },
            { week: 'Week 2', theme: 'Engagement & Reach', items: ['Partner outreach', 'Run small-scale ads', 'Publish case study'] },
            { week: 'Week 3', theme: 'Authority & Trust', items: ['Host a live webinar', 'Share client success stories', 'Refine landing page'] },
            { week: 'Week 4', theme: 'Optimization & Scaling', items: ['Analyze conversion data', 'Scale winning ads', 'Plan next month'] }
        ],
        strategicRecommendations: [
            "Focus on one primary acquisition channel before diversifying.",
            "Prioritize building an email list over social media following.",
            "Test multiple versions of your lead magnet headline.",
            "Invest in high-quality visual content to build brand authority.",
            "Regularly update your 'Who' profile to stay aligned with market shifts."
        ],
        redFlags: [
            "Focusing solely on quantity of leads over quality.",
            "Using aggressive or 'clickbaity' headlines that damage trust.",
            "Ignoring data and relying on 'gut feeling' for ad spend.",
            "Neglecting the follow-up process for new leads.",
            "Not having a clear way to measure ROI for each channel."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Select one primary objective and alignment.' },
            { period: 'First 7 Days', focus: 'Build your lead capture foundation.' },
            { period: 'First 30 Days', focus: 'Execute consistent outreach and analyze data.' }
        ],
        nextSteps: ["Deep dive into WHO you serve", "Align messaging with Acq/How/Intentions", "Prioritize conversation over coercion"]
    },
    conversion: {
        title: 'Conversion Strategy Insight',
        mission: 'Guide prospects from curiosity to commitment through trust-based dialogue.',
        highlight: 'Your conversion strategy succeeds through authentic conversation, building interest, and guiding prospects naturally to action.',
        focusAreas: [
            { name: 'CONVERSION', desc: 'Turn interest into commitment through trust-building and value demonstration.' },
            { name: 'CALL TO ACT', desc: 'Create clear, compelling invitations that feel natural, not pushy.' },
            { name: 'INTEREST', desc: 'Maintain engagement through valuable content and authentic relationship building.' }
        ],
        keyActions: "Engage prospects through meaningful conversations that address their specific needs and concerns. Show genuine interest in their success.",
        remember: "Conversion happens through conversation, not coercion. Build relationships first, transactions follow.",
        corePhilosophy: "The psychology of a valued relationship wins over hard sales every time.",
        tips: [
            "Simplify your conversion funnel",
            "Use social proof near conversion points",
            "Implement live chat for real-time answers",
            "Create authentic urgency",
            "Optimize page load speed",
            "Use clear and compelling CTAs",
            "Offer a low-risk trial or demo",
            "Personalize your follow-up messages",
            "Address objections proactively in your copy",
            "Ensure a seamless mobile checkout experience"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'Map out your current sales funnel.' },
            { day: 'Day 2', focus: 'Identify the biggest drop-off point.' },
            { day: 'Day 3', focus: 'Rewrite your primary Call to Action.' },
            { day: 'Day 4', focus: 'Add a testimonial next to your signup form.' },
            { day: 'Day 5', focus: 'Draft a three-part follow-up email sequence.' },
            { day: 'Day 6', focus: 'Simplify your checkout or signup page.' },
            { day: 'Day 7', focus: 'Conduct a walkthrough of your own process.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'Funnel Optimization', items: ['A/B test headlines', 'Remove unnecessary fields', 'Speed test'] },
            { week: 'Week 2', theme: 'Trust Building', items: ['Add case studies', 'Update FAQ section', 'Set up live chat'] },
            { week: 'Week 3', theme: 'Incentive & Scarcity', items: ['Launch limited offer', 'Highlight unique benefits', 'Email nurture'] },
            { week: 'Week 4', theme: 'Final Conversion Push', items: ['Retargeting ads', 'Personal outreach', 'Review conversion rates'] }
        ],
        strategicRecommendations: [
            "Use 'Soft Asks' to gauge interest before the 'Major Ask'.",
            "Personalize landing pages for different traffic sources.",
            "Include a video explanation on your high-conversion pages.",
            "Make your return/refund policy prominent to reduce friction.",
            "Ensure your branding is consistent from ad to checkout."
        ],
        redFlags: [
            "Having too many distracting links on a landing page.",
            "Asking for too much information too early in the relationship.",
            "Using generic, non-descriptive button text like 'Submit'.",
            "Slow response times to prospect inquiries.",
            "Lack of clear 'Next Steps' after a conversion occurs."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Update your primary CTA button text.' },
            { period: 'First 7 Days', focus: 'Optimize your highest-traffic landing page.' },
            { period: 'First 30 Days', focus: 'Refine your email automation sequence.' }
        ],
        nextSteps: ["Review current conversion rates", "Identify top friction points", "Rewrite primary Call to Action"]
    },
    retention: {
        title: 'Retention Strategy Insight',
        mission: 'Turn satisfied customers into loyal advocates and lifetime partners.',
        highlight: 'Your retention strategy thrives on consistent value delivery, relationship building, and turning customers into advocates.',
        focusAreas: [
            { name: 'RETENTION', desc: 'Perfect your delivery methods and experience to exceed customer expectations.' },
            { name: 'INTENTIONS', desc: 'Keep customers engaged by continuously aligning your brand purpose with their evolving needs.' },
            { name: 'WHAT?', desc: 'Clearly define the ongoing value you provide, turning satisfied customers into vocal advocates.' }
        ],
        keyActions: "Proactively reach out to customers before problems arise. Celebrate their milestones and show appreciation.",
        remember: "The sale is not the end of the journey, but the beginning of a relationship.",
        corePhilosophy: "A happy customer is the most powerful marketing engine your business can have.",
        tips: [
            "Implement customer onboarding",
            "Create a loyalty program",
            "Send regular valuable content",
            "Proactive outreach",
            "Celebrate customer milestones",
            "Ask for feedback regularly",
            "Provide exceptional support",
            "Surprise and delight with extras",
            "Create a community for your users",
            "Personalize the post-purchase experience"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'List your top 20% of customers.' },
            { day: 'Day 2', focus: 'Audit your post-purchase welcome sequence.' },
            { day: 'Day 3', focus: 'Reach out to 5 customers for a quick feedback chat.' },
            { day: 'Day 4', focus: 'Create a "surprise and delight" gift or discount.' },
            { day: 'Day 5', focus: 'Draft a monthly newsletter template.' },
            { day: 'Day 6', focus: 'Review your customer support response times.' },
            { day: 'Day 7', focus: 'Set up an automated milestone celebration.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'The Welcome Experience', items: ['Optimize onboarding', 'Send welcome gifts', 'Verify delivery'] },
            { week: 'Week 2', theme: 'Ongoing Value', items: ['Educational content', 'Check-in calls', 'User feedback survey'] },
            { week: 'Week 3', theme: 'Community & Connection', items: ['Founder update', 'User of the month spotlight', 'Exclusive Q&A'] },
            { week: 'Week 4', theme: 'Loyalty & Advocacy', items: ['Launch referral program', 'Renewals focus', 'Analyze churn data'] }
        ],
        strategicRecommendations: [
            "Address churn before it happens by tracking usage metrics.",
            "Involve your customers in the development of new features.",
            "Respond to all feedback—good or bad—within 24 hours.",
            "Highlight customer success stories in your public marketing.",
            "Offer 'loyalty-only' benefits that aren't available to new leads."
        ],
        redFlags: [
            "Communicating only when it's time for a renewal or upsell.",
            "Ignoring negative feedback or dismissing customer complaints.",
            "Having a slow or difficult cancellation process.",
            "Failure to keep the product/service updated and relevant.",
            "Lack of personal touch in customer communications."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Send a personal thank-you note to one customer.' },
            { period: 'First 7 Days', focus: 'Audit and improve your welcome email.' },
            { period: 'First 30 Days', focus: 'Establish a consistent customer check-in rhythm.' }
        ],
        nextSteps: ["Audit unboxing experience", "Call 5 recent customers", "Draft re-engagement emails"]
    },
    how: {
        title: 'Methodology & Delivery Insight',
        mission: 'Demonstrate superior results through a unique and scalable delivery process.',
        highlight: 'Your methodology is the bridge between a prospect’s current challenge and their desired results.',
        focusAreas: [
            { name: 'HOW?', desc: 'Define the unique process or system you use to deliver results.' },
            { name: 'INTEREST', desc: 'Hook your audience by showing them a better way to achieve their goals.' },
            { name: 'ACQUISITION', desc: 'Use your unique methodology as a primary differentiator in your outreach.' }
        ],
        keyActions: "Document your core process and visualize it for your customers. Explain the 'why' behind your 'how'.",
        remember: "People don't just buy what you do; they buy how you do it better than anyone else.",
        corePhilosophy: "Clarity in process builds confidence in results.",
        tips: [
            "Visualize your process with a diagram",
            "Give your methodology a unique name",
            "Focus on efficiency and speed",
            "Showcase the 'secret sauce'",
            "Use 'behind the scenes' content",
            "Explain phase-by-phase delivery",
            "Standardize your results",
            "Use proprietary tools or frameworks",
            "Educate them on why your way is better",
            "Show the transformation path"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'Draft the 5 steps of your unique process.' },
            { day: 'Day 2', focus: 'Define the "Secret Sauce" of your methodology.' },
            { day: 'Day 3', focus: 'Sketch a simple visual map of your process.' },
            { day: 'Day 4', focus: 'Create a video walkthrough of one core step.' },
            { day: 'Day 5', focus: 'Gather 3 case studies that follow the method.' },
            { day: 'Day 6', focus: 'Audit your delivery for bottlenecks.' },
            { day: 'Day 7', focus: 'Name your framework (e.g., The IMI System).' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'Framework Definition', items: ['Finalize visual asset', 'Name the system', 'Internal training'] },
            { week: 'Week 2', theme: 'Public Education', items: ['Blog series on method', 'Video demo', 'Social hooks'] },
            { week: 'Week 3', theme: 'Evidence & Proof', items: ['Publish case studies', 'Gather video testimonials', 'Comparison guide'] },
            { week: 'Week 4', theme: 'Scaling the System', items: ['Automate steps', 'Client onboarding sync', 'Refine efficiency'] }
        ],
        strategicRecommendations: [
            "Own the 'Category of One' by naming your process.",
            "Use your methodology to disqualify the wrong prospects.",
            "Focus on the 'Output' rather than just the 'Input'.",
            "Keep the visual simple—if they can't draw it, they won't remember it.",
            "Consistently show the gap between the 'Old Way' and 'Your Way'."
        ],
        redFlags: [
            "Making your process sound overly complex or academic.",
            "Failure to explain the results each step produces.",
            "Changing the process for every single client (unscalable).",
            "Focusing on the 'Features' rather than the 'Mechanism'.",
            "Lacking a visual representation of the journey."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Define the 3 major pillars of your work.' },
            { period: 'First 7 Days', focus: 'Create a visual "Method Map".' },
            { period: 'First 30 Days', focus: 'Integrate the method into all sales conversations.' }
        ],
        nextSteps: ["Map out your service delivery flow", "Identify your unique 'X-Factor'", "Create a visual representation of your method"]
    },
    calltoact: {
        title: 'Invitation & Offer Insight',
        mission: 'Create frictionless transitions from curiosity to active commitment.',
        highlight: 'A great Call to Action is not a demand; it is a compelling invitation to the next level of value.',
        focusAreas: [
            { name: 'CALL TO ACT', desc: 'Design your invitations to be the natural next step in the conversation.' },
            { name: 'WHAT?', desc: 'Clearly articulate the specific value they will receive by taking action.' },
            { name: 'CONVERSION', desc: 'Optimize the path from invitation to commitment by removing all friction.' }
        ],
        keyActions: "Test different invitation styles (direct vs. soft). Ensure the value is clear and friction is low.",
        remember: "Clarity beats cleverness every time. Tell them exactly what to do and why it matters.",
        corePhilosophy: "The invitation is the bridge to the solution.",
        tips: [
            "Use action-oriented verbs",
            "Highlight the immediate benefit",
            "Keep it short and punchy",
            "Use contrasting colors for buttons",
            "Include a 'risk-reversal' (guarantee)",
            "Create urgency or scarcity",
            "Minimize the number of steps",
            "Use first-person language ('Get My Copy')",
            "Add a secondary 'Soft' CTA",
            "Test placement on the page"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'Audit every CTA on your website.' },
            { day: 'Day 2', focus: 'Rewrite 3 primary headlines for CTAs.' },
            { day: 'Day 3', focus: 'Add a "Direct Ask" to your latest blog post.' },
            { day: 'Day 4', focus: 'Test a new button color.' },
            { day: 'Day 5', focus: 'Draft a "Soft Invite" for your email footer.' },
            { day: 'Day 6', focus: 'Remove one field from your contact form.' },
            { day: 'Day 7', focus: 'Survey 5 people on CTA clarity.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'Clarity & Friction', items: ['Shorten forms', 'Fix broken links', 'Clear headlines'] },
            { week: 'Week 2', theme: 'Visual Command', items: ['Optimize button design', 'High-contrast colors', 'Mobile fixing'] },
            { week: 'Week 3', theme: 'Psychological Pull', items: ['Add urgency tags', 'Test fear vs. gain', 'Social proof tags'] },
            { week: 'Week 4', theme: 'Multi-Channel Push', items: ['CTAs in bio', 'Email signatures', 'New offer launch'] }
        ],
        strategicRecommendations: [
            "Match the intensity of the CTA to the value of the content.",
            "Always include a 'Primary' and a 'Secondary' option.",
            "Use whitespace around buttons to increase focus.",
            "State the price (if low) or the time required (if significant).",
            "Automate the 'Thank You' redirect to a value-add page."
        ],
        redFlags: [
            "Using multiple primary CTAs that compete for attention.",
            "CTAs that are 'hidden' below the fold of a page.",
            "Vague language like 'Learn More' or 'Click Here'.",
            "Forms that require a phone number (unless necessary).",
            "Asking for a sale before providing any education/value."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Change one "Learn More" to a specific benefit.' },
            { period: 'First 7 Days', focus: 'Perform a 5-second clarity test on your site.' },
            { period: 'First 30 Days', focus: 'A/B test two different offer types.' }
        ],
        nextSteps: ["Audit all current website CTAs", "Test one 'Soft Ask' vs. one 'Direct Ask'", "Simplify the signup/checkout flow"]
    },
    intentions: {
        title: 'Brand Purpose & Mission Insight',
        mission: 'Anchor your marketing in a "Why" that resonates emotionally with your tribe.',
        highlight: 'Your intentions define the soul of your business and create logical and emotional resonance.',
        focusAreas: [
            { name: 'INTENTIONS', desc: 'Clearly state the "Why" behind your brand. Why do you do what you do?' },
            { name: 'ACQUISITION', desc: 'Attract people who share your values and believe in your mission.' },
            { name: 'RETENTION', desc: 'Keep your community connected through a shared sense of purpose and direction.' }
        ],
        keyActions: "Communicate your brand values consistently across all touchpoints. Share your origin story.",
        remember: "Profit is the result of a mission well-executed, not the mission itself.",
        corePhilosophy: "Marketing is about finding the ones who believe what you believe.",
        tips: [
            "Write a manifesto",
            "Share your founder story",
            "Be transparent about your business",
            "Show your 'behind the scenes'",
            "Highlight charity or impacts",
            "Use authentic, unpolished video",
            "Define your brand's 'Enemies'",
            "Speak your truth boldly",
            "Build a community around a cause",
            "Align all hires with your values"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'Write down your "Origin Story" (500 words).' },
            { day: 'Day 2', focus: 'Identify 3 core values you will never break.' },
            { day: 'Day 3', focus: 'Audit your homepage for "Heart" vs. "Hype".' },
            { day: 'Day 4', focus: 'Share a "Why I started this" post on social.' },
            { day: 'Day 5', focus: 'Find one way to give back to your niche.' },
            { day: 'Day 6', focus: 'Interview a long-term client on why they stay.' },
            { day: 'Day 7', focus: 'Draft your brand manifesto.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'Inner Truth', items: ['Draft manifesto', 'Define core values', 'Internal alignment'] },
            { week: 'Week 2', theme: 'Narrative Share', items: ['Origin story video', 'Values blog post', 'Podcast guesting'] },
            { week: 'Week 3', theme: 'Tribe Building', items: ['Community outreach', 'Value-driven newsletter', 'Live Q&A'] },
            { week: 'Week 4', theme: 'Impact Check', items: ['Review impact metrics', 'Update about page', 'Plan charity drive'] }
        ],
        strategicRecommendations: [
            "Lead with your 'Why' in your About Page and LinkedIn Bio.",
            "Use your values to hire team members and fire bad clients.",
            "Be willing to polarize—your mission isn't for everyone.",
            "Connect every product feature back to a core brand intention.",
            "Celebrate the successes of your community more than your own."
        ],
        redFlags: [
            "Corporate-speak that masks your true personality.",
            "Following trends that contradict your stated values.",
            "Prioritizing short-term profit over long-term mission.",
            "Lack of transparency about your processes or pricing.",
            "The brand mission is \"hidden\" and not easily found."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Speak your truth in one social media post.' },
            { period: 'First 7 Days', focus: 'Rewrite your About Page to lead with intention.' },
            { period: 'First 30 Days', focus: 'Establish a "Values First" content pillar.' }
        ],
        nextSteps: ["Write a one-sentence brand mission statement", "Identify 3 core brand values", "Share a 'behind the scenes' story on social media"]
    },
    interest: {
        title: 'Engagement & Curiosity Insight',
        mission: 'Maintain high engagement by consistently delivering discovery and education.',
        highlight: 'Interest is the spark that turns a stranger into a prospect. It is fueled by curiosity.',
        focusAreas: [
            { name: 'INTEREST', desc: 'Create content that stops the scroll and invites deeper investigation.' },
            { name: 'CONVERSION', desc: 'Nurture interest into a desire for the specific results your product provides.' },
            { name: 'HOW?', desc: 'Show them enough of your methodology to pique their curiosity.' }
        ],
        keyActions: "Use 'Open Loops' in your content. Focus on the benefits of the benefits. Answer their questions.",
        remember: "Be more interested in them than you are interesting to them.",
        corePhilosophy: "Curiosity is the fuel of the sales cycle.",
        tips: [
            "Use intriguing headlines",
            "Ask thought-provoking questions",
            "Share surprising statistics",
            "Use 'Open Loops'",
            "Post consistent educational tips",
            "Host interactive polls",
            "Share myth-busting content",
            "Give away 'The What' for free",
            "Nurture with email sequences",
            "Respond to EVERY comment"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'List the top 10 questions your prospects ask.' },
            { day: 'Day 2', focus: 'Identify 3 industry myths you can bust.' },
            { day: 'Day 3', focus: 'Draft an email that tells a curious story.' },
            { day: 'Day 4', focus: 'Create a poll on LinkedIn about a pain point.' },
            { day: 'Day 5', focus: 'Post a "Surprising Fact" in your niche.' },
            { day: 'Day 6', focus: 'Audit your social media for engagement rate.' },
            { day: 'Day 7', focus: 'Set up an automated interest-nurture email.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'Curiosity Spark', items: ['Industry myths', 'Polls & Surveys', 'Surprise facts'] },
            { week: 'Week 2', theme: 'Education & Insight', items: ['How-to guides', 'Daily tips', 'Expert interviews'] },
            { week: 'Week 3', theme: 'Deeper Nurture', items: ['Webinar invite', 'Long-form guide', 'Email storytelling'] },
            { week: 'Week 4', theme: 'Closing the Loop', items: ['Offer soft trials', 'Q&A sessions', 'Engagement review'] }
        ],
        strategicRecommendations: [
            "Nurture is a marathon, not a sprint—be consistent.",
            "Use retargeting ads to keep your brand top-of-mind.",
            "Focus on being 'Useful' rather than 'Salesy'.",
            "Use 'Hooks' in every single piece of content you produce.",
            "Vary your content medium—text, video, image, poll."
        ],
        redFlags: [
            "Boring, clinical content that doesn't spark any emotion.",
            "Posting only when you have something to sell.",
            "Ignoring comments and direct messages from prospects.",
            "Excessive use of automated tools that kill the human feel.",
            "Providing a dead-end with no next step for curious prospects."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Ask a high-engagement question to your list.' },
            { period: 'First 7 Days', focus: 'Launch a 3-part "Interest Series" of content.' },
            { period: 'First 30 Days', focus: 'Refine your engagement-to-lead workflow.' }
        ],
        nextSteps: ["Audit your social media engagement rates", "Create a 'Top 10 Questions' content piece", "Implement a lead nurture email sequence"]
    },
    what: {
        title: 'Core Solution & UVP Insight',
        mission: 'Clarify the tangible transformation your solution brings to the market.',
        highlight: 'The "What" is the tangible result of your brand promise. It must be clear and uniquely yours.',
        focusAreas: [
            { name: 'WHAT?', desc: 'Define your product or service in terms of the specific results it delivers.' },
            { name: 'RETENTION', desc: 'Ensure the "What" continues to deliver value long after the initial purchase.' },
            { name: 'CALL TO ACT', desc: 'Make it easy for people to understand what they are getting when they respond.' }
        ],
        keyActions: "Refine your Unique Value Proposition (UVP) until it is unmistakable. Focus on transformation.",
        remember: "Your product is a bridge from a prospect's problem to their desired result. Keep the bridge strong.",
        corePhilosophy: "People buy the hole, not the drill.",
        tips: [
            "State the outcome first",
            "Use concrete numbers and results",
            "Contrast with the alternative",
            "Highlight one major differentiator",
            "Keep it simple enough for a 5th grader",
            "Use high-quality product imagery",
            "Offer a clear 'Before & After'",
            "List exactly what they get",
            "Provide an iron-clad guarantee",
            "Show the product in action"
        ],
        sevenDayPlan: [
            { day: 'Day 1', focus: 'Write 3 different versions of your UVP.' },
            { day: 'Day 2', focus: 'List the top 5 tangible results your clients get.' },
            { day: 'Day 3', focus: 'Create a "Features vs. Benefits" table.' },
            { day: 'Day 4', focus: 'Gather 3 screenshots or photos of your product.' },
            { day: 'Day 5', focus: 'Draft an "Onlyness" statement (We are the ONLY...).' },
            { day: 'Day 6', focus: 'Audit your homepage for clarity of the offer.' },
            { day: 'Day 7', focus: 'Select the winning UVP for your headline.' }
        ],
        thirtyDayCalendar: [
            { week: 'Week 1', theme: 'UVP Clarity', items: ['Headline update', 'Clarify deliverables', 'A/B test offer'] },
            { week: 'Week 2', theme: 'Visual Proof', items: ['Product demo video', 'Before/After images', 'Unboxing proof'] },
            { week: 'Week 3', theme: 'Competitive Edge', items: ['Comparison chart', 'Differentiator focus', 'Authority blog'] },
            { week: 'Week 4', theme: 'UVP Integration', items: ['Update all bios', 'Sales deck sync', 'Check feedback'] }
        ],
        strategicRecommendations: [
            "Your UVP should focus on the single biggest result you deliver.",
            "Avoid generic promises like 'best quality' or 'low price'.",
            "Test your UVP on someone who knows nothing about your niche.",
            "Make sure your UVP is 'Above the Fold' on your website.",
            "Continuously update your offer based on customer gaps."
        ],
        redFlags: [
            "A UVP that is too long or requires multiple sentences.",
            "Using over-the-top claims that sound impossible to believe.",
            "Focusing on internal company goals rather than customer needs.",
            "Your product/service is indistinguishable from competitors.",
            "Vague descriptions that don't explain what the user actually gets."
        ],
        implementationTimeline: [
            { period: 'First 24 Hours', focus: 'Define your one "Magic Number" (e.g., Save 40%).' },
            { period: 'First 7 Days', focus: 'Record a 60-second product walkthrough.' },
            { period: 'First 30 Days', focus: 'Sync your UVP across all touchpoints.' }
        ],
        nextSteps: ["Audit your UVP for clarity and punch", "Check your competitors' promises", "Survey current users about the #1 benefit they receive"]
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
