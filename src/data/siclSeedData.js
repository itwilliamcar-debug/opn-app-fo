/**
 * Base de Données et Référentiels SICL OPN 2026 (Conforme CDC v1.0)
 * 
 * Couvre :
 * - M2 : Référentiel Prospects & Visites commerciales (Photos, GPS, Statuts, Dormants >90j, Conversion)
 * - M4 : Registre des Ventes Manquées (AM-02)
 * - M5 : Suivi des Créances Publiques (Engagement -> Liquidation -> Mandatement -> Trésor) (AM-13)
 * - M6 : Traçabilité Descendante & Matrice de Rappel de Lot (AM-07)
 * - M7 : Inventaires avec Gel de Stock & Registre des Avaries / PV Destructions (EF-M7)
 * - M8 : Matrice d'Arbitrage des Transferts Inter-Antennes (AM-08)
 */

import { generateOpnDocNumber } from '../utils/codificationHelper';

export const SICL_PROSPECTS_SEED = [
  {
    id: "PROS_G9_001",
    code: "PROS_G9_001",
    antenneId: "G9",
    antenneNom: "Antenne Régionale Woleu-Ntem (Oyem)",
    nomStructure: "Polyclinique Sainte-Marie d'Oyem",
    typeStructure: "Clinique Privée",
    province: "Woleu-Ntem",
    provinceCode: "G9",
    localite: "Oyem",
    regionSanitaire: "Région Sanitaire Nord",
    contactNom: "Dr. Henriette NTOUTOUME",
    telephone: "+241 077 34 21 09",
    email: "direction@polyclinique-stemarie-oyem.ga",
    adresse: "Quartier Adjougou, Rue du Grand Marché",
    gps: { lat: 1.5991, lng: 11.5793 },
    photoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop&auto=format&q=80",
    statut: "DEVIS_ENVOYE", // IDENTIFIE, CONTACTE, DEVIS_ENVOYE, CONVERTI, PERDU
    dateCreation: "2026-07-12",
    dateDerniereVisite: "2026-09-28",
    joursDepuisVisite: 9,
    isDormant: false, // > 90 jours sans visite
    commercialAssignee: "M. Paul MEBIAME (Commercial Terrain G9)",
    commentaire: "Très forte demande en solutés injectables, antipaludiques de dernière génération et gants chirurgicaux.",
    historiqueVisites: [
      {
        id: "VIS-2026-089",
        date: "2026-07-14",
        commercial: "M. Paul MEBIAME",
        resultat: "INTERESSE",
        commentaire: "Présentation du catalogue OPN SIMPEX et mercuriale homologuée.",
        prochaineAction: "Transmettre une offre tarifaire sur 15 références d'urgence."
      },
      {
        id: "VIS-2026-112",
        date: "2026-09-28",
        commercial: "M. Paul MEBIAME",
        resultat: "DEVIS_DEMANDE",
        commentaire: "Remise du devis DeG9_26004 d'un montant de 3 850 000 XAF.",
        prochaineAction: "Relancer pour validation du Bon de Commande client."
      }
    ],
    devisAssocies: ["DeG9_26004"],
    clientConvertiId: null // Renseigné lors de la conversion
  },
  {
    id: "PROS_G8_002",
    code: "PROS_G8_002",
    antenneId: "G8",
    antenneNom: "Antenne Régionale Ogooué-Maritime (Port-Gentil)",
    nomStructure: "Cabinet Médical du Littoral Mandji",
    typeStructure: "Cabinet Médical Privé",
    province: "Ogooué-Maritime",
    provinceCode: "G8",
    localite: "Port-Gentil",
    regionSanitaire: "Région Sanitaire Maritime",
    contactNom: "Dr. Alain OBOUNOU",
    telephone: "+241 066 90 12 45",
    email: "littoral.mandji@cliniques-gabon.ga",
    adresse: "Boulevard Léon Mba, Face Total Gabon",
    gps: { lat: -0.7193, lng: 8.7815 },
    photoUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop&auto=format&q=80",
    statut: "CONTACTE",
    dateCreation: "2026-04-10",
    dateDerniereVisite: "2026-05-15",
    joursDepuisVisite: 145,
    isDormant: true, // ALERTE RG-M2-01 (> 90 jours)
    commercialAssignee: "Mme Sandrine AVOMO (Commerciale POG)",
    commentaire: "Client potentiel à fort pouvoir d'achat. Nécessite une relance urgente du Responsable d'Antenne.",
    historiqueVisites: [
      {
        id: "VIS-2026-042",
        date: "2026-05-15",
        commercial: "Mme Sandrine AVOMO",
        resultat: "A_RELANCER",
        commentaire: "Attente du renouvellement du plateau technique du cabinet.",
        prochaineAction: "Visite présentielle avec échantillonnage DM."
      }
    ],
    devisAssocies: [],
    clientConvertiId: null
  },
  {
    id: "PROS_G2_003",
    code: "PROS_G2_003",
    antenneId: "G2",
    antenneNom: "Antenne Régionale Haut-Ogooué (Franceville)",
    nomStructure: "Pharmacie de la Mpassa",
    typeStructure: "Pharmacie d'Officine",
    province: "Haut-Ogooué",
    provinceCode: "G2",
    localite: "Franceville",
    regionSanitaire: "Région Sanitaire Sud-Est",
    contactNom: "Dr. Clarisse OBIANG",
    telephone: "+241 074 88 77 66",
    email: "mpassa.officine@gmail.com",
    adresse: "Avenue Mgr Raponda Walker, Centre-Ville",
    gps: { lat: -1.6333, lng: 13.5833 },
    photoUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop&auto=format&q=80",
    statut: "CONVERTI",
    dateCreation: "2026-06-01",
    dateDerniereVisite: "2026-08-14",
    joursDepuisVisite: 54,
    isDormant: false,
    commercialAssignee: "M. Guy NGUEMA (Commercial G2)",
    commentaire: "Converti en Client officiel suite à la commande et facture FaG2_26019.",
    historiqueVisites: [
      {
        id: "VIS-2026-071",
        date: "2026-06-05",
        commercial: "M. Guy NGUEMA",
        resultat: "INTERESSE",
        commentaire: "Présentation des remises officines OPN.",
        prochaineAction: "Établissement du devis initial DeG2_26012."
      },
      {
        id: "VIS-2026-095",
        date: "2026-08-14",
        commercial: "M. Guy NGUEMA",
        resultat: "COMMANDE_PASSEE",
        commentaire: "Signature du bon de commande. Conversion client effectuée.",
        prochaineAction: "Suivi du premier réapprovisionnement."
      }
    ],
    devisAssocies: ["DeG2_26012"],
    clientConvertiId: "N0084"
  },
  {
    id: "PROS_G6_004",
    code: "PROS_G6_004",
    antenneId: "G6",
    antenneNom: "Antenne Régionale Ogooué-Ivindo (Makokou)",
    nomStructure: "Centre Médico-Chirurgical de l'Ivindo",
    typeStructure: "Centre Médical Privé",
    province: "Ogooué-Ivindo",
    provinceCode: "G6",
    localite: "Makokou",
    regionSanitaire: "Région Sanitaire Nord-Est",
    contactNom: "Dr. Serge MEZUI",
    telephone: "+241 077 65 43 21",
    email: "cmc.ivindo@sante-ga.org",
    adresse: "Quartier Epassendje, Rte de Booué",
    gps: { lat: 0.5638, lng: 12.8642 },
    photoUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop&auto=format&q=80",
    statut: "IDENTIFIE",
    dateCreation: "2026-09-02",
    dateDerniereVisite: "2026-09-10",
    joursDepuisVisite: 27,
    isDormant: false,
    commercialAssignee: "Mme Nadège ONDO (Commerciale G6)",
    commentaire: "Structure récemment ouverte. Forte patientèle minière.",
    historiqueVisites: [
      {
        id: "VIS-2026-104",
        date: "2026-09-10",
        commercial: "Mme Nadège ONDO",
        resultat: "INTERESSE",
        commentaire: "Prise de contact avec le médecin-chef.",
        prochaineAction: "Planifier démonstration produits mère-enfant."
      }
    ],
    devisAssocies: [],
    clientConvertiId: null
  }
];

