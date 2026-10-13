/**
 * Matrice RBAC OPN Gabon V2 - Basée sur les Directions
 * Intègre la structure par directions avec niveaux d'accès granulaires
 */

import { DIRECTIONS, getDirectionById, getDirectionModules, getDirectionNiveaux, hasPermission } from './directionsStructure';

/**
 * Mapping des rôles vers les directions et niveaux
 */
export const ROLE_TO_DIRECTION = {
  // Direction Générale
  DG: { direction: 'DG', niveau: 'DG_DIRECTEUR' },
  DG_CABINET: { direction: 'DG', niveau: 'DG_CABINET' },
  DG_ASSISTANT: { direction: 'DG', niveau: 'DG_ASSISTANT' },
  
  // Direction Approvisionnements
  APPRO_DIRECTEUR: { direction: 'APPRO', niveau: 'APPRO_DIRECTEUR' },
  APPRO_COLLABORATEUR: { direction: 'APPRO', niveau: 'APPRO_COLLABORATEUR' },
  APPRO_PLANIFICATEUR: { direction: 'APPRO', niveau: 'APPRO_PLANIFICATEUR' },
  APPRO_STOCK: { direction: 'APPRO', niveau: 'APPRO_STOCK' },
  
  // Direction Administrative et Financière
  DAF: { direction: 'DAF', niveau: 'DAF_DIRECTEUR' },
  DAF_COMPTABLE: { direction: 'DAF', niveau: 'DAF_COMPTABLE' },
  DAF_PAIE: { direction: 'DAF', niveau: 'DAF_PAIE' },
  DAF_RECOUVREMENT: { direction: 'DAF', niveau: 'DAF_RECOUVREMENT' },
  
  // Direction Logistique
  LOG_DIRECTEUR: { direction: 'LOGISTIQUE', niveau: 'LOG_DIRECTEUR' },
  LOG_FLOTTE: { direction: 'LOGISTIQUE', niveau: 'LOG_FLOTTE' },
  LOG_CONVOI: { direction: 'LOGISTIQUE', niveau: 'LOG_CONVOI' },
  LOG_CONVOYEUR: { direction: 'LOGISTIQUE', niveau: 'LOG_CONVOYEUR' },
  
  // Direction Qualité
  QUAL_CHEF: { direction: 'QUALITE', niveau: 'QUAL_CHEF' },
  QUAL_RESPONSABLE: { direction: 'QUALITE', niveau: 'QUAL_RESPONSABLE' },
  QUAL_TECHNICIEN: { direction: 'QUALITE', niveau: 'QUAL_TECHNICIEN' },
  QUAL_INSPECTEUR: { direction: 'QUALITE', niveau: 'QUAL_INSPECTEUR' },
  
  // Direction Achats
  ACH_DIRECTEUR: { direction: 'ACHATS', niveau: 'ACH_DIRECTEUR' },
  ACH_CHARGE: { direction: 'ACHATS', niveau: 'ACH_CHARGE' },
  ACH_JURIDIQUE: { direction: 'ACHATS', niveau: 'ACH_JURIDIQUE' },
  ACH_ASSISTANT: { direction: 'ACHATS', niveau: 'ACH_ASSISTANT' },
  
  // Direction RH
  RH_DRH: { direction: 'RH', niveau: 'RH_DRH' },
  RH_CARRIERES: { direction: 'RH', niveau: 'RH_CARRIERES' },
  RH_FORMATION: { direction: 'RH', niveau: 'RH_FORMATION' },
  RH_ASSISTANT: { direction: 'RH', niveau: 'RH_ASSISTANT' },
  
  // Direction Communication
  COM_DIRECTEUR: { direction: 'COMMUNICATION', niveau: 'COM_DIRECTEUR' },
  COM_EDITORIAL: { direction: 'COMMUNICATION', niveau: 'COM_EDITORIAL' },
  COM_WEBMASTER: { direction: 'COMMUNICATION', niveau: 'COM_WEBMASTER' },
  COM_PRESSE: { direction: 'COMMUNICATION', niveau: 'COM_PRESSE' },
  
  // Direction Antennes
  ANT_CHEF: { direction: 'ANTENNES', niveau: 'ANT_CHEF' },
  ANT_PHARMA: { direction: 'ANTENNES', niveau: 'ANT_PHARMA' },
  ANT_STOCK: { direction: 'ANTENNES', niveau: 'ANT_STOCK' },
  ANT_FACTURATION: { direction: 'ANTENNES', niveau: 'ANT_FACTURATION' },
  
  // Direction GMAO
  GMAO_RESPONSABLE: { direction: 'GMAO', niveau: 'GMAO_RESPONSABLE' },
  GMAO_FRIGORISTE: { direction: 'GMAO', niveau: 'GMAO_FRIGORISTE' },
  GMAO_BIOMEDICAL: { direction: 'GMAO', niveau: 'GMAO_BIOMEDICAL' },
  GMAO_ELECTRICIEN: { direction: 'GMAO', niveau: 'GMAO_ELECTRICIEN' },
  
  // Direction Urgences
  URG_COORDINATEUR: { direction: 'URGENCES', niveau: 'URG_COORDINATEUR' },
  URG_OFFICIER: { direction: 'URGENCES', niveau: 'URG_OFFICIER' },
  URG_MEDECIN: { direction: 'URGENCES', niveau: 'URG_MEDECIN' },
  URG_LOGISTICIEN: { direction: 'URGENCES', niveau: 'URG_LOGISTICIEN' },
  
  // Direction Portail
  POR_DIRECTEUR: { direction: 'PORTAIL', niveau: 'POR_DIRECTEUR' },
  POR_MODERATEUR: { direction: 'PORTAIL', niveau: 'POR_MODERATEUR' },
  POR_SUPPORT: { direction: 'PORTAIL', niveau: 'POR_SUPPORT' },
  POR_DATA: { direction: 'PORTAIL', niveau: 'POR_DATA' },
  
  // SuperAdmin
  SUPER_ADMIN: { direction: 'SUPERADMIN', niveau: 'SA_SUPERADMIN' },
  ADMIN_IT: { direction: 'SUPERADMIN', niveau: 'SA_ADMIN' },
  ADMIN_SECURITE: { direction: 'SUPERADMIN', niveau: 'SA_SECURITE' },
  HELPDESK: { direction: 'SUPERADMIN', niveau: 'SA_HELPDESK' },
};

