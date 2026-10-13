/**
 * OPN Connect — API client (Sanctum)
 * Messagerie privée, audio, emoji, Jitsi
 */
import { getAuthToken } from './api';
import { API_BASE_URL } from './apiOrigin';

function getHeaders(extra = {}) {
  const headers = {
    Accept: 'application/json',
    ...extra,
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function getJsonHeaders() {
  return getHeaders({ 'Content-Type': 'application/json' });
}

async function parseResponse(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 403) {
    const err = new Error(
      data?.message || 'Accès refusé — vous n’êtes pas membre'
    );
    err.status = 403;
    err.data = data;
    throw err;
  }

  if (response.status === 401) {
    const err = new Error(
      data?.message || 'Session expirée — reconnectez-vous via Accès Intranet'
    );
    err.status = 401;
    err.data = data;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(
      data?.message || `Erreur API Connect (${response.status})`
    );
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.conversations)) return payload.conversations;
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
}

function unwrapItem(payload) {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

/** Liste des conversations dont l'utilisateur est membre */
export async function fetchConversations() {
  const response = await fetch(`${API_BASE_URL}/connect/conversations`, {
    headers: getJsonHeaders(),
  });
  const data = await parseResponse(response);
  return unwrapList(data);
}

/** Créer une discussion privée / groupe */
export async function createConversation({
  type = 'group',
  title,
  member_ids = [],
  description,
} = {}) {
  const body = {
    type,
    member_ids,
  };
  if (title) body.title = title;
  if (description) body.description = description;

  const response = await fetch(`${API_BASE_URL}/connect/conversations`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/**
 * Messages d'une conversation.
 * @param {number|string} conversationId
 * @param {{ afterId?: number|string|null }} [opts]
 */
export async function fetchMessages(conversationId, { afterId } = {}) {
  const params = new URLSearchParams();
  if (afterId != null && afterId !== '') {
    params.set('after_id', String(afterId));
  }
  const qs = params.toString();
  const url = `${API_BASE_URL}/connect/conversations/${conversationId}/messages${
    qs ? `?${qs}` : ''
  }`;

  const response = await fetch(url, { headers: getJsonHeaders() });
  const data = await parseResponse(response);
  return unwrapList(data);
}

/** Envoyer un message texte ou emoji */
export async function sendMessage(conversationId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(payload),
    }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Réagir à un message (toggle WhatsApp : 1 emoji / user) */
export async function reactToMessage(messageId, emoji) {
  const response = await fetch(
    `${API_BASE_URL}/connect/messages/${messageId}/reactions`,
    {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({ emoji }),
    }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Note vocale (multipart) */
export async function sendAudioMessage(conversationId, blob, durationSec) {
  const form = new FormData();
  const ext = blob.type?.includes('ogg') ? 'ogg' : 'webm';
  form.append('audio', blob, `note-vocale.${ext}`);
  form.append('duration_sec', String(Math.max(1, Math.round(durationSec || 1))));

  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/messages/audio`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: form,
    }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Marquer comme lu */
export async function markConversationRead(conversationId) {
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/read`,
    {
      method: 'POST',
      headers: getJsonHeaders(),
    }
  );
  return parseResponse(response);
}

/** Ajouter des membres */
export async function addMembers(conversationId, userIds) {
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/members`,
    {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({ user_ids: userIds }),
    }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Annuaire des utilisateurs joignables */
export async function fetchDirectory() {
  const response = await fetch(`${API_BASE_URL}/connect/directory`, {
    headers: getJsonHeaders(),
  });
  const data = await parseResponse(response);
  return unwrapList(data);
}

/** Infos salle visio native OPN (WebRTC) */
export async function fetchJitsiRoom(conversationId) {
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/jitsi`,
    { headers: getJsonHeaders() }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Publier un signal WebRTC */
export async function postVisioSignal(conversationId, { type, payload = null, target_user_id = null } = {}) {
  const body = { type };
  if (payload != null) body.payload = payload;
  if (target_user_id != null) body.target_user_id = target_user_id;
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/visio/signal`,
    {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(body),
    }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Lire les signaux WebRTC (polling) */
export async function fetchVisioSignals(conversationId, { afterTs = null } = {}) {
  const params = new URLSearchParams();
  if (afterTs) params.set('after_ts', afterTs);
  const qs = params.toString();
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/visio/signals${qs ? `?${qs}` : ''}`,
    { headers: getJsonHeaders() }
  );
  const data = await parseResponse(response);
  return {
    signals: unwrapList(data),
    room: data?.room || null,
    userId: data?.user_id ?? data?.userId ?? null,
    provider: data?.provider || 'opn_webrtc',
  };
}

/**
 * Annonce une invitation visio aux membres (message système + meta).
 * Le destinataire peut la détecter même hors de l'écran Connect.
 */
export async function announceVisioInvite(conversationId, {
  room,
  callerName,
  title,
} = {}) {
  const body = `${callerName || 'Un collègue OPN'} vous invite à rejoindre la visioconférence${
    title ? ` « ${title} »` : ''
  }.`;
  return sendMessage(conversationId, {
    type: 'system',
    body,
    meta: {
      kind: 'visio_invite',
      room: room || null,
      conversation_id: Number(conversationId),
      caller_name: callerName || null,
      title: title || null,
      started_at: new Date().toISOString(),
    },
  });
}

/** Démarre une visio + crée l'invitation serveur (recommandé) */
export async function startVisioCall(conversationId, { title } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/connect/conversations/${conversationId}/visio/start`,
    {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(title ? { title } : {}),
    }
  );
  const data = await parseResponse(response);
  return unwrapItem(data);
}

/** Invitations visio destinées à l'utilisateur courant */
export async function fetchIncomingVisioInvites() {
  const response = await fetch(`${API_BASE_URL}/connect/visio/incoming`, {
    headers: getJsonHeaders(),
  });
  const data = await parseResponse(response);
  return unwrapList(data);
}

const RING_STORAGE_KEY = 'opn_visio_ring_v1';
const RING_CHANNEL = 'opn_visio_ring';

/** Publie une sonnerie locale (multi-onglets / même poste) */
export function publishVisioRing(payload) {
  const envelope = {
    ...payload,
    published_at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(RING_STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    /* ignore */
  }
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(RING_CHANNEL);
      ch.postMessage(envelope);
      ch.close();
    }
  } catch {
    /* ignore */
  }
  return envelope;
}

export function readVisioRing() {
  try {
    const raw = localStorage.getItem(RING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function subscribeVisioRing(onRing) {
  const onStorage = (e) => {
    if (e.key !== RING_STORAGE_KEY || !e.newValue) return;
    try {
      onRing(JSON.parse(e.newValue));
    } catch {
      /* ignore */
    }
  };
  window.addEventListener('storage', onStorage);

  let channel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(RING_CHANNEL);
      channel.onmessage = (ev) => {
        if (ev?.data) onRing(ev.data);
      };
    }
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener('storage', onStorage);
    try {
      channel?.close();
    } catch {
      /* ignore */
    }
  };
}

/** Extrait une invitation visio active depuis un message Connect */
export function parseVisioInvite(message, { myEmail = null, maxAgeMs = 20 * 60 * 1000 } = {}) {
  if (!message) return null;
  const type = String(message.type || '').toLowerCase();
  const meta = message.meta || {};
  if (type !== 'system' || meta.kind !== 'visio_invite') return null;

  const senderEmail = (
    message.sender?.email ||
    message.user?.email ||
    meta.caller_email ||
    ''
  ).toLowerCase();
  if (myEmail && senderEmail && senderEmail === String(myEmail).toLowerCase()) {
    return null; // ne pas sonner pour soi-même
  }

  const started = meta.started_at || message.created_at;
  if (started) {
    const t = new Date(started).getTime();
    if (Number.isFinite(t) && Date.now() - t > maxAgeMs) return null;
  }

  return {
    messageId: message.id,
    conversationId: meta.conversation_id || message.conversation_id,
    room: meta.room || null,
    callerName: meta.caller_name || message.sender?.name || message.user?.name || 'Collègue OPN',
    title: meta.title || null,
    startedAt: started || null,
  };
}

export { API_BASE_URL as CONNECT_API_BASE_URL };
