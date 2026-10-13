import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getAuthToken } from './api';
import { isRealSanctumToken } from './sanctumSession';
import { API_ORIGIN } from './apiOrigin';

/**
 * Laravel Echo + Reverb pour OPN Connect.
 * Auth canal privé via POST /broadcasting/auth (Sanctum Bearer).
 */

let echoInstance = null;
let lastToken = null;

function reverbConfigured() {
  return Boolean(import.meta.env.VITE_REVERB_APP_KEY);
}

/**
 * @returns {import('laravel-echo').default | null}
 */
export function getEcho() {
  if (!reverbConfigured()) return null;

  const token = getAuthToken();
  if (!isRealSanctumToken(token)) {
    disconnectEcho();
    return null;
  }

  if (echoInstance && lastToken === token) {
    return echoInstance;
  }

  disconnectEcho();

  window.Pusher = Pusher;

  const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
  const forceTLS = scheme === 'https';
  const port = Number(import.meta.env.VITE_REVERB_PORT || 6001);

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: port,
    wssPort: port,
    forceTLS,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${API_ORIGIN}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  lastToken = token;
  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    try {
      echoInstance.disconnect();
    } catch {
      /* ignore */
    }
    echoInstance = null;
    lastToken = null;
  }
}

export function isRealtimeAvailable() {
  return reverbConfigured() && isRealSanctumToken(getAuthToken());
}
