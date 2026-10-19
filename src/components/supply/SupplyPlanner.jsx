import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  Loader2,
  RefreshCw,
  Activity,
  ArrowRightLeft,
} from 'lucide-react';
import {
  fetchProducts,
  fetchOrders,
  fetchAntennes,
  simulateCMM,
  createSupplyOrder,
} from '../../services/api';
import { calculateSupplyNeed } from '../../utils/cmmCalculator';
import { formatXAF, formatNumber } from '../../utils/formatters';
import { getCodeRole, getRoleCapabilities } from '../../data/rbacMatrix';
import NationalTransferArbitrageModal from './NationalTransferArbitrageModal';

function getProductLots(produit) {
  return produit?.lots_fefo ?? produit?.lotsFefo ?? [];
}

function stockForAntenne(produit, antenneId) {
  if (!produit || antenneId == null) return 0;
  return getProductLots(produit).reduce((sum, lot) => {
    if (Number(lot.antenne_id ?? lot.antenneId) !== Number(antenneId)) return sum;
    return sum + Number(lot.quantite_disponible ?? lot.quantiteDisponible ?? 0);
  }, 0);
}

function normalizeApiSimulation(sim) {
  if (!sim) return null;
  return {
    cmmAjustee: sim.cmm_ajustee ?? sim.cmmAjustee ?? 0,
    stockSecuriteUnites: sim.stock_securite_unites ?? sim.stockSecuriteUnites ?? 0,
    consoPendantLeadTime: sim.conso_pendant_lead_time ?? sim.consoPendantLeadTime ?? 0,
    stockCible: sim.stock_cible ?? sim.stockCible ?? 0,
    quantiteRecommandee: sim.quantite_recommandee ?? sim.quantiteRecommandee ?? 0,
    autonomieJours: sim.autonomie_jours ?? sim.autonomieJours ?? 0,
    niveauCriticite: sim.niveau_criticite ?? sim.niveauCriticite ?? 'NORMAL',
    coutTotalXAF: sim.cout_total_xaf ?? sim.coutTotalXAF ?? 0,
  };
}

