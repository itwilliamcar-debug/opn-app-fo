import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Building2, 
  PlusCircle, 
  FileCheck, 
  MapPin,
  ShieldCheck,
  Send,
  Ban,
  Eye,
  ClipboardList,
  Search,
  Trash2,
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import {
  fetchOrders,
  fetchStructures,
  fetchProducts,
  fetchAntennes,
  createSupplyOrder,
  instructSupplyOrder,
  validateNationalSupplyOrder,
  transferSupplyOrderToAchats,
  rejectSupplyOrder,
  launchVisaCircuit,
  submitVisaSupplyOrder,
} from '../../services/api';
import PartialValidationModal from './PartialValidationModal';
import ConvoyeurMobileWorkspace from './ConvoyeurMobileWorkspace';
import ApproNationalDesk from './ApproNationalDesk';
import DafNationalDesk from './DafNationalDesk';
import ProcurementManager from '../procurement/ProcurementManager';
import ApproSuggestionsDgPanel from './ApproSuggestionsDgPanel';
import {
  getCodeRole,
  getRoleCapabilities,
  isDemandInApproQueue,
  isDemandReadyForNationalValidation,
  getVisaCircuit,
  nextStatutAfterVisa,
  canRoleVisaDemand,
  formatSeuilHint,
} from '../../data/rbacMatrix';

export default function ActorWorkspace({
  activePersona,
  sanctumReady = false,
  sanctumBusy = false,
  onReconnectSanctum,
  onNavigateModule,
}) {
  const codeRole = getCodeRole(activePersona);

  // Desks spécialisés : composants séparés (pas de hooks conditionnels ici)
  if (codeRole === 'CONVOYEUR') {
    return <ConvoyeurMobileWorkspace activePersona={activePersona} />;
  }
  if (codeRole === 'ACHATS') {
    return <ProcurementManager activePersona={activePersona} sanctumReady={sanctumReady} />;
  }
  if (codeRole === 'APPRO_NATIONAL') {
    return (
      <ApproNationalDesk
        activePersona={activePersona}
        sanctumReady={sanctumReady}
        sanctumBusy={sanctumBusy}
        onReconnectSanctum={onReconnectSanctum}
        onNavigateModule={onNavigateModule}
      />
    );
  }
  if (codeRole === 'DAF') {
    return (
      <DafNationalDesk
        activePersona={activePersona}
        sanctumReady={sanctumReady}
        sanctumBusy={sanctumBusy}
        onReconnectSanctum={onReconnectSanctum}
        onNavigateModule={onNavigateModule}
        initialTab="today"
      />
    );
  }

  return (
    <ActorDemandWorkspace
      activePersona={activePersona}
      sanctumReady={sanctumReady}
      sanctumBusy={sanctumBusy}
      onReconnectSanctum={onReconnectSanctum}
      onNavigateModule={onNavigateModule}
      codeRole={codeRole}
    />
  );
}

