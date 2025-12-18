/**
 * Wrapped Refectory 2024 - Main Application
 * Enhanced with Three.js animations, AI features, and dynamic slides
 */

// Note: In production, these would be ES6 imports with a bundler
// For Chrome extension, we'll use a bundled version or inline the code

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  fr: {
    intro: {
      title: "Bienvenue dans votre Wrapped 2024 ! 🍽️",
      subtitle: "Découvrez votre année culinaire avec Refectory",
      cta: "C'est parti !"
    },
    stats: {
      ordersTitle: "Vos commandes",
      orders: "commandes passées",
      dishes: "plats différents testés",
      explorer: "Vous êtes un vrai explorateur culinaire ! 🧭"
    },
    podium: {
      title: "Votre Top 3 des plats",
      times: "fois"
    },
    profile: {
      title: "Votre Profil Culinaire",
      category: "Catégorie dominante",
      personality: "Personnalité"
    },
    savings: {
      title: "Vos économies 2024",
      spent: "dépensés",
      saved: "économisés",
      points: "points fidélité"
    },
    month: {
      title: "Votre mois gourmand",
      orders: "commandes"
    },
    desserts: {
      title: "Team Dessert ? 🍰",
      count: "desserts commandés",
      favorite: "Votre chouchou"
    },
    aiTitle: {
      title: "Votre titre culinaire 2024"
    },
    recipes: {
      title: "Vos recettes à refaire 📖",
      subtitle: "Reproduisez vos plats favoris à la maison",
      download: "Télécharger les recettes",
      prep: "Préparation",
      cook: "Cuisson",
      tip: "Conseil du chef"
    },
    conclusion: {
      title: "Merci pour cette année ! 🙏",
      message: "À l'année prochaine pour encore plus de saveurs !",
      share: "Partagez votre Wrapped"
    },
    buttons: {
      prev: "Précédent",
      next: "Suivant"
    },
    noOrders: "Aucune commande trouvée pour 2024."
  },
  en: {
    intro: {
      title: "Welcome to your 2024 Wrapped! 🍽️",
      subtitle: "Discover your culinary year with Refectory",
      cta: "Let's go!"
    },
    stats: {
      ordersTitle: "Your orders",
      orders: "orders placed",
      dishes: "different dishes tried",
      explorer: "You're a true culinary explorer! 🧭"
    },
    podium: {
      title: "Your Top 3 dishes",
      times: "times"
    },
    profile: {
      title: "Your Culinary Profile",
      category: "Main category",
      personality: "Personality"
    },
    savings: {
      title: "Your 2024 savings",
      spent: "spent",
      saved: "saved",
      points: "loyalty points"
    },
    month: {
      title: "Your foodie month",
      orders: "orders"
    },
    desserts: {
      title: "Team Dessert? 🍰",
      count: "desserts ordered",
      favorite: "Your favorite"
    },
    aiTitle: {
      title: "Your 2024 culinary title"
    },
    recipes: {
      title: "Your recipes to recreate 📖",
      subtitle: "Recreate your favorite dishes at home",
      download: "Download recipes",
      prep: "Prep",
      cook: "Cook",
      tip: "Chef's tip"
    },
    conclusion: {
      title: "Thanks for this year! 🙏",
      message: "See you next year for even more flavors!",
      share: "Share your Wrapped"
    },
    buttons: {
      prev: "Previous",
      next: "Next"
    },
    noOrders: "No orders found for 2024."
  }
};

const monthNames = {
  fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  en: ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"]
};

// ============================================
// SLIDE TYPES
// ============================================

const SLIDE_TYPES = {
  INTRO: 'intro',
  STATS_OVERVIEW: 'stats_overview',
  TOP_DISHES: 'top_dishes',
  CULINARY_PROFILE: 'culinary_profile',
  AI_TITLE: 'ai_title',
  SAVINGS: 'savings',
  FAVORITE_MONTH: 'favorite_month',
  DESSERTS: 'desserts',
  RECIPES: 'recipes',
  CONCLUSION: 'conclusion'
};