export const SICL_MISSED_SALES_SEED = [
  {
    id: "VM-2026-001",
    date: "2026-09-29",
    antenneId: "G9",
    antenneNom: "Antenne Woleu-Ntem (Oyem)",
    clientNom: "CHR d'Oyem (Centre Hospitalier Régional)",
    codeProduit: "MED-001",
    designation: "Amoxicilline 500mg Gélules (B/100)",
    dci: "Amoxicilline",
    quantiteDemandee: 450,
    quantiteDisponible: 0,
    quantiteManquee: 450,
    prixUnitaireXaf: 3200,
    valeurPerdueXaf: 1440000,
    causeRupture: "Stock antenne épuisé — En attente réappro Central",
    motif: "Demande urgente pédiatrique non servie",
    actionEngagee: "Demande de transfert d'urgence initiée vers Antenne G1",
    statut: "NON_RECUPEREE"
  },
  {
    id: "VM-2026-002",
    date: "2026-09-25",
    antenneId: "G8",
    antenneNom: "Antenne Ogooué-Maritime (Port-Gentil)",
    clientNom: "Clinique Médico-Chirurgicale du Littoral",
    codeProduit: "MED-009",
    designation: "Artéméther + Luméfantrine 80/480mg (B/6)",
    dci: "Artéméther + Luméfantrine",
    quantiteDemandee: 300,
    quantiteDisponible: 50,
    quantiteManquee: 250,
    prixUnitaireXaf: 4850,
    valeurPerdueXaf: 1212500,
    causeRupture: "Allocation FEFO partielle",
    motif: "Client a refusé la livraison partielle",
    actionEngagee: "Commande fournisseur Sanofi accélérée",
    statut: "EN_COURS_RATTRAPAGE"
  },
  {
    id: "VM-2026-003",
    date: "2026-09-18",
    antenneId: "G2",
    antenneNom: "Antenne Haut-Ogooué (Franceville)",
    clientNom: "Hôpital de la Coopération Sino-Gabonaise",
    codeProduit: "DM-014",
    designation: "Seringues 5ml Stériles avec Aiguille 21G (B/100)",
    dci: "Dispositif Médical Injection",
    quantiteDemandee: 120,
    quantiteDisponible: 0,
    quantiteManquee: 120,
    prixUnitaireXaf: 7500,
    valeurPerdueXaf: 900000,
    causeRupture: "Retard dédouanement portuaire Owendo",
    motif: "Substitution DM refusée par le bloc opératoire",
    actionEngagee: "Notification Directeur Approvisionnement",
    statut: "NON_RECUPEREE"
  }
];

