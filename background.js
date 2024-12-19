let extractedOrders = []; // Variable pour stocker les commandes extraites
console.log("Background script chargé !");

// Écouter le clic sur l'icône de l'extension
chrome.action.onClicked.addListener((tab) => {
  console.log("Icône cliquée !");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

// Écouter les messages venant de content.js ou results.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "storeOrders") {
    // Stocker les commandes dans une variable globale
    extractedOrders = message.data || [];
    console.log("Commandes stockées :", extractedOrders);
  }

  if (message.action === "openResultsPage") {
    const manifest = chrome.runtime.getManifest();
    const isDev = !manifest.update_url;
    console.log(`Environnement : ${isDev ? 'Développement' : 'Production'}`);
    if (isDev) {
      // Ouvrir la page qui affiche les commandes extraites
      chrome.tabs.create({ url: chrome.runtime.getURL("commands-extracted.html") });
    }
    // Ouvrir la page du wrap
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
  }

  if (message.action === "getOrders") {
    // Renvoyer les commandes à results.html
    sendResponse({ data: extractedOrders });
  }

  // Rafraichir la page actuelle pour réinitialiser le contenu
  if (message.action === "refreshPage") {
    chrome.tabs.reload(sender.tab.id);
  }
});
