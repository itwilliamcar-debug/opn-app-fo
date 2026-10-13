/**
 * Matrice RBAC OPN Gabon — source de vérité frontend
 * Sépare SUPER_ADMIN (SI) du circuit métier Approvisionnement.
 *
 * Circuit Appro :
 * Demandeur → Chef Antenne → Collaborateur Appro → Directeur Appro (APPRO_NATIONAL)
 * → Achats / visas DIR → DAF → DG (selon seuil)
 */

export const APPRO_WORKFLOW_STATUSES = {
  BROUILLON: 'BROUILLON',
  SOUMIS: 'SOUMIS',
  SOUMISE_ANTENNE: 'SOUMISE_ANTENNE',
  PARTIELLEMENT_VALIDEE: 'PARTIELLEMENT_VALIDEE', // legacy = envoi vers Appro
  EN_INSTRUCTION_APPRO: 'EN_INSTRUCTION_APPRO',
  INSTRUITE: 'INSTRUITE',
  VALIDEE_NATIONALE: 'VALIDEE_NATIONALE',
  TRANSMISE_ACHATS: 'TRANSMISE_ACHATS',
  EN_VISA_DIR: 'EN_VISA_DIR',
  EN_VISA_DAF: 'EN_VISA_DAF',
  EN_VISA_DG: 'EN_VISA_DG',
  APPROUVEE_CIRCUIT: 'APPROUVEE_CIRCUIT',
  REJETEE_ANTENNE: 'REJETEE_ANTENNE',
  REJETEE_APPRO: 'REJETEE_APPRO',
  REJETEE_VISA: 'REJETEE_VISA',
};

/** Statuts visibles dans la file Collaborateur Appro */
export const STATUTS_FILE_COLLAB_APPRO = [
  'SOUMISE_ANTENNE',
  'PARTIELLEMENT_VALIDEE',
  'VALIDEE',
  'EN_INSTRUCTION_APPRO',
];

/** Statuts visibles pour validation Directeur Appro */
export const STATUTS_FILE_DIR_APPRO = [
  'INSTRUITE',
  'EN_INSTRUCTION_APPRO',
];