export const SICL_LOT_TRACEABILITY_SEED = [
  {
    numeroLot: "LOT-AMX-2026-08",
    codeProduit: "MED-001",
    designation: "Amoxicilline 500mg Gélules (B/100)",
    dci: "Amoxicilline",
    laboratoire: "SANOFI PHARMA",
    dateFabrication: "2024-08-10",
    datePeremption: "2026-11-30", // Péremption proche
    pmpEntreeXaf: 2150,
    prixVentePublicXaf: 3200,
    statutSanitaire: "ALERTE_RAPPEL_QUALITE", // CONFORME, SOUS_SURVEILLANCE, ALERTE_RAPPEL_QUALITE, BLOQUE
    motifAlerte: "Défaut d'étanchéité blister signalé par le LNCM (Laboratoire National de Contrôle du Médicament).",
    stockInitialTotal: 15000,
    stockLivreTotal: 11200,
    stockResiduelTotal: 3800,
    depotsStockResiduel: [
      { depotId: "DEP-G1-CENTRAL", antenneNom: "Magasin Central Owendo (G1)", quantite: 2100, statut: "BLOQUE_QUARANTAINE" },
      { depotId: "DEP-G2-FRV", antenneNom: "Dépôt Régional Franceville (G2)", quantite: 950, statut: "DISPONIBLE" },
      { depotId: "DEP-G9-OYEM", antenneNom: "Dépôt Régional Oyem (G9)", quantite: 750, statut: "DISPONIBLE" }
    ],
    clientsLivres: [
      {
        clientId: "N0012",
        nomClient: "CHUL - Centre Hospitalier Universitaire de Libreville",
        province: "Estuaire (G1)",
        dateLivraison: "2026-08-15",
        numeroFacture: "FaG1_26008",
        numeroBL: "BLG1_26008",
        quantiteLivree: 4000,
        responsableReception: "Dr. Marie-Paule NGUEMA (Chef Pharmacie CHUL)",
        telephone: "+241 011 72 00 12",
        statutRappel: "NOTIFIE_EN_ATTENTE_RETOUR"
      },
      {
        clientId: "N0023",
        nomClient: "CHR d'Oyem",
        province: "Woleu-Ntem (G9)",
        dateLivraison: "2026-08-20",
        numeroFacture: "FaG9_26014",
        numeroBL: "BLG9_26014",
        quantiteLivree: 2200,
        responsableReception: "Dr. Paul EMANE",
        telephone: "+241 077 45 67 89",
        statutRappel: "RETOUR_RECEPTIONNE"
      },
      {
        clientId: "N0034",
        nomClient: "Hôpital Régional de Melen",
        province: "Estuaire (G1)",
        dateLivraison: "2026-08-22",
        numeroFacture: "FaG1_26021",
        numeroBL: "BLG1_26021",
        quantiteLivree: 2500,
        responsableReception: "Dr. Serge NDONG",
        telephone: "+241 066 11 22 33",
        statutRappel: "NOTIFIE_EN_ATTENTE_RETOUR"
      },
      {
        clientId: "N0051",
        nomClient: "Polyclinique El Rapha - Libreville",
        province: "Estuaire (G1)",
        dateLivraison: "2026-09-02",
        numeroFacture: "FaG1_26045",
        numeroBL: "BLG1_26045",
        quantiteLivree: 2500,
        responsableReception: "Dr. Christian MVE",
        telephone: "+241 011 73 55 55",
        statutRappel: "NOTIFIE_EN_ATTENTE_RETOUR"
      }
    ]
  },
  {
    numeroLot: "LOT-ART-2026-04",
    codeProduit: "MED-009",
    designation: "Artéméther + Luméfantrine 80/480mg (B/6)",
    dci: "Artéméther + Luméfantrine",
    laboratoire: "IPCA LABS LTD",
    dateFabrication: "2025-01-15",
    datePeremption: "2027-01-14",
    pmpEntreeXaf: 3400,
    prixVentePublicXaf: 4850,
    statutSanitaire: "CONFORME",
    motifAlerte: null,
    stockInitialTotal: 25000,
    stockLivreTotal: 18500,
    stockResiduelTotal: 6500,
    depotsStockResiduel: [
      { depotId: "DEP-G1-CENTRAL", antenneNom: "Magasin Central Owendo (G1)", quantite: 4500, statut: "DISPONIBLE" },
      { depotId: "DEP-G8-POG", antenneNom: "Dépôt Régional Port-Gentil (G8)", quantite: 2000, statut: "DISPONIBLE" }
    ],
    clientsLivres: [
      {
        clientId: "N0018",
        nomClient: "CHR de Port-Gentil",
        province: "Ogooué-Maritime (G8)",
        dateLivraison: "2026-07-10",
        numeroFacture: "FaG8_26011",
        numeroBL: "BLG8_26011",
        quantiteLivree: 6000,
        responsableReception: "Dr. Roger KOMBILA",
        telephone: "+241 077 14 00 11",
        statutRappel: "AUCUN_RAPPEL"
      }
    ]
  }
];

