/**
 * Données de Référence — Facturation, Recouvrement & Conventions CNAMGS / Hôpitaux (OPN Gabon)
 * Direction Administrative et Financière (DAF) & Direction Générale de l'OPN
 * Monnaie officielle : Franc CFA (XAF) - Exonération légale de TVA sur médicaments essentiels
 */

export const BILLING_KPIS = {
  chiffreAffairesTotalXaf: 894500000,
  montantRecouvreXaf: 672300000,
  creancesEnSouffranceXaf: 222200000,
  partCnamgsFactureeXaf: 648000000,
  partCnamgsLiquideeXaf: 512000000,
  partCnamgsEnAttenteXaf: 136000000,
  tauxRecouvrementGlobal: 75.1,
  delaiMoyenPaiementJours: 42,
  facturesImpayeesPlus60j: 8,
  conventionsActivesTotal: 24,
};

export const INITIAL_INVOICES = [
  {
    id: "FAC-2026-00142",
    numeroFacture: "OPN-FAC-2026-00142",
    dateEmission: "2026-09-10",
    dateEcheance: "2026-10-10",
    structureNom: "Centre Hospitalier Universitaire de Libreville (CHUL)",
    structureType: "CHU",
    structureVille: "Libreville (Estuaire)",
    structureAdresse: "Boulevard Triomphal, B.P. 2228, Libreville",
    structureNif: "NIF-882910-A",
    bonCommandeRef: "BC-CHUL-2026-089",
    numeroBonLivraison: "BL-OPN-2026-0391",
    montantHT: 48500000,
    montantTVA: 0,
    montantTTC: 48500000,
    tauxCnamgs: 90,
    regimeCnamgs: "Fonds 2 - Agents Publics (90%)",
    partCnamgs: 43650000,
    partStructure: 4850000,
    montantPaye: 4850000,
    montantReste: 43650000,
    statut: "PARTIELLEMENT_PAYEE",
    statutLabel: "Partiel (En attente CNAMGS)",
    statutColor: "bg-blue-100 text-blue-800 border-blue-300",
    modePaiement: "Virement Trésor / Tiers-Payant CNAMGS",
    datePaiement: "2026-09-12",
    referencePaiement: "VIR-CHUL-TICKET-2026-09",
    banqueOpn: "BGFIBank Gabon (Compte Trésorerie)",
    ribOpn: "GA21 4000 1000 1234 5678 9012 345",
    lignes: [
      { code: "010301001", dci: "Artéméther + Luméfantrine 20/120mg CP (Coartem)", conditionnement: "Boîte 24", quantite: 15000, prixUnitaire: 950, montantTotal: 14250000 },
      { code: "010301015", dci: "Artésunate Injectable 60mg PDR + Solv", conditionnement: "Flacon + solvant", quantite: 10000, prixUnitaire: 1200, montantTotal: 12000000 },
      { code: "010401004", dci: "Amoxicilline + Acide Clavulanique 1g/125mg CP", conditionnement: "Boîte 14", quantite: 8000, prixUnitaire: 1850, montantTotal: 14800000 },
      { code: "010701002", dci: "Paracétamol 1g Comprimé (Doliprane)", conditionnement: "Boîte 100", quantite: 3000, prixUnitaire: 2483, montantTotal: 7450000 }
    ],
    notes: "Facture trimestrielle de dotation hospitalière d'urgence. Part CNAMGS intégrée au bordereau de télétransmission BORD-2026-09."
  },
  {
    id: "FAC-2026-00143",
    numeroFacture: "OPN-FAC-2026-00143",
    dateEmission: "2026-09-08",
    dateEcheance: "2026-10-08",
    structureNom: "Centre Hospitalier Régional Amissa Bongo (Franceville)",
    structureType: "CHR",
    structureVille: "Franceville (Haut-Ogooué)",
    structureAdresse: "Route Nationale 3, Franceville",
    structureNif: "NIF-773829-B",
    bonCommandeRef: "BC-CHR-FBV-2026-044",
    numeroBonLivraison: "BL-OPN-2026-0377",
    montantHT: 32400000,
    montantTVA: 0,
    montantTTC: 32400000,
    tauxCnamgs: 90,
    regimeCnamgs: "Fonds 2 - Agents Publics (90%)",
    partCnamgs: 29160000,
    partStructure: 3240000,
    montantPaye: 32400000,
    montantReste: 0,
    statut: "SOLDEE",
    statutLabel: "Soldée (100% Réglé)",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    modePaiement: "Virement Trésor Public",
    datePaiement: "2026-09-15",
    referencePaiement: "VIR-TRESOR-G2-2026-8812",
    banqueOpn: "CDC Gabon",
    ribOpn: "GA21 4000 2000 9876 5432 1098 765",
    lignes: [
      { code: "010401001", dci: "Amoxicilline 500mg Gélule", conditionnement: "Boîte 100", quantite: 6000, prixUnitaire: 2100, montantTotal: 12600000 },
      { code: "010301001", dci: "Artéméther + Luméfantrine 20/120mg CP", conditionnement: "Boîte 24", quantite: 10000, prixUnitaire: 950, montantTotal: 9500000 },
      { code: "030101001", dci: "Sérum Glucose 5% 500ml Poche", conditionnement: "Carton 20", quantite: 3500, prixUnitaire: 2942, montantTotal: 10300000 }
    ],
    notes: "Règlement complet reçu via Trésorerie Provinciale du Haut-Ogooué."
  },
  {
    id: "FAC-2026-00144",
    numeroFacture: "OPN-FAC-2026-00144",
    dateEmission: "2026-09-05",
    dateEcheance: "2026-10-05",
    structureNom: "Centre Hospitalier Régional de Port-Gentil (N'Tchengué)",
    structureType: "CHR",
    structureVille: "Port-Gentil (Ogooué-Maritime)",
    structureAdresse: "Zone Industrielle de N'Tchengué, Port-Gentil",
    structureNif: "NIF-664910-C",
    bonCommandeRef: "BC-CHR-POG-2026-071",
    numeroBonLivraison: "BL-OPN-2026-0365",
    montantHT: 27800000,
    montantTVA: 0,
    montantTTC: 27800000,
    tauxCnamgs: 90,
    regimeCnamgs: "Fonds 2 - Agents Publics (90%)",
    partCnamgs: 25020000,
    partStructure: 2780000,
    montantPaye: 0,
    montantReste: 27800000,
    statut: "EMISE",
    statutLabel: "Émise - En attente règlement",
    statutColor: "bg-amber-100 text-amber-800 border-amber-300",
    modePaiement: "Virement Trésor / CNAMGS",
    datePaiement: null,
    referencePaiement: null,
    banqueOpn: "BGFIBank Gabon",
    ribOpn: "GA21 4000 1000 1234 5678 9012 345",
    lignes: [
      { code: "010301015", dci: "Artésunate Injectable 60mg", conditionnement: "Flacon", quantite: 8000, prixUnitaire: 1200, montantTotal: 9600000 },
      { code: "010801001", dci: "Tramadol 50mg Injectable", conditionnement: "Boîte 10", quantite: 6000, prixUnitaire: 1700, montantTotal: 10200000 },
      { code: "010401004", dci: "Amoxicilline + Acide Clavulanique 1g/125mg", conditionnement: "Boîte 14", quantite: 4324, prixUnitaire: 1850, montantTotal: 8000000 }
    ],
    notes: "Facture transmise à la Direction Financière du CHR Port-Gentil."
  },
  {
    id: "FAC-2026-00145",
    numeroFacture: "OPN-FAC-2026-00145",
    dateEmission: "2026-09-01",
    dateEcheance: "2026-10-01",
    structureNom: "Pharmacie des Grandes Galeries (Libreville)",
    structureType: "OFFICINE_PRIVEE",
    structureVille: "Libreville (Centre-Ville)",
    structureAdresse: "Avenue du Colonel Parant, Libreville",
    structureNif: "NIF-110293-D",
    bonCommandeRef: "BC-PHARM-GG-2026-12",
    numeroBonLivraison: "BL-OPN-2026-0348",
    montantHT: 14500000,
    montantTVA: 0,
    montantTTC: 14500000,
    tauxCnamgs: 80,
    regimeCnamgs: "Fonds 3 - Salariés Privés (80%)",
    partCnamgs: 11600000,
    partStructure: 2900000,
    montantPaye: 14500000,
    montantReste: 0,
    statut: "SOLDEE",
    statutLabel: "Soldée (Chèque BGFI)",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    modePaiement: "Chèque Certifié BGFI Bank",
    datePaiement: "2026-09-04",
    referencePaiement: "CHQ-BGFI-2026-44192",
    banqueOpn: "BGFIBank Gabon",
    ribOpn: "GA21 4000 1000 1234 5678 9012 345",
    lignes: [
      { code: "010701002", dci: "Paracétamol 1g Comprimé (Doliprane)", conditionnement: "Boîte 100", quantite: 3000, prixUnitaire: 2483, montantTotal: 7450000 },
      { code: "010301001", dci: "Artéméther + Luméfantrine 20/120mg CP", conditionnement: "Boîte 24", quantite: 7421, prixUnitaire: 950, montantTotal: 7050000 }
    ],
    notes: "Facture réglée au comptant lors de l'enlèvement au Hub National d'Owendo."
  },
  {
    id: "FAC-2026-00146",
    numeroFacture: "OPN-FAC-2026-00146",
    dateEmission: "2026-09-14",
    dateEcheance: "2026-10-14",
    structureNom: "Dispensaire Public Municipal d'Oyem",
    structureType: "DISPENSAIRE",
    structureVille: "Oyem (Woleu-Ntem)",
    structureAdresse: "Centre-Ville Oyem, Woleu-Ntem",
    structureNif: "NIF-991201-E",
    bonCommandeRef: "BC-DISP-OYM-2026-05",
    numeroBonLivraison: "BL-OPN-2026-0402",
    montantHT: 7800000,
    montantTVA: 0,
    montantTTC: 7800000,
    tauxCnamgs: 100,
    regimeCnamgs: "Fonds 1 - GEF Gratuité (100%)",
    partCnamgs: 7800000,
    partStructure: 0,
    montantPaye: 7800000,
    montantReste: 0,
    statut: "SOLDEE",
    statutLabel: "Soldée (Prise en charge 100% GEF)",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    modePaiement: "Prise en charge directe Fonds 1 CNAMGS (Gratuité)",
    datePaiement: "2026-09-15",
    referencePaiement: "COMPENS-GEF-2026-091",
    banqueOpn: "BGFIBank Gabon",
    ribOpn: "GA21 4000 1000 1234 5678 9012 345",
    lignes: [
      { code: "010301001", dci: "Artéméther + Luméfantrine 20/120mg CP", conditionnement: "Boîte 24", quantite: 4000, prixUnitaire: 950, montantTotal: 3800000 },
      { code: "010701002", dci: "Paracétamol 500mg CP", conditionnement: "Boîte 100", quantite: 2000, prixUnitaire: 2000, montantTotal: 4000000 }
    ],
    notes: "Facture prise en charge à 100% par le Fonds de Garantie Sociale (GEF / CNAMGS)."
  },
  {
    id: "FAC-2026-00147",
    numeroFacture: "OPN-FAC-2026-00147",
    dateEmission: "2026-05-10",
    dateEcheance: "2026-06-10",
    structureNom: "Clinique Médico-Chirurgicale Sainte-Marie (Libreville)",
    structureType: "OFFICINE_PRIVEE",
    structureVille: "Libreville (Batterie IV)",
    structureAdresse: "Quartier Batterie IV, Libreville",
    structureNif: "NIF-334901-F",
    bonCommandeRef: "BC-CM-SM-2026-19",
    numeroBonLivraison: "BL-OPN-2026-0198",
    montantHT: 18900000,
    montantTVA: 0,
    montantTTC: 18900000,
    tauxCnamgs: 80,
    regimeCnamgs: "Fonds 3 - Salariés Privés (80%)",
    partCnamgs: 15120000,
    partStructure: 3780000,
    montantPaye: 3780000,
    montantReste: 15120000,
    statut: "EMISE",
    statutLabel: "Contentieux (>90 jours)",
    statutColor: "bg-red-100 text-red-800 border-red-300",
    modePaiement: "En attente recouvrement forcé",
    datePaiement: "2026-05-20",
    referencePaiement: "AVANCE-3.78M",
    banqueOpn: "CDC Gabon (Compte Recouvrement)",
    ribOpn: "GA21 4000 2000 9876 5432 1098 765",
    lignes: [
      { code: "010401004", dci: "Amoxicilline + Acide Clavulanique Injectable", conditionnement: "Flacon 1g", quantite: 6000, prixUnitaire: 1950, montantTotal: 11700000 },
      { code: "010701002", dci: "Ceftriaxone 1g Poudre Inj", conditionnement: "Flacon 1g", quantite: 4000, prixUnitaire: 1800, montantTotal: 7200000 }
    ],
    notes: "Mise en demeure envoyée le 10/08/2026. Dossier transmis au service juridique OPN et à l'Agent Judiciaire de l'État."
  }
];

