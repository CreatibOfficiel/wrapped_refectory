document.addEventListener("DOMContentLoaded", () => {
  // Récupère les commandes via le service worker
  chrome.runtime.sendMessage({ action: "getOrders" }, (response) => {
    const orders = response?.data || [];

    if (!orders.length) {
      displayNoOrdersMessage();
      return;
    }

    // Calculer les données annuelles
    const yearData = calculateYearData(orders);

    // Générer les slides avec ces données
    const slides = generateSlides(yearData);

    // Initialiser le diaporama
    initializeSlideshow(slides);
  });
});

/**
 * Affiche un message indiquant qu'aucune commande n'a été trouvée.
 */
function displayNoOrdersMessage() {
  const slidesContainer = document.getElementById("slides-container");
  slidesContainer.innerHTML =
    '<p class="text-xl text-gray-500">Aucune commande trouvée pour cette année.</p>';
}

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
  const averageDeliveryHour = calculateAverageDeliveryHour(orders, totalOrders);
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
    averageDeliveryHour,
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
  console.log(orders);
  orders.forEach((order) => {
    console.log(order.discounts);
    order.discounts.forEach((discount) => {
      console.log(discount);
      discount = Number(discount);
      totalDiscount += discount; // Montant négatif
    });
  });
  return -totalDiscount; // On le rend positif
}

/**
 * Calcule l'heure moyenne de livraison (moyenne des heures de livraison).
 */
function calculateAverageDeliveryHour(orders, totalOrders) {
  const totalDeliveryMinutes = orders.reduce((sum, order) => {
    if (order.hour) {
      const [hours, minutes] = order.hour.split(":").map(Number);
      return sum + (hours * 60 + minutes);
    }
    return sum;
  }, 0);

  const averageDeliveryTime =
    totalOrders > 0 ? totalDeliveryMinutes / totalOrders : 0;
  return minutesToTimeString(Math.round(averageDeliveryTime));
}

/**
 * Convertit un nombre total de minutes en une chaîne "HH:MM".
 */
