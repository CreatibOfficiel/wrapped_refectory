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

    gainsAndSavings: `En 2024, vous avez investi 
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

    noOrdersMessage: "Aucune commande trouvée pour 2024.",

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

    gainsAndSavings: `In 2024, you invested 
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

    noOrdersMessage: "No orders found for 2024.",

    buttons: {
      prev: "Previous",
      next: "Next",
    },
  },
};

/**
 * Replaces {{ placeholders }} with corresponding values in data
 * @param {string} text - The text containing placeholders.
 * @param {Object} data - An object containing key-value pairs for replacement.
 * @returns {string} - The text with placeholders replaced by actual values.
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
 * Returns the array of slides based on the selected language.
 * @param {Object} yearData - Calculated data (totalSpent, etc.).
 * @param {string} language - Language code ("fr" or "en").
 * @returns {Array} - Array of slides.
 */
function getSlides(yearData, language) {
  const t = translations[language] || translations.fr;

  // Destructure the top dishes
  const [firstPlace, secondPlace, thirdPlace] = yearData.topDishes || [];

  // Initialize slides array
  const slides = [
    // 1. Intro Slide
    {
      isIntro: true,
      text: replacePlaceholders(t.introText, {}),
      cta: t.introCTA,
    },
    // 2. Orders & Culinary Diversity Slide
    {
      text: replacePlaceholders(t.ordersAndDiversity, {
        totalOrders: yearData.totalOrders,
        totalUniqueDishes: yearData.totalUniqueDishes,
      }),
    },
    // 3. Top 3 Dishes (Podium) Slide
    {
      isPodium: true,
      topDishes: yearData.topDishes,
      podiumTitle: t.podiumTitle,
      podiumConclusion: replacePlaceholders(t.podiumConclusion, {
        firstTitle: firstPlace?.title || "-",
        firstCount: firstPlace?.count || "0",
      }),
    },
    // 4. Gains and Savings Slide
    {
      isCombined: true,
      totalSpent: yearData.totalSpent.toFixed(2),
      fidelities: yearData.fidelities,
      discountSaved: yearData.discountSaved.toFixed(2),
      combinedText: replacePlaceholders(t.gainsAndSavings, {
        totalSpent: yearData.totalSpent.toFixed(2),
        fidelities: yearData.fidelities,
        discountSaved: yearData.discountSaved.toFixed(2),
      }),
    },
    // 5. Average Spent & Position Slide
    {
      text: replacePlaceholders(t.averageSpentAndPosition, {
        averageSpent: yearData.averageSpent.toFixed(2),
        averageOrderPosition: Math.round(yearData.averageOrderPosition),
      }),
    },
    // 6. Favorite Month Slide
    {
      text: replacePlaceholders(t.favoriteMonth, {
        topMonth: yearData.topMonth,
        topMonthCount: yearData.topMonthCount,
      }),
    },
  ];

  // Add Dessert Slides only if there are dessert orders
  if (yearData.dessertsOrdersCount > 0) {
    slides.push(
      // 7. Dessert Count Slide
      {
        isDessertOrdersCount: true,
        dessertOrdersCount: yearData.dessertsOrdersCount,
        dessertCountText: replacePlaceholders(t.dessertCount, {
          dessertsOrdersCount: yearData.dessertsOrdersCount,
        }),
      },
      // 8. Favorite Dessert Slide
      {
        isFavoriteDessert: true,
        favoriteDessert: yearData.favoriteDessert,
        noDessertText: t.noDessert,
        favoriteDessertText: replacePlaceholders(t.favoriteDessert, {
          title: yearData.favoriteDessert.title,
          count: yearData.favoriteDessert.count,
        }),
      }
    );
  }

  // 9. Conclusion Slide
  slides.push({
    text: replacePlaceholders(t.conclusion, {}),
  });

  return slides;
}

/**
 * Displays a message indicating that no orders were found.
 * Also handles the translation of the message if necessary.
 * @param {string} language - Language code ("fr" or "en").
 */
function displayNoOrdersMessage(language) {
  const slidesContainer = document.getElementById("slides-container");
  const t = translations[language] || translations.fr;
  slidesContainer.innerHTML = `<p class="text-xl text-gray-500">${t.noOrdersMessage}</p>`;
}

/**
 * Updates the navigation button texts based on the selected language.
 * @param {string} language - Language code ("fr" or "en").
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
  // Retrieve orders (and language) via the service worker
  chrome.runtime.sendMessage({ action: "getOrders" }, (response) => {
    const orders = response?.orders || [];
    const pageLanguage = response?.language || "fr"; // or "en"

    if (!orders.length) {
      displayNoOrdersMessage(pageLanguage);
      return;
    }

    // Update the navigation button texts
    updateButtonTexts(pageLanguage);

    // Calculate annual data
    const yearData = calculateYearData(orders);

    // Generate slides with this data
    const slides = getSlides(yearData, pageLanguage);

    // Initialize the slideshow
    initializeSlideshow(slides);
  });
});

/**
 * Calculates the annual data from the list of orders.
 * @param {Array} orders - Array of order objects.
 * @returns {Object} yearData - Calculated data for the year.
 */