export const INVOICES_LIST = INITIAL_INVOICES;

export const CNAMGS_MONTHLY_BATCHES = [
  {
    id: "BATCH-202608-048",
    periode: "08/2026",
    mois: "Août 2026",
    dateTransmission: "2026-09-02",
    nbFactures: 48,
    montantTotalCnamgs: 215400000,
    montantLiquide: 204630000,
    montantRejete: 10770000,
    montantVire: 204630000,
    tauxAcceptation: 95.0,
    statut: "VIRE_TRESOR",
    statutLabel: "Viré par le Trésor Public",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    referenceBordereau: "BORD-2026-08-9941",
    modeTransmission: "TELETRANSMISSION_EDI",
    detailsFonds: {
      fonds1GEF: 64620000,
      fonds2SalariePublic: 118470000,
      fonds3SalariePrive: 32310000
    },
    notes: "Lot entièrement apuré par virement Trésor Public. Rejets régularisés sur le bordereau de septembre."
  },
  {
    id: "BATCH-202609-054",
    periode: "09/2026",
    mois: "Septembre 2026 (En cours)",
    dateTransmission: "2026-09-15",
    nbFactures: 54,
    montantTotalCnamgs: 248900000,
    montantLiquide: 186675000,
    montantRejete: 0,
    montantVire: 0,
    tauxAcceptation: 75.0,
    statut: "EN_LIQUIDATION",
    statutLabel: "En cours d'instruction",
    statutColor: "bg-blue-100 text-blue-800 border-blue-300",
    referenceBordereau: "BORD-2026-09-1082",
    modeTransmission: "TELETRANSMISSION_EDI",
    detailsFonds: {
      fonds1GEF: 74670000,
      fonds2SalariePublic: 136895000,
      fonds3SalariePrive: 37335000
    },
    notes: "Transmission du flux électronique GEF / Tiers-Payant validée par la DAF OPN."
  },
  {
    id: "BATCH-202607-042",
    periode: "07/2026",
    mois: "Juillet 2026",
    dateTransmission: "2026-08-01",
    nbFactures: 42,
    montantTotalCnamgs: 183700000,
    montantLiquide: 183700000,
    montantRejete: 0,
    montantVire: 183700000,
    tauxAcceptation: 100.0,
    statut: "VIRE_TRESOR",
    statutLabel: "Viré à 100% (Trésor)",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    referenceBordereau: "BORD-2026-07-7734",
    modeTransmission: "TELETRANSMISSION_EDI",
    detailsFonds: {
      fonds1GEF: 55110000,
      fonds2SalariePublic: 101035000,
      fonds3SalariePrive: 27555000
    },
    notes: "Règlement 100% sans aucun rejet administratif."
  }
];