function minutesToTimeString(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
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
 * Génère un tableau de slides avec un ton humoristique, basé sur les données annuelles.
 */
function generateSlides(yearData) {
  return [
    {
      isIntro: true,
      text: `2024, c'est l'année des grandes faims... et des grands festins ! Prêt à découvrir votre bilan gourmand ?`,
      cta: "Commencer",
    },
    {
      text: `Vous avez passé un total de <span class="text-4xl font-bold text-green-600">${yearData.totalOrders}</span> commandes cette année.<br>On dirait que votre estomac a mené une révolution, et a gagné haut la main !`,
    },
    {
      isCombined: true,
      totalSpent: yearData.totalSpent.toFixed(2),
      fidelities: yearData.fidelities,
    },
    {
      text: `Sinon, vous avez dégusté <span class="text-4xl font-bold text-green-600">${yearData.totalUniqueDishes}</span> plats différents cette année.<br>Une véritable odyssée culinaire !`,
    },
    {
      isPodium: true,
      topDishes: yearData.topDishes,
    },
    {
      text: `Le mois où vous avez passé le plus de commandes est <span class="text-4xl font-bold text-green-600">${yearData.topMonth}</span> avec <span class="text-4xl font-bold text-green-600">${yearData.topMonthCount}</span> commandes.<br>On dirait que ce mois est votre préféré pour régaler vos papilles !`,
    },
    {
      isAverageOrderPosition: true,
      averageOrderPosition: yearData.averageOrderPosition,
    },
    {
      isDessertOrdersCount: true,
      dessertOrdersCount: yearData.dessertsOrdersCount,
    },
    {
      isFavoriteDessert: true,
      favoriteDessert: yearData.favoriteDessert,
    },
    {
      text: `En moyenne, vous avez dépensé <span class="text-4xl font-bold text-green-600">${yearData.averageSpent.toFixed(
        2
      )}€</span> par commande, avec une livraison à <span class="text-4xl font-bold text-green-600">${
        yearData.averageDeliveryHour
      }</span>.<br>Toujours à l'heure ! (pas comme la SNCF 🤫)`,
    },
    {
      text: `Grâce aux réductions, vous avez économisé <span class="text-4xl font-bold text-green-600">${yearData.discountSaved}€</span>.<br>Vous avez pensé à faire un petit cadre pour ce billet virtuel de bonheur ?`,
    },
    {
      text: `Merci d'avoir croqué dans 2024 avec nous !<br>On se retrouve en 2025 pour encore plus de plats délirants, de surprises gustatives, et de petites folies culinaires.<br>Bon appétit à jamais !`,
    },
  ];
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
  const slideDuration = 10000; // 10 secondes

  function showSlide(index) {
    slidesContainer.innerHTML = "";
    const slide = slides[index];

    if (slide.isPodium) {
      renderPodiumSlide(slide);
    } else if (slide.isDessertOrdersCount) {
      renderDessertOrdersCountSlide(slide);
    } else if (slide.isCombined) {
      renderCombinedSlide(slide);
    } else if (slide.isFavoriteDessert) {
      renderFavoriteDessertSlide(slide);
    } else if (slide.isAverageOrderPosition) {
      renderAverageOrderPositionSlide(slide);
    } else {
      renderStandardSlide(slide);
    }

    // Afficher les boutons de navigation sauf pour l'intro
    if (!slide.isIntro) navButtons.classList.remove("hidden");
  }

  function renderPodiumSlide(slide) {
    const podiumElement = document.createElement("div");
    podiumElement.classList.add("flex", "flex-col", "items-center");
    podiumElement.innerHTML = `
            <h2 class="text-2xl font-semibold mb-4">Top 3 de vos plats les plus dévorés</h2>
            <div class="flex space-x-6">
                ${slide.topDishes
                  .map(
                    (dish) => `
                    <div class="flex flex-col items-center">
                        <div class="bg-yellow-400 p-4 rounded-lg shadow-lg">
                            <span class="text-3xl font-bold">${dish.count}</span>
                        </div>
                        <span class="mt-2 text-lg">${dish.title}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <p class="mt-4 text-lg">
                Votre plat fétiche ? Le <span class="text-4xl font-bold text-green-600">${
                  slide.topDishes[0].title
                }</span> !
                Commandé <span class="text-4xl font-bold text-green-600">${
                  slide.topDishes[0].count
                }</span> fois.<br>
                À ce rythme, on va lui donner votre nom, histoire de le rendre officiel.
            </p>
        `;
    slidesContainer.appendChild(podiumElement);
    updateNavigation();
  }

  function renderDessertOrdersCountSlide(slide) {
    const dessertOrdersElement = document.createElement("div");
    dessertOrdersElement.classList.add("flex", "flex-col", "items-center");
    dessertOrdersElement.innerHTML = `
            <p class="text-lg">
                Et niveau douceurs, vous avez commandé au moins <span class="text-4xl font-bold text-green-600">${slide.dessertOrdersCount}</span> fois un dessert.<br>
                Votre dent sucrée vous remercie ! 🍰😋
            </p>
        `;
    slidesContainer.appendChild(dessertOrdersElement);
    updateNavigation();
  }

  function renderCombinedSlide(slide) {
    const combinedElement = document.createElement("div");
    combinedElement.classList.add("flex", "flex-col", "items-center");
    combinedElement.innerHTML = `
            <p class="text-lg mb-4">
                Avec toutes ces commandes, vous avez laissé <span class="text-4xl font-bold text-green-600">${slide.totalSpent}€</span> dans nos cuisines...<br>
                On vous jure, pas un centime n'a servi à acheter une licorne en chocolat (quoique...).
            </p>
            <p class="text-lg">
                Grâce à ça, vous avez gagné <span class="text-green-600 font-semibold">${slide.fidelities}</span> points de fidélité ! 🎉
            </p>
        `;
    slidesContainer.appendChild(combinedElement);
    updateNavigation();
  }

  function renderFavoriteDessertSlide(slide) {
    const dessertElement = document.createElement("div");
    dessertElement.classList.add("flex", "flex-col", "items-center");

    if (slide.favoriteDessert.count === 0) {
      dessertElement.innerHTML = `
                <p class="text-lg">
                    Vous n'avez commandé aucun dessert cette année. Pas de souci, on ne vous en voudra pas !
                </p>
            `;
      slidesContainer.appendChild(dessertElement);
      updateNavigation();
      return;
    }
    dessertElement.innerHTML = `
            <h2 class="text-2xl font-semibold mb-4">Votre Dessert Favori</h2>
            <div class="bg-yellow-400 p-4 rounded-lg shadow-lg">
                <span class="text-3xl font-bold">${slide.favoriteDessert.count} ${slide.favoriteDessert.title}</span>
            </div>
            <p class="mt-4 text-lg">On peut dire que ${slide.favoriteDessert.title} a fait sensation, qui a besoin de crème brûlée quand on a ça ? 🍨✨</p>
        `;
    slidesContainer.appendChild(dessertElement);
    updateNavigation();
  }

  function renderAverageOrderPositionSlide(slide) {
    const averagePositionElement = document.createElement("div");
    averagePositionElement.classList.add("flex", "flex-col", "items-center");
    averagePositionElement.innerHTML = `
            <p class="text-lg">
                Vous êtes en moyenne le <span class="text-4xl font-bold text-green-600">${Math.round(
                  slide.averageOrderPosition
                )}</span>${
      Math.round(slide.averageOrderPosition) > 1 ? "ème" : "er"
    } à commander sur votre lieu de livraison chaque jour.<br>
                Continuez ainsi pour grimper dans les classements culinaires ! 🏆🍽️
            </p>
        `;
    slidesContainer.appendChild(averagePositionElement);
    updateNavigation();
  }

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
      innerHTML += `<button id="start-button" class="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-300">Commencer</button>`;
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

  function handleIntroSlide() {
    navButtons.classList.add("hidden");
    stopAutoPlay();
    document.getElementById("start-button").addEventListener("click", () => {
      currentSlide++;
      showSlide(currentSlide);
      updateProgressBar();
      navButtons.classList.remove("hidden");
      startAutoPlay();
    });
  }

  function updateNavigation() {
    updateProgressBar();

    // Affiche le bouton "Précédent" sauf sur la slide juste après l'intro
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
