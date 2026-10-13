// Client API OPN → Laravel /api/v1

const API_BASE_URL = 'http://127.0.0.1:8002/api/v1';

let authToken = localStorage.getItem('opn_auth_token') || null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('opn_auth_token', token);
  } else {
    localStorage.removeItem('opn_auth_token');
  }
}

export function getAuthToken() {
  return authToken;
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Fetch JSON strict — throw on network / !ok (plus de null silencieux).
 * Timeout court : évite l'attente infinie si artisan serve est saturé (SSE).
 */
export async function apiRequest(path, options = {}) {
  const timeoutMs = options.timeoutMs ?? 10000;
  const { timeoutMs: _t, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        ...getHeaders(),
        ...(fetchOptions.headers || {}),
      },
    });
  } catch (error) {
    const aborted = error?.name === 'AbortError';
    throw new ApiError(
      aborted
        ? 'API Laravel trop lente ou saturée (127.0.0.1:8002). Vérifiez que php artisan serve tourne et qu’un seul processus écoute le port.'
        : (error?.message || 'API Laravel injoignable (127.0.0.1:8002).'),
      { status: 0 }
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    throw new ApiError(data?.message || 'Session Sanctum expiree ou absente.', {
      status: 401,
      data,
    });
  }

  if (!response.ok) {
    throw new ApiError(data?.message || `Erreur API (${response.status})`, {
      status: response.status,
      data,
    });
  }

  return data;
}

/**
 * Authentification Utilisateur (Sanctum)
 */
export async function loginUser(email, password) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    const data = await response.json().catch(() => ({}));
    if (data.token) {
      setAuthToken(data.token);
    }
    if (!response.ok && !data.message) {
      return { success: false, message: `Erreur login (${response.status})` };
    }
    return data;
  } catch (error) {
    const aborted = error?.name === 'AbortError';
    const message = aborted
      ? 'Connexion trop lente : API saturée. Lancez npm run start:opn puis réessayez.'
      : (error.message || 'API Laravel injoignable (127.0.0.1:8002).');
    console.warn('Erreur connexion API Laravel:', message);
    return { success: false, message };
  }
}

/**
 * Login démo 1 clic (local) — sans bcrypt ni 2FA.
 */
/**
 * Login démo 1 clic (local) — sans bcrypt ni 2FA.
 * 1 retry automatique si l’API démarre encore / worker froid.
 */
export async function demoQuickLogin(email) {
  const attempt = async (timeoutMs) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/demo-quick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (data.token) {
        setAuthToken(data.token);
      }
      if (!response.ok && !data.message) {
        return { success: false, message: `Erreur demo-quick (${response.status})` };
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    let res = await attempt(12000);
    if (res?.token) return res;
    // Proxy 502 / workers pas prêts → une seconde chance
    if (!res?.success) {
      await new Promise((r) => setTimeout(r, 800));
      res = await attempt(20000);
    }
    return res;
  } catch (error) {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      return await attempt(20000);
    } catch (error2) {
      const aborted = error2?.name === 'AbortError' || error?.name === 'AbortError';
      const offline =
        /Failed to fetch|NetworkError|ECONNREFUSED|injoignable/i.test(
          String(error2?.message || error?.message || '')
        );
      return {
        success: false,
        message: aborted || offline
          ? 'API trop lente ou arrêtée. Lancez npm run start:opn puis réessayez.'
          : (error2?.message || error?.message || 'API Laravel injoignable (127.0.0.1:8002).'),
      };
    }
  }
}

/**
 * Validation Code 2FA
 */