// ============================================
// GLOBAL STATE
// ============================================

let currentSlide = 0;
let slides = [];
let yearData = null;
let classification = null;
let language = 'fr';
let particleBackground = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get orders from background
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "getOrders" }, resolve);
    });

    const orders = response?.orders || [];
    language = response?.language || "fr";

    if (!orders.length) {
      displayNoOrdersMessage();
      return;
    }

    // Initialize background
    initParticleBackground();

    // Calculate year data
    yearData = await calculateYearData(orders);

    // Generate AI content (async)
    await generateAIContent(yearData);

    // Select best slides
    slides = selectBestSlides(yearData, classification);

    // Update button texts
    updateButtonTexts();

    // Initialize slideshow
    initializeSlideshow();

  } catch (error) {
    console.error("Initialization error:", error);
    displayNoOrdersMessage();
  }
});

// ============================================
// PARTICLE BACKGROUND (Simplified for extension)
// ============================================

function initParticleBackground() {
  // For extension, we'll use CSS gradients with animation
  // Three.js requires bundling, so we'll add animated CSS background
  const container = document.getElementById("story-container");
  container.classList.add("animated-gradient-bg");
}

function setBackgroundTheme(theme) {
  const container = document.getElementById("story-container");
  container.classList.remove("theme-intro", "theme-stats", "theme-podium", 
                             "theme-dessert", "theme-recipes", "theme-conclusion");
  container.classList.add(`theme-${theme}`);
}

// ============================================
// AI CONTENT GENERATION
// ============================================

async function generateAIContent(yearData) {
  // For now, use mock responses
  // In production, set API key and use real AI service
  
  try {
    // Classification
    classification = await classifyDishes(yearData.orders);
    
    // AI Title
    yearData.aiTitle = await generateTitle(yearData, classification);
    
    // Recipes for top dishes
    yearData.recipes = await generateRecipes(yearData.topDishes);
    
  } catch (error) {
    console.error("AI generation error:", error);
    // Fallback values
    classification = {
      mainCategory: 'Gourmand',
      categories: { viande: 40, végétarien: 30, poisson: 20, dessert: 10 },
      personality: 'Le gourmet curieux',
      funFact: `${yearData.totalUniqueDishes} plats différents testés !`
    };
    yearData.aiTitle = "Le Champion de la Pause Déj' 🏆";
    yearData.recipes = [];
  }
}

// AI Service functions (simplified for extension)
async function classifyDishes(orders) {
  // Mock classification for demo
  const totalProducts = orders.reduce((sum, o) => sum + o.products.length, 0);
  const dessertCount = orders.filter(o => o.products.length > 1).length;
  
  return {
    mainCategory: dessertCount / orders.length > 0.5 ? 'Gourmand' : 'Équilibré',
    categories: { 
      plat: Math.round(60 + Math.random() * 20),
      dessert: Math.round(dessertCount / orders.length * 100),
      autre: 10
    },
    personality: 'L\'explorateur des saveurs',
    funFact: `Tu as commandé en moyenne à ${yearData?.averageOrderPosition || 10}ème position !`,
    signature: yearData?.topDishes?.[0]?.title || 'Ton plat mystère'
  };
}