export const SICL_PUBLIC_DEBT_SEED = [
  {
    id: "CRE-PUB-2601",
    numeroFacture: "FaG1_26002",
    antenneId: "G1",
    clientCode: "N0001",
    structureNom: "Centre Hospitalier Universitaire de Libreville (CHUL)",
    typeStructure: "Hôpital Public National",
    province: "Estuaire",
    montantFactureXaf: 28450000,
    montantRegleXaf: 0,
    resteARecouvrerXaf: 28450000,
    dateFacture: "2026-05-10",
    dateEcheance: "2026-07-10",
    joursRetard: 89,
    trancheAnciennete: "61-90", // NON_ECHU, 1-30, 31-60, 61-90, PLUS_90
    
    // Circuit créance publique (AM-13)
    etapeMandatement: "MANDATEMENT", // ENGAGEMENT, LIQUIDATION, MANDATEMENT, ORDONNANCEMENT_TRESOR, PAYE
    serviceInstructeur: "Direction du Contrôle Financier / Min. Santé",
    contactService: "M. Sylvain NGUEMA (Contrôleur Financier)",
    numeroEngagement: "ENG-MS-2026-0841",
    numeroBordereauMandat: "MANDAT-CHUL-26-00412",
    numeroOrdonnancementTresor: null,
    observations: "Mandat signé et transmis au Trésor Central de Libreville pour ordonnancement.",
    historiqueRelances: [
      { date: "2026-07-15", type: "COURRIER", niveau: "NIVEAU_1", auteur: "Comptabilité OPN", commentaire: "Rappel d'échéance adressé à la DAF du CHUL." },
      { date: "2026-08-20", type: "VISITE_TRESOR", niveau: "NIVEAU_2", auteur: "Mme Chantal NZENGUE (DAF OPN)", commentaire: "Dépôt d'un état récapitulatif auprès de la Direction de la Dépense Publique." }
    ]
  },
  {
    id: "CRE-PUB-2602",
    numeroFacture: "FaG9_26005",
    antenneId: "G9",
    clientCode: "N0023",
    structureNom: "Centre Hospitalier Régional d'Oyem (CHR)",
    typeStructure: "Hôpital Public Régional",
    province: "Woleu-Ntem",
    montantFactureXaf: 14200000,
    montantRegleXaf: 5000000,
    resteARecouvrerXaf: 9200000,
    dateFacture: "2026-04-02",
    dateEcheance: "2026-06-02",
    joursRetard: 127,
    trancheAnciennete: "PLUS_90",
    etapeMandatement: "LIQUIDATION",
    serviceInstructeur: "Direction Régionale de la Santé Woleu-Ntem",
    contactService: "Dr. Marcel ESSONO (Directeur Régional Santé)",
    numeroEngagement: "ENG-DRS9-2026-019",
    numeroBordereauMandat: null,
    numeroOrdonnancementTresor: null,
    observations: "Dossier en cours de visa au Contrôle Budgétaire Provincial d'Oyem.",
    historiqueRelances: [
      { date: "2026-06-10", type: "COURRIER", niveau: "NIVEAU_1", auteur: "Resp. Antenne G9", commentaire: "Lettre de relance avec copie BL signé." },
      { date: "2026-08-10", type: "MISE_EN_DEMEURE", niveau: "NIVEAU_2", auteur: "Direction Générale OPN", commentaire: "Notification de blocage des livraisons non urgentes." }
    ]
  },
  {
    id: "CRE-PUB-2603",
    numeroFacture: "FaG2_26011",
    antenneId: "G2",
    clientCode: "N0009",
    structureNom: "CHR Amissa Bongo de Franceville",
    typeStructure: "Hôpital Public Régional",
    province: "Haut-Ogooué",
    montantFactureXaf: 19800000,
    montantRegleXaf: 19800000,
    resteARecouvrerXaf: 0,
    dateFacture: "2026-06-15",
    dateEcheance: "2026-08-15",
    joursRetard: 0,
    trancheAnciennete: "NON_ECHU",
    etapeMandatement: "PAYE",
    serviceInstructeur: "Trésorerie Provinciale du Haut-Ogooué",
    contactService: "M. Payeur Provincial Franceville",
    numeroEngagement: "ENG-FRV-26-092",
    numeroBordereauMandat: "MAND-FRV-26-045",
    numeroOrdonnancementTresor: "ORD-TRES-2026-8812",
    observations: "Virement Trésor reçu et imputé le 12/09/2026.",
    historiqueRelances: []
  }
];

