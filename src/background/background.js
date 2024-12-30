let extractedOrders = [];
let isFetching = false;
let fetchedOrdersCount = 0;
let analysedTabId = null;
let pageLanguage = null;

console.log("Background script loaded!");

// -------------------------------------------
// 1) Initialiser l'état depuis sessionStorage
// -------------------------------------------
initializeStateFromSessionStorage();

/**
 * Initialise les variables globales à partir de chrome.storage.session
 * afin d'éviter que l'état ne soit perdu si le service worker s'est endormi.
 */
function initializeStateFromSessionStorage() {
  chrome.storage.session.get(
    [
      "extractedOrders",
      "isFetching",
      "fetchedOrdersCount",
      "analysedTabId",
      "pageLanguage",
    ],
    (data) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Erreur lors de la lecture de session storage :",
          chrome.runtime.lastError
        );
      }
      extractedOrders = data.extractedOrders || [];
      isFetching = data.isFetching || false;
      fetchedOrdersCount = data.fetchedOrdersCount || 0;
      analysedTabId = data.analysedTabId || null;
      pageLanguage = data.pageLanguage || null;

      console.log("État initial récupéré de session storage :", {
        extractedOrders,
        isFetching,
        fetchedOrdersCount,
        analysedTabId,
        pageLanguage,
      });
    }
  );
}

/**
 * Met à jour la langue détectée et la stocke dans le session storage
 * @param {string|null} lang
 */
function updatePageLanguage(lang) {
  pageLanguage = lang;
  chrome.storage.session.set({ pageLanguage: lang }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Erreur lors de l'écriture de pageLanguage : ${chrome.runtime.lastError}`
      );
    }
    console.log("pageLanguage mis à jour :", lang);
  });
}

/**
 * Met à jour l'état "isFetching" dans chrome.storage.session et dans la variable locale.
 * @param {boolean} state
 */
function setFetchingState(state) {
  isFetching = state;
  chrome.storage.session.set({ isFetching: state }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Erreur lors de l'écriture de isFetching : ${chrome.runtime.lastError}`
      );
    }
    console.log("isFetching mis à jour :", state);
  });
}

/**
 * Met à jour le compteur de commandes dans chrome.storage.session et dans la variable locale.
 * @param {number} count
 */
function updateOrderCount(count) {
  fetchedOrdersCount = count;
  // Stockage dans le session storage
  chrome.storage.session.set({ fetchedOrdersCount: count }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Erreur lors de l'écriture de fetchedOrdersCount : ${chrome.runtime.lastError}`
      );
    }
    console.log("fetchedOrdersCount mis à jour :", count);

    // Notifier la popup de la mise à jour du compteur
    sendMessageToPopup({ action: "updateOrderCount", count });
  });
}

/**
 * Stocker également l'ID de l'onglet analysé dans le session storage
 * @param {number|null} tabId
 */
function updateAnalysedTabId(tabId) {
  analysedTabId = tabId;
  chrome.storage.session.set({ analysedTabId: tabId }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Erreur lors de l'écriture de analysedTabId : ${chrome.runtime.lastError}`
      );
    }
    console.log("analysedTabId mis à jour :", tabId);
  });
}

/**
 * Met à jour la liste des commandes extraites
 * @param {Array} orders
 */
function updateExtractedOrders(orders) {
  extractedOrders = orders;
  chrome.storage.session.set({ extractedOrders: orders }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Erreur lors de l'écriture de extractedOrders : ${chrome.runtime.lastError}`
      );
    }
    console.log("extractedOrders mis à jour, taille =", orders.length);
  });
}

// ---------------------------------------------------
// 2) Fonctions pour communiquer avec la popup au besoin
// ---------------------------------------------------
function sendMessageToPopup(message) {
  console.log("Envoi d'un message à la popup :", message);
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      // La popup n'est peut-être pas ouverte
      console.log(
        "Impossible d'envoyer le message à la popup :",
        chrome.runtime.lastError.message
      );
    } else {
      console.log("Message envoyé à la popup avec succès :", message);
    }
  });
}

