import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Send, Lightbulb } from 'lucide-react';
import {
  createSuggestionDg,
  decideSuggestionDg,
  fetchSuggestionDg,
  fetchSuggestionsDg,
  submitSuggestionDg,
  updateSuggestionDg,
} from '../../services/api';

const TYPES = [
  'RECOMMANDATION', 'ALERTE', 'PROPOSITION_ACHAT', 'PARTENARIAT',
  'BESOIN_STRATEGIQUE', 'AMELIORATION', 'STOCK', 'FOURNISSEUR', 'RUPTURE', 'ANALYSE',
];

const STATUS_TONE = {
  BROUILLON: 'bg-slate-100 text-slate-700',
  SOUMISE: 'bg-amber-100 text-amber-800',
  EN_ETUDE: 'bg-sky-100 text-sky-800',
  ACCEPTEE: 'bg-emerald-100 text-emerald-800',
  REFUSEE: 'bg-rose-100 text-rose-800',
  CORRECTION_DEMANDEE: 'bg-orange-100 text-orange-900',
  MISE_EN_OEUVRE: 'bg-violet-100 text-violet-800',
  CLOTUREE: 'bg-slate-200 text-slate-600',
};

/**
 * @param {'appro'|'dg'} mode
 */
export default function ApproSuggestionsDgPanel({
  mode = 'appro',
  orders = [],
  onFlash,
}) {
  const isDg = mode === 'dg';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    type: 'RECOMMANDATION',
    contenu: '',
    priorite: 'NORMALE',
    demande_id: '',
  });
  const [decision, setDecision] = useState({ decision: 'EN_ETUDE', commentaire: '' });
  const [editContenu, setEditContenu] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSuggestionsDg(isDg ? { inbox: '1' } : {});
      setItems(res.suggestions || []);
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Erreur suggestions DG');
    } finally {
      setLoading(false);
    }
  }, [isDg, onFlash]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (id) => {
    try {
      const res = await fetchSuggestionDg(id);
      setSelected(res.suggestion);
      setEditContenu(res.suggestion?.contenu || '');
    } catch (err) {
      if (err?.message && !err.backendUnavailable) onFlash(err.message);
    }
  };

  const run = async (key, fn) => {
    setBusy(key);
    try {
      await fn();
      onFlash?.('Suggestion mise à jour');
      await load();
      if (selected?.id) await openDetail(selected.id);
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Échec');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <Lightbulb className="h-4 w-4 text-[#2E68B4]" />
          {isDg ? 'Suggestions reçues (Appro → DG)' : 'Suggestions au DG National'}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Circuit réel : brouillon → soumission → étude / décision DG → correction éventuelle.
        </p>
      </div>

      {!isDg && (
        <section className="rounded border border-slate-200 bg-white p-4 space-y-2">
          <h3 className="text-sm font-semibold">Nouvelle suggestion</h3>
          <input
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Titre"
            value={form.titre}
            onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <select
              className="rounded border border-slate-200 px-2 py-1.5 text-sm"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="rounded border border-slate-200 px-2 py-1.5 text-sm"
              value={form.priorite}
              onChange={(e) => setForm((f) => ({ ...f, priorite: e.target.value }))}
            >
              <option value="NORMALE">Normale</option>
              <option value="HAUTE">Haute</option>
              <option value="URGENTE">Urgente</option>
            </select>
            <select
              className="rounded border border-slate-200 px-2 py-1.5 text-sm"
              value={form.demande_id}
              onChange={(e) => setForm((f) => ({ ...f, demande_id: e.target.value }))}
            >
              <option value="">Sans dossier lié</option>
              {orders.slice(0, 60).map((o) => (
                <option key={o.id} value={o.id}>{o.numero_demande}</option>
              ))}
            </select>
          </div>
          <textarea
            rows={4}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Contenu détaillé (≥ 20 caractères)"
            value={form.contenu}
            onChange={(e) => setForm((f) => ({ ...f, contenu: e.target.value }))}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy === 'create'}
              onClick={() =>
                run('create', async () => {
                  await createSuggestionDg({
                    ...form,
                    demande_id: form.demande_id ? Number(form.demande_id) : null,
                    soumettre: false,
                  });
                  setForm({ titre: '', type: 'RECOMMANDATION', contenu: '', priorite: 'NORMALE', demande_id: '' });
                })
              }
              className="rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold"
            >
              Enregistrer brouillon
            </button>
            <button
              type="button"
              disabled={busy === 'create-sub'}
              onClick={() =>
                run('create-sub', async () => {
                  await createSuggestionDg({
                    ...form,
                    demande_id: form.demande_id ? Number(form.demande_id) : null,
                    soumettre: true,
                  });
                  setForm({ titre: '', type: 'RECOMMANDATION', contenu: '', priorite: 'NORMALE', demande_id: '' });
                })
              }
              className="inline-flex items-center gap-1 rounded bg-[#2E68B4] px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Send className="h-3 w-3" /> Soumettre au DG
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-3 py-2 text-sm font-semibold">
            {isDg ? 'File DG' : 'Mes suggestions'} ({items.length})
          </div>
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-8 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
            </div>
          ) : items.length === 0 ? (
            <p className="px-3 py-8 text-sm text-slate-500">Aucune suggestion.</p>
          ) : (
            <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
              {items.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => openDetail(s.id)}
                    className="w-full px-3 py-2.5 text-left hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{s.numero_suggestion} — {s.titre}</p>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_TONE[s.statut] || STATUS_TONE.BROUILLON}`}>
                        {s.statut}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {s.type} · v{s.version} · {s.auteur?.name || '—'}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {isDg && (
            <button
              type="button"
              onClick={() => fetchSuggestionsDg({}).then((r) => setItems(r.suggestions || []))}
              className="w-full border-t border-slate-100 px-3 py-2 text-xs text-[#2E68B4]"
            >
              Voir tout l&apos;historique
            </button>
          )}
        </section>

        <section className="rounded border border-slate-200 bg-white p-4">
          {!selected ? (
            <p className="text-sm text-slate-500">Sélectionnez une suggestion pour le dossier complet.</p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="font-mono text-xs text-slate-500">{selected.numero_suggestion}</p>
                <h3 className="text-sm font-semibold text-slate-900">{selected.titre}</h3>
                <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_TONE[selected.statut]}`}>
                  {selected.statut}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{selected.contenu}</p>
              {selected.motif_correction && (
                <p className="rounded border border-orange-200 bg-orange-50 p-2 text-xs text-orange-900">
                  Correction demandée : {selected.motif_correction}
                </p>
              )}
              {selected.dg_commentaire && (
                <p className="rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                  Commentaire DG : {selected.dg_commentaire}
                </p>
              )}

              {!isDg && ['BROUILLON', 'CORRECTION_DEMANDEE'].includes(selected.statut) && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <textarea
                    rows={3}
                    className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                    value={editContenu}
                    onChange={(e) => setEditContenu(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy === 'upd'}
                      onClick={() =>
                        run('upd', () => updateSuggestionDg(selected.id, { contenu: editContenu }))
                      }
                      className="rounded border border-slate-200 px-2.5 py-1 text-[11px] font-semibold"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      disabled={busy === 'sub'}
                      onClick={() => run('sub', () => submitSuggestionDg(selected.id))}
                      className="rounded bg-[#2E68B4] px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Soumettre
                    </button>
                  </div>
                </div>
              )}

              {isDg && ['SOUMISE', 'EN_ETUDE', 'ACCEPTEE', 'MISE_EN_OEUVRE'].includes(selected.statut) && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-1">
                    {['EN_ETUDE', 'ACCEPTEE', 'REFUSEE', 'CORRECTION_DEMANDEE', 'MISE_EN_OEUVRE', 'CLOTUREE'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDecision((x) => ({ ...x, decision: d }))}
                        className={`rounded px-2 py-1 text-[10px] font-semibold ${
                          decision.decision === d ? 'bg-[#2E68B4] text-white' : 'border border-slate-200 bg-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                    placeholder="Commentaire / motif (obligatoire)"
                    value={decision.commentaire}
                    onChange={(e) => setDecision((x) => ({ ...x, commentaire: e.target.value }))}
                  />
                  <button
                    type="button"
                    disabled={busy === 'dec'}
                    onClick={() =>
                      run('dec', () =>
                        decideSuggestionDg(selected.id, {
                          decision: decision.decision,
                          commentaire: decision.commentaire,
                        })
                      )
                    }
                    className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Enregistrer décision DG
                  </button>
                </div>
              )}

              {(selected.evenements || []).length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Timeline</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {selected.evenements.map((e) => (
                      <li key={e.id}>
                        <span className="font-semibold">{e.type_evenement}</span>
                        {' — '}{e.acteur_nom}
                        {e.details ? ` : ${e.details}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
