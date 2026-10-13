const configured = String(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_ORIGIN || '').replace(/\/$/, '');
const localOrigin = 'http://127.0.0.1:8002';
const productionOrigin = 'https://opn-app-bo-production.up.railway.app';

function isLocalAddress(value) {
  return !value || value.includes('127.0.0.1') || value.includes('localhost') || value.includes('REMPLACE');
}

export const API_ORIGIN = import.meta.env.DEV
  ? (isLocalAddress(configured) ? localOrigin : configured)
  : (isLocalAddress(configured) ? productionOrigin : configured);

export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
