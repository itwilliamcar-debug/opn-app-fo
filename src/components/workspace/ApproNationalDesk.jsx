import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileCheck,
  FileText,
  Layers,
  Loader2,
  PackageCheck,
  Printer,
  Send,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import {
  allocateFefo,
  closeDeliveryWorkflow,
  confirmFefo,
  fetchLogisticsMissions,
  fetchOrderDetail,
  fetchOrders,
  instructSupplyOrder,
  launchVisaCircuit,
  rejectSupplyOrder,
  transferSupplyOrderToAchats,
  validateNationalSupplyOrder,
} from '../../services/api';
import {
  getCodeRole,
  getRoleCapabilities,
  isDemandInApproQueue,
  isDemandReadyForNationalValidation,
  getVisaCircuit,
  formatSeuilHint,
} from '../../data/rbacMatrix';
import ApproValidationAttestation from './ApproValidationAttestation';
import ApproGovernancePanel from './ApproGovernancePanel';
import ApproDossierDocuments from './ApproDossierDocuments';
import ApproSuggestionsDgPanel from './ApproSuggestionsDgPanel';

const TOOL_MODULES = [
  { id: 'supply', label: 'CMM & Besoins' },
  { id: 'pharmacy', label: 'Stocks FEFO' },
  { id: 'emergency', label: 'Urgences' },
  { id: 'collaborative', label: 'OPN Connect' },
  { id: 'documents', label: 'Rapports' },
  { id: 'dashboard', label: 'Dashboard' },
];

const FILE_STATUSES = [
  'SOUMISE_ANTENNE',
  'PARTIELLEMENT_VALIDEE',
  'VALIDEE',
  'EN_INSTRUCTION_APPRO',
  'INSTRUITE',
  'VALIDEE_NATIONALE',
  'TRANSMISE_ACHATS',
  'EN_VISA_DIR',
  'EN_VISA_DAF',
  'EN_VISA_DG',
  'APPROUVEE_CIRCUIT',
  'REJETEE_APPRO',
  'REJETEE_VISA',
];

