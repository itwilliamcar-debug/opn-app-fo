/**
 * Présence collègues OPN — heartbeat + liste en ligne (province).
 */
import { getAuthToken, apiRequest } from './api';

const API_BASE_URL = 'http://127.0.0.1:8002/api/v1';

function authHeaders(extra = {}) {
  const headers = { Accept: 'application/json', ...extra };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function sendPresenceHeartbeat() {
  return apiRequest('/presence/heartbeat', { method: 'POST', body: '{}' });
}

export async function fetchOnlineColleagues() {
  const data = await apiRequest('/presence/online');
  return {
    provinceId: data?.province_id ?? null,
    ville: data?.ville ?? null,
    count: data?.count ?? 0,
    colleagues: Array.isArray(data?.data) ? data.data : [],
  };
}

export async function sendPresenceNote(recipientId, body) {
  return apiRequest('/presence/note', {
    method: 'POST',
    body: JSON.stringify({
      recipient_id: recipientId,
      body,
    }),
  });
}

export async function sendPresenceFile(recipientId, file, body = '') {
  const form = new FormData();
  form.append('recipient_id', String(recipientId));
  form.append('file', file);
  if (body) form.append('body', body);

  const response = await fetch(`${API_BASE_URL}/presence/file`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.message || `Erreur envoi fichier (${response.status})`);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}