export const SICL_INTER_ANTENNA_ARBITRAGE_SEED = [
  {
    id: "ARB-2026-01",
    codeProduit: "MED-001",
    designation: "Amoxicilline 500mg Gélules (B/100)",
    dci: "Amoxicilline",
    antenneSourceId: "G1",
    antenneSourceNom: "Magasin Central / Antenne Estuaire (G1)",
    stockSource: 18500,
    cmmSource: 2100,
    couvertureSourceMois: 8.8, // SURSTOCK (> 4 mois)
    lotConcerne: "LOT-AMX-2026-08",
    peremptionLot: "2026-11-30", // Péremption proche !
    
    antenneDestId: "G9",
    antenneDestNom: "Antenne Régionale Woleu-Ntem - Oyem (G9)",
    stockDest: 0, // RUPTURE
    cmmDest: 850,
    couvertureDestMois: 0.0,
    
    quantiteSuggeree: 2500,
    economieAchatXaf: 5375000, // Évite une commande fournisseur
    gainPeremptionXaf: 8000000, // Écoule le lot avant destruction
    priorite: "CRITIQUE",
    motif: "Péréquation urgente : Surstock à péremption 90j à Owendo vs Rupture totale à Oyem",
    statut: "EN_ATTENTE_ARBITRAGE"
  },
  {
    id: "ARB-2026-02",
    codeProduit: "MED-009",
    designation: "Artéméther + Luméfantrine 80/480mg (B/6)",
    dci: "Artéméther + Luméfantrine",
    antenneSourceId: "G2",
    antenneSourceNom: "Antenne Haut-Ogooué - Franceville (G2)",
    stockSource: 4200,
    cmmSource: 600,
    couvertureSourceMois: 7.0,
    lotConcerne: "LOT-ART-2026-04",
    peremptionLot: "2027-01-14",
    
    antenneDestId: "G6",
    antenneDestNom: "Antenne Ogooué-Ivindo - Makokou (G6)",
    stockDest: 120,
    cmmDest: 450,
    couvertureDestMois: 0.27,
    
    quantiteSuggeree: 1500,
    economieAchatXaf: 5100000,
    gainPeremptionXaf: 0,
    priorite: "ELEVEE",
    motif: "Pic épidémique paludisme à Makokou, stock critique < 1 semaine",
    statut: "EN_ATTENTE_ARBITRAGE"
  }
];

