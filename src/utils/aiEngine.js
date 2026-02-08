/**
 * AI Engine Utilities for IMI Compass Chatbots
 * Provides intelligent intent classification, entity extraction, and conversation context management
 */

// ============================================================================
// INTENT CLASSIFICATION SYSTEM
// ============================================================================

/**
 * Intent definitions with keywords, weights, and requirements
 */
export const INTENT_DEFINITIONS = {
    greeting: {
        keywords: ['hello', 'hi', 'hey', 'start', 'greetings'],
        weight: 1.0,
        requiresEmpty: false, // Can work even with conversation history
        priority: 10
    },
    nextSteps: {
        keywords: ['next', 'step', 'progress', 'milestone', 'what should', 'roadmap', 'forward'],
        weight: 0.9,
        requiredData: [],
        priority: 8
    },
    pitchHelp: {
        keywords: ['improve', 'pitch', 'sell', 'better', 'hook', 'sales', 'presentation'],
        weight: 0.95,
        requiredData: ['brand', 'prospect'],
        priority: 9
    },
    compassAnalysis: {
        keywords: ['compass', 'node', 'analyze', 'strategy', 'direction', 'logic'],
        weight: 0.85,
        requiredData: ['compassData'],
        priority: 7
    },
    profileCheck: {
        keywords: ['who', 'profile', 'me', 'status', 'identity'],
        weight: 0.8,
        requiredData: [],
        priority: 6
    },
    helpRequest: {
        keywords: ['help', 'assist', 'stuck', 'confused', 'understand', 'explain'],
        weight: 0.95,
        requiredData: [],
        priority: 10
    },
    dataCompletion: {
        keywords: ['complete', 'fill', 'add', 'missing', 'brand', 'prospect', 'product'],
        weight: 0.75,
        requiredData: [],
        priority: 5
    }
};

/**
 * Classifies user input into intents with confidence scores
 * @param {string} input - User's message
 * @param {Object} context - Conversation and data context
 * @returns {Array} Sorted array of intents with scores
 */
export const classifyIntent = (input, context = {}) => {
    const lowerInput = input.toLowerCase().trim();
    const words = lowerInput.split(/\s+/);

    const scores = Object.entries(INTENT_DEFINITIONS).map(([intentName, config]) => {
        let score = 0;

        // Keyword matching with position weighting (earlier = more weight)
        config.keywords.forEach((keyword, keywordIndex) => {
            const wordPositions = words.map((word, idx) =>
                word.includes(keyword) ? idx : -1
            ).filter(pos => pos >= 0);

            if (wordPositions.length > 0) {
                // The earlier the keyword appears, the higher the score
                const positionBoost = 1 - (Math.min(...wordPositions) / words.length) * 0.3;
                const keywordPenalty = keywordIndex * 0.05; // Later keywords slightly penalized
                score += config.weight * positionBoost * (1 - keywordPenalty);

                // Bonus for multiple occurrences
                if (wordPositions.length > 1) {
                    score += 0.1 * (wordPositions.length - 1);
                }
            }
        });

        // Context boosting based on conversation state
        if (context.lastIntent === intentName) {
            score *= 1.15; // Boost if following same topic
        }

        if (context.topicsDiscussed?.includes(intentName) && context.followUpCount > 0) {
            score *= 1.1; // Slight boost for recurring topics
        }

        // Data requirement validation
        if (config.requiredData && config.requiredData.length > 0) {
            const missingData = config.requiredData.filter(key => !context[key]);
            if (missingData.length > 0) {
                score *= 0.4; // Heavy penalty for missing required data
            } else {
                score *= 1.2; // Bonus for having all required data
            }
        }

        // Empty conversation requirement
        if (config.requiresEmpty && context.messageCount > 0) {
            score *= 0.3;
        }

        return {
            intent: intentName,
            score: Math.max(0, score),
            priority: config.priority || 5,
            confidence: calculateConfidence(score, config)
        };
    });

    // Sort by score (descending), then by priority (descending)
    return scores
        .filter(s => s.score > 0.1) // Filter out very low scores
        .sort((a, b) => {
            if (Math.abs(a.score - b.score) < 0.1) {
                return b.priority - a.priority; // Tie-breaker: priority
            }
            return b.score - a.score;
        });
};

/**
 * Calculate confidence level from score
 */
const calculateConfidence = (score, config) => {
    const normalized = Math.min(score / config.weight, 1.0);
    if (normalized >= 0.8) return 'high';
    if (normalized >= 0.5) return 'medium';
    return 'low';
};

/**
 * Get all potential intents (for multi-intent handling)
 */
export const classifyAllIntents = (input, context) => {
    const intents = classifyIntent(input, context);
    // Return unique intents with score > 0.3
    return intents.filter((intent, index, self) =>
        intent.score > 0.3 &&
        index === self.findIndex((t) => t.intent === intent.intent)
    );
};

