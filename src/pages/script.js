const translations = {
  fr: {
    introText: `Bienvenue dans votre rétro culinaire 2024 !<br><br>
      Entre plaisirs de table et découvertes savoureuses, vous avez mis les petits plats dans les grands avec Refectory.<br>
      Prêt(e) à voir tout ce que vous avez englouti cette année ? 🍴😋`,
    introCTA: "Commencer",

    ordersAndDiversity: `Vous avez passé <span class="text-4xl font-bold text-green-600">{{ totalOrders }}</span> commandes cette année, 
      et testé <span class="text-4xl font-bold text-green-600">{{ totalUniqueDishes }}</span> plats différents.<br>
      Vous avez clairement un palais d'explorateur ! Indiana Jones aurait été fier. 🍽️💪`,

    podiumTitle: "Top 3 de vos plats les plus dévorés",
    podiumConclusion: `Et comme tout bon explorateur, vous avez trouvé un trésor culinaire : 
      <span class="text-4xl font-bold text-green-600">{{ firstTitle }}</span>, 
      avec <span class="text-4xl font-bold text-green-600">{{ firstCount }}</span> commandes !<br>
      Si vous continuez comme ça, le chef va devoir renommer le plat en votre honneur. 🍲👑`,

    gainsEtEconomies: `En 2024, vous avez investi 
      <span class="text-4xl font-bold text-green-600">{{ totalSpent }}€</span> 
      dans votre bonheur gustatif (et on applaudit ça 👏).<br><br>
      Avec <span class="text-4xl font-bold text-green-600">{{ fidelities }}</span> points de fidélité 
      et <span class="text-4xl font-bold text-green-600">{{ discountSaved }}€</span> d’économies,<br>
      vous êtes presque prêt(e) à devenir ministre de l'Économie... gastronomique. 💶🍲`,

    averageSpentAndPosition: `Chaque commande vous a coûté un honorable 
      <span class="text-4xl font-bold text-green-600">{{ averageSpent }}€</span>, 
      la preuve qu’on peut se régaler sans exploser son budget.<br><br>
      Vous étiez en moyenne le/la 
      <span class="text-4xl font-bold text-green-600">{{ averageOrderPosition }}</span> 
      à commander sur votre lieu de livraison,<br>
      toujours pile à l’heure pour ne pas rater le festin. Bravo pour votre ponctualité légendaire, même dans la gourmandise ! 🕒🍴`,

    favoriteMonth: `Votre mois préféré ? 
      <span class="text-4xl font-bold text-green-600">{{ topMonth }}</span>, 
      où vous avez fait chauffer les fourneaux (ou plutôt nos cuisines) avec 
      <span class="text-4xl font-bold text-green-600">{{ topMonthCount }}</span> commandes.<br>
      Clairement, c’est le moment où votre appétit était au sommet de sa forme. 🍴🔥`,

    dessertCount: `Team dessert ? Oh que oui !<br><br>
      Vous avez succombé <span class="text-4xl font-bold text-green-600">{{ dessertsOrdersCount }}</span> fois à une douceur sucrée.<br>
      Clairement, impossible de dire non à une petite gourmandise. 🍰😋`,

    noDessert: `Vous n'avez commandé aucun dessert cette année. 
      Pas de souci, on ne vous en voudra pas !`,

    favoriteDessert: `Votre chouchou du dessert ? 
      <span class="text-4xl font-bold text-green-600">{{ title }}</span>, savouré <span class="text-4xl font-bold text-green-600">{{ count }}</span> fois.<br>
      Vous êtes carrément en couple avec ce dessert... et on approuve totalement. 🍨❤️`,

    conclusion: `Merci d’avoir fait de 2024 une année pleine de saveurs avec Refectory !<br><br>
      On se retrouve en 2025 pour encore plus de plats, de découvertes... et peut-être quelques excès gourmands.<br>
      Allez, on ne juge pas ! À bientôt et bon app’ ! 🍽️✨`,

    noOrdersMessage: "Aucune commande trouvée pour cette année.",

    buttons: {
      prev: "Précédent",
      next: "Suivant",
    },
  },

  en: {
    introText: `Welcome to your 2024 culinary retrospective!<br><br>
      Between delicious treats and savory discoveries, you've gone all out with Refectory.<br>
      Ready to see everything you've devoured this year? 🍴😋`,
    introCTA: "Start",

    ordersAndDiversity: `You placed <span class="text-4xl font-bold text-green-600">{{ totalOrders }}</span> orders this year, 
      and tried <span class="text-4xl font-bold text-green-600">{{ totalUniqueDishes }}</span> different dishes.<br>
      Clearly, you’ve got a true explorer’s palate! Indiana Jones would be proud. 🍽️💪`,

    podiumTitle: "Top 3 of your most devoured dishes",
    podiumConclusion: `And like any great explorer, you discovered a culinary treasure: 
      <span class="text-4xl font-bold text-green-600">{{ firstTitle }}</span>, 
      with <span class="text-4xl font-bold text-green-600">{{ firstCount }}</span> orders!<br>
      Keep it up and the chef might rename the dish in your honor. 🍲👑`,

    gainsEtEconomies: `In 2024, you invested 
      <span class="text-4xl font-bold text-green-600">{{ totalSpent }}€</span> 
      in your gourmet happiness (and we applaud you for it 👏).<br><br>
      With <span class="text-4xl font-bold text-green-600">{{ fidelities }}</span> loyalty points 
      and <span class="text-4xl font-bold text-green-600">{{ discountSaved }}€</span> saved,<br>
      you’re practically ready to become Minister of Gastronomic Economy. 💶🍲`,

    averageSpentAndPosition: `Each order cost you a modest 
      <span class="text-4xl font-bold text-green-600">{{ averageSpent }}€</span>, 
      proving you can feast without breaking the bank.<br><br>
      On average, you were the 
      <span class="text-4xl font-bold text-green-600">{{ averageOrderPosition }}</span> 
      person to order at your delivery location,<br>
      always right on time so you wouldn't miss out on the feast. Cheers to your legendary punctuality, even in indulgence! 🕒🍴`,

    favoriteMonth: `Your favorite month? 
      <span class="text-4xl font-bold text-green-600">{{ topMonth }}</span>, 
      when you really fired up the kitchen (or rather ours) with 
      <span class="text-4xl font-bold text-green-600">{{ topMonthCount }}</span> orders.<br>
      Clearly, that’s when your appetite was at its peak. 🍴🔥`,

    dessertCount: `Team dessert? Oh yes!<br><br>
      You gave in to something sweet <span class="text-4xl font-bold text-green-600">{{ dessertsOrdersCount }}</span> times.<br>
      Let's just say resistance was futile. 🍰😋`,

    noDessert: `You didn't order any dessert this year.
      No worries, we won't hold it against you!`,

    favoriteDessert: `Your dessert crush? 
      <span class="text-4xl font-bold text-green-600">{{ title }}</span>, enjoyed <span class="text-4xl font-bold text-green-600">{{ count }}</span> times.<br>
      You’re basically in a relationship with that dessert... and we fully support it. 🍨❤️`,

    conclusion: `Thank you for making 2024 so flavorful with Refectory!<br><br>
      See you in 2025 for even more dishes, discoveries... and maybe a few guilty pleasures.<br>
      Hey, we’re not judging! See you soon and bon appétit! 🍽️✨`,

    noOrdersMessage: "No orders found for this year.",

    buttons: {
      prev: "Previous",
      next: "Next",
    },
  },
};

