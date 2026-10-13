import React, { useState } from 'react';
import { QUICK_REACTIONS, normalizeReactions } from '../../data/connectEmojis';

/**
 * Réactions WhatsApp sous un message — chacun choisit librement son emoji.
 */
export default function MessageReactions({
  message,
  myUserId = null,
  disabled = false,
  onReact,
}) {
  const [open, setOpen] = useState(false);
  const reactions = normalizeReactions(message, myUserId);

  return (
    <div className="relative flex flex-wrap items-center gap-1 pt-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          disabled={disabled}
          title="Réagir"
          onClick={() => onReact?.(r.emoji)}
          className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] leading-none transition-colors disabled:opacity-40 ${
            r.reacted_by_me
              ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          }`}
        >
          <span className="opn-emoji text-sm">{r.emoji}</span>
          <span className="font-semibold tabular-nums">{r.count}</span>
        </button>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 text-xs hover:bg-slate-50 disabled:opacity-40"
        title="Ajouter une réaction"
      >
        🙂
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 flex flex-wrap gap-0.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                onReact?.(emoji);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-slate-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
