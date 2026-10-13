/**
 * Persistance locale des formulaires publics / IAM (session navigateur).
 */

const KEYS = {
  contact: 'opn_contact_messages',
  marches: 'opn_marches_submissions',
  iamUsers: 'opn_iam_local_users',
  iamAllUsers: 'opn_iam_all_users',
  iamResets: 'opn_iam_password_resets',
};

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(0, 300)));
  } catch (e) {
    console.warn('Erreur écriture localStorage:', e);
  }
}

export function persistContactMessage(payload) {
  const entry = {
    id: `MSG-${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  const list = readList(KEYS.contact);
  list.unshift(entry);
  writeList(KEYS.contact, list);
  return entry;
}

export function persistMarcheSubmission(payload) {
  const entry = {
    id: `SOUM-${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  const list = readList(KEYS.marches);
  list.unshift(entry);
  writeList(KEYS.marches, list);
  return entry;
}

export function saveAllIamUsers(users) {
  writeList(KEYS.iamAllUsers, users);
}

export function loadAllIamUsers(fallbackPersonas = []) {
  const persisted = readList(KEYS.iamAllUsers);
  if (persisted && persisted.length > 0) {
    return persisted;
  }
  const localAdded = readList(KEYS.iamUsers);
  const ids = new Set(fallbackPersonas.map((u) => u.id));
  const merged = [...localAdded.filter((u) => !ids.has(u.id)), ...fallbackPersonas];
  writeList(KEYS.iamAllUsers, merged);
  return merged;
}

export function persistIamUser(user) {
  const list = readList(KEYS.iamUsers);
  list.unshift(user);
  writeList(KEYS.iamUsers, list);

  const all = readList(KEYS.iamAllUsers);
  const updatedAll = [user, ...all.filter((u) => u.id !== user.id)];
  writeList(KEYS.iamAllUsers, updatedAll);
  return user;
}

export function updatePersistedIamUser(updatedUser) {
  const all = readList(KEYS.iamAllUsers);
  const updatedAll = all.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
  writeList(KEYS.iamAllUsers, updatedAll);

  const list = readList(KEYS.iamUsers);
  const updatedList = list.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
  writeList(KEYS.iamUsers, updatedList);
  return updatedUser;
}

export function deletePersistedIamUser(userId) {
  const all = readList(KEYS.iamAllUsers);
  const filteredAll = all.filter((u) => u.id !== userId);
  writeList(KEYS.iamAllUsers, filteredAll);

  const list = readList(KEYS.iamUsers);
  const filteredList = list.filter((u) => u.id !== userId);
  writeList(KEYS.iamUsers, filteredList);
  return true;
}

export function loadPersistedIamUsers() {
  return readList(KEYS.iamUsers);
}

export function persistPasswordReset(record) {
  const list = readList(KEYS.iamResets);
  list.unshift({ ...record, at: new Date().toISOString() });
  writeList(KEYS.iamResets, list);
  return record;
}
