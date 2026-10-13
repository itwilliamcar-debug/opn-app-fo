/**
 * Données de Référence — Module 7 : Planification Stratégique des Besoins Nationaux, Modélisation CMM & Stocks d'Urgence
 * Office Pharmaceutique National (OPN Gabon)
 */

export const STRATEGIC_KPIS = {
  budgetNationalPrevisionnelXaf: 18500000000, // 18.5 Mrd FCFA
  budgetEngageXaf: 13875000000,
  tauxExecutionBudgetaire: 75.0,
  autonomieNationaleMoyenneMois: 5.8, // 5.8 mois d'autonomie globale
  valeurReserveStrategiqueEtatXaf: 2850000000, // 2.85 Mrd FCFA de stocks de sécurité inviolables
  lignesDciSurveillees: 320,
  alertesRupture30Jours: 4,
  alertesRupture60Jours: 9,
  plansRiposteActifs: 3, // Paludisme Saisonnier, Riposte Mpox, Vigilance Choléra
};

export const PROGRAMMES_SANTE_PUBLIQUE = [
  {
    id: 'PROG-PALU',
    nom: 'Programme National de Lutte contre le Paludisme (PNLP)',
    ministereTutelle: 'Ministère de la Santé / Direction Générale de la Santé',
    enveloppeAnnuelleXaf: 4500000000,
    engageXaf: 3600000000,
    tauxExecution: 80.0,
    famillePrincipale: 'Antipaludiques & Tests Rapides',
    responsable: 'Dr. Jean-Baptiste ONDO (Coordinateur PNLP)',
    description: 'Sécurisation des combinaisons thérapeutiques à base d\'artémisinine (CTA), Artésunate injectable pour formes graves et TDR Pf/Pan.',
    medicamentsCles: ['Artésunate inj. 60mg', 'Artéméther + Luméfantrine 20/120mg', 'Dihydroartémisinine + Pipéraquine', 'TDR Paludisme Pf/Pan']
  },
  {
    id: 'PROG-MERE-ENFANT',
    nom: 'Programme National Santé Maternelle, Néonatale & Infantile (SMI)',
    ministereTutelle: 'Ministère de la Santé / Fonds d\'Aide Médicale',
    enveloppeAnnuelleXaf: 3200000000,
    engageXaf: 2400000000,
    tauxExecution: 75.0,
    famillePrincipale: 'Ocytociques, Solutés & Néonatologie',
    responsable: 'Dr. Clarisse MOUBAMBA (Directrice SMI)',
    description: 'Prévention de l\'hémorragie de la délivrance, prise en charge des nouveau-nés, micronutriments et solutés pédiatriques.',
    medicamentsCles: ['Oxytocine 10 UI/ml inj.', 'Sulfate de Magnésium 50%', 'Acide Folique + Fer', 'Sels de Réhydratation Orale + Zinc']
  },
  {
    id: 'PROG-INFECTIEUX',
    nom: 'Programme National Anti-Infectieux & Sécurité Sanitaire Épidémique',
    ministereTutelle: 'Direction des Épidémies & Lutte contre la Maladie',
    enveloppeAnnuelleXaf: 4800000000,
    engageXaf: 3840000000,
    tauxExecution: 80.0,
    famillePrincipale: 'Antibiotiques Majeurs, Antiviraux & Solutés Massifs',
    responsable: 'Dr. Patrice LEKOGO (Épidémiologiste National)',
    description: 'Approvisionnement hospitalier en antibiothérapie de première et deuxième intention, céphalosporines injectables et Ringer Lactate.',
    medicamentsCles: ['Ceftriaxone 1g inj.', 'Amoxicilline + Ac. Clavulanique', 'Ciprofloxacine 200mg perf.', 'Ringer Lactate 1000ml']
  },
  {
    id: 'PROG-MNT',
    nom: 'Programme Maladies Non Transmissibles (MNT — Diabète, HTA, Cœur)',
    ministereTutelle: 'Direction des Maladies Chroniques & Hôpitaux Publics',
    enveloppeAnnuelleXaf: 3800000000,
    engageXaf: 2660000000,
    tauxExecution: 70.0,
    famillePrincipale: 'Cardiologie, Antidiabétiques & Insulines',
    responsable: 'Pr. Alain MOUSSAVOU (Chef Service Cardiologie CHUL)',
    description: 'Stabilisation des patients chroniques avec insulines humaines 100 UI/ml, antihypertenseurs et anticoagulants.',
    medicamentsCles: ['Insuline NPH / Rapide 100 UI/ml', 'Amlodipine 5mg/10mg', 'Metformine 850mg', 'Furosémide 20mg inj. / 40mg cp']
  },
  {
    id: 'PROG-URGENCES-REANIM',
    nom: 'Programme Réserves Nationales de Crise, Réanimation & Sérums',
    ministereTutelle: 'Centre Opérationnel de Défense Sanitaire (COD / OPN)',
    enveloppeAnnuelleXaf: 2200000000,
    engageXaf: 1375000000,
    tauxExecution: 62.5,
    famillePrincipale: 'Anesthésie, Antidotes & Sérums d\'Urgence',
    responsable: 'Dr. Hugues NZAMBA (Coordinateur National COD)',
    description: 'Stocks d\'urgence inviolables : sérums antivenimeux Inoserp, sérums antitétaniques, solutés d\'expansion volémique et anesthésiques.',
    medicamentsCles: ['Sérum Antivenimeux Inoserp Panafricain', 'Sérum Antitétanique 1500 UI', 'Adrénaline 1mg/ml inj.', 'Propofol 1% émulsion']
  }
];

