document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders-container");

  // Récupérer les données des commandes depuis le service worker
  chrome.runtime.sendMessage({ action: "getOrders" }, (response) => {
    const ordersData = response?.data || [];

    if (!ordersData.length) {
      ordersContainer.innerHTML =
        "<p class='text-center text-gray-600'>Aucune commande trouvée.</p>";
      return;
    }

    ordersData.forEach((order) => {
      const orderElement = document.createElement("div");
      orderElement.classList.add(
        "bg-white",
        "shadow-md",
        "p-6",
        "rounded-lg",
        "space-y-4"
      );

      // Liste des produits
      const productRows = order.products
        .map((p) => {
          return `
          <tr>
            <td class="border px-3 py-1">${p.title}</td>
            <td class="border px-3 py-1 text-right">${p.price.toFixed(2)}€</td>
          </tr>
        `;
        })
        .join("");

      // Liste des réductions
      const discountList =
        order.discounts.length > 0
          ? order.discounts
              .map((d) => `<li class="mb-1">${d.toFixed(2)}€</li>`)
              .join("")
          : "<li>Aucune réduction appliquée</li>";

      // Code promo utilisé
      const promoCode = order.promo_code
        ? `<p class="text-gray-700"><span class="font-semibold">Code Promo :</span> ${order.promo_code}</p>`
        : "";

      // Informations temporelles
      const dateInfo = `
        <p><span class="font-semibold">Date Complète :</span> ${
          order.fullDate
        }</p>
        <p><span class="font-semibold">Jour :</span> ${order.day} - 
           <span class="font-semibold">Mois :</span> ${order.month} - 
           <span class="font-semibold">Année :</span> ${order.year}</p>
        <p><span class="font-semibold">Heure :</span> ${
          order.hour || "Inconnue"
        }</p>
      `;

      // Détails commande
      const orderPosition = order.orderPosition
        ? `<span class="font-semibold">${order.orderPosition}</span>`
        : `<p>Non spécifié</p>`;

      // Détails livraison
      const deliveryInfo = order.delivery
        ? `<p><span class="font-semibold">Livraison :</span> ${order.delivery}</p>`
        : "";

      // Points de fidélité
      const pointsInfo = order.points_fidelity
        ? `<p><span class="font-semibold">Points fidélité :</span> ${order.points_fidelity}</p>`
        : "";

      // Statut
      const statusClass =
        order.status === "success" ? "text-green-600" : "text-red-600";
      const statusInfo = `<p class="${statusClass}"><span class="font-semibold">Statut :</span> ${
        order.status || "Inconnu"
      }</p>`;

      orderElement.innerHTML = `
        <!-- Informations temps -->
        <div class="border-b pb-4 mb-4">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Informations temporelles</h2>
          ${dateInfo}
        </div>

        <!-- Informations commande -->
        <div class="border-b pb-4 mb-4">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Informations Commande</h2>
          Commande n°${orderPosition} du jour
          ${promoCode}
          ${pointsInfo}
        </div>

        <!-- Produits -->
        <div class="border-b pb-4 mb-4">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Produits</h3>
          <table class="w-full border-collapse border text-sm">
            <thead>
              <tr>
                <th class="border px-3 py-1 text-left bg-gray-100">Produit</th>
                <th class="border px-3 py-1 text-right bg-gray-100">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </div>

        <!-- Réductions -->
        <div class="border-b pb-4 mb-4">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Réductions</h3>
          <ul class="list-disc list-inside text-sm text-gray-700">
            ${discountList}
          </ul>
        </div>

        <!-- Totaux & Statut -->
        <div class="space-y-2">
          <p class="text-xl font-bold text-gray-800">Total dû : ${order.total_due.toFixed(
            2
          )}€</p>
          ${deliveryInfo}
          ${statusInfo}
        </div>
      `;

      ordersContainer.appendChild(orderElement);
    });
  });
});
