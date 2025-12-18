/**
 * Dynamic Slide Selection for Wrapped Refectory
 * Intelligently selects the most impactful slides based on user profile
 */

// ============================================
// SLIDE DEFINITIONS
// ============================================

export const SLIDE_TYPES = {
  INTRO: 'intro',
  STATS_OVERVIEW: 'stats_overview',
  TOP_DISHES: 'top_dishes',
  CULINARY_PROFILE: 'culinary_profile',
  AI_TITLE: 'ai_title',
  SAVINGS: 'savings',
  FAVORITE_MONTH: 'favorite_month',
  DESSERTS: 'desserts',
  ORDER_HABITS: 'order_habits',
  RECIPES: 'recipes',
  PREDICTIONS: 'predictions',
  CONCLUSION: 'conclusion'
};

// ============================================
// SCORING FUNCTIONS
// ============================================

/**
 * Score each potential slide based on user data
 * Higher score = more impactful for this user
 * @param {object} yearData - Calculated year statistics
 * @param {object} classification - AI classification results
 * @returns {Array} - Scored slides sorted by impact
 */
export function scoreSlides(yearData, classification) {
  const scores = [];

  // Stats Overview - Always relevant
  scores.push({
    type: SLIDE_TYPES.STATS_OVERVIEW,
    score: 100, // Base score, always included
    data: {
      totalOrders: yearData.totalOrders,
      totalUniqueDishes: yearData.totalUniqueDishes
    }
  });

  // Top Dishes - Score based on how dominant the top dish is
  const topDishRatio = yearData.topDishes[0]?.count / yearData.totalOrders;
  scores.push({
    type: SLIDE_TYPES.TOP_DISHES,
    score: topDishRatio > 0.2 ? 90 : topDishRatio > 0.1 ? 70 : 50,
    data: { topDishes: yearData.topDishes }
  });

  // Culinary Profile - Always interesting if we have classification
  if (classification) {
    scores.push({
      type: SLIDE_TYPES.CULINARY_PROFILE,
      score: 85,
      data: { classification }
    });
  }

  // AI Title - High impact personalization
  scores.push({
    type: SLIDE_TYPES.AI_TITLE,
    score: 95,
    data: { title: yearData.aiTitle }
  });

  // Savings - Score based on amount saved
  const savingsScore = yearData.discountSaved > 50 ? 85 : 
                       yearData.discountSaved > 20 ? 70 : 
                       yearData.discountSaved > 5 ? 50 : 30;
  scores.push({
    type: SLIDE_TYPES.SAVINGS,
    score: savingsScore,
    data: {
      totalSpent: yearData.totalSpent,
      discountSaved: yearData.discountSaved,
      fidelities: yearData.fidelities
    }
  });

  // Favorite Month - Interesting if there's a clear winner
  const monthVariance = calculateMonthVariance(yearData.monthlyOrders || {});
  scores.push({
    type: SLIDE_TYPES.FAVORITE_MONTH,
    score: monthVariance > 0.5 ? 80 : 60,
    data: {
      topMonth: yearData.topMonth,
      topMonthCount: yearData.topMonthCount
    }
  });

  // Desserts - Only if they ordered desserts
  const dessertRatio = yearData.dessertsOrdersCount / yearData.totalOrders;
  if (yearData.dessertsOrdersCount > 0) {
    scores.push({
      type: SLIDE_TYPES.DESSERTS,
      score: dessertRatio > 0.5 ? 85 : dessertRatio > 0.3 ? 70 : 55,
      data: {
        dessertsOrdersCount: yearData.dessertsOrdersCount,
        favoriteDessert: yearData.favoriteDessert
      }
    });
  }

  // Order Habits - If there's a clear pattern
  if (yearData.averageOrderPosition && yearData.averageOrderPosition < 20) {
    scores.push({
      type: SLIDE_TYPES.ORDER_HABITS,
      score: 65,
      data: {
        averagePosition: yearData.averageOrderPosition,
        averageSpent: yearData.averageSpent
      }
    });
  }

  // Recipes - High value, always include if we have AI
  scores.push({
    type: SLIDE_TYPES.RECIPES,
    score: 88,
    data: { recipes: yearData.recipes }
  });

  // Predictions - Fun end slide
  if (yearData.predictions) {
    scores.push({
      type: SLIDE_TYPES.PREDICTIONS,
      score: 75,
      data: { predictions: yearData.predictions }
    });
  }

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Calculate variance in monthly orders to determine if there's a standout month
 */
function calculateMonthVariance(monthlyOrders) {
  const values = Object.values(monthlyOrders);
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance) / mean; // Coefficient of variation
}

// ============================================
// SLIDE SELECTION
// ============================================

/**
 * Select the best slides for this user (6-7 max)
 * @param {object} yearData - Year statistics
 * @param {object} classification - AI classification
 * @returns {Array} - Selected slide configurations
 */