export const PREDICTIVE_STOCK_WATCHLIST = [
  {
    id: 'DCI-WATCH-01',
    codeDci: 'MED-PALU-001',
    designation: 'Artésunate 60mg Poudre pour Préparation Injectable + Solvant',
    forme: 'Flacon injectable 60mg',
    programme: 'PROG-PALU',
    stockActuelHubOwendo: 42000,
    stockActuelAntennesTotal: 18500,
    stockTotalNational: 60500,
    cmmStandard: 12500,
    coeffSaisonPluie: 1.45,
    cmmAjustee: 18125,
    autonomieMois: 3.3,
    dateEpuisementTheorique: '25/12/2026',
    seuilAlerteMois: 4.0,
    statutAlerte: 'ATTENTION_COMMANDE_REQUISE',
    recommandation: 'Lancer un appel d\'offres de réassort de 80 000 flacons avant le pic de saison des pluies de novembre/décembre.',
    valeurUnitaireXaf: 2450
  },
  {
    id: 'DCI-WATCH-02',
    codeDci: 'MED-INFECT-002',
    designation: 'Ceftriaxone 1g Poudre pour Solution Injectable IV/IM',
    forme: 'Flacon 1g + solvant',
    programme: 'PROG-INFECTIEUX',
    stockActuelHubOwendo: 18000,
    stockActuelAntennesTotal: 9200,
    stockTotalNational: 27200,
    cmmStandard: 14000,
    coeffSaisonPluie: 1.15,
    cmmAjustee: 16100,
    autonomieMois: 1.7,
    dateEpuisementTheorique: '08/11/2026',
    seuilAlerteMois: 3.0,
    statutAlerte: 'CRITIQUE_RUPTURE_IMMINENTE',
    recommandation: 'Passation d\'urgence d\'une commande de 60 000 flacons auprès des laboratoires homologués (Incoterm CIF Owendo).',
    valeurUnitaireXaf: 1850
  },
  {
    id: 'DCI-WATCH-03',
    codeDci: 'MED-SMI-003',
    designation: 'Oxytocine 10 UI/ml Solution Injectable (Chaîne Froid 2°C-8°C)',
    forme: 'Ampoule 1ml',
    programme: 'PROG-MERE-ENFANT',
    stockActuelHubOwendo: 65000,
    stockActuelAntennesTotal: 24000,
    stockTotalNational: 89000,
    cmmStandard: 11000,
    coeffSaisonPluie: 1.0,
    cmmAjustee: 11000,
    autonomieMois: 8.1,
    dateEpuisementTheorique: '20/05/2027',
    seuilAlerteMois: 4.0,
    statutAlerte: 'OPTIMAL_SECURITE',
    recommandation: 'Stock parfaitement dimensionné. Poursuivre le monitoring des sondes de température au Hub Owendo.',
    valeurUnitaireXaf: 650
  },
  {
    id: 'DCI-WATCH-04',
    codeDci: 'MED-SOLUT-004',
    designation: 'Ringer Lactate Poche Souple sans PVC 1000ml pour Perfusion',
    forme: 'Poche 1000ml',
    programme: 'PROG-INFECTIEUX',
    stockActuelHubOwendo: 38000,
    stockActuelAntennesTotal: 16500,
    stockTotalNational: 54500,
    cmmStandard: 18000,
    coeffSaisonPluie: 1.30,
    cmmAjustee: 23400,
    autonomieMois: 2.3,
    dateEpuisementTheorique: '28/11/2026',
    seuilAlerteMois: 3.5,
    statutAlerte: 'ATTENTION_COMMANDE_REQUISE',
    recommandation: 'Augmenter la cadence de livraison conteneurs maritimes 40 pieds (Solutés massifs de perfusion).',
    valeurUnitaireXaf: 1100
  },
  {
    id: 'DCI-WATCH-05',
    codeDci: 'MED-MNT-005',
    designation: 'Insuline Humaine NPH 100 UI/ml Suspension Injectable 10ml (2°C-8°C)',
    forme: 'Flacon 10ml',
    programme: 'PROG-MNT',
    stockActuelHubOwendo: 14500,
    stockActuelAntennesTotal: 6800,
    stockTotalNational: 21300,
    cmmStandard: 3800,
    coeffSaisonPluie: 1.0,
    cmmAjustee: 3800,
    autonomieMois: 5.6,
    dateEpuisementTheorique: '05/03/2027',
    seuilAlerteMois: 3.0,
    statutAlerte: 'OPTIMAL_SECURITE',
    recommandation: 'Niveau d\'autonomie conforme aux recommandations de l\'Association Gabonaise des Diabétiques.',
    valeurUnitaireXaf: 4800
  },
  {
    id: 'DCI-WATCH-06',
    codeDci: 'MED-URG-006',
    designation: 'Sérum Antivenimeux Inoserp Panafricain (Morsures de Serpents)',
    forme: 'Flacon injectable (Froid 2-8°C)',
    programme: 'PROG-URGENCES-REANIM',
    stockActuelHubOwendo: 1200,
    stockActuelAntennesTotal: 650,
    stockTotalNational: 1850,
    cmmStandard: 320,
    coeffSaisonPluie: 1.25,
    cmmAjustee: 400,
    autonomieMois: 4.6,
    dateEpuisementTheorique: '02/02/2027',
    seuilAlerteMois: 4.0,
    statutAlerte: 'SURVEILLANCE_FORESTIERE',
    recommandation: 'Maintenir la dotation prioritaire des antennes Ogooué-Ivindo, Ngounié et Woleu-Ntem.',
    valeurUnitaireXaf: 68000
  }
];

