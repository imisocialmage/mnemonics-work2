/**
 * Offline Analyzer V2 — Intelligent Heuristic Business Analysis Engine
 * 
 * A significant upgrade from the V1 keyword mapper. This engine uses a multi-stage
 * inference pipeline to derive strategic insights from business descriptions.
 * 
 * Improvements:
 * - 25+ Industry Categories (vs 10)
 * - Quantitative Scoring (Clarity, Precision, Differentiation)
 * - Psychographic Profiling
 * - Strategic Rationale generation (The "Why")
 * - B2B/B2C Nuance (Enterprise vs SMB vs Retail)
 */

// ─── STAGE 1: INDUSTRY DATABASE (EXPANDED TO 25+) ───────────────────────────
const INDUSTRY_MAP = {
    // TECHNOLOGY & SAAS
    enterprise_software: {
        name: 'Enterprise Software',
        keywords: ['enterprise', 'erp', 'crm', 'infrastructure', 'cybersecurity', 'cloud infrastructure', 'b2b saas', 'scalability', 'integration', 'deployment', 'systems'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'Inter', body: 'Source Sans Pro' },
        colors: { primary: '#1E293B', secondary: '#334155' },
        channels: ['LinkedIn', 'Gartner/Forrester', 'Direct Sales'],
        contentPillar: 'Technical Whitepapers & Security Standards'
    },
    consumer_app: {
        name: 'Consumer App',
        keywords: ['mobile app', 'ios', 'android', 'consumer tech', 'social media', 'dating', 'utility', 'productivity app', 'gamified', 'user-friendly', 'ux'],
        mode: 'B2C', scale: 'Mass Market',
        fonts: { headers: 'Outfit', body: 'Inter' },
        colors: { primary: '#6366F1', secondary: '#F5F3FF' },
        channels: ['TikTok', 'Product Hunt', 'App Store SEO'],
        contentPillar: 'User Experience & Viral Loops'
    },
    ai_fintech: {
        keywords: ['ai', 'artificial intelligence', 'machine learning', 'fintech', 'trading', 'crypto', 'banking', 'automation', 'predictive', 'algorithms'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'IBM Plex Sans', body: 'Inter' },
        colors: { primary: '#0F172A', secondary: '#38BDF8' },
        channels: ['Twitter/X', 'Substack', 'Industry Tech Events'],
        contentPillar: 'Algorithm Performance & Future Trends'
    },
    // SERVICES & CONSULTING
    strategic_consulting: {
        keywords: ['strategic', 'management consulting', 'growth strategy', 'm&a', 'business transformation', 'leadership development', 'organizational design'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'Montserrat', body: 'Crimson Text' },
        colors: { primary: '#1E3A5F', secondary: '#F1F5F9' },
        channels: ['Forbes/HBR', 'LinkedIn Pulse', 'Executive Networking'],
        contentPillar: 'Market Insights & Frameworks'
    },
    creative_agency: {
        keywords: ['branding', 'design agency', 'marketing agency', 'ad agency', 'video production', 'social media management', 'influencer marketing'],
        mode: 'B2B', scale: 'Mid-Range',
        fonts: { headers: 'DM Sans', body: 'Space Grotesk' },
        colors: { primary: '#EC4899', secondary: '#FDF2F8' },
        channels: ['Behance', 'Instagram Stories', 'Dribbble'],
        contentPillar: 'Case Studies & Visual Process'
    },
    coaching_education: {
        keywords: ['life coach', 'business coach', 'mentorship', 'online course', 'e-learning', 'mastermind', 'training program', 'self-improvement'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Poppins', body: 'Lora' },
        colors: { primary: '#7C3AED', secondary: '#FAF5FF' },
        channels: ['YouTube', 'Facebook Groups', 'Podcasts'],
        contentPillar: 'Transformation Stories & Educational Clips'
    },
    // RETAIL & COMMERCE
    street_apparel: {
        name: 'Streetwear & Apparel',
        keywords: ['streetwear', 'apparel', 'clothing', 'fashion', 'urban', 'boutique', 'style', 'wear', 'hoodie', 'sneakers', 'drops', 'culture', 'vibe'],
        mode: 'B2C', scale: 'Mass Market',
        fonts: { headers: 'Unbounded', body: 'Inter' },
        colors: { primary: '#000000', secondary: '#F3F4F6' },
        channels: ['Instagram', 'TikTok', 'Discord'],
        contentPillar: 'Culture, Drops & Community Vibe'
    },
    luxury_fashion: {
        keywords: ['luxury', 'haute couture', 'designer', 'premium apparel', 'exclusive', 'handcrafted', 'heritage', 'craftsmanship', 'silk', 'bespoke'],
        mode: 'B2C', scale: 'High-Ticket',
        fonts: { headers: 'Playfair Display', body: 'Lato' },
        colors: { primary: '#1A1A1A', secondary: '#D4AF37' },
        channels: ['Vogue/Elite Media', 'Instagram', 'Private Galas'],
        contentPillar: 'Heritage Stories & Aesthetic Perfection'
    },
    sustainable_retail: {
        keywords: ['eco-friendly', 'sustainable', 'recycled', 'organic', 'ethical', 'fair trade', 'green', 'environment', 'conscious consumer'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Plus Jakarta Sans', body: 'Inter' },
        colors: { primary: '#166534', secondary: '#F0FDF4' },
        channels: ['Pinterest', 'Sustainable Blogs', 'Instagram'],
        contentPillar: 'Supply Chain Transparency & Earth Impact'
    },
    direct_to_consumer: {
        keywords: ['dtc', 'e-commerce store', 'online shop', 'subscription box', 'shopify', 'shipping', 'packaging', 'unboxing', 'retail'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Manrope', body: 'Inter' },
        colors: { primary: '#F97316', secondary: '#FFF7ED' },
        channels: ['Facebook Ads', 'YouTube Reviews', 'Email Rewards'],
        contentPillar: 'Product Utility & Customer Reviews'
    },
    // HEALTH & WELLNESS
    medical_practice: {
        keywords: ['dentist', 'clinic', 'medical center', 'hospital', 'specialist', 'health services', 'patient care', 'doctor', 'surgery'],
        mode: 'B2C', scale: 'High-Ticket',
        fonts: { headers: 'Source Sans Pro', body: 'Open Sans' },
        colors: { primary: '#0891B2', secondary: '#ECFEFF' },
        channels: ['Google My Business', 'Local SEO', 'Referrals'],
        contentPillar: 'Health Fact-Checks & Patient Safety'
    },
    mental_wellness: {
        keywords: ['therapy', 'counseling', 'psychology', 'meditation', 'mindfulness', 'mental health', 'emotional support', 'stress relief'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Nunito', body: 'Quicksand' },
        colors: { primary: '#4338CA', secondary: '#EEF2FF' },
        channels: ['Calm/Headspace Ads', 'Instagram', 'Health Podcasts'],
        contentPillar: 'Coping Strategies & Affirmations'
    },
    professional_fitness: {
        keywords: ['gym', 'personal trainer', 'crossfit', 'bodybuilding', 'athletic performance', 'sports nutrition', 'workout program'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Teko', body: 'Barlow' },
        colors: { primary: '#DC2626', secondary: '#FEF2F2' },
        channels: ['YouTube Gym', 'Instagram Reels', 'Local Events'],
        contentPillar: 'Workout Science & Motivation'
    },
    // INDUSTRIAL & PROFESSIONAL
    real_estate_luxury: {
        keywords: ['luxury real estate', 'mansion', 'penthouse', 'property investment', 'brokerage', 'commercial real estate', 'high-end listings'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'Libre Baskerville', body: 'Source Sans Pro' },
        colors: { primary: '#134E4A', secondary: '#F0FDFA' },
        channels: ['Mansion Global', 'LinkedIn', 'Elite Networking'],
        contentPillar: 'Market Analysis & Architecture Spotlights'
    },
    logistics_manufacturing: {
        keywords: ['supply chain', 'logistics', 'shipping', 'manufacturing', 'factory', 'production line', 'wholesale', 'distribution'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'Roboto Condensed', body: 'Roboto' },
        colors: { primary: '#374151', secondary: '#F3F4F6' },
        channels: ['Industry Journals', 'Trade Shows', 'LinkedIn'],
        contentPillar: 'Efficiency Benchmarks & Case Studies'
    },
    legal_services: {
        keywords: ['law firm', 'attorney', 'legal counsel', 'litigation', 'corporate law', 'intellectual property', 'compliance'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'Cinzel', body: 'EB Garamond' },
        colors: { primary: '#451A03', secondary: '#FFFBEB' },
        channels: ['Industry Specific Media', 'LinkedIn', 'Professional Referrals'],
        contentPillar: 'Legal Updates & Risk Mitigation'
    },
    // CREATIVE & MEDIA
    photography_video: {
        keywords: ['wedding photography', 'videography', 'film production', 'content creator', 'commercial photo', 'editor', 'visual media'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Cormorant Garamond', body: 'Montserrat' },
        colors: { primary: '#18181B', secondary: '#F4F4F5' },
        channels: ['Instagram', 'Vimeo', 'Personal Portfolio'],
        contentPillar: 'Emotional Recaps & BTS Gear'
    },
    publishing_media: {
        keywords: ['magazine', 'newsletter', 'publishing', 'blog', 'podcast network', 'journalism', 'digital media house', 'editor'],
        mode: 'B2C', scale: 'Subscription',
        fonts: { headers: 'Playfair Display', body: 'Georgia' },
        colors: { primary: '#991B1B', secondary: '#FEF2F2' },
        channels: ['Substack', 'Apple Podcasts', 'X'],
        contentPillar: 'Curated Stories & Investigative Pieces'
    },
    // HOSPITALITY & TRAVEL
    luxury_hotel: {
        keywords: ['boutique hotel', 'resort', 'concierge', 'hospitality', 'accommodation', 'luxury travel', 'destination', 'spa'],
        mode: 'B2C', scale: 'High-Ticket',
        fonts: { headers: 'Baskervville', body: 'Open Sans' },
        colors: { primary: '#1E3A8A', secondary: '#EFF6FF' },
        channels: ['Travel + Leisure', 'Instagram', 'OTA Optimization'],
        contentPillar: 'Escape Imagery & Signature Experiences'
    },
    restaurant_gastronomy: {
        keywords: ['fine dining', 'gastronomy', 'bistro', 'restaurant', 'michelin', 'culinary', 'farm-to-table', 'sommelier'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Josefin Sans', body: 'Nunito' },
        colors: { primary: '#7C2D12', secondary: '#FFF7ED' },
        channels: ['Google Maps', 'Instagram', 'Foodie Blogs'],
        contentPillar: 'Chef Stories & Visual Plating'
    },
    // NICHE SPECIALTIES
    pet_care: {
        keywords: ['pet food', 'dog trainer', 'veterinary', 'grooming', 'pet health', 'animal lovers', 'feline', 'canine'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Fredoka One', body: 'Quicksand' },
        colors: { primary: '#0891B2', secondary: '#CFFAFE' },
        channels: ['TikTok Animals', 'Facebook Groups', 'Local SEO'],
        contentPillar: 'Pet Health Tips & Heartwarming Rescues'
    },
    renewable_energy: {
        keywords: ['solar energy', 'wind power', 'sustainability', 'green energy', 'photovoltaic', 'clean tech', 'grid storage'],
        mode: 'B2B', scale: 'High-Ticket',
        fonts: { headers: 'Montserrat', body: 'Open Sans' },
        colors: { primary: '#15803D', secondary: '#DCFCE7' },
        channels: ['Sustainability Reports', 'LinkedIn', 'Government Tenders'],
        contentPillar: 'Energy Independence & Cost Savings'
    },
    event_planning: {
        keywords: ['wedding planner', 'corporate events', 'conference organizer', 'event production', 'party planner', 'exhibitions'],
        mode: 'B2C', scale: 'Mid-Range',
        fonts: { headers: 'Great Vibes', body: 'Montserrat' },
        colors: { primary: '#BE185D', secondary: '#FDF2F8' },
        channels: ['Pinterest', 'The Knot/Zola', 'Instagram'],
        contentPillar: 'Vibe Boards & Event Recaps'
    }
};

// ─── STAGE 2: BRAND ARCHETYPES (JUNGIAN) ───────────────────────────────────
const ARCHETYPES = [
    {
        name: 'The Creator',
        keywords: ['create', 'design', 'build', 'craft', 'innovate', 'make', 'produce', 'develop', 'invent', 'art', 'authentic'],
        voice: 'Innovative, Expressive, Original',
        shadow: 'Perfectionism, Over-complexity',
        strategy: 'Focus on the "Making of" and the vision behind the product.'
    },
    {
        name: 'The Ruler',
        keywords: ['lead', 'premium', 'exclusive', 'luxury', 'authority', 'power', 'control', 'elite', 'best', 'top', 'status'],
        voice: 'Commanding, Sophisticated, Refined',
        shadow: 'Arrogance, Rigidity',
        strategy: 'Highlight exclusivity and the feeling of being at the top.'
    },
    {
        name: 'The Explorer',
        keywords: ['discover', 'explore', 'adventure', 'travel', 'freedom', 'journey', 'independent', 'outdoor', 'new'],
        voice: 'Bold, Free-spirited, Rugged',
        shadow: 'Aimless wandering, Social isolation',
        strategy: 'Focus on transformation and the "New Frontier" experience.'
    },
    {
        name: 'The Sage',
        keywords: ['teach', 'learn', 'knowledge', 'expert', 'research', 'understand', 'wisdom', 'insight', 'data', 'truth'],
        voice: 'Wise, Objective, Intellectual',
        shadow: 'Over-intellectualizing, Inaction',
        strategy: 'Lead with data, evidence, and clear teaching frameworks.'
    },
    {
        name: 'The Hero',
        keywords: ['transform', 'empower', 'strength', 'challenge', 'overcome', 'achieve', 'win', 'results', 'impact', 'performance'],
        voice: 'Determined, Courageous, Strong',
        shadow: 'Ruthlessness, Workaholism',
        strategy: 'Highlight the transformation from "Struggle" to "Triumph".'
    },
    {
        name: 'The Magician',
        keywords: ['magic', 'visionary', 'possibility', 'catalyst', 'inspire', 'wow', 'intuitive', 'manifest', 'experience'],
        voice: 'Inspiring, Mystical, Charismatic',
        shadow: 'Manipulation, Deception',
        strategy: 'Focus on the "Aha!" moment and the effortless results.'
    }
];

// ─── STAGE 3: CORE UTILITIES ────────────────────────────────────────────────

// ─── STAGE 3: CORE UTILITIES ────────────────────────────────────────────────

const LOCALES = {
    fr: {
        industries: {
            enterprise_software: 'Logiciel Entreprise',
            consumer_app: 'Application Grand Public',
            ai_fintech: 'IA & Fintech',
            strategic_consulting: 'Conseil Stratégique',
            creative_agency: 'Agence Créative',
            coaching_education: 'Coaching & Éducation',
            street_apparel: 'Streetwear & Mode',
            luxury_fashion: 'Mode de Luxe',
            sustainable_retail: 'Commerce Durable',
            direct_to_consumer: 'Vente Directe (DTC)',
            medical_practice: 'Cabinet Médical',
            mental_wellness: 'Bien-être Mental',
            professional_fitness: 'Fitness Professionnel',
            real_estate_luxury: 'Immobilier de Luxe',
            logistics_manufacturing: 'Logistique & Fabrication',
            legal_services: 'Services Juridiques',
            photography_video: 'Photographie & Vidéo',
            publishing_media: 'Édition & Médias',
            luxury_hotel: 'Hôtellerie de Luxe',
            restaurant_gastronomy: 'Restaurant & Gastronomie',
            pet_care: 'Soins aux Animaux',
            renewable_energy: 'Énergie Renouvelable',
            event_planning: 'Événementiel'
        },
        archetypes: {
            'The Creator': {
                name: 'Le Créateur',
                voice: 'Innovant, Expressif, Original',
                shadow: 'Perfectionnisme, Sur-complexité',
                strategy: 'Concentrez-vous sur la "Fabrication" et la vision derrière le produit.'
            },
            'The Ruler': {
                name: 'Le Souverain',
                voice: 'Commandant, Sophistiqué, Raffiné',
                shadow: 'Arrogance, Rigidité',
                strategy: 'Mettez en avant l\'exclusivité et le sentiment d\'être au sommet.'
            },
            'The Explorer': {
                name: 'L\'Explorateur',
                voice: 'Audacieux, Esprit Libre, Robuste',
                shadow: 'Errance sans but, Isolement social',
                strategy: 'Concentrez-vous sur la transformation et l\'expérience de la "Nouvelle Frontière".'
            },
            'The Sage': {
                name: 'Le Sage',
                voice: 'Sage, Objectif, Intellectuel',
                shadow: 'Sur-intellectualisation, Inaction',
                strategy: 'Menez avec des données, des preuves et des cadres d\'enseignement clairs.'
            },
            'The Hero': {
                name: 'Le Héros',
                voice: 'Déterminé, Courageux, Fort',
                shadow: 'Impitoyable, Bourreau de travail',
                strategy: 'Mettez en avant la transformation de la "Lutte" au "Triomphe".'
            },
            'The Magician': {
                name: 'Le Magicien',
                voice: 'Inspirant, Mystique, Charismatique',
                shadow: 'Manipulation, Déception',
                strategy: 'Concentrez-vous sur le moment "Aha!" et les résultats sans effort.'
            }
        },
        rationale: (maxScore, industryName, archetype, mode) =>
            `Basée sur une concentration ${maxScore > 2 ? 'élevée' : 'modérée'} de terminologie ${industryName} et des signaux archétypaux ${archetype.name}, cette stratégie donne la priorité à ${mode === 'B2B' ? "l'Autorité et la Confiance" : "l'Émotion et la Communauté"}. La voix ${archetype.voice} est utilisée pour minimiser le risque de ${archetype.shadow.toLowerCase()} tout en maximisant ${mode === 'B2B' ? 'le ROI' : 'la Valeur Personnelle'}.`,
        tips: {
            clarity: "⚠️ CLARTÉ : Votre description est trop vague. Indiquez explicitement CE QUE vous offrez pour améliorer la stratégie.",
            precision: "📊 PRÉCISION : Ajoutez des chiffres spécifiques (ROI, années, taille d'équipe, % de résultats) pour instaurer une confiance immédiate.",
            differentiation: "💎 DIFFÉRENCIATION : Vous semblez généraliste. Ajoutez une phrase 'Pourquoi nous' utilisant votre méthodologie unique.",
            b2b: "🏢 B2B : Concentrez-vous sur les études de cas et les livres blancs. Vos acheteurs doivent minimiser les risques personnels.",
            b2c: "✨ B2C : Réduisez la distance entre 'Voir' et 'Acheter' avec une preuve sociale et des appels à l'action clairs."
        },
        salesSystem: {
            product: (brandName, industryName, isB2B) => isB2B
                ? `${brandName} acquiert de nouveaux clients grâce à un entonnoir de contenu stratégique : leadership éclairé sur LinkedIn, aimants à prospects ciblés (références ${industryName}, check-lists d'audit) et séquences d'e-mails automatisées qui éduquent et renforcent l'autorité avant la vente.`
                : `${brandName} attire de nouveaux clients grâce à un contenu visuellement attrayant et des campagnes sociales ciblées. Les premiers acheteurs bénéficient d'une expérience d'accueil personnalisée qui maximise immédiatement la valeur perçue grâce à des livrables ${industryName} de haute qualité.`,
            reorder: (brandName, industryName, isB2B) => isB2B
                ? `La rétention des clients est portée par des revues trimestrielles montrant des résultats mesurables, un accès exclusif aux nouvelles fonctionnalités et un processus de succès dédié qui identifie proactivement les opportunités d'expansion.`
                : `Les achats répétés sont encouragés par un programme de fidélité, des recommandations personnalisées et un accès anticipé exclusif aux nouveautés. Des modèles d'abonnement sont utilisés le cas échéant pour réduire la friction.`,
            opportunity: (brandName, industryName, isB2B) => isB2B
                ? `Opportunités d'expansion du marché : (1) Verticaux industriels adjacents, (2) Marchés internationaux avec offres localisées, (3) Écosystème de partenariat, (4) Niveau entreprise pour les grands comptes.`
                : `Opportunités de croissance : (1) Extensions de gamme basées sur les données clients, (2) Collections saisonnières ou limitées, (3) Expansion géographique locale, (4) Programme d'ambassadeurs communautaires.`,
            upsell: (brandName, industryName, isB2B) => isB2B
                ? `La stratégie de vente incitative se concentre sur : niveaux de support premium, analyses avancées, intégrations personnalisées et accès API, forfaits de formation et incitations contractuelles annuelles.`
                : `Le panier moyen augmente via : groupement intelligent de produits, recommandations basées sur l'historique, versions premium d'articles populaires et offres complémentaires au paiement.`,
            team: (brandName, industryName, isB2B) => isB2B
                ? `Structure d'équipe légère : 1 Responsable Stratégique, 1 Success Manager, 1 Stratège Contenu. Évoluez en ajoutant des chefs de projet spécialisés par vertical industriel.`
                : `Équipe centrale : 1 Directeur Créatif/Marque, 1 Community Manager, 1 Marketeur Croissance. Évoluez avec des créateurs de contenu indépendants et un support saisonnier.`
        },
        fallbacks: {
            avatarNameB2B: 'Le Décideur Stratégique',
            avatarNameB2C: 'L\'Individu en Quête de Valeur',
            primaryPain: 'Inefficacité et manque de direction stratégique claire',
            coreDesireB2B: 'ROI Prévisible & Expansion',
            coreDesireB2C: 'Transformation Personnelle & Facilité',
            uvpB2B: (industryName, archetype) => `Le partenaire ${industryName} premium utilisant un cadre ${archetype} pour générer des résultats probants.`,
            uvpB2C: (industryName, archetype) => `La seule marque ${industryName} utilisant une approche ${archetype} pour redéfinir le style de vie.`,
            action: (channel, voice) => `Auditer votre présence sur ${channel} pour assurer la cohérence de la voix ${voice}.`
        }
    }
};

function analyzeSentiment(text) {
    const positive = ['easy', 'fast', 'premium', 'best', 'growth', 'simple', 'innovative', 'effective', 'reliable'];
    const negative = ['struggle', 'expensive', 'slow', 'hard', 'frustrating', 'lack', 'broken', 'inefficient'];

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach(w => {
        if (positive.includes(w)) score++;
        if (negative.includes(w)) score--;
    });
    return score >= 0 ? 'Positive/Growth' : 'Identifying/Pain-focused';
}

function evaluateScores(name, description) {
    const words = description.split(/\s+/).length;
    const hasNumbers = /\d+/.test(description);
    const hasUVP = /(only|unique|first|exclusive|proprietary|unlike|better|best)/i.test(description);
    const hasAudience = /(for|targeting|helping|dedicated to|built for)/i.test(description);

    return {
        clarity: Math.min(100, (words / 50) * 30 + (hasAudience ? 40 : 10) + (hasUVP ? 30 : 10)),
        precision: Math.min(100, (hasNumbers ? 50 : 20) + (words > 100 ? 50 : 30)),
        differentiation: Math.min(100, (hasUVP ? 60 : 20) + (description.length > 500 ? 40 : 20))
    };
}

// ─── STAGE 4: PIPELINE ──────────────────────────────────────────────────────

export function analyzeOffline({ name, description, language = 'en' }) {
    const lowerDesc = description.toLowerCase();

    // 1. Industry Heuristic
    let industryKey = 'direct_to_consumer'; // Safer default than Consulting
    let maxScore = -1;
    for (const [key, data] of Object.entries(INDUSTRY_MAP)) {
        let score = 0;
        data.keywords.forEach(kw => {
            if (lowerDesc.includes(kw)) score++;
        });
        // Increase sensitivity: Only switch if we actually match keywords
        if (score > 0 && score > maxScore) {
            maxScore = score;
            industryKey = key;
        }
    }
    const industry = INDUSTRY_MAP[industryKey];

    // 2. Mode Detection (B2B vs B2C)
    // Heuristic: Boost B2C if industry scale is retail-oriented
    const b2bWeight = (description.match(/(enterprise|corporate|professional|business|team|b2b|roi|client|decision maker|procurement|infrastructure|deployment)/gi) || []).length;
    const b2cWeight = (description.match(/(consumer|lifestyle|personal|home|fashion|b2c|user|customer|individual|family|pet|style|wear|street|vibe|culture|drops)/gi) || []).length + (industry.mode === 'B2C' ? 2 : 0);
    const mode = b2bWeight >= b2cWeight ? 'B2B' : 'B2C';

    // 3. Archetype Detection
    let archetypeRaw = ARCHETYPES[0];
    let maxArchScore = -1;
    ARCHETYPES.forEach(a => {
        let sc = 0;
        if (a.keywords) {
            a.keywords.forEach(k => { if (lowerDesc.includes(k)) sc++; });
        }
        if (sc > maxArchScore) {
            maxArchScore = sc;
            archetypeRaw = a;
        }
    });

    // Localize Industry and Archetype data if French
    let industryName = industryKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let archetype = { ...archetypeRaw };

    if (language === 'fr' && LOCALES.fr) {
        industryName = LOCALES.fr.industries[industryKey] || industryName;
        if (LOCALES.fr.archetypes[archetype.name]) {
            const locArch = LOCALES.fr.archetypes[archetype.name];
            archetype.name = locArch.name;
            archetype.voice = locArch.voice;
            archetype.shadow = locArch.shadow;
            archetype.strategy = locArch.strategy;
        }
    }

    // 4. Score Calculation
    const scores = evaluateScores(name, description);

    // 5. Strategic Rationale
    let rationale = `Based on the ${maxScore > 2 ? 'high' : 'moderate'} concentration of ${industryName} terminology and ${archetype.name} archetypal signals, this strategy prioritizes ${mode === 'B2B' ? 'Authority & Trust' : 'Emotion & Community'}. The ${archetype.voice} voice is used to minimize the risk of ${archetype.shadow.toLowerCase()} while maximizing ${mode === 'B2B' ? 'ROI' : 'Personal Value'}.`;

    if (language === 'fr' && LOCALES.fr) {
        rationale = LOCALES.fr.rationale(maxScore, industryName, archetype, mode);
    }

    const salesSystem = generateSalesSystem(industryKey, archetype, mode, name || 'The Brand', language, industryName);

    // 6. Assemble Full Response (Compass Schema)
    const isFR = language === 'fr' && LOCALES.fr;
    const loc = isFR ? LOCALES.fr.fallbacks : {};

    return {
        brand: {
            name: name || (isFR ? 'La Marque' : 'The Brand'),
            description: description.slice(0, 150) + (description.length > 150 ? '...' : ''),
            fonts: industry.fonts,
            colors: industry.colors,
            keywords: [industryName, archetype.name, mode]
        },
        scores,
        rationale,
        salesSystem,
        profiles: {
            identity: {
                archetype: archetype.name,
                voice: archetype.voice,
                shadow: archetype.shadow
            },
            offer: {
                coreOffer: description.slice(0, 80) + (description.length > 80 ? '...' : ''),
                uvp: mode === 'B2B'
                    ? (isFR ? loc.uvpB2B(industryName, archetype.name) : `The premium ${industryName} partner using a ${archetype.name} framework to drive ${industry.scale} results.`)
                    : (isFR ? loc.uvpB2C(industryName, archetype.name) : `The only ${industryName} brand using a ${archetype.name} approach to redefine ${industry.scale} lifestyle.`)
            },
            audience: {
                avatarName: mode === 'B2B'
                    ? (isFR ? loc.avatarNameB2B : 'The Strategic Decision Maker')
                    : (isFR ? loc.avatarNameB2C : 'The Value-Seeking Individual'),
                primaryPain: isFR ? loc.primaryPain : 'Inefficiency and lack of clear strategic direction',
                coreDesire: mode === 'B2B'
                    ? (isFR ? loc.coreDesireB2B : 'Predictable ROI & Expansion')
                    : (isFR ? loc.coreDesireB2C : 'Personal Transformation & Ease')
            },
            execution: {
                channel: industry.channels.join(' & '),
                contentPillar: industry.contentPillar,
                immediateAction: isFR
                    ? loc.action(industry.channels[0], archetype.voice)
                    : `Audit current ${industry.channels[0]} presence for ${archetype.voice} consistency.`
            }
        },
        optimizationTips: generateTips(scores, description, mode, language),
        toolData: {
            brand: { brandName: name, industry: industryName, personality: archetype.name },
            product: { productName: name, problemSolved: mode === 'B2B' ? (isFR ? 'Inefficacité dans ' + industryName : 'Inefficiency in ' + industryName) : (isFR ? 'Manque d\'identité ' + industryName : 'Lack of ' + industryName + ' identity') },
            prospect: { prospectType: mode.toLowerCase() }
        },
        _meta: {
            source: 'offline_v2',
            industry: industryKey,
            prospectType: mode,
            analyzedAt: new Date().toISOString()
        }
    };
}

function generateTips(scores, description, mode, language) {
    const isFR = language === 'fr' && LOCALES.fr;
    const t = isFR ? LOCALES.fr.tips : {
        clarity: "⚠️ CLARITY: Your description is too vague. Explicitly state WHAT you offer to improve the strategy.",
        precision: "📊 PRECISION: Add specific numbers (ROI, years, team size, % results) to build immediate trust.",
        differentiation: "💎 DIFFERENTIATION: You sound like a generalist. Add a 'Why Us' sentence using your unique methodology.",
        b2b: "🏢 B2B: Focus on Case Studies and Whitepapers. Your buyers need to minimize personal risk.",
        b2c: "✨ B2C: Shorten the distance between 'Seeing' and 'Buying' with social proof and clear CTAs."
    };

    const tips = [];
    if (scores.clarity < 60) tips.push(t.clarity);
    if (scores.precision < 50) tips.push(t.precision);
    if (scores.differentiation < 50) tips.push(t.differentiation);
    if (mode === 'B2B') tips.push(t.b2b);
    else tips.push(t.b2c);
    return tips.slice(0, 4);
}

function generateSalesSystem(industryKey, archetype, mode, brandName, language, industryName) {
    const isB2B = mode === 'B2B';
    const isFR = language === 'fr' && LOCALES.fr;

    if (isFR) {
        const s = LOCALES.fr.salesSystem;
        return {
            product: s.product(brandName, industryName, isB2B),
            reorder: s.reorder(brandName, industryName, isB2B),
            opportunity: s.opportunity(brandName, industryName, isB2B),
            upsell: s.upsell(brandName, industryName, isB2B),
            team: s.team(brandName, industryName, isB2B)
        };
    }

    return {
        product: isB2B
            ? `${brandName} acquires new clients through a strategic content funnel: thought leadership on LinkedIn, targeted lead magnets (${industryName} benchmarks, audit checklists), and automated email nurture sequences that educate and build authority before the sales conversation.`
            : `${brandName} attracts new customers through visually compelling content and targeted social campaigns. First-time buyers receive a curated onboarding experience that maximizes perceived value immediately through high-quality ${industryName} deliverables.`,
        reorder: isB2B
            ? `Client retention is driven by quarterly business reviews showing measurable results, exclusive access to new features before public release, and a dedicated success process that proactively identifies expansion opportunities.`
            : `Repeat purchases are incentivized through a loyalty program, personalized recommendations via email, and exclusive early access to new releases. Subscription models are utilized where applicable to reduce friction for regular users.`,
        opportunity: isB2B
            ? `Market expansion opportunities include: (1) Adjacent industry verticals, (2) International markets with localized offerings, (3) Partnership ecosystem with complementary platforms, (4) Enterprise tier for larger accounts.`
            : `Growth opportunities include: (1) Product line extensions based on customer data, (2) Seasonal or limited-edition collections, (3) Geographic expansion via localized marketing, (4) Community-driven brand ambassador program.`,
        upsell: isB2B
            ? `Upsell strategy focuses on: premium support tiers, advanced analytics add-ons, custom integrations and API access, team training packages, and annual contract incentives.`
            : `Average order value increases through: intelligent product bundling, in-cart recommendations powered by history, premium/upgraded versions of popular items, and limited-time add-on offers at checkout.`,
        team: isB2B
            ? `Lean team structure: 1 Strategic Lead, 1 Customer Success Manager, 1 Content Strategist. Scale by adding specialized project managers by industry vertical.`
            : `Core team: 1 Brand/Creative Director, 1 Community Manager, 1 Growth Marketer. Scale with freelance content creators and seasonal support.`
    };
}

export default analyzeOffline;
