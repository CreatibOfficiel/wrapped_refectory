/**
 * Wrapped Refectory 2024 - Main Entry Point (ES6 Module Version)
 * This file imports all modules and initializes the Wrapped experience
 */

// Three.js particle background
import { ParticleBackground, initParticleBackground } from '../three/ParticleBackground.js';

// AI Service
import { setApiKey, classifyDishes, generateTitle, generateRecipes } from '../services/ai-service.js';

// Animations
import { animateCounter, celebrate, celebrateFromSides, slideIn, slideOut, presets } from '../animations/animations.js';

// Slide Selection
import { selectBestSlides, detectUserProfile, getProfileMessages, SLIDE_TYPES } from '../slides/slide-selector.js';

// Social Sharing
import { initSharing, createShareButtons } from '../sharing/share.js';

// GSAP & Confetti (from node_modules)
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

// ============================================
// CONFIGURATION
// ============================================

// Set your API key here for real AI features
// setApiKey('your-openai-api-key', 'openai');

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
      ordersTitle: "Vos commandes en 2024",
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
      category: "Catégorie dominante"
    },
    savings: {
      title: "Vos économies 2024",
      spent: "dépensés",
      saved: "économisés",
      points: "points fidélité"
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
      download: "Télécharger les recettes"
    },
    conclusion: {
      title: "Merci pour cette année ! 🙏",
      message: "À l'année prochaine pour encore plus de saveurs !",
      share: "Partagez votre Wrapped"
    },
    buttons: { prev: "Précédent", next: "Suivant" },
    noOrders: "Aucune commande trouvée pour 2024."
  },
  en: {
    intro: {
      title: "Welcome to your 2024 Wrapped! 🍽️",
      subtitle: "Discover your culinary year with Refectory",
      cta: "Let's go!"
    },
    stats: {
      ordersTitle: "Your 2024 orders",
      orders: "orders placed",
      dishes: "different dishes tried",
      explorer: "You're a true culinary explorer! 🧭"
    },
    podium: { title: "Your Top 3 dishes", times: "times" },
    profile: { title: "Your Culinary Profile", category: "Main category" },
    savings: { title: "Your 2024 savings", spent: "spent", saved: "saved", points: "loyalty points" },
    desserts: { title: "Team Dessert? 🍰", count: "desserts ordered", favorite: "Your favorite" },
    aiTitle: { title: "Your 2024 culinary title" },
    recipes: { title: "Recipes to recreate 📖", subtitle: "Make your favorites at home", download: "Download" },
    conclusion: { title: "Thanks for this year! 🙏", message: "See you next year!", share: "Share your Wrapped" },
    buttons: { prev: "Previous", next: "Next" },
    noOrders: "No orders found for 2024."
  }
};

const monthNames = {
  fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

// ============================================
// GLOBAL STATE
// ============================================

let currentSlide = 0;
let slides = [];
let yearData = null;
let classification = null;
let language = 'fr';
let particleBg = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get orders from Chrome extension background
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "getOrders" }, resolve);
    });

    const orders = response?.orders || [];
    language = response?.language || "fr";

    if (!orders.length) {
      displayNoOrdersMessage();
      return;
    }

    // Initialize Three.js background
    try {
      particleBg = initParticleBackground();
    } catch (e) {
      console.warn('Three.js background failed, using CSS fallback:', e);
      document.getElementById("story-container").classList.add("animated-gradient-bg");
    }

    // Calculate statistics
    yearData = await calculateYearData(orders);

    // Generate AI content
    await generateAIContent(yearData);

    // Select best slides for this user
    slides = selectBestSlides(yearData, classification);

    // Setup UI
    updateButtonTexts();
    initializeSlideshow();

  } catch (error) {
    console.error("Initialization error:", error);
    displayNoOrdersMessage();
  }
});

// ============================================
// AI CONTENT GENERATION
// ============================================

