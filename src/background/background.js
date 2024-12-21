let extractedOrders = []; // Variable pour stocker les commandes extraites
let isFetching = false; // Indicateur de l'état de récupération
let fetchedOrdersCount = 0; // Compteur des commandes récupérées
let analysedTabId = null; // ID de l'onglet analysé

console.log("Background script chargé !");

// Écouter les messages venant de content.js ou popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "updateOrderCount":
      fetchedOrdersCount = message.count;
      // Envoyer la mise à jour à la popup
      chrome.runtime.sendMessage({ action: 'updateOrderCount', count: fetchedOrdersCount });
      break;

    case "fetchingCompleted":
      // Récupération terminée signalée par le content script
      isFetching = false;
      console.log("Récupération des commandes terminée (signalée par content).");

      // Ouvrir les deux onglets internes
      chrome.tabs.create({ url: chrome.runtime.getURL('src/pages/commands-extracted.html') });
      chrome.tabs.create({ url: chrome.runtime.getURL('src/pages/index.html') });

      if (analysedTabId) {
        chrome.tabs.reload(analysedTabId);
      }

      // Reset le nombre de commandes extraites
      extractedOrders = [];
      fetchedOrdersCount = 0;
      break;

    case "startFetchingOrders":
      if (!isFetching) {
        isFetching = true;
        fetchedOrdersCount = 0;
        extractedOrders = []; // Réinitialiser les commandes extraites
        console.log("Début de la récupération des commandes.");

        // **Envoyer une réponse immédiatement avant de commencer le fetch**
        sendResponse({ status: "Fetching started" });

        // Lancer la récupération des commandes
        fetchOrders();
      } else {
        // Déjà en cours de récupération
        sendResponse({ status: "Already fetching" });
      }
      break;

    case "getOrders":
      // Retourne les commandes extraites depuis le background
      sendResponse({ data: extractedOrders });
      break;

    case "isFetching":
      // Interroger l'onglet actif pour vérifier l'autorisation
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let isAuthorized = false;
        if (tabs.length > 0) {
          const tab = tabs[0];
          const allowedUrls = [
            "https://www.refectory.fr/en/account/orders",
            "https://www.refectory.fr/mon-compte/mes-commandes"
          ];
          isAuthorized = allowedUrls.some(url => tab.url.startsWith(url));
        }
        sendResponse({ isFetching, fetchedOrdersCount, isAuthorized });
      });
      return true; // Indiquer que la réponse est asynchrone

    default:
      // Actions non gérées
      break;
  }

  return true; // Permet de répondre de manière asynchrone si nécessaire
});

/**
 * Fonction pour récupérer les commandes depuis l'onglet actif.
 * Ici, on envoie le message "getOrders" au content script de l'onglet actif.
 */
async function fetchOrders() {
  try {
    // Obtenir l'onglet actif dans la fenêtre courante
    let [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!activeTab) {
      console.error("Aucun onglet actif trouvé.");
      isFetching = false;
      chrome.runtime.sendMessage({ action: 'fetchingCompleted' });
      return;
    }

    const tabUrl = activeTab.url;
    const allowedUrls = [
      "https://www.refectory.fr/en/account/orders",
      "https://www.refectory.fr/mon-compte/mes-commandes"
    ];

    if (!allowedUrls.some(url => tabUrl.startsWith(url))) {
      console.error("L'onglet actif ne correspond pas aux URLs autorisées.");
      isFetching = false;
      chrome.runtime.sendMessage({ action: 'fetchingCompleted' });
      return;
    }

    console.log(`Onglet actif trouvé pour la récupération des commandes : ${activeTab.id}`);
    analysedTabId = activeTab.id;

    // Envoyer un message au content script pour récupérer les commandes
    chrome.tabs.sendMessage(activeTab.id, { action: 'getOrders' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(`Erreur lors de l'envoi du message au content script dans l'onglet ${activeTab.id} :`, chrome.runtime.lastError.message);
        isFetching = false;
        chrome.runtime.sendMessage({ action: 'fetchingCompleted' });
        return;
      }

      const orders = response?.data || [];
      console.log(`Commandes récupérées de l'onglet ${activeTab.id} : ${orders.length}`);

      if (orders.length > 0) {
        // Stocker les commandes
        extractedOrders = extractedOrders.concat(orders);
        fetchedOrdersCount += orders.length;

        // Envoyer la mise à jour à la popup
        chrome.runtime.sendMessage({ action: 'updateOrderCount', count: fetchedOrdersCount });
      }

      // Signal que la récupération est terminée
      chrome.runtime.sendMessage({ action: 'fetchingCompleted' });
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    isFetching = false;
    chrome.runtime.sendMessage({ action: 'fetchingCompleted' });
  }
}