(() => {
  /**
   * Constantes pour la détection de la langue (jours anglais et français)
   */
  const ENGLISH_DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const FRENCH_DAYS = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  /**
   * Fonction utilitaire pour zero-padding des nombres.
   * @param {number} value
   * @returns {string}
   */
  function pad(value) {
    return String(value).padStart(2, "0");
  }

  /**
   * Formate une date complète au format YYYY-MM-DD HH:MM
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @param {number} hour
   * @param {number} minute
   * @returns {string}
   */
  function formatFullDate(year, month, day, hour, minute) {
    return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}`;
  }

  /**
   * Parse un prix à partir d'un texte.
   * Gère "free", les prix négatifs (ex: "-€2,50") et les formats avec virgule.
   * @param {string} priceText
   * @returns {number}
   */
  function parsePrice(priceText) {
    if (/free/i.test(priceText)) {
      return 0.0;
    } else if (/^-€/.test(priceText)) {
      return -parseFloat(priceText.replace("-€", "").replace(",", ".").trim());
    } else {
      return (
        parseFloat(priceText.replace("€", "").replace(",", ".").trim()) || 0.0
      );
    }
  }

  /**
   * Détermine si le jour indiqué est français ou anglais à partir d'un jour présent dans le texte de date.
   * @param {string} textContent
   * @returns {{isEnglish: boolean, isFrench: boolean}}
   */
  function detectLanguageFromDay(textContent) {
    const dayNameMatch = textContent.match(/^([A-Za-zéûèà]+),?/i);
    let isEnglish = false;
    let isFrench = false;

    if (dayNameMatch) {
      const dayName = dayNameMatch[1].toLowerCase();
      if (ENGLISH_DAYS.includes(dayName)) {
        isEnglish = true;
      } else if (FRENCH_DAYS.includes(dayName)) {
        isFrench = true;
      }
    }

    return { isEnglish, isFrench };
  }

  /**
   * Parse une date "aujourd'hui" ou "today".
   * @param {string} textContent
   * @returns {string|null} date formatée ou null
   */
  function parseTodayDate(textContent) {
    const todayMatch = textContent.match(
      /(?:Aujourd'hui|today)\s+(?:à|at)\s+(\d{1,2})h(\d{2})/i
    );
    if (todayMatch) {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const hour = parseInt(todayMatch[1], 10);
      const minute = parseInt(todayMatch[2], 10);
      return formatFullDate(year, month, day, hour, minute);
    }
    return null;
  }

  /**
   * Parse une date avec intervalle horaire.
   * Exemple: "Mardi, 12/03/2023 (10h30 - 12h00)"
   * On calcule le midpoint entre les deux heures.
   * @param {string} textContent
   * @param {boolean} isEnglish
   * @param {boolean} isFrench
   * @returns {string|null}
   */
  function parseIntervalDate(textContent, isEnglish, isFrench) {
    const dateTimeMatch = textContent.match(
      /(?:[A-Za-zéûèà]+,\s+)?(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s+\((\d{1,2})h(\d{2})\s*-\s*(\d{1,2})h(\d{2})\)/i
    );
    if (!dateTimeMatch) return null;

    let day, month;
    if (isEnglish) {
      month = parseInt(dateTimeMatch[1], 10);
      day = parseInt(dateTimeMatch[2], 10);
    } else if (isFrench) {
      day = parseInt(dateTimeMatch[1], 10);
      month = parseInt(dateTimeMatch[2], 10);
    } else {
      // Par défaut, on considère le même ordre que le français
      day = parseInt(dateTimeMatch[1], 10);
      month = parseInt(dateTimeMatch[2], 10);
    }

    const year = parseInt(dateTimeMatch[3], 10);
    const startHour = parseInt(dateTimeMatch[4], 10);
    const startMinute = parseInt(dateTimeMatch[5], 10);
    const endHour = parseInt(dateTimeMatch[6], 10);
    const endMinute = parseInt(dateTimeMatch[7], 10);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    const midpointTotal = Math.round((startTotal + endTotal) / 2);

    const hour = Math.floor(midpointTotal / 60);
    const minute = midpointTotal % 60;

    return formatFullDate(year, month, day, hour, minute);
  }

  /**
   * Parse une date standard sans intervalle.
   * Exemple: "Lundi, 12-03-2023 à 10h30"
   * @param {string} textContent
   * @param {boolean} isEnglish
   * @param {boolean} isFrench
   * @returns {string|null}
   */
  function parseStandardDate(textContent, isEnglish, isFrench) {
    const dateMatch = textContent.match(
      /(?:[a-zA-Zéûèà]+,?\s+)?(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s+(?:à|at)\s+(\d{1,2})h(\d{2})/i
    );
    if (!dateMatch) return null;

    let day, month;
    if (isEnglish) {
      month = parseInt(dateMatch[1], 10);
      day = parseInt(dateMatch[2], 10);
    } else if (isFrench) {
      day = parseInt(dateMatch[1], 10);
      month = parseInt(dateMatch[2], 10);
    } else {
      // Par défaut, considérer le format français
      day = parseInt(dateMatch[1], 10);
      month = parseInt(dateMatch[2], 10);
    }

    const year = parseInt(dateMatch[3], 10);
    const hour = parseInt(dateMatch[4], 10);
    const minute = parseInt(dateMatch[5], 10);

    return formatFullDate(year, month, day, hour, minute);
  }

  /**
   * Parse la date à partir du texte extrait d'une carte de commande.
   * Retourne un objet contenant { fullDate, day, month, year, hour } ou null si échec.
   * @param {string} textContent
   * @returns {{fullDate: string, day: number, month: number, year: number, hour: string} | null}
   */
  function parseDateFromText(textContent) {
    textContent = textContent.trim();
    const { isEnglish, isFrench } = detectLanguageFromDay(textContent);

    let fullDate = null;

    if (
      textContent.toLowerCase().startsWith("today") ||
      textContent.toLowerCase().startsWith("aujourd'hui")
    ) {
      fullDate = parseTodayDate(textContent);
    } else if (textContent.includes("(")) {
      // Date avec intervalle
      fullDate = parseIntervalDate(textContent, isEnglish, isFrench);
    } else {
      // Date standard sans intervalle
      fullDate = parseStandardDate(textContent, isEnglish, isFrench);
    }

    if (!fullDate) return null;

    // On va extraire les composantes de fullDate (YYYY-MM-DD HH:MM)
    const [datePart, timePart] = fullDate.split(" ");
    const [fYear, fMonth, fDay] = datePart.split("-").map(Number);
    const [fHour, fMinute] = timePart.split(":").map(Number);

    return {
      fullDate,
      day: fDay,
      month: fMonth,
      year: fYear,
      hour: `${pad(fHour)}:${pad(fMinute)}`,
    };
  }

  /**
   * Extrait les informations d'un produit à partir d'un élément de carte produit.
   * @param {Element} productElem
   * @returns {{title: string, price: number}}
   */
  function parseProduct(productElem) {
    const title =
      productElem
        .querySelector(".c-cart-detail-product__title")
        ?.innerText.trim() || "Unknown Product";
    const priceText =
      productElem.querySelector(".c-price")?.innerText.trim() || "€0.00";
    const price = parsePrice(priceText);
    return { title, price };
  }

  /**
   * Extrait les informations sur les totaux (livraison, réduction, total à payer) d'une commande.
   * @param {Element} orderCard
   * @returns {{delivery: string|null, points_fidelity: string|null, total_due: number|null, discounts: number[] }}
   */
  function parseOrderTotals(orderCard) {
    const totals = {
      delivery: null,
      points_fidelity: null,
      total_due: null,
      discounts: [],
    };

    const totalSections = orderCard.querySelectorAll(
      ".c-shared-totals__section"
    );

    totalSections.forEach((section) => {
      const totalItems = section.querySelectorAll(".c-shared-total-item");
      totalItems.forEach((item) => {
        const labelElem = item.querySelector(".c-shared-total-item__label");
        const label = labelElem
          ? labelElem.innerText.trim().toLowerCase()
          : null;
        console.log("Label trouvé :", label);
        const priceElem = item.querySelector(
          ".c-shared-total-item__price, .c-shared-total-item__price--free, .c-shared-total-item__price--loyalty, .c-shared-total-item__price--information"
        );
        console.log("Prix trouvé :", priceElem);
        const priceText = priceElem ? priceElem.innerText.trim() : null;

        if (priceText) {
          // On parse le prix
          const parsedPrice = parsePrice(priceText);

          // Vérification en fonction du label
          if (label) {
            if (label.includes("delivery") || label.includes("livraison")) {
              totals.delivery = priceText;
            } else if (
              label.includes("points fidélité") ||
              label.includes("loyalty points")
            ) {
              totals.points_fidelity = priceText;
            } else if (label.includes("total due") || label.includes("total")) {
              totals.total_due = parsedPrice;
            } else if (
              label.includes("discount") ||
              label.includes("réduction")
            ) {
              if (parsedPrice < 0) {
                totals.discounts.push(parsedPrice);
              }
            } else {
              // Aucune correspondance de label connue, si le prix est négatif, on le considère comme une réduction
              if (parsedPrice < 0) {
                totals.discounts.push(parsedPrice);
              }
            }
          } else {
            // Pas de label, si le prix est négatif, c'est une réduction
            if (parsedPrice < 0) {
              totals.discounts.push(parsedPrice);
            }
          }
        }
      });
    });

    return totals;
  }

  /**
   * Extrait le code promo d'une commande si présent.
   * @param {Element} orderCard
   * @returns {string|null}
   */
  function parsePromoCode(orderCard) {
    const promoSection = orderCard.querySelector(
      ".c-shared-totals__section-title"
    );
    if (promoSection) {
      // Vérifie que le label correspond à un code promo
      const parentItem = promoSection.closest(".c-shared-total-item");
      if (parentItem) {
        const label = parentItem.querySelector(".c-shared-total-item__label");
        if (
          label &&
          (label.innerText.toLowerCase().includes("code") ||
            label.innerText.toLowerCase().includes("promo"))
        ) {
          // Récupère le code promo
          const promoCode = promoSection.innerText.trim();
          return promoCode || null;
        }
      }
    }
    return null;
  }

  /**
   * Parse une carte de commande individuelle et renvoie un objet représentant la commande
   * ou un objet spécial si elle est d'une année à ignorer (plus récente que 2024) ou plus ancienne que 2024.
   * @param {Element} orderCard
   * @param {number} currentYear
   * @returns {object|null} L'objet commande ou { oldYearDetected/futureYearDetected: true, fullDate }.
   */
  function parseOrderCard(orderCard, currentYear) {
    if (orderCard.getAttribute("data-processed") === "true") {
      // Commande déjà traitée
      return null;
    }

    const dateSpan = orderCard.querySelector(".c-order-card__date");
    if (!dateSpan) return null;
    const dateData = parseDateFromText(dateSpan.textContent);
    if (!dateData) {
      console.error(
        "Impossible d'extraire la date complète :",
        dateSpan.textContent
      );
      return null;
    }

    const { year, month, day, fullDate, hour } = dateData;

    // --- LOGIQUE SPÉCIFIQUE ---
    // 1) Si la commande est d'une année plus grande que currentYear (ex: 2025 > 2024),
    //    on la "charge" pour continuer à défiler, mais on ne l'ajoute PAS dans le tableau.
    if (year > currentYear) {
      return {
        futureYearDetected: true, // On sait qu'on ne doit pas l'ajouter
        fullDate,
      };
    }

    // 2) Si la commande est d'une année inférieure à currentYear (ex: 2023 < 2024),
    //    on arrête tout (comme avant).
    if (year < currentYear) {
      return {
        oldYearDetected: true, // On arrêtera la boucle
        fullDate,
      };
    }

    // 3) Sinon => c'est l'année en cours (2024) => on traite et on l'ajoute
    const isSuccess = orderCard.classList.contains("c-order-card--success");
    // Récupère la section contenant la position de la commande du jour
    const positionSection = orderCard.querySelector(".c-order-card__top");
    let orderPosition = null;

    if (positionSection) {
      // Utilise un regex pour capturer uniquement le nombre à la fin de la chaîne
      const positionMatch = positionSection.textContent.trim().match(/(\d+)$/);
      if (positionMatch) {
        orderPosition = parseInt(positionMatch[1], 10); // Position dans les commandes du jour
      }
    } else {
      console.warn("Aucune section de position trouvée pour cette commande.");
    }

    // Parse produits
    const products = [];
    const productSections = orderCard.querySelectorAll(
      ".c-cart-detail-products, .c-shared-section__products"
    );
    productSections.forEach((section) => {
      const productElems = section.querySelectorAll(".c-cart-detail-product");
      productElems.forEach((productElem) => {
        products.push(parseProduct(productElem));
      });
    });

    // Parse totaux
    const { delivery, points_fidelity, total_due, discounts } =
      parseOrderTotals(orderCard);

    // Promo code
    const promo_code = parsePromoCode(orderCard);

    // Calcule total_due si non défini
    let finalTotalDue = total_due;
    if (finalTotalDue === null) {
      const productTotal = products.reduce((total, p) => total + p.price, 0);
      const discountTotal = discounts.reduce((total, d) => total + d, 0);
      finalTotalDue = Math.max(0.0, productTotal + discountTotal);
    }

    const orderData = {
      day,
      month,
      year,
      fullDate,
      orderPosition,
      hour,
      promo_code,
      products,
      total_due: finalTotalDue,
      delivery,
      discounts,
      points_fidelity,
      status: isSuccess ? "success" : "failed",
    };

    // Marquer la commande comme traitée
    orderCard.setAttribute("data-processed", "true");

    if (!isSuccess) {
      // On ne traite pas les commandes échouées
      console.log("Commande échouée, non traitée :", orderData);
      return null;
    }

    return orderData;
  }

  /**
   * Parse toutes les commandes actuellement affichées sur la page.
   * @param {number} currentYear
   * @returns {{orders: Array, foundOldYear: boolean, currentLastDate: string|null}}
   */
  function parseOrders(currentYear) {
    const orders = [];
    let foundOldYear = false;
    let currentLastDate = null;

    const orderBlocks = document.querySelectorAll(".c-paginated-list__bloc");
    console.log(`Nombre de blocs d'ordres trouvés : ${orderBlocks.length}`);

    for (const block of orderBlocks) {
      const orderCards = block.querySelectorAll(".c-order-card");
      console.log(
        `Nombre de cartes d'ordres dans ce bloc : ${orderCards.length}`
      );

      for (const orderCard of orderCards) {
        const result = parseOrderCard(orderCard, currentYear);
        if (!result) {
          // Soit déjà traité, soit pas de date trouvée
          continue;
        }

        // Si la commande est d'une année future (supérieure à 2024), on la skip (on ne l'ajoute pas dans `orders`)
        if (result.futureYearDetected) {
          currentLastDate = result.fullDate;
          // On continue sans rien ajouter au tableau
          continue;
        }

        // Si la commande est d'une année plus ancienne que 2024 => on arrête
        if (result.oldYearDetected) {
          foundOldYear = true;
          currentLastDate = result.fullDate;
          break;
        }

        // Sinon => c'est une commande de 2024 => on l'ajoute
        orders.push(result);
        currentLastDate = result.fullDate;
      }

      if (foundOldYear) break;
    }

    return { orders, foundOldYear, currentLastDate };
  }

  /**
   * Clique sur le bouton "Afficher plus" s'il existe, puis attend 3s.
   * @returns {Promise<boolean>} True si le bouton a été cliqué, False s'il n'existe pas.
   */
  async function clickShowMore() {
    const showMoreButton = document.querySelector(
      ".c-paginated-list__more-wrap .c-show-more"
    );
    if (showMoreButton) {
      showMoreButton.click();
      console.log(
        "Bouton 'Afficher plus de commandes' cliqué, attente du chargement..."
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    }
    return false;
  }

  /**
   * Récupère la langue de la page actuelle (français ou anglais).
   * (via le <select> dans le footer).
   *
   * @returns {string} 'fr' ou 'en' (par défaut 'fr')
   */
  function getGlobalPageLanguage() {
    const languageDropdown = document.querySelector(".select select");
    if (languageDropdown) {
      // On récupère la valeur sélectionnée (ex: 'fr' ou 'en')
      return languageDropdown.value;
    }
    // Si jamais l'élément n'existe pas, on renvoie 'fr' par défaut
    return "fr";
  }

  /**
   * Traite toutes les commandes, en cliquant sur "Afficher plus" jusqu'à ne plus en avoir
   * ou jusqu'à détecter une année antérieure à 2024.
   *
   * @returns {Promise<{ orders: Array, language: string }>}
   */
  async function fetchAllOrdersAndLanguage() {
    // Dans le contexte : on est le 6 janvier 2025,
    // mais on force currentYear = 2024 pour respecter la consigne
    const currentYear = 2024;
    let allOrders = [];
    let keepLoading = true;
    let lastProcessedDate = null;
    let sameDateCount = 0;

    // RÉCUPÉRER LA LANGUE DE LA PAGE
    const languageOnPage = getGlobalPageLanguage();

    while (keepLoading) {
      console.log("Analyse des commandes affichées...");
      const { orders, foundOldYear, currentLastDate } =
        parseOrders(currentYear);

      if (foundOldYear) {
        console.log(
          "Commandes d'une année précédente détectées (avant 2024), arrêt du chargement."
        );
        // On ajoute quand même les dernières commandes 2024 trouvées avant d’arrêter
        allOrders = [...allOrders, ...orders];
        break;
      }

      if (currentLastDate === lastProcessedDate) {
        // On est bloqué sur la même date => absence potentielle de nouvelles commandes
        sameDateCount++;
        if (sameDateCount >= 5) {
          console.log(
            "La même date de commande a été rencontrée 5 fois consécutivement, arrêt."
          );
          break;
        }
        console.log("Même date rencontrée, saut de l'analyse.");
      } else {
        sameDateCount = 0;
        lastProcessedDate = currentLastDate;
        allOrders = [...allOrders, ...orders];
        console.log(`Commandes récupérées sur ce lot : ${orders.length}`);

        // Envoyer une mise à jour pour chaque lot de commandes récupérées
        chrome.runtime.sendMessage({
          action: "updateOrderCount",
          count: allOrders.length,
        });
      }

      // On tente de cliquer sur "Afficher plus"
      keepLoading = await clickShowMore();
    }

    // Indique que l'analyse est terminée
    chrome.runtime.sendMessage({ action: "fetchingCompleted" });

    console.log("Analyse terminée, envoi des données...");
    console.log("Total des commandes récupérées :", allOrders);
    console.log("Langue détectée :", languageOnPage);

    return {
      orders: allOrders,
      language: languageOnPage,
    };
  }

  /**
   * Listener pour les messages du background script
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getOrders") {
      // Exécuter le processus de récupération des commandes + la langue
      fetchAllOrdersAndLanguage()
        .then(({ orders, language }) => {
          // On renvoie orders ET la langue
          sendResponse({ orders: orders, language });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des commandes :",
            error
          );
          sendResponse({ orders: [], error: error.message });
        });

      // Indique que la réponse sera envoyée de manière asynchrone
      return true;
    }
  });
})();
