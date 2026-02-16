/**
 * Prospect Intelligence Utility
 * Provides context-aware, industry-specific messaging for B2C and B2B prospects
 */

// Industry-specific vocabulary banks
export const INDUSTRY_VOCABULARY = {
    fashion: {
        pains: ['outdated wardrobe', 'style confusion', 'fast fashion fatigue', 'finding quality pieces', 'expressing personal style'],
        desires: ['express unique style', 'feel confident', 'stand out', 'build a timeless wardrobe', 'sustainable choices'],
        actions: ['curate', 'elevate', 'transform', 'refresh', 'discover'],
        context: ['aesthetic', 'wardrobe', 'style journey', 'fashion identity', 'personal brand']
    },
    health: {
        pains: ['low energy', 'wellness plateau', 'inconsistent results', 'confusing information', 'lack of motivation'],
        desires: ['feel vibrant', 'achieve peak performance', 'sustainable health', 'lasting transformation', 'feel confident'],
        actions: ['optimize', 'energize', 'revitalize', 'transform', 'achieve'],
        context: ['wellness journey', 'vitality', 'health goals', 'lifestyle shift', 'peak performance']
    },
    home: {
        pains: ['cluttered space', 'outdated decor', 'lack of functionality', 'overwhelming choices', 'budget constraints'],
        desires: ['create sanctuary', 'express personality', 'functional beauty', 'peaceful environment', 'impress guests'],
        actions: ['transform', 'redesign', 'optimize', 'refresh', 'personalize'],
        context: ['living space', 'home sanctuary', 'interior vision', 'dream space', 'personal haven']
    },
    beauty: {
        pains: ['skin concerns', 'product overwhelm', 'inconsistent routines', 'harsh ingredients', 'trial and error'],
        desires: ['glowing skin', 'feel confident', 'natural beauty', 'self-care ritual', 'age gracefully'],
        actions: ['nourish', 'enhance', 'transform', 'reveal', 'pamper'],
        context: ['skincare journey', 'beauty routine', 'self-care ritual', 'glow-up', 'confidence boost']
    },
    food: {
        pains: ['unhealthy options', 'time constraints', 'boring meals', 'dietary restrictions', 'guilt after eating'],
        desires: ['eat guilt-free', 'enjoy delicious food', 'feel energized', 'nourish body', 'discover flavors'],
        actions: ['savor', 'nourish', 'indulge', 'discover', 'enjoy'],
        context: ['culinary experience', 'food journey', 'taste adventure', 'mindful eating', 'flavor discovery']
    },
    electronics: {
        pains: ['outdated tech', 'complexity', 'poor performance', 'compatibility issues', 'information overload'],
        desires: ['stay current', 'simplify life', 'boost productivity', 'seamless experience', 'cutting-edge features'],
        actions: ['upgrade', 'streamline', 'optimize', 'enhance', 'revolutionize'],
        context: ['tech ecosystem', 'digital life', 'productivity setup', 'connected lifestyle', 'tech stack']
    },
    entertainment: {
        pains: ['boredom', 'repetitive content', 'wasted time', 'decision fatigue', 'missing out'],
        desires: ['be entertained', 'discover new favorites', 'escape reality', 'share experiences', 'stay current'],
        actions: ['discover', 'explore', 'experience', 'enjoy', 'immerse'],
        context: ['entertainment journey', 'content discovery', 'viewing experience', 'cultural moment', 'shared experience']
    },
    travel: {
        pains: ['planning stress', 'tourist traps', 'budget concerns', 'safety worries', 'missing authentic experiences'],
        desires: ['create memories', 'explore authentically', 'escape routine', 'cultural immersion', 'adventure'],
        actions: ['explore', 'discover', 'experience', 'adventure', 'immerse'],
        context: ['travel journey', 'adventure', 'cultural experience', 'wanderlust', 'bucket list']
    }
};

// Psychographic-based messaging strategies
export const MESSAGING_STRATEGIES = {
    status_driven: {
        hooks: ['exclusive', 'limited edition', 'elite', 'premium', 'curated', 'insider access'],
        tone: 'aspirational',
        proof: 'social validation',
        emphasis: 'exclusivity and prestige'
    },
    value_driven: {
        hooks: ['quality', 'craftsmanship', 'lasting', 'authentic', 'heritage', 'time-tested'],
        tone: 'authentic',
        proof: 'testimonials and reviews',
        emphasis: 'quality and integrity'
    },
    convenience_driven: {
        hooks: ['effortless', 'simple', 'time-saving', 'hassle-free', 'streamlined', 'instant'],
        tone: 'practical',
        proof: 'ease of use',
        emphasis: 'simplicity and efficiency'
    },
    ethical_driven: {
        hooks: ['sustainable', 'ethical', 'conscious', 'responsible', 'transparent', 'fair'],
        tone: 'values-aligned',
        proof: 'certifications and impact',
        emphasis: 'values and impact'
    },
    innovation_driven: {
        hooks: ['cutting-edge', 'revolutionary', 'innovative', 'next-gen', 'breakthrough', 'pioneering'],
        tone: 'forward-thinking',
        proof: 'technology and features',
        emphasis: 'innovation and advancement'
    },
    emotional_driven: {
        hooks: ['transformative', 'empowering', 'inspiring', 'life-changing', 'meaningful', 'heartfelt'],
        tone: 'emotional',
        proof: 'stories and transformations',
        emphasis: 'emotional connection and impact'
    }
};