export async function verify2FA(email, code) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code })
    });
    const data = await response.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (error) {
    console.warn('Erreur 2FA:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Profil connecté (/auth/me)
 */
export async function fetchAuthMe() {
  return apiRequest('/auth/me');
}

/**
 * Tableau de bord national
 */
export async function fetchNationalOverview() {
  return apiRequest('/dashboard/national');
}

/**
 * Structures Sanitaires
 */
export async function fetchStructures(antenneId = null, typeStructure = 'ALL') {
  const params = new URLSearchParams();
  if (antenneId) params.append('antenne_id', antenneId);
  if (typeStructure && typeStructure !== 'ALL') params.append('type_structure', typeStructure);
  return apiRequest(`/structures?${params.toString()}`);
}

/**
 * Antennes provinciales.
 * Endpoint dédié /antennes ; fallback structures si besoin.
 */
export async function fetchAntennes() {
  try {
    const data = await apiRequest('/antennes');
    if (Array.isArray(data?.antennes) && data.antennes.length) {
      return { success: true, antennes: data.antennes };
    }
  } catch {
    /* fallback ci-dessous */
  }

  const data = await fetchStructures();
  const map = new Map();
  for (const structure of data.structures || []) {
    const antenne = structure.antenne;
    if (antenne?.id != null && !map.has(antenne.id)) {
      map.set(antenne.id, antenne);
    }
  }
  return {
    success: true,
    antennes: Array.from(map.values()).sort((a, b) =>
      String(a.nom || '').localeCompare(String(b.nom || ''), 'fr')
    ),
  };
}

/**
 * Produits et Lots FEFO
 */
export async function fetchProducts(search = '', categorie = 'ALL') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (categorie && categorie !== 'ALL') params.append('categorie', categorie);
  return apiRequest(`/pharmacy/produits?${params.toString()}`);
}

/**
 * Demandes d'approvisionnement
 */
export async function fetchOrders(antenneId = null, statut = 'ALL') {
  const params = new URLSearchParams();
  if (antenneId) params.append('antenne_id', antenneId);
  if (statut && statut !== 'ALL') params.append('statut', statut);
  return apiRequest(`/supply/orders?${params.toString()}`);
}

/**
 * Détail d'une demande avec historique non-destructif
 */
export async function fetchOrderDetail(id) {
  return apiRequest(`/supply/orders/${id}`);
}

/**
 * Simulation CMM
 */
export async function simulateCMM(antenneId, produitId, stockSecuriteJours = 45, coeffSaisonnier = 1.2) {
  return apiRequest('/supply/simulate-cmm', {
    method: 'POST',
    body: JSON.stringify({
      antenne_id: antenneId,
      produit_id: produitId,
      stock_securite_jours: stockSecuriteJours,
      coeff_saisonnier: coeffSaisonnier,
    }),
  });
}

/**
 * Création d'une demande d'approvisionnement
 */
export async function createSupplyOrder(payload) {
  return apiRequest('/supply/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Validation Partielle (80/100) & Signature Électronique (Articles 16, 17, 18)
 */
export async function validatePartialSupplyOrder(id, payload) {
  return apiRequest(`/supply/orders/${id}/validate-partial`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Instruction Collaborateur Appro (prise en charge / clôture instruction) */
export async function instructSupplyOrder(id, payload) {
  return apiRequest(`/supply/orders/${id}/instruct`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Validation nationale Directeur Appro */
export async function validateNationalSupplyOrder(id, payload) {
  return apiRequest(`/supply/orders/${id}/validate-national`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Transmission Achats après validation Appro */
export async function transferSupplyOrderToAchats(id, payload) {
  return apiRequest(`/supply/orders/${id}/transfer-achats`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Rejet Appro (collaborateur ou directeur) */
export async function rejectSupplyOrder(id, payload) {
  return apiRequest(`/supply/orders/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Allocation FEFO des lots pour une demande */
export async function allocateFefo(id) {
  return apiRequest(`/supply/orders/${id}/allocate-fefo`, {
    method: 'POST',
    body: '{}',
  });
}

/** Confirmation FEFO après allocation */
export async function confirmFefo(id) {
  return apiRequest(`/supply/orders/${id}/confirm-fefo`, {
    method: 'POST',
    body: '{}',
  });
}

/** Lancer circuit visas DIR/DAF/DG */
export async function launchVisaCircuit(id, payload) {
  return apiRequest(`/supply/orders/${id}/launch-visas`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Visa DIR / DAF / DG */
export async function submitVisaSupplyOrder(id, payload) {
  return apiRequest(`/supply/orders/${id}/visa`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fournisseurs & Achats Internationaux (Procurement)
 */
export async function fetchSuppliers() {
  return apiRequest('/procurement/suppliers');
}

export async function fetchPurchaseOrders() {
  return apiRequest('/procurement/orders');
}

export async function createPurchaseOrder(payload) {
  return apiRequest('/procurement/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function advancePurchaseOrderWorkflow(id, payload) {
  return apiRequest(`/procurement/orders/${id}/workflow`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Logistique & Convois
 */
export async function fetchLogisticsMissions() {
  return apiRequest('/logistics/missions');
}

export async function createLogisticsMission(payload) {
  return apiRequest('/logistics/missions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateMissionStatus(id, payload) {
  return apiRequest(`/logistics/missions/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Scan QR Code avec détection anti-rejeu côté serveur (Article 23)
 */
export async function verifyDeliveryQrCode(qrToken, scannedByNom) {
  return apiRequest('/logistics/qr/verify', {
    method: 'POST',
    body: JSON.stringify({ qr_token: qrToken, scanned_by_nom: scannedByNom }),
  });
}

/**
 * Émargement et Signature Tactile Preuve de Livraison (Articles 24 & 25)
 */
export async function signOffDelivery(id, payload) {
  return apiRequest(`/logistics/deliveries/${id}/sign-off`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitMissionReport(id, payload) {
  return apiRequest(`/logistics/missions/${id}/report`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function closeDeliveryWorkflow(id, payload) {
  return apiRequest(`/logistics/deliveries/${id}/close`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Gouvernance Appro — tâches / contrôle / corrections */
export async function fetchGovernanceToday() {
  return apiRequest('/supply/governance/today');
}

export async function fetchGovernanceTasks(params = {}) {
  const q = new URLSearchParams();
  if (params.statut) q.set('statut', params.statut);
  if (params.demande_id) q.set('demande_id', String(params.demande_id));
  if (params.mine) q.set('mine', '1');
  const qs = q.toString();
  return apiRequest(`/supply/governance/tasks${qs ? `?${qs}` : ''}`);
}

export async function fetchGovernanceCollaborators() {
  return apiRequest('/supply/governance/collaborators');
}

export async function createGovernanceTask(payload) {
  return apiRequest('/supply/governance/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function startGovernanceTask(id) {
  return apiRequest(`/supply/governance/tasks/${id}/start`, { method: 'POST', body: '{}' });
}

export async function submitGovernanceTask(id, payload = {}) {
  return apiRequest(`/supply/governance/tasks/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function reassignGovernanceTask(id, payload) {
  return apiRequest(`/supply/governance/tasks/${id}/reassign`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function controlGovernanceTask(id, payload) {
  return apiRequest(`/supply/governance/tasks/${id}/control`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitGovernanceCorrection(id, payload) {
  return apiRequest(`/supply/governance/corrections/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchGovernanceTimeline(demandeId) {
  return apiRequest(`/supply/governance/dossiers/${demandeId}/timeline`);
}

/** GED Appro */
export async function fetchApproDocuments(params = {}) {
  const q = new URLSearchParams();
  if (params.demande_id) q.set('demande_id', String(params.demande_id));
  if (params.suggestion_id) q.set('suggestion_id', String(params.suggestion_id));
  if (params.statut) q.set('statut', params.statut);
  const qs = q.toString();
  return apiRequest(`/supply/documents${qs ? `?${qs}` : ''}`);
}

export async function uploadApproDocument(fields) {
  const form = new FormData();
  form.append('file', fields.file);
  form.append('titre', fields.titre);
  if (fields.categorie) form.append('categorie', fields.categorie);
  if (fields.confidentialite) form.append('confidentialite', fields.confidentialite);
  if (fields.demande_id) form.append('demande_id', String(fields.demande_id));
  if (fields.suggestion_id) form.append('suggestion_id', String(fields.suggestion_id));

  const headers = { Accept: 'application/json' };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/supply/documents`, {
    method: 'POST',
    headers,
    body: form,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data?.message || `Upload echoue (${response.status})`, { status: response.status, data });
  }
  return data;
}

export async function replaceApproDocumentVersion(id, file, motifVersion) {
  const form = new FormData();
  form.append('file', file);
  form.append('motif_version', motifVersion);

  const headers = { Accept: 'application/json' };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/supply/documents/${id}/versions`, {
    method: 'POST',
    headers,
    body: form,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data?.message || `Remplacement echoue (${response.status})`, { status: response.status, data });
  }
  return data;
}

export async function archiveApproDocument(id, motifArchivage) {
  return apiRequest(`/supply/documents/${id}/archive`, {
    method: 'POST',
    body: JSON.stringify({ motif_archivage: motifArchivage }),
  });
}

export async function downloadApproDocument(id, version = null) {
  const qs = version ? `?version=${version}` : '';
  const headers = { Accept: '*/*' };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/supply/documents/${id}/download${qs}`, { headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(data?.message || `Telechargement refuse (${response.status})`, { status: response.status, data });
  }
  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return { blob, filename: match?.[1] || `document-${id}` };
}

/** Suggestions DG */
export async function fetchSuggestionsDg(params = {}) {
  const q = new URLSearchParams();
  if (params.statut) q.set('statut', params.statut);
  if (params.inbox) q.set('inbox', '1');
  const qs = q.toString();
  return apiRequest(`/supply/suggestions-dg${qs ? `?${qs}` : ''}`);
}

export async function fetchSuggestionDg(id) {
  return apiRequest(`/supply/suggestions-dg/${id}`);
}

export async function createSuggestionDg(payload) {
  return apiRequest('/supply/suggestions-dg', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSuggestionDg(id, payload) {
  return apiRequest(`/supply/suggestions-dg/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function submitSuggestionDg(id) {
  return apiRequest(`/supply/suggestions-dg/${id}/submit`, { method: 'POST', body: '{}' });
}

export async function decideSuggestionDg(id, payload) {
  return apiRequest(`/supply/suggestions-dg/${id}/decide`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Urgences Sanitaires (Articles 28, 29, 30)
 *
 * POST /emergencies — payload requis :
 *   antenne_id (int), titre, lieu_precis, type_urgence, gravite, description
 * declarant_nom est optionnel / ignoré : le serveur utilise l'utilisateur Sanctum.
 */
export async function fetchEmergencies() {
  return apiRequest('/emergencies');
}

export async function triggerEmergencyAlert(payload) {
  const body = {
    antenne_id: Number(payload.antenne_id ?? payload.antenneId),
    titre: payload.titre,
    lieu_precis: payload.lieu_precis ?? payload.lieuPrecis,
    type_urgence: payload.type_urgence ?? payload.typeUrgence,
    gravite: payload.gravite,
    description: payload.description,
  };
  return apiRequest('/emergencies', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT /emergencies/{id}/resolve — id numérique DB.
 * auteur_nom optionnel (traçabilité client) ; le serveur clôture avec l'utilisateur authentifié.
 */
export async function resolveEmergency(id, auteurNom) {
  return apiRequest(`/emergencies/${id}/resolve`, {
    method: 'PUT',
    body: JSON.stringify(auteurNom ? { auteur_nom: auteurNom } : {}),
  });
}

/**
 * Helpdesk & Réinitialisation Mot de Passe Verrouillée (Article 43)
 */
export async function fetchItDestinationForUser(email = '') {
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  return apiRequest(`/helpdesk/it-destination?${params.toString()}`);
}

export async function requestPasswordReset(payload) {
  return apiRequest('/helpdesk/password-reset-request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Audit Trail ANINF
 */
export async function fetchAuditLogs() {
  return apiRequest('/audit/logs');
}

/**
 * Temps réel multi-utilisateurs :
 * - DEV / artisan serve : polling JSON /realtime/snapshot (non bloquant)
 * - SSE désactivé par défaut (évite saturation mono-thread + reconnexions EventSource)
 */
export function subscribeToRealtimeEvents(onEventCallback) {
  const useSse = String(import.meta.env.VITE_REALTIME_MODE || '').toLowerCase() === 'sse';

  if (!useSse) {
    let stopped = false;
    let lastEmergencyId = null;
    let inFlight = false;

    const tick = async () => {
      if (stopped || inFlight) return;
      const token = getAuthToken();
      if (!token) return;
      inFlight = true;
      try {
        const headers = {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(`${API_BASE_URL}/realtime/snapshot`, {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timer);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          onEventCallback({
            type: 'DISCONNECTED',
            message: data?.message || 'Snapshot temps réel indisponible.',
          });
          return;
        }
        onEventCallback({ type: 'CONNECTED', ...data });
        const latest = data?.latest_emergency;
        if (latest?.id && latest.id !== lastEmergencyId) {
          if (lastEmergencyId !== null) {
            onEventCallback({
              type: 'NEW_EMERGENCY',
              message: `Nouvelle alerte : ${latest.titre} (${latest.lieu_precis})`,
              incident: latest,
            });
          }
          lastEmergencyId = latest.id;
        }
      } catch (err) {
        if (!stopped) {
          onEventCallback({
            type: 'DISCONNECTED',
            message: err?.name === 'AbortError'
              ? 'API lente — snapshot temps réel ignoré.'
              : (err?.message || 'API injoignable.'),
          });
        }
      } finally {
        inFlight = false;
      }
    };

    tick();
    const interval = setInterval(tick, 30000);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }

  // Mode SSE explicite (prod derrière nginx/php-fpm) — fermeture sans reconnexion auto
  try {
    const token = getAuthToken();
    const url = token
      ? `${API_BASE_URL}/realtime/stream?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/realtime/stream`;
    const eventSource = new EventSource(url);
    let closed = false;
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEventCallback(data);
        // oneshot : fermer pour empêcher la tempête de reconnexions
        if (data?.mode === 'oneshot' || data?.type === 'CONNECTED') {
          closed = true;
          eventSource.close();
        }
      } catch (err) {
        console.warn('Erreur décodage SSE:', err);
      }
    };
    eventSource.onerror = () => {
      if (!closed) {
        onEventCallback({ type: 'DISCONNECTED', message: 'Flux temps réel déconnecté.' });
      }
      eventSource.close();
    };
    return () => {
      closed = true;
      eventSource.close();
    };
  } catch (e) {
    onEventCallback({ type: 'DISCONNECTED', message: e?.message || 'SSE non supporté.' });
    return () => {};
  }
}
