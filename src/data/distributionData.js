/**
 * Données de Référence — Module 6 : Distribution Régionale du Dernier Kilomètre
 * Office Pharmaceutique National (OPN Gabon)
 * 
 * Couvre les 9 provinces, les dispensaires ruraux isolés, la flotte multimodale
 * (4x4, pirogues fluviales, glacières passives), les kits sanitaires d'urgence et les tournées.
 */

export const DISTRIBUTION_KPIS = {
  dispensairesDesservis: 148,
  totalDispensairesCibles: 162,
  tauxCouvertureTerritoriale: 91.4,
  tourneesActives: 7,
  tourneesClotureesMois: 24,
  kmPisteParcourusMois: 14850,
  milesNautiquesParcourusMois: 1920,
  kitsDistribuesMois: 340,
  incidentsPisteEnCours: 2,
  glacieresActivesEnRoute: 18,
};

export const PROVINCES_AXES = [
  {
    id: 'G1',
    nom: 'Estuaire',
    chefLieu: 'Libreville',
    antenneCentrale: 'Antenne Provinciale de l\'Estuaire (Owendo)',
    nbDispensaires: 14,
    tauxCouverture: 96.0,
    axesPrincipaux: [
      { id: 'AXE-EST-01', nom: 'Axe Ntoum → Kango → Donguila', type: 'TERRESTRE_4X4', distanceKm: 145, etatPiste: 'BON' },
      { id: 'AXE-EST-02', nom: 'Axe Estuaire Fluvial Cocobeach → Pointe Denis', type: 'MARITIME_CHALOUPE', distanceKm: 85, etatPiste: 'VAGUES_MODEREES' },
    ]
  },
  {
    id: 'G2',
    nom: 'Haut-Ogooué',
    chefLieu: 'Franceville',
    antenneCentrale: 'Antenne Provinciale de Franceville',
    nbDispensaires: 22,
    tauxCouverture: 92.5,
    axesPrincipaux: [
      { id: 'AXE-HO-01', nom: 'Axe Franceville → Moanda → Bakoumba', type: 'TERRESTRE_4X4', distanceKm: 165, etatPiste: 'LATÉRITE_CORRECTE' },
      { id: 'AXE-HO-02', nom: 'Axe Franceville → Boumango → Léconi', type: 'TERRESTRE_4X4', distanceKm: 190, etatPiste: 'SABLE_PLATEAU' },
      { id: 'AXE-HO-03', nom: 'Axe Fluvial Ogooué Amont : Franceville → Poubara', type: 'FLUVIAL_PIROGUE', distanceKm: 45, etatPiste: 'NAVIGABLE' },
    ]
  },
  {
    id: 'G3',
    nom: 'Moyen-Ogooué',
    chefLieu: 'Lambaréné',
    antenneCentrale: 'Antenne Provinciale de Lambaréné',
    nbDispensaires: 18,
    tauxCouverture: 89.0,
    axesPrincipaux: [
      { id: 'AXE-MO-01', nom: 'Axe Fluvial Lacs du Sud (Lac Zilé, Lac Onangué, Ashuka)', type: 'FLUVIAL_PIROGUE', distanceKm: 110, etatPiste: 'RAPIDES_MODERES' },
      { id: 'AXE-MO-02', nom: 'Axe Fluvial Ogooué Moyen : Lambaréné → Ndjolé Amont', type: 'FLUVIAL_PIROGUE', distanceKm: 135, etatPiste: 'COURANT_FORT' },
      { id: 'AXE-MO-03', nom: 'Axe Terrestre Lambaréné → Bifoun → Ndjolé', type: 'TERRESTRE_4X4', distanceKm: 125, etatPiste: 'LATÉRITE_DEGRADEE' },
    ]
  },
  {
    id: 'G4',
    nom: 'Ngounié',
    chefLieu: 'Mouila',
    antenneCentrale: 'Antenne Provinciale de Mouila',
    nbDispensaires: 24,
    tauxCouverture: 88.0,
    axesPrincipaux: [
      { id: 'AXE-NGO-01', nom: 'Axe Mouila → Ndendé → Doussala (Frontière Congo)', type: 'TERRESTRE_4X4', distanceKm: 155, etatPiste: 'BOURBIERS_FREQUENTS' },
      { id: 'AXE-NGO-02', nom: 'Axe Mouila → Mbigou → Mimongo (Massif du Chaillu)', type: 'TERRESTRE_4X4', distanceKm: 210, etatPiste: 'PISTE_FORESTIERE_MONTAGNE' },
      { id: 'AXE-NGO-03', nom: 'Axe Fluvial Ngounié : Mouila → Sindara → Fougamou', type: 'FLUVIAL_PIROGUE', distanceKm: 95, etatPiste: 'NAVIGABLE' },
    ]
  },
  {
    id: 'G5',
    nom: 'Nyanga',
    chefLieu: 'Tchibanga',
    antenneCentrale: 'Antenne Provinciale de Tchibanga',
    nbDispensaires: 16,
    tauxCouverture: 86.5,
    axesPrincipaux: [
      { id: 'AXE-NY-01', nom: 'Axe Tchibanga → Moabi → Mourindi', type: 'TERRESTRE_4X4', distanceKm: 140, etatPiste: 'PONT_BOIS_FRAGILE' },
      { id: 'AXE-NY-02', nom: 'Axe Côtier Tchibanga → Mayumba → Mabanda', type: 'TERRESTRE_4X4', distanceKm: 125, etatPiste: 'BAC_MAYUMBA_OBLIGATOIRE' },
      { id: 'AXE-NY-03', nom: 'Axe Fluvial Nyanga Aval : Tchibanga → Lagune Banio', type: 'FLUVIAL_PIROGUE', distanceKm: 80, etatPiste: 'NAVIGABLE' },
    ]
  },
  {
    id: 'G6',
    nom: 'Ogooué-Ivindo',
    chefLieu: 'Makokou',
    antenneCentrale: 'Antenne Provinciale de Makokou',
    nbDispensaires: 20,
    tauxCouverture: 90.0,
    axesPrincipaux: [
      { id: 'AXE-OI-01', nom: 'Axe Makokou → Ovan → Booué (Ligne Transgabonais)', type: 'TERRESTRE_4X4', distanceKm: 220, etatPiste: 'LATÉRITE_LOURDE' },
      { id: 'AXE-OI-02', nom: 'Axe Nord Makokou → Mékambo (Extrême Est)', type: 'TERRESTRE_4X4', distanceKm: 175, etatPiste: 'PISTE_FOREST_ISOLEE' },
      { id: 'AXE-OI-03', nom: 'Axe Fluvial Ivindo : Makokou → Chutes Kongou (Poste Avancé)', type: 'FLUVIAL_PIROGUE', distanceKm: 65, etatPiste: 'PORTAGES_PIROGUE' },
    ]
  },
  {
    id: 'G7',
    nom: 'Ogooué-Lolo',
    chefLieu: 'Koula-Moutou',
    antenneCentrale: 'Antenne Provinciale de Koula-Moutou',
    nbDispensaires: 15,
    tauxCouverture: 87.5,
    axesPrincipaux: [
      { id: 'AXE-OL-01', nom: 'Axe Koula-Moutou → Lastoursville → Pana', type: 'TERRESTRE_4X4', distanceKm: 180, etatPiste: 'RELIEF_ACCIDENTE' },
      { id: 'AXE-OL-02', nom: 'Axe Koula-Moutou → Iboundji (Piémont Mont Iboundji)', type: 'TERRESTRE_4X4', distanceKm: 95, etatPiste: 'PISTE_LATÉRITE' },
    ]
  },
  {
    id: 'G8',
    nom: 'Ogooué-Maritime',
    chefLieu: 'Port-Gentil',
    antenneCentrale: 'Antenne Provinciale de Port-Gentil',
    nbDispensaires: 15,
    tauxCouverture: 94.0,
    axesPrincipaux: [
      { id: 'AXE-OM-01', nom: 'Axe Maritime & Lagunaire Port-Gentil → Omboué → Setté Cama', type: 'MARITIME_CHALOUPE', distanceKm: 195, etatPiste: 'LAGUNE_FERNAND_VAZ' },
      { id: 'AXE-OM-02', nom: 'Axe Fluvial Delta Ogooué : Port-Gentil → Batanga → Mpaga', type: 'FLUVIAL_PIROGUE', distanceKm: 110, etatPiste: 'MANGROVE_LABYRINTHE' },
    ]
  },
  {
    id: 'G9',
    nom: 'Woleu-Ntem',
    chefLieu: 'Oyem',
    antenneCentrale: 'Antenne Provinciale d\'Oyem',
    nbDispensaires: 18,
    tauxCouverture: 93.0,
    axesPrincipaux: [
      { id: 'AXE-WN-01', nom: 'Axe Grand Nord : Oyem → Bitam → Meyo Kyé (3 Frontières)', type: 'TERRESTRE_4X4', distanceKm: 115, etatPiste: 'BITUME_ET_PISTE' },
      { id: 'AXE-WN-02', nom: 'Axe Est Woleu : Oyem → Minvoul → Bolossoville', type: 'TERRESTRE_4X4', distanceKm: 185, etatPiste: 'PISTE_FORESTIERE_DENSE' },
      { id: 'AXE-WN-03', nom: 'Axe Sud Woleu : Oyem → Mitzic → Sam', type: 'TERRESTRE_4X4', distanceKm: 140, etatPiste: 'LATÉRITE_CORRECTE' },
    ]
  }
];

