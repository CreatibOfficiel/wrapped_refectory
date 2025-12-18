/**
 * AI Service for Wrapped Refectory
 * Handles LLM API calls for classification, titles, and recipes
 */

// Configuration - User should set their API key
const AI_CONFIG = {
  provider: 'openai', // 'openai' | 'anthropic'
  apiKey: '', // Set via setApiKey()
  model: 'gpt-4o-mini', // or 'claude-3-haiku-20240307'
};

/**
 * Set the API key for LLM calls
 * @param {string} key - API key
 * @param {string} provider - 'openai' or 'anthropic'
 */
export function setApiKey(key, provider = 'openai') {
  AI_CONFIG.apiKey = key;
  AI_CONFIG.provider = provider;
  AI_CONFIG.model = provider === 'openai' ? 'gpt-4o-mini' : 'claude-3-haiku-20240307';
}

/**
 * Generic LLM call function
 * @param {string} prompt - The prompt to send
 * @param {object} options - Additional options
 * @returns {Promise<string>} - LLM response
 */
async function callLLM(prompt, options = {}) {
  if (!AI_CONFIG.apiKey) {
    console.warn('AI API key not set, returning mock response');
    return mockResponse(prompt);
  }

  try {
    if (AI_CONFIG.provider === 'openai') {
      return await callOpenAI(prompt, options);
    } else {
      return await callAnthropic(prompt, options);
    }
  } catch (error) {
    console.error('LLM API error:', error);
    return mockResponse(prompt);
  }
}

async function callOpenAI(prompt, options) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: 'Tu es un assistant culinaire humoristique pour une app de récapitulatif annuel de commandes de repas. Réponds en français, de manière fun et engageante.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.8
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callAnthropic(prompt, options) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_CONFIG.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      max_tokens: options.maxTokens || 500,
      system: 'Tu es un assistant culinaire humoristique pour une app de récapitulatif annuel de commandes de repas. Réponds en français, de manière fun et engageante.',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  return data.content[0]?.text || '';
}

/**
 * Mock responses for development/fallback
 */
function mockResponse(prompt) {
  if (prompt.includes('titre') || prompt.includes('title')) {
    return 'Le Conquistador du Poulet Rôti 🍗👑';
  }
  if (prompt.includes('recette') || prompt.includes('recipe')) {
    return `## Recette Maison

**Ingrédients (2 personnes)**
- 200g de l'ingrédient principal
- Assaisonnements au goût
- Huile d'olive

**Préparation (30 min)**
1. Préparer les ingrédients
2. Cuire à feu moyen
3. Assaisonner et servir

**Conseil du chef** : Servir bien chaud !`;
  }
  if (prompt.includes('classif') || prompt.includes('profil')) {
    return JSON.stringify({
      mainCategory: 'Équilibré',
      categories: { viande: 45, végétarien: 30, poisson: 15, autre: 10 },
      personality: 'Aventurier modéré'
    });
  }
  return 'Réponse IA simulée';
}

// ============================================
// CLASSIFICATION DES PLATS
// ============================================

/**
 * Classify dishes and create a culinary profile
 * @param {Array} orders - List of orders with products
 * @returns {Promise<object>} - Classification result
 */
export async function classifyDishes(orders) {
  // Extract all dish names
  const allDishes = [];
  orders.forEach(order => {
    order.products.forEach(product => {
      allDishes.push(product.title);
    });
  });

  const uniqueDishes = [...new Set(allDishes)];
  const dishCounts = {};
  allDishes.forEach(dish => {
    dishCounts[dish] = (dishCounts[dish] || 0) + 1;
  });

  const prompt = `Analyse ces plats commandés et crée un profil culinaire.

Plats (avec nombre de commandes):
${Object.entries(dishCounts).slice(0, 30).map(([dish, count]) => `- "${dish}" (${count}x)`).join('\n')}

Réponds UNIQUEMENT en JSON valide avec cette structure:
{
  "mainCategory": "Le type dominant (ex: Carnivore, Végétarien, Équilibré, Poisson-lover, Gourmand)",
  "categories": {
    "viande": <pourcentage>,
    "végétarien": <pourcentage>,
    "poisson": <pourcentage>,
    "dessert": <pourcentage>
  },
  "personality": "Une phrase fun décrivant le style culinaire (ex: L'explorateur audacieux, Le fidèle gourmand)",
  "signature": "Le plat signature de l'utilisateur",
  "funFact": "Un fait amusant basé sur les commandes"
}`;

  const response = await callLLM(prompt, { temperature: 0.7 });
  
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse classification:', e);
  }

  // Fallback classification
  return {
    mainCategory: 'Gourmand',
    categories: { viande: 40, végétarien: 30, poisson: 15, dessert: 15 },
    personality: 'Le gourmet curieux',
    signature: uniqueDishes[0] || 'Plat mystère',
    funFact: `Tu as goûté ${uniqueDishes.length} plats différents cette année !`
  };
}

