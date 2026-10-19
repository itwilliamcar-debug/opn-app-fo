import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Loader2,
  Printer,
  Scale,
  Send,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import { askConfirm } from '../../services/toastBus';
import {
  fetchOrderDetail,
  fetchOrders,
  fetchPurchaseOrders,
  fetchSuppliers,
  submitVisaSupplyOrder,
} from '../../services/api';
import {
  canRoleVisaDemand,
  formatSeuilHint,
  getCodeRole,
  getRoleCapabilities,
  getVisaCircuit,
} from '../../data/rbacMatrix';
import DafReportsPanel from './DafReportsPanel';

/** Outils métier DAF — restent dans le poste (pas de renvoi vers CMM Appro) */
const DAF_TOOLS = [
  {
    id: 'visa',
    tab: 'today',
    label: 'Visa engagement',
    desc: 'Accorder / rejeter EN_VISA_DAF',
  },
  {
    id: 'file',
    tab: 'file',
    label: 'File circuit',
    desc: 'Pipeline DIR → DAF → DG',
  },
  {
    id: 'budget',
    tab: 'budget',
    label: 'Dashboard budgétaire',
    desc: 'Engagements & seuils XAF',
  },
  {
    id: 'engagements',
    tab: 'engagements',
    label: 'Suivi engagés',
    desc: 'Montants, antennes, BC',
  },
  {
    id: 'marches',
    tab: 'engagements',
    focus: 'fournisseurs',
    label: 'Marchés & fournisseurs',
    desc: 'Catalogue fournisseurs / BC',
  },
  {
    id: 'notes',
    tab: 'notes',
    label: 'Saisie avis / notes',
    desc: 'Rédaction & traçabilité',
  },
  {
    id: 'rapports',
    tab: 'rapports',
    label: 'Rapports & export',
    desc: 'Rapport financier DAF / CSV',
  },
  {
    id: 'connect',
    tab: null,
    navigate: 'collaborative',
    label: 'OPN Connect',
    desc: 'Chat & visio DAF',
  },
];

const FILE_STATUSES = [
  'EN_VISA_DAF',
  'EN_VISA_DG',
  'APPROUVEE_CIRCUIT',
  'TRANSMISE_ACHATS',
  'REJETEE_VISA',
  'VALIDEE_NATIONALE',
];

