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
   * Retourne un objet contenant { fullDate, day, month, year, hour, minute } ou null si échec.
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
      ".c-order-detail-totals__section"
    );
    totalSections.forEach((section) => {
      const totalItems = section.querySelectorAll(".c-order-detail-total-item");
      totalItems.forEach((item) => {
        const labelElem = item.querySelector(
          ".c-order-detail-total-item__label"
        );
        const label = labelElem
          ? labelElem.innerText.trim().toLowerCase()
          : null;
        const priceElem = item.querySelector(
          ".c-order-detail-total-item__price"
        );
        const priceText = priceElem ? priceElem.innerText.trim() : null;

        if (priceText) {
          // On parse le prix
          const parsedPrice = parsePrice(priceText);

          // Vérification en fonction du label
          if (label) {
            if (label.includes("livraison")) {
              totals.delivery = priceText;
            } else if (
              label.includes("points fidélité") ||
              label.includes("loyalty points")
            ) {
              totals.points_fidelity = priceText;
            } else if (
              label.includes("total à payer") ||
              label.includes("total")
            ) {
              totals.total_due = parsedPrice;
            } else if (
              label.includes("réduction") ||
              label.includes("discount")
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
      ".c-order-detail-totals__section-title"
    );
    if (promoSection) {
      // Récupère le texte à l'intérieur de la section promo
      const promoCode = promoSection.innerText.trim();
      console.log("Section promo trouvée :", promoSection);
      console.log("Code promo trouvé :", promoCode);
      return promoCode || null;
    }
    return null;
  }

  /**
   * Parse une carte de commande individuelle et renvoie un objet représentant la commande ou null si non parsable.
   * @param {Element} orderCard
   * @param {number} currentYear
   * @returns {object|null} L'objet commande ou null.
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
    if (year !== currentYear) {
      // On a trouvé une commande d'une année antérieure, on arrête le traitement plus haut dans la logique.
      return { oldYearDetected: true, fullDate };
    }

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
      ".c-cart-detail-section__products"
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

        if (result.oldYearDetected) {
          // On a détecté une commande d'une année précédente
          foundOldYear = true;
          currentLastDate = result.fullDate;
          break;
        }

        // result est une commande complète
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
   * Traite toutes les commandes, en cliquant sur "Afficher plus" jusqu'à ne plus en avoir
   * ou jusqu'à détecter une année précédente.
   * @returns {Promise<Array>} Liste des commandes récupérées.
   */
  async function processAllOrders() {
    // const currentYear = new Date().getFullYear();
    const currentYear = 2024;
    let allOrders = [];
    let keepLoading = true;
    let lastProcessedDate = null;
    let sameDateCount = 0;
    let isFetching = true; // Flag local pour arrêter le processus si nécessaire

    while (keepLoading && isFetching) {
      console.log("Analyse des commandes affichées...");
      const { orders, foundOldYear, currentLastDate } =
        parseOrders(currentYear);

      if (foundOldYear) {
        console.log(
          "Commandes d'une année précédente détectées, arrêt du chargement."
        );
        allOrders = [...allOrders, ...orders]; // Ajout des dernières commandes avant arrêt
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
        console.log(`Commandes récupérées : ${orders.length}`);

        // Envoyer une mise à jour pour chaque lot de commandes récupérées
        chrome.runtime.sendMessage({
          action: "updateOrderCount",
          count: allOrders.length,
        });
      }

      keepLoading = await clickShowMore();
    }

    // Indique que l'analyse est terminée
    chrome.runtime.sendMessage({ action: "fetchingCompleted" });

    console.log("Analyse terminée, envoi des données...");
    console.log("Total des commandes récupérées :", allOrders);

    return allOrders;
  }

  /**
   * Listener pour les messages du background script
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getOrders") {
      // Exécuter le processus de récupération des commandes
      processAllOrders()
        .then((orders) => {
          sendResponse({ data: orders });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des commandes :",
            error
          );
          sendResponse({ data: [], error: error.message });
        });

      // Indique que la réponse sera envoyée de manière asynchrone
      return true;
    }
  });
})();