export const FLOTTE_MULTIMODALE = [
  {
    id: 'VEH-4X4-01',
    type: 'TERRESTRE_4X4',
    designation: 'Toyota Hilux Double Cabine 4x4 Heavy-Duty OPN',
    immatriculation: '11-OPN-442-GA',
    antenneRattachement: 'Antenne de Lambaréné (Moyen-Ogooué)',
    capaciteChargeKg: 1100,
    capaciteVolumeM3: 3.5,
    equipementsFroid: '2x Glacières Passives Dometic Cool-Ice 110L (+2°C/+8°C)',
    statut: 'EN_ROUTE',
    chauffeurAssigne: 'M. Pierre OBIANG NGUEMA',
    compteurKm: 78420,
    dernierEntretien: '12/08/2026',
    prochaineVidangeKm: 85000,
    carburantNiveau: '85%',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'VEH-4X4-02',
    type: 'TERRESTRE_4X4',
    designation: 'Toyota Land Cruiser HZJ79 Plateau Renforcé OPN',
    immatriculation: '11-OPN-508-GA',
    antenneRattachement: 'Antenne de Makokou (Ogooué-Ivindo)',
    capaciteChargeKg: 1450,
    capaciteVolumeM3: 4.8,
    equipementsFroid: '3x Glacières B-Medical Systems 80L avec enregistreur USB',
    statut: 'DISPONIBLE',
    chauffeurAssigne: 'M. Jean-Félix MVOULA',
    compteurKm: 112300,
    dernierEntretien: '01/09/2026',
    prochaineVidangeKm: 120000,
    carburantNiveau: '100%',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'VEH-4X4-03',
    type: 'TERRESTRE_4X4',
    designation: 'Mercedes Unimog U4000 Tout-Terrain Spécial Forêt',
    immatriculation: '11-OPN-119-GA',
    antenneRattachement: 'Antenne de Mouila (Ngounié)',
    capaciteChargeKg: 3500,
    capaciteVolumeM3: 9.2,
    equipementsFroid: 'Caisson Frigorifique Autonome Solaire 450L (2°C-8°C)',
    statut: 'EN_ROUTE',
    chauffeurAssigne: 'M. Rodrigue BOUNGOUENDZA',
    compteurKm: 64150,
    dernierEntretien: '15/07/2026',
    prochaineVidangeKm: 75000,
    carburantNiveau: '68%',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'VEH-PIR-01',
    type: 'FLUVIAL_PIROGUE',
    designation: 'Pirogue Aluminium Renforcée 9m + Moteur Yamaha Enduro 60CV',
    immatriculation: 'PIR-OPN-MO-03',
    antenneRattachement: 'Antenne de Lambaréné (Moyen-Ogooué)',
    capaciteChargeKg: 950,
    capaciteVolumeM3: 3.0,
    equipementsFroid: '2x Caisses Isothermes Marinisées Apex Pharma 65L (72h Froid)',
    statut: 'EN_ROUTE',
    chauffeurAssigne: 'M. Michel NDONG BIYOGO (Piroguier Certifié)',
    compteurKm: 4200,
    dernierEntretien: '20/08/2026',
    prochaineVidangeKm: 5000,
    carburantNiveau: '90%',
    badgeColor: 'bg-teal-100 text-teal-800'
  },
  {
    id: 'VEH-PIR-02',
    type: 'FLUVIAL_PIROGUE',
    designation: 'Chaloupe Coque Fibre 11m + Bi-Moteur Yamaha 85CV Haute Mer / Lagune',
    immatriculation: 'CHAL-OPN-POG-01',
    antenneRattachement: 'Antenne de Port-Gentil (Ogooué-Maritime)',
    capaciteChargeKg: 1800,
    capaciteVolumeM3: 5.5,
    equipementsFroid: '3x Glacières Dometic Cool-Ice 150L + Télémétrie GPS/Temp',
    statut: 'DISPONIBLE',
    chauffeurAssigne: 'M. Patrick ROGOMBE (Patron Pêche & Navigation)',
    compteurKm: 3100,
    dernierEntretien: '28/08/2026',
    prochaineVidangeKm: 4000,
    carburantNiveau: '95%',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'VEH-4X4-04',
    type: 'TERRESTRE_4X4',
    designation: 'Toyota Hilux 4x4 Antenne Oyem (Grand Nord)',
    immatriculation: '11-OPN-733-GA',
    antenneRattachement: 'Antenne d\'Oyem (Woleu-Ntem)',
    capaciteChargeKg: 1050,
    capaciteVolumeM3: 3.2,
    equipementsFroid: '2x Glacières B-Medical 75L',
    statut: 'MAINTENANCE',
    chauffeurAssigne: 'M. Alain ONDO ELLA',
    compteurKm: 98120,
    dernierEntretien: '16/09/2026',
    prochaineVidangeKm: 100000,
    carburantNiveau: '40%',
    badgeColor: 'bg-rose-100 text-rose-800'
  }
];