export function selectBestSlides(yearData, classification) {
  const slides = [];
  
  // 1. INTRO - Always first
  slides.push({
    type: SLIDE_TYPES.INTRO,
    data: { language: yearData.language }
  });

  // 2. Score and select middle slides
  const scoredSlides = scoreSlides(yearData, classification);
  
  // Take top 4-5 slides (excluding ones we handle separately)
  const excludedTypes = [SLIDE_TYPES.RECIPES, SLIDE_TYPES.AI_TITLE];
  const middleSlides = scoredSlides
    .filter(s => !excludedTypes.includes(s.type))
    .slice(0, 4);
  
  slides.push(...middleSlides);

  // 3. AI TITLE - Always include if available (high impact)
  const aiTitleSlide = scoredSlides.find(s => s.type === SLIDE_TYPES.AI_TITLE);
  if (aiTitleSlide) {
    slides.push(aiTitleSlide);
  }

  // 4. RECIPES - Include if we have them (high value)
  const recipesSlide = scoredSlides.find(s => s.type === SLIDE_TYPES.RECIPES);
  if (recipesSlide && recipesSlide.data.recipes?.length > 0) {
    slides.push(recipesSlide);
  }

  // 5. CONCLUSION - Always last
  slides.push({
    type: SLIDE_TYPES.CONCLUSION,
    data: { language: yearData.language }
  });

  return slides;
}

// ============================================
// USER PROFILE DETECTION
// ============================================

/**
 * Detect user profile type for personalization
 * @param {object} yearData - Year statistics
 * @returns {string} - Profile type
 */
export function detectUserProfile(yearData) {
  const { 
    totalOrders, 
    totalUniqueDishes, 
    dessertsOrdersCount,
    discountSaved,
    topDishes 
  } = yearData;

  // Calculate ratios
  const diversityRatio = totalUniqueDishes / totalOrders;
  const dessertRatio = dessertsOrdersCount / totalOrders;
  const topDishDominance = topDishes[0]?.count / totalOrders;

  // Determine profile
  if (totalOrders >= 100) return 'power_user';
  if (topDishDominance > 0.4) return 'loyal_fan';
  if (diversityRatio > 0.8) return 'explorer';
  if (dessertRatio > 0.5) return 'dessert_lover';
  if (discountSaved > 50) return 'smart_saver';
  if (totalOrders >= 50) return 'regular';
  
  return 'casual';
}

/**
 * Get personalized messages based on profile
 * @param {string} profile - User profile type
 * @param {string} language - 'fr' or 'en'
 * @returns {object} - Personalized messages
 */
export function getProfileMessages(profile, language = 'fr') {
  const messages = {
    fr: {
      power_user: {
        badge: '🏆 Power User',
        message: 'Tu es un vrai habitué ! Refectory n\'a plus de secrets pour toi.'
      },
      loyal_fan: {
        badge: '❤️ Fan Inconditionnel',
        message: 'Quand tu trouves ton plat, tu t\'y accroches !'
      },
      explorer: {
        badge: '🧭 Explorateur Culinaire',
        message: 'Toujours à la recherche de nouvelles saveurs !'
      },
      dessert_lover: {
        badge: '🍰 Team Dessert',
        message: 'La vie est trop courte pour sauter le dessert !'
      },
      smart_saver: {
        badge: '💰 Malin du Porte-Monnaie',
        message: 'Tu sais profiter des bonnes affaires !'
      },
      regular: {
        badge: '⭐ Client Fidèle',
        message: 'Refectory fait partie de ta routine !'
      },
      casual: {
        badge: '👋 Nouveau Gourmand',
        message: 'Bienvenue dans l\'aventure culinaire !'
      }
    },
    en: {
      power_user: {
        badge: '🏆 Power User',
        message: 'You\'re a true regular! Refectory has no secrets for you.'
      },
      loyal_fan: {
        badge: '❤️ Loyal Fan',
        message: 'When you find your dish, you stick with it!'
      },
      explorer: {
        badge: '🧭 Culinary Explorer',
        message: 'Always on the hunt for new flavors!'
      },
      dessert_lover: {
        badge: '🍰 Team Dessert',
        message: 'Life is too short to skip dessert!'
      },
      smart_saver: {
        badge: '💰 Smart Saver',
        message: 'You know how to get a good deal!'
      },
      regular: {
        badge: '⭐ Loyal Customer',
        message: 'Refectory is part of your routine!'
      },
      casual: {
        badge: '👋 New Foodie',
        message: 'Welcome to the culinary adventure!'
      }
    }
  };

  return messages[language]?.[profile] || messages.fr.casual;
}

export default {
  SLIDE_TYPES,
  scoreSlides,
  selectBestSlides,
  detectUserProfile,
  getProfileMessages
};