export default function SupplyPlanner({ activePersona, sanctumReady = false }) {
  const caps = getRoleCapabilities(getCodeRole(activePersona));

  const [products, setProducts] = useState([]);
  const [antennes, setAntennes] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cmmBusy, setCmmBusy] = useState(false);
  const [apiSimulation, setApiSimulation] = useState(null);

  const [selectedAntenneId, setSelectedAntenneId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [coeffSaisonnier, setCoeffSaisonnier] = useState(1.2);
  const [stockSecuriteJours, setStockSecuriteJours] = useState(45);
  const [isArbitrageOpen, setIsArbitrageOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setActionError(null);
    try {
      const [prodRes, ordRes, antRes] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchAntennes(),
      ]);

      const prodList = Array.isArray(prodRes?.produits) ? prodRes.produits : [];
      setProducts(prodList);

      let antList = Array.isArray(antRes?.antennes) ? antRes.antennes : [];
      // Fallback : antennes uniques extraites des lots produits
      if (antList.length === 0) {
        const map = new Map();
        prodList.forEach((p) => {
          getProductLots(p).forEach((lot) => {
            const id = lot.antenne_id ?? lot.antenneId;
            if (id == null || map.has(id)) return;
            map.set(id, lot.antenne || { id, nom: `Antenne #${id}`, lead_time_jours: 7 });
          });
        });
        antList = Array.from(map.values());
      }
      setAntennes(antList);

      setSelectedProductId((prev) => {
        if (prev && prodList.some((p) => String(p.id) === String(prev))) return prev;
        return prodList[0] ? String(prodList[0].id) : '';
      });
      setSelectedAntenneId((prev) => {
        if (prev && antList.some((a) => String(a.id) === String(prev))) return prev;
        // Prefer first lot antenne of first product when available
        const firstLots = prodList[0] ? getProductLots(prodList[0]) : [];
        const fromLot = firstLots[0]?.antenne_id ?? firstLots[0]?.antenneId;
        if (fromLot != null && antList.some((a) => Number(a.id) === Number(fromLot))) {
          return String(fromLot);
        }
        return antList[0] ? String(antList[0].id) : '';
      });

      const demandes = Array.isArray(ordRes?.demandes) ? ordRes.demandes : [];
      setOrdersList(demandes);
      setSelectedOrder((prev) => {
        if (prev && demandes.some((d) => d.id === prev.id)) {
          return demandes.find((d) => d.id === prev.id) || demandes[0] || null;
        }
        return demandes[0] || null;
      });

      if (!ordRes?.demandes) {
        setLoadError(ordRes?.message || 'Liste des commandes vide ou inaccessible.');
      }
    } catch (err) {
      setProducts([]);
      setAntennes([]);
      setOrdersList([]);
      setSelectedOrder(null);
      setLoadError(err?.backendUnavailable ? '' : (err?.message || 'Connexion au serveur indisponible — données non synchronisées.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentProduct = useMemo(
    () => products.find((p) => String(p.id) === String(selectedProductId)) || null,
    [products, selectedProductId]
  );

  const currentAntenne = useMemo(
    () => antennes.find((a) => String(a.id) === String(selectedAntenneId)) || null,
    [antennes, selectedAntenneId]
  );

  const currentStockLocal = stockForAntenne(currentProduct, selectedAntenneId);
  const cmmNationale = Number(currentProduct?.cmm_nationale ?? currentProduct?.cmmNationale ?? 0);
  const stockValeur = Number(currentAntenne?.stock_valeur_xaf ?? 0);
  const cmmEstimee = Math.round(cmmNationale * (stockValeur > 0 ? stockValeur / 800000000 : 0.1));
  const prixUnitaire = Number(
    currentProduct?.prix_unitaire_xaf ?? currentProduct?.prixUnitaireXAF ?? 0
  );
  const unite = currentProduct?.unite_gestion || currentProduct?.uniteGestion || 'unité';
  const leadTime = Number(currentAntenne?.lead_time_jours ?? currentAntenne?.leadTimeJours ?? 7);

  const localPreview = useMemo(() => {
    if (!currentProduct || !currentAntenne) {
      return {
        cmmAjustee: 0,
        stockSecuriteUnites: 0,
        consoPendantLeadTime: 0,
        stockCible: 0,
        quantiteRecommandee: 0,
        autonomieJours: 0,
        niveauCriticite: 'NORMAL',
        coutTotalXAF: 0,
      };
    }
    return calculateSupplyNeed({
      cmmLocale: Math.max(cmmEstimee, 500),
      stockDispo: currentStockLocal,
      enTransit: 0,
      leadTimeJours: leadTime,
      stockSecuriteJours,
      coeffSaisonnier,
      prixUnitaireXAF: prixUnitaire,
    });
  }, [
    currentProduct,
    currentAntenne,
    cmmEstimee,
    currentStockLocal,
    leadTime,
    stockSecuriteJours,
    coeffSaisonnier,
    prixUnitaire,
  ]);

  // Reset API sim when inputs change
  useEffect(() => {
    setApiSimulation(null);
  }, [selectedAntenneId, selectedProductId, stockSecuriteJours, coeffSaisonnier]);

  const displaySim = apiSimulation || localPreview;

  const flashSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSimulateCmmApi = async () => {
    setActionError(null);
    if (!sanctumReady) {
      setActionError('Session Sanctum inactive — Accès Intranet requis pour simuler le CMM API.');
      return;
    }
    if (!selectedAntenneId || !selectedProductId) {
      setActionError('Sélectionnez une antenne et un produit issus de l’API.');
      return;
    }
    setCmmBusy(true);
    try {
      const res = await simulateCMM(
        Number(selectedAntenneId),
        Number(selectedProductId),
        stockSecuriteJours,
        coeffSaisonnier
      );
      if (!res?.success && !res?.simulation) {
        setActionError(res?.message || 'Simulation CMM refusée par l’API.');
        setApiSimulation(null);
        return;
      }
      setApiSimulation(normalizeApiSimulation(res.simulation));
      flashSuccess('Simulation CMM API confirmée (Jean Obiang / Owendo hub).');
    } catch (err) {
      setApiSimulation(null);
      setActionError(err?.backendUnavailable ? '' : (err?.message || 'Échec simulation CMM.'));
    } finally {
      setCmmBusy(false);
    }
  };

  const handleCreateOrder = async () => {
    setActionError(null);
    if (!sanctumReady) {
      setActionError('Session Sanctum inactive — impossible de créer une demande Appro.');
      return;
    }
    if (!currentProduct || !currentAntenne) {
      setActionError('Produit et antenne API requis pour créer la demande.');
      return;
    }
    const qty = Number(displaySim.quantiteRecommandee || 0);
    if (qty <= 0) {
      setActionError('Quantité recommandée nulle — ajustez les paramètres CMM.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        antenne_id: Number(currentAntenne.id),
        demandeur_nom: activePersona?.nom || 'Pharmacien Chef Antenne',
        motif: `Réassort CMM (${currentProduct.designation}) — ${currentAntenne.nom || currentAntenne.chef_lieu}`,
        lignes: [
          {
            produit_id: Number(currentProduct.id),
            quantite_demandee: qty,
          },
        ],
      };
      const res = await createSupplyOrder(payload);
      if (!res?.success) {
        setActionError(res?.message || 'Création de demande refusée par l’API.');
        return;
      }
      flashSuccess(
        res.message ||
          `Demande ${res.demande?.numero_demande || ''} enregistrée — transmise Appro Owendo.`
      );
      await loadData();
      if (res.demande) setSelectedOrder(res.demande);
    } catch (err) {
      setActionError(err?.backendUnavailable ? '' : (err?.message || 'Échec création de la demande.'));
    } finally {
      setSubmitting(false);
    }
  };

  const workflowSteps = selectedOrder?.historique_workflow || selectedOrder?.historiqueWorkflow || [];
  const orderLignes = selectedOrder?.lignes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          Session Sanctum inactive — simulation CMM API et création de commandes bloquées jusqu&apos;à
          Accès Intranet.
        </div>
      )}

      {actionSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {(loadError || actionError) && (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{actionError || loadError}</span>
        </div>
      )}

      {/* Header Approvisionnement */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
            <span className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider">
              MOTEUR DE RÉAPPROVISIONNEMENT & PRÉVISION CMM
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2E68B4]">
            Approvisionnements & Commandes Provinciales
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Calcul prédictif branché sur l&apos;API Laravel (antennes & produits) et bons de commande
            en FCFA (XAF).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsArbitrageOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            title="Moteur d'Arbitrage Inter-Antennes : surstock (>4 mois) vs rupture (<1 mois) (EF-M8 / AM-08)"
          >
            <ArrowRightLeft className="w-4 h-4 text-purple-200" />
            Arbitrage Transferts (AM-08)
          </button>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* SECTION 1 : SIMULATEUR CMM */}
      <div className="bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-opn-navy">
                Calculateur Automatique de Réapprovisionnement CMM
              </h3>
              <p className="text-xs text-slate-500">
                Prévisualisation locale + confirmation serveur{' '}
                <code className="text-[10px] bg-slate-100 px-1 rounded">/supply/simulate-cmm</code>
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto">
            Devise : FCFA (XAF)
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-opn-navy" />
            Chargement produits, antennes et commandes API…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Antenne Provinciale (ID DB)
                </label>
                <select
                  value={selectedAntenneId}
                  onChange={(e) => setSelectedAntenneId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-opn-navy focus:bg-white font-medium"
                  disabled={antennes.length === 0}
                >
                  {antennes.length === 0 && <option value="">Aucune antenne API</option>}
                  {antennes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nom || a.chef_lieu || `Antenne #${a.id}`} —{' '}
                      {a.chef_lieu || a.ville_antenne || 'Gabon'} (
                      {a.lead_time_jours ?? a.leadTimeJours ?? '?'}j)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Médicament / DCI
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-opn-navy focus:bg-white font-medium"
                  disabled={products.length === 0}
                >
                  {products.length === 0 && <option value="">Aucun produit API</option>}
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.designation} ({formatXAF(prod.prix_unitaire_xaf ?? 0)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. Réserve Sécurité (Jours)
                </label>
                <input
                  type="number"
                  min={15}
                  max={90}
                  value={stockSecuriteJours}
                  onChange={(e) => setStockSecuriteJours(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-opn-navy focus:bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Facteur Saisonnier
                </label>
                <select
                  value={coeffSaisonnier}
                  onChange={(e) => setCoeffSaisonnier(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-opn-navy focus:bg-white font-medium"
                >
                  <option value={1.0}>1.0x (Période Normale)</option>
                  <option value={1.2}>1.2x (+20% Saison des Pluies)</option>
                  <option value={1.4}>1.4x (+40% Pic Épidémique)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-8 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      displaySim.niveauCriticite === 'CRITIQUE' ||
                      displaySim.niveauCriticite === 'RUPTURE'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : displaySim.niveauCriticite === 'VIGILANCE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    Statut : {displaySim.niveauCriticite}
                    {apiSimulation ? ' (API)' : ' (aperçu local)'}
                  </span>
                  <span className="text-xs text-slate-600">
                    Stock actuel :{' '}
                    <strong className="text-slate-900">
                      {formatNumber(currentStockLocal)} {unite}s
                    </strong>{' '}
                    (Autonomie :{' '}
                    <strong className="text-amber-700">{displaySim.autonomieJours} jours</strong>)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-md bg-white border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">CMM Ajustée</span>
                    <p className="font-bold text-opn-navy text-sm">
                      {formatNumber(displaySim.cmmAjustee)} / mois
                    </p>
                  </div>
                  <div className="p-2.5 rounded-md bg-white border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">
                      Stock Sécurité
                    </span>
                    <p className="font-bold text-amber-700 text-sm">
                      {formatNumber(displaySim.stockSecuriteUnites)} unités
                    </p>
                  </div>
                  <div className="p-2.5 rounded-md bg-white border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">
                      Conso Transit
                    </span>
                    <p className="font-bold text-blue-700 text-sm">
                      {formatNumber(displaySim.consoPendantLeadTime)} unités
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 p-4 rounded-md bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Quantité Recommandée
                  </span>
                  <p className="text-2xl font-bold text-opn-green leading-tight">
                    {formatNumber(displaySim.quantiteRecommandee)}{' '}
                    <span className="text-xs font-normal text-slate-600">{unite}s</span>
                  </p>
                  <p className="text-xs font-bold text-amber-700 mt-1">
                    Budget Estimé : {formatXAF(displaySim.coutTotalXAF)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateCmmApi}
                  disabled={cmmBusy || !selectedAntenneId || !selectedProductId}
                  className="w-full py-2 px-3 rounded-md bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {cmmBusy ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Activity className="w-3.5 h-3.5" />
                  )}
                  Confirmer simulation API
                </button>

                {caps.createDemand && (
                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    disabled={
                      submitting ||
                      displaySim.quantiteRecommandee === 0 ||
                      !currentProduct ||
                      !currentAntenne
                    }
                    className="w-full py-2 px-3 rounded-md bg-opn-navy hover:bg-[#124b80] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Générer Bon de Commande OPN
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* SECTION 2 : LISTE COMMANDES API */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-3 min-h-[280px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-opn-navy flex items-center gap-2">
              <FileText className="w-4 h-4 text-opn-navy" />
              Demandes & Commandes ({ordersList.length})
            </h3>
            <span className="text-[11px] text-slate-500">API /supply/orders</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-xs text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement…
            </div>
          ) : ordersList.length === 0 ? (
            <div className="p-6 rounded-md bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              Aucune demande d&apos;approvisionnement retournée par l&apos;API.
            </div>
          ) : (
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {ordersList.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const ville =
                  order.antenne?.ville_antenne ||
                  order.antenne?.chef_lieu ||
                  order.villeDestination ||
                  '—';
                const province =
                  order.antenne?.nom || order.provinceNom || `Antenne #${order.antenne_id}`;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedOrder(order)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-opn-navy shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-opn-navy">
                        {order.numero_demande || order.numeroDemande}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-opn-navy border border-blue-200">
                        {order.statut}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 mt-1.5">
                      {ville} ({province})
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{order.motif || '—'}</p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500">
                        Demandeur :{' '}
                        {(order.demandeur_nom || order.demandeurNom || '—').split(' ').slice(-1)[0]}
                      </span>
                      <span className="font-bold text-amber-700">
                        {formatXAF(order.montant_total_xaf ?? order.montantTotalXAF)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-5 min-h-[280px]">
          {!selectedOrder ? (
            <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
              <FileText className="w-6 h-6 text-slate-300" />
              Sélectionnez une demande API pour afficher le workflow.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-opn-navy px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                    {selectedOrder.numero_demande || selectedOrder.numeroDemande}
                  </span>
                  <h3 className="text-base font-bold text-opn-navy mt-1.5">
                    Approvisionnement{' '}
                    {selectedOrder.antenne?.chef_lieu ||
                      selectedOrder.antenne?.ville_antenne ||
                      selectedOrder.villeDestination ||
                      '—'}{' '}
                    (
                    {selectedOrder.antenne?.nom ||
                      selectedOrder.provinceNom ||
                      `#${selectedOrder.antenne_id}`}
                    )
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedOrder.mode_transport || selectedOrder.modeTransport || '—'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Montant Total
                  </span>
                  <p className="text-base font-bold text-amber-700">
                    {formatXAF(selectedOrder.montant_total_xaf ?? selectedOrder.montantTotalXAF)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-opn-green" />
                  Traçabilité & Étapes de Validation (Workflow OPN)
                </h4>

                {workflowSteps.length === 0 ? (
                  <p className="text-xs text-slate-500">Aucun historique workflow sur cette demande.</p>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {workflowSteps.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step.valide
                              ? 'bg-opn-green text-white shadow-sm'
                              : 'bg-slate-200 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {step.valide ? '✓' : idx + 1}
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{step.etape}</span>
                            <span
                              className={`text-[10px] font-medium ${
                                step.valide ? 'text-opn-green' : 'text-slate-500'
                              }`}
                            >
                              {step.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Responsable :{' '}
                            <strong className="text-slate-700">{step.auteur}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Produits Inclus dans le Convoi
                </h4>
                {orderLignes.length === 0 ? (
                  <p className="text-xs text-slate-500">Aucune ligne produit.</p>
                ) : (
                  <div className="space-y-2">
                    {orderLignes.map((ligne, idx) => (
                      <div
                        key={ligne.id || idx}
                        className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">
                            {ligne.produit?.designation || ligne.designation || `Produit #${ligne.produit_id}`}
                          </span>
                          <p className="text-[10px] text-slate-500">
                            {ligne.produit?.code_produit || ligne.code || `ID ${ligne.produit_id}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-800">
                            {formatNumber(
                              ligne.quantite_validee ??
                                ligne.quantiteValidee ??
                                ligne.quantite_demandee ??
                                0
                            )}{' '}
                            {ligne.produit?.unite_gestion || ligne.unite || 'unité'}s
                          </span>
                          <p className="text-[10px] text-amber-700 font-bold">
                            {formatXAF(ligne.total_ligne_xaf ?? ligne.totalLigneXAF)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Module M8 : Moteur d'Arbitrage des Transferts Inter-Antennes */}
      <NationalTransferArbitrageModal
        isOpen={isArbitrageOpen}
        onClose={() => setIsArbitrageOpen(false)}
      />
    </div>
  );
}