// ============================================================================
// SMART FALLBACK GENERATION
// ============================================================================

/**
 * Generate smart fallback suggestions when intent is unclear
 * @param {string} input - User's message
 * @param {Object} context - Conversation context
 * @returns {Object} Fallback response options
 */
export const generateSmartFallback = (input, context) => {
    // 1. Analyze ambiguous intents (scores between 0.2 and 0.4)
    const ambiguousIntents = classifyIntent(input, context)
        .filter(i => i.score >= 0.2 && i.score < 0.5)
        .slice(0, 3);

    if (ambiguousIntents.length > 0) {
        return {
            type: 'disambiguation',
            intents: ambiguousIntents,
            messageKey: 'advisor.ai_responses.clarify_intent',
            suggestionKeys: ambiguousIntents.map(i => `nav.${i.intent}`)
        };
    }

    // 2. Context-aware help based on user status
    if (context.level === 'Novice' || !context.brand) {
        return {
            type: 'onboarding_help',
            messageKey: 'advisor.ai_responses.no_match',
            suggestionKeys: ['nav.brand', 'nav.prospect', 'common.help']
        };
    }

    return {
        type: 'general_help',
        messageKey: 'advisor.ai_responses.no_match',
        suggestionKeys: ['advisor.ai_responses.show_capabilities', 'nav.compass', 'common.help']
    };
};



/**
 * Extract entities from user input
 * @param {string} input - User's message
 * @param {Object} availableData - User's profile and saved data
 * @returns {Object} Extracted entities by category
 */
export const extractEntities = (input, availableData = {}) => {
    const lowerInput = input.toLowerCase();

    const entities = {
        brands: [],
        roles: [],
        industries: [],
        objectives: [],
        actions: [],
        timeframes: [],
        numbers: [],
        mentions: []
    };

    // Brand name mentions
    if (availableData.brandName) {
        const brandRegex = new RegExp(`\\b${escapeRegex(availableData.brandName)}\\b`, 'gi');
        if (brandRegex.test(input)) {
            entities.brands.push(availableData.brandName);
            entities.mentions.push({ type: 'brand', value: availableData.brandName });
        }
    }

    // Role/Job Title mentions
    if (availableData.jobTitle) {
        const roleRegex = new RegExp(`\\b${escapeRegex(availableData.jobTitle)}\\b`, 'gi');
        if (roleRegex.test(input)) {
            entities.roles.push(availableData.jobTitle);
            entities.mentions.push({ type: 'role', value: availableData.jobTitle });
        }
    }

    // Industry mentions
    if (availableData.industry) {
        const industryRegex = new RegExp(`\\b${escapeRegex(availableData.industry)}\\b`, 'gi');
        if (industryRegex.test(input)) {
            entities.industries.push(availableData.industry);
            entities.mentions.push({ type: 'industry', value: availableData.industry });
        }
    }

    // Action verbs
    const actionVerbs = [
        'improve', 'create', 'analyze', 'build', 'fix', 'update',
        'generate', 'develop', 'implement', 'design', 'optimize',
        'refine', 'enhance', 'streamline', 'scale', 'launch'
    ];
    actionVerbs.forEach(verb => {
        if (lowerInput.includes(verb)) {
            entities.actions.push(verb);
        }
    });

    // Timeframes
    const timePatterns = [
        { pattern: /\b(today|tonight)\b/gi, value: 'today' },
        { pattern: /\b(tomorrow)\b/gi, value: 'tomorrow' },
        { pattern: /\b(this week)\b/gi, value: 'this_week' },
        { pattern: /\b(next week)\b/gi, value: 'next_week' },
        { pattern: /\b((\d+)\s*(days?|weeks?|months?))\b/gi, value: 'custom' }
    ];

    timePatterns.forEach(({ pattern, value }) => {
        const matches = input.match(pattern);
        if (matches) {
            entities.timeframes.push(...matches.map(m => ({ text: m, normalized: value })));
        }
    });

    // Numbers (useful for metrics, days, etc.)
    const numberPattern = /\b(\d+)\b/g;
    const numbers = input.match(numberPattern);
    if (numbers) {
        entities.numbers = numbers.map(n => parseInt(n, 10));
    }

    // Objectives/Goals (common patterns)
    const objectivePatterns = [
        /\b(grow|scale|increase|boost|expand)\s+(\w+)/gi,
        /\b(reduce|minimize|decrease|eliminate)\s+(\w+)/gi,
        /\b(achieve|reach|attain)\s+(\w+)/gi
    ];

    objectivePatterns.forEach(pattern => {
        const matches = [...input.matchAll(pattern)];
        matches.forEach(match => {
            entities.objectives.push({
                action: match[1],
                target: match[2]
            });
        });
    });

    return entities;
};