function ActorDemandWorkspace({
  activePersona,
  sanctumReady = false,
  sanctumBusy = false,
  onReconnectSanctum,
  onNavigateModule,
  codeRole: codeRoleProp,
}) {
  const codeRole = codeRoleProp || getCodeRole(activePersona);
  const caps = getRoleCapabilities(codeRole);
  const [orders, setOrders] = useState([]);
  const [structures, setStructures] = useState([]);
  const [antennes, setAntennes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusyId, setActionBusyId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [dgDeskTab, setDgDeskTab] = useState('visas');

  const [selectedDemandeToValidate, setSelectedDemandeToValidate] = useState(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [demandMotif, setDemandMotif] = useState('Dotation mensuelle urgences chirurgicales et pédiatrie');
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState(false);
  const [demandSubmitError, setDemandSubmitError] = useState(null);
  const [demandSubmitting, setDemandSubmitting] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [demandLignes, setDemandLignes] = useState([]);

  useEffect(() => {
    loadWorkspaceData();
  }, [activePersona]);

  useEffect(() => {
    if (!isNewOrderModalOpen) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setCatalogLoading(true);
      try {
        const res = await fetchProducts(catalogSearch.trim());
        if (!cancelled) {
          setCatalogProducts(Array.isArray(res?.produits) ? res.produits : []);
        }
      } catch {
        if (!cancelled) setCatalogProducts([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    }, catalogSearch.trim() ? 280 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isNewOrderModalOpen, catalogSearch]);

  const resolveAntenneId = () => {
    // IDs numériques renvoyés par l'API Sanctum (province_id = antenne_id en base)
    const numericCandidates = [
      activePersona?.antenneId,
      activePersona?.antenne_id,
      activePersona?.province_id,
    ]
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (numericCandidates.length) return numericCandidates[0];

    const province = GABON_PROVINCES.find((p) => p.id === activePersona?.provinceId);
    const code = province?.code;

    if (code && antennes.length) {
      const hit = antennes.find(
        (a) => a.code_antenne === code || a.code === code || String(a.code_antenne || '').startsWith(String(activePersona?.provinceId || ''))
      );
      if (hit?.id != null) return Number(hit.id);
    }

    if (code && structures.length) {
      const match = structures.find(
        (s) => s.antenne?.code_antenne === code || s.antenne?.code === code
      );
      if (match?.antenne?.id != null) return Number(match.antenne.id);
      if (match?.antenne_id != null) return Number(match.antenne_id);
    }

    // Structure unique du demandeur
    if (structures.length === 1) {
      const only = structures[0];
      if (only?.antenne?.id != null) return Number(only.antenne.id);
      if (only?.antenne_id != null) return Number(only.antenne_id);
    }

    if (antennes.length === 1 && antennes[0]?.id != null) {
      return Number(antennes[0].id);
    }

    const first = structures.find((s) => s.antenne?.id != null || s.antenne_id != null);
    if (first?.antenne?.id != null) return Number(first.antenne.id);
    if (first?.antenne_id != null) return Number(first.antenne_id);

    return null;
  };

  const openNewDemandModal = () => {
    setDemandSubmitError(null);
    setOrderCreatedSuccess(false);
    setCatalogSearch('');
    setDemandLignes([]);
    setDemandMotif('Dotation mensuelle urgences chirurgicales et pédiatrie');
    setIsNewOrderModalOpen(true);
    // Recharger antennes/structures au cas où la session vient d'être activée
    if (!antennes.length || !structures.length) {
      loadWorkspaceData();
    }
  };

  const addProductToDemand = (produit) => {
    if (!produit?.id) return;
    setDemandLignes((prev) => {
      const existing = prev.find((l) => Number(l.produit_id) === Number(produit.id));
      if (existing) {
        return prev.map((l) =>
          Number(l.produit_id) === Number(produit.id)
            ? { ...l, quantite_demandee: Number(l.quantite_demandee) + 1 }
            : l
        );
      }
      return [
        ...prev,
        {
          produit_id: produit.id,
          quantite_demandee: 1,
          designation: produit.designation || produit.dci,
          dci: produit.dci,
          code_produit: produit.code_produit,
          forme: produit.forme,
          dosage: produit.dosage,
        },
      ];
    });
  };

  const updateDemandLigneQty = (produitId, qty) => {
    const n = Math.max(1, parseInt(qty, 10) || 1);
    setDemandLignes((prev) =>
      prev.map((l) =>
        Number(l.produit_id) === Number(produitId) ? { ...l, quantite_demandee: n } : l
      )
    );
  };

  const removeDemandLigne = (produitId) => {
    setDemandLignes((prev) => prev.filter((l) => Number(l.produit_id) !== Number(produitId)));
  };

  const loadWorkspaceData = async () => {
    setLoading(true);
    setActionMessage(null);
    try {
      const [ordRes, structRes, antRes] = await Promise.all([
        fetchOrders(),
        fetchStructures(),
        fetchAntennes().catch(() => ({ antennes: [] })),
      ]);

      if (!ordRes || !ordRes.demandes) {
        setOrders([]);
        flash(ordRes?.message || 'Impossible de charger les demandes (API / Sanctum).');
      } else {
        setOrders(ordRes.demandes);
      }

      if (!structRes || !structRes.structures) {
        setStructures([]);
      } else {
        setStructures(structRes.structures);
      }

      setAntennes(Array.isArray(antRes?.antennes) ? antRes.antennes : []);
    } catch (err) {
      setOrders([]);
      setStructures([]);
      setAntennes([]);
      flash(err?.message || 'API Laravel injoignable — aucune donnee demodee affichee.');
    } finally {
      setLoading(false);
    }
  };

  const visibleOrders = useMemo(() => {
    if (caps.superviseReadonly && (codeRole === 'SUPER_ADMIN' || codeRole === 'AUDITEUR_INTERNE')) {
      return orders;
    }
    if (codeRole === 'COLLABORATEUR_APPRO') {
      return orders.filter((d) =>
        isDemandInApproQueue(d.statut) || d.statut === 'INSTRUITE' || d.statut === 'REJETEE_APPRO'
      );
    }
    if (codeRole === 'APPRO_NATIONAL') {
      return orders.filter((d) =>
        isDemandReadyForNationalValidation(d.statut)
        || isDemandInApproQueue(d.statut)
        || ['VALIDEE_NATIONALE', 'TRANSMISE_ACHATS', 'EN_VISA_DIR', 'EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'REJETEE_APPRO', 'REJETEE_VISA'].includes(d.statut)
      );
    }
    if (codeRole === 'CHEF_ANTENNE_PROVINCIALE' || codeRole === 'PHARMACIEN_CHEF_ANTENNE') {
      return orders;
    }
    if (codeRole === 'DEMANDEUR_PHARMACIEN' || codeRole === 'DEMANDEUR_STRUCTURE') {
      return orders;
    }
    if (caps.visaDir || caps.visaDaf || caps.visaDg) {
      if (codeRole === 'DIR') {
        return orders.filter((d) =>
          ['EN_VISA_DIR', 'EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'REJETEE_VISA'].includes(d.statut)
        );
      }
      if (codeRole === 'DAF') {
        return orders.filter((d) =>
          ['EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'REJETEE_VISA'].includes(d.statut)
        );
      }
      if (codeRole === 'DG') {
        return orders.filter((d) =>
          ['EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'REJETEE_VISA'].includes(d.statut)
        );
      }
    }
    return orders;
  }, [orders, codeRole, caps]);

  const handleOpenValidation = (demande) => {
    setSelectedDemandeToValidate(demande);
    setIsValidationModalOpen(true);
  };

  const handleValidationSuccess = () => {
    loadWorkspaceData();
  };

  const flash = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const runAction = async (demandeId, fn, successMsg) => {
    if (!sanctumReady) {
      flash('Session Sanctum inactive — reconnectez-vous via Acces Intranet.');
      return;
    }
    setActionBusyId(demandeId);
    try {
      const res = await fn();
      if (!res || res.success === false) {
        flash(res?.message || 'Action refusee par l\'API. Session Sanctum ou droits insuffisants.');
        return;
      }
      flash(successMsg);
      await loadWorkspaceData();
    } catch (err) {
      flash(err?.message || 'Erreur API — aucune transition locale de statut.');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleInstruct = (d) => {
    const nextAction = d.statut === 'EN_INSTRUCTION_APPRO' ? 'complete' : 'start';
    runAction(
      d.id,
      () => instructSupplyOrder(d.id, {
        auteur_nom: activePersona.nom,
        auteur_role: activePersona.role,
        action: nextAction,
        commentaire: nextAction === 'complete'
          ? 'Instruction terminée — dossier prêt pour validation Directrice Appro.'
          : 'Prise en charge pour instruction Appro.',
      }),
      nextAction === 'complete'
        ? 'Instruction terminée — dossier transmis à la Directrice Appro.'
        : 'Prise en charge : demande en instruction Appro.'
    );
  };

  const handleValidateNational = (d) => {
    runAction(
      d.id,
      () => validateNationalSupplyOrder(d.id, {
        auteur_nom: activePersona.nom,
        auteur_role: activePersona.role,
        commentaire: 'Validation nationale Appro — dotation autorisée.',
      }),
      'Validation nationale Appro enregistrée.'
    );
  };

  const handleTransferAchats = (d) => {
    runAction(
      d.id,
      () => transferSupplyOrderToAchats(d.id, {
        auteur_nom: activePersona.nom,
        auteur_role: activePersona.role,
      }),
      'Dossier transmis au service Achats.'
    );
  };

  const handleLaunchVisas = (d) => {
    runAction(
      d.id,
      () => launchVisaCircuit(d.id, {
        auteur_nom: activePersona.nom,
        auteur_role: activePersona.role,
      }),
      'Circuit visas ouvert — file DIR.'
    );
  };

  const handleApproveVisa = (d) => {
    const step = d.statut === 'EN_VISA_DIR' ? 'DIR' : d.statut === 'EN_VISA_DAF' ? 'DAF' : 'DG';
    runAction(
      d.id,
      () => submitVisaSupplyOrder(d.id, {
        auteur_nom: activePersona.nom,
        auteur_role: activePersona.role,
        decision: 'approve',
        commentaire: `Visa ${step} accordé — dossier conforme aux seuils budgétaires.`,
      }),
      `Visa ${step} accordé.`
    );
  };

  const handleReject = (d) => {
    const inVisa = ['EN_VISA_DIR', 'EN_VISA_DAF', 'EN_VISA_DG'].includes(d.statut);
    runAction(
      d.id,
      () => inVisa
        ? submitVisaSupplyOrder(d.id, {
            auteur_nom: activePersona.nom,
            auteur_role: activePersona.role,
            decision: 'reject',
            motif: 'Rejet visa institutionnel — montant ou justification insuffisante.',
          })
        : rejectSupplyOrder(d.id, {
            auteur_nom: activePersona.nom,
            auteur_role: activePersona.role,
            motif: 'Dossier incomplet ou quantités non justifiées au regard du stock/CMM.',
          }),
      inVisa
        ? 'Visa refusé — dossier REJETEE_VISA.'
        : 'Demande rejetée (Appro) — retour antenne avec motif.'
    );
  };

  const handleCreateNewDemand = async (e) => {
    e.preventDefault();
    setDemandSubmitError(null);
    if (!demandLignes.length) {
      setDemandSubmitError('Ajoutez au moins un médicament depuis le catalogue national.');
      return;
    }
    const antenneId = resolveAntenneId();
    if (!antenneId) {
      setDemandSubmitError('Impossible de déterminer l\'antenne provinciale. Rechargez la page.');
      return;
    }

    setDemandSubmitting(true);
    try {
      const payload = {
        antenne_id: antenneId,
        demandeur_nom: activePersona?.nom || 'Demandeur OPN',
        motif: demandMotif,
        lignes: demandLignes.map((l) => ({
          produit_id: Number(l.produit_id),
          quantite_demandee: Number(l.quantite_demandee) || 1,
        })),
      };

      const res = await createSupplyOrder(payload);
      if (res?.success === false) {
        setDemandSubmitError(res?.message || 'Échec de l\'enregistrement de la demande.');
        return;
      }
      setOrderCreatedSuccess(true);
      setTimeout(() => {
        setOrderCreatedSuccess(false);
        setIsNewOrderModalOpen(false);
        setDemandLignes([]);
        loadWorkspaceData();
      }, 1200);
    } catch (err) {
      setDemandSubmitError(err?.message || 'API injoignable — demande non envoyée.');
    } finally {
      setDemandSubmitting(false);
    }
  };

  const userProv = GABON_PROVINCES.find((p) => p.id === activePersona?.provinceId) || GABON_PROVINCES[0];

  const statusBadgeClass = (statut) => {
    if (['VALIDEE_NATIONALE', 'APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS'].includes(statut)) {
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
  };

  const canShowPartialValidate = (d) => {
    if (!caps.validatePartialAntenna) return false;
    return ['SOUMIS', 'BROUILLON', 'SOUMISE_ANTENNE'].includes(d.statut) || !d.signataire_nom;
  };

  const canShowInstruct = (d) => {
    if (!caps.instructDemand) return false;
    // Collaborateurs Appro : file principale. Directrice peut aussi instruire en secours.
    if (codeRole === 'COLLABORATEUR_APPRO' || codeRole === 'APPRO_NATIONAL') {
      return isDemandInApproQueue(d.statut) || d.statut === 'EN_INSTRUCTION_APPRO';
    }
    return false;
  };

  const canShowNationalValidate = (d) => {
    if (!caps.validateNational) return false;
    return d.statut === 'INSTRUITE' || d.statut === 'EN_INSTRUCTION_APPRO';
  };

  const canShowTransfer = (d) => {
    if (!caps.transferAchats) return false;
    const circuit = getVisaCircuit(d.montant_total_xaf);
    if (circuit.requiresDir) {
      return d.statut === 'APPROUVEE_CIRCUIT';
    }
    return d.statut === 'VALIDEE_NATIONALE' || d.statut === 'APPROUVEE_CIRCUIT';
  };

  const canShowLaunchVisas = (d) => {
    if (!caps.validateNational) return false;
    const circuit = getVisaCircuit(d.montant_total_xaf);
    return circuit.requiresDir && d.statut === 'VALIDEE_NATIONALE';
  };

  const canShowVisaApprove = (d) => canRoleVisaDemand(codeRole, d.statut, d.montant_total_xaf);

  const canShowReject = (d) => {
    if (canShowVisaApprove(d)) return true;
    if (!caps.rejectAppro) return false;
    return isDemandInApproQueue(d.statut) || ['EN_INSTRUCTION_APPRO', 'INSTRUITE'].includes(d.statut);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {actionMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#2E68B4] text-white px-4 py-3 rounded-md shadow-xl text-xs font-bold">
          {actionMessage}
        </div>
      )}

      {codeRole === 'DG' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDgDeskTab('visas')}
            className={`rounded px-3 py-1.5 text-xs font-semibold ${
              dgDeskTab === 'visas' ? 'bg-[#2E68B4] text-white' : 'border border-slate-200 bg-white text-slate-700'
            }`}
          >
            Visas & signatures
          </button>
          <button
            type="button"
            onClick={() => setDgDeskTab('suggestions')}
            className={`rounded px-3 py-1.5 text-xs font-semibold ${
              dgDeskTab === 'suggestions' ? 'bg-[#2E68B4] text-white' : 'border border-slate-200 bg-white text-slate-700'
            }`}
          >
            Suggestions Appro
          </button>
        </div>
      )}

      {codeRole === 'DG' && dgDeskTab === 'suggestions' ? (
        <ApproSuggestionsDgPanel
          mode="dg"
          onFlash={(msg) => {
            setActionMessage(msg);
            setTimeout(() => setActionMessage(null), 4000);
          }}
        />
      ) : (
      <>

      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
          <span>
            Session Sanctum inactive — les validations Appro / visas sont bloquées.
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
            <h1 className="text-xl sm:text-2xl font-black text-[#2E68B4]">
              {activePersona.nom}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              <strong className="text-slate-900">{activePersona.role}</strong> • {activePersona.entite}
            </p>
            {caps.superviseReadonly && (
              <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Mode supervision — aucune signature / validation métier Appro
              </p>
            )}
          </div>
        </div>

        {caps.createDemand && (
          <button
            onClick={openNewDemandModal}
            className="px-4 py-2.5 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {codeRole === 'CHEF_ANTENNE_PROVINCIALE'
                ? 'Créer / Consolider une Demande Antenne'
                : 'Émettre une Demande d\'Approvisionnement'}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone de Rattachement</span>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#2E68B4]" />
            {userProv.id} – {userProv.nom} ({userProv.chefLieu})
          </h4>
          <p className="text-xs text-slate-600">
            {activePersona.scope === 'NATIONAL' || activePersona.scope === 'GLOBAL'
              ? 'Périmètre national — toutes antennes visibles selon rôle.'
              : 'Cloisonnement géographique provincial appliqué.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Structures du Périmètre</span>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#00A651]" />
            {structures.length} Établissements Sanitaires
          </h4>
          <p className="text-xs text-slate-600">
            Hôpitaux régionaux, officines et centres médicaux sous tutelle.
          </p>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Habilitations & Droits</span>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            {activePersona.droits ? activePersona.droits.length : 4} Droits Accordés
          </h4>
          <p className="text-xs text-slate-600">
            Actions affichées selon hiérarchie Appro (RBAC).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#2E68B4]" />
              {codeRole === 'COLLABORATEUR_APPRO' && 'File d\'instruction — Demandes des antennes'}
              {codeRole === 'APPRO_NATIONAL' && 'Validation nationale — Dossiers instruits'}
              {codeRole === 'CHEF_ANTENNE_PROVINCIALE' && 'Demandes antenne — Validation & envoi Appro'}
              {codeRole === 'SUPER_ADMIN' && 'Supervision demandes (lecture seule)'}
              {codeRole === 'DIR' && 'File visa Opérations (DIR)'}
              {codeRole === 'DAF' && 'File visa Engagement budgétaire (DAF)'}
              {codeRole === 'DG' && 'File visa final Directeur Général'}
              {!['COLLABORATEUR_APPRO', 'APPRO_NATIONAL', 'CHEF_ANTENNE_PROVINCIALE', 'SUPER_ADMIN', 'DIR', 'DAF', 'DG'].includes(codeRole) &&
                'Dossiers de Demandes & Suivi des Approvisionnements'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Seuils visas : ≤ 5M sans visa · 5–20M DIR→DAF · &gt; 20M DIR→DAF→DG
            </p>
          </div>
          <span className="text-xs font-bold text-[#2E68B4] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            {loading ? '…' : `${visibleOrders.length} Dossier(s)`}
          </span>
        </div>

        <div className="space-y-3">
          {visibleOrders.map((d) => {
            const circuit = getVisaCircuit(d.montant_total_xaf);
            return (
            <div 
              key={d.id}
              className="p-4 rounded-md border border-slate-200 hover:border-slate-300 bg-slate-50/70 space-y-3 text-xs transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-900">{d.numero_demande}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass(d.statut)}`}>
                      {(d.statut || '').replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{d.antenne?.nom || 'Antenne Provinciale'}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    Demandeur : {d.demandeur_nom}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                    Motif : {d.motif || 'Réassort régulier'}
                  </p>
                  <p className="text-[11px] text-violet-800 mt-1.5 font-semibold bg-violet-50 border border-violet-100 rounded px-2 py-1 inline-block">
                    Circuit visas : {formatSeuilHint(d.montant_total_xaf)}
                    {circuit.steps.length > 0 && (
                      <span className="ml-2 font-mono text-violet-600">[{circuit.steps.join(' → ')}]</span>
                    )}
                  </p>
                  {d.instructeur_nom && (
                    <p className="text-[11px] text-sky-800 mt-1 font-medium">
                      Instruit par : {d.instructeur_nom}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#2E68B4] block">
                    {formatXAF(d.montant_total_xaf)}
                  </span>
                  <div className="text-[11px] text-slate-600 mt-1">
                    <span>Demandé : <strong>{d.quantite_totale_demandee || 100}</strong></span>
                    {d.quantite_totale_validee !== undefined && (
                      <span className="ml-2 text-emerald-700 font-bold">Validé : {d.quantite_totale_validee}</span>
                    )}
                    {d.quantite_totale_reliquat > 0 && (
                      <span className="ml-2 text-amber-700 font-bold bg-amber-50 px-1 rounded border border-amber-200">
                        Reliquat : {d.quantite_totale_reliquat}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap text-[11px] text-slate-600">
                <div>
                  {d.signataire_nom ? (
                    <span className="text-emerald-800 font-medium">
                      Signé antenne : <strong>{d.signataire_nom}</strong>
                      {d.signataire_role ? ` (${d.signataire_role})` : ''}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      En attente de validation / signature antenne
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {canShowPartialValidate(d) && (
                    <button
                      onClick={() => handleOpenValidation(d)}
                      className="px-3 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Valider Partiellement & Envoyer Appro
                    </button>
                  )}

                  {canShowInstruct(d) && (
                    <button
                      disabled={actionBusyId === d.id}
                      onClick={() => handleInstruct(d)}
                      className="px-3 py-1.5 bg-[#2E68B4] hover:bg-[#245794] text-white font-bold rounded text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      {d.statut === 'EN_INSTRUCTION_APPRO' ? 'Terminer l\'instruction' : 'Prendre en charge'}
                    </button>
                  )}

                  {canShowNationalValidate(d) && (
                    <button
                      disabled={actionBusyId === d.id}
                      onClick={() => handleValidateNational(d)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Valider Nationale Appro
                    </button>
                  )}

                  {canShowLaunchVisas(d) && (
                    <button
                      disabled={actionBusyId === d.id}
                      onClick={() => handleLaunchVisas(d)}
                      className="px-3 py-1.5 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Lancer circuit visas
                    </button>
                  )}

                  {canShowVisaApprove(d) && (
                    <button
                      disabled={actionBusyId === d.id}
                      onClick={() => handleApproveVisa(d)}
                      className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Accorder visa {codeRole}
                    </button>
                  )}

                  {canShowTransfer(d) && (
                    <button
                      disabled={actionBusyId === d.id}
                      onClick={() => handleTransferAchats(d)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Transmettre Achats
                    </button>
                  )}

                  {canShowReject(d) && (
                    <button
                      disabled={actionBusyId === d.id}
                      onClick={() => handleReject(d)}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded text-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Rejeter
                    </button>
                  )}
                </div>
              </div>
            </div>
            );
          })}

          {!loading && visibleOrders.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Aucun dossier dans votre file de traitement pour ce profil.
            </div>
          )}
        </div>
      </div>

      <PartialValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        demande={selectedDemandeToValidate}
        activePersona={activePersona}
        onValidationSuccess={handleValidationSuccess}
      />

      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#00A651] text-white flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Émettre une Demande d&apos;Approvisionnement</h3>
                  <p className="text-[11px] text-slate-500">Circuit : structure / antenne → Collaborateurs Appro → Directrice Appro</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsNewOrderModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {orderCreatedSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#00A651] mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Demande Enregistrée avec Succès</h4>
                <p className="text-xs text-slate-600">Le dossier entre dans le circuit hiérarchique Appro.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateNewDemand} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catalogue national — rechercher un médicament (DCI / désignation / code)
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="search"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Ex. Paracétamol, Artéméther, OPN-..."
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {catalogLoading
                      ? 'Chargement du catalogue…'
                      : `${catalogProducts.length} produit(s) affiché(s) — cliquez pour ajouter à votre liste de choix.`}
                  </p>
                  <div className="mt-2 max-h-44 overflow-y-auto border border-slate-200 rounded divide-y divide-slate-100 bg-slate-50">
                    {catalogProducts.length === 0 && !catalogLoading && (
                      <div className="px-3 py-4 text-slate-500 text-center">Aucun produit trouvé.</div>
                    )}
                    {catalogProducts.map((p) => {
                      const already = demandLignes.some((l) => Number(l.produit_id) === Number(p.id));
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addProductToDemand(p)}
                          className="w-full text-left px-3 py-2 hover:bg-emerald-50 transition-colors flex items-start justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{p.designation || p.dci}</div>
                            <div className="text-[10px] text-slate-500 truncate">
                              DCI : {p.dci}
                              {p.forme ? ` · ${p.forme}` : ''}
                              {p.dosage ? ` ${p.dosage}` : ''}
                              {p.code_produit ? ` · ${p.code_produit}` : ''}
                            </div>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${already ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-slate-200 text-slate-600'}`}>
                            {already ? 'Dans la liste' : '+ Ajouter'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Liste de choix ({demandLignes.length})
                  </label>
                  {demandLignes.length === 0 ? (
                    <div className="border border-dashed border-slate-300 rounded px-3 py-4 text-slate-500 text-center bg-white">
                      Aucun médicament sélectionné. Utilisez la recherche ci-dessus pour composer votre besoin réel.
                    </div>
                  ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                      {demandLignes.map((l) => (
                        <li
                          key={l.produit_id}
                          className="flex items-center gap-2 border border-slate-200 rounded px-2.5 py-2 bg-white"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 truncate">{l.designation}</div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {l.dci}
                              {l.code_produit ? ` · ${l.code_produit}` : ''}
                            </div>
                          </div>
                          <label className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-slate-600">
                            Qté
                            <input
                              type="number"
                              min="1"
                              required
                              value={l.quantite_demandee}
                              onChange={(e) => updateDemandLigneQty(l.produit_id, e.target.value)}
                              className="w-16 px-1.5 py-1 border border-slate-300 rounded text-slate-900 font-bold"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeDemandLigne(l.produit_id)}
                            className="shrink-0 p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Retirer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Motif & Service Hospitalier</label>
                  <textarea
                    rows="3"
                    required
                    value={demandMotif}
                    onChange={(e) => setDemandMotif(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  />
                </div>

                {demandSubmitError && (
                  <div className="px-3 py-2 rounded border border-rose-200 bg-rose-50 text-rose-800 text-[11px] font-medium">
                    {demandSubmitError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderModalOpen(false)}
                    className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={demandSubmitting || demandLignes.length === 0}
                    className="px-4 py-2 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded shadow-sm disabled:opacity-60"
                  >
                    {demandSubmitting ? 'Envoi…' : `Soumettre (${demandLignes.length} produit${demandLignes.length > 1 ? 's' : ''})`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