export const KITS_SANITAIRES_CATALOGUE = [
  {
    id: 'KIT-SAN-01',
    code: 'KIT-ACCOUCH-URG',
    libelle: 'Kit d\'Accouchement d\'Urgence & Maternité Rurale (10 Accouchements)',
    destination: 'Dispensaires isolés, Cases de santé & Centres Médicaux sans bloc',
    poidsKg: 18.5,
    volumeM3: 0.08,
    temperatureStockage: '15°C à 25°C (Ambiant)',
    valeurXaf: 145000,
    contenu: [
      { dci: 'Oxytocine 10 UI/ml injectable (Pack Froid Isotherme)', quantite: 30, uom: 'Ampoules' },
      { dci: 'Gants chirurgicaux stériles à usage unique (Taille 7.5 et 8)', quantite: 50, uom: 'Paires' },
      { dci: 'Clamps ombilicaux de Barr stériles', quantite: 25, uom: 'Unités' },
      { dci: 'Compresses stériles 10x10cm (Boîte de 100)', quantite: 5, uom: 'Boîtes' },
      { dci: 'Povidone iodée dermique 10% flacon 250ml', quantite: 4, uom: 'Flacons' },
      { dci: 'Seringues stériles 5ml + aiguilles IM/IV', quantite: 40, uom: 'Unités' },
      { dci: 'Fil de suture résorbable Déc 3 (3/0) avec aiguille', quantite: 15, uom: 'Sachets' },
      { dci: 'Chlorhexidine solution antiseptique 0.5%', quantite: 3, uom: 'Flacons' },
    ]
  },
  {
    id: 'KIT-SAN-02',
    code: 'KIT-PALU-GRAVE',
    libelle: 'Kit Paludisme Grave & Diagnostic Rapide (Traitement 25 Cas Sévères)',
    destination: 'Tous dispensaires ruraux & postes avancés en zone d\'endémie',
    poidsKg: 12.0,
    volumeM3: 0.05,
    temperatureStockage: '15°C à 25°C (Ambiant)',
    valeurXaf: 198000,
    contenu: [
      { dci: 'Artésunate injectable 60mg poudre + solvant (Ampoules)', quantite: 75, uom: 'Flacons' },
      { dci: 'Tests de Diagnostic Rapide Paludisme Pf/Pan (Boîte de 25)', quantite: 4, uom: 'Boîtes' },
      { dci: 'Artéméther + Luméfantrine 20/120mg comprimés (Blister 24)', quantite: 35, uom: 'Boîtes' },
      { dci: 'Paracétamol sirop pédiatrique 120mg/5ml flacon', quantite: 20, uom: 'Flacons' },
      { dci: 'Paracétamol injectable 1g flacon 100ml', quantite: 25, uom: 'Flacons' },
      { dci: 'Soluté Glucosé 5% poche 500ml pour perfusion', quantite: 30, uom: 'Poches' },
      { dci: 'Tubulures de perfusion avec perfuseur et cathéters 22G/24G', quantite: 30, uom: 'Unités' },
    ]
  },
  {
    id: 'KIT-SAN-03',
    code: 'KIT-PEV-VACCIN',
    libelle: 'Kit Vaccinal PEV & Immunisation Nourrissons (Chaîne Froid 2°C-8°C)',
    destination: 'Centres de santé avec glacières autonomes & équipes mobiles',
    poidsKg: 8.5,
    volumeM3: 0.04,
    temperatureStockage: '+2°C à +8°C (Froid Strict — Glacière Dometic)',
    valeurXaf: 285000,
    contenu: [
      { dci: 'Vaccin BCG lyophilisé 20 doses + diluant', quantite: 10, uom: 'Flacons' },
      { dci: 'Vaccin Pentavalent (DTC-HepB-Hib) 10 doses', quantite: 20, uom: 'Flacons' },
      { dci: 'Vaccin Antirotavirus oral 1 dose', quantite: 40, uom: 'Tubes' },
      { dci: 'Vaccin Antirougeoleux-Rubéole 10 doses + diluant', quantite: 15, uom: 'Flacons' },
      { dci: 'Vaccin Antipoliomyélitique oral (VPO) 20 doses', quantite: 15, uom: 'Flacons' },
      { dci: 'Seringues autobloquantes 0.05ml et 0.5ml + Boîte de sécurité', quantite: 200, uom: 'Unités' },
    ]
  },
  {
    id: 'KIT-SAN-04',
    code: 'KIT-REHYD-DIARRH',
    libelle: 'Kit Réhydratation Aiguë & Lutte Antidiarrhéique / Choléra',
    destination: 'Villages fluviaux, bordures de fleuve & dispensaires isolés',
    poidsKg: 24.0,
    volumeM3: 0.12,
    temperatureStockage: '15°C à 25°C (Ambiant)',
    valeurXaf: 112000,
    contenu: [
      { dci: 'Sels de Réhydratation Orale (SRO) sachet pour 1L (Carton de 100)', quantite: 2, uom: 'Cartons' },
      { dci: 'Sulfate de Zinc 20mg comprimés dispersibles (Boîte de 100)', quantite: 8, uom: 'Boîtes' },
      { dci: 'Ringer Lactate poche de perfusion 1000ml', quantite: 35, uom: 'Poches' },
      { dci: 'Soluté Chlorure de Sodium 0.9% poche 500ml', quantite: 20, uom: 'Poches' },
      { dci: 'Pastilles de purification d\'eau Aquatabs (Boîte 100)', quantite: 15, uom: 'Boîtes' },
      { dci: 'Savon antiseptique liquide chirurgical flacon 1L', quantite: 6, uom: 'Flacons' },
    ]
  },
  {
    id: 'KIT-SAN-05',
    code: 'KIT-URG-TRAUMA',
    libelle: 'Kit Traumatologie, Morsures de Serpent & Urgences Blessés',
    destination: 'Postes forestiers, zones d\'exploitation bois & dispensaires ruraux',
    poidsKg: 15.0,
    volumeM3: 0.07,
    temperatureStockage: '+2°C à +8°C (Sérums antivenimeux)',
    valeurXaf: 460000,
    contenu: [
      { dci: 'Sérum Antivenimeux polyvalent Inoserp Panafricain (Froid 2-8°C)', quantite: 6, uom: 'Flacons' },
      { dci: 'Sérum Antitétanique 1500 UI injectable (Froid 2-8°C)', quantite: 20, uom: 'Ampoules' },
      { dci: 'Bandes extensibles crêpe 10cm x 4m (Lot de 10)', quantite: 10, uom: 'Lots' },
      { dci: 'Pansements compressifs stériles d\'urgence', quantite: 25, uom: 'Unités' },
      { dci: 'Lidocaïne 2% flacon 20ml injectable pour anesthésie locale', quantite: 10, uom: 'Flacons' },
      { dci: 'Boîte de petite chirurgie (Pinces, ciseaux, porte-aiguille inox)', quantite: 2, uom: 'Sets' },
      { dci: 'Tramadol injectable 100mg ampoules', quantite: 30, uom: 'Ampoules' },
    ]
  }
];