/**
 * Remplace les {{ placeholders }} par les valeurs correspondantes dans data
 */
function replacePlaceholders(text, data) {
  let newText = text;
  for (const key in data) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    newText = newText.replace(regex, data[key]);
  }
  return newText;
}

/**
 * Retourne le tableau de slides en fonction de la langue choisie.
 * @param {Object} yearData - Données calculées (totalSpent, etc.).
 * @param {string} language - Code de langue ("fr" ou "en").
 * @returns {Array} - Tableau de slides
 */
function getSlides(yearData, language) {
  const t = translations[language] || translations.fr;

  // Pour le podium, on récupère les 3 plats
  const [firstPlace, secondPlace, thirdPlace] = yearData.topDishes || [];

  return [
    // 1. Slide d'Intro
    {
      isIntro: true,
      text: replacePlaceholders(t.introText, {}),
      cta: t.introCTA,
    },
    // 2. Slide Commandes & Diversité Culinaire
    {
      text: replacePlaceholders(t.ordersAndDiversity, {
        totalOrders: yearData.totalOrders,
        totalUniqueDishes: yearData.totalUniqueDishes,
      }),
    },
    // 3. Slide Top 3 des Plats (Podium)
    {
      isPodium: true,
      topDishes: yearData.topDishes,
      podiumTitle: t.podiumTitle,
      podiumConclusion: replacePlaceholders(t.podiumConclusion, {
        firstTitle: firstPlace?.title || "-",
        firstCount: firstPlace?.count || "0",
      }),
    },
    // 4. Slide Vos Gains et Économies
    {
      isCombined: true,
      totalSpent: yearData.totalSpent.toFixed(2),
      fidelities: yearData.fidelities,
      discountSaved: yearData.discountSaved.toFixed(2),
      combinedText: replacePlaceholders(t.gainsEtEconomies, {
        totalSpent: yearData.totalSpent.toFixed(2),
        fidelities: yearData.fidelities,
        discountSaved: yearData.discountSaved.toFixed(2),
      }),
    },
    // 5. Slide Statistiques de Commande & Positionnement
    {
      text: replacePlaceholders(t.averageSpentAndPosition, {
        averageSpent: yearData.averageSpent.toFixed(2),
        averageOrderPosition: Math.round(yearData.averageOrderPosition),
      }),
    },
    // 6. Slide Mois Favori
    {
      text: replacePlaceholders(t.favoriteMonth, {
        topMonth: yearData.topMonth,
        topMonthCount: yearData.topMonthCount,
      }),
    },
    // 7. Slide Nombre de Desserts
    {
      isDessertOrdersCount: true,
      dessertOrdersCount: yearData.dessertsOrdersCount,
      dessertCountText: replacePlaceholders(t.dessertCount, {
        dessertsOrdersCount: yearData.dessertsOrdersCount,
      }),
    },
    // 8. Slide Dessert Favori
    {
      isFavoriteDessert: true,
      favoriteDessert: yearData.favoriteDessert,
      noDessertText: t.noDessert,
      favoriteDessertText: replacePlaceholders(t.favoriteDessert, {
        title: yearData.favoriteDessert.title,
        count: yearData.favoriteDessert.count,
      }),
    },
    // 9. Slide de Conclusion
    {
      text: replacePlaceholders(t.conclusion, {}),
    },
  ];
}

