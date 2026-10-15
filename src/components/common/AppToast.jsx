import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function AppToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] w-56 max-w-[calc(100vw-2rem)] rounded-md bg-[#00A651] text-white shadow-lg border border-emerald-700/30 px-3 py-2.5 flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
      <p className="flex-1 min-w-0 text-xs leading-snug break-words">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-white/70 hover:text-white"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
