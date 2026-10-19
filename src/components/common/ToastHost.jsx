import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

const NOTICE_TONE = {
  success: 'bg-[#00A651] border-emerald-800/30',
  error: 'bg-rose-700 border-rose-900/30',
  warning: 'bg-amber-600 border-amber-800/30',
};

export default function ToastHost() {
  const [notices, setNotices] = useState([]);
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState('');
  const [hint, setHint] = useState('');
  const queue = useRef([]);
  const pendingRef = useRef(null);

  const open = (detail) => {
    pendingRef.current = detail;
    setReason('');
    setHint('');
    setPending(detail);
  };

  useEffect(() => {
    const onNotice = (event) => {
      const id = `${Date.now()}-${Math.random()}`;
      const item = { id, message: event.detail?.message, tone: event.detail?.tone || 'success' };
      setNotices((list) => [...list.slice(-3), item]);
      window.setTimeout(() => {
        setNotices((list) => list.filter((entry) => entry.id !== id));
      }, 4800);
    };

    const onConfirm = (event) => {
      const detail = event.detail;
      if (!detail?.resolve) return;
      if (pendingRef.current) {
        queue.current.push(detail);
        return;
      }
      open(detail);
    };

    window.addEventListener('opn-toast', onNotice);
    window.addEventListener('opn-confirm', onConfirm);
    return () => {
      window.removeEventListener('opn-toast', onNotice);
      window.removeEventListener('opn-confirm', onConfirm);
    };
  }, []);

  const finish = (value) => {
    pendingRef.current?.resolve?.(value);
    const next = queue.current.shift();
    if (next) {
      open(next);
      return;
    }
    pendingRef.current = null;
    setPending(null);
    setReason('');
    setHint('');
  };

  const accept = () => {
    if (pending?.reasonRequired && !reason.trim()) {
      setHint('Indiquez un motif pour confirmer.');
      return;
    }
    finish({ reason: reason.trim() });
  };

  const danger = pending?.tone === 'danger';

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[210] flex flex-col gap-2 w-72 max-w-[calc(100vw-2rem)] pointer-events-none">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`pointer-events-auto rounded-md text-white shadow-lg px-3 py-2.5 flex items-start gap-2 border ${NOTICE_TONE[notice.tone] || NOTICE_TONE.success}`}
          >
            {notice.tone === 'error' || notice.tone === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <p className="flex-1 min-w-0 text-xs leading-snug break-words">{notice.message}</p>
            <button
              type="button"
              onClick={() => setNotices((list) => list.filter((entry) => entry.id !== notice.id))}
              className="shrink-0 text-white/70 hover:text-white"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {pending && (
        <div className={`fixed top-4 right-4 z-[220] w-80 max-w-[calc(100vw-2rem)] rounded-lg shadow-2xl border p-3 text-slate-900 ${danger ? 'bg-rose-50 border-rose-200' : 'bg-white border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${danger ? 'text-rose-600' : 'text-amber-600'}`} />
            <p className="flex-1 text-xs leading-snug font-medium">{pending.message}</p>
            <button type="button" onClick={() => finish(null)} className="text-slate-400 hover:text-slate-700" aria-label="Annuler">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {pending.reasonLabel && (
            <label className="block mt-2 text-[11px] font-semibold text-slate-600">
              {pending.reasonLabel}
              <textarea
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setHint('');
                }}
                rows={2}
                className="mt-1 w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#2E68B4]"
              />
            </label>
          )}
          {hint && <p className="mt-1 text-[11px] text-rose-600">{hint}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => finish(null)}
              className="px-2.5 py-1.5 rounded border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50"
            >
              {pending.cancelLabel || 'Annuler'}
            </button>
            <button
              type="button"
              onClick={accept}
              className={`px-2.5 py-1.5 rounded text-[11px] font-bold text-white ${danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#00A651] hover:bg-[#008742]'}`}
            >
              {pending.confirmLabel || 'Confirmer'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