/**
 * Affiche un message indiquant qu'aucune commande n'a été trouvée.
 * On gère aussi la traduction du message si besoin.
 */
function displayNoOrdersMessage(language) {
  const slidesContainer = document.getElementById("slides-container");
  const t = translations[language] || translations.fr;
  slidesContainer.innerHTML = `<p class="text-xl text-gray-500">${t.noOrdersMessage}</p>`;
}

/**
 * Met à jour les textes des boutons de navigation en fonction de la langue.
 * @param {string} language - Code de langue ("fr" ou "en").
 */
function updateButtonTexts(language) {
  const t = translations[language] || translations.fr;

  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  if (prevButton && nextButton) {
    prevButton.textContent = t.buttons.prev;
    nextButton.textContent = t.buttons.next;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Récupère les commandes (et la langue) via le service worker
  chrome.runtime.sendMessage({ action: "getOrders" }, (response) => {
    const orders = response?.data || [];
    const pageLanguage = response?.language || "fr"; // ou "en"

    // Met à jour les textes des boutons avant toute autre action
    updateButtonTexts(pageLanguage);

    if (!orders.length) {
      displayNoOrdersMessage(pageLanguage);
      return;
    }

    // Calculer les données annuelles
    const yearData = calculateYearData(orders);

    // Générer les slides avec ces données
    const slides = getSlides(yearData, pageLanguage);

    // Initialiser le diaporama
    initializeSlideshow(slides);
  });
});

/**
 * Calcule les données annuelles à partir de la liste des commandes.
 * @param {Array} orders - Tableau d'objets commande.
 * @returns {Object} yearData - Données calculées pour l'année.
 */
function calculateYearData(orders) {
  const totalOrders = orders.length;
  const totalSpent = calculateTotalSpent(orders);
  const averageSpent = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const totalUniqueDishes = calculateTotalUniqueDishes(orders);
  const topDishes = calculateTopDishes(orders);
  const favoriteDessert = calculateFavoriteDessert(orders);
  const dessertsOrdersCount = calculateDessertsOrdersCount(orders);
  const fidelities = calculateFidelityPoints(orders);
  const discountSaved = calculateTotalDiscountSaved(orders);
  // On n'utilise plus l'heure de livraison (averageDeliveryHour) dans la nouvelle version
  const { topMonth, topMonthCount } = calculateTopMonth(orders);
  const averageOrderPosition = calculateAverageOrderPosition(orders);

  return {
    totalOrders,
    totalSpent,
    averageSpent,
    totalUniqueDishes,
    topDishes,
    favoriteDessert,
    dessertsOrdersCount,
    fidelities,
    discountSaved,
    topMonth,
    topMonthCount,
    averageOrderPosition,
  };
}

