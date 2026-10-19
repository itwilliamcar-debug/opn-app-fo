function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function pushToast(message, tone = 'success') {
  if (!message) return;
  emit('opn-toast', { message: String(message), tone });
}

/**
 * Confirmation dans un toast (pas d'alerte navigateur).
 * Retourne null si annulé, sinon { reason }.
 */
export function askConfirm({
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  tone = 'warning',
  reasonLabel = '',
  reasonRequired = false,
} = {}) {
  return new Promise((resolve) => {
    emit('opn-confirm', {
      message: String(message || 'Confirmer cette action ?'),
      confirmLabel,
      cancelLabel,
      tone,
      reasonLabel,
      reasonRequired,
      resolve,
    });
  });
}
