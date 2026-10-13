// Utilitaires de formatage officiel pour l'OPN Gabon (FCFA XAF) - Thème Clair Institutionnel

/**
 * Formate un montant numérique en Franc CFA (XAF)
 * Ex: 14850000 -> "14 850 000 FCFA"
 */
export function formatXAF(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "0 FCFA";
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} FCFA`;
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Retourne la classe CSS de badge selon le statut du stock (Design Clair & Net)
 */
export function getStockStatusBadge(status) {
  switch (status) {
    case 'DISPONIBLE':
    case 'STOCK_NORMAL':
      return {
        label: 'Stock Optimal',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        icon: 'check-circle'
      };
    case 'STOCK_FAIBLE':
      return {
        label: 'Stock Faible',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: 'alert-triangle'
      };
    case 'STOCK_CRITIQUE':
      return {
        label: 'Stock Critique',
        bg: 'bg-orange-50 text-orange-800 border-orange-200',
        dot: 'bg-orange-500',
        icon: 'alert-octagon'
      };
    case 'RUPTURE':
      return {
        label: 'Rupture Immédiate',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-600',
        icon: 'x-circle'
      };
    default:
      return {
        label: status || 'Inconnu',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: 'info'
      };
  }
}

/**
 * Retourne la classe CSS selon la gravité d'une urgence
 */
export function getSeverityBadge(severity) {
  switch (severity) {
    case 'URGENCE_ABSOLUE':
    case 'CRITIQUE':
      return {
        label: 'Urgence Critique',
        badge: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
        radar: true
      };
    case 'VIGILANCE':
      return {
        label: 'Vigilance Élevée',
        badge: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
        radar: false
      };
    case 'INFO':
    default:
      return {
        label: 'Information',
        badge: 'bg-blue-50 text-blue-800 border-blue-200 font-medium',
        radar: false
      };
  }
}
