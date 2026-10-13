import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Users,
  Circle,
  X,
  Send,
  Paperclip,
  Loader2,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import {
  fetchOnlineColleagues,
  sendPresenceNote,
  sendPresenceFile,
} from '../../services/presenceApi';

/**
 * Panneau collègues en ligne — filtrés par province / ville antenne de l'agent connecté.
 */
export default function OnlineColleaguesPanel({
  isOpen,
  onClose,
  currentUser,
  onOpenConnect,
}) {
  const [loading, setLoading] = useState(false);
  const [colleagues, setColleagues] = useState([]);
  const [ville, setVille] = useState(currentUser?.ville || '');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchOnlineColleagues();
      setColleagues(res.colleagues || []);
      setVille(res.ville || currentUser?.ville || currentUser?.entite || '');
    } catch (err) {
      setError(err?.message || 'Impossible de charger les collègues en ligne.');
      setColleagues([]);
    } finally {
      setLoading(false);
    }
  }, [isOpen, currentUser?.ville, currentUser?.entite]);

  useEffect(() => {
    refresh();
    if (!isOpen) return undefined;
    const timer = setInterval(refresh, 20000);
    return () => clearInterval(timer);
  }, [isOpen, refresh]);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
      setNote('');
      setSuccessMsg('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSendNote(e) {
    e?.preventDefault?.();
    if (!selected?.id || !note.trim() || sending) return;
    setSending(true);
    setError('');
    setSuccessMsg('');
    try {
      await sendPresenceNote(selected.id, note.trim());
      setSuccessMsg(`Note envoyée à ${selected.nom || selected.name}.`);
      setNote('');
    } catch (err) {
      setError(err?.message || 'Envoi de la note impossible.');
    } finally {
      setSending(false);
    }
  }

  async function handleSendFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !selected?.id || sending) return;
    setSending(true);
    setError('');
    setSuccessMsg('');
    try {
      await sendPresenceFile(selected.id, file, note.trim());
      setSuccessMsg(`Fichier « ${file.name} » envoyé à ${selected.nom || selected.name}.`);
      setNote('');
    } catch (err) {
      setError(err?.message || 'Envoi du fichier impossible.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-md border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-[#2E68B4] flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collègues en ligne
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Uniquement votre province
              {ville ? ` — ${ville}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {error && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {successMsg && (
            <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {successMsg}
            </p>
          )}

          {loading && colleagues.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Recherche des agents connectés…
            </div>
          )}

          {!loading && colleagues.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Circle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold">Aucun collègue en ligne dans votre province</p>
              <p className="text-[11px] mt-1">
                Seuls les agents de la même antenne / ville apparaissent ici.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            {colleagues.map((c) => {
              const isSel = selected?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-md text-left border transition-all ${
                    isSel
                      ? 'border-[#2E68B4] bg-blue-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="relative">
                    <span className="w-9 h-9 rounded-full bg-[#2E68B4] text-white text-xs font-bold flex items-center justify-center">
                      {(c.nom || c.name || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00A651] border-2 border-white" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {c.nom || c.name}
                    </p>
                    <p className="text-[10px] text-[#00A651] truncate">{c.role || c.code_role}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {c.ville || c.entite || 'Province OPN'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#00A651]">En ligne</span>
                </button>
              );
            })}
          </div>

          {selected && (
            <form
              onSubmit={handleSendNote}
              className="pt-3 border-t border-slate-200 space-y-2"
            >
              <p className="text-[11px] font-bold text-slate-600">
                Contacter {selected.nom || selected.name}
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Écrire une note privée…"
                className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:outline-none focus:border-[#2E68B4]"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={sending || !note.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#2E68B4] hover:bg-[#24589a] disabled:opacity-40 text-white text-xs font-bold"
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Envoyer la note
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Joindre un fichier
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={handleSendFile}
                />
                {onOpenConnect && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenConnect();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[#2E68B4] text-xs font-bold hover:bg-blue-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Ouvrir OPN Connect
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
