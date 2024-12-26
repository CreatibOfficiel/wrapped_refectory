// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const statusElem = document.getElementById("status");
  const orderCountElem = document.getElementById("order-count");
  const errorMessage = document.getElementById("error-message");
  const toggleButton = document.getElementById("toggle-button");
  const buttonText = document.getElementById("button-text");
  const buttonLoader = document.getElementById("button-loader");

  // État local pour la popup (uniquement pour l'affichage, car l'état source est dans le background)
  let isFetching = false;
  let fetchedOrdersCount = 0;
  let isAuthorized = false;

  /**
   * Met à jour l'UI en fonction de isFetching
   */
  function updateUI() {
    if (!isAuthorized) {
      // Si pas autorisé, on masque tout sauf le message d'erreur
      return;
    }

    if (isFetching) {
      statusElem.innerHTML =
        "🎉 Votre Wrapped 2024 sur Refectory est presque là !";
      toggleButton.disabled = true;
      buttonText.textContent = "Analyse en cours...";
      buttonLoader.classList.remove("hidden");
    } else {
      statusElem.innerHTML =
        "Prêt à découvrir votre Wrapped 2024 sur Refectory ?";
      toggleButton.disabled = false;
      buttonText.textContent = "Démarrer l'analyse";
      buttonLoader.classList.add("hidden");
    }

    if (fetchedOrdersCount > 0) {
      orderCountElem.textContent = `${fetchedOrdersCount} commandes`;
      orderCountElem.classList.remove("hidden");
    } else {
      orderCountElem.classList.add("hidden");
    }
  }

  /**
   * Affiche un message d'erreur et masque les autres éléments
   */
  function showError(message) {
    errorMessage.innerHTML = message;
    errorMessage.classList.remove("hidden");
    statusElem.classList.add("hidden");
    orderCountElem.classList.add("hidden");
    toggleButton.classList.add("hidden");
    isAuthorized = false;
  }

  /**
   * Cache le message d'erreur et affiche l'interface principale
   */
  function hideError() {
    errorMessage.classList.add("hidden");
    statusElem.classList.remove("hidden");
    toggleButton.classList.remove("hidden");
    // On laisse orderCountElem masqué ou non en fonction de fetchedOrdersCount
    isAuthorized = true;
  }

  // ---------------------------------------------
  // 1) Vérifier si l'utilisateur est sur la bonne URL
  // ---------------------------------------------
  chrome.runtime.sendMessage({ action: "isFetching" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Erreur :", chrome.runtime.lastError.message);
      showError("⚠️ Impossible de récupérer le statut. Veuillez réessayer.");
      return;
    }

    // Récupère isAuthorized depuis le background
    if (!response.isAuthorized) {
      // La popup sait qu'on n'est pas sur la bonne URL
      showError(
        "🚫 Oups ! Vous n'êtes pas sur la page <strong>Historique des commandes</strong> sur Refectory. Veuillez naviguer vers cette page."
      );
      return;
    }

    // Sinon, on est autorisé
    hideError();

    // Récupère également isFetching et fetchedOrdersCount pour l'UI
    isFetching = response.isFetching;
    fetchedOrdersCount = response.fetchedOrdersCount || 0;
    updateUI();
  });

  // ---------------------------------------------
  // 2) Initialiser la popup depuis storage session
  // ---------------------------------------------
  function initializePopup() {
    chrome.storage.session.get(["isFetching", "fetchedOrdersCount"], (data) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Erreur lors de la lecture du session storage :",
          chrome.runtime.lastError
        );
        showError("⚠️ Une erreur est survenue. Veuillez réessayer.");
        return;
      }
      // Récupérer les valeurs
      isFetching = data.isFetching || false;
      fetchedOrdersCount = data.fetchedOrdersCount || 0;

      // Mettre à jour l'UI
      updateUI();
    });
  }

  // ---------------------------------------------
  // 3) Gérer les évènements utilisateur
  // ---------------------------------------------
  toggleButton.addEventListener("click", () => {
    if (!isFetching) {
      // Lancer la récupération
      chrome.runtime.sendMessage(
        { action: "startFetchingOrders" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Erreur lors de l'envoi du message :",
              chrome.runtime.lastError.message
            );
            statusElem.textContent = "⚠️ Erreur de démarrage.";
            return;
          }
          console.log("Message de démarrage envoyé :", response);
          isFetching = true;
          updateUI();
        }
      );
    }
  });

  // ---------------------------------------------
  // 4) Écouter les messages envoyés par le background
  // ---------------------------------------------
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message reçu dans la popup :", message);

    switch (message.action) {
      case "updateOrderCount":
        fetchedOrdersCount = message.count || 0;
        updateUI();
        break;

      case "fetchingCompleted":
        isFetching = false;
        updateUI();
        break;
    }
  });

  // Initialisation
  initializePopup();
});