export const ROLE_MODULES = {
  SUPER_ADMIN: [
    { id: 'admin', label: 'Administration Centrale', badge: 'SI', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'dashboard', label: 'Dashboard National (Supervision)', badge: 'Lecture', badgeColor: 'bg-slate-100 text-slate-700' },
    { id: 'prospection', label: 'Prospection & Tiers (M2)', badge: 'Terrain', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gross_margin', label: 'Pilotage Marge Brute & KPIs (M9)', badge: 'Rentabilité', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'debt_public', label: 'Recouvrement Public & Mandats (M5)', badge: 'Trésor', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'inventory_waste', label: 'Inventaires & Avaries (M7)', badge: 'Gel Stock', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'planning', label: 'Planification & CMM', badge: 'PNA', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Distribution Dernier Km', badge: 'Pistes & Flotte', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Entrepôts & WMS Owendo', badge: 'WMS', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Facturation & Recouvrement', badge: 'CNAMGS', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Supervision Demandes (Lecture)', badge: 'Audit', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'pharmacy', label: 'Stocks Nationaux (Lecture)', badge: 'FEFO', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'supply', label: 'Approvisionnements (Supervision)', badge: 'Lecture', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'purchases', label: 'Achats & Marchés Labos', badge: 'BC', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'quality', label: 'Qualité, Vigilance & DMP', badge: 'LNCM', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'logistics', label: 'Logistique & Convois Nationaux', badge: 'Hub', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'antenna', label: 'Antennes Provinciales (Supervision)', badge: '9 Provinces', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'citizen', label: 'Portail Citoyen & Mercuriale', badge: 'Public 1410', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'hr', label: 'Ressources Humaines & Postes', badge: 'RH', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'gmao', label: 'Maintenance, GMAO & Froid', badge: 'GMAO', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Centre Urgences (COD)', badge: 'Crise', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'IT', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  ADMIN_IT: [
    { id: 'admin_helpdesk', label: 'Helpdesk & Sécurité IT', badge: 'ANINF', badgeColor: 'bg-cyan-100 text-cyan-800' },
    { id: 'admin_users', label: 'Gestion Comptes & Sessions', badge: 'IAM', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  DG: [
    { id: 'dashboard', label: 'Dashboard Stratégique National', badge: 'Cabinet', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gross_margin', label: 'Pilotage Marge Brute & KPIs (M9)', badge: 'Rentabilité', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'prospection', label: 'Prospection Commerciale (M2)', badge: 'Terrain', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'debt_public', label: 'Recouvrement Public & Mandats (M5)', badge: 'Trésor', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'inventory_waste', label: 'Inventaires & Avaries (M7)', badge: 'Gel Stock', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'planning', label: 'Planification & CMM', badge: 'PNA', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Distribution Dernier Km', badge: 'Couverture', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Hub National WMS Owendo', badge: 'Stocks', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Facturation & Recouvrement', badge: 'Finance', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Visas & Signatures DG', badge: 'Décision', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'supply', label: 'Suivi Approvisionnements', badge: 'Lecture', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'purchases', label: 'Achats & Marchés Fournisseurs', badge: 'Signatures', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'quality', label: 'Qualité, Vigilance & DMP', badge: 'Supervision', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'logistics', label: 'Logistique & Convois Nationaux', badge: 'Hub', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'antenna', label: 'Supervision 9 Antennes', badge: 'National', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'citizen', label: 'Portail Citoyen & Mercuriale', badge: 'Public 1410', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'hr', label: 'Ressources Humaines & Postes', badge: 'RH / Décisions', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gmao', label: 'Maintenance, GMAO & Froid', badge: 'GMAO', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Cellule de Crise (COD)', badge: 'National', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'documents', label: 'Marchés Publics & Rapports', badge: 'XAF', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'admin', label: 'Audit & Intégrité', badge: 'ANINF', badgeColor: 'bg-slate-100 text-slate-800' },
  ],
  DIR: [
    { id: 'dashboard', label: 'Dashboard Opérationnel', badge: 'Pilotage', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gross_margin', label: 'Pilotage Marge Brute & KPIs (M9)', badge: 'Rentabilité', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'prospection', label: 'Prospection Commerciale (M2)', badge: 'Terrain', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'inventory_waste', label: 'Inventaires & Avaries (M7)', badge: 'Gel Stock', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'planning', label: 'Planification & CMM', badge: 'PNA', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Distribution Dernier Km', badge: 'Opérations', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Entrepôts & WMS Owendo', badge: 'Racks', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Facturation & Recouvrement', badge: 'Recouvrement', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Visa Opérations (DIR)', badge: 'Visa', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'supply', label: 'Suivi Approvisionnements', badge: 'Flux', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'purchases', label: 'Achats & Marchés Fournisseurs', badge: 'Visa DIR', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'quality', label: 'Qualité & Conformité LNCM', badge: 'Conformité', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'logistics', label: 'Logistique & Expéditions', badge: 'Hub', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'antenna', label: 'Supervision 9 Antennes', badge: 'Provinces', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'citizen', label: 'Portail Citoyen & Mercuriale', badge: 'Public 1410', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'hr', label: 'Ressources Humaines & Postes', badge: 'RH', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gmao', label: 'Maintenance, GMAO & Froid', badge: 'GMAO', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Cellule de Crise (COD)', badge: 'National', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'documents', label: 'Dossiers & Rapports', badge: 'DIR', badgeColor: 'bg-teal-100 text-teal-800' },
  ],
  DAF: [
    { id: 'billing', label: 'Facturation, Recouvrement & CNAMGS', badge: 'Principal', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'debt_public', label: 'Recouvrement Public & Mandats (M5)', badge: 'Trésor', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'gross_margin', label: 'Pilotage Marge Brute & KPIs (M9)', badge: 'Rentabilité', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'inventory_waste', label: 'Inventaires & Avaries (M7)', badge: 'Comptable', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'planning', label: 'Planification Budgétaire (PNA)', badge: 'Finance', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'hr', label: 'Ressources Humaines & Primes', badge: 'Paie & RH', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Inventaires & Valeur Stock (WMS)', badge: 'Comptable', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Distribution & Coûts Pistes', badge: 'Carburant', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Poste DAF — Visa Engagement Budgétaire', badge: 'Décision', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'dashboard', label: 'Dashboard Budgétaire', badge: 'Finance', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'purchases', label: 'Achats & Marchés Internationaux', badge: 'Visa DAF', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'supply', label: 'Suivi Engagés Appro', badge: 'XAF', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'logistics', label: 'Bordereaux BL & Suivi Convois', badge: 'Logistique', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'documents', label: 'Engagements, Marchés & Rapports', badge: 'DAF', badgeColor: 'bg-cyan-100 text-cyan-800' },
  ],
  APPRO_NATIONAL: [
    { id: 'planning', label: 'Planification & CMM Nationale', badge: 'PNA / CMM', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Distribution Dernier Kilomètre', badge: 'Réseau', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Hub Central WMS (Owendo)', badge: 'Stock Central', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Poste Appro National (Validation & Traitement)', badge: 'Décision', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'supply', label: 'Centre National Appro & CMM', badge: 'CMM', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'purchases', label: 'Achats & Marchés Fournisseurs', badge: 'Owendo', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'quality', label: 'Libération Lots & LNCM', badge: 'Owendo', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'logistics', label: 'Expéditions & Convois Prov.', badge: 'Hub Owendo', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'antenna', label: 'Supervision 9 Antennes', badge: 'Provinces', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'citizen', label: 'Portail Citoyen & Mercuriale', badge: 'Public 1410', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'dashboard', label: 'Vue Nationale Stocks & Flux', badge: 'Owendo', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'pharmacy', label: 'Stocks Nationaux & Allocation FEFO', badge: 'Lots', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'emergency', label: 'Urgences Approvisionnement National', badge: 'Stock', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect — Équipe Appro Owendo', badge: 'Équipe', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'documents', label: 'Rapports Appro & Attestations', badge: 'Rapports', badgeColor: 'bg-cyan-100 text-cyan-800' },
  ],
  COLLABORATEUR_APPRO: [
    { id: 'planning', label: 'Simulation CMM & Besoins', badge: 'CMM', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Tournées & Kits Dernier Km', badge: 'Kits', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Mouvements & Racks WMS', badge: 'Owendo', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'File Instruction Appro', badge: 'Traitement', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'supply', label: 'Simulation CMM & Besoins', badge: 'CMM', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'logistics', label: 'Suivi Convois & Expéditions', badge: 'Transit', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'dashboard', label: 'Vue Nationale Demandes', badge: '9 Antennes', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'pharmacy', label: 'Consultation Stocks FEFO', badge: 'Lots', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'emergency', label: 'Alertes Rupture Appro', badge: 'Stock', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Équipe', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  ACHATS: [
    { id: 'purchases', label: 'Achats & Marchés Internationaux', badge: 'Actif', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'workspace', label: 'File Approvisionnements Transmis', badge: 'Traitement', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'pharmacy', label: 'Catalogue Médicaments DCI', badge: 'Prix', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'supply', label: 'Dossiers Transmis Appro', badge: 'Imports', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'documents', label: 'Contrats & Appels d\'Offres', badge: 'AOI/AON', badgeColor: 'bg-cyan-100 text-cyan-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  PHARMACIEN_CHEF_NATIONAL: [
    { id: 'planning', label: 'Planification Thérapeutique & CMM', badge: 'Stratégie', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'citizen', label: 'Portail Citoyen & Mercuriale', badge: 'Public 1410', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'gmao', label: 'Chaîne du Froid & Métrologie', badge: '2°C–8°C', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'wms', label: 'WMS Central & Chaîne du Froid', badge: '2°C–8°C', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'quality', label: 'Qualité, Vigilance & DMP', badge: 'LNCM / AMM', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'pharmacy', label: 'Catalogue National DCI & FEFO', badge: 'Qualité', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'distribution', label: 'Qualité Froid Dernier Km', badge: 'Glacières', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'dashboard', label: 'Suivi Stocks & Périmés', badge: 'National', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Homologations & Retraits', badge: 'Contrôle', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'emergency', label: 'Alertes Sanitaires (COD)', badge: 'Médical', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  CHEF_ANTENNE_PROVINCIALE: [
    { id: 'antenna', label: 'Commandes & Stocks Antenne', badge: 'Actif', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'prospection', label: 'Prospection & Tiers (M2)', badge: 'Terrain', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'inventory_waste', label: 'Inventaires & Avaries (M7)', badge: 'Gel Stock', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'gross_margin', label: 'Marge Brute & Rapport Quotidien (M9)', badge: 'Paulette', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Facturation & Recouvrement Local', badge: 'Factures', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'debt_public', label: 'Recouvrement Public & Mandats (M5)', badge: 'Trésor', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'distribution', label: 'Distribution Dernier Kilomètre', badge: 'Dispensaires', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Demandes & Validation Antenne', badge: 'Province', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'pharmacy', label: 'Stocks & Lots de l\'Antenne', badge: 'FEFO Local', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'logistics', label: 'Arrivages Convois & Froid', badge: 'Réception', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'supply', label: 'Envoi vers Appro National', badge: 'Soumission', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Urgences Provinciales', badge: 'Zone', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  PHARMACIEN_CHEF_ANTENNE: [
    { id: 'antenna', label: 'Commandes & Stocks Antenne', badge: 'FEFO', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'inventory_waste', label: 'Inventaires & PV Destructions (M7)', badge: 'Pharma', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'pharmacy', label: 'Stocks & Lots de l\'Antenne', badge: 'FEFO Local', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'quality', label: 'Pharmacovigilance & AMM', badge: 'Vigilance', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'distribution', label: 'Kits & Froid Dispensaires', badge: 'Kits', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Avis Pharma & Demandes Locales', badge: 'Avis', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'logistics', label: 'Arrivages Médicaments & BL', badge: '2°C–8°C', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'supply', label: 'Suivi Demandes Antenne', badge: 'Local', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Urgences Provinciales', badge: 'Zone', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  COORDINATEUR_URGENCES: [
    { id: 'emergency', label: 'Centre Opérationnel (COD)', badge: 'Urgence', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'planning', label: 'Réserves Stratégiques & Crise', badge: 'RSSE', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'distribution', label: 'Déploiement Kits Urgence', badge: 'Crise', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'quality', label: 'Alertes Sanitaires & Rappels', badge: 'COD', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'workspace', label: 'Ordres de Déploiement', badge: 'Missions', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'logistics', label: 'Suivi Convois d\'Urgence', badge: 'COD', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'pharmacy', label: 'Stocks Sérums & Kits Crise', badge: '2°C–8°C', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'collaborative', label: 'OPN Connect — Visio COD', badge: 'Crise', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  GESTIONNAIRE_LOGISTIQUE: [
    { id: 'distribution', label: 'Distribution Dernier Km (Pistes & Flotte)', badge: 'Opérationnel', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gmao', label: 'Maintenance Flotte & GMAO', badge: 'GMAO', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'wms', label: 'WMS Central & Quais Owendo', badge: 'Quais', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'logistics', label: 'Dispatch Central & Flotte', badge: 'Hub', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'antenna', label: 'Liaisons Antennes & Stocks', badge: 'Provinces', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Pilotage Flotte & Convois', badge: 'RN1/RN2', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'supply', label: 'Feuilles de Route & Livraisons', badge: 'En cours', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Incidents Route & Chaîne Froid', badge: '2°C–8°C', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'GPS', badgeColor: 'bg-amber-100 text-amber-800' },
  ],
  CHEF_CONVOI_SECURITE: [
    { id: 'distribution', label: 'Escortes & Pistes Dernier Km', badge: 'Terrain', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'logistics', label: 'Suivi Convois & Escortes', badge: 'Itinéraires', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Escortes & Checkpoints', badge: 'Sûreté', badgeColor: 'bg-slate-200 text-slate-800' },
    { id: 'supply', label: 'Missions Assignées', badge: 'Route', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'emergency', label: 'Incidents Sécurité Convois', badge: 'Alerte', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  CONVOYEUR: [
    { id: 'distribution', label: 'Mes Tournées & Décharges Dispensaires', badge: 'Missions', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'logistics', label: 'Mes Convois & Bordereaux BL', badge: 'Terrain', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Mes Missions & Scanner QR', badge: 'Scanner', badgeColor: 'bg-orange-100 text-orange-800' },
    { id: 'emergency', label: 'Signaler Incident Convoi', badge: 'Alerte', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  DEMANDEUR_PHARMACIEN: [
    { id: 'workspace', label: 'Mes Demandes & Réceptions', badge: 'Officine', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Mes Factures OPN & Tiers-Payant', badge: 'Factures', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'pharmacy', label: 'Catalogue Médicaments & Tarifs', badge: 'Plafonné', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  DEMANDEUR_STRUCTURE: [
    { id: 'workspace', label: 'Mes Demandes & Réceptions', badge: 'Structure', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Mes Factures OPN & Tiers-Payant', badge: 'Factures', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'pharmacy', label: 'Catalogue Médicaments & Tarifs', badge: 'Plafonné', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  COMMUNICATION: [
    { id: 'documents', label: 'Portail CMS & Appels d\'Offres', badge: 'Public', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'workspace', label: 'Campagnes & Communiqués', badge: 'Presse', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Média', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
  AUDITEUR_INTERNE: [
    { id: 'admin', label: 'Pôle Audit interne ANINF', badge: 'Registre', badgeColor: 'bg-slate-200 text-slate-900' },
    { id: 'dashboard', label: 'Contrôle National & Timelines', badge: 'Audit', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'gmao', label: 'Audit GMAO & Chaîne du Froid', badge: 'Contrôle', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'citizen', label: 'Audit Signalements & Mercuriale', badge: 'Inspection', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'planning', label: 'Audit Planification & Réserves', badge: 'PNA', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'distribution', label: 'Audit Distribution & Décharges', badge: 'Contrôle', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'wms', label: 'Audit Inventaires & Racks WMS', badge: 'Inventaires', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'billing', label: 'Audit Facturation & Recouvrement', badge: 'Finance', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workspace', label: 'Traçabilité des Validations', badge: 'Lecture', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'purchases', label: 'Audit Achats & Marchés Fournisseurs', badge: 'Contrôle', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'quality', label: 'Audit Qualité & Vigilance', badge: 'Contrôle', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'logistics', label: 'Audit Logistique & Bordereaux BL', badge: 'Contrôle', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'antenna', label: 'Audit Stocks & BL Antennes', badge: 'Contrôle', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'supply', label: 'Supervision Appro (Lecture)', badge: 'Audit', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'collaborative', label: 'OPN Connect (Chat & Visio)', badge: 'Direct', badgeColor: 'bg-purple-100 text-purple-800' },
  ],
};

/** Capacités métier Appro par rôle (boutons / actions UI) */
export const ROLE_CAPABILITIES = {
  SUPER_ADMIN: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: true,
    defaultView: 'admin',
    hierarchyLabel: 'N0 — Administration SI (hors chaîne Appro)',
  },
  ADMIN_IT: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: true,
    defaultView: 'admin_helpdesk',
    hierarchyLabel: 'N0 — Support IT',
  },
  DEMANDEUR_PHARMACIEN: {
    createDemand: true,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N1 — Origine du besoin (officine)',
  },
  DEMANDEUR_STRUCTURE: {
    createDemand: true,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N1 — Origine du besoin (structure)',
  },
  PHARMACIEN_CHEF_ANTENNE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    pharmacyReview: true,
    defaultView: 'workspace',
    hierarchyLabel: 'N2 — Avis pharmaceutique antenne',
  },
  CHEF_ANTENNE_PROVINCIALE: {
    createDemand: true,
    validatePartialAntenna: true,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N2 — Validation & envoi vers Appro national',
  },
  COLLABORATEUR_APPRO: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: true,
    validateNational: false,
    transferAchats: false,
    rejectAppro: true,
    governanceView: true,
    governanceAssign: false,
    governanceReview: false,
    documentManage: true,
    suggestionCreate: true,
    suggestionDecide: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N3 — Instruction / traitement Appro',
  },
  APPRO_NATIONAL: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: true,
    validateNational: true,
    transferAchats: true,
    rejectAppro: true,
    closeDelivery: true,
    allocateFefo: true,
    printDossier: true,
    reportSupply: true,
    governanceView: true,
    governanceAssign: true,
    governanceReview: true,
    documentManage: true,
    suggestionCreate: true,
    suggestionDecide: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N4 — Validation nationale Appro',
  },
  ACHATS: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    receiveFromAppro: true,
    defaultView: 'workspace',
    hierarchyLabel: 'N5 — Achats & marchés fournisseurs',
  },
  DIR: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: true,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N5 — Visa Directeur des Opérations',
  },
  DAF: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: true,
    visaDg: false,
    printDossier: true,
    reportFinance: true,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'N5 — Visa engagement budgétaire',
  },
  DG: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: true,
    suggestionDecide: true,
    suggestionCreate: false,
    documentManage: false,
    superviseReadonly: false,
    defaultView: 'dashboard',
    hierarchyLabel: 'N5 — Visa final Directeur Général',
  },
  PHARMACIEN_CHEF_NATIONAL: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: true,
    defaultView: 'pharmacy',
    hierarchyLabel: 'Support qualité pharmaceutique nationale',
  },
  COORDINATEUR_URGENCES: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'emergency',
    hierarchyLabel: 'Circuit urgences COD (parallèle)',
  },
  GESTIONNAIRE_LOGISTIQUE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'Exécution logistique post-validation',
  },
  CHEF_CONVOI_SECURITE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'Sûreté des convois',
  },
  CONVOYEUR: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'workspace',
    hierarchyLabel: 'Exécution terrain / QR',
  },
  COMMUNICATION: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'documents',
    hierarchyLabel: 'Communication & portail public',
  },
  AUDITEUR_INTERNE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: true,
    defaultView: 'admin',
    hierarchyLabel: 'Audit lecture seule (ANINF)',
  },
};

export function getCodeRole(userOrPersona) {
  return userOrPersona?.codeRole || userOrPersona?.code_role || 'DEMANDEUR_STRUCTURE';
}

const MODULE_FLUX = {
  id: 'flux_appro',
  label: 'Chaîne d\'approvisionnement',
  badge: 'Flux',
  badgeColor: 'bg-sky-100 text-sky-800',
};

const MODULE_PATRIMOINE = {
  id: 'patrimoine',
  label: 'Gestion du patrimoine',
  badge: 'Biens',
  badgeColor: 'bg-amber-100 text-amber-800',
};

const MODULE_SERVICES = {
  id: 'centre_services',
  label: 'Centre de services',
  badge: 'Outils',
  badgeColor: 'bg-slate-100 text-slate-700',
};

/** Rôles qui passent une commande (pharmacie / partenaire). */
const ROLES_COMMANDE = ['DEMANDEUR_PHARMACIEN', 'DEMANDEUR_STRUCTURE'];
/** Rôles d'antenne : réception puis transmission au siège. */
const ROLES_ANTENNE = ['CHEF_ANTENNE_PROVINCIALE', 'PHARMACIEN_CHEF_ANTENNE'];
/** Directeurs et directrices : seuls habilités au patrimoine. */
const ROLES_PATRIMOINE = ['DG', 'DIR', 'DAF', 'APPRO_NATIONAL', 'SUPER_ADMIN'];
/** Rôles du siège : dispersion des commandes transmises. */
const ROLES_SIEGE = [
  'APPRO_NATIONAL',
  'COLLABORATEUR_APPRO',
  'DG',
  'DIR',
  'DAF',
  'ACHATS',
  'PHARMACIEN_CHEF_NATIONAL',
];

export function getFluxStage(codeRole) {
  if (codeRole === 'SUPER_ADMIN') return 'supervision';
  if (ROLES_COMMANDE.includes(codeRole)) return 'commande';
  if (ROLES_ANTENNE.includes(codeRole)) return 'antenne';
  if (ROLES_SIEGE.includes(codeRole)) return 'siege';
  return 'suivi';
}

export function getRoleModules(codeRole) {
  const workflow = [MODULE_FLUX];
  if (ROLES_PATRIMOINE.includes(codeRole)) {
    workflow.push(MODULE_PATRIMOINE);
  }
  workflow.push(MODULE_SERVICES);
  if (codeRole === 'SUPER_ADMIN') {
    return [...workflow, ...(ROLE_MODULES.SUPER_ADMIN || [])];
  }
  return workflow;
}

export function getRoleCapabilities(codeRole) {
  return ROLE_CAPABILITIES[codeRole] || ROLE_CAPABILITIES.DEMANDEUR_STRUCTURE;
}

export function canAccessModule(codeRole, moduleId) {
  return getRoleModules(codeRole).some((m) => m.id === moduleId);
}

export function isDemandInApproQueue(statut) {
  return STATUTS_FILE_COLLAB_APPRO.includes(statut);
}

export function isDemandReadyForNationalValidation(statut) {
  return STATUTS_FILE_DIR_APPRO.includes(statut) || statut === 'INSTRUITE';
}

/**
 * Seuils de circuit de visas (XAF) — hypothèse métier OPN à confirmer
 * ≤ 5M : pas de visa DIR/DAF/DG
 * 5M–20M : DIR → DAF
 * > 20M : DIR → DAF → DG
 */
export const VISA_THRESHOLDS = {
  SANS_VISA_MAX: 5_000_000,
  DIR_DAF_MAX: 20_000_000,
};

export function getVisaCircuit(montantXaf) {
  const montant = Number(montantXaf) || 0;

  if (montant <= VISA_THRESHOLDS.SANS_VISA_MAX) {
    return {
      code: 'SANS_VISA',
      steps: [],
      label: '≤ 5 000 000 XAF — sans visa DIR / DAF / DG',
      nextStatutAfterAppro: 'VALIDEE_NATIONALE',
      requiresDir: false,
      requiresDaf: false,
      requiresDg: false,
    };
  }

  if (montant <= VISA_THRESHOLDS.DIR_DAF_MAX) {
    return {
      code: 'DIR_DAF',
      steps: ['DIR', 'DAF'],
      label: '5–20 M XAF — visas DIR puis DAF',
      nextStatutAfterAppro: 'EN_VISA_DIR',
      requiresDir: true,
      requiresDaf: true,
      requiresDg: false,
    };
  }

  return {
    code: 'DIR_DAF_DG',
    steps: ['DIR', 'DAF', 'DG'],
    label: '> 20 000 000 XAF — visas DIR → DAF → DG',
    nextStatutAfterAppro: 'EN_VISA_DIR',
    requiresDir: true,
    requiresDaf: true,
    requiresDg: true,
  };
}

/** Prochain statut après un visa approuvé */
export function nextStatutAfterVisa(currentStatut, circuit) {
  if (currentStatut === 'EN_VISA_DIR') {
    return circuit.requiresDaf ? 'EN_VISA_DAF' : 'APPROUVEE_CIRCUIT';
  }
  if (currentStatut === 'EN_VISA_DAF') {
    return circuit.requiresDg ? 'EN_VISA_DG' : 'APPROUVEE_CIRCUIT';
  }
  if (currentStatut === 'EN_VISA_DG') {
    return 'APPROUVEE_CIRCUIT';
  }
  return currentStatut;
}

export function canRoleVisaDemand(codeRole, statut, montantXaf) {
  const circuit = getVisaCircuit(montantXaf);
  if (codeRole === 'DIR' && circuit.requiresDir && statut === 'EN_VISA_DIR') return true;
  if (codeRole === 'DAF' && circuit.requiresDaf && statut === 'EN_VISA_DAF') return true;
  if (codeRole === 'DG' && circuit.requiresDg && statut === 'EN_VISA_DG') return true;
  return false;
}

export function formatSeuilHint(montantXaf) {
  const circuit = getVisaCircuit(montantXaf);
  return circuit.label;
}