export const RESERVES_STRATEGIQUES_ETAT = [
  {
    id: 'RSSE-PALU-01',
    code: 'RSSE-PALU-CRISE',
    intitule: 'Réserve Stratégique Nationale de Riposte Palustre',
    localisation: 'Hub Central d\'Owendo (Zone A et Zone B Froid)',
    statutLegal: 'INVIOLABLE_ARRETE_MINISTERIEL',
    valeurEstimeeXaf: 850000000,
    conditionsMobilisation: 'Déclenchement officiel par le Ministre de la Santé ou Directeur Général OPN en cas d\'épidémie palustre déclarée.',
    composition: [
      { dci: 'Artésunate injectable 60mg', quantiteReservee: 50000, quantiteMobilisee: 0, uom: 'Flacons' },
      { dci: 'Artéméther + Luméfantrine 20/120mg (Boîtes 24)', quantiteReservee: 120000, quantiteMobilisee: 0, uom: 'Boîtes' },
      { dci: 'Tests TDR Paludisme Pf/Pan', quantiteReservee: 150000, quantiteMobilisee: 0, uom: 'Tests' },
    ]
  },
  {
    id: 'RSSE-CHOL-02',
    code: 'RSSE-CHOLERA-EAU',
    intitule: 'Réserve Nationale d\'Urgence Choléra & Diarrhées Aiguës',
    localisation: 'Hub Central d\'Owendo (Zone C Solutés) & Antenne Lambaréné',
    statutLegal: 'INVIOLABLE_ARRETE_MINISTERIEL',
    valeurEstimeeXaf: 620000000,
    conditionsMobilisation: 'Alerte COD niveau 2 ou inondations majeures bassins fluviaux.',
    composition: [
      { dci: 'Ringer Lactate poche 1000ml', quantiteReservee: 60000, quantiteMobilisee: 0, uom: 'Poches' },
      { dci: 'Sels de Réhydratation Orale (SRO) sachet 1L', quantiteReservee: 100000, quantiteMobilisee: 0, uom: 'Sachets' },
      { dci: 'Comprimés de purification d\'eau Aquatabs', quantiteReservee: 500000, quantiteMobilisee: 0, uom: 'Comprimés' },
      { dci: 'Doxycycline 100mg gélules', quantiteReservee: 30000, quantiteMobilisee: 0, uom: 'Gélules' },
    ]
  },
  {
    id: 'RSSE-MPOX-03',
    code: 'RSSE-PANDEMIE-EPI',
    intitule: 'Réserve Stratégique Sécurité Biologique & Mpox / Fièvres Virales',
    localisation: 'Hub Central d\'Owendo (Zone Sécurisée)',
    statutLegal: 'INVIOLABLE_ARRETE_MINISTERIEL',
    valeurEstimeeXaf: 980000000,
    conditionsMobilisation: 'Coordination Opérationnelle Défense Sanitaire (COD) / OMS.',
    composition: [
      { dci: 'Combinaisons intégrales étanches de protection biologique (Cat. III)', quantiteReservee: 15000, quantiteMobilisee: 2500, uom: 'Unités' },
      { dci: 'Masques FFP2 / FFP3 haute filtration (Boîtes de 50)', quantiteReservee: 8000, quantiteMobilisee: 1200, uom: 'Boîtes' },
      { dci: 'Gel Hydroalcoolique flacon pompe 1L', quantiteReservee: 25000, quantiteMobilisee: 4000, uom: 'Flacons' },
      { dci: 'Vaccin Variole/Mpox (Stock Cryogénique -20°C)', quantiteReservee: 5000, quantiteMobilisee: 800, uom: 'Doses' },
    ]
  },
  {
    id: 'RSSE-SERUM-04',
    code: 'RSSE-SEROTHERAPIE',
    intitule: 'Réserve Nationale d\'Urgence de Sérothérapie Spéciale',
    localisation: 'Hub Central d\'Owendo (Zone B Chambre Froide 2°C-8°C)',
    statutLegal: 'INVIOLABLE_ARRETE_MINISTERIEL',
    valeurEstimeeXaf: 400000000,
    conditionsMobilisation: 'Déploiement d\'urgence par hélicoptère ou convoi rapide COD.',
    composition: [
      { dci: 'Sérum Antivenimeux Inoserp Panafricain 2°C-8°C', quantiteReservee: 3500, quantiteMobilisee: 0, uom: 'Flacons' },
      { dci: 'Sérum Antitétanique 1500 UI injectable', quantiteReservee: 10000, quantiteMobilisee: 0, uom: 'Ampoules' },
      { dci: 'Immunoglobulines Antirabiques humaines', quantiteReservee: 1200, quantiteMobilisee: 0, uom: 'Flacons' },
    ]
  }
];

export const PLANS_APPROVISIONNEMENT_ANNUELS = [
  {
    id: 'PNA-2026-2027',
    reference: 'OPN-PNA-2026-2027',
    anneeFiscale: 'Exercice Budgétaire 2026-2027',
    dateAdoption: '15/01/2026',
    statut: 'VALIDE_MINISTERE',
    montantGlobalXaf: 18500000000,
    montantEngageXaf: 13875000000,
    tranches: [
      { trimestre: 'T1 (Jan-Mar 2026)', montantPrevuXaf: 4625000000, montantExecuteXaf: 4625000000, statut: 'CLOTURE_100%' },
      { trimestre: 'T2 (Avr-Jui 2026)', montantPrevuXaf: 4625000000, montantExecuteXaf: 4625000000, statut: 'CLOTURE_100%' },
      { trimestre: 'T3 (Juil-Sep 2026)', montantPrevuXaf: 4625000000, montantExecuteXaf: 4625000000, statut: 'EN_COURS_EXECUTION' },
      { trimestre: 'T4 (Oct-Dec 2026)', montantPrevuXaf: 4625000000, montantExecuteXaf: 0, statut: 'PROGRAMME_AO' },
    ]
  }
];