async function generateAIContent(data) {
  try {
    // Classify dishes
    classification = await classifyDishes(data.orders);
    
    // Generate personalized title
    const stats = {
      totalOrders: data.totalOrders,
      topDish: data.topDishes[0]?.title,
      topDishCount: data.topDishes[0]?.count,
      uniqueDishes: data.totalUniqueDishes,
      dessertRatio: Math.round((data.dessertsOrdersCount / data.totalOrders) * 100)
    };
    data.aiTitle = await generateTitle(stats, classification);
    
    // Generate recipes
    data.recipes = await generateRecipes(data.topDishes);
    
  } catch (error) {
    console.error("AI generation error:", error);
    // Fallback values
    classification = {
      mainCategory: 'Gourmand',
      categories: { plat: 70, dessert: 30 },
      personality: 'Le gourmet curieux',
      funFact: `${data.totalUniqueDishes} plats différents testés !`
    };
    data.aiTitle = "Le Champion de la Pause Déj' 🏆";
    data.recipes = [];
  }
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
  orders.forEach(order => order.products.forEach(p => uniqueDishes.add(p.title)));
  const totalUniqueDishes = uniqueDishes.size;
  
  // Top dishes
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
  const favoriteDessertEntry = Object.entries(dessertCounts).sort((a, b) => b[1] - a[1])[0];
  const favoriteDessert = favoriteDessertEntry 
    ? { title: favoriteDessertEntry[0], count: favoriteDessertEntry[1] }
    : { title: 'Aucun', count: 0 };
  
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
  const topMonthEntry = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0] || [1, 0];
  const topMonth = monthNames[language][parseInt(topMonthEntry[0]) - 1];
  const topMonthCount = topMonthEntry[1];
  
  // Average position
  const averageOrderPosition = orders.reduce((sum, o) => sum + (o.orderPosition || 0), 0) / totalOrders || 0;
  
  return {
    orders,
    totalOrders,
    totalSpent,
    averageSpent,
    totalUniqueDishes,
    topDishes,
    dessertsOrdersCount,
    favoriteDessert,
    fidelities,
    discountSaved,
    topMonth,
    topMonthCount,
    averageOrderPosition,
    language
  };
}

// ============================================
// SLIDESHOW
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
  
  // Transition out
  gsap.to(container, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      container.innerHTML = "";
      renderSlide(slide, container);
      
      // Transition in
      gsap.fromTo(container, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
      
      updateProgress();
      updateNavButtons();
      
      // Update Three.js background theme
      if (particleBg) {
        const themeMap = {
          [SLIDE_TYPES.INTRO]: 'intro',
          [SLIDE_TYPES.STATS_OVERVIEW]: 'stats',
          [SLIDE_TYPES.TOP_DISHES]: 'podium',
          [SLIDE_TYPES.DESSERTS]: 'dessert',
          [SLIDE_TYPES.RECIPES]: 'recipes',
          [SLIDE_TYPES.CONCLUSION]: 'conclusion'
        };
        particleBg.setColorTheme(themeMap[slide.type] || 'stats');
      }
    }
  });
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
  }
}

function renderIntroSlide(container, t) {
  container.innerHTML = `
    <div class="slide-content intro-slide">
      <div class="text-8xl mb-8 animate-bounce">🍽️</div>
      <h1 class="text-4xl font-bold mb-4 text-white">${t.intro.title}</h1>
      <p class="text-xl text-white/80 mb-12">${t.intro.subtitle}</p>
      <button id="start-btn" class="start-button">
        ${t.intro.cta}
      </button>
    </div>
  `;
  
  document.getElementById("start-btn")?.addEventListener("click", () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    showSlide(1);
  });
  
  document.getElementById("nav-buttons").classList.add("hidden");
}

function renderStatsSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content stats-slide">
      <h2 class="text-3xl font-bold mb-12 text-white">${t.stats.ordersTitle}</h2>
      <div class="flex gap-8 justify-center mb-8">
        <div class="stat-card">
          <div class="stat-number" id="orders-count">0</div>
          <div class="stat-label">${t.stats.orders}</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="dishes-count">0</div>
          <div class="stat-label">${t.stats.dishes}</div>
        </div>
      </div>
      <p class="text-xl text-white/80 mt-8">${t.stats.explorer}</p>
    </div>
  `;
  
  // Animate counters with GSAP
  animateCounter(document.getElementById('orders-count'), data.totalOrders);
  animateCounter(document.getElementById('dishes-count'), data.totalUniqueDishes);
  
  document.getElementById("nav-buttons").classList.remove("hidden");
}

function renderPodiumSlide(container, data, t) {
  const [first, second, third] = data.topDishes;
  
  container.innerHTML = `
    <div class="slide-content podium-slide">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.podium.title}</h2>
      <div class="podium-container">
        ${second ? `<div class="podium-block podium-silver" data-podium-place="2">
          <div class="podium-emoji">🥈</div>
          <div class="podium-count">${second.count}x</div>
          <div class="podium-title">${second.title.slice(0, 25)}</div>
        </div>` : ''}
        ${first ? `<div class="podium-block podium-gold" data-podium-place="1">
          <div class="podium-emoji">🥇</div>
          <div class="podium-count">${first.count}x</div>
          <div class="podium-title">${first.title.slice(0, 25)}</div>
        </div>` : ''}
        ${third ? `<div class="podium-block podium-bronze" data-podium-place="3">
          <div class="podium-emoji">🥉</div>
          <div class="podium-count">${third.count}x</div>
          <div class="podium-title">${third.title.slice(0, 25)}</div>
        </div>` : ''}
      </div>
    </div>
  `;
  
  celebrateFromSides();
}

function renderProfileSlide(container, data, t) {
  const { classification } = data;
  container.innerHTML = `
    <div class="slide-content profile-slide">
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
    <div class="slide-content ai-title-slide">
      <p class="text-xl text-white/80 mb-4">${t.aiTitle.title}</p>
      <h2 class="text-5xl font-bold text-yellow-400 ai-title-text">${data.title}</h2>
    </div>
  `;
  celebrate();
}

function renderSavingsSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content savings-slide">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.savings.title}</h2>
      <div class="savings-grid">
        <div class="savings-card">
          <div class="savings-value" id="spent-count">0</div>
          <div class="savings-label">€ ${t.savings.spent}</div>
        </div>
        <div class="savings-card highlight">
          <div class="savings-value" id="saved-count">0</div>
          <div class="savings-label">€ ${t.savings.saved}</div>
        </div>
        <div class="savings-card">
          <div class="savings-value" id="points-count">0</div>
          <div class="savings-label">${t.savings.points}</div>
        </div>
      </div>
    </div>
  `;
  
  animateCounter(document.getElementById('spent-count'), data.totalSpent, { decimals: 0 });
  animateCounter(document.getElementById('saved-count'), data.discountSaved, { decimals: 0 });
  animateCounter(document.getElementById('points-count'), data.fidelities);
}