async function generateTitle(stats, classification) {
  // Mock titles based on profile
  const titles = [
    `Le Conquistador du ${stats.topDishes?.[0]?.title || 'Déjeuner'} 🍗`,
    `Champion Toutes Catégories 🏆`,
    `L'Archéologue des Saveurs 🔍`,
    `Le Régulier Inébranlable ⭐`,
    `Maître de la Pause Déj' 👑`
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

async function generateRecipes(topDishes) {
  // Mock recipes
  return topDishes.slice(0, 3).map(dish => ({
    name: dish.title,
    prepTime: '15 min',
    cookTime: '25 min',
    servings: 2,
    difficulty: 'Moyen',
    ingredients: [
      'Ingrédients selon le plat',
      'Sel, poivre, huile d\'olive',
      'Herbes fraîches'
    ],
    steps: [
      'Préparez tous les ingrédients',
      'Cuisez à feu moyen pendant 20 minutes',
      'Assaisonnez et servez chaud'
    ],
    chefTip: 'La qualité des ingrédients fait la différence !'
  }));
}

// ============================================
// SLIDE SELECTION
// ============================================

function selectBestSlides(yearData, classification) {
  const selectedSlides = [];
  
  // 1. Intro - Always
  selectedSlides.push({ type: SLIDE_TYPES.INTRO, data: {} });
  
  // 2. Stats Overview - Always
  selectedSlides.push({ 
    type: SLIDE_TYPES.STATS_OVERVIEW, 
    data: { 
      totalOrders: yearData.totalOrders,
      totalUniqueDishes: yearData.totalUniqueDishes 
    }
  });
  
  // 3. Top Dishes - If meaningful
  if (yearData.topDishes.length > 0 && yearData.topDishes[0].count >= 2) {
    selectedSlides.push({ 
      type: SLIDE_TYPES.TOP_DISHES, 
      data: { topDishes: yearData.topDishes }
    });
  }
  
  // 4. Culinary Profile - If we have classification
  if (classification) {
    selectedSlides.push({
      type: SLIDE_TYPES.CULINARY_PROFILE,
      data: { classification }
    });
  }
  
  // 5. Savings - If significant
  if (yearData.discountSaved > 5 || yearData.fidelities > 10) {
    selectedSlides.push({
      type: SLIDE_TYPES.SAVINGS,
      data: {
        totalSpent: yearData.totalSpent,
        discountSaved: yearData.discountSaved,
        fidelities: yearData.fidelities
      }
    });
  }
  
  // 6. Desserts - If they ordered desserts
  if (yearData.dessertsOrdersCount >= 3) {
    selectedSlides.push({
      type: SLIDE_TYPES.DESSERTS,
      data: {
        dessertsOrdersCount: yearData.dessertsOrdersCount,
        favoriteDessert: yearData.favoriteDessert
      }
    });
  }
  
  // 7. AI Title - High impact
  if (yearData.aiTitle) {
    selectedSlides.push({
      type: SLIDE_TYPES.AI_TITLE,
      data: { title: yearData.aiTitle }
    });
  }
  
  // 8. Recipes - If we have them
  if (yearData.recipes && yearData.recipes.length > 0) {
    selectedSlides.push({
      type: SLIDE_TYPES.RECIPES,
      data: { recipes: yearData.recipes, topDishes: yearData.topDishes }
    });
  }
  
  // 9. Conclusion - Always
  selectedSlides.push({ type: SLIDE_TYPES.CONCLUSION, data: {} });
  
  return selectedSlides;
}

// ============================================
// YEAR DATA CALCULATIONS
// ============================================

async function calculateYearData(orders) {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total_due) || 0), 0);
  const averageSpent = totalOrders > 0 ? totalSpent / totalOrders : 0;
  
  // Unique dishes
  const uniqueDishes = new Set();
  orders.forEach(order => {
    order.products.forEach(p => uniqueDishes.add(p.title));
  });
  const totalUniqueDishes = uniqueDishes.size;
  
  // Top dishes (first product of each order)
  const dishCounts = {};
  orders.forEach(order => {
    if (order.products.length > 0) {
      const dish = order.products[0].title;
      dishCounts[dish] = (dishCounts[dish] || 0) + 1;
    }
  });
  const topDishes = Object.entries(dishCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([title, count]) => ({ title, count }));
  
  // Desserts
  const dessertCounts = {};
  let dessertsOrdersCount = 0;
  orders.forEach(order => {
    if (order.products.length > 1) {
      dessertsOrdersCount++;
      order.products.slice(1).forEach(p => {
        dessertCounts[p.title] = (dessertCounts[p.title] || 0) + 1;
      });
    }
  });
  const favoriteDessert = Object.entries(dessertCounts)
    .sort((a, b) => b[1] - a[1])[0] || ['Aucun', 0];
  
  // Fidelity points
  const fidelities = orders.reduce((sum, o) => {
    const match = o.points_fidelity?.match(/\+(\d+)\s*pts/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);
  
  // Discounts
  const discountSaved = Math.abs(orders.reduce((sum, o) => {
    return sum + (o.discounts?.reduce((s, d) => s + Number(d), 0) || 0);
  }, 0));
  
  // Top month
  const monthCounts = {};
  orders.forEach(order => {
    const month = parseInt(order.fullDate?.split('-')[1]);
    if (month) monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  const topMonthEntry = Object.entries(monthCounts)
    .sort((a, b) => b[1] - a[1])[0] || [1, 0];
  const topMonth = monthNames[language][parseInt(topMonthEntry[0]) - 1];
  const topMonthCount = topMonthEntry[1];
  
  // Average order position
  const averageOrderPosition = orders.reduce((sum, o) => 
    sum + (o.orderPosition || 0), 0) / totalOrders || 0;
  
  return {
    orders,
    totalOrders,
    totalSpent,
    averageSpent,
    totalUniqueDishes,
    topDishes,
    dessertsOrdersCount,
    favoriteDessert: { title: favoriteDessert[0], count: favoriteDessert[1] },
    fidelities,
    discountSaved,
    topMonth,
    topMonthCount,
    averageOrderPosition,
    language
  };
}

// ============================================
// SLIDESHOW MANAGEMENT
// ============================================

function initializeSlideshow() {
  showSlide(0);
  setupNavigation();
}

function showSlide(index) {
  if (index < 0 || index >= slides.length) return;
  
  currentSlide = index;
  const slide = slides[index];
  const container = document.getElementById("slides-container");
  
  // Animate out
  container.style.opacity = 0;
  
  setTimeout(() => {
    // Clear and render new slide
    container.innerHTML = "";
    renderSlide(slide, container);
    
    // Animate in
    container.style.opacity = 1;
    
    // Update progress
    updateProgress();
    updateNavButtons();
    
    // Set background theme
    const themes = {
      [SLIDE_TYPES.INTRO]: 'intro',
      [SLIDE_TYPES.STATS_OVERVIEW]: 'stats',
      [SLIDE_TYPES.TOP_DISHES]: 'podium',
      [SLIDE_TYPES.DESSERTS]: 'dessert',
      [SLIDE_TYPES.RECIPES]: 'recipes',
      [SLIDE_TYPES.CONCLUSION]: 'conclusion'
    };
    setBackgroundTheme(themes[slide.type] || 'stats');
    
  }, 300);
}

// ============================================
// SLIDE RENDERERS
// ============================================

function renderSlide(slide, container) {
  const t = translations[language];
  
  switch (slide.type) {
    case SLIDE_TYPES.INTRO:
      renderIntroSlide(container, t);
      break;
    case SLIDE_TYPES.STATS_OVERVIEW:
      renderStatsSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.TOP_DISHES:
      renderPodiumSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.CULINARY_PROFILE:
      renderProfileSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.AI_TITLE:
      renderAITitleSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.SAVINGS:
      renderSavingsSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.DESSERTS:
      renderDessertsSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.RECIPES:
      renderRecipesSlide(container, slide.data, t);
      break;
    case SLIDE_TYPES.CONCLUSION:
      renderConclusionSlide(container, t);
      break;
    default:
      container.innerHTML = '<p>Slide non reconnue</p>';
  }
}

function renderIntroSlide(container, t) {
  container.innerHTML = `
    <div class="slide-content intro-slide animate-fade-in">
      <div class="text-8xl mb-8">🍽️</div>
      <h1 class="text-4xl font-bold mb-4 text-white">${t.intro.title}</h1>
      <p class="text-xl text-white/80 mb-12">${t.intro.subtitle}</p>
      <button id="start-btn" class="bg-white text-green-600 px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-lg">
        ${t.intro.cta}
      </button>
    </div>
  `;
  
  document.getElementById("start-btn").addEventListener("click", () => {
    showSlide(1);
  });
  
  // Hide nav on intro
  document.getElementById("nav-buttons").classList.add("hidden");
}

function renderStatsSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content stats-slide animate-fade-in">
      <h2 class="text-3xl font-bold mb-12 text-white">${t.stats.ordersTitle}</h2>
      
      <div class="flex gap-8 justify-center mb-8">
        <div class="stat-card">
          <div class="stat-number" data-count="${data.totalOrders}">0</div>
          <div class="stat-label">${t.stats.orders}</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" data-count="${data.totalUniqueDishes}">0</div>
          <div class="stat-label">${t.stats.dishes}</div>
        </div>
      </div>
      
      <p class="text-xl text-white/80 mt-8">${t.stats.explorer}</p>
    </div>
  `;
  
  // Animate counters
  animateCounters();
  document.getElementById("nav-buttons").classList.remove("hidden");
}

function renderPodiumSlide(container, data, t) {
  const [first, second, third] = data.topDishes;
  
  container.innerHTML = `
    <div class="slide-content podium-slide animate-fade-in">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.podium.title}</h2>
      
      <div class="podium-container">
        ${second ? `
          <div class="podium-block podium-silver" data-podium-place="2">
            <div class="podium-emoji">🥈</div>
            <div class="podium-count">${second.count}x</div>
            <div class="podium-title">${truncate(second.title, 20)}</div>
          </div>
        ` : ''}
        
        ${first ? `
          <div class="podium-block podium-gold" data-podium-place="1">
            <div class="podium-emoji">🥇</div>
            <div class="podium-count">${first.count}x</div>
            <div class="podium-title">${truncate(first.title, 20)}</div>
          </div>
        ` : ''}
        
        ${third ? `
          <div class="podium-block podium-bronze" data-podium-place="3">
            <div class="podium-emoji">🥉</div>
            <div class="podium-count">${third.count}x</div>
            <div class="podium-title">${truncate(third.title, 20)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Trigger confetti for podium
  triggerConfetti();
}

function renderProfileSlide(container, data, t) {
  const { classification } = data;
  
  container.innerHTML = `
    <div class="slide-content profile-slide animate-fade-in">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.profile.title}</h2>
      
      <div class="profile-card">
        <div class="profile-badge">${classification.mainCategory}</div>
        <p class="text-lg text-white/80 mt-4">${classification.personality}</p>
        <p class="text-md text-yellow-300 mt-6">💡 ${classification.funFact}</p>
      </div>
    </div>
  `;
}

function renderAITitleSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content ai-title-slide animate-fade-in">
      <p class="text-xl text-white/80 mb-4">${t.aiTitle.title}</p>
      <h2 class="text-5xl font-bold text-yellow-400 ai-title-text">${data.title}</h2>
    </div>
  `;
  
  triggerConfetti();
}

function renderSavingsSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content savings-slide animate-fade-in">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.savings.title}</h2>
      
      <div class="savings-grid">
        <div class="savings-card">
          <div class="savings-value" data-count="${data.totalSpent.toFixed(0)}">0</div>
          <div class="savings-label">€ ${t.savings.spent}</div>
        </div>
        <div class="savings-card highlight">
          <div class="savings-value" data-count="${data.discountSaved.toFixed(0)}">0</div>
          <div class="savings-label">€ ${t.savings.saved}</div>
        </div>
        <div class="savings-card">
          <div class="savings-value" data-count="${data.fidelities}">0</div>
          <div class="savings-label">${t.savings.points}</div>
        </div>
      </div>
    </div>
  `;
  
  animateCounters();
}

function renderDessertsSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content desserts-slide animate-fade-in">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.desserts.title}</h2>
      
      <div class="dessert-count">
        <span class="dessert-number" data-count="${data.dessertsOrdersCount}">0</span>
        <span class="dessert-label">${t.desserts.count}</span>
      </div>
      
      ${data.favoriteDessert?.count > 0 ? `
        <div class="favorite-dessert mt-8">
          <p class="text-lg text-white/80">${t.desserts.favorite}</p>
          <p class="text-2xl font-bold text-yellow-400 mt-2">🍰 ${data.favoriteDessert.title}</p>
        </div>
      ` : ''}
    </div>
  `;
  
  animateCounters();
}