// ============================================
// TITRE PERSONNALISÉ
// ============================================

/**
 * Generate a personalized culinary title
 * @param {object} stats - Year statistics
 * @param {object} classification - Classification result
 * @returns {Promise<string>} - Generated title
 */
export async function generateTitle(stats, classification) {
  const prompt = `Génère UN titre humoristique et créatif (max 8 mots) pour définir ce profil culinaire:

Stats:
- ${stats.totalOrders} commandes cette année
- Plat préféré: "${stats.topDish}" (commandé ${stats.topDishCount}x)
- ${stats.uniqueDishes} plats différents testés
- ${stats.dessertRatio}% des commandes avec dessert
- Profil: ${classification.mainCategory}
- Personnalité: ${classification.personality}

Le titre doit être:
- Drôle et mémorable
- Avec un emoji approprié à la fin
- Style: "Le [Adjectif] [Métaphore culinaire]" ou "[Titre épique] de [Plat]"

Exemples: "Le Conquistador du Burger 🍔", "L'Archéologue des Saveurs 🔍", "Champion Toutes Catégories du Poulet 🏆"

Réponds UNIQUEMENT avec le titre, rien d'autre.`;

  const title = await callLLM(prompt, { temperature: 0.9, maxTokens: 50 });
  return title.trim().replace(/^["']|["']$/g, '');
}

// ============================================
// GÉNÉRATION DE RECETTES
// ============================================

/**
 * Generate a recipe for a dish
 * @param {string} dishName - Name of the dish
 * @returns {Promise<object>} - Recipe object
 */
export async function generateRecipe(dishName) {
  const prompt = `Génère une recette maison simple pour reproduire "${dishName}".

Format de réponse en JSON:
{
  "name": "${dishName}",
  "prepTime": "XX min",
  "cookTime": "XX min",
  "servings": 2,
  "difficulty": "Facile|Moyen|Difficile",
  "ingredients": [
    "Ingrédient 1 avec quantité",
    "Ingrédient 2 avec quantité"
  ],
  "steps": [
    "Étape 1 claire et concise",
    "Étape 2 claire et concise"
  ],
  "chefTip": "Un conseil du chef pour réussir le plat"
}

Réponds UNIQUEMENT en JSON valide.`;

  const response = await callLLM(prompt, { temperature: 0.7, maxTokens: 800 });
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse recipe:', e);
  }

  // Fallback recipe
  return {
    name: dishName,
    prepTime: '15 min',
    cookTime: '20 min',
    servings: 2,
    difficulty: 'Moyen',
    ingredients: [
      'Ingrédients à adapter selon le plat',
      'Sel et poivre',
      'Huile d\'olive'
    ],
    steps: [
      'Préparer tous les ingrédients',
      'Cuire selon les instructions',
      'Assaisonner et servir chaud'
    ],
    chefTip: 'La qualité des ingrédients fait toute la différence !'
  };
}

/**
 * Generate recipes for top dishes
 * @param {Array} topDishes - Array of {title, count}
 * @returns {Promise<Array>} - Array of recipes
 */
export async function generateRecipes(topDishes) {
  const recipes = [];
  
  // Generate for top 3 dishes max
  const dishesToProcess = topDishes.slice(0, 3);
  
  for (const dish of dishesToProcess) {
    const recipe = await generateRecipe(dish.title);
    recipes.push(recipe);
  }
  
  return recipes;
}

// ============================================
// PRÉDICTIONS 2025
// ============================================

/**
 * Generate 2025 predictions based on 2024 habits
 * @param {object} stats - Year statistics
 * @param {object} classification - Classification result
 * @returns {Promise<object>} - Predictions
 */
export async function generatePredictions(stats, classification) {
  const prompt = `Basé sur ce profil culinaire 2024, génère des prédictions fun pour 2025:

Profil:
- ${stats.totalOrders} commandes
- Plat favori: ${stats.topDish}
- Catégorie principale: ${classification.mainCategory}
- Personnalité: ${classification.personality}

Réponds en JSON:
{
  "dishToTry": "Un plat que l'utilisateur devrait essayer en 2025",
  "prediction": "Une prédiction humoristique sur ses habitudes 2025",
  "challenge": "Un défi culinaire personnalisé pour 2025"
}`;

  const response = await callLLM(prompt, { temperature: 0.8 });
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse predictions:', e);
  }

  return {
    dishToTry: 'Un nouveau plat à découvrir',
    prediction: 'Tu vas continuer à régaler tes papilles !',
    challenge: 'Essayer 10 nouveaux plats cette année'
  };
}

// Export all functions
export default {
  setApiKey,
  classifyDishes,
  generateTitle,
  generateRecipe,
  generateRecipes,
  generatePredictions
};
