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


export const STRATEGIC_ADVICE_FR = {
    acquisition: {
        title: 'Aperçu de la Stratégie d\'Acquisition',
        mission: 'Attirer des prospects de haute valeur par une conversion authentique et une démonstration de valeur.',
        highlight: 'Votre stratégie d\'acquisition commence par un énoncé clair de la valeur, des avantages et de la confiance dans l\'approche et l\'utilisation des atouts.',
        focusAreas: [
            { name: 'ACQUISITION', desc: 'Renforcez la notoriété à travers plusieurs canaux qui résonnent avec votre audience idéale.' },
            { name: 'COMMENT ?', desc: 'Définissez votre méthodologie et votre approche de livraison. Qu\'est-ce qui rend votre processus unique et efficace ?' },
            { name: 'INTENTIONS', desc: "Clarifiez l'objectif et la mission de votre marque. Pourquoi existez-vous au-delà de la vente ?" }
        ],
        keyActions: "Créez du contenu qui présente clairement votre proposition de valeur. Démontrez les avantages de votre offre à travers des études de cas, des témoignages et un récit authentique.",
        remember: "L'acquisition consiste à attirer les bonnes personnes, pas seulement plus de monde. Privilégiez la qualité à la quantité.",
        corePhilosophy: "La boussole marketing IMI repose sur le principe que la psychologie d'une relation valorisée l'emportera toujours sur la psychologie de la vente forcée.",
        tips: [
            "Optimisez votre site web pour les moteurs de recherche avec des mots-clés ciblés",
            "Créez du contenu de valeur qui répond aux points de douleur de votre audience",
            "Exploitez la preuve sociale à travers les témoignages clients",
            "Engagez-vous activement sur les plateformes de médias sociaux",
            "Utilisez des aimants à prospects (lead magnets) pour capturer les coordonnées",
            "Lancez des campagnes publicitaires ciblées sur les plateformes pertinentes",
            "Collaborez avec des influenceurs dans votre créneau",
            "Optimisez vos pages de destination pour la conversion",
            "Utilisez le marketing par courriel pour nourrir les prospects",
            "Surveillez et analysez vos mesures d'acquisition"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Identifiez vos 3 principaux canaux d\'acquisition.' },
            { day: 'Jour 2', focus: 'Auditez votre proposition de valeur actuelle.' },
            { day: 'Jour 3', focus: 'Créez un aimant à prospects qui résout un problème central.' },
            { day: 'Jour 4', focus: 'Créez une page de destination simple pour l\'aimant à prospects.' },
            { day: 'Jour 5', focus: 'Rédigez 5 publications sur les réseaux sociaux pour promouvoir l\'offre.' },
            { day: 'Jour 6', focus: 'Configurez des suivis par courriel automatisés.' },
            { day: 'Jour 7', focus: 'Lancez votre première campagne et suivez les résultats.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Fondation et Notoriété', items: ['Optimisation SEO', 'Lancement de l\'aimant à prospects', 'Mises à jour quotidiennes sur les réseaux sociaux'] },
            { week: 'Semaine 2', theme: 'Engagement et Portée', items: ['Partenariats', 'Publicités à petite échelle', 'Publication d\'étude de cas'] },
            { week: 'Semaine 3', theme: 'Autorité et Confiance', items: ['Animation d\'un webinaire en direct', 'Partage d\'histoires de réussite clients', 'Affinage de la page de destination'] },
            { week: 'Semaine 4', theme: 'Optimisation et Croissance', items: ['Analyse des données de conversion', 'Augmentation des publicités gagnantes', 'Planification du mois prochain'] }
        ],
        strategicRecommendations: [
            "Concentrez-vous sur un canal d'acquisition principal avant de diversifier.",
            "Priorisez la construction d'une liste de diffusion plutôt que les abonnements sur les réseaux sociaux.",
            "Testez plusieurs versions du titre de votre aimant à prospects.",
            "Investissez dans du contenu visuel de haute qualité pour renforcer l'autorité de la marque.",
            "Mettez à jour régulièrement votre profil 'QUI' pour rester aligné sur les évolutions du marché."
        ],
        redFlags: [
            "Se concentrer uniquement sur la quantité de prospects plutôt que sur la qualité.",
            "Utiliser des titres agressifs ou 'putaclic' qui nuisent à la confiance.",
            "Ignorer les données et se fier à son 'intuition' pour les dépenses publicitaires.",
            "Négliger le processus de suivi des nouveaux prospects.",
            "Ne pas avoir de moyen clair de mesurer le retour sur investissement (ROI) pour chaque canal."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Sélectionnez un objectif principal et alignez-vous.' },
            { period: 'Premiers 7 jours', focus: 'Construisez votre fondation de capture de prospects.' },
            { period: 'Premiers 30 jours', focus: 'Exécutez des actions régulières et analysez les données.' }
        ],
        nextSteps: ["Approfondissez QUI vous servez", "Alignez les messages avec Acq/Comment/Intentions", "Priorisez la conversation plutôt que la coercition"]
    },
    conversion: {
        title: 'Aperçu de la Stratégie de Conversion',
        mission: 'Guider les prospects de la curiosité à l\'engagement par un dialogue fondé sur la confiance.',
        highlight: 'Votre stratégie de conversion réussit grâce à une conversation authentique, suscitant l\'intérêt et guidant naturellement les prospects vers l\'action.',
        focusAreas: [
            { name: 'CONVERSION', desc: 'Transformez l\'intérêt en engagement par la construction de la confiance et la démonstration de valeur.' },
            { name: 'APPEL À L\'ACTION', desc: 'Créez des invitations claires et convaincantes qui semblent naturelles, pas insistantes.' },
            { name: 'INTÉRÊT', desc: 'Maintenez l\'engagement par un contenu de valeur et une construction de relation authentique.' }
        ],
        keyActions: "Engagez les prospects par des conversations significatives qui répondent à leurs besoins et préoccupations spécifiques. Montrez un intérêt sincère pour leur réussite.",
        remember: "La conversion se fait par la conversation, pas par la coercition. Établissez d'abord des relations, les transactions suivront.",
        corePhilosophy: "La psychologie d'une relation valorisée gagne sur les ventes forcées à chaque fois.",
        tips: [
            "Simplifiez votre entonnoir de conversion",
            "Utilisez la preuve sociale près des points de conversion",
            "Implémentez un tchat en direct pour des réponses en temps réel",
            "Créez une urgence authentique",
            "Optimisez la vitesse de chargement des pages",
            "Utilisez des appels à l'action clairs et convaincants",
            "Offrez un essai ou une démonstration à faible risque",
            "Personnalisez vos messages de suivi",
            "Répondez aux objections de manière proactive dans vos textes",
            "Assurez une expérience d'achat mobile fluide"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Cartographiez votre entonnoir de vente actuel.' },
            { day: 'Jour 2', focus: 'Identifiez le point de chute le plus important.' },
            { day: 'Jour 3', focus: 'Réécrivez votre appel à l\'action principal.' },
            { day: 'Jour 4', focus: 'Ajoutez un témoignage à côté de votre formulaire d\'inscription.' },
            { day: 'Jour 5', focus: 'Rédigez une séquence de trois courriels de suivi.' },
            { day: 'Jour 6', focus: 'Simplifiez votre page de paiement ou d\'inscription.' },
            { day: 'Jour 7', focus: 'Effectuez un test complet de votre propre processus.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Optimisation de l\'entonnoir', items: ['Tests A/B sur les titres', 'Suppression des champs inutiles', 'Test de vitesse'] },
            { week: 'Semaine 2', theme: 'Construction de la confiance', items: ['Ajout d\'études de cas', 'Mise à jour de la FAQ', 'Mise en place du tchat'] },
            { week: 'Semaine 3', theme: 'Incitations et Rareté', items: ['Lancement d\'une offre limitée', 'Mise en avant des avantages uniques', 'Relance par courriel'] },
            { week: 'Semaine 4', theme: 'Poussée finale de conversion', items: ['Publicités de reciblage', 'Approche personnalisée', 'Examen des taux de conversion'] }
        ],
        strategicRecommendations: [
            "Utilisez des 'Demandes Douces' pour évaluer l'intérêt avant la 'Demande Majeure'.",
            "Personnalisez les pages de destination pour différentes sources de trafic.",
            "Incluez une vidéo explicative sur vos pages à haute conversion.",
            "Rendez votre politique de retour/remboursement visible pour réduire les frictions.",
            "Assurez-vous que votre image de marque est cohérente de la publicité au paiement."
        ],
        redFlags: [
            "Avoir trop de liens distrayants sur une page de destination.",
            "Demander trop d'informations trop tôt dans la relation.",
            "Utiliser un texte de bouton générique comme 'Envoyer'.",
            "Temps de réponse lents aux demandes des prospects.",
            "Manque de 'prochaines étapes' claires après une conversion."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Mettez à jour le texte de votre bouton principal.' },
            { period: 'Premiers 7 jours', focus: 'Optimisez votre page de destination au trafic le plus élevé.' },
            { period: 'Premiers 30 jours', focus: 'Affinez votre séquence d\'automatisation d\'e-mails.' }
        ],
        nextSteps: ["Examinez les taux de conversion actuels", "Identifiez les principaux points de friction", "Réécrivez l'appel à l'action principal"]
    },
    retention: {
        title: 'Aperçu de la Stratégie de Rétention',
        mission: 'Transformer les clients satisfaits en défenseurs loyaux et partenaires à vie.',
        highlight: 'Votre stratégie de rétention prospère grâce à une livraison de valeur constante, à la construction de relations et à la transformation des clients en ambassadeurs.',
        focusAreas: [
            { name: 'RÉTENTION', desc: 'Perfectionnez vos méthodes de livraison et l\'expérience pour dépasser les attentes des clients.' },
            { name: 'INTENTIONS', desc: 'Maintenez l\'engagement des clients en alignant continuellement l\'objectif de votre marque sur leurs besoins évolutifs.' },
            { name: 'QUOI ?', desc: 'Définissez clairement la valeur continue que vous offrez, transformant les clients satisfaits en ambassadeurs actifs.' }
        ],
        keyActions: "Contactez les clients de manière proactive avant que les problèmes ne surviennent. Célébrez leurs étapes importantes et montrez votre appréciation.",
        remember: "La vente n'est pas la fin du voyage, mais le début d'une relation.",
        corePhilosophy: "Un client heureux est le moteur marketing le plus puissant que puisse avoir votre entreprise.",
        tips: [
            "Implémentez l'accueil des clients (onboarding)",
            "Créez un programme de fidélité",
            "Envoyez régulièrement du contenu de valeur",
            "Sensibilisation proactive",
            "Célébrez les étapes clés des clients",
            "Demandez régulièrement des commentaires",
            "Fournissez un support exceptionnel",
            "Surprenez et ravissez avec des extras",
            "Créez une communauté pour vos utilisateurs",
            "Personnalisez l'expérience après-vente"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Listez votre top 20% de clients.' },
            { day: 'Jour 2', focus: 'Auditez votre séquence de bienvenue post-achat.' },
            { day: 'Jour 3', focus: 'Contactez 5 clients pour une discussion rapide sur leurs retours.' },
            { day: 'Jour 4', focus: 'Créez un cadeau ou une remise "surprise et enchantement".' },
            { day: 'Jour 5', focus: 'Rédigez un modèle de newsletter mensuelle.' },
            { day: 'Jour 6', focus: 'Examinez vos temps de réponse au support client.' },
            { day: 'Jour 7', focus: 'Configurez une célébration d\'étape automatisée.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'L\'Expérience de Bienvenue', items: ['Optimisation de l\'accueil', 'Envoi de cadeaux de bienvenue', 'Vérification de la livraison'] },
            { week: 'Semaine 2', theme: 'Valeur Continue', items: ['Contenu éducatif', 'Appels de suivi', 'Sondage de satisfaction'] },
            { week: 'Semaine 3', theme: 'Communauté et Connexion', items: ['Nouvelles du fondateur', 'Mise en avant du client du mois', 'Q&A exclusif'] },
            { week: 'Semaine 4', theme: 'Fidélité et Plaidoyer', items: ['Lancement du programme de parrainage', 'Focus sur les renouvellements', 'Analyse du taux d\'attrition'] }
        ],
        strategicRecommendations: [
            "Répondez à l'attrition avant qu'elle ne survienne en suivant les mesures d'utilisation.",
            "Impliquez vos clients dans le développement de nouvelles fonctionnalités.",
            "Répondez à tous les commentaires, bons ou mauvais, dans les 24 heures.",
            "Mettez en avant les histoires de réussite de vos clients dans votre marketing public.",
            "Offrez des avantages réservés aux clients fidèles qui ne sont pas disponibles pour les nouveaux prospects."
        ],
        redFlags: [
            "Communiquer uniquement lorsqu'il est temps de renouveler ou de monter en gamme.",
            "Ignorer les retours négatifs ou rejeter les plaintes des clients.",
            "Avoir un processus d'annulation lent ou difficile.",
            "Défaut de mise à jour du produit/service pour rester pertinent.",
            "Manque de touche personnelle dans les communications avec les clients."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Envoyez un mot de remerciement personnel à un client.' },
            { period: 'Premiers 7 jours', focus: 'Auditez et améliorez votre courriel de bienvenue.' },
            { period: 'Premiers 30 jours', focus: 'Établissez un rythme constant de suivi client.' }
        ],
        nextSteps: ["Auditez l'expérience de déballage", "Appelez 5 clients récents", "Rédigez des e-mails de réengagement"]
    },
    how: {
        title: 'Aperçu de la Méthodologie et Livraison',
        mission: 'Démontrer des résultats supérieurs grâce à un processus de livraison unique et évolutif.',
        highlight: 'Votre méthodologie est le pont entre le défi actuel d\'un prospect et les résultats souhaités.',
        focusAreas: [
            { name: 'COMMENT ?', desc: 'Définissez le processus ou le système unique que vous utilisez pour livrer des résultats.' },
            { name: 'INTÉRÊT', desc: 'Accrochez votre audience en lui montrant une meilleure façon d\'atteindre ses objectifs.' },
            { name: 'ACQUISITION', desc: 'Utilisez votre méthodologie unique comme principal différenciateur dans votre approche.' }
        ],
        keyActions: "Documentez votre processus de base et visualisez-le pour vos clients. Expliquez le 'pourquoi' derrière votre 'comment'.",
        remember: "Les gens n'achètent pas seulement ce que vous faites ; ils achètent comment vous le faites mieux que quiconque.",
        corePhilosophy: "La clarté du processus renforce la confiance dans les résultats.",
        tips: [
            "Visualisez votre processus avec un diagramme",
            "Donnez à votre méthodologie un nom unique",
            "Concentrez-vous sur l'efficacité et la vitesse",
            "Mettez en avant l'élément secret",
            "Utilisez du contenu 'coulisses'",
            "Expliquez la livraison étape par étape",
            "Standardisez vos résultats",
            "Utilisez des outils ou des frameworks propriétaires",
            "Éduquez-les sur pourquoi votre méthode est meilleure",
            "Montrez le chemin de transformation"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Ébauchez les 5 étapes de votre processus unique.' },
            { day: 'Jour 2', focus: 'Définissez l\'ingrédient secret de votre méthodologie.' },
            { day: 'Jour 3', focus: 'Esquissez une carte visuelle simple de votre processus.' },
            { day: 'Jour 4', focus: 'Créez une vidéo explicative d\'une étape clé.' },
            { day: 'Jour 5', focus: 'Rassemblez 3 études de cas qui suivent la méthode.' },
            { day: 'Jour 6', focus: 'Auditez votre livraison pour les goulots d\'étranglement.' },
            { day: 'Jour 7', focus: 'Nommez votre cadre (ex: Le Système IMI).' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Définition du Cadre', items: ['Finalisation du visuel', 'Nommage du système', 'Formation interne'] },
            { week: 'Semaine 2', theme: 'Éducation Publique', items: ['Série d\'articles sur la méthode', 'Démo vidéo', 'Accroches sociales'] },
            { week: 'Semaine 3', theme: 'Preuves et Témoignages', items: ['Publication d\'études de cas', 'Collecte de témoignages vidéo', 'Guide comparatif'] },
            { week: 'Semaine 4', theme: 'Mise à l\'échelle', items: ['Automatisation des étapes', 'Synchronisation de l\'accueil client', 'Affinage de l\'efficacité'] }
        ],
        strategicRecommendations: [
            "Possédez votre propre catégorie en nommant votre processus.",
            "Utilisez votre méthodologie pour disqualifier les mauvais prospects.",
            "Concentrez-vous sur le 'Rendu' plutôt que sur le 'Travail'.",
            "Gardez le visuel simple — s'ils ne peuvent pas le dessiner, ils ne s'en souviendront pas.",
            "Montrez systématiquement l'écart entre l'ancienne méthode et la vôtre."
        ],
        redFlags: [
            "Rendre votre processus trop complexe ou académique.",
            "Défaut d'expliquer les résultats produits à chaque étape.",
            "Changer de processus pour chaque client (non évolutif).",
            "Se concentrer sur les 'Fonctionnalités' plutôt que sur le 'Mécanisme'.",
            "Manque de représentation visuelle du parcours."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Définissez les 3 piliers majeurs de votre travail.' },
            { period: 'Premiers 7 jours', focus: 'Créez une carte visuelle de la méthode.' },
            { period: 'Premiers 30 jours', focus: 'Intégrez la méthode dans toutes les conversations de vente.' }
        ],
        nextSteps: ["Cartographiez votre flux de livraison de service", "Identifiez votre facteur X unique", "Créez une représentation visuelle de votre méthode"]
    },
    calltoact: {
        title: 'Aperçu de l\'Invitation et de l\'Offre',
        mission: 'Créer des transitions sans friction de la curiosité à l\'engagement actif.',
        highlight: 'Un bon appel à l\'action n\'est pas une demande ; c\'est une invitation convaincante au niveau supérieur de valeur.',
        focusAreas: [
            { name: 'APPEL À L\'ACTION', desc: 'Concevez vos invitations pour qu\'elles soient l\'étape suivante naturelle de la conversation.' },
            { name: 'QUOI ?', desc: 'Articulez clairement la valeur spécifique qu\'ils recevront en agissant.' },
            { name: 'CONVERSION', desc: 'Optimisez le chemin de l\'invitation à l\'engagement en supprimant toute friction.' }
        ],
        keyActions: "Testez différents styles d'invitation (directe vs douce). Assurez-vous que la valeur est claire et que la friction est faible.",
        remember: "La clarté l'emporte sur l'originalité à chaque fois. Dites-leur exactement quoi faire et pourquoi c'est important.",
        corePhilosophy: "L'invitation est le pont vers la solution.",
        tips: [
            "Utilisez des verbes d'action",
            "Mettez en avant le bénéfice immédiat",
            "Gardez-le court et percutant",
            "Utilisez des couleurs contrastées pour les boutons",
            "Incluez une garantie (inversion du risque)",
            "Créez une urgence ou une rareté",
            "Minimisez le nombre d'étapes",
            "Utilisez un langage à la première personne ('Recevoir mon exemplaire')",
            "Ajoutez un appel à l'action secondaire 'doux'",
            "Testez l'emplacement sur la page"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Auditez chaque appel à l\'action sur votre site.' },
            { day: 'Jour 2', focus: 'Réécrivez 3 titres principaux pour vos appels à l\'action.' },
            { day: 'Jour 3', focus: 'Ajoutez une "Demande Directe" à votre dernier article.' },
            { day: 'Jour 4', focus: 'Testez une nouvelle couleur de bouton.' },
            { day: 'Jour 5', focus: 'Rédigez une invitation douce pour votre signature d\'e-mail.' },
            { day: 'Jour 6', focus: 'Supprimez un champ de votre formulaire de contact.' },
            { day: 'Jour 7', focus: 'Sondez 5 personnes sur la clarté de vos appels à l\'action.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Clarté et Friction', items: ['Raccourcissement des formulaires', 'Réparation des liens brisés', 'Titres clairs'] },
            { week: 'Semaine 2', theme: 'Commandement Visuel', items: ['Optimisation du design des boutons', 'Couleurs contrastées', 'Correction mobile'] },
            { week: 'Semaine 3', theme: 'Attraction Psychologique', items: ['Ajout de balises d\'urgence', 'Test peur vs gain', 'Preuve sociale'] },
            { week: 'Semaine 4', theme: 'Multi-canaux', items: ['Appels à l\'action dans la bio', 'Signatures d\'e-mails', 'Lancement d\'une nouvelle offre'] }
        ],
        strategicRecommendations: [
            "Adaptez l'intensité de l'appel à l'action à la valeur du contenu.",
            "Incluez toujours une option principale et une secondaire.",
            "Utilisez l'espace blanc autour des boutons pour augmenter le focus.",
            "Indiquez le prix (si bas) ou le temps requis (si important).",
            "Automatisez la redirection après soumission vers une page de valeur."
        ],
        redFlags: [
            "Utiliser plusieurs appels à l'action principaux qui se font concurrence.",
            "Appels à l'action 'cachés' sous la ligne de flottaison d'une page.",
            "Langage vague comme 'En savoir plus' ou 'Cliquez ici'.",
            "Formulaires demandant un numéro de téléphone sans nécessité.",
            "Demander une vente avant de fournir toute éducation/valeur."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Remplacez un "En savoir plus" par un bénéfice spécifique.' },
            { period: 'Premiers 7 jours', focus: 'Effectuez un test de clarté de 5 secondes sur votre site.' },
            { period: 'Premiers 30 jours', focus: 'Testez deux types d\'offres différents.' }
        ],
        nextSteps: ["Auditez tous les CTAs actuels du site", "Testez une invitation douce vs une demande directe", "Simplifiez le flux d'inscription/paiement"]
    },
    intentions: {
        title: 'Aperçu de l\'Objectif et de la Mission',
        mission: 'Ancrer votre marketing dans un "Pourquoi" qui résonne émotionnellement avec votre tribu.',
        highlight: 'Vos intentions définissent l\'âme de votre entreprise et créent une résonance logique et émotionnelle.',
        focusAreas: [
            { name: 'INTENTIONS', desc: 'Énoncez clairement le "Pourquoi" derrière votre marque. Pourquoi faites-vous ce que vous faites ?' },
            { name: 'ACQUISITION', desc: 'Attirez les personnes qui partagent vos valeurs et croient en votre mission.' },
            { name: 'RÉTENTION', desc: 'Maintenez votre communauté connectée grâce à un sens partagé de l\'objectif et de la direction.' }
        ],
        keyActions: "Communiquez les valeurs de votre marque de manière cohérente sur tous les points de contact. Partagez votre histoire d'origine.",
        remember: "Le profit est le résultat d'une mission bien exécutée, pas la mission elle-même.",
        corePhilosophy: "Le marketing consiste à trouver ceux qui croient ce que vous croyez.",
        tips: [
            "Écrivez un manifeste",
            "Partagez votre histoire de fondateur",
            "Soyez transparent sur votre entreprise",
            "Montrez les coulisses",
            "Mettez en avant les œuvres caritatives",
            "Utilisez des vidéos authentiques, non polies",
            "Définissez les ennemis de votre marque",
            "Dites votre vérité hardiment",
            "Bâtissez une communauté autour d'une cause",
            "Alignez tous les recrutements sur vos valeurs"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Rédigez votre histoire d\'origine (500 mots).' },
            { day: 'Jour 2', focus: 'Identifiez 3 valeurs fondamentales que vous ne briserez jamais.' },
            { day: 'Jour 3', focus: 'Auditez votre page d\'accueil pour l\'authenticité.' },
            { day: 'Jour 4', focus: 'Partagez un post "Pourquoi j\'ai commencé cela" sur les réseaux.' },
            { day: 'Jour 5', focus: 'Trouvez un moyen de redonner à votre communauté.' },
            { day: 'Jour 6', focus: 'Interrogez un client fidèle sur les raisons de sa fidélité.' },
            { day: 'Jour 7', focus: 'Rédigez le manifeste de votre marque.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Vérité Intérieure', items: ['Rédaction du manifeste', 'Définition des valeurs', 'Alignement interne'] },
            { week: 'Semaine 2', theme: 'Partage du Récit', items: ['Vidéo d\'histoire d\'origine', 'Article sur les valeurs', 'Interventions podcast'] },
            { week: 'Semaine 3', theme: 'Construction de la Tribu', items: ['Sensibilisation communautaire', 'Newsletter axée valeurs', 'Q&A en direct'] },
            { week: 'Semaine 4', theme: 'Évaluation de l\'Impact', items: ['Examen des mesures d\'impact', 'Mise à jour de la page à propos', 'Campagne solidaire'] }
        ],
        strategicRecommendations: [
            "Mettez votre 'Pourquoi' en avant dans votre page À propos et votre bio LinkedIn.",
            "Utilisez vos valeurs pour recruter vos collaborateurs et choisir vos clients.",
            "Soyez prêt à polariser — votre mission n'est pas pour tout le monde.",
            "Connectez chaque fonctionnalité de produit à une intention de marque.",
            "Célébrez les succès de votre communauté plus que les vôtres."
        ],
        redFlags: [
            "Le jargon corporatif qui masque votre vraie personnalité.",
            "Suivre des tendances qui contredisent vos valeurs déclarées.",
            "Prioriser le profit à court terme sur la mission à long terme.",
            "Manque de transparence sur vos processus ou vos prix.",
            "La mission de la marque est cachée et difficile à trouver."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Dites votre vérité dans un post sur les réseaux sociaux.' },
            { period: 'Premiers 7 jours', focus: 'Réécrivez votre page À propos pour mener par l\'intention.' },
            { period: 'Premiers 30 jours', focus: 'Établissez un pilier de contenu basé sur les valeurs.' }
        ],
        nextSteps: ["Écrivez une mission de marque en une phrase", "Identifiez 3 valeurs de marque clés", "Partagez une histoire des coulisses sur les réseaux sociaux"]
    },
    interest: {
        title: 'Aperçu de l\'Engagement et de la Curiosité',
        mission: 'Maintenir un haut niveau d\'engagement en livrant systématiquement découverte et éducation.',
        highlight: 'L\'intérêt est l\'étincelle qui transforme un inconnu en prospect. Il est alimenté par la curiosité.',
        focusAreas: [
            { name: 'INTÉRÊT', desc: 'Créez du contenu qui arrête le défilement et invite à une enquête plus approfondie.' },
            { name: 'CONVERSION', desc: 'Nourrissez l\'intérêt pour en faire un désir pour les résultats de votre produit.' },
            { name: 'COMMENT ?', desc: 'Montrez-leur assez de votre méthodologie pour piquer leur curiosité.' }
        ],
        keyActions: "Utilisez des 'Boucles Ouvertes' dans votre contenu. Concentrez-vous sur les avantages des avantages. Répondez à leurs questions.",
        remember: "Soyez plus intéressé par eux que vous n'êtes intéressant pour eux.",
        corePhilosophy: "La curiosité est le carburant du cycle de vente.",
        tips: [
            "Utilisez des titres intriguants",
            "Posez des questions qui font réfléchir",
            "Partagez des statistiques surprenantes",
            "Utilisez des 'Boucles Ouvertes'",
            "Publiez des conseils éducatifs réguliers",
            "Organisez des sondages interactifs",
            "Partagez du contenu qui casse les idées reçues",
            "Donnez le 'Quoi' gratuitement",
            "Nourrissez avec des séquences d'e-mails",
            "Répondez à CHAQUE commentaire"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Listez les 10 questions que vos prospects posent le plus.' },
            { day: 'Jour 2', focus: 'Identifiez 3 mythes de votre industrie à déconstruire.' },
            { day: 'Jour 3', focus: 'Rédigez un e-mail qui raconte une histoire curieuse.' },
            { day: 'Jour 4', focus: 'Créez un sondage sur LinkedIn à propos d\'un point de douleur.' },
            { day: 'Jour 5', focus: 'Postez un fait surprenant dans votre créneau.' },
            { day: 'Jour 6', focus: 'Auditez vos réseaux sociaux pour le taux d\'engagement.' },
            { day: 'Jour 7', focus: 'Configurez un e-mail automatisé de soin des prospects.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Étincelle de Curiosité', items: ['Mythes du secteur', 'Sondages et enquêtes', 'Faits surprenants'] },
            { week: 'Semaine 2', theme: 'Éducation et Vision', items: ['Guides pratiques', 'Conseils quotidiens', 'Interviews d\'experts'] },
            { week: 'Semaine 3', theme: 'Nourrir la Relation', items: ['Invitation webinaire', 'Guide long format', 'Storytelling par courriel'] },
            { week: 'Semaine 4', theme: 'Boucler la Boucle', items: ['Offres d\'essai douces', 'Sessions Q&A', 'Examen de l\'engagement'] }
        ],
        strategicRecommendations: [
            "Le soin des prospects est un marathon, pas un sprint — soyez régulier.",
            "Utilisez des publicités de reciblage pour rester présent dans l'esprit.",
            "Concentrez-vous sur le fait d'être utile plutôt que d'être vendeur.",
            "Utilisez des accroches dans chaque pièce de contenu produite.",
            "Variez vos formats : texte, vidéo, image, sondage."
        ],
        redFlags: [
            "Contenu ennuyeux et clinique qui ne suscite aucune émotion.",
            "Publier uniquement quand vous avez quelque chose à vendre.",
            "Ignorer les commentaires et messages directs des prospects.",
            "Utilisation excessive d'outils automatisés qui tuent le côté humain.",
            "Fournir une impasse sans étape suivante pour les prospects curieux."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Posez une question à haut potentiel d\'engagement.' },
            { period: 'Premiers 7 jours', focus: 'Lancez une série de contenus "Intérêt" en 3 parties.' },
            { period: 'Premiers 30 jours', focus: 'Affinez votre flux d\'engagement vers les prospects.' }
        ],
        nextSteps: ["Auditez vos taux d'engagement sociaux", "Créez une pièce de contenu 'Top 10 Questions'", "Implémentez une séquence d'e-mails de soin"]
    },
    what: {
        title: 'Aperçu de la Solution et de la UVP',
        mission: 'Clarifier la transformation tangible que votre solution apporte au marché.',
        highlight: 'Le "Quoi" est le résultat tangible de votre promesse de marque. Il doit être clair et unique.',
        focusAreas: [
            { name: 'QUOI ?', desc: 'Définissez votre produit ou service en termes de résultats spécifiques.' },
            { name: 'RÉTENTION', desc: 'Assurez-vous que le "Quoi" continue de livrer de la valeur longtemps après l\'achat.' },
            { name: 'APPEL À L\'ACTION', desc: 'Facilitez la compréhension de ce qu\'ils obtiennent en répondant.' }
        ],
        keyActions: "Affinez votre proposition de valeur unique (UVP) jusqu'à ce qu'elle soit indubitable. Mise sur la transformation.",
        remember: "Votre produit est un pont du problème vers le résultat. Maintenez ce pont solide.",
        corePhilosophy: "Les gens achètent le trou, pas la perceuse.",
        tips: [
            "Indiquez le résultat en premier",
            "Utilisez des chiffres et des résultats concrets",
            "Faites le contraste avec l'alternative",
            "Mettez en avant un différenciateur majeur",
            "Restez assez simple pour un enfant de 10 ans",
            "Utilisez des images de produit de haute qualité",
            "Offrez un avant/après clair",
            "Listez exactement ce qu'ils reçoivent",
            "Fournissez une garantie en béton",
            "Montrez le produit en action"
        ],
        sevenDayPlan: [
            { day: 'Jour 1', focus: 'Rédigez 3 versions différentes de votre UVP.' },
            { day: 'Jour 2', focus: 'Listez les 5 résultats tangibles de vos clients.' },
            { day: 'Jour 3', focus: 'Créez un tableau Fonctionnalités vs Bénéfices.' },
            { day: 'Jour 4', focus: 'Récoltez 3 captures d\'écran ou photos du produit.' },
            { day: 'Jour 5', focus: 'Rédigez un énoncé d\'unicité (Nous sommes les SEULS...).' },
            { day: 'Jour 6', focus: 'Auditez votre accueil pour la clarté de l\'offre.' },
            { day: 'Jour 7', focus: 'Sélectionnez l\'UVP gagnante pour votre titre.' }
        ],
        thirtyDayCalendar: [
            { week: 'Semaine 1', theme: 'Clarté UVP', items: ['Mise à jour du titre', 'Clarification des livrables', 'Test A/B de l\'offre'] },
            { week: 'Semaine 2', theme: 'Preuve Visuelle', items: ['Vidéo démo produit', 'Images Avant/Après', 'Preuve de déballage'] },
            { week: 'Semaine 3', theme: 'Avantage Compétitif', items: ['Tableau comparatif', 'Focus différenciateurs', 'Blog d\'autorité'] },
            { week: 'Semaine 4', theme: 'Intégration UVP', items: ['Mise à jour des bios', 'Synchro deck de vente', 'Examen retours'] }
        ],
        strategicRecommendations: [
            "Votre UVP doit se concentrer sur le plus gros résultat que vous livrez.",
            "Évitez les promesses génériques comme 'meilleure qualité'.",
            "Testez votre UVP sur quelqu'un qui n'y connaît rien à votre domaine.",
            "Assurez-vous que votre UVP est visible dès l'arrivée sur le site.",
            "Mettez à jour votre offre en fonction des retours clients."
        ],
        redFlags: [
            "Une UVP trop longue qui nécessite plusieurs phrases.",
            "Utiliser des affirmations exagérées incroyables.",
            "Se concentrer sur les objectifs internes de l'entreprise au lieu du client.",
            "Votre produit est indiscernable de celui des concurrents.",
            "Descriptions vagues qui n'expliquent pas ce que l'on reçoit vraiment."
        ],
        implementationTimeline: [
            { period: 'Premieres 24 heures', focus: 'Définissez votre chiffre magique (ex: Économisez 40%).' },
            { period: 'Premiers 7 jours', focus: 'Enregistrez une démo produit de 60 secondes.' },
            { period: 'Premiers 30 jours', focus: 'Synchronisez votre UVP sur tous vos canaux.' }
        ],
        nextSteps: ["Auditez votre UVP pour la clarté et le punch", "Vérifiez les promesses de vos concurrents", "Sondez vos utilisateurs sur le bénéfice n°1"]
    }
};

export const MARKETING_QUOTES_FR = [
    { quote: "Le contenu est le feu. Les réseaux sociaux sont l'essence.", author: "Jay Baer" },
    { quote: "Le but du marketing est de connaître et de comprendre le client si bien que le produit ou le service lui convient et se vend tout seul.", author: "Peter Drucker" },
    { quote: "Le marketing ne concerne plus les choses que vous fabriquez, mais les histoires que vous racontez.", author: "Seth Godin" },
    { quote: "Ne cherchez pas de clients pour vos produits, cherchez des produits pour vos clients.", author: "Seth Godin" }
];

export const getLocalizedStrategicAdvice = (lng) => {
    if (lng.startsWith('fr')) {
        return STRATEGIC_ADVICE_FR;
    }
    return STRATEGIC_ADVICE;
};

export const getRandomQuote = (lng = 'en') => {
    const quotes = lng.startsWith('fr') ? MARKETING_QUOTES_FR : MARKETING_QUOTES;
    return quotes[Math.floor(Math.random() * quotes.length)];
};