/**
 * Obtenir les modules accessibles pour un rôle
 */
export function getModulesForRole(role) {
  const mapping = ROLE_TO_DIRECTION[role];
  if (!mapping) return [];
  
  const direction = getDirectionById(mapping.direction);
  if (!direction) return [];
  
  return direction.modules.map(module => ({
    ...module,
    directionId: direction.id,
    directionNom: direction.nom,
    directionCouleur: direction.couleur,
  }));
}

/**
 * Obtenir la direction d'un rôle
 */
export function getDirectionForRole(role) {
  const mapping = ROLE_TO_DIRECTION[role];
  if (!mapping) return null;
  return getDirectionById(mapping.direction);
}

/**
 * Obtenir le niveau d'accès d'un rôle
 */
export function getNiveauForRole(role) {
  const mapping = ROLE_TO_DIRECTION[role];
  if (!mapping) return null;
  
  const direction = getDirectionById(mapping.direction);
  if (!direction) return null;
  
  return direction.niveaux.find(n => n.id === mapping.niveau);
}

/**
 * Vérifier si un rôle a une permission spécifique
 */
export function roleHasPermission(role, permission) {
  const mapping = ROLE_TO_DIRECTION[role];
  if (!mapping) return false;
  
  const direction = getDirectionById(mapping.direction);
  if (!direction) return false;
  
  const niveau = direction.niveaux.find(n => n.id === mapping.niveau);
  if (!niveau) return false;
  
  return niveau.permissions.includes(permission) || niveau.permissions.includes('all');
}

/**
 * Obtenir les permissions d'un rôle
 */
export function getPermissionsForRole(role) {
  const niveau = getNiveauForRole(role);
  return niveau ? niveau.permissions : [];
}

/**
 * Vérifier si un rôle peut accéder à un module spécifique
 */
export function canAccessModule(role, moduleId) {
  const modules = getModulesForRole(role);
  return modules.some(m => m.id === moduleId);
}

/**
 * Obtenir la vue par défaut pour un rôle
 */
export function getDefaultViewForRole(role) {
  const modules = getModulesForRole(role);
  return modules.length > 0 ? modules[0].id : null;
}

/**
 * Obtenir le label hiérarchique d'un rôle
 */
export function getHierarchyLabel(role) {
  const niveau = getNiveauForRole(role);
  const direction = getDirectionForRole(role);
  
  if (!niveau || !direction) return role;
  
  return `${direction.nom} - ${niveau.label}`;
}

/**
 * Obtenir toutes les directions avec leurs rôles
 */
