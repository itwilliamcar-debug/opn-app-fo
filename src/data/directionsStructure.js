/**
 * Structure des Directions OPN - Organisation métier
 * Chaque direction a ses modules, fonctionnalités et niveaux d'accès
 */

export const DIRECTIONS = {
  DG: {
    id: 'DG',
    nom: 'Direction Générale',
    couleur: '#1e3a8a', // bleu foncé
    icon: 'Crown',
    description: 'Supervision stratégique et décision finale',
    modules: [
      { id: 'dashboard_strategique', label: 'Dashboard Stratégique', icon: 'LayoutDashboard' },
      { id: 'supervision_directions', label: 'Supervision Directions', icon: 'Building2' },
      { id: 'visas_dg', label: 'Visas & Signatures', icon: 'FileCheck' },
      { id: 'centre_decision', label: 'Centre de Décision (COD)', icon: 'AlertTriangle' },
      { id: 'rapports_audit', label: 'Rapports & Audit', icon: 'FileText' },
      { id: 'superadmin', label: 'Administration Système', icon: 'ShieldAlert' },
    ],
    niveaux: [
      { id: 'DG_DIRECTEUR', label: 'Directeur Général', permissions: ['all'] },
      { id: 'DG_CABINET', label: 'Cabinet DG', permissions: ['read', 'prepare', 'sign'] },
      { id: 'DG_ASSISTANT', label: 'Assistant DG', permissions: ['read', 'agenda'] },
    ],
  },
  APPRO: {
    id: 'APPRO',
    nom: 'Direction des Approvisionnements',
    couleur: '#059669', // vert émeraude
    icon: 'Package',
    description: 'Planification, stocks et allocation FEFO',
    modules: [
      { id: 'planification_cmm', label: 'Planification & CMM', icon: 'TrendingUp' },
      { id: 'wms_central', label: 'Hub Central WMS Owendo', icon: 'Package' },
      { id: 'allocation_fefo', label: 'Allocation FEFO', icon: 'Layers' },
      { id: 'supervision_antennes', label: 'Supervision 9 Antennes', icon: 'MapPin' },
      { id: 'reserves_strategiques', label: 'Réserves Stratégiques (RSSE)', icon: 'Shield' },
    ],
    niveaux: [
      { id: 'APPRO_DIRECTEUR', label: 'Directeur Appro', permissions: ['validate_national', 'transfer_achats', 'allocate_fefo'] },
      { id: 'APPRO_COLLABORATEUR', label: 'Collaborateur Appro', permissions: ['instruct', 'process', 'reject'] },
      { id: 'APPRO_PLANIFICATEUR', label: 'Planificateur', permissions: ['cmm', 'simulate', 'read'] },
      { id: 'APPRO_STOCK', label: 'Gestionnaire Stock', permissions: ['wms', 'inventory', 'read'] },
    ],
  },
  DAF: {
    id: 'DAF',
    nom: 'Direction Administrative et Financière',
    couleur: '#7c3aed', // violet
    icon: 'Landmark',
    description: 'Finance, budget et recouvrement',
    modules: [
      { id: 'facturation', label: 'Facturation & Recouvrement', icon: 'FileText' },
      { id: 'tresor_public', label: 'Intégration Trésor Public', icon: 'Building2' },
      { id: 'budget_engagements', label: 'Budget & Engagements', icon: 'Calculator' },
      { id: 'comptabilite', label: 'Comptabilité Fournisseurs', icon: 'FileSpreadsheet' },
      { id: 'paie_rh', label: 'Paie & RH', icon: 'Users' },
    ],
    niveaux: [
      { id: 'DAF_DIRECTEUR', label: 'Directeur Financier', permissions: ['visa_budget', 'validate_engagement', 'all_finance'] },
      { id: 'DAF_COMPTABLE', label: 'Comptable Principal', permissions: ['reconciliation', 'lettrage', 'accounting'] },
      { id: 'DAF_PAIE', label: 'Gestionnaire Paie', permissions: ['payroll', 'primes', 'read'] },
      { id: 'DAF_RECOUVREMENT', label: 'Agent Recouvrement', permissions: ['invoices', 'collection', 'read'] },
    ],
  },
  LOGISTIQUE: {
    id: 'LOGISTIQUE',
    nom: 'Direction de la Logistique',
    couleur: '#ea580c', // orange
    icon: 'Truck',
    description: 'Distribution, flotte et maintenance',
    modules: [
      { id: 'distribution', label: 'Distribution Dernier Km', icon: 'Truck' },
      { id: 'flotte', label: 'Flotte & Convois', icon: 'Truck' },
      { id: 'gmao', label: 'GMAO Maintenance', icon: 'Wrench' },
      { id: 'chaine_froid', label: 'Chaîne du Froid IoT', icon: 'Thermometer' },
      { id: 'pistes', label: 'Pistes & Transport', icon: 'MapPin' },
    ],
    niveaux: [
      { id: 'LOG_DIRECTEUR', label: 'Directeur Logistique', permissions: ['supervise', 'plan', 'all_logistics'] },
      { id: 'LOG_FLOTTE', label: 'Gestionnaire Flotte', permissions: ['dispatch', 'plan_routes', 'read'] },
      { id: 'LOG_CONVOI', label: 'Chef Convoi', permissions: ['escort', 'security', 'read'] },
      { id: 'LOG_CONVOYEUR', label: 'Convoyeur', permissions: ['execute', 'scan', 'read'] },
    ],
  },
  QUALITE: {
    id: 'QUALITE',
    nom: 'Direction de la Qualité Pharmaceutique',
    couleur: '#0891b2', // cyan
    icon: 'Award',
    description: 'Qualité, vigilance et conformité',
    modules: [
      { id: 'qualite_conformite', label: 'Qualité & Conformité LNCM', icon: 'CheckCircle2' },
      { id: 'pharmacovigilance', label: 'Pharmacovigilance', icon: 'Activity' },
      { id: 'controle_qualite', label: 'Contrôle Qualité COA', icon: 'Search' },
      { id: 'dmp', label: 'Dossier Médical Patient', icon: 'FileText' },
      { id: 'homologations', label: 'Homologations & Retraits', icon: 'Shield' },
    ],
    niveaux: [
      { id: 'QUAL_CHEF', label: 'Pharmacien Chef National', permissions: ['supervise_quality', 'validate', 'all_quality'] },
      { id: 'QUAL_RESPONSABLE', label: 'Responsable Qualité', permissions: ['control', 'vigilance', 'read'] },
      { id: 'QUAL_TECHNICIEN', label: 'Technicien Labo', permissions: ['analyze', 'test', 'read'] },
      { id: 'QUAL_INSPECTEUR', label: 'Inspecteur', permissions: ['audit', 'inspect', 'read'] },
    ],
  },
  ACHATS: {
    id: 'ACHATS',
    nom: 'Direction des Achats Internationaux',
    couleur: '#ca8a04', // jaune ocre
    icon: 'Globe',
    description: 'Marchés, fournisseurs et importations',
    modules: [
      { id: 'marches', label: 'Marches & Appels d\'Offres', icon: 'Gavel' },
      { id: 'fournisseurs', label: 'Panel Fournisseurs', icon: 'Users' },
      { id: 'incoterms', label: 'Incoterms & Douanes (BAE)', icon: 'Ship' },
      { id: 'contrats', label: 'Contrats & Négociation', icon: 'FileText' },
      { id: 'commandes', label: 'Suivi Commandes Fournisseurs', icon: 'Package' },
    ],
    niveaux: [
      { id: 'ACH_DIRECTEUR', label: 'Directeur Achats', permissions: ['decide_markets', 'sign_contracts', 'all_purchases'] },
      { id: 'ACH_CHARGE', label: 'Chargé Achats', permissions: ['manage_suppliers', 'follow_orders', 'read'] },
      { id: 'ACH_JURIDIQUE', label: 'Juridique Marchés', permissions: ['contracts', 'aoi', 'read'] },
      { id: 'ACH_ASSISTANT', label: 'Assistant Achats', permissions: ['data_entry', 'follow', 'read'] },
    ],
  },
  RH: {
    id: 'RH',
    nom: 'Direction des Ressources Humaines',
    couleur: '#db2777', // rose
    icon: 'UserCheck',
    description: 'Gestion du personnel et carrières',
    modules: [
      { id: 'postes', label: 'Gestion des Postes', icon: 'Briefcase' },
      { id: 'recrutement', label: 'Recrutement & Intégration', icon: 'UserPlus' },
      { id: 'formation', label: 'Formation & Certification', icon: 'GraduationCap' },
      { id: 'evaluation', label: 'Évaluation Performance', icon: 'BarChart3' },
      { id: 'admin_personnel', label: 'Administration Personnel', icon: 'Users' },
    ],
    niveaux: [
      { id: 'RH_DRH', label: 'DRH', permissions: ['decide_hr', 'all_hr'] },
      { id: 'RH_CARRIERES', label: 'Gestionnaire Carrières', permissions: ['manage_positions', 'recruit', 'read'] },
      { id: 'RH_FORMATION', label: 'Responsable Formation', permissions: ['training', 'certify', 'read'] },
      { id: 'RH_ASSISTANT', label: 'Assistant RH', permissions: ['admin_daily', 'read'] },
    ],
  },
  COMMUNICATION: {
    id: 'COMMUNICATION',
    nom: 'Direction de la Communication',
    couleur: '#6366f1', // indigo
    icon: 'Megaphone',
    description: 'Portail public et relations médias',
    modules: [
      { id: 'portail_cms', label: 'Portail Public CMS', icon: 'Globe' },
      { id: 'presse', label: 'Relations Presse', icon: 'Newspaper' },
      { id: 'appels_offres', label: 'Appels d\'Offres Publics', icon: 'Scroll' },
      { id: 'newsletter', label: 'Newsletter & Alertes', icon: 'Mail' },
      { id: 'multimedia', label: 'Gestion Contenu Multimédia', icon: 'Video' },
    ],
    niveaux: [
      { id: 'COM_DIRECTEUR', label: 'Directeur Communication', permissions: ['strategy', 'all_com'] },
      { id: 'COM_EDITORIAL', label: 'Responsable Editorial', permissions: ['content', 'publish', 'read'] },
      { id: 'COM_WEBMASTER', label: 'Webmaster', permissions: ['cms', 'portal', 'read'] },
      { id: 'COM_PRESSE', label: 'Chargé Presse', permissions: ['media', 'press', 'read'] },
    ],
  },
  ANTENNES: {
    id: 'ANTENNES',
    nom: 'Direction des Antennes Provinciales',
    couleur: '#16a34a', // vert
    icon: 'MapPin',
    description: '9 Antennes régionales',
    modules: [
      { id: 'commandes_antenne', label: 'Commandes & Stocks Antenne', icon: 'Package' },
      { id: 'distribution_locale', label: 'Distribution Locale', icon: 'Truck' },
      { id: 'facturation_regionale', label: 'Facturation Régionale', icon: 'FileText' },
      { id: 'inventaires', label: 'Inventaires Provinciaux', icon: 'ClipboardCheck' },
      { id: 'liaison_siege', label: 'Liaison avec Siège', icon: 'MessageSquare' },
    ],
    niveaux: [
      { id: 'ANT_CHEF', label: 'Chef Antenne', permissions: ['validate_local', 'send_hq', 'all_antenna'] },
      { id: 'ANT_PHARMA', label: 'Pharmacien Chef Antenne', permissions: ['pharmacy_review', 'read'] },
      { id: 'ANT_STOCK', label: 'Gestionnaire Stock', permissions: ['receive', 'manage_stock', 'read'] },
      { id: 'ANT_FACTURATION', label: 'Agent Facturation', permissions: ['invoices_local', 'read'] },
    ],
  },
  GMAO: {
    id: 'GMAO',
    nom: 'Direction Maintenance Biomédicale',
    couleur: '#0891b2', // cyan foncé
    icon: 'Wrench',
    description: 'Maintenance et équipements',
    modules: [
      { id: 'gmao_main', label: 'GMAO & Maintenance', icon: 'Wrench' },
      { id: 'chaine_froid_gmao', label: 'Chaîne du Froid', icon: 'Thermometer' },
      { id: 'groupes_electrogenes', label: 'Groupes Électrogènes', icon: 'Zap' },
      { id: 'bons_intervention', label: 'Bons d\'Intervention', icon: 'Clipboard' },
      { id: 'metrologie', label: 'Métrologie', icon: 'Ruler' },
    ],
    niveaux: [
      { id: 'GMAO_RESPONSABLE', label: 'Responsable Maintenance', permissions: ['supervise_gmao', 'all_maintenance'] },
      { id: 'GMAO_FRIGORISTE', label: 'Technicien Frigoriste', permissions: ['cold_rooms', 'maintenance', 'read'] },
      { id: 'GMAO_BIOMEDICAL', label: 'Technicien Biomédical', permissions: ['equipment', 'maintenance', 'read'] },
      { id: 'GMAO_ELECTRICIEN', label: 'Électricien', permissions: ['generators', 'maintenance', 'read'] },
    ],
  },
  URGENCES: {
    id: 'URGENCES',
    nom: 'Direction des Urgences Sanitaires (COD)',
    couleur: '#dc2626', // rouge
    icon: 'AlertTriangle',
    description: 'Centre Opérationnel de Décision',
    modules: [
      { id: 'centre_decision', label: 'Centre Opérationnel (COD)', icon: 'Command' },
      { id: 'reserves_urgence', label: 'Réserves Stratégiques', icon: 'Shield' },
      { id: 'deploiement', label: 'Déploiement Kits Urgence', icon: 'Package' },
      { id: 'alertes', label: 'Alertes Sanitaires', icon: 'Bell' },
      { id: 'coordination', label: 'Coordination Crise', icon: 'Users' },
    ],
    niveaux: [
      { id: 'URG_COORDINATEUR', label: 'Coordinateur Urgences', permissions: ['deploy', 'decide_emergency', 'all_emergency'] },
      { id: 'URG_OFFICIER', label: 'Officier COD', permissions: ['follow_ops', 'read'] },
      { id: 'URG_MEDECIN', label: 'Médecin Urgentiste', permissions: ['medical_advice', 'read'] },
      { id: 'URG_LOGISTICIEN', label: 'Logisticien Urgence', permissions: ['kits', 'convoys', 'read'] },
    ],
  },
  PORTAIL: {
    id: 'PORTAIL',
    nom: 'Direction du Portail Citoyen',
    couleur: '#f97316', // orange clair
    icon: 'Globe',
    description: 'Portail public et transparence',
    modules: [
      { id: 'portail_public', label: 'Portail Public', icon: 'Globe' },
      { id: 'mercuriale', label: 'Mercuriale Officielle', icon: 'List' },
      { id: 'pharmacies_garde', label: 'Pharmacies de Garde', icon: 'Crosshair' },
      { id: 'signalement', label: 'Signalement Anti-Fraude', icon: 'ShieldAlert' },
      { id: 'transparence', label: 'Transparence Tarifs', icon: 'Eye' },
    ],
    niveaux: [
      { id: 'POR_DIRECTEUR', label: 'Directeur Portail', permissions: ['supervise_public', 'all_portal'] },
      { id: 'POR_MODERATEUR', label: 'Modérateur', permissions: ['moderate', 'reports', 'read'] },
      { id: 'POR_SUPPORT', label: 'Support Citoyen', permissions: ['support', 'read'] },
      { id: 'POR_DATA', label: 'Data Manager', permissions: ['data_public', 'read'] },
    ],
  },
  SUPERADMIN: {
    id: 'SUPERADMIN',
    nom: 'SuperAdmin (SI)',
    couleur: '#1f2937', // gris foncé
    icon: 'ShieldAlert',
    description: 'Administration système et sécurité',
    modules: [
      { id: 'admin_system', label: 'Administration Système', icon: 'Server' },
      { id: 'gestion_users', label: 'Gestion Utilisateurs Globale', icon: 'Users' },
      { id: 'securite', label: 'Sécurité & Audit', icon: 'Shield' },
      { id: 'helpdesk', label: 'Helpdesk IT', icon: 'Headphones' },
      { id: 'configuration', label: 'Configuration Globale', icon: 'Settings' },
    ],
    niveaux: [
      { id: 'SA_SUPERADMIN', label: 'SuperAdmin', permissions: ['all_system', 'root'] },
      { id: 'SA_ADMIN', label: 'Admin IT', permissions: ['support', 'admin', 'read'] },
      { id: 'SA_SECURITE', label: 'Admin Sécurité', permissions: ['audit', 'security', 'read'] },
      { id: 'SA_HELPDESK', label: 'Helpdesk', permissions: ['support_l1', 'read'] },
    ],
  },
};

/**
 * Obtenir une direction par son ID
 */
export function getDirectionById(directionId) {
  return DIRECTIONS[directionId] || null;
}

/**
 * Obtenir toutes les directions
 */
export function getAllDirections() {
  return Object.values(DIRECTIONS);
}

/**
 * Obtenir les modules d'une direction
 */
export function getDirectionModules(directionId) {
  const direction = getDirectionById(directionId);
  return direction ? direction.modules : [];
}

/**
 * Obtenir les niveaux d'accès d'une direction
 */
export function getDirectionNiveaux(directionId) {
  const direction = getDirectionById(directionId);
  return direction ? direction.niveaux : [];
}

/**
 * Vérifier si un niveau a une permission spécifique
 */
export function hasPermission(niveauId, permission) {
  for (const direction of Object.values(DIRECTIONS)) {
    const niveau = direction.niveaux.find(n => n.id === niveauId);
    if (niveau && niveau.permissions.includes(permission)) {
      return true;
    }
    if (niveau && niveau.permissions.includes('all')) {
      return true;
    }
  }
  return false;
}