function statusBadgeClass(statut) {
  if (['VALIDEE_NATIONALE', 'APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS', 'CLOTUREE'].includes(statut)) {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (['EN_VISA_DIR', 'EN_VISA_DAF', 'EN_VISA_DG'].includes(statut)) {
    return 'bg-violet-100 text-violet-800';
  }
  if (['PARTIELLEMENT_VALIDEE', 'SOUMISE_ANTENNE', 'INSTRUITE'].includes(statut)) {
    return 'bg-amber-100 text-amber-800';
  }
  if (['REJETEE_APPRO', 'REJETEE_ANTENNE', 'REJETEE_VISA'].includes(statut)) {
    return 'bg-rose-100 text-rose-800';
  }
  if (statut === 'EN_INSTRUCTION_APPRO') {
    return 'bg-sky-100 text-sky-800';
  }
  return 'bg-blue-100 text-blue-800';
}

export default function ApproNationalDesk({
  activePersona,
  sanctumReady = false,
  sanctumBusy = false,
  onReconnectSanctum,
  onNavigateModule,
}) {
  const caps = getRoleCapabilities(getCodeRole(activePersona));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusyId, setActionBusyId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('file');

  const [commentById, setCommentById] = useState({});
  const [motifById, setMotifById] = useState({});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [printMode, setPrintMode] = useState(null);
  const [attestationPreview, setAttestationPreview] = useState(null);
  const [attestationIssuedAt, setAttestationIssuedAt] = useState(() => new Date());

  const [missions, setMissions] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [closeBusyId, setCloseBusyId] = useState(null);

  const flash = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchOrders();
      if (!res || !res.demandes) {
        setOrders([]);
        flash(res?.message || 'Impossible de charger les dossiers Appro (API / Sanctum).');
      } else {
        setOrders(res.demandes);
      }
    } catch (err) {
      setOrders([]);
      flash(err?.message || 'API Laravel injoignable — aucun dossier affiché.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMissions = useCallback(async () => {
    setMissionsLoading(true);
    try {
      const res = await fetchLogisticsMissions();
      setMissions(Array.isArray(res?.missions) ? res.missions : []);
    } catch (err) {
      setMissions([]);
      flash(err?.message || 'Impossible de charger les livraisons logistiques.');
    } finally {
      setMissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, activePersona]);

  useEffect(() => {
    if (activeTab === 'cloture') {
      loadMissions();
    }
  }, [activeTab, loadMissions]);

  const visibleOrders = useMemo(
    () => orders.filter((d) => FILE_STATUSES.includes(d.statut) || isDemandReadyForNationalValidation(d.statut)),
    [orders]
  );

  const kpis = useMemo(() => {
    const aInstruire = orders.filter(
      (d) => isDemandInApproQueue(d.statut) || d.statut === 'EN_INSTRUCTION_APPRO'
    ).length;
    const aValider = orders.filter((d) => d.statut === 'INSTRUITE').length;
    const enVisas = orders.filter((d) =>
      ['EN_VISA_DIR', 'EN_VISA_DAF', 'EN_VISA_DG'].includes(d.statut)
    ).length;
    const transmises = orders.filter((d) => d.statut === 'TRANSMISE_ACHATS').length;
    const rejetees = orders.filter((d) =>
      ['REJETEE_APPRO', 'REJETEE_VISA'].includes(d.statut)
    ).length;
    return { aInstruire, aValider, enVisas, transmises, rejetees };
  }, [orders]);

  const openDeliveries = useMemo(() => {
    const rows = [];
    missions.forEach((mission) => {
      (mission.livraisons || []).forEach((liv) => {
        const closed = liv.is_closed === true || liv.statut === 'CLOTUREE';
        if (!closed) {
          rows.push({
            ...liv,
            mission_code: mission.code_mission || mission.reference || mission.id,
            mission_id: mission.id,
            antenne_depart: mission.antenne_depart?.nom || mission.antenneDepart?.nom,
            antenne_destination: mission.antenne_destination?.nom || mission.antenneDestination?.nom,
          });
        }
      });
    });
    return rows;
  }, [missions]);

  const attestationOrders = useMemo(
    () =>
      orders.filter((d) =>
        ['VALIDEE_NATIONALE', 'TRANSMISE_ACHATS', 'APPROUVEE_CIRCUIT', 'EN_VISA_DIR', 'EN_VISA_DAF', 'EN_VISA_DG'].includes(
          d.statut
        )
      ),
    [orders]
  );

  const openDrawer = async (id, silent = false) => {
    if (!silent) {
      setDrawerOpen(true);
      setPrintMode(null);
    }
    setDrawerLoading(true);
    try {
      const res = await fetchOrderDetail(id);
      if (!res?.demande && !res?.success) {
        flash(res?.message || 'Détail dossier indisponible.');
        setDetail(null);
        return;
      }
      setDetail(res.demande || res);
    } catch (err) {
      flash(err?.message || 'Impossible de charger le détail du dossier.');
      setDetail(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  const runAction = async (demandeId, fn, successMsg) => {
    if (!sanctumReady) {
      flash('Session Sanctum inactive — reconnectez-vous via Accès Intranet.');
      return;
    }
    setActionBusyId(demandeId);
    try {
      const res = await fn();
      if (!res || res.success === false) {
        flash(res?.message || 'Action refusée par l\'API. Session Sanctum ou droits insuffisants.');
        return;
      }
      flash(successMsg);
      await loadOrders();
      if (drawerOpen && detail?.id === demandeId) {
        await openDrawer(demandeId, true);
      }
    } catch (err) {
      flash(err?.message || 'Erreur API — aucune transition locale de statut.');
    } finally {
      setActionBusyId(null);
    }
  };

  const canShowInstruct = (d) =>
    caps.instructDemand && (isDemandInApproQueue(d.statut) || d.statut === 'EN_INSTRUCTION_APPRO');

  const canShowNationalValidate = (d) =>
    caps.validateNational && (d.statut === 'INSTRUITE' || d.statut === 'EN_INSTRUCTION_APPRO');

  const canShowTransfer = (d) => {
    if (!caps.transferAchats) return false;
    const circuit = getVisaCircuit(d.montant_total_xaf);
    if (circuit.requiresDir) return d.statut === 'APPROUVEE_CIRCUIT';
    return d.statut === 'VALIDEE_NATIONALE' || d.statut === 'APPROUVEE_CIRCUIT';
  };

  const canShowLaunchVisas = (d) => {
    if (!caps.validateNational) return false;
    const circuit = getVisaCircuit(d.montant_total_xaf);
    return circuit.requiresDir && d.statut === 'VALIDEE_NATIONALE';
  };

  const canShowReject = (d) =>
    caps.rejectAppro &&
    (isDemandInApproQueue(d.statut) || ['EN_INSTRUCTION_APPRO', 'INSTRUITE'].includes(d.statut));

  const canShowFefo = (d) =>
    caps.allocateFefo &&
    ['VALIDEE_NATIONALE', 'TRANSMISE_ACHATS', 'APPROUVEE_CIRCUIT'].includes(d.statut);

  const handleInstruct = (d) => {
    const nextAction = d.statut === 'EN_INSTRUCTION_APPRO' ? 'complete' : 'start';
    runAction(
      d.id,
      () =>
        instructSupplyOrder(d.id, {
          auteur_nom: activePersona.nom,
          auteur_role: activePersona.role,
          action: nextAction,
          commentaire:
            nextAction === 'complete'
              ? 'Instruction terminée — dossier prêt pour validation Directrice Appro.'
              : 'Prise en charge pour instruction Appro Owendo.',
        }),
      nextAction === 'complete'
        ? 'Instruction terminée — dossier prêt pour validation nationale.'
        : 'Prise en charge : demande en instruction Appro.'
    );
  };

  const handleValidateNational = (d) => {
    const commentaire =
      (commentById[d.id] || '').trim() ||
      'Validation nationale Appro — dotation autorisée depuis le hub Owendo.';
    runAction(
      d.id,
      () =>
        validateNationalSupplyOrder(d.id, {
          auteur_nom: activePersona.nom,
          auteur_role: activePersona.role,
          commentaire,
        }),
      'Validation nationale Appro enregistrée.'
    );
  };

  const handleTransferAchats = (d) => {
    runAction(
      d.id,
      () =>
        transferSupplyOrderToAchats(d.id, {
          auteur_nom: activePersona.nom,
          auteur_role: activePersona.role,
        }),
      'Dossier transmis au service Achats.'
    );
  };

  const handleLaunchVisas = (d) => {
    runAction(
      d.id,
      () =>
        launchVisaCircuit(d.id, {
          auteur_nom: activePersona.nom,
          auteur_role: activePersona.role,
        }),
      'Circuit visas ouvert — file DIR.'
    );
  };

  const handleReject = (d) => {
    const motif =
      (motifById[d.id] || '').trim() ||
      'Dossier incomplet ou quantités non justifiées au regard du stock / CMM national.';
    runAction(
      d.id,
      () =>
        rejectSupplyOrder(d.id, {
          auteur_nom: activePersona.nom,
          auteur_role: activePersona.role,
          motif,
        }),
      'Demande rejetée (Appro) — retour antenne avec motif.'
    );
  };

  const handleAllocateFefo = (d) => {
    runAction(d.id, () => allocateFefo(d.id), 'Allocation FEFO effectuée.');
  };

  const handleConfirmFefo = (d) => {
    runAction(d.id, () => confirmFefo(d.id), 'Confirmation FEFO / sortie magasin enregistrée.');
  };

  const handleCloseDelivery = async (livraison) => {
    if (!sanctumReady) {
      flash('Session Sanctum inactive — reconnectez-vous via Accès Intranet.');
      return;
    }
    if (!caps.closeDelivery) return;
    setCloseBusyId(livraison.id);
    try {
      const res = await closeDeliveryWorkflow(livraison.id, {
        validateur_nom: activePersona.nom,
        role_validateur: 'APPRO_NATIONAL',
        commentaires: `Clôture nationale livraisons — ${activePersona.nom}`,
      });
      if (!res || res.success === false) {
        flash(res?.message || 'Clôture refusée par l\'API.');
        return;
      }
      flash(res.message || 'Livraison clôturée.');
      await loadMissions();
      await loadOrders();
    } catch (err) {
      flash(err?.message || 'Erreur lors de la clôture livraison.');
    } finally {
      setCloseBusyId(null);
    }
  };

  const printAttestation = (demande) => {
    setAttestationIssuedAt(new Date());
    setAttestationPreview(demande);
    setTimeout(() => window.print(), 350);
  };

  const printDossier = () => {
    if (!caps.printDossier) return;
    setAttestationPreview(null);
    setPrintMode('dossier');
    setTimeout(() => window.print(), 200);
  };

  const openAttestationFromDrawer = () => {
    if (!detail) return;
    setAttestationIssuedAt(new Date());
    setAttestationPreview(detail);
    setPrintMode('attestation');
    setTimeout(() => window.print(), 350);
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
            Session Sanctum inactive — validations, FEFO et clôtures Appro sont bloquées.
          </span>
          <button
            type="button"
            onClick={() => onReconnectSanctum?.()}
            disabled={sanctumBusy}
            className="rounded bg-[#2E68B4] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#255a9c] disabled:opacity-60"
          >
            {sanctumBusy ? 'Activation…' : 'Activer la session API'}
          </button>
        </div>
      )}

      {/* Header persona */}
      <div className="bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activePersona.avatar}
            alt={activePersona.nom}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#2E68B4] shadow-sm shrink-0"
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
          <p className="font-bold text-slate-700">Poste Appro National</p>
          <p>Hub Owendo — validation &amp; traitement</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {[
          { label: 'À instruire', value: kpis.aInstruire, color: 'text-sky-700' },
          { label: 'À valider nationale', value: kpis.aValider, color: 'text-amber-700' },
          { label: 'En visas', value: kpis.enVisas, color: 'text-violet-700' },
          { label: 'Transmises Achats', value: kpis.transmises, color: 'text-emerald-700' },
          { label: 'Rejetées', value: kpis.rejetees, color: 'text-rose-700' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white px-3 py-3 rounded-md border border-slate-200 shadow-2xs"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-xl font-black mt-0.5 ${kpi.color}`}>
              {loading ? '…' : kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tool strip */}
      {typeof onNavigateModule === 'function' && (
        <div className="flex flex-wrap gap-2">
          {TOOL_MODULES.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => onNavigateModule(mod.id)}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:border-[#2E68B4] hover:text-[#2E68B4] text-[11px] font-bold text-slate-700 transition-all"
            >
              {mod.label}
            </button>
          ))}
        </div>
      )}

      {/* Internal tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {[
          { id: 'today', label: "À traiter aujourd'hui", icon: ShieldCheck },
          { id: 'file', label: 'File dossiers', icon: ClipboardList },
          { id: 'suggestions', label: 'Suggestions DG', icon: FileText },
          { id: 'cloture', label: 'Clôture livraisons', icon: Truck },
          { id: 'attestations', label: 'Attestations', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 -mb-px transition-all ${
                active
                  ? 'border-[#2E68B4] text-[#2E68B4]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* FILE DOSSIERS */}
      {activeTab === 'today' && (
        <ApproGovernancePanel orders={orders} caps={caps} onFlash={flash} />
      )}

      {activeTab === 'suggestions' && (
        <ApproSuggestionsDgPanel mode="appro" orders={orders} onFlash={flash} />
      )}

      {activeTab === 'file' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#2E68B4]" />
                File validation &amp; traitement — Appro National
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Seuils visas : ≤ 5M sans visa · 5–20M DIR→DAF · &gt; 20M DIR→DAF→DG
              </p>
            </div>
            <span className="text-xs font-bold text-[#2E68B4] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {loading ? '…' : `${visibleOrders.length} Dossier(s)`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-xs text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement des dossiers…
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-md">
              Aucun dossier Appro dans votre file nationale pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleOrders.map((d) => {
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
                          <span className="text-slate-500">{d.antenne?.nom || 'Antenne Provinciale'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          Demandeur : {d.demandeur_nom}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                          Motif : {d.motif || 'Réassort régulier'}
                        </p>
                        <p className="text-[11px] text-violet-800 mt-1.5 font-semibold bg-violet-50 border border-violet-100 rounded px-2 py-1 inline-block">
                          Circuit visas : {formatSeuilHint(d.montant_total_xaf)}
                          {circuit.steps.length > 0 && (
                            <span className="ml-2 font-mono text-violet-600">
                              [{circuit.steps.join(' → ')}]
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#2E68B4] block">
                          {formatXAF(d.montant_total_xaf)}
                        </span>
                      </div>
                    </div>

                    {(canShowNationalValidate(d) || canShowReject(d)) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {canShowNationalValidate(d) && (
                          <textarea
                            value={commentById[d.id] || ''}
                            onChange={(e) =>
                              setCommentById((prev) => ({ ...prev, [d.id]: e.target.value }))
                            }
                            rows={2}
                            placeholder="Commentaire validation nationale…"
                            className="w-full text-xs rounded-md border border-slate-200 px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#2E68B4]"
                          />
                        )}
                        {canShowReject(d) && (
                          <textarea
                            value={motifById[d.id] || ''}
                            onChange={(e) =>
                              setMotifById((prev) => ({ ...prev, [d.id]: e.target.value }))
                            }
                            rows={2}
                            placeholder="Motif de rejet Appro…"
                            className="w-full text-xs rounded-md border border-slate-200 px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                          />
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => openDrawer(d.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#2E68B4] text-slate-800 font-bold rounded text-xs flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Consulter
                      </button>

                      {canShowInstruct(d) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleInstruct(d)}
                          className="px-3 py-1.5 bg-[#2E68B4] hover:bg-[#245794] text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          {d.statut === 'EN_INSTRUCTION_APPRO' ? 'Terminer instruction' : 'Instruire'}
                        </button>
                      )}

                      {canShowNationalValidate(d) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleValidateNational(d)}
                          className="px-3 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Valider Nationale
                        </button>
                      )}

                      {canShowLaunchVisas(d) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleLaunchVisas(d)}
                          className="px-3 py-1.5 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Lancer visas
                        </button>
                      )}

                      {canShowTransfer(d) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleTransferAchats(d)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Transmettre Achats
                        </button>
                      )}

                      {canShowFefo(d) && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleAllocateFefo(d)}
                            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            Allouer FEFO
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleConfirmFefo(d)}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            Confirmer FEFO
                          </button>
                        </>
                      )}

                      {canShowReject(d) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleReject(d)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Rejeter
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CLOTURE LIVRAISONS */}
      {activeTab === 'cloture' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2E68B4]" />
              Clôture nationale des livraisons
            </h3>
            <button
              type="button"
              onClick={loadMissions}
              className="text-[11px] font-bold text-[#2E68B4] hover:underline"
            >
              Actualiser
            </button>
          </div>

          {missionsLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement des missions…
            </div>
          ) : openDeliveries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-md">
              Aucune livraison ouverte à clôturer.
            </div>
          ) : (
            <div className="space-y-2">
              {openDeliveries.map((liv) => (
                <div
                  key={liv.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md border border-slate-200 bg-slate-50/70 text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-slate-900">
                      {liv.code_livraison || `LIV-${liv.id}`}
                    </p>
                    <p className="text-slate-600 mt-0.5">
                      Mission {liv.mission_code}
                      {liv.antenne_destination ? ` → ${liv.antenne_destination}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Statut : {(liv.statut || 'OUVERTE').replace(/_/g, ' ')}
                      {liv.structure?.nom ? ` · ${liv.structure.nom}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={closeBusyId === liv.id || !caps.closeDelivery}
                    onClick={() => handleCloseDelivery(liv)}
                    className="px-3 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-60 shrink-0"
                  >
                    {closeBusyId === liv.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    Clôturer (Appro National)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ATTESTATIONS */}
      {activeTab === 'attestations' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-[#2E68B4]" />
            Attestations de validation nationale
          </h3>
          {attestationOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-md">
              Aucune attestation disponible — validez d&apos;abord des dossiers nationaux.
            </div>
          ) : (
            <div className="space-y-2">
              {attestationOrders.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md border border-slate-200 bg-slate-50/70 text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-slate-900">{d.numero_demande}</p>
                    <p className="text-slate-600 mt-0.5">
                      {d.demandeur_nom} · {(d.statut || '').replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-[#2E68B4] font-semibold mt-0.5">
                      {formatXAF(d.montant_total_xaf)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => printAttestation(d)}
                    className="px-3 py-1.5 bg-[#2E68B4] hover:bg-[#245794] text-white font-bold rounded text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Attestation validation
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DETAIL DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 print:hidden"
            aria-label="Fermer"
            onClick={() => {
              setDrawerOpen(false);
              setPrintMode(null);
            }}
          />
          <aside className="relative w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 overflow-y-auto print:max-w-none print:shadow-none print:border-0">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-2 print:hidden">
              <h3 className="text-sm font-bold text-slate-900">Détail dossier Appro</h3>
              <div className="flex items-center gap-2">
                {caps.printDossier && detail && (
                  <>
                    <button
                      type="button"
                      onClick={printDossier}
                      className="px-2.5 py-1.5 text-[11px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Imprimer
                    </button>
                    <button
                      type="button"
                      onClick={openAttestationFromDrawer}
                      className="px-2.5 py-1.5 text-[11px] font-bold rounded bg-[#2E68B4] text-white flex items-center gap-1"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Attestation
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setPrintMode(null);
                  }}
                  className="p-1.5 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div id="appro-national-print-area" className="p-4 space-y-4 text-xs">
              {drawerLoading ? (
                <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Chargement…
                </div>
              ) : !detail ? (
                <p className="text-slate-500 py-10 text-center">Dossier introuvable.</p>
              ) : printMode === 'attestation' ? (
                <ApproValidationAttestation
                  demande={detail}
                  validateur={activePersona}
                  issuedAt={attestationIssuedAt}
                />
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
                    <p className="text-[#2E68B4] font-black mt-1">{formatXAF(detail.montant_total_xaf)}</p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Lignes
                    </h4>
                    <div className="space-y-1.5">
                      {(detail.lignes || []).length === 0 ? (
                        <p className="text-slate-500">Aucune ligne.</p>
                      ) : (
                        (detail.lignes || []).map((ligne) => (
                          <div
                            key={ligne.id || `${ligne.produit_id}-${ligne.quantite_demandee}`}
                            className="p-2 rounded border border-slate-100 bg-slate-50"
                          >
                            <p className="font-semibold text-slate-900">
                              {ligne.produit?.dci || ligne.produit?.nom || `Produit #${ligne.produit_id}`}
                            </p>
                            <p className="text-slate-600">
                              Qté demandée : {ligne.quantite_demandee}
                              {ligne.quantite_validee != null && (
                                <span className="ml-2 text-emerald-700">
                                  Validée : {ligne.quantite_validee}
                                </span>
                              )}
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
                          <li
                            key={idx}
                            className="p-2 rounded border border-slate-100 bg-white text-[11px]"
                          >
                            <span className="font-bold text-slate-800">
                              {h.etape || h.action || 'Étape'}
                            </span>
                            {h.date && <span className="text-slate-500 ml-2">{h.date}</span>}
                            {h.auteur && (
                              <p className="text-slate-600 mt-0.5">Par {h.auteur}</p>
                            )}
                            {h.commentaire && (
                              <p className="text-slate-500 mt-0.5">{h.commentaire}</p>
                            )}
                            {h.details && (
                              <p className="text-slate-500 mt-0.5">{h.details}</p>
                            )}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <ApproDossierDocuments
                    demandeId={detail.id}
                    canManage={!!caps.documentManage}
                    onFlash={flash}
                  />

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Livraisons
                    </h4>
                    {(detail.livraisons || []).length === 0 ? (
                      <p className="text-slate-500">Aucune livraison rattachée.</p>
                    ) : (
                      (detail.livraisons || []).map((liv) => (
                        <div
                          key={liv.id}
                          className="p-2 rounded border border-slate-100 bg-slate-50 mb-1.5"
                        >
                          <p className="font-mono font-semibold">
                            {liv.code_livraison || `LIV-${liv.id}`}
                          </p>
                          <p className="text-slate-600">
                            {(liv.statut || '').replace(/_/g, ' ')}
                            {liv.is_closed ? ' · Clôturée' : ''}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Aperçu attestation (liste + impression dédiée) */}
      {attestationPreview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 print:bg-white print:p-0 print:static print:inset-auto">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-100 rounded-md shadow-2xl print:shadow-none print:max-w-none print:max-h-none print:overflow-visible print:bg-white print:rounded-none">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-slate-200 print:hidden">
              <div>
                <p className="text-sm font-bold text-[#2E68B4]">Aperçu attestation Appro</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {attestationPreview.numero_demande}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-md bg-[#2E68B4] hover:bg-[#245794] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer / PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttestationPreview(null);
                    if (printMode === 'attestation') setPrintMode(null);
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div id="appro-attestation-print-area" className="p-4 sm:p-6 print:p-0">
              <ApproValidationAttestation
                demande={attestationPreview}
                validateur={activePersona}
                issuedAt={attestationIssuedAt}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #appro-attestation-print-area, #appro-attestation-print-area *,
          #appro-national-print-area, #appro-national-print-area * {
            visibility: visible !important;
          }
          #appro-attestation-print-area {
            position: absolute !important;
            left: 0; top: 0; width: 100%;
            padding: 0 !important;
            background: white !important;
          }
          #appro-national-print-area {
            position: absolute !important;
            left: 0; top: 0; width: 100%;
            padding: 16px !important;
            background: white !important;
          }
          .appro-attestation {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