/**
 * Calcule le montant total dépensé pour toutes les commandes.
 */
function calculateTotalSpent(orders) {
  return orders.reduce((sum, order) => sum + (Number(order.total_due) || 0), 0);
}

/**
 * Calcule le nombre total de plats différents commandés.
 */
function calculateTotalUniqueDishes(orders) {
  const uniqueDishes = new Set();
  orders.forEach((order) => {
    order.products.forEach((product) => uniqueDishes.add(product.title));
  });
  return uniqueDishes.size;
}

/**
 * Calcule les 3 plats les plus commandés (en considérant uniquement le premier produit de chaque commande).
 */
function calculateTopDishes(orders) {
  const firstProductCount = {};
  orders.forEach((order) => {
    if (order.products.length > 0) {
      const firstProduct = order.products[0].title;
      firstProductCount[firstProduct] =
        (firstProductCount[firstProduct] || 0) + 1;
    }
  });

  return Object.entries(firstProductCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([title, count]) => ({ title, count }));
}

/**
 * Calcule le dessert favori (le plus commandé en excluant le premier produit de chaque commande).
 */
function calculateFavoriteDessert(orders) {
  const dessertCount = {};
  orders.forEach((order) => {
    if (order.products.length > 1) {
      const desserts = order.products.slice(1);
      desserts.forEach((product) => {
        dessertCount[product.title] = (dessertCount[product.title] || 0) + 1;
      });
    }
  });

  if (Object.keys(dessertCount).length === 0) {
    return { title: "Aucun dessert commandé", count: 0 };
  }

  const [dessertTitle, dessertCountValue] = Object.entries(dessertCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return { title: dessertTitle, count: dessertCountValue };
}

/**
 * Calcule le nombre de commandes qui incluent un dessert (plus d'un produit).
 */
function calculateDessertsOrdersCount(orders) {
  return orders.filter((order) => order.products.length > 1).length;
}

/**
 * Calcule le classement moyen des commandes sur l'année.
 * @param {Array} orders - Tableau d'objets commande.
 * @returns {number} - Classement moyen.
 */
function calculateAverageOrderPosition(orders) {
  if (orders.length === 0) return 0;
  const totalPosition = orders.reduce(
    (sum, order) => sum + (order.orderPosition || 0),
    0
  );
  return totalPosition / orders.length;
}

/**
 * Calcule le nombre total de points de fidélité accumulés.
 */
function calculateFidelityPoints(orders) {
  const pointsRegex = /\+(\d+)\s*pts/;
  const pointsFidelity = orders.map((order) => {
    if (!order.points_fidelity) return 0;
    const match = order.points_fidelity.match(pointsRegex);
    return match ? Number(match[1]) : 0;
  });

  return pointsFidelity.reduce((sum, points) => sum + points, 0);
}

/**
 * Calcule le total économisé grâce aux réductions.
 */
function calculateTotalDiscountSaved(orders) {
  let totalDiscount = 0;
  orders.forEach((order) => {
    order.discounts.forEach((discount) => {
      discount = Number(discount);
      totalDiscount += discount; // Montant négatif
    });
  });
  return -totalDiscount; // On le rend positif
}

/**
 * Calcule le mois (au format français) où l'utilisateur a passé le plus de commandes.
 * @param {Array} orders - Liste des commandes.
 * @returns {{ topMonth: string, topMonthCount: number }}
 */
function calculateTopMonth(orders) {
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const monthCount = {};

  orders.forEach((order) => {
    // fullDate format: "YYYY-MM-DD HH:MM"
    const [datePart] = order.fullDate.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    monthCount[month] = (monthCount[month] || 0) + 1;
  });

  // Trouver le mois avec le plus de commandes
  let topMonth = null;
  let topMonthCount = 0;

  Object.entries(monthCount).forEach(([m, count]) => {
    if (count > topMonthCount) {
      topMonthCount = count;
      topMonth = parseInt(m, 10);
    }
  });

  return {
    topMonth: topMonth ? monthNames[topMonth - 1] : "Aucun",
    topMonthCount,
  };
}

/**
 * Initialise et gère le diaporama.
 * @param {Array} slides - Tableau d'objets représentant les slides.
 */
function initializeSlideshow(slides) {
  const slidesContainer = document.getElementById("slides-container");
  const progressBar = document.getElementById("progress-bar");
  const navButtons = document.getElementById("nav-buttons");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  let currentSlide = 0;
  let interval = null;
  const slideDuration = 15000; // 15 secondes

  function showSlide(index) {
    slidesContainer.innerHTML = "";
    const slide = slides[index];

    // Gestion du rendu spécifique selon le type de slide
    if (slide.isPodium) {
      renderPodiumSlide(slide);
    } else if (slide.isDessertOrdersCount) {
      renderDessertOrdersCountSlide(slide);
    } else if (slide.isCombined) {
      renderGainsEtEconomiesSlide(slide);
    } else if (slide.isFavoriteDessert) {
      renderFavoriteDessertSlide(slide);
    } else {
      renderStandardSlide(slide);
    }

    // Afficher les boutons de navigation sauf pour l'intro
    if (!slide.isIntro) navButtons.classList.remove("hidden");
  }

  /**
   * Slide Top 3 des Plats
   */
  function renderPodiumSlide(slide) {
    // On récupère le 1er, 2e et 3e du topDishes
    // (Ils sont déjà triés dans l’ordre décroissant : 0 => top1, 1 => top2, 2 => top3)
    const [firstPlace, secondPlace, thirdPlace] = slide.topDishes;

    const podiumContainer = document.createElement("div");
    podiumContainer.classList.add("w-full", "flex", "flex-col", "items-center");

    // Titre du podium
    const titleElement = document.createElement("h2");
    titleElement.classList.add("text-2xl", "font-semibold", "mb-4");
    titleElement.textContent = slide.podiumTitle;
    podiumContainer.appendChild(titleElement);

    // Container aligné en bas pour faire un « vrai » podium
    const blocksContainer = document.createElement("div");
    blocksContainer.classList.add(
      "flex",
      "justify-center",
      "items-end", // Aligne les blocs en bas
      "space-x-4",
      "mb-4"
    );

    // 2e place (bloc de taille moyenne, à gauche)
    const secondBlock = createPodiumBlock({
      title: secondPlace.title,
      count: secondPlace.count,
      blockClasses:
        "bg-podium-silver h-44 w-20 flex flex-col items-center justify-end rounded-t-md",
    });

    // 1ʳᵉ place (bloc le plus haut, au centre)
    const firstBlock = createPodiumBlock({
      title: firstPlace.title,
      count: firstPlace.count,
      blockClasses:
        "bg-podium-gold h-56 w-20 flex flex-col items-center justify-end rounded-t-md",
    });

    // 3ᵉ place (bloc le plus petit, à droite)
    const thirdBlock = createPodiumBlock({
      title: thirdPlace.title,
      count: thirdPlace.count,
      blockClasses:
        "bg-podium-bronze h-32 w-20 flex flex-col items-center justify-end rounded-t-md",
    });

    // Ajout des blocs au container
    blocksContainer.appendChild(secondBlock);
    blocksContainer.appendChild(firstBlock);
    blocksContainer.appendChild(thirdBlock);
    podiumContainer.appendChild(blocksContainer);

    // Petit texte de conclusion sous le podium
    const paragraph = document.createElement("p");
    paragraph.classList.add("mt-4", "text-lg", "text-center");
    paragraph.innerHTML = paragraph.innerHTML = slide.podiumConclusion;
    podiumContainer.appendChild(paragraph);

    // On vide le container parent et on y injecte notre nouveau podium
    slidesContainer.appendChild(podiumContainer);

    // Met à jour la navigation (boutons, barre de progression, etc.)
    updateNavigation();
  }

  /**
   * Fonction utilitaire pour créer un bloc de podium
   */
  function createPodiumBlock({ title, count, blockClasses }) {
    const block = document.createElement("div");
    block.className = blockClasses;

    // On affiche le nombre de commandes en bas du bloc
    const countElement = document.createElement("div");
    countElement.classList.add("text-2xl", "font-bold", "mb-2");
    countElement.textContent = count;

    // Titre du plat (en bas également)
    const titleElement = document.createElement("div");
    titleElement.classList.add("text-sm", "text-center", "pb-2");
    titleElement.textContent = title;

    // On empile countElement puis titleElement
    block.appendChild(countElement);
    block.appendChild(titleElement);

    return block;
  }

  /**
   * Slide Nombre de Desserts
   */
  function renderDessertOrdersCountSlide(slide) {
    const dessertOrdersElement = document.createElement("div");
    dessertOrdersElement.classList.add("flex", "flex-col", "items-center");
    dessertOrdersElement.innerHTML = `<p class="text-lg">${slide.dessertCountText}</p>`;
    slidesContainer.appendChild(dessertOrdersElement);
    updateNavigation();
  }

  /**
   * Slide Vos Gains et Économies
   */
  function renderGainsEtEconomiesSlide(slide) {
    const element = document.createElement("div");
    element.classList.add("flex", "flex-col", "items-center");
    element.innerHTML = `
      <p class="text-lg">
        En 2024, vous avez investi 
        <span class="text-4xl font-bold text-green-600">${slide.totalSpent}€</span> 
        dans votre bonheur gustatif (et on applaudit ça 👏).<br><br>
        Avec <span class="text-4xl font-bold text-green-600">${slide.fidelities}</span> points de fidélité 
        et <span class="text-4xl font-bold text-green-600">${slide.discountSaved}€</span> d’économies,<br>
        vous êtes presque prêt(e) à devenir ministre de l'Économie... gastronomique. 💶🍲
      </p>
    `;
    slidesContainer.appendChild(element);
    updateNavigation();
  }

  /**
   * Slide Dessert Favori
   */
  function renderFavoriteDessertSlide(slide) {
    const dessertElement = document.createElement("div");
    dessertElement.classList.add("flex", "flex-col", "items-center");

    if (slide.favoriteDessert.count === 0) {
      // Cas où aucun dessert n'a été commandé
      dessertElement.innerHTML = `<p class="text-lg">${slide.noDessertText}</p>`;
      slidesContainer.appendChild(dessertElement);
      updateNavigation();
      return;
    }

    dessertElement.innerHTML = `<p class="text-lg">${slide.favoriteDessertText}</p>`;
    slidesContainer.appendChild(dessertElement);
    updateNavigation();
  }

  /**
   * Slide standard (intro, conclusion, ou toute slide simple).
   */
  function renderStandardSlide(slide) {
    const slideElement = document.createElement("div");
    slideElement.classList.add(
      "absolute",
      "inset-0",
      "flex",
      "flex-col",
      "justify-center",
      "items-center",
      "transition-opacity",
      "duration-500",
      "opacity-0",
      "animate-fadeIn"
    );

    let innerHTML = `<p class="text-lg mb-8">${slide.text}</p>`;
    if (slide.isIntro) {
      innerHTML += `<button id="start-button" class="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-300">${slide.cta}</button>`;
    }

    slideElement.innerHTML = innerHTML;
    slidesContainer.appendChild(slideElement);

    // Animation de fade-in
    requestAnimationFrame(() => {
      slideElement.classList.remove("opacity-0");
      slideElement.classList.add("opacity-100");
    });

    if (slide.isIntro) {
      handleIntroSlide();
    } else {
      updateNavigation();
    }
  }

  /**
   * Gère l'action du bouton "Commencer" dans la slide d'intro.
   */
  function handleIntroSlide() {
    navButtons.classList.add("hidden");
    stopAutoPlay();

    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => {
        currentSlide++;
        showSlide(currentSlide);
        updateProgressBar();
        navButtons.classList.remove("hidden");
        startAutoPlay();
      });
    }
  }

  /**
   * Met à jour l'affichage des boutons et la barre de progression.
   */
  function updateNavigation() {
    updateProgressBar();

    // Affiche le bouton "Précédent" sauf sur la slide d'intro
    if (currentSlide > 0) {
      prevButton.classList.remove("hidden");
    } else {
      prevButton.classList.add("hidden");
    }

    // Gère l'affichage du bouton "Suivant"
    if (currentSlide === slides.length - 1) {
      nextButton.classList.add("hidden");
    } else {
      nextButton.classList.remove("hidden");
    }
  }

  function updateProgressBar() {
    const progress = (currentSlide / (slides.length - 1)) * 100;
    progressBar.style.width = progress + "%";
  }

  function startAutoPlay() {
    if (interval !== null) return;
    interval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoPlay() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
      currentSlide = slides.length - 1;
      stopAutoPlay();
      return;
    }
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) currentSlide = 0;
    showSlide(currentSlide);
  }

  // Événements des boutons de navigation
  nextButton.addEventListener("click", () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
  });

  prevButton.addEventListener("click", () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
  });

  // Affiche la première slide
  showSlide(currentSlide);
}
