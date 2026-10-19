import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Send,
  UserPlus,
} from 'lucide-react';
import {
  controlGovernanceTask,
  createGovernanceTask,
  fetchGovernanceCollaborators,
  fetchGovernanceToday,
  startGovernanceTask,
  submitGovernanceCorrection,
  submitGovernanceTask,
} from '../../services/api';

const STATUS_LABEL = {
  A_FAIRE: 'À faire',
  EN_COURS: 'En cours',
  SOUMISE_CONTROLE: 'Soumise contrôle',
  CORRECTION_DEMANDEE: 'Correction demandée',
  CORRECTION_EFFECTUEE: 'Correction effectuée',
  VALIDEE: 'Validée',
  CLOTUREE: 'Clôturée',
  BLOQUEE: 'Bloquée',
  EN_ATTENTE: 'En attente',
  ANNULEE: 'Annulée',
};

function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-100 text-amber-800',
    sky: 'bg-sky-100 text-sky-800',
    rose: 'bg-rose-100 text-rose-800',
    emerald: 'bg-emerald-100 text-emerald-800',
  };
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

function statusTone(statut) {
  if (statut === 'SOUMISE_CONTROLE') return 'amber';
  if (statut === 'CORRECTION_DEMANDEE') return 'rose';
  if (statut === 'VALIDEE' || statut === 'CLOTUREE') return 'emerald';
  if (statut === 'EN_COURS') return 'sky';
  return 'slate';
}

/**
 * Tour de contrôle gouvernance — données réelles API (pas de KPI fictifs).
 */