/**
 * Escape special regex characters
 */
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ============================================================================
// CONVERSATION CONTEXT MANAGEMENT
// ============================================================================

/**
 * Initialize conversation context
 */
export const initConversationContext = () => ({
    topics: [],
    lastIntent: null,
    followUpCount: 0,
    messageCount: 0,
    userGoals: [],
    mentionedEntities: {},
    startedAt: new Date().toISOString(),
    lastMessageAt: null
});

/**
 * Update conversation context with new message
 */
export const updateConversationContext = (prevContext, input, detectedIntent, entities) => {
    const newContext = { ...prevContext };

    // Update message count
    newContext.messageCount += 1;
    newContext.lastMessageAt = new Date().toISOString();

    // Update topics (keep last 5 unique)
    if (detectedIntent) {
        newContext.topics = [...new Set([detectedIntent.intent, ...prevContext.topics])].slice(0, 5);

        // Update follow-up count
        if (prevContext.lastIntent === detectedIntent.intent) {
            newContext.followUpCount += 1;
        } else {
            newContext.followUpCount = 0;
        }

        newContext.lastIntent = detectedIntent.intent;
    }

    // Merge mentioned entities
    if (entities) {
        Object.keys(entities).forEach(key => {
            if (entities[key].length > 0) {
                if (!newContext.mentionedEntities[key]) {
                    newContext.mentionedEntities[key] = [];
                }
                newContext.mentionedEntities[key] = [
                    ...new Set([...newContext.mentionedEntities[key], ...entities[key]])
                ];
            }
        });
    }

    // Extract and store user goals from objectives
    if (entities?.objectives && entities.objectives.length > 0) {
        newContext.userGoals = [
            ...newContext.userGoals,
            ...entities.objectives
        ].slice(-10); // Keep last 10 goals
    }

    return newContext;
};

/**
 * Check if user seems stuck or needs help
 */
export const detectStuckUser = (context) => {
    const indicators = {
        repeatedSameTopic: context.followUpCount > 3,
        manyShortMessages: context.messageCount > 5 && context.topics.length < 2,
        noProgress: context.messageCount > 7 && context.userGoals.length === 0,
        frustrationPattern: context.topics.includes('helpRequest') && context.followUpCount > 1
    };

    const shouldIntervene = Object.values(indicators).filter(v => v).length >= 2;

    return {
        shouldIntervene,
        indicators,
        suggestion: shouldIntervene ? generateHelpSuggestion(context, indicators) : null
    };
};

/**
 * Generate help suggestion based on stuck indicators
 */
const generateHelpSuggestion = (context, indicators) => {
    if (indicators.repeatedSameTopic) {
        return {
            type: 'topic_change',
            message: 'try_different_approach',
            actions: ['show_capabilities', 'profile_check', 'next_steps']
        };
    }

    if (indicators.noProgress) {
        return {
            type: 'goal_setting',
            message: 'define_objective',
            actions: ['complete_brand', 'set_objective', 'view_roadmap']
        };
    }

    return {
        type: 'general_help',
        message: 'offer_assistance',
        actions: ['show_help', 'guided_tour', 'reset_conversation']
    };
};

// ============================================================================
// RESPONSE QUALITY SCORING
// ============================================================================

/**
 * Score response quality and calculate confidence
 */
export const scoreResponse = (intent, context, availableData) => {
    let confidence = 0.5; // Base confidence

    // Boost if intent has high score
    if (intent.confidence === 'high') confidence += 0.3;
    else if (intent.confidence === 'medium') confidence += 0.15;

    // Boost if we have required data
    const intentConfig = INTENT_DEFINITIONS[intent.intent];
    if (intentConfig?.requiredData) {
        const hasAllData = intentConfig.requiredData.every(key => availableData[key]);
        if (hasAllData) {
            confidence += 0.2;
        } else {
            confidence -= 0.25;
        }
    }

    // Boost if this follows previous conversation flow
    if (context.lastIntent && context.followUpCount > 0 && context.followUpCount < 3) {
        confidence += 0.1;
    }

    // Reduce if conversation seems stuck
    if (context.followUpCount > 3) {
        confidence -= 0.15;
    }

    // Check for missing critical data
    const criticalDataKeys = ['brandName', 'objective', 'industry'];
    const missingCritical = criticalDataKeys.filter(key => !availableData[key]);
    confidence -= missingCritical.length * 0.08;

    return {
        confidence: Math.min(1.0, Math.max(0, confidence)),
        missingData: missingCritical,
        shouldSuggestCompletion: missingCritical.length > 0 && confidence < 0.6
    };
};

/**
 * Get completion suggestions for missing data
 */