// Decision-making style patterns
export const DECISION_STYLES = {
    impulsive: {
        approach: 'Create urgency and excitement',
        language: ['limited time', 'don\'t miss out', 'act now', 'while supplies last'],
        cta: 'immediate action'
    },
    research_heavy: {
        approach: 'Provide detailed information and proof',
        language: ['backed by research', 'proven results', 'detailed specifications', 'compare options'],
        cta: 'learn more'
    },
    brand_loyal: {
        approach: 'Emphasize brand story and consistency',
        language: ['trusted by', 'established since', 'loyal community', 'proven track record'],
        cta: 'join the family'
    },
    deal_seeker: {
        approach: 'Highlight value and savings',
        language: ['best value', 'save money', 'exclusive offer', 'price match'],
        cta: 'get the deal'
    },
    influencer_driven: {
        approach: 'Leverage social proof and recommendations',
        language: ['recommended by', 'as seen on', 'loved by', 'trending'],
        cta: 'see what others say'
    },
    community_oriented: {
        approach: 'Emphasize belonging and shared values',
        language: ['join our community', 'be part of', 'together we', 'shared mission'],
        cta: 'join us'
    }
};

/**
 * Analyzes prospect data and determines the best messaging strategy
 * @param {Object} prospectData - Prospect profile data
 * @returns {Object} Recommended strategy and context
 */
export const analyzeProspectStrategy = (prospectData) => {
    const {
        purchaseMotivations = [],
        emotionalDrivers = [],
        decisionStyle = '',
        industry = '',
        values = ''
    } = prospectData;

    // Determine primary motivation
    let primaryStrategy = 'value_driven'; // default

    if (purchaseMotivations.includes('status')) primaryStrategy = 'status_driven';
    else if (purchaseMotivations.includes('ethical')) primaryStrategy = 'ethical_driven';
    else if (purchaseMotivations.includes('convenience')) primaryStrategy = 'convenience_driven';
    else if (purchaseMotivations.includes('innovation')) primaryStrategy = 'innovation_driven';
    else if (emotionalDrivers.includes('belonging') || emotionalDrivers.includes('self_expression')) {
        primaryStrategy = 'emotional_driven';
    }

    // Get industry vocabulary
    const vocab = INDUSTRY_VOCABULARY[industry] || {
        pains: ['challenges', 'frustrations', 'obstacles'],
        desires: ['goals', 'aspirations', 'dreams'],
        actions: ['achieve', 'reach', 'accomplish'],
        context: ['journey', 'path', 'experience']
    };

    // Get decision style
    const decisionPattern = DECISION_STYLES[decisionStyle] || DECISION_STYLES.research_heavy;

    return {
        strategy: MESSAGING_STRATEGIES[primaryStrategy],
        vocabulary: vocab,
        decisionPattern,
        primaryMotivation: primaryStrategy
    };
};

/**
 * Generates an intelligent, context-aware message
 * @param {string} messageType - Type of message (authority, curiosity, etc.)
 * @param {Object} prospectData - Full prospect profile
 * @param {Object} productData - Product context
 * @returns {string} Personalized message
 */