function renderRecipesSlide(container, data, t) {
  const recipe = data.recipes?.[0];
  
  container.innerHTML = `
    <div class="slide-content recipes-slide animate-fade-in">
      <h2 class="text-3xl font-bold mb-4 text-white">${t.recipes.title}</h2>
      <p class="text-lg text-white/80 mb-8">${t.recipes.subtitle}</p>
      
      ${recipe ? `
        <div class="recipe-card">
          <h3 class="text-xl font-bold text-green-400 mb-4">${recipe.name}</h3>
          <div class="recipe-meta">
            <span>⏱️ ${t.recipes.prep}: ${recipe.prepTime}</span>
            <span>🍳 ${t.recipes.cook}: ${recipe.cookTime}</span>
          </div>
          <p class="recipe-tip mt-4">💡 ${t.recipes.tip}: ${recipe.chefTip}</p>
        </div>
        
        <button class="download-btn mt-6" onclick="alert('Fonctionnalité à venir !')">
          📥 ${t.recipes.download}
        </button>
      ` : `
        <p class="text-white/60">Aucune recette générée</p>
      `}
    </div>
  `;
}

function renderConclusionSlide(container, t) {
  container.innerHTML = `
    <div class="slide-content conclusion-slide animate-fade-in">
      <div class="text-6xl mb-8">🎉</div>
      <h2 class="text-4xl font-bold mb-4 text-white">${t.conclusion.title}</h2>
      <p class="text-xl text-white/80 mb-8">${t.conclusion.message}</p>
      
      <div class="share-section mt-8">
        <p class="text-lg text-white/80 mb-4">${t.conclusion.share}</p>
        <div class="share-buttons">
          <button class="share-btn" onclick="downloadShareCard()">
            📱 Story
          </button>
          <button class="share-btn" onclick="downloadShareCard()">
            🖼️ Post
          </button>
        </div>
      </div>
    </div>
  `;
  
  triggerConfetti();
}

