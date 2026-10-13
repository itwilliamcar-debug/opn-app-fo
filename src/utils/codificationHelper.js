/**
 * Moteur de Codification et Numérotation OPN (Annexe C & Module M1 du CDC SICL)
 * 
 * Règles de codification officielles :
 * - Devis : De<antenne>_<AA><NNN>          (ex: DeG9_26001)
 * - Facture : Fa<province client>_<AA><NNN> (ex: FaG1_26001)
 * - Bon de livraison : BL<province client>_<AA><NNN> (ex: BLG1_26001)
 * - Avoir : AV<antenne>_<AA><NNN>          (ex: AVG9_26001)
 * - Bon de commande : BC<antenne>_<AA><NNN> (ex: BCG9_26001)
 * - Prospect : PROS_<antenne>_<NNN>        (ex: PROS_G9_001)
 * - Client : N<NNNN>                       (ex: N0053)
 * - Demande réappro : DR<antenne>_<AA><NNN> (ex: DRG9_26001)
 * - Transfert inter-antennes : TR<source>-<dest>_<AA><NNN> (ex: TRG1-G9_26001)
 * - Commande fournisseur : CF_<AA><NNN>    (ex: CF_26001)
 * - PV Inventaire : PVI<antenne>_<AAAAMMJJ> (ex: PVIG9_20260825)
 * - PV Destruction : PVD<antenne>_<AAAAMMJJ> (ex: PVDG9_20260825)
 */

export const GABON_PROVINCE_CODES = {
  ESTUAIRE: 'G1',
  HAUT_OGOOUE: 'G2',
  MOYEN_OGOOUE: 'G3',
  NGOUNIE: 'G4',
  NYANGA: 'G5',
  OGOOUE_IVINDO: 'G6',
  OGOOUE_LOLO: 'G7',
  OGOOUE_MARITIME: 'G8',
  WOLEU_NTEM: 'G9',
  CENTRAL_OWENDO: 'G0'
};

/**
 * Génère un identifiant officiel conforme aux masques du CDC
 */
export function generateOpnDocNumber(type, options = {}) {
  const {
    antenneCode = 'G1',
    clientProvinceCode = 'G1',
    sourceAntenne = 'G1',
    destAntenne = 'G9',
    sequence = 1,
    year = 26, // Année 2026
    date = new Date()
  } = options;

  const seqPad3 = String(sequence).padStart(3, '0');
  const seqPad4 = String(sequence).padStart(4, '0');
  const aa = String(year).slice(-2);
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateCompact = `${yyyy}${mm}${dd}`;

  switch (type.toUpperCase()) {
    case 'DEVIS':
    case 'DE':
      return `De${antenneCode}_${aa}${seqPad3}`;
    case 'FACTURE':
    case 'FA':
      return `Fa${clientProvinceCode}_${aa}${seqPad3}`;
    case 'BON_LIVRAISON':
    case 'BL':
      return `BL${clientProvinceCode}_${aa}${seqPad3}`;
    case 'AVOIR':
    case 'AV':
      return `AV${antenneCode}_${aa}${seqPad3}`;
    case 'BON_COMMANDE':
    case 'BC':
      return `BC${antenneCode}_${aa}${seqPad3}`;
    case 'PROSPECT':
    case 'PROS':
      return `PROS_${antenneCode}_${seqPad3}`;
    case 'CLIENT':
      return `N${seqPad4}`;
    case 'DEMANDE_REAPPRO':
    case 'DR':
      return `DR${antenneCode}_${aa}${seqPad3}`;
    case 'TRANSFERT':
    case 'TR':
      return `TR${sourceAntenne}-${destAntenne}_${aa}${seqPad3}`;
    case 'COMMANDE_FOURNISSEUR':
    case 'CF':
      return `CF_${aa}${seqPad3}`;
    case 'PV_INVENTAIRE':
    case 'PVI':
      return `PVI${antenneCode}_${dateCompact}`;
    case 'PV_DESTRUCTION':
    case 'PVD':
      return `PVD${antenneCode}_${dateCompact}`;
    default:
      return `OPN_${type}_${aa}${seqPad3}`;
  }
}

/**
 * Convertisseur officiel des nombres en toutes lettres en français (conformité EF-M4-22 & DR-01 MONTANT_EN_MOT)
 */
export function numberToFrenchWords(amount) {
  if (amount === 0) return 'zéro franc CFA';
  if (!amount || isNaN(amount)) return 'zéro franc CFA';

  const n = Math.floor(Math.abs(amount));

  const unites = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const dizaines = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];
  const ados = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];

  function convertGroup(num) {
    let result = '';
    const c = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const u = num % 10;

    // Centaines
    if (c === 1) {
      result += 'cent ';
    } else if (c > 1) {
      result += unites[c] + ' cent' + (d === 0 && u === 0 ? 's ' : ' ');
    }

    // Dizaines & Unités
    if (d === 1) {
      result += ados[u] + ' ';
    } else if (d === 7) {
      result += (u === 1 ? 'soixante et onze ' : 'soixante-' + ados[u] + ' ');
    } else if (d === 9) {
      result += 'quatre-vingt-' + ados[u] + ' ';
    } else {
      if (d > 1) {
        if (d === 8 && u === 0) {
          result += 'quatre-vingts ';
        } else {
          result += (u === 1 && d !== 8 ? dizaines[d] + ' et ' : dizaines[d] + (u > 0 ? '-' : ' '));
        }
      }
      if (u > 0 && d !== 1 && d !== 7 && d !== 9) {
        result += unites[u] + ' ';
      }
    }

    return result.trim();
  }

  let parts = [];
  const milliards = Math.floor(n / 1000000000);
  const millions = Math.floor((n % 1000000000) / 1000000);
  const milliers = Math.floor((n % 1000000) / 1000);
  const reste = n % 1000;

  if (milliards > 0) {
    parts.push(convertGroup(milliards) + (milliards > 1 ? ' milliards' : ' milliard'));
  }
  if (millions > 0) {
    parts.push(convertGroup(millions) + (millions > 1 ? ' millions' : ' million'));
  }
  if (milliers > 0) {
    if (milliers === 1) {
      parts.push('mille');
    } else {
      parts.push(convertGroup(milliers) + ' mille');
    }
  }
  if (reste > 0) {
    parts.push(convertGroup(reste));
  }

  const texte = parts.join(' ').trim();
  return texte.charAt(0).toUpperCase() + texte.slice(1) + ' francs CFA';
}