export const SICL_INVENTORY_CAMPAIGNS_SEED = [
  {
    id: "INV-2026-G9-01",
    codePV: "PVIG9_20260930",
    antenneId: "G9",
    antenneNom: "Antenne Régionale Woleu-Ntem (Oyem)",
    depotId: "DEP-G9-OYEM",
    typeInventaire: "COMPLET", // COMPLET, TOURNANT_ABC, TOURNANT_FROID
    dateDebut: "2026-09-30",
    dateFin: "2026-09-30",
    statut: "EN_COURS_COMPTAGE", // PLANIFIE, GEL_ACTIF, EN_COURS_COMPTAGE, VALIDE_CLOTURE
    mouvementsGeles: true, // RG-M7 : Mouvements gelés
    responsableAntenne: "Dr. Camille OBIANG (Chef d'Antenne G9)",
    magasinier: "M. Patrick MBA (Magasinier)",
    tauxEcartValeur: 1.15, // < 2% (OB-02)
    valeurTheoriqueTotalXaf: 68450000,
    valeurCompteeTotalXaf: 67660000,
    ecartValeurNetXaf: -790000,
    nbLignesTotal: 142,
    nbLignesConformes: 128,
    nbLignesEcart: 14,
    lignesEchantillon: [
      {
        codeProduit: "MED-001",
        designation: "Amoxicilline 500mg Gélules (B/100)",
        lot: "LOT-AMX-2026-08",
        theorique: 750,
        compte: 745,
        ecart: -5,
        pmpXaf: 2150,
        ecartValeurXaf: -10750,
        statutLigne: "MANQUANT_JUSTIFIE",
        justification: "Casse de 5 boîtes lors du déchargement convoi RN2 constatée."
      },
      {
        codeProduit: "MED-003",
        designation: "Paracétamol 500mg B/100",
        lot: "LOT-PAR-2026-11",
        theorique: 2000,
        compte: 2020,
        ecart: +20,
        pmpXaf: 650,
        ecartValeurXaf: +13000,
        statutLigne: "SURPLUS_AJUSTE",
        justification: "Surplus d'un carton non pointé lors de la réception du 15/09."
      }
    ]
  }
];

export const SICL_AVARIES_AND_DESTRUCTIONS_SEED = [
  {
    id: "AVR-2026-041",
    codePV: "PVDG9_20260915",
    antenneId: "G9",
    antenneNom: "Antenne Régionale Woleu-Ntem (Oyem)",
    codeProduit: "MED-002",
    designation: "Ampicilline 1g Poudre Injectable",
    lot: "LOT-AMP-2024-03",
    datePeremption: "2026-08-31",
    quantiteAvariee: 320,
    pmpXaf: 1450,
    valeurPerdueXaf: 464000,
    causeAvarie: "PERIME", // CASSE, PERIME, DEFAUT_QUALITE, RUPTURE_FROID, VOL_PERTE
    statutTraitement: "EN_ATTENTE_DESTRUCTION", // DECLARE_BLOQUE, VALIDE_RESPONSABLE, EN_ATTENTE_DESTRUCTION, DETRUIT_PV_SIGNE
    declarantNom: "M. Patrick MBA (Magasinier)",
    dateDeclaration: "2026-09-01",
    responsableValidationNom: "Dr. Camille OBIANG (Chef d'Antenne G9)",
    dateValidation: "2026-09-03",
    pharmacienResponsableNom: "Dr. François MBA ALLOGO (Pharmacien Chef National)",
    visaPharmacien: true,
    pvDestructionOfficiel: {
      numero: "PVDG9_20260915",
      dateDestruction: "2026-09-15",
      lieuDestruction: "Incinérateur Sanitaire du CHR d'Oyem",
      commissionPresence: ["Dr. Camille OBIANG (OPN)", "M. le Représentant de l'Inspection Provinciale de la Santé", "M. l'Huissier de Justice"],
      methodeDestruction: "Incinération à haute température (1200°C) conforme norme OMS",
      photoPreuveUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&h=300&fit=crop&auto=format&q=80"
    }
  }
];
