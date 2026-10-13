/**
 * Base de Données Publique & Citoyenne — Office Pharmaceutique National (OPN Gabon)
 * Module 8 : Disponibilité Publique, Mercuriale des Prix Plafonnés & Guichet Citoyen
 */

export const CITIZEN_MACRO_KPIS = {
  tauxDisponibiliteNationale: 93.8,
  structuresConnectees: 248,
  moleculesVitalesAuCatalogue: 185,
  delaiMoyenInstructionSignalementHeures: 18,
  tauxResolutionSignalements: 96.4,
  economieMoyennePatientTiersPayantPct: 82.5,
  numVertNationalGratuit: '1410 (Appel Gratuit OPN)',
  emailGuichetCitoyen: 'vigilance.citoyenne@opn.ga',
  derniereMajMercuriale: '15 Septembre 2026',
  decretReference: 'Décret N° 00412/PR/MS portant homologation de la Mercuriale Nationale des Médicaments Essentiels'
};

export const ESSENTIAL_MEDICINES_CATALOG = [
  {
    id: 'MED-001',
    dci: 'Artéméther + Luméfantrine (CTA)',
    nomCommercial: 'Coartem 20/120mg',
    classe: 'Paludisme & Parasitologie',
    forme: 'Comprimé dispersible',
    dosage: '20 mg / 120 mg (Boîte de 24)',
    indication: 'Traitement curatif de première intention du paludisme simple à P. falciparum chez l\'adulte et l\'enfant.',
    prixPlafondXAF: 1850,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 98.2,
    cnamgs: {
      fonds1_ge: { taux: 90, resteACharge: 185, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 370, label: 'Secteur Privé' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'Gabonais Économiquement Faibles (GEF)' },
      ald: { taux: 100, resteACharge: 0, label: 'Affection Longue Durée' },
      non_assure: { taux: 0, resteACharge: 1850, label: 'Non Assuré (Plein Tarif)' }
    },
    structuresDisponiblesCount: 242,
    priorite: 'VITALE'
  },
  {
    id: 'MED-002',
    dci: 'Artésunate Injectable',
    nomCommercial: 'Artesun 60mg IM/IV',
    classe: 'Paludisme & Parasitologie',
    forme: 'Flacon injectable + solvant',
    dosage: '60 mg / flacon (Boîte de 1)',
    indication: 'Traitement d\'urgence du paludisme grave et compliqué chez l\'adulte et l\'enfant (Recommandation OMS).',
    prixPlafondXAF: 2400,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 96.5,
    cnamgs: {
      fonds1_ge: { taux: 90, resteACharge: 240, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 480, label: 'Secteur Privé' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'GEF' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD' },
      non_assure: { taux: 0, resteACharge: 2400, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 228,
    priorite: 'VITALE'
  },
  {
    id: 'MED-003',
    dci: 'Oxytocine Injectable',
    nomCommercial: 'Syntocinon 10 UI/ml',
    classe: 'Santé Mère-Enfant & Maternité',
    forme: 'Ampoule injectable (2°C-8°C)',
    dosage: '10 UI / 1 ml (Boîte de 10)',
    indication: 'Prévention et traitement de l\'hémorragie du post-partum et induction du travail d\'accouchement.',
    prixPlafondXAF: 3200,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 95.0,
    cnamgs: {
      fonds1_ge: { taux: 100, resteACharge: 0, label: 'Maternité 100% Prise en Charge' },
      fonds2_prive: { taux: 100, resteACharge: 0, label: 'Maternité 100% Prise en Charge' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'Maternité GEF 100% Gratuite' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD' },
      non_assure: { taux: 0, resteACharge: 3200, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 235,
    priorite: 'VITALE'
  },
  {
    id: 'MED-004',
    dci: 'Amoxicilline + Acide Clavulanique',
    nomCommercial: 'Augmentin 1g/125mg',
    classe: 'Infectiologie & Antibiotiques',
    forme: 'Comprimé pelliculé',
    dosage: '1000 mg / 125 mg (Boîte de 16)',
    indication: 'Traitement des infections bactériennes des voies respiratoires, urinaires, cutanées et ORL.',
    prixPlafondXAF: 3800,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 92.4,
    cnamgs: {
      fonds1_ge: { taux: 80, resteACharge: 760, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 760, label: 'Secteur Privé' },
      fonds3_gef: { taux: 90, resteACharge: 380, label: 'GEF (10% Ticket Modérateur)' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD' },
      non_assure: { taux: 0, resteACharge: 3800, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 218,
    priorite: 'ESSENTIELLE'
  },
  {
    id: 'MED-005',
    dci: 'Ceftriaxone Injectable',
    nomCommercial: 'Rocephine 1g IV/IM',
    classe: 'Infectiologie & Antibiotiques',
    forme: 'Flacon injectable + solvant',
    dosage: '1 g / flacon (Boîte de 1)',
    indication: 'Infections bactériennes sévères (méningites, septicémies, pneumopathies aiguës).',
    prixPlafondXAF: 2950,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 94.1,
    cnamgs: {
      fonds1_ge: { taux: 90, resteACharge: 295, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 590, label: 'Secteur Privé' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'GEF' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD' },
      non_assure: { taux: 0, resteACharge: 2950, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 224,
    priorite: 'VITALE'
  },
  {
    id: 'MED-006',
    dci: 'Paracétamol Injectable',
    nomCommercial: 'Perfalgan 10mg/ml',
    classe: 'Analgésiques & Antipyrétiques',
    forme: 'Poche pour perfusion IV',
    dosage: '1000 mg / 100 ml (Poche de 100ml)',
    indication: 'Traitement de courte durée de la douleur modérée et de la fièvre chez le patient hospitalisé.',
    prixPlafondXAF: 1100,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 97.8,
    cnamgs: {
      fonds1_ge: { taux: 90, resteACharge: 110, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 220, label: 'Secteur Privé' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'GEF' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD' },
      non_assure: { taux: 0, resteACharge: 1100, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 245,
    priorite: 'ESSENTIELLE'
  },
  {
    id: 'MED-007',
    dci: 'Insuline Humaine Rapide',
    nomCommercial: 'Actrapid HM 100 UI/ml',
    classe: 'Cardiologie, Diabète & MNT',
    forme: 'Flacon injectable (2°C-8°C)',
    dosage: '100 UI / ml (Flacon 10 ml)',
    indication: 'Contrôle glycémique du diabète sucré de type 1 et décompensations acido-cétosiques.',
    prixPlafondXAF: 4500,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 91.5,
    cnamgs: {
      fonds1_ge: { taux: 100, resteACharge: 0, label: 'Prise en Charge 100% ALD/Diabète' },
      fonds2_prive: { taux: 100, resteACharge: 0, label: 'Prise en Charge 100% ALD/Diabète' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'Prise en Charge 100% ALD/Diabète' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD Diabète (0 FCFA)' },
      non_assure: { taux: 0, resteACharge: 4500, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 198,
    priorite: 'VITALE'
  },
  {
    id: 'MED-008',
    dci: 'Métformine Chlorhydrate',
    nomCommercial: 'Glucophage 850mg',
    classe: 'Cardiologie, Diabète & MNT',
    forme: 'Comprimé pelliculé',
    dosage: '850 mg (Boîte de 30)',
    indication: 'Traitement du diabète de type 2 chez l\'adulte en monothérapie ou en association.',
    prixPlafondXAF: 1650,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 96.0,
    cnamgs: {
      fonds1_ge: { taux: 100, resteACharge: 0, label: 'Prise en Charge 100% ALD Diabète' },
      fonds2_prive: { taux: 100, resteACharge: 0, label: 'Prise en Charge 100% ALD Diabète' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'Prise en Charge 100% ALD Diabète' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD Diabète (0 FCFA)' },
      non_assure: { taux: 0, resteACharge: 1650, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 236,
    priorite: 'ESSENTIELLE'
  },
  {
    id: 'MED-009',
    dci: 'Amlodipine Bésylate',
    nomCommercial: 'Amlor 5mg',
    classe: 'Cardiologie, Diabète & MNT',
    forme: 'Gélule',
    dosage: '5 mg (Boîte de 30)',
    indication: 'Traitement de l\'hypertension artérielle essentielle et angor stable.',
    prixPlafondXAF: 2100,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 95.3,
    cnamgs: {
      fonds1_ge: { taux: 90, resteACharge: 210, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 420, label: 'Secteur Privé' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'GEF' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD HTA (0 FCFA)' },
      non_assure: { taux: 0, resteACharge: 2100, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 230,
    priorite: 'ESSENTIELLE'
  },
  {
    id: 'MED-010',
    dci: 'Sérum Polyvalent Antivenimeux',
    nomCommercial: 'Inoserp Panafricain IV',
    classe: 'Urgences, Réanimation & Toxicologie',
    forme: 'Flacon injectable (2°C-8°C)',
    dosage: 'Flacon 10 ml (Boîte de 1)',
    indication: 'Envenimations graves par morsures de vipéridés et élapidés (crotales, cobras, mambas).',
    prixPlafondXAF: 28000,
    statutNational: 'SOUS_TENSION',
    tauxDispoNationalPct: 88.0,
    cnamgs: {
      fonds1_ge: { taux: 100, resteACharge: 0, label: 'Urgence Vitale 100% État' },
      fonds2_prive: { taux: 100, resteACharge: 0, label: 'Urgence Vitale 100% État' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'Urgence Vitale 100% État' },
      ald: { taux: 100, resteACharge: 0, label: 'Urgence Vitale (0 FCFA)' },
      non_assure: { taux: 80, resteACharge: 5600, label: 'Urgence Subventionnée État' }
    },
    structuresDisponiblesCount: 165,
    priorite: 'VITALE'
  },
  {
    id: 'MED-011',
    dci: 'Sels de Réhydratation Orale (SRO) + Zinc',
    nomCommercial: 'Kit SRO-Zinc Pédiatrique',
    classe: 'Gastro-entérologie & Pédiatrie',
    forme: 'Poudre pour solution buvable + cp',
    dosage: 'Sachet 20,5g + 10 cp Zinc 20mg',
    indication: 'Prévention et traitement de la déshydratation aiguë chez l\'enfant en bas âge lors des diarrhées.',
    prixPlafondXAF: 750,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 98.6,
    cnamgs: {
      fonds1_ge: { taux: 100, resteACharge: 0, label: 'Gratuité Pédiatrique SMI' },
      fonds2_prive: { taux: 100, resteACharge: 0, label: 'Gratuité Pédiatrique SMI' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'Gratuité Pédiatrique SMI' },
      ald: { taux: 100, resteACharge: 0, label: 'Gratuité 100%' },
      non_assure: { taux: 0, resteACharge: 750, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 247,
    priorite: 'VITALE'
  },
  {
    id: 'MED-012',
    dci: 'Ringer Lactate Soluté Massif',
    nomCommercial: 'Ringer Lactate 1000ml',
    classe: 'Urgences, Réanimation & Toxicologie',
    forme: 'Poche pour perfusion IV',
    dosage: '1000 ml (Poche souple)',
    indication: 'Remplissage vasculaire lors des états de choc hypovolémique, déshydratation sévère et chirurgie.',
    prixPlafondXAF: 1450,
    statutNational: 'DISPONIBLE',
    tauxDispoNationalPct: 96.8,
    cnamgs: {
      fonds1_ge: { taux: 90, resteACharge: 145, label: 'GE (Secteur Public)' },
      fonds2_prive: { taux: 80, resteACharge: 290, label: 'Secteur Privé' },
      fonds3_gef: { taux: 100, resteACharge: 0, label: 'GEF' },
      ald: { taux: 100, resteACharge: 0, label: 'ALD' },
      non_assure: { taux: 0, resteACharge: 1450, label: 'Non Assuré' }
    },
    structuresDisponiblesCount: 238,
    priorite: 'VITALE'
  }
];

export const PUBLIC_HEALTH_FACILITIES_DIRECTORY = [
  // 1. ESTUAIRE
  {
    id: 'FAC-EST-01',
    province: 'Estuaire',
    codeProvince: 'G1',
    ville: 'Libreville',
    nom: 'Centre Hospitalier Universitaire de Libreville (CHUL)',
    type: 'Centre Hospitalier Universitaire (CHU)',
    quartier: 'Centre-Ville / Boulevard Triomphal',
    telephone: '+241 11 72 20 00',
    contactGarde: '+241 66 12 34 56',
    horaires: '24h/24 (Urgences & Garde) — 07h30/16h30 (Guichet Ambulatoire)',
    tauxDisponibilitePanierPct: 97.4,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: 0.3924, lng: 9.4537 },
    stocksLive: {
      'MED-001': { quantite: 1850, statut: 'DISPONIBLE', maj: 'Il y a 10 min' },
      'MED-002': { quantite: 720, statut: 'DISPONIBLE', maj: 'Il y a 15 min' },
      'MED-003': { quantite: 450, statut: 'DISPONIBLE', maj: 'Il y a 20 min' },
      'MED-004': { quantite: 1200, statut: 'DISPONIBLE', maj: 'Il y a 5 min' },
      'MED-007': { quantite: 340, statut: 'DISPONIBLE', maj: 'Il y a 12 min' },
      'MED-010': { quantite: 45, statut: 'DISPONIBLE', maj: 'Il y a 30 min' },
    }
  },
  {
    id: 'FAC-EST-02',
    province: 'Estuaire',
    codeProvince: 'G1',
    ville: 'Owendo',
    nom: 'Centre Hospitalier Universitaire d\'Owendo (CHUO)',
    type: 'Centre Hospitalier Universitaire (CHU)',
    quartier: 'Zone Portuaire Owendo',
    telephone: '+241 11 70 30 10',
    contactGarde: '+241 66 22 44 88',
    horaires: '24h/24 (Traumatologie & Urgences)',
    tauxDisponibilitePanierPct: 96.8,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: 0.3012, lng: 9.4985 },
    stocksLive: {
      'MED-001': { quantite: 1400, statut: 'DISPONIBLE', maj: 'Il y a 25 min' },
      'MED-002': { quantite: 510, statut: 'DISPONIBLE', maj: 'Il y a 18 min' },
      'MED-006': { quantite: 2100, statut: 'DISPONIBLE', maj: 'Il y a 8 min' },
      'MED-012': { quantite: 1650, statut: 'DISPONIBLE', maj: 'Il y a 14 min' },
    }
  },
  {
    id: 'FAC-EST-03',
    province: 'Estuaire',
    codeProvince: 'G1',
    ville: 'Akanda',
    nom: 'Centre Hospitalier Universitaire Mère-Enfant (CHUMEFAT)',
    type: 'Centre Spécialisé Mère-Enfant',
    quartier: 'Akanda / Ambowé',
    telephone: '+241 11 45 60 70',
    contactGarde: '+241 62 10 20 30',
    horaires: '24h/24 (Maternité, Pédiatrie & Urgences)',
    tauxDisponibilitePanierPct: 98.1,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: 0.5123, lng: 9.4891 },
    stocksLive: {
      'MED-001': { quantite: 950, statut: 'DISPONIBLE', maj: 'Il y a 30 min' },
      'MED-003': { quantite: 820, statut: 'DISPONIBLE', maj: 'Il y a 10 min' },
      'MED-011': { quantite: 1800, statut: 'DISPONIBLE', maj: 'Il y a 5 min' },
    }
  },
  {
    id: 'FAC-EST-04',
    province: 'Estuaire',
    codeProvince: 'G1',
    ville: 'Ntoum',
    nom: 'Hôpital Départemental de Ntoum',
    type: 'Hôpital Départemental',
    quartier: 'Ntoum Centre',
    telephone: '+241 11 39 12 04',
    contactGarde: '+241 77 45 12 89',
    horaires: '24h/24 (Urgences) — 08h00/17h00 (Pharmacie)',
    tauxDisponibilitePanierPct: 92.5,
    statutStock: 'DISPONIBLE_MOYEN',
    coordonneesGps: { lat: 0.3891, lng: 9.7612 },
    stocksLive: {
      'MED-001': { quantite: 420, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
      'MED-002': { quantite: 85, statut: 'STOCK_LIMITE', maj: 'Il y a 40 min' },
      'MED-004': { quantite: 310, statut: 'DISPONIBLE', maj: 'Il y a 2 heures' },
    }
  },

  // 2. HAUT-OGOOUE
  {
    id: 'FAC-HOG-01',
    province: 'Haut-Ogooué',
    codeProvince: 'G2',
    ville: 'Franceville',
    nom: 'Centre Hospitalier Régional Amissa Bongo (CHR-AB)',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Poto-Poto / Franceville Plateau',
    telephone: '+241 11 67 01 23',
    contactGarde: '+241 66 88 99 00',
    horaires: '24h/24 (Urgences Régionales & Garde)',
    tauxDisponibilitePanierPct: 94.6,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: -1.6328, lng: 13.5836 },
    stocksLive: {
      'MED-001': { quantite: 1100, statut: 'DISPONIBLE', maj: 'Il y a 22 min' },
      'MED-002': { quantite: 320, statut: 'DISPONIBLE', maj: 'Il y a 45 min' },
      'MED-003': { quantite: 210, statut: 'DISPONIBLE', maj: 'Il y a 30 min' },
      'MED-007': { quantite: 180, statut: 'DISPONIBLE', maj: 'Il y a 15 min' },
      'MED-010': { quantite: 28, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
    }
  },
  {
    id: 'FAC-HOG-02',
    province: 'Haut-Ogooué',
    codeProvince: 'G2',
    ville: 'Moanda',
    nom: 'Hôpital de l\'Amitié Sino-Gabonaise de Moanda',
    type: 'Hôpital Départemental',
    quartier: 'Zone Commerciale Moanda',
    telephone: '+241 11 66 10 44',
    contactGarde: '+241 74 12 33 44',
    horaires: '24h/24 (Urgences Minières & Maternité)',
    tauxDisponibilitePanierPct: 93.2,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: -1.5623, lng: 13.2014 },
    stocksLive: {
      'MED-001': { quantite: 650, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
      'MED-004': { quantite: 410, statut: 'DISPONIBLE', maj: 'Il y a 2 heures' },
      'MED-008': { quantite: 280, statut: 'DISPONIBLE', maj: 'Il y a 30 min' },
    }
  },

  // 3. MOYEN-OGOOUE
  {
    id: 'FAC-MOG-01',
    province: 'Moyen-Ogooué',
    codeProvince: 'G3',
    ville: 'Lambaréné',
    nom: 'Centre Hospitalier Régional Georges Rawiri (CHR-GR)',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Adouma / Lambaréné Rive Gauche',
    telephone: '+241 11 58 11 20',
    contactGarde: '+241 65 33 22 11',
    horaires: '24h/24 (Urgences Fluviales & Garde)',
    tauxDisponibilitePanierPct: 92.8,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: -0.7001, lng: 10.2405 },
    stocksLive: {
      'MED-001': { quantite: 820, statut: 'DISPONIBLE', maj: 'Il y a 35 min' },
      'MED-002': { quantite: 190, statut: 'DISPONIBLE', maj: 'Il y a 50 min' },
      'MED-003': { quantite: 140, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
      'MED-010': { quantite: 18, statut: 'STOCK_LIMITE', maj: 'Il y a 2 heures' },
    }
  },

  // 4. NGOUNIE
  {
    id: 'FAC-NGO-01',
    province: 'Ngounié',
    codeProvince: 'G4',
    ville: 'Mouila',
    nom: 'Centre Hospitalier Régional de Mouila (CHR-M)',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Mouila Centre / Val Marie',
    telephone: '+241 11 86 14 02',
    contactGarde: '+241 77 11 22 33',
    horaires: '24h/24 (Urgences)',
    tauxDisponibilitePanierPct: 91.5,
    statutStock: 'DISPONIBLE_MOYEN',
    coordonneesGps: { lat: -1.8685, lng: 11.0559 },
    stocksLive: {
      'MED-001': { quantite: 740, statut: 'DISPONIBLE', maj: 'Il y a 40 min' },
      'MED-002': { quantite: 160, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
      'MED-007': { quantite: 95, statut: 'DISPONIBLE', maj: 'Il y a 3 heures' },
      'MED-010': { quantite: 14, statut: 'STOCK_LIMITE', maj: 'Il y a 2 heures' },
    }
  },

  // 5. NYANGA
  {
    id: 'FAC-NYA-01',
    province: 'Nyanga',
    codeProvince: 'G5',
    ville: 'Tchibanga',
    nom: 'Centre Hospitalier Régional Benjamin Ngoubou (CHR-BN)',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Tchibanga Plateau',
    telephone: '+241 11 87 20 15',
    contactGarde: '+241 62 44 55 66',
    horaires: '24h/24 (Urgences & Maternité)',
    tauxDisponibilitePanierPct: 90.2,
    statutStock: 'DISPONIBLE_MOYEN',
    coordonneesGps: { lat: -2.8500, lng: 11.0167 },
    stocksLive: {
      'MED-001': { quantite: 520, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
      'MED-002': { quantite: 110, statut: 'DISPONIBLE', maj: 'Il y a 2 heures' },
      'MED-003': { quantite: 85, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
    }
  },

  // 6. OGOOUE-IVINDO
  {
    id: 'FAC-OIV-01',
    province: 'Ogooué-Ivindo',
    codeProvince: 'G6',
    ville: 'Makokou',
    nom: 'Centre Hospitalier Régional Omar Bongo Ondimba de Makokou',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Makokou Centre',
    telephone: '+241 11 90 31 12',
    contactGarde: '+241 74 55 66 77',
    horaires: '24h/24 (Urgences & Garde)',
    tauxDisponibilitePanierPct: 89.8,
    statutStock: 'DISPONIBLE_MOYEN',
    coordonneesGps: { lat: 0.5638, lng: 12.8642 },
    stocksLive: {
      'MED-001': { quantite: 610, statut: 'DISPONIBLE', maj: 'Il y a 45 min' },
      'MED-002': { quantite: 140, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
      'MED-010': { quantite: 12, statut: 'STOCK_LIMITE', maj: 'Il y a 3 heures' },
    }
  },

  // 7. OGOOUE-LOLO
  {
    id: 'FAC-OLO-01',
    province: 'Ogooué-Lolo',
    codeProvince: 'G7',
    ville: 'Koula-Moutou',
    nom: 'Centre Hospitalier Régional Paul Moukambi de Koula-Moutou',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Koula-Moutou Plateau',
    telephone: '+241 11 65 10 20',
    contactGarde: '+241 66 33 44 55',
    horaires: '24h/24 (Urgences)',
    tauxDisponibilitePanierPct: 91.0,
    statutStock: 'DISPONIBLE_MOYEN',
    coordonneesGps: { lat: -1.1306, lng: 12.4736 },
    stocksLive: {
      'MED-001': { quantite: 580, statut: 'DISPONIBLE', maj: 'Il y a 50 min' },
      'MED-002': { quantite: 125, statut: 'DISPONIBLE', maj: 'Il y a 2 heures' },
      'MED-004': { quantite: 290, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
    }
  },

  // 8. OGOOUE-MARITIME
  {
    id: 'FAC-OMA-01',
    province: 'Ogooué-Maritime',
    codeProvince: 'G8',
    ville: 'Port-Gentil',
    nom: 'Centre Hospitalier Régional de Port-Gentil (CHR-POG)',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'N\'Tchengué / Port-Gentil',
    telephone: '+241 11 55 24 10',
    contactGarde: '+241 66 99 88 77',
    horaires: '24h/24 (Urgences Maritimes & Garde)',
    tauxDisponibilitePanierPct: 95.8,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: -0.7193, lng: 8.7815 },
    stocksLive: {
      'MED-001': { quantite: 1350, statut: 'DISPONIBLE', maj: 'Il y a 15 min' },
      'MED-002': { quantite: 480, statut: 'DISPONIBLE', maj: 'Il y a 20 min' },
      'MED-003': { quantite: 310, statut: 'DISPONIBLE', maj: 'Il y a 40 min' },
      'MED-007': { quantite: 240, statut: 'DISPONIBLE', maj: 'Il y a 10 min' },
      'MED-010': { quantite: 32, statut: 'DISPONIBLE', maj: 'Il y a 1 heure' },
    }
  },

  // 9. WOLEU-NTEM
  {
    id: 'FAC-WNT-01',
    province: 'Woleu-Ntem',
    codeProvince: 'G9',
    ville: 'Oyem',
    nom: 'Centre Hospitalier Régional d\'Oyem (CHR-O)',
    type: 'Centre Hospitalier Régional (CHR)',
    quartier: 'Akoakam / Oyem Centre',
    telephone: '+241 11 98 12 30',
    contactGarde: '+241 77 33 22 11',
    horaires: '24h/24 (Urgences des 3 Frontières)',
    tauxDisponibilitePanierPct: 93.9,
    statutStock: 'DISPONIBLE_HAUT',
    coordonneesGps: { lat: 1.5994, lng: 11.5794 },
    stocksLive: {
      'MED-001': { quantite: 920, statut: 'DISPONIBLE', maj: 'Il y a 25 min' },
      'MED-002': { quantite: 280, statut: 'DISPONIBLE', maj: 'Il y a 35 min' },
      'MED-003': { quantite: 190, statut: 'DISPONIBLE', maj: 'Il y a 55 min' },
      'MED-004': { quantite: 510, statut: 'DISPONIBLE', maj: 'Il y a 15 min' },
    }
  }
];

export const CITIZEN_REPORT_MOTIFS = [
  {
    id: 'RUPTURE_ANORMALE',
    label: 'Rupture de Stock Anormale au Guichet Public',
    desc: 'Le médicament vital est affiché disponible au catalogue mais refusé au guichet de dispensation hospitalière.',
    gravite: 'HAUTE',
    color: 'border-rose-500 text-rose-700 bg-rose-50'
  },
  {
    id: 'SURTARIFICATION',
    label: 'Surtarification Illégale (> Mercuriale Officielle)',
    desc: 'Le prix exigé au patient dépasse le Prix Public Plafonné (PPP) homologué par l\'État gabonais.',
    gravite: 'CRITIQUE',
    color: 'border-amber-500 text-amber-700 bg-amber-50'
  },
  {
    id: 'REFUS_CNAMGS',
    label: 'Refus Illégal de Prise en Charge CNAMGS',
    desc: 'L\'établissement ou l\'officine refuse d\'appliquer le tiers-payant conventionné CNAMGS sur ordonnance valide.',
    gravite: 'HAUTE',
    color: 'border-blue-500 text-blue-700 bg-blue-50'
  },
  {
    id: 'PRODUIT_ALTERE',
    label: 'Produit Altéré, Emballage Endommagé ou Douteux',
    desc: 'Suspicion de détérioration de la chaîne du froid, comprimés effrités, liquide trouble ou date effacée.',
    gravite: 'CRITIQUE',
    color: 'border-purple-500 text-purple-700 bg-purple-50'
  },
  {
    id: 'VENTE_ILLICITE',
    label: 'Vente Parallèle ou Détournement de Médicaments Gratuits',
    desc: 'Médicament estampillé "Dotation Gratuite OPN / État Gabonais" proposé à la vente payante illégale.',
    gravite: 'CRITIQUE',
    color: 'border-red-600 text-red-800 bg-red-50'
  }
];

export const INITIAL_CITIZEN_REPORTS = [
  {
    id: 'SIG-2026-0842',
    date: '17/09/2026 14:35',
    province: 'Estuaire',
    ville: 'Libreville',
    structure: 'Dispensaire Urbain d\'Ozangué',
    medicament: 'Artésunate Injectable 60mg',
    motifId: 'SURTARIFICATION',
    motifLabel: 'Surtarification Illégale (> Mercuriale)',
    prixFactureXAF: 4500,
    prixPlafondXAF: 2400,
    surcoutXAF: 2100,
    declarantNom: 'Mba Ondo Jean-Pierre',
    declarantTel: '+241 77 12 34 56',
    anonyme: false,
    statut: 'ENQUETE_EN_COURS',
    statutLabel: 'Enquête de l\'Inspection OPN en cours',
    statutColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Le dispensaire a exigé 4 500 FCFA pour 1 flacon d\'Artésunate au lieu des 2 400 FCFA homologués sur la mercuriale officielle.',
    preuveFournie: 'Ticket de caisse manuscrit N° 0418 + Photo ordonnance',
    decisionInspection: 'Mission de contrôle inopinée diligentée par l\'Inspection Pharmaceutique OPN le 18/09/2026. Audition du gestionnaire.',
    reponduPar: 'Dr. Jeanne ENGONE (Inspecteur Pharmacien OPN)'
  },
  {
    id: 'SIG-2026-0839',
    date: '16/09/2026 10:15',
    province: 'Ogooué-Maritime',
    ville: 'Port-Gentil',
    structure: 'Centre Médical de Ntchengué',
    medicament: 'Syntocinon (Oxytocine 10 UI)',
    motifId: 'REFUS_CNAMGS',
    motifLabel: 'Refus de Tiers-Payant CNAMGS',
    prixFactureXAF: 3200,
    prixPlafondXAF: 3200,
    surcoutXAF: 3200,
    declarantNom: 'Citoyenne Anonyme',
    declarantTel: '+241 66 ** ** 12',
    anonyme: true,
    statut: 'TRAITE_REAPPROVISIONNE',
    statutLabel: 'Régularisé & Remboursement Ordonné',
    statutColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Refus d\'appliquer la gratuité 100% Maternité CNAMGS pour une parturiente admise en salle d\'accouchement.',
    preuveFournie: 'Reçu d\'encaisse direct + Copie Carte d\'Assuré CNAMGS',
    decisionInspection: 'Rappel à l\'ordre formel notifié par l\'OPN et la Direction Régionale de Santé. Remboursement intégral opéré sous 24h.',
    reponduPar: 'Direction Régionale de Santé Maritime / OPN'
  },
  {
    id: 'SIG-2026-0835',
    date: '15/09/2026 16:40',
    province: 'Woleu-Ntem',
    ville: 'Oyem',
    structure: 'Case de Santé de Mitzic Rurale',
    medicament: 'Coartem 20/120mg (Boîte de 24)',
    motifId: 'RUPTURE_ANORMALE',
    motifLabel: 'Rupture de Stock Anormale',
    prixFactureXAF: 0,
    prixPlafondXAF: 1850,
    surcoutXAF: 0,
    declarantNom: 'Ndong Emmanuel',
    declarantTel: '+241 62 88 77 66',
    anonyme: false,
    statut: 'TRAITE_REAPPROVISIONNE',
    statutLabel: 'Réapprovisionné par Convoyage Express',
    statutColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Rupture totale de CTA pédiatrique constatée pendant 4 jours consécutifs avec afflux de cas fébriles.',
    preuveFournie: 'Constat par le Chef de Regroupement Villageois',
    decisionInspection: 'Déclenchement d\'une dotation d\'urgence de 200 boîtes depuis l\'Antenne OPN d\'Oyem livrée le 16/09/2026 par Toyota Hilux.',
    reponduPar: 'Chef d\'Antenne OPN Oyem'
  }
];
