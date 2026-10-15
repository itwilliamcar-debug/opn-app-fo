const ACTIVITY_KEY = 'opn_last_activity_at';
const REFRESHED_KEY = 'opn_token_refreshed_at';
const LOCK_KEY = 'opn_token_refresh_lock';
const USER_KEY = 'opn_session_user';
const VIEW_KEY = 'opn_session_view';

/** Déconnexion après une heure sans action de l'utilisateur. */
export const IDLE_TIMEOUT_MS = 60 * 60 * 1000;

/** Renouvellement du jeton pendant que la session est encore active. */
export const REFRESH_EVERY_MS = 15 * 60 * 1000;

export function markSessionActivity(at = Date.now()) {
  localStorage.setItem(ACTIVITY_KEY, String(at));
}

export function markTokenRefreshed(at = Date.now()) {
  localStorage.setItem(REFRESHED_KEY, String(at));
}

export function clearSessionClock() {
  localStorage.removeItem(ACTIVITY_KEY);
  localStorage.removeItem(REFRESHED_KEY);
  localStorage.removeItem(LOCK_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(VIEW_KEY);
}

export function persistSessionUser(user) {
  if (!user?.email) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  const copie = { ...user };
  delete copie.password;
  localStorage.setItem(USER_KEY, JSON.stringify(copie));
}

export function readSessionUser() {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return user?.email ? user : null;
  } catch {
    return null;
  }
}

export function persistSessionView(view) {
  if (!view || view === 'public') return;
  localStorage.setItem(VIEW_KEY, view);
}

export function readSessionView() {
  try {
    return localStorage.getItem(VIEW_KEY) || null;
  } catch {
    return null;
  }
}

export function lastActivityAt() {
  const value = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

export function isSessionIdle(now = Date.now()) {
  const last = lastActivityAt();
  if (!last) return false;
  return now - last >= IDLE_TIMEOUT_MS;
}

export function tokenRefreshDue(now = Date.now()) {
  const refreshed = Number(localStorage.getItem(REFRESHED_KEY) || 0);
  if (!refreshed) return true;
  return now - refreshed >= REFRESH_EVERY_MS;
}

export function claimRefreshLock(now = Date.now()) {
  const existing = Number(localStorage.getItem(LOCK_KEY) || 0);
  if (existing && now - existing < 45000) return false;
  localStorage.setItem(LOCK_KEY, String(now));
  return true;
}

export function releaseRefreshLock() {
  localStorage.removeItem(LOCK_KEY);
}
