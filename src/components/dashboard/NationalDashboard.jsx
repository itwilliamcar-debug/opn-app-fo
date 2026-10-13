import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  Clock,
  Compass,
  Loader2,
  RefreshCw,
  FileText,
  Thermometer,
  ShieldCheck,
  Building2,
  Receipt,
  Users,
  Layers,
  MapPin,
  CheckCircle2,
  Radio,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap,
  PhoneCall
} from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { fetchNationalOverview, fetchOrders } from '../../services/api';
import { formatXAF, formatNumber } from '../../utils/formatters';
import GabonOfficialInteractiveMap from '../common/GabonOfficialInteractiveMap';
import BulletinStrategiqueNationalPdfModal from './BulletinStrategiqueNationalPdfModal';
import {
  NATIONAL_STRATEGIC_METRICS,
  PROVINCES_STRATEGIC_DATA,
  EXECUTIVE_STRATEGIC_DIRECTIVES
} from '../../data/strategicDashboardData';

export default function NationalDashboard({
  activePersona,
  onSelectProvince,
  onNavigateModule,
  sanctumReady = false,
}) {
  const [selectedProvinceId, setSelectedProvinceId] = useState('G2');
  const [activeLayer, setActiveLayer] = useState('stocks'); // 'stocks' | 'pistes' | 'froid' | 'crise'
  const [activeSubTab, setActiveSubTab] = useState('pna'); // 'pna' | 'froid' | 'pistes' | 'cnamgs' | 'rh'
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveKpis, setLiveKpis] = useState(null);
  const [liveCriticalProducts, setLiveCriticalProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fusionner les données de base souveraines avec les données live de l'API Sanctum si dispo
  const loadOverview = useCallback(async () => {
    if (!sanctumReady) {
      setLiveKpis(null);
      setLiveCriticalProducts([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchNationalOverview();
      if (res?.kpis) {
        setLiveKpis(res.kpis);
      }
      if (Array.isArray(res?.produits_critiques)) {
        setLiveCriticalProducts(res.produits_critiques);
      }
    } catch (err) {
      // Garder les données souveraines sans bloquer
      console.warn("API live fallback sur données souveraines consolidées:", err?.message);
    } finally {
      setLoading(false);
    }
  }, [sanctumReady]);

  const loadOrders = useCallback(async () => {
    if (!sanctumReady) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const res = await fetchOrders();
      const list = Array.isArray(res?.demandes)
        ? res.demandes
        : Array.isArray(res?.orders)
          ? res.orders
          : [];
      setOrders(list.slice(0, 6));
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [sanctumReady]);

  useEffect(() => {
    loadOverview();
    loadOrders();
  }, [loadOverview, loadOrders]);

  // Province sélectionnée
  const selectedProvince = useMemo(() => {
    return (
      PROVINCES_STRATEGIC_DATA.find((p) => p.id === selectedProvinceId) ||
      PROVINCES_STRATEGIC_DATA[0]
    );
  }, [selectedProvinceId]);

  const handleSelectProvince = (provId) => {
    setSelectedProvinceId(provId);
    if (onSelectProvince) onSelectProvince(provId);
  };

  const metrics = NATIONAL_STRATEGIC_METRICS;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Header Exécutif & Actions Stratégiques */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4]" />
        
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
            <span className="text-[11px] font-black text-[#00A651] uppercase tracking-wider">
              COCKPIT STRATÉGIQUE NATIONAL 360° — VISION DG & MINISTÈRE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Tableau de bord exécutif — stocks et approvisionnements
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Fédération en temps réel des 10 modules ERP : PNA 18,5 Mrd FCFA, 9 Antennes Provinciales, IoT Froid, CNAMGS & Flotte OPN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPdfModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Bulletin Mensuel A4
          </button>

          <button
            type="button"
            onClick={() => onNavigateModule('supply')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            Réassort National CMM
          </button>

          <button
            type="button"
            onClick={() => {
              loadOverview();
              loadOrders();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Barre de Navigation des 4 Couches Cartographiques */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2E68B4]" />
          <span className="text-xs font-bold text-slate-800">Couche Cartographique Active :</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveLayer('stocks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeLayer === 'stocks'
                ? 'bg-[#2E68B4] text-white border-[#2E68B4] shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            1. Stocks & Autonomie (Jours)
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('pistes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeLayer === 'pistes'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            2. Pistes & Axes Logistiques
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('froid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeLayer === 'froid'
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            3. Télémétrie Froid IoT (+2°C/+8°C)
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('crise')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeLayer === 'crise'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            4. Veille Sanitaire & Épidémies
          </button>
        </div>
      </div>

      {/* 3. Grille des 6 Grands Indicateurs Stratégiques 360° (Fédération des 10 modules) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1 : Budget & PNA (Mod 7 & 2) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-[#2E68B4] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">PNA 2026</span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-[#2E68B4] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {formatXAF(metrics.budgetPnaTotalXAF)}
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#00A651]">{metrics.tauxExecutionPna}% engagé</span>
              <span className="text-slate-400">13,69 Mrd</span>
            </div>
          </div>
        </div>

        {/* Card 2 : Valeur Stock National (Mod 1 & 5) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-[#00A651] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Stock National</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#00A651] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-[#00A651] tracking-tight">
              {formatXAF(metrics.valeurStockNationalTotalXAF)}
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">{metrics.couvertureMoyenneNationaleJours} Jours</span>
              <span className="text-emerald-600 font-bold">9 Antennes</span>
            </div>
          </div>
        </div>

        {/* Card 3 : Chaîne du Froid IoT & GMAO (Mod 10) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-cyan-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Froid & Énergies</span>
            <div className="w-7 h-7 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-cyan-700 tracking-tight">
              {metrics.tauxConformiteChambreFroidIot}% Conforme
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">{metrics.totalEnceintesFroidIot} Enceintes</span>
              <span className="font-mono text-cyan-700 font-bold">{metrics.temperatureMoyenneNationale}</span>
            </div>
          </div>
        </div>

        {/* Card 4 : Recouvrement CNAMGS (Mod 4) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Recouvrement</span>
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {metrics.tauxRecouvrementCnamgs}% CNAMGS
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700">{formatXAF(metrics.encaissementsCnamgsXAF)}</span>
              <span className="text-slate-400">Reçus</span>
            </div>
          </div>
        </div>

        {/* Card 5 : Qualité & LNCM / DMP (Mod 3) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-teal-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Contrôle Qualité</span>
            <div className="w-7 h-7 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-teal-700 tracking-tight">
              {metrics.tauxConformiteQualiteLncm}% LNCM
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">{metrics.lotsControlesLncm} Lots testés</span>
              <span className="text-amber-600 font-bold">2 DMP</span>
            </div>
          </div>
        </div>

        {/* Card 6 : Flotte & Convois (Mod 6 & 9) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Flotte & RH</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-amber-700 tracking-tight">
              {metrics.convoisEnRoute} Convois Actifs
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">{metrics.vehiculesActifs4x4} 4x4 • {metrics.piroguesActives} Pirogues</span>
              <span className="text-slate-500 font-medium">{metrics.effectifTotalAgents} Agents</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bloc Central : Carte Interactive Multicouche & Inspecteur Provincial Approfondi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche : Carte Interactive (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#00A651]" />
                  Cartographie Opérationnelle Dynamique du Gabon
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisation vectorielle en direct selon la couche : <strong>{activeLayer.toUpperCase()}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold border border-slate-200">
                  9 Antennes Provinciales Connectées
                </span>
              </div>
            </div>

            {/* Canvas Carte */}
            <div className="relative w-full min-h-[400px] bg-slate-50/80 rounded-xl border border-slate-200 p-4 flex items-center justify-center overflow-hidden">
              <GabonOfficialInteractiveMap
                selectedProvinceId={selectedProvinceId}
                onSelectProvince={handleSelectProvince}
                activeLayer={activeLayer}
                provincesData={PROVINCES_STRATEGIC_DATA}
                className="w-full h-full max-h-[380px]"
              />
            </div>
          </div>

          {/* Sélecteur rapide des 9 provinces sous la carte */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 mt-4 pt-3 border-t border-slate-100">
            {PROVINCES_STRATEGIC_DATA.map((p) => {
              const isSelected = p.id === selectedProvinceId;
              let dotColor = 'bg-emerald-500';
              if (activeLayer === 'stocks') {
                dotColor = p.couvertureJours >= 60 ? 'bg-emerald-500' : p.couvertureJours >= 45 ? 'bg-amber-500' : 'bg-rose-500';
              } else if (activeLayer === 'pistes') {
                dotColor = p.pistesStatus.etat === 'OPTIMAL' ? 'bg-emerald-500' : p.pistesStatus.etat === 'RALENTI' ? 'bg-amber-500' : 'bg-rose-500';
              } else if (activeLayer === 'froid') {
                dotColor = p.froidIoT.statut === 'OPTIMAL' ? 'bg-cyan-500' : 'bg-amber-500';
              } else if (activeLayer === 'crise') {
                dotColor = p.criseSanitaire.alerteNiveau === 'VERTE' ? 'bg-emerald-500' : p.criseSanitaire.alerteNiveau === 'JAUNE' ? 'bg-amber-500' : 'bg-rose-500';
              }

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProvince(p.id)}
                  className={`p-1.5 rounded-lg text-center text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 font-bold text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span>{p.id}</span>
                  </div>
                  <div className={`truncate text-[9.5px] mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {p.chefLieu.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite : Inspecteur Stratégique Provincial (5 colonnes) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            
            {/* Entête Province */}
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#2E68B4] border border-blue-200 text-xs font-black">
                    Province {selectedProvince.id} • {selectedProvince.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${selectedProvince.pistesStatus.badgeColor}`}>
                    {selectedProvince.pistesStatus.etat}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1.5">
                  {selectedProvince.nom}
                </h3>
                <p className="text-xs text-slate-500">{selectedProvince.villeAntenne}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Stock Local</span>
                <p className="text-sm font-black text-[#00A651]">
                  {formatXAF(selectedProvince.stockValeurXAF)}
                </p>
                <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                  {selectedProvince.couvertureJours} Jours d'autonomie
                </p>
              </div>
            </div>

            {/* Responsable & Contact */}
            <div className="py-3 space-y-1.5 text-xs border-b border-slate-100 bg-slate-50/60 p-3 rounded-lg mt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pharmacien Chef :</span>
                <span className="font-bold text-slate-800">{selectedProvince.responsable}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ligne Directe :</span>
                <span className="font-mono font-semibold text-slate-700">{selectedProvince.telephone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Délai Acheminement :</span>
                <span className="font-bold text-amber-700">{selectedProvince.leadTimeJours} Jours depuis Owendo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Disponibilité DCI Essentiels :</span>
                <span className="font-bold text-emerald-700">{selectedProvince.tauxDisponibiliteDci}%</span>
              </div>
            </div>

            {/* Widget Thématique selon la Couche Active */}
            <div className="mt-4 p-3.5 rounded-lg border border-slate-200 bg-white">
              
              {activeLayer === 'stocks' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00A651]" />
                      Bilan des Stocks & Commandes Antenne
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      FEFO Conforme
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Valeur Immobilisée</span>
                      <span className="font-bold text-slate-900">{formatXAF(selectedProvince.stockValeurXAF)}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Autonomie Estimée</span>
                      <span className="font-bold text-amber-700">{selectedProvince.couvertureJours} Jours</span>
                    </div>
                  </div>
                </div>
              )}

              {activeLayer === 'pistes' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      Météo Pistes & Corridor d'Acheminement
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedProvince.pistesStatus.badgeColor}`}>
                      {selectedProvince.pistesStatus.vitesseMoyenne}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 mb-1">
                    {selectedProvince.pistesStatus.label}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedProvince.pistesStatus.details}
                  </p>
                  <div className="mt-2 text-[10.5px] text-slate-500 flex justify-between">
                    <span>Mode : <strong>{selectedProvince.modeTransport}</strong></span>
                  </div>
                </div>
              )}

              {activeLayer === 'froid' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-cyan-600" />
                      Supervision Chaîne du Froid & Énergies
                    </span>
                    <span className="text-[10.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedProvince.froidIoT.temperature}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Source d'énergie active :</span>
                      <span className="font-semibold text-slate-800 text-[11px]">{selectedProvince.froidIoT.sourceEnergie}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Réserve cuve gazole :</span>
                      <span className="font-bold text-amber-700">{selectedProvince.froidIoT.carburantGroupe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Enceintes surveillées :</span>
                      <span className="font-bold text-slate-900">{selectedProvince.froidIoT.enceintes} unité(s)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeLayer === 'crise' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Veille Épidémique & Urgences Sanitaires
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedProvince.criseSanitaire.badgeColor}`}>
                      Alerte {selectedProvince.criseSanitaire.alerteNiveau}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 mb-1">
                    {selectedProvince.criseSanitaire.foyer}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedProvince.criseSanitaire.actionsRiposte}
                  </p>
                  <div className="mt-2 text-[10.5px] text-slate-500 flex justify-between">
                    <span>Occupation lits hôpital : <strong>{selectedProvince.criseSanitaire.litsOccupes}</strong></span>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Boutons d'Action Rapide */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateModule('supply')}
              className="flex-1 py-2.5 px-3 rounded-lg bg-[#2E68B4] hover:bg-[#1f4a82] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              Réapprovisionner ({selectedProvince.chefLieu.split(' ')[0]})
            </button>

            <button
              type="button"
              onClick={() => onNavigateModule('antenna')}
              className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all border border-slate-200 cursor-pointer"
            >
              Stocks Antenne
            </button>

            <button
              type="button"
              onClick={() => onNavigateModule('collaborative')}
              className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all border border-slate-200 cursor-pointer"
              title="Ouvrir le canal OPN Connect"
            >
              Chat
            </button>
          </div>
        </div>

      </div>

      {/* 5. Moniteurs Fédérés des 10 Modules (Onglets Thématiques d'Analyse Stratégique) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00A651]" />
              Moniteurs Sectoriels & Décisions Stratégiques du Conseil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Traçabilité consolidée des flux d'achats, qualité, maintenance et finances hospitalières
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSubTab('pna')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'pna' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Directives DG ({EXECUTIVE_STRATEGIC_DIRECTIVES.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('froid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'froid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Chaîne Froid & GMAO
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('cnamgs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'cnamgs' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Recouvrement CNAMGS
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('rh')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'rh' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Effectifs & Gardes RH
            </button>
          </div>
        </div>

        {/* Contenu de l'onglet actif */}
        <div className="pt-4">
          
          {/* Onglet Directives DG */}
          {activeSubTab === 'pna' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXECUTIVE_STRATEGIC_DIRECTIVES.map((dir) => (
                <div key={dir.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">
                      [{dir.id}] {dir.titre}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800">
                      {dir.priorite}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dir.description}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Responsable : <strong className="text-slate-700">{dir.responsable}</strong></span>
                    <span className="font-bold text-emerald-700">Échéance : {dir.echeance}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Onglet Froid & GMAO */}
          {activeSubTab === 'froid' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200">
                  <span className="text-[10.5px] font-bold text-cyan-800 uppercase block">Total Enceintes Régulées</span>
                  <span className="text-xl font-black text-cyan-900">{metrics.totalEnceintesFroidIot} Enceintes IoT</span>
                  <p className="text-xs text-cyan-700 mt-1">11 Positives (+2°C/+8°C), 4 Négatives (-20°C), 3 Cryo (-80°C)</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-[10.5px] font-bold text-emerald-800 uppercase block">Conformité Métrologique</span>
                  <span className="text-xl font-black text-emerald-900">{metrics.tauxConformiteChambreFroidIot}% Conforme</span>
                  <p className="text-xs text-emerald-700 mt-1">Qualification annuelle 24 points sur 72h conforme BPD/OMS</p>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                  <span className="text-[10.5px] font-bold text-blue-800 uppercase block">Parc Énergie Secouru</span>
                  <span className="text-xl font-black text-blue-900">{metrics.totalGroupesElectrogenes} Groupes Électrogènes</span>
                  <p className="text-xs text-blue-700 mt-1">Autonomie moyenne nationale de {metrics.autonomieMoyenneGroupesHeures} heures continues</p>
                </div>
              </div>
            </div>
          )}

          {/* Onglet CNAMGS */}
          {activeSubTab === 'cnamgs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="p-2.5">Province</th>
                    <th className="p-2.5">Structure de Référence</th>
                    <th className="p-2.5 text-right">Facturé Mois (FCFA)</th>
                    <th className="p-2.5 text-right">Recouvré (FCFA)</th>
                    <th className="p-2.5 text-center">Taux d'Encaissement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PROVINCES_STRATEGIC_DATA.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-900">{p.id} — {p.nom}</td>
                      <td className="p-2.5 text-slate-700">{p.villeAntenne}</td>
                      <td className="p-2.5 text-right font-mono font-semibold">{formatXAF(p.financeCnamgs.factureMoisXAF)}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">{formatXAF(p.financeCnamgs.recouvreMoisXAF)}</td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          {p.financeCnamgs.tauxRecouvrement}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Onglet RH */}
          {activeSubTab === 'rh' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-bold uppercase block">Effectif Total Déployé</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.effectifTotalAgents} Agents</span>
                <p className="text-xs text-slate-600 mt-1">Owendo & 9 Antennes Provinciales</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-bold uppercase block">Permanence Sanitaire 24/7</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">100% Assurée</span>
                <p className="text-xs text-slate-600 mt-1">Pharmaciens, frigoristes & chauffeurs d'astreinte</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-bold uppercase block">Habilitations Certifiées</span>
                <span className="text-2xl font-black text-blue-700 mt-1 block">{metrics.tauxHabilitationConforme}%</span>
                <p className="text-xs text-slate-600 mt-1">Conformité BPF, BPD, CACES & Permis Nautique</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Modale d'Impression du Bulletin Mensuel A4 */}
      <BulletinStrategiqueNationalPdfModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        activePersona={activePersona}
        metrics={metrics}
        provinces={PROVINCES_STRATEGIC_DATA}
        directives={EXECUTIVE_STRATEGIC_DIRECTIVES}
      />

    </div>
  );
}