export const TOURNEES_EN_COURS = [
  {
    id: 'TRN-2026-089',
    reference: 'OPN-TRN-MO-2026-089',
    intitule: 'Rotation Fluviale Moyen-Ogooué : Lambaréné → Lacs du Sud (Lac Zilé / Ashuka / Onangué)',
    provinceId: 'G3',
    provinceNom: 'Moyen-Ogooué',
    typeVecteur: 'FLUVIAL_PIROGUE',
    vehiculeAssigne: 'Pirogue Aluminium OPN 9m (PIR-OPN-MO-03)',
    moteur: 'Yamaha Enduro 60CV',
    equipage: 'M. Michel NDONG BIYOGO (Piroguier) & M. Arnauld MAPANGOU (Convoyeur Pharma)',
    dateDepart: '16/09/2026 06:30',
    dateRetourPrevue: '18/09/2026 17:00',
    distancePrevue: '110 Miles Nautiques',
    statut: 'EN_ROUTE',
    progressionPourcent: 65,
    poidsTotalKg: 420,
    valeurMarchandiseXaf: 3450000,
    glacieresSuivies: [
      { id: 'GLAC-MO-01', type: 'Apex Pharma 65L', tempActuelle: '+4.8°C', tempMin: '+3.2°C', tempMax: '+5.6°C', statut: 'CONFORME' },
      { id: 'GLAC-MO-02', type: 'Apex Pharma 65L', tempActuelle: '+4.1°C', tempMin: '+2.9°C', tempMax: '+5.1°C', statut: 'CONFORME' }
    ],
    etapes: [
      { ordre: 1, structure: 'Départ Quai Antenne Provinciale OPN Lambaréné', type: 'DEPART', heurePrevue: '16/09 06:30', heureReelle: '16/09 06:45', statut: 'EFFECTUE', observations: 'Chargement vérifié et scellés apposés.' },
      { ordre: 2, structure: 'Dispensaire Fluvial de Lac Zilé', type: 'LIVRAISON', heurePrevue: '16/09 11:30', heureReelle: '16/09 12:00', statut: 'EFFECTUE', kits: ['1x KIT-ACCOUCH-URG', '2x KIT-PALU-GRAVE', '1x KIT-PEV-VACCIN'], recepteur: 'Infirmier Chef de Poste : M. Marc ESSONE', dechargeSignee: true },
      { ordre: 3, structure: 'Case de Santé Rurale d\'Ashuka', type: 'LIVRAISON', heurePrevue: '17/09 09:00', heureReelle: '17/09 09:40', statut: 'EFFECTUE', kits: ['1x KIT-PALU-GRAVE', '1x KIT-REHYD-DIARRH'], recepteur: 'Accoucheuse Rurale : Mme Berthe NGOLET', dechargeSignee: true },
      { ordre: 4, structure: 'Poste Médical Avancé de Mission Onangué', type: 'LIVRAISON', heurePrevue: '17/09 15:30', heureReelle: null, statut: 'EN_APPROCHE', kits: ['1x KIT-ACCOUCH-URG', '2x KIT-PALU-GRAVE', '1x KIT-URG-TRAUMA', '1x KIT-PEV-VACCIN'], recepteur: 'Dr. Thierry NZE (Médecin Mission)', dechargeSignee: false },
      { ordre: 5, structure: 'Retour & Débriefing Quai OPN Lambaréné', type: 'ARRIVEE', heurePrevue: '18/09 17:00', heureReelle: null, statut: 'PROGRAMME', observations: 'Rapatriement des fiches de décharge et thermoboutons.' }
    ]
  },
  {
    id: 'TRN-2026-090',
    reference: 'OPN-TRN-OI-2026-090',
    intitule: 'Mission Piste Latérite Ogooué-Ivindo : Makokou → Ovan → Booué (Dernier Kilomètre)',
    provinceId: 'G6',
    provinceNom: 'Ogooué-Ivindo',
    typeVecteur: 'TERRESTRE_4X4',
    vehiculeAssigne: 'Toyota Land Cruiser HZJ79 (11-OPN-508-GA)',
    moteur: '4.2L Diesel 4x4 Tropicalisé',
    equipage: 'M. Jean-Félix MVOULA (Chauffeur Piste) & M. Rodrigue NGOUA (Agent OPN)',
    dateDepart: '17/09/2026 05:00',
    dateRetourPrevue: '19/09/2026 18:00',
    distancePrevue: '240 km de piste latérite',
    statut: 'EN_ROUTE',
    progressionPourcent: 40,
    poidsTotalKg: 780,
    valeurMarchandiseXaf: 6890000,
    glacieresSuivies: [
      { id: 'GLAC-OI-01', type: 'B-Medical Systems 80L', tempActuelle: '+3.9°C', tempMin: '+2.5°C', tempMax: '+4.8°C', statut: 'CONFORME' },
      { id: 'GLAC-OI-02', type: 'B-Medical Systems 80L', tempActuelle: '+5.2°C', tempMin: '+3.1°C', tempMax: '+5.8°C', statut: 'CONFORME' }
    ],
    etapes: [
      { ordre: 1, structure: 'Départ Magasin Antenne OPN Makokou', type: 'DEPART', heurePrevue: '17/09 05:00', heureReelle: '17/09 05:15', statut: 'EFFECTUE', observations: 'Scellés posés sous contrôle du Chef Antenne.' },
      { ordre: 2, structure: 'Franchissement Bac Fluvial de l\'Ivindo', type: 'JALON_LOGISTIQUE', heurePrevue: '17/09 07:30', heureReelle: '17/09 08:15', statut: 'EFFECTUE', observations: 'Attente du bac 45 min en raison de la brume matinale.' },
      { ordre: 3, structure: 'Dispensaire Rural d\'Ovan Centre', type: 'LIVRAISON', heurePrevue: '17/09 11:00', heureReelle: '17/09 11:30', statut: 'EFFECTUE', kits: ['2x KIT-PALU-GRAVE', '1x KIT-ACCOUCH-URG', '1x KIT-PEV-VACCIN', '2x KIT-REHYD-DIARRH'], recepteur: 'Major Infirmier : M. Sylvain BIYOGHO', dechargeSignee: true },
      { ordre: 4, structure: 'Poste de Santé Villageois de Koumameyong', type: 'LIVRAISON', heurePrevue: '17/09 16:00', heureReelle: null, statut: 'EN_APPROCHE', kits: ['1x KIT-PALU-GRAVE', '1x KIT-URG-TRAUMA'], recepteur: 'Infirmier de Poste : M. Serge MEBALE', dechargeSignee: false },
      { ordre: 5, structure: 'Centre Médical avec Antenne Chirurgicale de Booué', type: 'LIVRAISON', heurePrevue: '18/09 10:00', heureReelle: null, statut: 'PROGRAMME', kits: ['3x KIT-PALU-GRAVE', '2x KIT-ACCOUCH-URG', '2x KIT-URG-TRAUMA', '2x KIT-PEV-VACCIN'], recepteur: 'Médecin Chef : Dr. Viviane ONDO', dechargeSignee: false },
      { ordre: 6, structure: 'Retour Antenne Makokou', type: 'ARRIVEE', heurePrevue: '19/09 18:00', heureReelle: null, statut: 'PROGRAMME', observations: 'Archivage des émargements originaux.' }
    ]
  },
  {
    id: 'TRN-2026-091',
    reference: 'OPN-TRN-NGO-2026-091',
    intitule: 'Axe Sud Piste Forestière Ngounié : Mouila → Ndendé → Doussala (Frontière)',
    provinceId: 'G4',
    provinceNom: 'Ngounié',
    typeVecteur: 'TERRESTRE_4X4',
    vehiculeAssigne: 'Mercedes Unimog U4000 Spécial Forêt (11-OPN-119-GA)',
    moteur: '4.8L Turbo Intercooler 4x4 Bloquant',
    equipage: 'M. Rodrigue BOUNGOUENDZA & M. Christian NZIENGUI',
    dateDepart: '17/09/2026 06:00',
    dateRetourPrevue: '18/09/2026 20:00',
    distancePrevue: '185 km',
    statut: 'EN_ROUTE',
    progressionPourcent: 30,
    poidsTotalKg: 1250,
    valeurMarchandiseXaf: 9400000,
    glacieresSuivies: [
      { id: 'GLAC-NGO-01', type: 'Caisson Solaire 450L', tempActuelle: '+4.0°C', tempMin: '+2.8°C', tempMax: '+4.5°C', statut: 'CONFORME' }
    ],
    etapes: [
      { ordre: 1, structure: 'Départ Antenne Mouila', type: 'DEPART', heurePrevue: '17/09 06:00', heureReelle: '17/09 06:20', statut: 'EFFECTUE' },
      { ordre: 2, structure: 'Centre Médical de Ndendé', type: 'LIVRAISON', heurePrevue: '17/09 09:30', heureReelle: '17/09 10:00', statut: 'EFFECTUE', kits: ['3x KIT-PALU-GRAVE', '2x KIT-ACCOUCH-URG'], recepteur: 'Dr. Joseph MOUELE', dechargeSignee: true },
      { ordre: 3, structure: 'Poste Frontière & Dispensaire de Doussala', type: 'LIVRAISON', heurePrevue: '17/09 15:00', heureReelle: null, statut: 'BLOQUE_BOURBIER', observations: 'Ralentissement au PK 42 : bourbier forestier en cours de franchissement avec treuil.', kits: ['2x KIT-PALU-GRAVE', '1x KIT-URG-TRAUMA', '1x KIT-PEV-VACCIN'], dechargeSignee: false },
      { ordre: 4, structure: 'Retour Antenne Mouila', type: 'ARRIVEE', heurePrevue: '18/09 20:00', heureReelle: null, statut: 'PROGRAMME' }
    ]
  },
  {
    id: 'TRN-2026-092',
    reference: 'OPN-TRN-OM-2026-092',
    intitule: 'Axe Lagunaire Fernand Vaz : Port-Gentil → Omboué → Setté Cama (Lagunes du Sud)',
    provinceId: 'G8',
    provinceNom: 'Ogooué-Maritime',
    typeVecteur: 'MARITIME_CHALOUPE',
    vehiculeAssigne: 'Chaloupe OPN 11m Bi-Moteur 85CV (CHAL-OPN-POG-01)',
    moteur: '2x Yamaha 85CV Hors-Bord Marinisés',
    equipage: 'M. Patrick ROGOMBE (Patron) & M. Félicien MBA (Convoyeur OPN)',
    dateDepart: '18/09/2026 06:00',
    dateRetourPrevue: '20/09/2026 16:00',
    distancePrevue: '195 Miles Nautiques',
    statut: 'PROGRAMME',
    progressionPourcent: 0,
    poidsTotalKg: 950,
    valeurMarchandiseXaf: 8200000,
    glacieresSuivies: [
      { id: 'GLAC-OM-01', type: 'Dometic Cool-Ice 150L', tempActuelle: '+4.0°C', statut: 'PREPARATION' }
    ],
    etapes: [
      { ordre: 1, structure: 'Départ Base Navale / Quai OPN Port-Gentil', type: 'DEPART', heurePrevue: '18/09 06:00', statut: 'PROGRAMME' },
      { ordre: 2, structure: 'Centre Médical d\'Omboué', type: 'LIVRAISON', heurePrevue: '18/09 11:30', statut: 'PROGRAMME', kits: ['2x KIT-ACCOUCH-URG', '3x KIT-PALU-GRAVE', '2x KIT-PEV-VACCIN'] },
      { ordre: 3, structure: 'Dispensaire Rural Isolé de Setté Cama', type: 'LIVRAISON', heurePrevue: '19/09 10:00', statut: 'PROGRAMME', kits: ['1x KIT-ACCOUCH-URG', '2x KIT-PALU-GRAVE', '1x KIT-URG-TRAUMA', '1x KIT-REHYD-DIARRH'] },
      { ordre: 4, structure: 'Retour Port-Gentil', type: 'ARRIVEE', heurePrevue: '20/09 16:00', statut: 'PROGRAMME' }
    ]
  }
];