function renderDessertsSlide(container, data, t) {
  container.innerHTML = `
    <div class="slide-content desserts-slide">
      <h2 class="text-3xl font-bold mb-8 text-white">${t.desserts.title}</h2>
      <div class="dessert-count">
        <span class="dessert-number" id="dessert-count">0</span>
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
  
  animateCounter(document.getElementById('dessert-count'), data.dessertsOrdersCount);
}

function renderRecipesSlide(container, data, t) {
  const recipe = data.recipes?.[0];
  container.innerHTML = `
    <div class="slide-content recipes-slide">
      <h2 class="text-3xl font-bold mb-4 text-white">${t.recipes.title}</h2>
      <p class="text-lg text-white/80 mb-8">${t.recipes.subtitle}</p>
      ${recipe ? `
        <div class="recipe-card">
          <h3 class="text-xl font-bold text-green-400 mb-4">${recipe.name}</h3>
          <div class="recipe-meta">
            <span>⏱️ ${recipe.prepTime}</span>
            <span>🍳 ${recipe.cookTime}</span>
          </div>
          <p class="recipe-tip mt-4">💡 ${recipe.chefTip}</p>
        </div>
      ` : '<p class="text-white/60">Recettes en cours de génération...</p>'}
    </div>
  `;
}

function renderConclusionSlide(container, t) {
  container.innerHTML = `
    <div class="slide-content conclusion-slide">
      <div class="text-6xl mb-8">🎉</div>
      <h2 class="text-4xl font-bold mb-4 text-white">${t.conclusion.title}</h2>
      <p class="text-xl text-white/80 mb-8">${t.conclusion.message}</p>
      <div class="share-section mt-8">
        <p class="text-lg text-white/80 mb-4">${t.conclusion.share}</p>
        <div class="share-buttons">
          <button class="share-btn" id="share-story-btn">📱 Story</button>
          <button class="share-btn" id="share-square-btn">🖼️ Post</button>
        </div>
      </div>
    </div>
  `;
  
  celebrate();
  
  // Initialize sharing
  initSharing(yearData).then(({ storyDataUrl, squareDataUrl }) => {
    document.getElementById('share-story-btn')?.addEventListener('click', () => {
      window.wrappedShare?.downloadStory();
    });
    document.getElementById('share-square-btn')?.addEventListener('click', () => {
      window.wrappedShare?.downloadSquare();
    });
  });
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
  document.getElementById("prev-button")?.addEventListener("click", () => {
    if (currentSlide > 0) showSlide(currentSlide - 1);
  });
  
  document.getElementById("next-button")?.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") showSlide(currentSlide + 1);
    if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
  });
}

function updateProgress() {
  const progress = (currentSlide / (slides.length - 1)) * 100;
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = `${progress}%`;
}

function updateNavButtons() {
  const prevBtn = document.getElementById("prev-button");
  const nextBtn = document.getElementById("next-button");
  
  if (prevBtn) prevBtn.style.display = currentSlide > 0 ? 'block' : 'none';
  if (nextBtn) nextBtn.style.display = currentSlide < slides.length - 1 ? 'block' : 'none';
}

function updateButtonTexts() {
  const t = translations[language];
  const prevBtn = document.getElementById("prev-button");
  const nextBtn = document.getElementById("next-button");
  
  if (prevBtn) prevBtn.textContent = `← ${t.buttons.prev}`;
  if (nextBtn) nextBtn.textContent = `${t.buttons.next} →`;
}

function displayNoOrdersMessage() {
  const t = translations[language] || translations.fr;
  const container = document.getElementById("slides-container");
  if (container) {
    container.innerHTML = `<p class="text-xl text-gray-500">${t.noOrders}</p>`;
  }
}