export default function ApproGovernancePanel({
  orders = [],
  caps = {},
  onFlash,
}) {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [busy, setBusy] = useState(null);

  const [assignForm, setAssignForm] = useState({
    demande_id: '',
    assignee_user_id: '',
    titre: '',
    instruction: '',
    priorite: 'NORMALE',
    due_at: '',
  });

  const [controlForm, setControlForm] = useState({
    tacheId: null,
    decision: 'VALIDE',
    constat: '',
    action_attendue: '',
  });

  const [correctionText, setCorrectionText] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [today, collabs] = await Promise.all([
        fetchGovernanceToday(),
        fetchGovernanceCollaborators(),
      ]);
      setQueue(today.queue || null);
      setCollaborators(collabs.collaborateurs || []);
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Erreur chargement gouvernance');
    } finally {
      setLoading(false);
    }
  }, [onFlash]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (key, fn) => {
    setBusy(key);
    try {
      await fn();
      onFlash?.('Opération gouvernance enregistrée');
      await load();
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Échec opération gouvernance');
    } finally {
      setBusy(null);
    }
  };

  const createTask = () =>
    run('create', async () => {
      if (!assignForm.demande_id || !assignForm.assignee_user_id || !assignForm.titre.trim()) {
        throw new Error('Demande, collaborateur et titre sont obligatoires.');
      }
      await createGovernanceTask({
        demande_id: Number(assignForm.demande_id),
        assignee_user_id: Number(assignForm.assignee_user_id),
        titre: assignForm.titre.trim(),
        instruction: assignForm.instruction || null,
        priorite: assignForm.priorite,
        due_at: assignForm.due_at || null,
        type: 'INSTRUCTION',
      });
      setAssignForm((f) => ({ ...f, titre: '', instruction: '', due_at: '' }));
    });

  if (loading && !queue) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Chargement gouvernance…
      </div>
    );
  }

  const aControler = queue?.a_controler || [];
  const corrections = queue?.corrections_a_verifier || [];
  const mesTaches = queue?.mes_taches || [];
  const mesCorrectionsOuvertes = queue?.mes_corrections_ouvertes || [];
  const enRetard = queue?.en_retard || [];
  const charge = queue?.charge_collaborateurs || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">À traiter aujourd&apos;hui</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            File de contrôle, corrections et charge — données live Sanctum.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Actualiser
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'À contrôler', value: aControler.length, tone: 'amber' },
          { label: 'Corrections à vérifier', value: corrections.length, tone: 'rose' },
          { label: 'Mes tâches ouvertes', value: mesTaches.length, tone: 'sky' },
          { label: 'En retard', value: enRetard.length, tone: 'rose' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded border border-slate-200 bg-white px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {caps.governanceAssign && (
        <section className="rounded border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#2E68B4]" />
            <h3 className="text-sm font-semibold text-slate-900">Affecter une tâche</h3>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="text-xs text-slate-600">
              Dossier
              <select
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                value={assignForm.demande_id}
                onChange={(e) => setAssignForm((f) => ({ ...f, demande_id: e.target.value }))}
              >
                <option value="">— Sélectionner —</option>
                {orders.slice(0, 80).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.numero_demande} · {o.statut} · {o.antenne?.nom || '—'}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-slate-600">
              Collaborateur
              <select
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                value={assignForm.assignee_user_id}
                onChange={(e) => setAssignForm((f) => ({ ...f, assignee_user_id: e.target.value }))}
              >
                <option value="">— Sélectionner —</option>
                {collaborators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code_role})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-slate-600 md:col-span-2">
              Titre
              <input
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                value={assignForm.titre}
                onChange={(e) => setAssignForm((f) => ({ ...f, titre: e.target.value }))}
                placeholder="Ex. Instruction dossier Estuaire — CMM antipaludiques"
              />
            </label>
            <label className="text-xs text-slate-600 md:col-span-2">
              Instruction
              <textarea
                rows={2}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                value={assignForm.instruction}
                onChange={(e) => setAssignForm((f) => ({ ...f, instruction: e.target.value }))}
                placeholder="Préciser pièces, quantités, échéance attendue…"
              />
            </label>
            <label className="text-xs text-slate-600">
              Priorité
              <select
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                value={assignForm.priorite}
                onChange={(e) => setAssignForm((f) => ({ ...f, priorite: e.target.value }))}
              >
                <option value="NORMALE">Normale</option>
                <option value="HAUTE">Haute</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </label>
            <label className="text-xs text-slate-600">
              Échéance
              <input
                type="datetime-local"
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                value={assignForm.due_at}
                onChange={(e) => setAssignForm((f) => ({ ...f, due_at: e.target.value }))}
              />
            </label>
          </div>
          <button
            type="button"
            disabled={busy === 'create'}
            onClick={createTask}
            className="mt-3 inline-flex items-center gap-1.5 rounded bg-[#2E68B4] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#255a9c] disabled:opacity-60"
          >
            {busy === 'create' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Créer et affecter
          </button>
        </section>
      )}

      <section className="rounded border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <ClipboardCheck className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-slate-900">Travaux à contrôler</h3>
          <Badge tone="amber">{aControler.length}</Badge>
        </div>
        {aControler.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500">Aucune soumission en attente de contrôle.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {aControler.map((t) => (
              <li key={t.id} className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {t.code_tache} — {t.titre}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t.demande?.numero_demande} · {t.assignee?.name || '—'} · priorité {t.priorite}
                    </p>
                  </div>
                  <Badge tone={statusTone(t.statut)}>{STATUS_LABEL[t.statut] || t.statut}</Badge>
                </div>

                {caps.governanceReview && (
                  <div className="mt-2 space-y-2 rounded border border-slate-100 bg-slate-50 p-2.5">
                    {controlForm.tacheId === t.id ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {['VALIDE', 'CORRECTION', 'REJETE', 'EN_ATTENTE'].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setControlForm((f) => ({ ...f, decision: d }))}
                              className={`rounded px-2 py-1 text-[11px] font-semibold ${
                                controlForm.decision === d
                                  ? 'bg-[#2E68B4] text-white'
                                  : 'bg-white text-slate-600 border border-slate-200'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows={2}
                          className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                          placeholder="Constat / motif (obligatoire)"
                          value={controlForm.constat}
                          onChange={(e) => setControlForm((f) => ({ ...f, constat: e.target.value }))}
                        />
                        {controlForm.decision === 'CORRECTION' && (
                          <textarea
                            rows={2}
                            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                            placeholder="Action attendue"
                            value={controlForm.action_attendue}
                            onChange={(e) => setControlForm((f) => ({ ...f, action_attendue: e.target.value }))}
                          />
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy === `ctrl-${t.id}`}
                            onClick={() =>
                              run(`ctrl-${t.id}`, async () => {
                                await controlGovernanceTask(t.id, {
                                  decision: controlForm.decision,
                                  constat: controlForm.constat,
                                  action_attendue: controlForm.action_attendue || null,
                                });
                                setControlForm({ tacheId: null, decision: 'VALIDE', constat: '', action_attendue: '' });
                              })
                            }
                            className="inline-flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                          >
                            {busy === `ctrl-${t.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                            Enregistrer décision
                          </button>
                          <button
                            type="button"
                            onClick={() => setControlForm({ tacheId: null, decision: 'VALIDE', constat: '', action_attendue: '' })}
                            className="rounded px-2.5 py-1 text-[11px] text-slate-600"
                          >
                            Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setControlForm({ tacheId: t.id, decision: 'VALIDE', constat: '', action_attendue: '' })}
                        className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900"
                      >
                        Contrôler
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <h3 className="text-sm font-semibold text-slate-900">Mes tâches / corrections</h3>
        </div>
        {mesTaches.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500">Aucune tâche ouverte vous est affectée.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {mesTaches.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{t.code_tache} — {t.titre}</p>
                  <p className="text-xs text-slate-500">{t.demande?.numero_demande} · {STATUS_LABEL[t.statut] || t.statut}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['A_FAIRE', 'EN_ATTENTE', 'CORRECTION_DEMANDEE'].includes(t.statut) && (
                    <button
                      type="button"
                      disabled={busy === `start-${t.id}`}
                      onClick={() => run(`start-${t.id}`, () => startGovernanceTask(t.id))}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium"
                    >
                      Prendre en charge
                    </button>
                  )}
                  {['EN_COURS', 'A_FAIRE', 'CORRECTION_EFFECTUEE'].includes(t.statut) && (
                    <button
                      type="button"
                      disabled={busy === `sub-${t.id}`}
                      onClick={() => run(`sub-${t.id}`, () => submitGovernanceTask(t.id, { commentaire: 'Soumis pour contrôle' }))}
                      className="rounded bg-[#2E68B4] px-2 py-1 text-[11px] font-semibold text-white"
                    >
                      Soumettre contrôle
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {corrections.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Corrections soumises (recontrôle)
            </p>
            <ul className="space-y-2">
              {corrections.map((c) => (
                <li key={c.id} className="rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-700">
                  <p className="font-medium">
                    Itération {c.iteration} — {c.tache?.code_tache || 'tâche'} · {c.demande?.numero_demande}
                  </p>
                  <p className="mt-1 text-slate-600">{c.correction_appliquee}</p>
                  <p className="mt-1 text-slate-500">Par {c.corrige_par?.name || '—'} · statut tâche : {c.tache?.statut}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {mesCorrectionsOuvertes.length > 0 && (
        <section className="rounded border border-rose-200 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">Corrections à effectuer</h3>
          <p className="mt-1 text-xs text-rose-800">
            Décrivez la correction puis soumettez — l&apos;historique conserve l&apos;itération précédente.
          </p>
          {mesCorrectionsOuvertes.map((c) => (
            <div key={`corr-form-${c.id}`} className="mt-3 rounded border border-rose-100 bg-white p-3">
              <p className="text-xs font-medium text-slate-800">
                {c.tache?.code_tache} · itération {c.iteration} · {c.demande?.numero_demande}
              </p>
              <p className="mt-1 text-xs text-rose-800">Motif : {c.motif}</p>
              {c.action_attendue && (
                <p className="mt-0.5 text-xs text-slate-600">Attendu : {c.action_attendue}</p>
              )}
              <textarea
                rows={2}
                className="mt-2 w-full rounded border border-rose-200 px-2 py-1.5 text-sm"
                placeholder="Correction appliquée (obligatoire)"
                value={correctionText[c.id] || ''}
                onChange={(e) => setCorrectionText((m) => ({ ...m, [c.id]: e.target.value }))}
              />
              <button
                type="button"
                className="mt-1 rounded bg-rose-700 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                disabled={busy === `corr-${c.id}`}
                onClick={() =>
                  run(`corr-${c.id}`, async () => {
                    if (!(correctionText[c.id] || '').trim()) {
                      throw new Error('Décrivez la correction appliquée.');
                    }
                    await submitGovernanceCorrection(c.id, {
                      correction_appliquee: correctionText[c.id].trim(),
                    });
                    setCorrectionText((m) => ({ ...m, [c.id]: '' }));
                  })
                }
              >
                Soumettre la correction
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="rounded border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-2.5">
          <h3 className="text-sm font-semibold text-slate-900">Charge des collaborateurs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Collaborateur</th>
                <th className="px-3 py-2 font-semibold">Ouvertes</th>
                <th className="px-3 py-2 font-semibold">Urgentes</th>
                <th className="px-3 py-2 font-semibold">Retard</th>
                <th className="px-3 py-2 font-semibold">Contrôle</th>
                <th className="px-3 py-2 font-semibold">Terminées</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {charge.map((c) => (
                <tr key={c.user_id}>
                  <td className="px-3 py-2 font-medium text-slate-800">
                    {c.name}
                    <span className="ml-1 text-slate-400">{c.code_role}</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{c.ouvertes}</td>
                  <td className="px-3 py-2 tabular-nums">{c.urgentes}</td>
                  <td className="px-3 py-2 tabular-nums text-rose-700">{c.en_retard}</td>
                  <td className="px-3 py-2 tabular-nums">{c.en_controle}</td>
                  <td className="px-3 py-2 tabular-nums">{c.terminees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {enRetard.length > 0 && (
        <section className="rounded border border-rose-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-rose-900">Échéances dépassées</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-700">
            {enRetard.map((t) => (
              <li key={t.id}>
                {t.code_tache} — {t.titre} · {t.assignee?.name || '—'} · {t.demande?.numero_demande}
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}