export const INCIDENTS_PISTE_LOGS = [
  {
    id: 'INC-2026-014',
    tourneeRef: 'OPN-TRN-NGO-2026-091',
    province: 'Ngounié',
    axe: 'Axe Mouila → Ndendé → Doussala (PK 42)',
    typeIncident: 'BOURBIER_LATÉRITE',
    gravite: 'MOYENNE',
    dateHeure: '17/09/2026 13:15',
    vehicule: 'Mercedes Unimog (11-OPN-119-GA)',
    description: 'Affaissement de la piste de latérite suite à de fortes pluies orageuses. Camion embourbé au niveau des ponts de grumes. Utilisation du treuil mécanique avant et dépose de branchages.',
    impactChaineFroid: 'NUL (Caisson solaire autonome affiche +4.0°C stable)',
    statut: 'EN_COURS_DEGAGEMENT',
    actionCorrective: 'Treuillage autonome + assistance d\'un engin forestier de la Compagnie des Bois du Gabon (CBG). Retard estimé à 2h30 sur l\'étape Doussala.'
  },
  {
    id: 'INC-2026-013',
    tourneeRef: 'OPN-TRN-OI-2026-090',
    province: 'Ogooué-Ivindo',
    axe: 'Bac de l\'Ivindo (Traversée Makokou/Ovan)',
    typeIncident: 'ATTENTE_BAC_FLUVIAUX',
    gravite: 'FAIBLE',
    dateHeure: '17/09/2026 07:30',
    vehicule: 'Toyota Land Cruiser (11-OPN-508-GA)',
    description: 'Interruption temporaire des rotations du bac en raison d\'un banc de brume dense sur l\'Ivindo et de grumes dérivantes.',
    impactChaineFroid: 'NUL (Glacières B-Medical fermées scellées)',
    statut: 'RESOLU',
    actionCorrective: 'Reprise de la navigation à 08h15 après dissipation de la brume. Traversée réussie.'
  },
  {
    id: 'INC-2026-012',
    tourneeRef: 'OPN-TRN-MO-2026-085',
    province: 'Moyen-Ogooué',
    axe: 'Axe Lac Onangué (Pirogue PIR-OPN-MO-03)',
    typeIncident: 'HERBIERS_FLUVIAUX',
    gravite: 'FAIBLE',
    dateHeure: '14/09/2026 14:00',
    vehicule: 'Pirogue Alu 9m Yamaha 60CV',
    description: 'Obstruction de l\'hélice par des jacinthes d\'eau et herbiers flottants sur le chenal d\'accès au village Ashuka.',
    impactChaineFroid: 'NUL',
    statut: 'RESOLU',
    actionCorrective: 'Dégagement manuel de l\'hélice par le piroguier en 20 min. Arrivée à bon port.'
  }
];

