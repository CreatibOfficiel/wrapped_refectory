document.addEventListener('DOMContentLoaded', () => {
    const statusElem = document.getElementById('status');
    const orderCountElem = document.getElementById('order-count');
    const errorMessage = document.getElementById('error-message');
    const toggleButton = document.getElementById('toggle-button');
    const buttonText = document.getElementById('button-text');
    const buttonLoader = document.getElementById('button-loader');

    // Variable pour savoir si l'utilisateur n'est pas sur la bonne page ou n'est pas autorisé
    let isAuthorized = false

    // Variable pour suivre l'état actuel (en cours de récupération ou non)
    let isFetching = false;

    // Variable pour suivre le nombre de commandes récupérées
    let fetchedOrdersCount = 0;

    // Fonction pour mettre à jour l'état du bouton et des éléments de l'interface
    function updateUI() {
        if (isFetching) {
            statusElem.innerHTML = '🎉 Votre Wrapped 2024 sur Refectory est presque là !';
            toggleButton.disabled = true; // Désactiver le bouton pendant l'extraction
            buttonText.textContent = 'Analyse en cours...';
            buttonLoader.classList.remove('hidden'); // Afficher le loader dans le bouton
        } else {
            statusElem.innerHTML = 'Prêt à découvrir votre Wrapped 2024 sur Refectory ?';
            toggleButton.disabled = false; // Réactiver le bouton lorsque l'extraction est terminée
            buttonText.textContent = 'Démarrer l\'analyse';
            buttonLoader.classList.add('hidden'); // Cacher le loader dans le bouton
            orderCountElem.classList.add('hidden');
        }
    }

    // Fonction pour afficher un message d'erreur si l'utilisateur n'est pas sur le bon onglet
    function showError(message) {
        errorMessage.innerHTML = message;
        errorMessage.classList.remove('hidden');
        statusElem.classList.add('hidden');
        orderCountElem.classList.add('hidden');
        toggleButton.classList.add('hidden');
        isAuthorized = false;
    }

    // Fonction pour masquer le message d'erreur et afficher l'interface principale
    function hideError() {
        errorMessage.classList.add('hidden');
        statusElem.classList.remove('hidden');
        orderCountElem.classList.remove('hidden');
        toggleButton.classList.remove('hidden');
        isAuthorized = true;
    }

    // Fonction pour initialiser l'état de la popup en interrogeant le background
    function initializePopup() {
        chrome.runtime.sendMessage({ action: 'isFetching' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Erreur lors de l'envoi du message :", chrome.runtime.lastError.message);
                showError("⚠️ Une erreur est survenue. Veuillez réessayer.");
                return;
            }
            if (!response.isAuthorized) {
                showError("🚫 Oups ! Vous n'êtes pas sur la page <strong>Historique des commandes</strong> sur Refectory. Veuillez naviguer vers cette page pour commencer.");
                return;
            }
            hideError();
            isFetching = response.isFetching;
            fetchedOrdersCount = response.fetchedOrdersCount || 0;
            updateUI();
        });
    }

    // Écouteur pour le bouton toggle (maintenant uniquement démarrer)
    toggleButton.addEventListener('click', () => {
        if (!isFetching) {
            // Lancer la récupération
            chrome.runtime.sendMessage({ action: 'startFetchingOrders' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Erreur lors de l'envoi du message :", chrome.runtime.lastError.message);
                    statusElem.textContent = 'Erreur de démarrage.';
                    return;
                }
                console.log("Message de démarrage envoyé :", response);
                isFetching = true;
                updateUI();
            });
        }
    });

    // Écoute des messages du background pour mettre à jour le nombre de commandes
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'updateOrderCount') {
            fetchedOrdersCount = message.count;
            if (fetchedOrdersCount > 0 && isAuthorized) {
                orderCountElem.textContent = `${fetchedOrdersCount} commandes`;
                orderCountElem.classList.remove('hidden');
            }
        }
    });

    // Réinitialiser la popup lorsque l'extraction est terminée
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'fetchingCompleted') {
            isFetching = false;
            updateUI();
        }
    });

    // Initialiser la popup avec l'état actuel
    initializePopup();
});