export const getDataCompletionSuggestions = (missingData) => {
    const suggestions = [];

    if (missingData.includes('brandName')) {
        suggestions.push({
            type: 'brand_profiler',
            priority: 10,
            label: 'complete_brand_profile'
        });
    }

    if (missingData.includes('industry') || missingData.includes('jobTitle')) {
        suggestions.push({
            type: 'prospect_profiler',
            priority: 9,
            label: 'define_target_audience'
        });
    }

    if (missingData.includes('objective')) {
        suggestions.push({
            type: 'compass',
            priority: 8,
            label: 'set_strategic_objective'
        });
    }

    return suggestions.sort((a, b) => b.priority - a.priority);
};

// ============================================================================
// LEARNING & ADAPTATION
// ============================================================================

/**
 * Learn from user interactions to refine preferences
 * @param {Object} context - Current conversation context
 * @param {Object} intent - The classified intent
 * @param {string} sentiment - Optional sentiment (positive/negative)
 */
export const learnFromInteraction = (context, intent, sentiment = 'neutral') => {
    // Return updates to be merged into context
    const updates = {
        interests: { ...(context.interests || {}) },
        preferredStyle: context.preferredStyle || 'balanced'
    };

    // 1. Track topic interests
    if (intent && intent.score > 0.6) {
        const topic = intent.intent;
        updates.interests[topic] = (updates.interests[topic] || 0) + 1;
    }

    // 2. Adjust style based on implicit feedback (simplified)
    if (sentiment === 'negative') {
        updates.preferredStyle = 'direct';
    }

    return updates;
};

// ============================================================================
// PROACTIVE HELP
// ============================================================================

/**
 * Generate proactive suggestions based on user progress
 * @param {Object} context - Conversation context
 * @param {Object} progressData - User's progress data (days completed, etc.)
 */
export const getProactiveSuggestions = (context, progressData) => {
    const suggestions = [];

    // 1. Suggest next logical step in journey
    if (progressData?.completedDays?.length > 0) {
        const lastDay = Math.max(...progressData.completedDays, 0); // Default to 0 if empty
        if (lastDay < 30) {
            suggestions.push({
                type: 'next_day', // Used for icon/logic
                label: 'advisor.ai_responses.show_tactic', // Translation key
                day: lastDay + 1
            });
        }
    }

    // 2. Reminder for core profile completion if missing
    if (!context.brand || !context.objective) {
        suggestions.push({
            type: 'profile_completion',
            label: 'nav.project'
        });
    }

    return suggestions;
};

/**
 * Generate a comprehensive prompt for Gemini sync/export
 * @param {Object} context - Conversation context
 * @param {Array} history - Message history
 * @param {string} mode - 'strategic' or 'solocorp'
 */
export const generateGeminiPrompt = (context, history, mode = 'strategic') => {
    let prompt = `You are acting as an expert ${mode === 'strategic' ? 'IMI Strategic Advisor' : 'IMI Solo Corp Coach'}.\n\n`;
    prompt += `**CORE PHILOSOPHY**\n`;
    prompt += `- Navigate Strategy Through Conversation, Not Coercion.\n`;
    prompt += `- Focus on High-Trust interactions and authentic value demonstration.\n`;
    prompt += `- Avoid generic "salesy" language or manipulative tactics.\n\n`;

    prompt += `**CURRENT PROJECT CONTEXT**\n`;
    if (context.brand) prompt += `- Brand Name: ${context.brand}\n`;
    if (context.industry) prompt += `- Industry: ${context.industry}\n`;
    if (context.objective) prompt += `- Main Goal: ${context.objective}\n`;
    if (context.targetAudience) prompt += `- Ideal Prospect: ${context.targetAudience}\n`;
    if (context.prospectType) prompt += `- Offer Nature: ${context.prospectType.toUpperCase()} (B2B = Focus on ROI/Trust, B2C = Focus on Lifestyle/Emotion)\n`;
    if (context.topics) prompt += `- Recent Strategic Topics: ${context.topics.join(', ')}\n`;

    prompt += `\n**CONVERSATION HISTORY**\n`;
    history.slice(-10).forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        const content = msg.content;
        prompt += `[${role}]: ${content}\n`;
    });

    prompt += `\n**INSTRUCTIONS**\n`;
    prompt += `Please provide a deep strategic synthesis based on this context. Ensure your advice is SPECIFIC to the user's industry and offering. If they are B2B, focus on efficiency, trust, and business results. If they are B2C, focus on personal transformation and emotional resonance. Always lead toward the next milestone in their growth roadmap.`;

    return prompt;
};

export default {
    classifyIntent,
    classifyAllIntents,
    extractEntities,
    initConversationContext,
    updateConversationContext,
    detectStuckUser,
    scoreResponse,
    getDataCompletionSuggestions,
    generateSmartFallback,
    learnFromInteraction,
    getProactiveSuggestions,
    generateGeminiPrompt
};