export const generateIntelligentMessage = (messageType, prospectData, productData = {}) => {
    const analysis = analyzeProspectStrategy(prospectData);
    const { strategy, vocabulary, decisionPattern } = analysis;

    const isB2C = prospectData.prospectType === 'b2c';
    const painPoint = prospectData.painPoints?.split('.')[0]?.trim() || 'challenges';
    const desire = prospectData.goals?.split('.')[0]?.trim() || vocabulary.desires[0];
    const industry = prospectData.industry || 'your industry';
    const productName = productData.productName || 'our solution';

    // Select appropriate pain and desire from vocabulary
    const contextualPain = vocabulary.pains.find(p => painPoint.toLowerCase().includes(p.split(' ')[0])) || painPoint;
    const contextualDesire = vocabulary.desires.find(d => desire.toLowerCase().includes(d.split(' ')[0])) || desire;

    let message = '';

    switch (messageType) {
        case 'authority':
            if (isB2C) {
                message = `I've been working with ${vocabulary.context[0]} enthusiasts for years, and I know ${contextualPain} can feel overwhelming. `;
                message += `If you're ready to ${vocabulary.actions[0]} your ${vocabulary.context[1]} and ${contextualDesire}, `;
                message += `I'd love to show you how ${productName} helps people like you achieve ${strategy.emphasis}.`;
            } else {
                message = `After analyzing 200+ ${industry} companies, we found ${contextualPain} is the #1 barrier to growth. `;
                message += `${productName} is the only solution that delivers ${contextualDesire} with proven ROI.`;
            }
            break;

        case 'curiosity':
            if (isB2C) {
                message = `I've been following the shift in ${industry}, and I know ${contextualPain} isn't easy. `;
                message += `If you're ${contextualDesire}, I'd love to share how ${productName} is helping `;
                message += `${strategy.tone} ${vocabulary.context[0]} lovers ${vocabulary.actions[1]} their experience.`;
            } else {
                message = `Wondered if you've seen the recent shift in ${industry} regarding ${contextualPain}? `;
                message += `I'm seeing a lot of leaders moving toward ${contextualDesire}—would love to connect.`;
            }
            break;

        case 'data_driven':
            if (isB2C) {
                message = `Did you know that ${decisionPattern.language[0]}? Our ${productName} has helped thousands `;
                message += `${vocabulary.actions[2]} their ${vocabulary.context[2]} by focusing on ${strategy.emphasis}. `;
                message += `Given your interest in ${contextualDesire}, I thought this might resonate.`;
            } else {
                message = `The data is clear: ${industry} needs better solutions for ${contextualPain}. `;
                message += `${productName} delivers ${contextualDesire} with measurable results.`;
            }
            break;

        case 'connection':
            if (isB2C) {
                message = `I'd love to hear where you are right now in your ${vocabulary.context[0]}. `;
                message += `If ${contextualPain} has been holding you back from ${contextualDesire}, `;
                message += `I have some insights that might help you ${vocabulary.actions[3]} what you're looking for.`;
            } else {
                message = `I'm researching how ${industry} leaders manage ${contextualPain}. `;
                message += `At ${productName}, we've found a way to ${contextualDesire}. Love to connect.`;
            }
            break;

        case 'pain_point':
            if (isB2C) {
                message = `Stop letting ${contextualPain} keep you from ${contextualDesire}. `;
                message += `${productName} was created specifically to help ${vocabulary.context[0]} enthusiasts `;
                message += `${vocabulary.actions[4]} their ${strategy.emphasis}. This is the ${strategy.hooks[0]} solution you've been waiting for.`;
            } else {
                message = `Stop letting ${contextualPain} drain your resources. `;
                message += `${productName} was engineered for ${industry} to turn that bottleneck into ${contextualDesire}.`;
            }
            break;

        default:
            message = generateFallbackMessage(prospectData, productData);
    }

    return message;
};

/**
 * Generates a fallback message when type is unknown
 */
const generateFallbackMessage = (prospectData, productData) => {
    const isB2C = prospectData.prospectType === 'b2c';
    const productName = productData.productName || 'our solution';

    if (isB2C) {
        return `I'd love to share how ${productName} can help you achieve your goals. Worth a quick chat?`;
    }
    return `I'd love to discuss how ${productName} can support your business objectives.`;
};

/**
 * Determines personality type based on prospect data
 * @param {Object} prospectData - Prospect profile
 * @returns {string} Personality type description
 */
export const determinePersonalityType = (prospectData) => {
    const { emotionalDrivers = [], purchaseMotivations = [], decisionStyle = '' } = prospectData;

    if (emotionalDrivers.includes('achievement') && purchaseMotivations.includes('innovation')) {
        return 'The Achiever - Driven by results and innovation';
    }

    if (emotionalDrivers.includes('belonging') && decisionStyle === 'community_oriented') {
        return 'The Connector - Values community and shared experiences';
    }

    if (purchaseMotivations.includes('ethical') && emotionalDrivers.includes('security')) {
        return 'The Conscious Consumer - Values-driven and thoughtful';
    }

    if (decisionStyle === 'impulsive' && emotionalDrivers.includes('excitement')) {
        return 'The Adventurer - Spontaneous and experience-seeking';
    }

    if (purchaseMotivations.includes('quality') && decisionStyle === 'research_heavy') {
        return 'The Connoisseur - Quality-focused and detail-oriented';
    }

    if (purchaseMotivations.includes('status') && emotionalDrivers.includes('fomo')) {
        return 'The Trendsetter - Status-conscious and socially aware';
    }

    return 'The Balanced Consumer - Thoughtful and well-rounded';
};

/**
 * Generates strategic angle for approaching the prospect
 * @param {Object} prospectData - Prospect profile
 * @returns {string} Strategic recommendation
 */
export const generateStrategicAngle = (prospectData) => {
    const analysis = analyzeProspectStrategy(prospectData);
    const { strategy, decisionPattern } = analysis;

    return `Lead with ${strategy.emphasis}, use ${strategy.tone} tone, and ${decisionPattern.approach.toLowerCase()}. ` +
        `Emphasize ${strategy.proof} and create ${decisionPattern.cta} opportunities.`;
};

export default {
    analyzeProspectStrategy,
    generateIntelligentMessage,
    determinePersonalityType,
    generateStrategicAngle,
    INDUSTRY_VOCABULARY,
    MESSAGING_STRATEGIES,
    DECISION_STYLES
};
