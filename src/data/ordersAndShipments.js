// Données des Commandes d'Approvisionnement, Expéditions & Convois (OPN Gabon)
// Monnaie : FCFA (XAF)

export const PROCUREMENT_ORDERS = [
  {
    id: "CMD-2026-FRV-0089",
    numeroDemande: "OPN-CMD-2026-089",
    antenneId: "G2", // Haut-Ogooué (Franceville)
    provinceNom: "Haut-Ogooué",
    villeDestination: "Franceville",
    demandeurNom: "M. Brice ELLA MBA",
    dateCreation: "2026-09-02T08:30:00Z",
    statut: "EN_EXPEDITION", // 'BROUILLON', 'SOUMIS', 'VALIDE_DIRECTION', 'EN_PREPARATION', 'EN_EXPEDITION', 'RECU_CONFORME'
    etapeIndex: 4, // Étape 5 sur 6
    modeTransport: "Ferroviaire Setrag (Wagon Frigo N°884) + Camion Navette",
    numeroBordereau: "BL-SETRAG-2026-4410",
    transporteur: "Setrag Fret Express / OPN Logistique",
    chauffeurOuAgent: "M. Jean-Paul MVE (Setrag Transit Lastourville/Franceville)",
    dateDepartOwendo: "2026-09-05T14:00:00Z",
    dateEstimeeArrivee: "2026-09-09T18:00:00Z",
    montantTotalXAF: 18450000,
    motif: "Réassort prioritaire antipaludiques ACT & Paracétamol injectable post-saison des pluies",
    lignes: [
      {
        produitId: "MED-ACT-001",
        code: "OPN-PAL-001",
        designation: "Artéméther + Luméfantrine 20/120mg",
        quantiteDemandee: 4000,
        quantiteValidee: 4000,
        unite: "Boîte",
        prixUnitaireXAF: 1850,
        totalLigneXAF: 7400000
      },
      {
        produitId: "MED-PAR-003",
        code: "OPN-ANT-003",
        designation: "Paracétamol Injectable 10mg/ml 100ml",
        quantiteDemandee: 3500,
        quantiteValidee: 3500,
        unite: "Flacon",
        prixUnitaireXAF: 450,
        totalLigneXAF: 1575000
      },
      {
        produitId: "MED-INS-005",
        code: "OPN-DIA-005",
        designation: "Insuline Humaine Rapide 100 UI/ml (Actrapid)",
        quantiteDemandee: 800,
        quantiteValidee: 800,
        unite: "Flacon",
        prixUnitaireXAF: 4200,
        totalLigneXAF: 3360000,
        chaineFroid: true
      },
      {
        produitId: "MED-SOL-007",
        code: "OPN-SOL-007",
        designation: "Sérum Ringer Lactate 500ml Poche",
        quantiteDemandee: 9400,
        quantiteValidee: 9400,
        unite: "Poche",
        prixUnitaireXAF: 650,
        totalLigneXAF: 6115000
      }
    ],
    historiqueWorkflow: [
      { etape: "Création de la demande par l'antenne", date: "02/09/2026 à 08h30", auteur: "M. Brice ELLA MBA", valide: true },
      { etape: "Validation technique & calcul CMM", date: "03/09/2026 à 10h15", auteur: "Mme Sylvie NTSAME (Owendo)", valide: true },
      { etape: "Approbation financière Direction Générale", date: "03/09/2026 à 16h40", auteur: "Dr. Jean-Bernard OBAME", valide: true },
      { etape: "Colisage & Palettisation sécurisée Owendo", date: "04/09/2026 à 15h00", auteur: "Magasin Central Hub Owendo", valide: true },
      { etape: "Chargement & Expédition convoi Setrag", date: "05/09/2026 à 14h00", auteur: "M. Rodrigue MAVOUNGOU", valide: true },
      { etape: "Réception physique & Contrôle contradictoire", date: "En attente d'arrivée à Franceville", auteur: "Antenne Haut-Ogooué", valide: false }
    ]
  },
  {
    id: "CMD-2026-MAK-0091",
    numeroDemande: "OPN-CMD-2026-091",
    antenneId: "G6", // Ogooué-Ivindo (Makokou)
    provinceNom: "Ogooué-Ivindo",
    villeDestination: "Makokou",
    demandeurNom: "Dr. Serge MEZUI M'ELLA",
    dateCreation: "2026-09-04T11:00:00Z",
    statut: "EN_PREPARATION",
    etapeIndex: 3,
    modeTransport: "Convoi Routier 4x4 Tout-Terrain Sécurisé OPN",
    numeroBordereau: "BL-OPN-RN1-9982",
    transporteur: "Flotte Logistique OPN Libreville",
    chauffeurOuAgent: "M. Rodrigue MAVOUNGOU",
    dateDepartOwendo: "2026-09-08T06:00:00Z",
    dateEstimeeArrivee: "2026-09-12T17:00:00Z",
    montantTotalXAF: 9800000,
    motif: "Alerte rouge rupture Sérums Antivenimeux & Solutés de réanimation CHR Makokou",
    lignes: [
      {
        produitId: "MED-SER-004",
        code: "OPN-URG-004",
        designation: "Sérum Polyvalent Antivenimeux",
        quantiteDemandee: 40,
        quantiteValidee: 40,
        unite: "Flacon",
        prixUnitaireXAF: 48000,
        totalLigneXAF: 1920000,
        chaineFroid: true
      },
      {
        produitId: "MED-AMX-002",
        code: "OPN-ANT-002",
        designation: "Amoxicilline 500mg Gélule",
        quantiteDemandee: 1500,
        quantiteValidee: 1500,
        unite: "Boîte",
        prixUnitaireXAF: 2400,
        totalLigneXAF: 3600000
      },
      {
        produitId: "MED-CEF-008",
        code: "OPN-ANT-008",
        designation: "Ceftriaxone 1g Injectable",
        quantiteDemandee: 3890,
        quantiteValidee: 3890,
        unite: "Flacon",
        prixUnitaireXAF: 1100,
        totalLigneXAF: 4280000
      }
    ],
    historiqueWorkflow: [
      { etape: "Déclaration d'urgence par Dr. Mezui", date: "04/09/2026 à 11h00", auteur: "Dr. Serge MEZUI M'ELLA", valide: true },
      { etape: "Validation prioritaire Owendo", date: "04/09/2026 à 11h45", auteur: "Mme Sylvie NTSAME", valide: true },
      { etape: "Approbation spéciale Direction Générale", date: "04/09/2026 à 12h10", auteur: "Dr. Jean-Bernard OBAME", valide: true },
      { etape: "Picking & Colisage sécurisé glacières autonomes", date: "05/09/2026 à 09h00", auteur: "Magasin Central Owendo", valide: true },
      { etape: "Départ convoi RN1 vers Koumameyong/Makokou", date: "Prévu le 08/09/2026", auteur: "M. Rodrigue MAVOUNGOU", valide: false },
      { etape: "Réception au CHR de Makokou", date: "Prévu le 12/09/2026", auteur: "Antenne Ogooué-Ivindo", valide: false }
    ]
  },
  {
    id: "CMD-2026-POG-0078",
    numeroDemande: "OPN-CMD-2026-078",
    antenneId: "G8", // Ogooué-Maritime (Port-Gentil)
    provinceNom: "Ogooué-Maritime",
    villeDestination: "Port-Gentil",
    demandeurNom: "M. Marc ANGUILET",
    dateCreation: "2026-08-25T10:00:00Z",
    statut: "RECU_CONFORME",
    etapeIndex: 5,
    modeTransport: "Navette Maritime Bateau Cargo 'L'Étoile du Gabon'",
    numeroBordereau: "BL-MAR-2026-118",
    transporteur: "Compagnie Maritime Port-Gentil / OPN",
    chauffeurOuAgent: "Cdt. Fabrice NGUEMA",
    dateDepartOwendo: "2026-08-28T07:00:00Z",
    dateEstimeeArrivee: "2026-08-30T14:00:00Z",
    montantTotalXAF: 24600000,
    motif: "Dotation mensuelle régulière centres de santé et cliniques conventionnées Port-Gentil",
    lignes: [
      {
        produitId: "MED-ACT-001",
        code: "OPN-PAL-001",
        designation: "Artéméther + Luméfantrine 20/120mg",
        quantiteDemandee: 8000,
        quantiteValidee: 8000,
        unite: "Boîte",
        prixUnitaireXAF: 1850,
        totalLigneXAF: 14800000
      },
      {
        produitId: "MED-OXC-006",
        code: "OPN-GYN-006",
        designation: "Ocytocine 10 UI/ml Injectable",
        quantiteDemandee: 3160,
        quantiteValidee: 3160,
        unite: "Boîte",
        prixUnitaireXAF: 3100,
        totalLigneXAF: 9800000
      }
    ],
    historiqueWorkflow: [
      { etape: "Création de la demande", date: "25/08/2026 à 10h00", auteur: "M. Marc ANGUILET", valide: true },
      { etape: "Validation technique Owendo", date: "26/08/2026 à 09h00", auteur: "Mme Sylvie NTSAME", valide: true },
      { etape: "Validation DG OPN", date: "26/08/2026 à 14h00", auteur: "Dr. Jean-Bernard OBAME", valide: true },
      { etape: "Palettisation portuaire Owendo", date: "27/08/2026 à 11h00", auteur: "Équipe Maritime OPN", valide: true },
      { etape: "Appontement & Traversée maritime", date: "28/08/2026 à 07h00", auteur: "Navette Port-Gentil", valide: true },
      { etape: "Déchargement & Réception conforme", date: "30/08/2026 à 16h20", auteur: "M. Marc ANGUILET", valide: true }
    ]
  }
];
