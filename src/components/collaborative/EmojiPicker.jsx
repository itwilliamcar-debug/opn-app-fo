import React from 'react';
import { CONNECT_EMOJIS } from '../../data/connectEmojis';

/**
 * Sélecteur d'émojis simple (style WhatsApp) — sans animation.
 * mode "insert" : ajoute dans le champ texte
 * mode "send" / défaut : envoie l'émoji comme message
 */
export default function EmojiPicker({ onSelect, onClose, title = 'Émojis' }) {
  return (
    <div className="absolute bottom-full left-0 mb-2 z-30 w-72 max-w-[90vw] rounded-xl border border-slate-200 bg-white shadow-lg p-2.5">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          {title}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-800"
          >
            Fermer
          </button>
        )}
      </div>
      <div className="grid grid-cols-6 gap-0.5 max-h-48 overflow-y-auto">
        {CONNECT_EMOJIS.map((emoji) => (
          <button
            key={emoji.code}
            type="button"
            title={emoji.label}
            onClick={() => onSelect?.(emoji)}
            className="opn-emoji-picker-btn flex items-center justify-center h-10 rounded-lg hover:bg-slate-100 text-[22px] leading-none"
          >
            <span className="opn-emoji" aria-hidden>
              {emoji.unicode}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