export const CNAMGS_TELETRANSMISSIONS = CNAMGS_MONTHLY_BATCHES;

export const AGING_BALANCE_DATA = {
  totalCreances: 222200000,
  tranches: [
    {
      label: "Courant (< 30 j)",
      montant: 94800000,
      nbFactures: 32,
      color: "emerald",
      description: "Factures émises ce mois sous délai de grâce réglementaire."
    },
    {
      label: "30 à 60 jours",
      montant: 68400000,
      nbFactures: 14,
      color: "teal",
      description: "Créances en cours d'instruction et de liquidation par la CNAMGS."
    },
    {
      label: "60 à 90 jours",
      montant: 34200000,
      nbFactures: 6,
      color: "amber",
      description: "Retards de paiement nécessitant une relance niveau 1 auprès des DAF hospitalières."
    },
    {
      label: "Contentieux (> 90 j)",
      montant: 24800000,
      nbFactures: 4,
      color: "red",
      description: "Créances critiques sous protocole de mise en demeure et compensation Trésor."
    }
  ]
};

export const AGING_BALANCE_SUMMARY = AGING_BALANCE_DATA.tranches;

export const CLIENT_CONVENTIONS = [
  {
    id: "CONV-CNAMGS-CHU-001",
    nom: "Centre Hospitalier Universitaire de Libreville (CHUL)",
    ville: "Libreville (Estuaire)",
    type: "Hôpital Universitaire Public",
    tauxCnamgs: 90,
    regimeCnamgs: "Fonds 2 - Agents Publics (90%)",
    plafondCredit: 100000000,
    encoursActuel: 48500000,
    delaiPaiementJours: 45,
    dateSignature: "2024-01-01",
    statut: "ACTIVE"
  },
  {
    id: "CONV-CNAMGS-CHR-004",
    nom: "Centre Hospitalier Régional Amissa Bongo (Franceville)",
    ville: "Franceville (Haut-Ogooué)",
    type: "Hôpital Régional Public",
    tauxCnamgs: 90,
    regimeCnamgs: "Fonds 2 - Agents Publics (90%)",
    plafondCredit: 50000000,
    encoursActuel: 32400000,
    delaiPaiementJours: 30,
    dateSignature: "2023-06-15",
    statut: "ACTIVE"
  },
  {
    id: "CONV-CNAMGS-CHR-008",
    nom: "Centre Hospitalier Régional de Port-Gentil",
    ville: "Port-Gentil (Ogooué-Maritime)",
    type: "Hôpital Régional Public",
    tauxCnamgs: 90,
    regimeCnamgs: "Fonds 2 - Agents Publics (90%)",
    plafondCredit: 60000000,
    encoursActuel: 27800000,
    delaiPaiementJours: 30,
    dateSignature: "2024-03-01",
    statut: "ACTIVE"
  },
  {
    id: "CONV-CNAMGS-OFF-088",
    nom: "Pharmacie des Grandes Galeries",
    ville: "Libreville (Centre-Ville)",
    type: "Pharmacie d'Officine Privée",
    tauxCnamgs: 80,
    regimeCnamgs: "Fonds 3 - Salariés Privés (80%)",
    plafondCredit: 25000000,
    encoursActuel: 14500000,
    delaiPaiementJours: 30,
    dateSignature: "2025-01-01",
    statut: "ACTIVE"
  },
  {
    id: "CONV-CNAMGS-DISP-033",
    nom: "Dispensaire Public Municipal d'Oyem",
    ville: "Oyem (Woleu-Ntem)",
    type: "Dispensaire / Soins Primaires",
    tauxCnamgs: 100,
    regimeCnamgs: "Fonds 1 - GEF Gratuité (100%)",
    plafondCredit: 80000000,
    encoursActuel: 7800000,
    delaiPaiementJours: 60,
    dateSignature: "2024-01-01",
    statut: "ACTIVE"
  },
  {
    id: "CONV-CNAMGS-CM-009",
    nom: "Clinique Médico-Chirurgicale Sainte-Marie",
    ville: "Libreville (Batterie IV)",
    type: "Clinique Privée Conventionnée",
    tauxCnamgs: 80,
    regimeCnamgs: "Fonds 3 - Salariés Privés (80%)",
    plafondCredit: 20000000,
    encoursActuel: 18900000,
    delaiPaiementJours: 30,
    dateSignature: "2023-11-10",
    statut: "SOUS_CONTENTIEUX"
  }
];