export const DISPENSAIRES_REPERTOIRE = [
  { id: 'DSP-01', nom: 'Dispensaire Rural d\'Ovan Centre', province: 'Ogooué-Ivindo', acces: 'Piste 4x4 (110 km de Makokou)', populationDesservie: 3400, responsable: 'Infirmier Sylvain BIYOGHO', dotationMensuelleXaf: 1850000, statutFroid: 'Glacière Solaire OMS', dernierRavitaillement: '17/09/2026' },
  { id: 'DSP-02', nom: 'Dispensaire Fluvial de Lac Zilé', province: 'Moyen-Ogooué', acces: 'Pirogue Fluviale (35 MN de Lambaréné)', populationDesservie: 1850, responsable: 'Infirmier Marc ESSONE', dotationMensuelleXaf: 1200000, statutFroid: 'Frigo Gaz / Solaire', dernierRavitaillement: '16/09/2026' },
  { id: 'DSP-03', nom: 'Case de Santé Rurale d\'Ashuka', province: 'Moyen-Ogooué', acces: 'Pirogue Fluviale (55 MN de Lambaréné)', populationDesservie: 950, responsable: 'Accoucheuse Berthe NGOLET', dotationMensuelleXaf: 750000, statutFroid: 'Glacière Passive Eutectique', dernierRavitaillement: '17/09/2026' },
  { id: 'DSP-04', nom: 'Dispensaire de Doussala (Frontière)', province: 'Ngounié', acces: 'Piste Forestière 4x4 (185 km de Mouila)', populationDesservie: 2600, responsable: 'Infirmier Christian MAVOUNGOU', dotationMensuelleXaf: 1600000, statutFroid: 'Glacière Solaire Dometic', dernierRavitaillement: 'En cours (TRN-091)' },
  { id: 'DSP-05', nom: 'Dispensaire Isolé de Setté Cama', province: 'Ogooué-Maritime', acces: 'Chaloupe Maritime & Lagune (195 MN de Port-Gentil)', populationDesservie: 1400, responsable: 'Infirmière Pauline RETENO', dotationMensuelleXaf: 1950000, statutFroid: 'Frigo Solaire B-Medical', dernierRavitaillement: 'Prévu 19/09' },
  { id: 'DSP-06', nom: 'Dispensaire de Minvoul (Grand Nord)', province: 'Woleu-Ntem', acces: 'Piste Latérite (185 km d\'Oyem)', populationDesservie: 4100, responsable: 'Infirmier Chef Éric NGUEMA', dotationMensuelleXaf: 2200000, statutFroid: 'Frigo Solaire 12V', dernierRavitaillement: '10/09/2026' },
  { id: 'DSP-07', nom: 'Poste Médical de Moabi', province: 'Nyanga', acces: 'Piste Latérite (140 km de Tchibanga)', populationDesservie: 3800, responsable: 'Dr. Alain KOUMBA', dotationMensuelleXaf: 2400000, statutFroid: 'Frigo Solaire + Groupe', dernierRavitaillement: '12/09/2026' },
  { id: 'DSP-08', nom: 'Case de Santé de Bakoumba', province: 'Haut-Ogooué', acces: 'Piste & Route (165 km de Franceville)', populationDesservie: 2900, responsable: 'Infirmière Solange LEKOGO', dotationMensuelleXaf: 1450000, statutFroid: 'Glacière Passive OMS', dernierRavitaillement: '14/09/2026' },
];