// -------------------------------------------------------
// 3) Gestion des messages entrants (content.js / popup.js)
// -------------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message reçu :", message);

  switch (message.action) {
    case "updateOrderCount":
      // Mise à jour du nombre de commandes
      updateOrderCount(message.count);
      break;

    case "fetchingCompleted":
      setFetchingState(false);
      console.log("Fetching of orders completed (reported by content).");

      // 1) Recharger l'onglet analysé s'il existe
      if (analysedTabId) {
        console.log(`Reloading analysed tab with ID: ${analysedTabId}`);
        chrome.tabs.reload(analysedTabId);
      }

      // 2) Ouvrir les onglets internes
      const urlsToOpen = [
        // chrome.runtime.getURL("src/pages/commands-extracted.html"),
        chrome.runtime.getURL("src/pages/index.html"),
      ];

      urlsToOpen.forEach((url) => {
        chrome.tabs.create({ url: url });
      });

      // 3) Réinitialiser extractedOrders, fetchedOrdersCount, etc.
      updateExtractedOrders([]);
      updateOrderCount(0);
      updateAnalysedTabId(null);

      // 4) Notifier la popup
      sendMessageToPopup({ action: "fetchingCompleted" });
      break;

    case "startFetchingOrders":
      if (!isFetching) {
        // On démarre la récupération
        setFetchingState(true);
        updateOrderCount(0);
        updateExtractedOrders([]); // réinitialiser la liste
        console.log("Début de la récupération des commandes.");

        // Envoyer une réponse immédiate avant le fetch
        sendResponse({ status: "Fetching started" });

        // Lancer la récupération
        fetchOrders();
      } else {
        // Déjà en cours de récupération
        sendResponse({ status: "Already fetching" });
      }
      break;

    case "getOrders":
      // Retourne les commandes extraites + la langue
      sendResponse({ data: extractedOrders, language: pageLanguage });
      break;

    case "isFetching":
      // Vérifier si l'URL active est autorisée
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let isAuthorized = false;
        if (tabs.length > 0) {
          const tab = tabs[0];
          const allowedUrls = [
            "https://www.refectory.fr/en/account/orders",
            "https://www.refectory.fr/mon-compte/mes-commandes",
          ];
          isAuthorized = allowedUrls.some((url) => tab.url.startsWith(url));
        }
        sendResponse({ isFetching, fetchedOrdersCount, isAuthorized });
      });
      return true; // Réponse asynchrone
  }

  return true; // Indique une réponse asynchrone potentielle
});

/**
 * Lance la récupération des commandes depuis l'onglet actif.
 */
async function fetchOrders() {
  try {
    let [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!activeTab) {
      console.error("Aucun onglet actif trouvé.");
      setFetchingState(false);
      chrome.runtime.sendMessage({ action: "fetchingCompleted" });
      return;
    }

    const tabUrl = activeTab.url;
    const allowedUrls = [
      "https://www.refectory.fr/en/account/orders",
      "https://www.refectory.fr/mon-compte/mes-commandes",
    ];

    const isAllowed = allowedUrls.some((url) => tabUrl.startsWith(url));
    if (!isAllowed) {
      console.error("L'onglet actif n'est pas sur une URL autorisée.");
      setFetchingState(false);
      chrome.runtime.sendMessage({ action: "fetchingCompleted" });
      return;
    }

    console.log(`Onglet actif pour la récupération : ${activeTab.id}`);
    updateAnalysedTabId(activeTab.id);

    // Envoyer un message au content script
    chrome.tabs.sendMessage(
      activeTab.id,
      { action: "getOrders" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            `Erreur lors de l'envoi du message au content script (tabId=${activeTab.id}) :`,
            chrome.runtime.lastError.message
          );
          setFetchingState(false);
          chrome.runtime.sendMessage({ action: "fetchingCompleted" });
          return;
        }

        // EXTRAIRE LES COMMANDES ET LA LANGUE
        const orders = response?.data || [];
        const lang = response?.language || null;

        console.log(`Commandes récupérées : ${orders.length}`);
        console.log(`Langue détectée (réponse content) : ${lang}`);

        // STOCKER LA LANGUE
        if (lang) {
          updatePageLanguage(lang);
        }

        // Mettre à jour extractedOrders
        if (orders.length > 0) {
          const newOrderList = extractedOrders.concat(orders);
          updateExtractedOrders(newOrderList);
          updateOrderCount(fetchedOrdersCount + orders.length);
        }
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    setFetchingState(false);
    chrome.runtime.sendMessage({ action: "fetchingCompleted" });
  }
}