export const CNAMGS_EDI_FLUX = [
  {
    id: "EDI-2026-09-001",
    lotRef: "BORD-2026-09-8891",
    mois: "Septembre 2026",
    horodatage: "2026-09-15 14:32:10",
    emetteur: "OPN Gabon (DAF / Système Central ERP)",
    destinataire: "CNAMGS - Passerelle Télétransmission EDI v2.4",
    protocole: "AS2 / HTTPS REST Mutual-TLS (mTLS)",
    formatFlux: "XML_ISO_20022_SANTE & JSON_REST",
    statutValidation: "VALIDE_CONFORME",
    statutTransmission: "ACQUITTE_CNAMGS",
    codeRetourCnamgs: "ACK_200_OK_ORDO_VALIDE",
    nbFactures: 48,
    totalCnamgsXAF: 218750000,
    empreinteSHA256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    certificatSignataire: "CN=OPN-GABON-ANINF-PKI-2026, OU=DAF, O=Office Pharmaceutique National",
    xmlSample: `<?xml version="1.0" encoding="UTF-8"?>
<CNAMGS_Bordereau_Sante xmlns="urn:ga:gouv:sante:cnamgs:edi:v2" Version="2.4">
  <EnteteTransmission>
    <IdMessage>EDI-2026-09-001</IdMessage>
    <Horodatage>2026-09-15T14:32:10+01:00</Horodatage>
    <Emetteur CodeNIF="NIF-010203-OPN">Office Pharmaceutique National (OPN)</Emetteur>
    <Destinataire CodeOrganisme="GA-CNAMGS-01">Caisse Nationale d'Assurance Maladie et de Garantie Sociale</Destinataire>
    <ReferenceBordereau>BORD-2026-09-8891</ReferenceBordereau>
    <Devise>XAF</Devise>
  </EnteteTransmission>
  <FondsPriseEnCharge>
    <Fonds Code="FONDS-1-GEF" TauxPriseEnCharge="100.00" Montant="65625000" />
    <Fonds Code="FONDS-2-AGENTS-PUBLICS" TauxPriseEnCharge="90.00" Montant="120312500" />
    <Fonds Code="FONDS-3-SALARIES-PRIVES" TauxPriseEnCharge="80.00" Montant="32812500" />
  </FondsPriseEnCharge>
  <RecapitulatifFactures TotalFactures="48" MontantTotalCnamgs="218750000" ExonerationTVA="100.00%">
    <Facture Ref="FAC-2026-00142" Structure="CHUL Libreville" MontantTTC="48500000" PartCNAMGS="43650000" PartClient="4850000" />
    <Facture Ref="FAC-2026-00143" Structure="CHR Amissa Bongo" MontantTTC="32400000" PartCNAMGS="29160000" PartClient="3240000" />
    <Facture Ref="FAC-2026-00144" Structure="CHR Port-Gentil" MontantTTC="27800000" PartCNAMGS="25020000" PartClient="2780000" />
    <Facture Ref="FAC-2026-00145" Structure="Dispensaire Oyem" MontantTTC="7800000" PartCNAMGS="7800000" PartClient="0" />
  </RecapitulatifFactures>
  <SignatureElectronique ANINF="true">
    <Algorithme>SHA256withRSA</Algorithme>
    <Certificat>ANINF-OPN-TRUSTED-2026-GABON</Certificat>
    <SignatureValue>MEQCIDv+v9H8z5Q9aP...[TRUNCATED_SIGNATURE_DATA]...4z7kL9==</SignatureValue>
  </SignatureElectronique>
</CNAMGS_Bordereau_Sante>`,
    jsonSample: `{
  "ediHeader": {
    "messageId": "EDI-2026-09-001",
    "timestamp": "2026-09-15T14:32:10+01:00",
    "issuer": "Office Pharmaceutique National (OPN)",
    "issuerNif": "NIF-010203-OPN",
    "recipient": "Caisse Nationale d'Assurance Maladie (CNAMGS)",
    "batchReference": "BORD-2026-09-8891",
    "currency": "XAF"
  },
  "fundsBreakdown": [
    { "fundCode": "FONDS-1-GEF", "ratePercent": 100, "amountXAF": 65625000 },
    { "fundCode": "FONDS-2-AGENTS-PUBLICS", "ratePercent": 90, "amountXAF": 120312500 },
    { "fundCode": "FONDS-3-SALARIES-PRIVES", "ratePercent": 80, "amountXAF": 32812500 }
  ],
  "invoicesSummary": {
    "totalCount": 48,
    "totalClaimedXAF": 218750000,
    "vatExemption": true,
    "legalBasis": "Code Général des Impôts Gabon - Médicaments Essentiels LNME"
  },
  "security": {
    "aninfSecured": true,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "status": "VALIDATED_BY_CNAMGS_CLEARING_ENGINE"
  }
}`
  },
  {
    id: "EDI-2026-08-002",
    lotRef: "BORD-2026-08-8120",
    mois: "Août 2026",
    horodatage: "2026-08-16 11:15:00",
    emetteur: "OPN Gabon (DAF / Système Central ERP)",
    destinataire: "CNAMGS - Passerelle Télétransmission EDI v2.4",
    protocole: "AS2 / HTTPS REST Mutual-TLS (mTLS)",
    formatFlux: "XML_ISO_20022_SANTE & JSON_REST",
    statutValidation: "VALIDE_CONFORME",
    statutTransmission: "LIQUIDE_ET_PAYE",
    codeRetourCnamgs: "ACK_200_OK_VIREMENT_TRESOR_CONFIRME",
    nbFactures: 52,
    totalCnamgsXAF: 195400000,
    empreinteSHA256: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    certificatSignataire: "CN=OPN-GABON-ANINF-PKI-2026, OU=DAF, O=Office Pharmaceutique National",
    xmlSample: `<?xml version="1.0" encoding="UTF-8"?>
<CNAMGS_Bordereau_Sante xmlns="urn:ga:gouv:sante:cnamgs:edi:v2" Version="2.4">
  <EnteteTransmission>
    <IdMessage>EDI-2026-08-002</IdMessage>
    <Horodatage>2026-08-16T11:15:00+01:00</Horodatage>
    <Emetteur CodeNIF="NIF-010203-OPN">Office Pharmaceutique National (OPN)</Emetteur>
    <Destinataire CodeOrganisme="GA-CNAMGS-01">Caisse Nationale d'Assurance Maladie</Destinataire>
    <ReferenceBordereau>BORD-2026-08-8120</ReferenceBordereau>
    <Devise>XAF</Devise>
  </EnteteTransmission>
  <RecapitulatifFactures TotalFactures="52" MontantTotalCnamgs="195400000" ExonerationTVA="100.00%" />
</CNAMGS_Bordereau_Sante>`,
    jsonSample: `{ "ediHeader": { "messageId": "EDI-2026-08-002", "batchReference": "BORD-2026-08-8120" }, "status": "SETTLED_BY_DGCPT" }`
  }
];