function calculateYearData(orders) {
  console.log("Calculating year data from orders:", orders);
  const totalOrders = orders.length;
  const totalSpent = calculateTotalSpent(orders);
  const averageSpent = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const totalUniqueDishes = calculateTotalUniqueDishes(orders);
  const topDishes = calculateTopDishes(orders);
  const favoriteDessert = calculateFavoriteDessert(orders);
  const dessertsOrdersCount = calculateDessertsOrdersCount(orders);
  const fidelities = calculateFidelityPoints(orders);
  const discountSaved = calculateTotalDiscountSaved(orders);
  // No longer using delivery hour (averageDeliveryHour) in the new version
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
 * Calculates the total amount spent on all orders.
 * @param {Array} orders - Array of order objects.
 * @returns {number} - Total amount spent.
 */
function calculateTotalSpent(orders) {
  return orders.reduce((sum, order) => sum + (Number(order.total_due) || 0), 0);
}

/**
 * Calculates the total number of unique dishes ordered.
 * @param {Array} orders - Array of order objects.
 * @returns {number} - Total unique dishes.
 */
function calculateTotalUniqueDishes(orders) {
  const uniqueDishes = new Set();
  orders.forEach((order) => {
    order.products.forEach((product) => uniqueDishes.add(product.title));
  });
  return uniqueDishes.size;
}

/**
 * Calculates the top 3 most ordered dishes (considering only the first product of each order).
 * @param {Array} orders - Array of order objects.
 * @returns {Array} - Array of top 3 dishes with title and count.
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
 * Calculates the favorite dessert (most ordered excluding the first product of each order).
 * @param {Array} orders - Array of order objects.
 * @returns {Object} - Favorite dessert with title and count.
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
 * Calculates the number of orders that include a dessert (more than one product).
 * @param {Array} orders - Array of order objects.
 * @returns {number} - Number of dessert-inclusive orders.
 */
function calculateDessertsOrdersCount(orders) {
  return orders.filter((order) => order.products.length > 1).length;
}

/**
 * Calculates the average order position throughout the year.
 * @param {Array} orders - Array of order objects.
 * @returns {number} - Average order position.
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
 * Calculates the total number of fidelity points accumulated.
 * @param {Array} orders - Array of order objects.
 * @returns {number} - Total fidelity points.
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
 * Calculates the total amount saved through discounts.
 * @param {Array} orders - Array of order objects.
 * @returns {number} - Total discounts saved.
 */
function calculateTotalDiscountSaved(orders) {
  let totalDiscount = 0;
  orders.forEach((order) => {
    order.discounts.forEach((discount) => {
      discount = Number(discount);
      totalDiscount += discount; // Negative amount
    });
  });
  return -totalDiscount; // Make it positive
}

/**
 * Calculates the month with the highest number of orders.
 * @param {Array} orders - List of orders.
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

  // Find the month with the highest number of orders
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
 * Initializes and manages the slideshow.
 * @param {Array} slides - Array of slide objects.
 */
function initializeSlideshow(slides) {
  const slidesContainer = document.getElementById("slides-container");
  const progressBar = document.getElementById("progress-bar");
  const navButtons = document.getElementById("nav-buttons");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  let currentSlide = 0;
  let interval = null;
  const slideDuration = 15000; // 15 seconds

  function showSlide(index) {
    slidesContainer.innerHTML = "";
    const slide = slides[index];

    // Handle specific rendering based on slide type
    if (slide.isPodium) {
      renderPodiumSlide(slide);
    } else if (slide.isDessertOrdersCount) {
      renderDessertOrdersCountSlide(slide);
    } else if (slide.isCombined) {
      renderGainsAndSavingsSlide(slide);
    } else if (slide.isFavoriteDessert) {
      renderFavoriteDessertSlide(slide);
    } else {
      renderStandardSlide(slide);
    }

    // Show navigation buttons except on the intro slide
    if (!slide.isIntro) navButtons.classList.remove("hidden");
  }

  /**
   * Podium Slide (Top 3 Dishes)
   */
  function renderPodiumSlide(slide) {
    // Get the top 1st, 2nd, and 3rd dishes
    const [firstPlace, secondPlace, thirdPlace] = slide.topDishes;

    const podiumContainer = document.createElement("div");
    podiumContainer.classList.add("w-full", "flex", "flex-col", "items-center");

    // Podium Title
    const titleElement = document.createElement("h2");
    titleElement.classList.add("text-2xl", "font-semibold", "mb-4");
    titleElement.textContent = slide.podiumTitle;
    podiumContainer.appendChild(titleElement);

    // Container aligned at the bottom for a "real" podium look
    const blocksContainer = document.createElement("div");
    blocksContainer.classList.add(
      "flex",
      "justify-center",
      "items-end", // Align blocks at the bottom
      "space-x-4",
      "mb-4"
    );

    if (secondPlace) {
      // 2nd place (medium-sized block, on the left)
      const secondBlock = createPodiumBlock({
        title: secondPlace.title,
        count: secondPlace.count,
        blockClasses:
          "bg-podium-silver h-44 w-20 flex flex-col items-center justify-end rounded-t-md",
      });
      blocksContainer.appendChild(secondBlock);
    }

    if (firstPlace) {
      // 1st place (tallest block, in the center)
      const firstBlock = createPodiumBlock({
        title: firstPlace.title,
        count: firstPlace.count,
        blockClasses:
          "bg-podium-gold h-56 w-20 flex flex-col items-center justify-end rounded-t-md",
      });
      blocksContainer.appendChild(firstBlock);
    }

    if (thirdPlace) {
      // 3rd place (smallest block, on the right)
      const thirdBlock = createPodiumBlock({
        title: thirdPlace.title,
        count: thirdPlace.count,
        blockClasses:
          "bg-podium-bronze h-32 w-20 flex flex-col items-center justify-end rounded-t-md",
      });
      blocksContainer.appendChild(thirdBlock);
    }

    // Add the podium to the main container
    podiumContainer.appendChild(blocksContainer);

    // Conclusion text below the podium
    const paragraph = document.createElement("p");
    paragraph.classList.add("mt-4", "text-lg", "text-center");
    paragraph.innerHTML = slide.podiumConclusion;
    podiumContainer.appendChild(paragraph);

    // Clear the parent container and inject the new podium
    slidesContainer.appendChild(podiumContainer);

    // Update navigation (buttons, progress bar, etc.)
    updateNavigation();
  }

  /**
   * Utility function to create a podium block
   * @param {Object} params - Parameters for the podium block.
   * @param {string} params.title - Title of the dish.
   * @param {number} params.count - Number of orders.
   * @param {string} params.blockClasses - CSS classes for styling.
   * @returns {HTMLElement} - The podium block element.
   */
  function createPodiumBlock({ title, count, blockClasses }) {
    const block = document.createElement("div");
    block.className = blockClasses;

    // Display the number of orders at the bottom of the block
    const countElement = document.createElement("div");
    countElement.classList.add("text-2xl", "font-bold", "mb-2");
    countElement.textContent = count;

    // Dish title (also at the bottom)
    const titleElement = document.createElement("div");
    titleElement.classList.add("text-sm", "text-center", "pb-2");
    titleElement.textContent = title;

    // Stack countElement and titleElement
    block.appendChild(countElement);
    block.appendChild(titleElement);

    return block;
  }

  /**
   * Dessert Orders Count Slide
   */
  function renderDessertOrdersCountSlide(slide) {
    const dessertOrdersElement = document.createElement("div");
    dessertOrdersElement.classList.add("flex", "flex-col", "items-center");
    dessertOrdersElement.innerHTML = `<p class="text-lg">${slide.dessertCountText}</p>`;
    slidesContainer.appendChild(dessertOrdersElement);
    updateNavigation();
  }

  /**
   * Gains and Savings Slide
   */
  function renderGainsAndSavingsSlide(slide) {
    const element = document.createElement("div");
    element.classList.add("flex", "flex-col", "items-center");
    element.innerHTML = `
      <p class="text-lg">
        ${slide.combinedText}
      </p>
    `;
    slidesContainer.appendChild(element);
    updateNavigation();
  }

  /**
   * Favorite Dessert Slide
   */
  function renderFavoriteDessertSlide(slide) {
    const dessertElement = document.createElement("div");
    dessertElement.classList.add("flex", "flex-col", "items-center");

    if (slide.favoriteDessert.count === 0) {
      // Case where no dessert was ordered
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
   * Standard Slide (intro, conclusion, or any simple slide).
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

    // Fade-in animation
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
   * Handles the "Start" button action on the intro slide.
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
   * Updates the display of navigation buttons and the progress bar.
   */
  function updateNavigation() {
    updateProgressBar();

    // Show the "Previous" button except on the intro slide
    if (currentSlide > 0) {
      prevButton.classList.remove("hidden");
    } else {
      prevButton.classList.add("hidden");
    }

    // Manage the display of the "Next" button
    if (currentSlide === slides.length - 1) {
      nextButton.classList.add("hidden");
    } else {
      nextButton.classList.remove("hidden");
    }
  }

  /**
   * Updates the progress bar based on the current slide.
   */
  function updateProgressBar() {
    const progress = (currentSlide / (slides.length - 1)) * 100;
    progressBar.style.width = progress + "%";
  }

  /**
   * Starts the automatic slideshow playback.
   */
  function startAutoPlay() {
    if (interval !== null) return;
    interval = setInterval(nextSlide, slideDuration);
  }

  /**
   * Stops the automatic slideshow playback.
   */
  function stopAutoPlay() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  /**
   * Advances to the next slide.
   */
  function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
      currentSlide = slides.length - 1;
      stopAutoPlay();
      return;
    }
    showSlide(currentSlide);
  }

  /**
   * Goes back to the previous slide.
   */
  function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) currentSlide = 0;
    showSlide(currentSlide);
  }

  // Event listeners for navigation buttons
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

  // Display the first slide
  showSlide(currentSlide);
}
