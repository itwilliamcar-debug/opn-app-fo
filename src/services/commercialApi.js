import { apiRequest } from './api';

function mapVisite(row) {
  if (!row) return null;
  return {
    id: row.code_visite || row.id,
    date: row.date_visite,
    commercial: row.commercial,
    resultat: row.resultat,
    commentaire: row.commentaire,
    prochaineAction: row.prochaine_action,
    gps: row.gps_lat != null ? { lat: Number(row.gps_lat), lng: Number(row.gps_lng) } : null,
    photoUrl: row.photo_url,
  };
}

export function mapProspect(row) {
  if (!row) return null;
  const visites = Array.isArray(row.visites)
    ? row.visites.map(mapVisite).filter(Boolean)
    : Array.isArray(row.historiqueVisites)
      ? row.historiqueVisites
      : [];
  return {
    id: row.id,
    code: row.code,
    antenneId: row.antenne_code || row.province_code || row.antenneId,
    antenneNom: row.antenne_nom || row.antenneNom,
    nomStructure: row.nom_structure || row.nomStructure,
    typeStructure: row.type_structure || row.typeStructure,
    province: row.province,
    provinceCode: row.province_code || row.antenne_code || row.provinceCode,
    localite: row.localite,
    regionSanitaire: row.region_sanitaire || row.regionSanitaire,
    contactNom: row.contact_nom || row.contactNom,
    telephone: row.telephone,
    email: row.email,
    adresse: row.adresse,
    gps: {
      lat: Number(row.gps_lat ?? row.gps?.lat ?? 0),
      lng: Number(row.gps_lng ?? row.gps?.lng ?? 0),
    },
    photoUrl: row.photo_url || row.photoUrl,
    statut: row.statut,
    dateCreation: row.date_creation || row.dateCreation,
    dateDerniereVisite: row.date_derniere_visite || row.dateDerniereVisite,
    joursDepuisVisite: Number(row.jours_depuis_visite ?? row.joursDepuisVisite ?? 0),
    isDormant: Boolean(row.is_dormant ?? row.isDormant),
    commercialAssignee: row.commercial_assignee || row.commercialAssignee,
    commentaire: row.commentaire,
    historiqueVisites: visites,
    devisAssocies: row.devis_associes || row.devisAssocies || [],
    clientConvertiId: row.client_converti_id || row.clientConvertiId || null,
    structureId: row.structure_id || null,
  };
}

export async function fetchCommercialReferentiel() {
  const res = await apiRequest('/commercial/referentiel');
  return res?.data || { antennes: [], types_structures: [], structures: [] };
}

export async function fetchProspects(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'ALL') {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query}` : '';
  const res = await apiRequest(`/commercial/prospects${suffix}`);
  const rows = Array.isArray(res?.data) ? res.data : [];
  return rows.map(mapProspect);
}

export async function createProspect(payload) {
  const body = {
    code: payload.code || undefined,
    antenne_code: payload.antenneId || payload.provinceCode,
    antenne_nom: payload.antenneNom,
    nom_structure: payload.nomStructure,
    type_structure: payload.typeStructure,
    province: payload.province,
    province_code: payload.provinceCode,
    localite: payload.localite,
    region_sanitaire: payload.regionSanitaire,
    contact_nom: payload.contactNom,
    telephone: payload.telephone,
    email: payload.email || null,
    adresse: payload.adresse,
    gps_lat: payload.gps?.lat ?? null,
    gps_lng: payload.gps?.lng ?? null,
    photo_url: typeof payload.photoUrl === 'string' && payload.photoUrl.startsWith('http')
      ? payload.photoUrl
      : null,
    statut: payload.statut || 'IDENTIFIE',
    date_creation: payload.dateCreation,
    commercial_assignee: payload.commercialAssignee,
    commentaire: payload.commentaire,
    devis_associes: payload.devisAssocies || [],
    structure_id: payload.structureId || null,
  };
  const res = await apiRequest('/commercial/prospects', { method: 'POST', body: JSON.stringify(body) });
  return mapProspect(res?.data);
}

export async function addProspectVisit(prospectId, visit, newStatus) {
  const body = {
    date_visite: visit.date,
    commercial: visit.commercial,
    resultat: visit.resultat,
    commentaire: visit.commentaire,
    prochaine_action: visit.prochaineAction,
    statut: newStatus || undefined,
  };
  const res = await apiRequest(`/commercial/prospects/${prospectId}/visites`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return mapProspect(res?.data?.prospect);
}

export async function convertProspect(prospectId) {
  const res = await apiRequest(`/commercial/prospects/${prospectId}/convertir`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  return mapProspect(res?.data);
}