export const TRESOR_PUBLIC_SETTLEMENTS = [
  {
    id: "RAP-TP-2026-09-01",
    mandatTresorRef: "MDT-DGCPT-2026-08194",
    bordereauRef: "BORD-2026-09-8891",
    dateMandat: "2026-09-17",
    dateValeurBanque: "2026-09-18",
    compteTresor: "Compte Unique du Trésor Public (CUT Gabon)",
    banqueDestinataire: "BGFIBank Gabon (Compte Trésorerie OPN)",
    ribDestinataire: "GA21 4000 1000 1234 5678 9012 345",
    montantOrdonnance: 218750000,
    montantEncaisse: 218750000,
    ecartLettrage: 0,
    statutConciliation: "CONCILIE_100",
    statutLabel: "Conciliation 100% Conforme",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    visaControleurFinancier: "VISA-CF-2026-09-441 (Approuvé)",
    ordonnateur: "Directeur Général de la Comptabilité Publique et du Trésor (DGCPT)"
  },
  {
    id: "RAP-TP-2026-08-02",
    mandatTresorRef: "MDT-DGCPT-2026-07431",
    bordereauRef: "BORD-2026-08-8120",
    dateMandat: "2026-08-25",
    dateValeurBanque: "2026-08-27",
    compteTresor: "Compte Unique du Trésor Public (CUT Gabon)",
    banqueDestinataire: "CDC Gabon (Caisse des Dépôts et Consignations)",
    ribDestinataire: "GA21 4000 2000 9876 5432 1098 765",
    montantOrdonnance: 195400000,
    montantEncaisse: 195400000,
    ecartLettrage: 0,
    statutConciliation: "CONCILIE_100",
    statutLabel: "Conciliation 100% Conforme",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    visaControleurFinancier: "VISA-CF-2026-08-392 (Approuvé)",
    ordonnateur: "Directeur Général de la Comptabilité Publique et du Trésor (DGCPT)"
  },
  {
    id: "RAP-TP-2026-07-03",
    mandatTresorRef: "MDT-DGCPT-2026-06109",
    bordereauRef: "BORD-2026-07-7734",
    dateMandat: "2026-07-28",
    dateValeurBanque: "2026-07-30",
    compteTresor: "Compte Unique du Trésor Public (CUT Gabon)",
    banqueDestinataire: "BGFIBank Gabon (Compte Trésorerie OPN)",
    ribDestinataire: "GA21 4000 1000 1234 5678 9012 345",
    montantOrdonnance: 183700000,
    montantEncaisse: 183700000,
    ecartLettrage: 0,
    statutConciliation: "CONCILIE_100",
    statutLabel: "Conciliation 100% Conforme",
    statutColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    visaControleurFinancier: "VISA-CF-2026-07-210 (Approuvé)",
    ordonnateur: "Directeur Général de la Comptabilité Publique et du Trésor (DGCPT)"
  }
];
