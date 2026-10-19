import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function AppToast({ message, onClose, tone = 'success', className = '' }) {
  if (!message) return null;
  const error = tone === 'error';

  return (
    <div className={`fixed right-4 z-[70] ${className || 'top-4'} ${error ? 'w-64' : 'w-56'} max-w-[calc(100vw-2rem)] rounded-md text-white shadow-lg px-3 py-2.5 flex items-start gap-2 ${error ? 'bg-rose-700 border border-rose-900/30' : 'bg-[#00A651] border border-emerald-700/30'}`}>
      {error ? (
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-white" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
      )}
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