export function getAllDirectionsWithRoles() {
  const result = {};
  
  Object.entries(ROLE_TO_DIRECTION).forEach(([role, mapping]) => {
    if (!result[mapping.direction]) {
      const direction = getDirectionById(mapping.direction);
      result[mapping.direction] = {
        ...direction,
        roles: [],
      };
    }
    result[mapping.direction].roles.push(role);
  });
  
  return Object.values(result);
}

/**
 * Capacités métier par rôle (boutons / actions UI)
 */
export const ROLE_CAPABILITIES = {
  // Direction Générale
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
    superviseReadonly: false,
    allDirections: true,
    defaultView: 'dashboard_strategique',
    hierarchyLabel: 'N0 — Direction Générale',
  },
  DG_CABINET: {
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
    prepareDossiers: true,
    defaultView: 'supervision_directions',
    hierarchyLabel: 'N0 — Cabinet DG',
  },
  DG_ASSISTANT: {
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
    manageAgenda: true,
    defaultView: 'visas_dg',
    hierarchyLabel: 'N0 — Assistant DG',
  },
  
  // Direction Approvisionnements
  APPRO_DIRECTEUR: {
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
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'planification_cmm',
    hierarchyLabel: 'N4 — Directeur Approvisionnements',
  },
  APPRO_COLLABORATEUR: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: true,
    validateNational: false,
    transferAchats: false,
    rejectAppro: true,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseReadonly: false,
    defaultView: 'wms_central',
    hierarchyLabel: 'N3 — Collaborateur Appro',
  },
  APPRO_PLANIFICATEUR: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    simulateCmm: true,
    superviseReadonly: true,
    defaultView: 'planification_cmm',
    hierarchyLabel: 'N3 — Planificateur Appro',
  },
  APPRO_STOCK: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    manageInventory: true,
    superviseReadonly: true,
    defaultView: 'wms_central',
    hierarchyLabel: 'N3 — Gestionnaire Stock',
  },
  
  // Direction Administrative et Financière
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
    defaultView: 'budget_engagements',
    hierarchyLabel: 'N5 — Directeur Financier',
  },
  DAF_COMPTABLE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    reconciliation: true,
    lettrage: true,
    superviseReadonly: true,
    defaultView: 'comptabilite',
    hierarchyLabel: 'N5 — Comptable Principal',
  },
  DAF_PAIE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    managePayroll: true,
    superviseReadonly: true,
    defaultView: 'paie_rh',
    hierarchyLabel: 'N5 — Gestionnaire Paie',
  },
  DAF_RECOUVREMENT: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    manageInvoices: true,
    superviseReadonly: true,
    defaultView: 'facturation',
    hierarchyLabel: 'N5 — Agent Recouvrement',
  },
  
  // Direction Logistique
  LOG_DIRECTEUR: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    superviseLogistics: true,
    planRoutes: true,
    superviseReadonly: false,
    defaultView: 'distribution',
    hierarchyLabel: 'N5 — Directeur Logistique',
  },
  LOG_FLOTTE: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    dispatchFleet: true,
    superviseReadonly: true,
    defaultView: 'flotte',
    hierarchyLabel: 'N5 — Gestionnaire Flotte',
  },
  LOG_CONVOI: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    escortConvoys: true,
    superviseReadonly: true,
    defaultView: 'pistes',
    hierarchyLabel: 'N5 — Chef Convoi',
  },
  LOG_CONVOYEUR: {
    createDemand: false,
    validatePartialAntenna: false,
    instructDemand: false,
    validateNational: false,
    transferAchats: false,
    rejectAppro: false,
    visaDir: false,
    visaDaf: false,
    visaDg: false,
    executeDelivery: true,
    scanQR: true,
    superviseReadonly: true,
    defaultView: 'distribution',
    hierarchyLabel: 'N5 — Convoyeur',
  },
  
  // SuperAdmin
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
    allSystem: true,
    manageUsers: true,
    defaultView: 'admin_system',
    hierarchyLabel: 'N0 — SuperAdmin (SI)',
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
    supportIT: true,
    defaultView: 'helpdesk',
    hierarchyLabel: 'N0 — Admin IT',
  },
  ADMIN_SECURITE: {
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
    auditSecurity: true,
    defaultView: 'securite',
    hierarchyLabel: 'N0 — Admin Sécurité',
  },
  HELPDESK: {
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
    supportL1: true,
    defaultView: 'helpdesk',
    hierarchyLabel: 'N0 — Helpdesk',
  },
};

/**
 * Fonction utilitaire pour obtenir les capacités d'un rôle
 */
export function getCapabilities(role) {
  return ROLE_CAPABILITIES[role] || {
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
    defaultView: null,
    hierarchyLabel: role,
  };
}