// ============================================
// UTILITIES
// ============================================

function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const increment = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current;
    }, 50);
  });
}

function triggerConfetti() {
  // Simple CSS confetti animation fallback
  const container = document.getElementById("story-container");
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.backgroundColor = ['#FFD700', '#4CAF50', '#FF6B35', '#E91E63'][Math.floor(Math.random() * 4)];
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

async function downloadShareCard() {
  alert('Génération de l\'image en cours...\nCette fonctionnalité sera bientôt disponible !');
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
  const prevBtn = document.getElementById("prev-button");
  const nextBtn = document.getElementById("next-button");
  
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) showSlide(currentSlide - 1);
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
  });
  
  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") showSlide(currentSlide + 1);
    if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
  });
}

function updateProgress() {
  const progress = (currentSlide / (slides.length - 1)) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function updateNavButtons() {
  const prevBtn = document.getElementById("prev-button");
  const nextBtn = document.getElementById("next-button");
  
  prevBtn.style.display = currentSlide > 0 ? 'block' : 'none';
  nextBtn.style.display = currentSlide < slides.length - 1 ? 'block' : 'none';
}

function updateButtonTexts() {
  const t = translations[language];
  document.getElementById("prev-button").textContent = t.buttons.prev;
  document.getElementById("next-button").textContent = t.buttons.next;
}

function displayNoOrdersMessage() {
  const t = translations[language] || translations.fr;
  document.getElementById("slides-container").innerHTML = `
    <p class="text-xl text-gray-500">${t.noOrders}</p>
  `;
}
