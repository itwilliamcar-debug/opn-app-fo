// Moteur Mathématique de Calcul Logistique & Prédiction CMM (OPN Gabon)

/**
 * Calcule le besoin d'approvisionnement prévisionnel pour une antenne provinciale
 * 
 * Formule :
 * Besoin = (CMM_locale * (LeadTimeMois + StockSecuriteMois) * CoeffSaison) - StockDispo - EnTransit
 * 
 * @param {Object} params
 * @param {number} params.cmmLocale - Consommation moyenne mensuelle de l'antenne
 * @param {number} params.stockDispo - Stock physique actuel
 * @param {number} params.enTransit - Quantités déjà en commande / convoi
 * @param {number} params.leadTimeJours - Délai d'acheminement depuis Owendo en jours
 * @param {number} params.stockSecuriteJours - Durée de réserve souhaitée en jours (ex: 45j)
 * @param {number} params.coeffSaisonnier - Coefficient (ex: 1.25 en pic paludisme saison des pluies)
 * @param {number} params.prixUnitaireXAF - Prix unitaire d'achat du médicament en XAF
 * @returns {Object} Résultat de la simulation avec quantités et valorisation financière
 */
export function calculateSupplyNeed({
  cmmLocale,
  stockDispo,
  enTransit = 0,
  leadTimeJours = 5,
  stockSecuriteJours = 45,
  coeffSaisonnier = 1.0,
  prixUnitaireXAF = 0
}) {
  const cmmAjustee = cmmLocale * coeffSaisonnier;
  const consommationJournaliere = cmmAjustee / 30;

  // Calcul du stock de sécurité requis en unités
  const stockSecuriteUnites = Math.round(consommationJournaliere * stockSecuriteJours);
  
  // Consommation durant le délai d'acheminement
  const consoPendantLeadTime = Math.round(consommationJournaliere * leadTimeJours);

  // Stock cible théorique (Point de commande + Sécurité)
  const stockCible = consoPendantLeadTime + stockSecuriteUnites;

  // Stock net disponible
  const stockNet = stockDispo + enTransit;

  // Quantité recommandée
  const quantiteRecommandee = Math.max(0, stockCible - stockNet);

  // Autonomie restante en jours
  const autonomieJours = consommationJournaliere > 0 
    ? Math.round(stockDispo / (cmmLocale / 30)) 
    : 999;

  // Détermination du niveau de criticité
  let niveauCriticite = 'NORMAL';
  if (stockDispo === 0) {
    niveauCriticite = 'RUPTURE';
  } else if (autonomieJours <= leadTimeJours) {
    niveauCriticite = 'CRITIQUE'; // Risque certain de rupture avant livraison
  } else if (autonomieJours <= (leadTimeJours + (stockSecuriteJours / 2))) {
    niveauCriticite = 'VIGILANCE';
  }

  // Valorisation totale du besoin en Francs CFA
  const coutTotalXAF = quantiteRecommandee * prixUnitaireXAF;

  return {
    cmmAjustee: Math.round(cmmAjustee),
    stockSecuriteUnites,
    consoPendantLeadTime,
    stockCible,
    quantiteRecommandee,
    autonomieJours,
    niveauCriticite,
    coutTotalXAF
  };
}