function statusBadgeClass(statut) {
  if (['APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS'].includes(statut)) {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (['EN_VISA_DAF', 'EN_VISA_DG', 'EN_VISA_DIR'].includes(statut)) {
    return 'bg-violet-100 text-violet-800';
  }
  if (statut === 'REJETEE_VISA') return 'bg-rose-100 text-rose-800';
  return 'bg-slate-100 text-slate-700';
}

/**
 * Poste DAF — N5 Visa engagement budgétaire
 * Mme Chantal NZENGUE OBIANG — miroir fonctionnel du desk Appro National.
 */
export default function DafNationalDesk({
  activePersona,
  sanctumReady = false,
  sanctumBusy = false,
  onReconnectSanctum,
  onNavigateModule,
  initialTab = 'today',
}) {
  const caps = getRoleCapabilities(getCodeRole(activePersona));
  const codeRole = getCodeRole(activePersona);

  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusyId, setActionBusyId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeToolId, setActiveToolId] = useState('visa');
  const [engagementFocus, setEngagementFocus] = useState(null);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'engagements' && engagementFocus === 'fournisseurs') {
      document.getElementById('daf-fournisseurs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab, engagementFocus]);

  const [commentById, setCommentById] = useState({});
  const [motifById, setMotifById] = useState({});
  const [noteInterne, setNoteInterne] = useState('');
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('opn_daf_notes') || '[]');
    } catch {
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  const flash = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [ordRes, supRes, poRes] = await Promise.all([
        fetchOrders(),
        fetchSuppliers().catch(() => ({ fournisseurs: [] })),
        fetchPurchaseOrders().catch(() => ({ commandes: [] })),
      ]);
      setOrders(Array.isArray(ordRes?.demandes) ? ordRes.demandes : []);
      setSuppliers(Array.isArray(supRes?.fournisseurs) ? supRes.fournisseurs : (Array.isArray(supRes) ? supRes : []));
      setPurchaseOrders(
        Array.isArray(poRes?.commandes)
          ? poRes.commandes
          : (Array.isArray(poRes?.orders) ? poRes.orders : (Array.isArray(poRes) ? poRes : []))
      );
    } catch (err) {
      if (!err?.backendUnavailable) flash(err?.message || 'Impossible de charger les dossiers.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sanctumReady) loadOrders();
    else setLoading(false);
  }, [sanctumReady, loadOrders, activePersona?.email]);

  const aTraiter = useMemo(
    () => orders.filter((d) => d.statut === 'EN_VISA_DAF'),
    [orders]
  );

  const visibleOrders = useMemo(
    () => orders.filter((d) => FILE_STATUSES.includes(d.statut)),
    [orders]
  );

  const kpis = useMemo(() => {
    const enVisaDaf = orders.filter((d) => d.statut === 'EN_VISA_DAF').length;
    const enVisaDg = orders.filter((d) => d.statut === 'EN_VISA_DG').length;
    const approuvees = orders.filter((d) => d.statut === 'APPROUVEE_CIRCUIT').length;
    const rejetees = orders.filter((d) => d.statut === 'REJETEE_VISA').length;
    const engagement = orders
      .filter((d) => ['EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS'].includes(d.statut))
      .reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0);
    const trancheBas = orders.filter((d) => Number(d.montant_total_xaf) <= 5_000_000).length;
    const trancheMid = orders.filter((d) => {
      const m = Number(d.montant_total_xaf) || 0;
      return m > 5_000_000 && m <= 20_000_000;
    }).length;
    const trancheHaut = orders.filter((d) => Number(d.montant_total_xaf) > 20_000_000).length;
    return { enVisaDaf, enVisaDg, approuvees, rejetees, engagement, trancheBas, trancheMid, trancheHaut };
  }, [orders]);

  const openTool = (tool) => {
    setActiveToolId(tool.id);
    if (tool.navigate && typeof onNavigateModule === 'function') {
      onNavigateModule(tool.navigate);
      return;
    }
    if (tool.tab) {
      setActiveTab(tool.tab);
      setEngagementFocus(tool.focus || null);
    }
  };

  const exportEngagementsCsv = () => {
    const rows = [
      ['Numero', 'Statut', 'Antenne', 'Demandeur', 'Montant_XAF', 'Circuit'],
      ...visibleOrders.map((d) => [
        d.numero_demande,
        d.statut,
        d.antenne?.nom || '',
        d.demandeur_nom || '',
        Number(d.montant_total_xaf) || 0,
        getVisaCircuit(d.montant_total_xaf).steps.join('>'),
      ]),
    ];
    const bom = '\uFEFF';
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `engagements-daf-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Export CSV engagements généré.');
  };

  const runAction = async (demandeId, fn, successMsg) => {
    if (!sanctumReady) {
      flash('Session Sanctum inactive — activez la session API.');
      return;
    }
    setActionBusyId(demandeId);
    try {
      const res = await fn();
      if (res?.success === false) {
        flash(res?.message || 'Action refusée par l’API.');
      } else {
        flash(successMsg);
        await loadOrders();
        if (drawerOpen && detail?.id === demandeId) {
          const fresh = await fetchOrderDetail(demandeId);
          setDetail(fresh?.demande || fresh);
        }
      }
    } catch (err) {
      if (!err?.backendUnavailable) flash(err?.message || 'Action impossible.');
    } finally {
      setActionBusyId(null);
    }
  };

  const openDrawer = async (demandeId) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setPrintMode(false);
    try {
      const res = await fetchOrderDetail(demandeId);
      setDetail(res?.demande || res);
    } catch (err) {
      if (!err?.backendUnavailable) flash(err?.message || 'Dossier introuvable.');
      setDetail(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  const canVisa = (d) => canRoleVisaDemand(codeRole, d.statut, d.montant_total_xaf);

  const handleApprove = async (d) => {
    const ok = await askConfirm({
      message: `Accorder le visa DAF pour ${d.numero_demande || d.id} ?`,
      confirmLabel: 'Valider',
    });
    if (!ok) return;
    const commentaire =
      (commentById[d.id] || '').trim() ||
      'Visa DAF accordé — engagement budgétaire conforme aux seuils et crédits disponibles.';
    runAction(
      d.id,
      () =>
        submitVisaSupplyOrder(d.id, {
          decision: 'approve',
          commentaire,
        }),
      'Visa DAF enregistré — engagement budgétaire validé.'
    );
  };

  const handleReject = async (d) => {
    const motifSaisi = (motifById[d.id] || '').trim();
    const decision = await askConfirm({
      message: `Refuser le visa DAF pour ${d.numero_demande || d.id} ?`,
      confirmLabel: 'Rejeter',
      tone: 'danger',
      reasonLabel: motifSaisi.length >= 5 ? '' : 'Motif du rejet',
      reasonRequired: motifSaisi.length < 5,
    });
    if (!decision) return;
    const motif = motifSaisi.length >= 5 ? motifSaisi : decision.reason;
    if (motif.length < 5) {
      flash('Motif de rejet obligatoire (≥ 5 caractères).');
      return;
    }
    runAction(
      d.id,
      () =>
        submitVisaSupplyOrder(d.id, {
          decision: 'reject',
          motif,
          commentaire: motif,
        }),
      'Visa DAF refusé — dossier REJETEE_VISA.'
    );
  };

  const saveNote = () => {
    const text = noteInterne.trim();
    if (text.length < 5) {
      flash('Rédigez une note d’au moins 5 caractères.');
      return;
    }
    const entry = {
      id: `NOTE-${Date.now()}`,
      auteur: activePersona?.nom || 'DAF',
      date: new Date().toISOString(),
      contenu: text,
      dossier: detail?.numero_demande || null,
    };
    const next = [entry, ...savedNotes].slice(0, 50);
    setSavedNotes(next);
    localStorage.setItem('opn_daf_notes', JSON.stringify(next));
    setNoteInterne('');
    flash('Note DAF enregistrée localement (brouillon de travail).');
  };

  const renderVisaCard = (d) => {
    const circuit = getVisaCircuit(d.montant_total_xaf);
    const busy = actionBusyId === d.id;
    return (
      <div
        key={d.id}
        className="p-4 rounded-md border border-slate-200 hover:border-slate-300 bg-slate-50/70 space-y-3 text-xs transition-all"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-slate-900">{d.numero_demande}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass(d.statut)}`}>
                {(d.statut || '').replace(/_/g, ' ')}
              </span>
              <span className="text-slate-500">{d.antenne?.nom || 'Antenne'}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Demandeur : {d.demandeur_nom}</h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">Motif : {d.motif || '—'}</p>
            <p className="text-[11px] text-violet-800 mt-1.5 font-semibold bg-violet-50 border border-violet-100 rounded px-2 py-1 inline-block">
              Circuit : {formatSeuilHint(d.montant_total_xaf)}
              {circuit.steps.length > 0 && (
                <span className="ml-2 font-mono text-violet-600">[{circuit.steps.join(' → ')}]</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-[#2E68B4] block">{formatXAF(d.montant_total_xaf)}</span>
          </div>
        </div>

        {canVisa(d) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <textarea
              value={commentById[d.id] || ''}
              onChange={(e) => setCommentById((p) => ({ ...p, [d.id]: e.target.value }))}
              rows={2}
              placeholder="Avis / commentaire de visa DAF (engagement budgétaire)…"
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs"
            />
            <textarea
              value={motifById[d.id] || ''}
              onChange={(e) => setMotifById((p) => ({ ...p, [d.id]: e.target.value }))}
              rows={2}
              placeholder="Motif de rejet (obligatoire si refus)…"
              className="w-full rounded border border-rose-200 px-2 py-1.5 text-xs"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => openDrawer(d.id)}
            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold"
          >
            <Eye className="h-3 w-3" /> Consulter
          </button>
          {canVisa(d) && (
            <>
              <button
                type="button"
                disabled={busy || !sanctumReady}
                onClick={() => handleApprove(d)}
                className="inline-flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                Accorder visa DAF
              </button>
              <button
                type="button"
                disabled={busy || !sanctumReady}
                onClick={() => handleReject(d)}
                className="inline-flex items-center gap-1 rounded bg-rose-700 px-2.5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60"
              >
                <Ban className="h-3 w-3" /> Rejeter
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {actionMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#2E68B4] text-white px-4 py-3 rounded-md shadow-xl text-xs font-bold max-w-sm">
          {actionMessage}
        </div>
      )}

      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Session Sanctum inactive — visas DAF bloqués.
          </span>
          <button
            type="button"
            onClick={() => onReconnectSanctum?.()}
            disabled={sanctumBusy}
            className="rounded bg-[#2E68B4] px-2.5 py-1 text-[11px] font-bold text-white disabled:opacity-60"
          >
            {sanctumBusy ? 'Activation…' : 'Activer la session API'}
          </button>
        </div>
      )}

      <div className="bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activePersona.avatar}
            alt={activePersona.nom}
            className="w-14 h-14 rounded-full object-cover border-2 border-teal-600 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
              <span className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider">
                {caps.hierarchyLabel}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2E68B4]">{activePersona.nom}</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              <strong className="text-slate-900">{activePersona.role}</strong> • {activePersona.entite}
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          <p className="font-bold text-slate-700">Poste DAF — Engagement budgétaire</p>
          <p>Libreville — contrôle financier &amp; visas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {[
          { label: 'À viser (DAF)', value: kpis.enVisaDaf, color: 'text-amber-700' },
          { label: 'Chez DG', value: kpis.enVisaDg, color: 'text-violet-700' },
          { label: 'Circuit approuvé', value: kpis.approuvees, color: 'text-emerald-700' },
          { label: 'Rejets visa', value: kpis.rejetees, color: 'text-rose-700' },
          { label: 'Engagements suivis', value: formatXAF(kpis.engagement), color: 'text-[#2E68B4]' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white px-3 py-3 rounded-md border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-lg font-black mt-0.5 tabular-nums ${kpi.color}`}>
              {loading ? '…' : kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Barre d'outils métier DAF */}
      <div className="bg-white rounded-md border border-slate-200 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Outils de travail DAF
          </p>
          <button
            type="button"
            onClick={exportEngagementsCsv}
            className="rounded border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-800"
          >
            Export CSV engagements
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DAF_TOOLS.map((tool) => {
            const active = activeToolId === tool.id || (tool.tab && activeTab === tool.tab && !tool.navigate);
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => openTool(tool)}
                className={`text-left rounded-md border px-3 py-2.5 transition-all ${
                  active
                    ? 'border-teal-600 bg-teal-50 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-teal-500 hover:bg-white'
                }`}
              >
                <p className={`text-[11px] font-bold ${active ? 'text-teal-900' : 'text-slate-800'}`}>
                  {tool.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {[
          { id: 'today', label: "À traiter aujourd'hui", icon: ShieldCheck },
          { id: 'file', label: 'File visas', icon: ClipboardList },
          { id: 'budget', label: 'Dashboard budgétaire', icon: Scale },
          { id: 'engagements', label: 'Engagements & marchés', icon: Wallet },
          { id: 'notes', label: 'Notes & avis', icon: FileText },
          { id: 'rapports', label: 'Rapports', icon: Scale },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setActiveToolId(
                  tab.id === 'today' ? 'visa' : tab.id === 'budget' ? 'budget' : tab.id
                );
              }}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 -mb-px ${
                active
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'today' && aTraiter.length > 0 && (
                <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-900">
                  {aTraiter.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 'today' && (
        <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Visas DAF en attente — intervention requise
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accordez ou refusez l&apos;engagement budgétaire. Commentaire / motif obligatoires pour traçabilité.
            </p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 py-12 text-xs text-slate-500 justify-center">
              <Loader2 className="w-5 h-5 animate-spin" /> Chargement…
            </div>
          ) : aTraiter.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-md">
              Aucun dossier en statut EN_VISA_DAF pour le moment.
            </div>
          ) : (
            <div className="space-y-3">{aTraiter.map(renderVisaCard)}</div>
          )}
        </div>
      )}

      {activeTab === 'file' && (
        <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">File visas &amp; circuit financier</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Seuils : ≤ 5M sans visa · 5–20M DIR→DAF · &gt; 20M DIR→DAF→DG
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
              {loading ? '…' : `${visibleOrders.length} dossier(s)`}
            </span>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 py-12 text-xs text-slate-500 justify-center">
              <Loader2 className="w-5 h-5 animate-spin" /> Chargement…
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed rounded-md">
              Aucun dossier dans le périmètre visa DAF.
            </div>
          ) : (
            <div className="space-y-3">{visibleOrders.map(renderVisaCard)}</div>
          )}
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dashboard budgétaire DAF</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilotage des engagements selon les seuils institutionnels (données live demandes Appro).
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openTool(DAF_TOOLS.find((t) => t.id === 'visa'))}
                  className="rounded bg-teal-700 px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  Traiter les visas ({kpis.enVisaDaf})
                </button>
                <button
                  type="button"
                  onClick={exportEngagementsCsv}
                  className="rounded border border-slate-200 px-3 py-1.5 text-[11px] font-semibold"
                >
                  Exporter CSV
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-500">≤ 5 M XAF</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{kpis.trancheBas}</p>
                <p className="text-[10px] text-slate-500">Sans visa DIR/DAF/DG</p>
              </div>
              <div className="rounded border border-amber-200 bg-amber-50 p-3">
                <p className="text-[10px] font-bold uppercase text-amber-800">5 – 20 M XAF</p>
                <p className="text-2xl font-black text-amber-900 mt-1">{kpis.trancheMid}</p>
                <p className="text-[10px] text-amber-700">Circuit DIR → DAF</p>
              </div>
              <div className="rounded border border-violet-200 bg-violet-50 p-3">
                <p className="text-[10px] font-bold uppercase text-violet-800">&gt; 20 M XAF</p>
                <p className="text-2xl font-black text-violet-900 mt-1">{kpis.trancheHaut}</p>
                <p className="text-[10px] text-violet-700">Circuit DIR → DAF → DG</p>
              </div>
            </div>

            <div className="rounded border border-teal-100 bg-teal-50/40 p-4">
              <p className="text-xs font-bold text-teal-900">Encours suivi DAF</p>
              <p className="text-2xl font-black text-[#2E68B4] mt-1">{formatXAF(kpis.engagement)}</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Somme des dossiers EN_VISA_DAF / EN_VISA_DG / APPROUVEE_CIRCUIT / TRANSMISE_ACHATS.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Actions rapides
              </h4>
              <div className="flex flex-wrap gap-2">
                {DAF_TOOLS.filter((t) => t.id !== 'budget' && t.id !== 'connect').map((tool) => (
                  <button
                    key={`quick-${tool.id}`}
                    type="button"
                    onClick={() => openTool(tool)}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-left hover:border-teal-600"
                  >
                    <span className="block text-[11px] font-bold text-slate-800">{tool.label}</span>
                    <span className="block text-[10px] text-slate-500">{tool.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {aTraiter.length > 0 && (
            <div className="bg-white rounded-md border border-amber-200 p-5 space-y-3">
              <h4 className="text-sm font-bold text-amber-900">
                Priorité — {aTraiter.length} dossier(s) en attente de votre visa
              </h4>
              <div className="space-y-3">{aTraiter.slice(0, 5).map(renderVisaCard)}</div>
              {aTraiter.length > 5 && (
                <button
                  type="button"
                  onClick={() => openTool(DAF_TOOLS.find((t) => t.id === 'visa'))}
                  className="text-xs font-semibold text-teal-800"
                >
                  Voir toute la file →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'engagements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-teal-700" />
              Synthèse des engagements (données live)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Référence</th>
                    <th className="px-3 py-2 font-semibold">Statut</th>
                    <th className="px-3 py-2 font-semibold">Antenne</th>
                    <th className="px-3 py-2 font-semibold">Montant</th>
                    <th className="px-3 py-2 font-semibold">Circuit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleOrders.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono font-medium">{d.numero_demande}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass(d.statut)}`}>
                          {(d.statut || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-2">{d.antenne?.nom || '—'}</td>
                      <td className="px-3 py-2 font-semibold text-[#2E68B4]">{formatXAF(d.montant_total_xaf)}</td>
                      <td className="px-3 py-2 text-slate-600">{getVisaCircuit(d.montant_total_xaf).steps.join(' → ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div
              id="daf-fournisseurs"
              className={`bg-white rounded-md border p-5 ${
                engagementFocus === 'fournisseurs' ? 'border-teal-500 ring-1 ring-teal-200' : 'border-slate-200'
              }`}
            >
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4" /> Fournisseurs
              </h3>
              {suppliers.length === 0 ? (
                <p className="text-xs text-slate-500">Aucun fournisseur chargé (API Achats).</p>
              ) : (
                <ul className="space-y-2 text-xs max-h-64 overflow-y-auto">
                  {suppliers.slice(0, 40).map((f) => (
                    <li key={f.id || f.nom} className="rounded border border-slate-100 bg-slate-50 px-2.5 py-2">
                      <p className="font-semibold text-slate-900">{f.raison_sociale || f.nom || `Fournisseur #${f.id}`}</p>
                      <p className="text-slate-500">{f.pays || f.ville || f.type || '—'}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white rounded-md border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Commandes fournisseurs</h3>
              {purchaseOrders.length === 0 ? (
                <p className="text-xs text-slate-500">Aucune commande fournisseur (API Achats).</p>
              ) : (
                <ul className="space-y-2 text-xs max-h-64 overflow-y-auto">
                  {purchaseOrders.slice(0, 40).map((c) => (
                    <li key={c.id} className="rounded border border-slate-100 bg-slate-50 px-2.5 py-2">
                      <p className="font-mono font-semibold">{c.numero_commande || c.reference || `BC-${c.id}`}</p>
                      <p className="text-slate-600">
                        {(c.statut || '—').replace(/_/g, ' ')} · {formatXAF(c.montant_total_xaf || c.montant)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Rédiger un avis / note DAF</h3>
            <p className="text-xs text-slate-500">
              Zone de saisie pour préparer avis d&apos;engagement, réserve budgétaire ou instruction.
              Les visas officiels passent par les champs commentaire/motif de la file.
            </p>
            <textarea
              rows={8}
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
              placeholder="Ex. Avis favorable sous réserve de confirmation de crédit ligne 612 — antenne Estuaire…"
              value={noteInterne}
              onChange={(e) => setNoteInterne(e.target.value)}
            />
            {detail?.numero_demande && (
              <p className="text-[11px] text-teal-800">Liée au dossier ouvert : {detail.numero_demande}</p>
            )}
            <button
              type="button"
              onClick={saveNote}
              className="inline-flex items-center gap-1.5 rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Send className="h-3.5 w-3.5" /> Enregistrer la note
            </button>
          </div>
          <div className="bg-white rounded-md border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Notes enregistrées</h3>
            {savedNotes.length === 0 ? (
              <p className="text-xs text-slate-500">Aucune note pour le moment.</p>
            ) : (
              <ul className="space-y-2 max-h-[420px] overflow-y-auto text-xs">
                {savedNotes.map((n) => (
                  <li key={n.id} className="rounded border border-slate-100 bg-slate-50 p-2.5">
                    <p className="font-semibold text-slate-800">
                      {n.auteur}
                      {n.dossier ? ` · ${n.dossier}` : ''}
                    </p>
                    <p className="text-slate-400 text-[10px]">{new Date(n.date).toLocaleString('fr-FR')}</p>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{n.contenu}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rapports' && (
        <DafReportsPanel activePersona={activePersona} sanctumReady={sanctumReady} />
      )}

      {/* Drawer dossier */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <button type="button" className="flex-1 cursor-default" aria-label="Fermer" onClick={() => setDrawerOpen(false)} />
          <div className="h-full w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3">
              <p className="text-sm font-bold text-[#2E68B4]">Dossier — avis DAF</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setPrintMode(true);
                    setTimeout(() => window.print(), 100);
                  }}
                  className="rounded border border-slate-200 p-1.5"
                  title="Imprimer"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setDrawerOpen(false)} className="rounded border border-slate-200 p-1.5">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className={`p-4 space-y-4 text-xs ${printMode ? 'print:p-0' : ''}`}>
              {drawerLoading ? (
                <div className="flex items-center gap-2 py-16 justify-center text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
                </div>
              ) : !detail ? (
                <p className="text-slate-500 py-10 text-center">Dossier introuvable.</p>
              ) : (
                <>
                  <div>
                    <p className="font-mono font-bold text-slate-900 text-sm">{detail.numero_demande}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass(detail.statut)}`}>
                      {(detail.statut || '').replace(/_/g, ' ')}
                    </span>
                    <p className="mt-2 text-slate-700">
                      Demandeur : <strong>{detail.demandeur_nom}</strong>
                    </p>
                    <p className="text-slate-600">Motif : {detail.motif || '—'}</p>
                    <p className="text-[#2E68B4] font-black mt-1 text-sm">{formatXAF(detail.montant_total_xaf)}</p>
                    <p className="text-violet-800 mt-1 font-semibold">
                      {formatSeuilHint(detail.montant_total_xaf)}
                    </p>
                  </div>

                  {canVisa(detail) && (
                    <div className="space-y-2 rounded border border-teal-100 bg-teal-50/50 p-3">
                      <p className="font-bold text-teal-900 text-[11px] uppercase tracking-wide">Décision DAF</p>
                      <textarea
                        rows={3}
                        className="w-full rounded border border-slate-200 px-2 py-1.5"
                        placeholder="Avis d'engagement budgétaire…"
                        value={commentById[detail.id] || ''}
                        onChange={(e) => setCommentById((p) => ({ ...p, [detail.id]: e.target.value }))}
                      />
                      <textarea
                        rows={2}
                        className="w-full rounded border border-rose-200 px-2 py-1.5"
                        placeholder="Motif de rejet si applicable…"
                        value={motifById[detail.id] || ''}
                        onChange={(e) => setMotifById((p) => ({ ...p, [detail.id]: e.target.value }))}
                      />
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          disabled={!sanctumReady || actionBusyId === detail.id}
                          onClick={() => handleApprove(detail)}
                          className="rounded bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                        >
                          Accorder visa
                        </button>
                        <button
                          type="button"
                          disabled={!sanctumReady || actionBusyId === detail.id}
                          onClick={() => handleReject(detail)}
                          className="rounded bg-rose-700 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Lignes</h4>
                    <div className="space-y-1.5">
                      {(detail.lignes || []).length === 0 ? (
                        <p className="text-slate-500">Aucune ligne.</p>
                      ) : (
                        (detail.lignes || []).map((ligne) => (
                          <div key={ligne.id || `${ligne.produit_id}-${ligne.quantite_demandee}`} className="p-2 rounded border border-slate-100 bg-slate-50">
                            <p className="font-semibold text-slate-900">
                              {ligne.produit?.dci || ligne.produit?.designation || `Produit #${ligne.produit_id}`}
                            </p>
                            <p className="text-slate-600">
                              Qté : {ligne.quantite_demandee}
                              {ligne.quantite_validee != null && (
                                <span className="ml-2 text-emerald-700">Validée : {ligne.quantite_validee}</span>
                              )}
                              {' · '}
                              {formatXAF(ligne.total_ligne_xaf || (ligne.prix_unitaire_xaf || 0) * (ligne.quantite_validee || ligne.quantite_demandee || 0))}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Historique workflow
                    </h4>
                    <ul className="space-y-1.5">
                      {(detail.historique_workflow || []).length === 0 ? (
                        <li className="text-slate-500">Aucun événement.</li>
                      ) : (
                        (detail.historique_workflow || []).map((h, idx) => (
                          <li key={idx} className="p-2 rounded border border-slate-100 bg-white">
                            <span className="font-bold text-slate-800">{h.etape || h.action || 'Étape'}</span>
                            {h.date && <span className="text-slate-500 ml-2">{h.date}</span>}
                            {h.auteur && <p className="text-slate-600 mt-0.5">Par {h.auteur}</p>}
                            {(h.details || h.commentaire) && (
                              <p className="text-slate-500 mt-0.5">{h.details || h.commentaire}</p>
                            )}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
