import React, { useState, useMemo } from 'react';
import { 
  Warehouse, 
  Boxes, 
  Thermometer, 
  ClipboardCheck, 
  ArrowRightLeft, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Snowflake, 
  Flame, 
  Gauge, 
  FileText, 
  Radio, 
  Zap,
  Activity
} from 'lucide-react';

import { 
  WMS_KPIS, 
  STORAGE_ZONES, 
  WAREHOUSE_LOCATIONS, 
  BATCH_RECORDS, 
  IOT_COLD_CHAIN_SENSORS, 
  INVENTORY_CAMPAIGNS, 
  STOCK_MOVEMENTS_LOG 
} from '../../data/wmsData';

import FicheMouvementStockPdfModal from './FicheMouvementStockPdfModal';
import PvInventairePdfModal from './PvInventairePdfModal';
import NewStockMovementModal from './NewStockMovementModal';
import NewInventoryCampaignModal from './NewInventoryCampaignModal';

export default function WmsManager() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'locations' | 'batches' | 'coldchain' | 'inventory'
  
  // Data State
  const [zones, setZones] = useState(STORAGE_ZONES);
  const [locations, setLocations] = useState(WAREHOUSE_LOCATIONS);
  const [batches, setBatches] = useState(BATCH_RECORDS);
  const [movements, setMovements] = useState(STOCK_MOVEMENTS_LOG);
  const [campaigns, setCampaigns] = useState(INVENTORY_CAMPAIGNS);
  const [sensors, setSensors] = useState(IOT_COLD_CHAIN_SENSORS);

  // Filters
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL');
  const [batchSearchQuery, setBatchSearchQuery] = useState('');
  const [fefoFilter, setFefoFilter] = useState('ALL');
  const [selectedLocationDetail, setSelectedLocationDetail] = useState(null);

  // Modals
  const [selectedMovementForPdf, setSelectedMovementForPdf] = useState(null);
  const [selectedCampaignForPdf, setSelectedCampaignForPdf] = useState(null);
  const [isNewMovementModalOpen, setIsNewMovementModalOpen] = useState(false);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleSaveMovement = (newMvt) => {
    setMovements([newMvt, ...movements]);
    showToast(`Mouvement ${newMvt.id} validé avec succès (${newMvt.quantite.toLocaleString('fr-FR')} ${newMvt.unite})`);
  };

  const handleSaveCampaign = (newCamp) => {
    setCampaigns([newCamp, ...campaigns]);
    showToast(`Campagne d'inventaire ${newCamp.id} initialisée pour ${newCamp.zoneNom}`);
  };

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchSearch = 
        batch.dci.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
        batch.id.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
        batch.fabricant.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
        batch.emplacementActuel.toLowerCase().includes(batchSearchQuery.toLowerCase());

      const matchZone = selectedZoneFilter === 'ALL' || batch.zoneId === selectedZoneFilter;
      const matchFefo = fefoFilter === 'ALL' || batch.statutFefo === fefoFilter;

      return matchSearch && matchZone && matchFefo;
    });
  }, [batches, batchSearchQuery, selectedZoneFilter, fefoFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1.5">
                  <Warehouse className="w-3.5 h-3.5" />
                  Hub National d'Owendo • WMS Central
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full">
                  BPDP & Normes OMS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <Boxes className="w-8 h-8 text-emerald-400" />
                Gestion des Entrepôts & Hub Central WMS (Owendo)
              </h1>
              <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
                Pilotage des 5 zones de stockage (4 500 palettes), traçabilité stricte FEFO par lot, cartographie des racks, surveillance IoT de la chaîne du froid (2°C–8°C) et inventaires tournants réglementaires.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNewCampaignModalOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/20 shadow-sm backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <ClipboardCheck className="w-4 h-4 text-teal-300" />
                Lancer Inventaire Tournant
              </button>
              <button
                onClick={() => setIsNewMovementModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Nouveau Mouvement de Stock
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-b border-white/10">
            {[
              { id: 'overview', label: 'Aperçu & Occupation Hub', icon: TrendingUp, count: null },
              { id: 'locations', label: 'Cartographie des Racks', icon: MapPin, count: locations.length },
              { id: 'batches', label: 'Lots & Règle FEFO', icon: Boxes, count: batches.length },
              { id: 'coldchain', label: 'Chaîne du Froid (IoT)', icon: Snowflake, count: 'Live' },
              { id: 'inventory', label: 'Inventaires Tournants', icon: ClipboardCheck, count: campaigns.length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-white/10 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ========================================================================= */}
        {/* TAB 1: APERÇU & OCCUPATION DU HUB                                        */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Palettes Occupées */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taux d'Occupation Hub</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Boxes className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {WMS_KPIS.tauxOccupationGlobal}% <span className="text-xs font-normal text-slate-500">({WMS_KPIS.palettesOccupees}/{WMS_KPIS.capaciteTotalePalettes} pal.)</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>5 zones actives</span>
                  <span className="text-emerald-700 font-semibold">1 080 pal. dispo</span>
                </div>
              </div>

              {/* Card 2: Valeur Stock */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valeur Stock Owendo</span>
                  <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                    <Warehouse className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-teal-700 font-mono">
                  {(WMS_KPIS.valeurStockConsolideeXaf / 1000000000).toFixed(2)} <span className="text-sm font-normal text-slate-500">Mrd FCFA</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{WMS_KPIS.nombreReferencesActives} références actives</span>
                  <span className="font-semibold text-teal-700">Audit conforme</span>
                </div>
              </div>

              {/* Card 3: Alertes FEFO */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lots FEFO Prioritaires</span>
                  <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-700 font-mono">
                  {WMS_KPIS.lotsSousFefoCritique90j} <span className="text-sm font-normal text-slate-500">lots (&lt; 90j)</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>À dispatcher d'urgence</span>
                  <span className="text-rose-700 font-semibold">Priorité 1</span>
                </div>
              </div>

              {/* Card 4: Chaîne du Froid */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chaîne du Froid IoT</span>
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                    <Snowflake className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-700 font-mono">
                  +{WMS_KPIS.temperatureMoyenneChambreFroide1}°C <span className="text-sm font-normal text-slate-500">/ -21.4°C</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    4 Sondes conformes
                  </span>
                  <span>Secours actif</span>
                </div>
              </div>
            </div>

            {/* Storage Zones Detail Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  État d'Occupation des 5 Zones Thermiques du Hub
                </h3>
                <span className="text-xs text-slate-500">Capacité globale : 4 500 palettes standards CEMAC</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {zones.map(zone => {
                  const isNearCapacity = zone.tauxOccupation > 80;
                  return (
                    <div key={zone.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${zone.badgeBg}`}>
                            {zone.temperatureConsigne}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-500">{zone.nombreAllees} allée(s)</span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mb-1">{zone.nom}</h4>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">{zone.description}</p>

                        {/* Progress bar */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Occupation :</span>
                            <span className="font-mono font-bold text-slate-900">
                              {zone.palettesOccupees} / {zone.capacitePalettes} pal. ({zone.tauxOccupation}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                zone.tauxOccupation > 85 ? 'bg-amber-500' :
                                zone.couleur === 'blue' ? 'bg-blue-500' :
                                zone.couleur === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${zone.tauxOccupation}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 flex justify-between pt-0.5">
                            <span>Allées: {zone.codeAllees.join(', ')}</span>
                            <span>Humidité max: {zone.humiditeMax}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="truncate max-w-[200px]">{zone.responsable}</span>
                        <button
                          onClick={() => {
                            setSelectedZoneFilter(zone.id);
                            setActiveTab('locations');
                          }}
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 ml-auto"
                        >
                          Racks <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Movements & Cold Chain Mini Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Movements timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-bold text-slate-900 text-sm">Derniers Mouvements de Stock WMS</h3>
                  </div>
                  <button
                    onClick={() => setIsNewMovementModalOpen(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    + Enregistrer
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {movements.map(mvt => (
                    <div key={mvt.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${mvt.typeColor}`}>
                            {mvt.typeLabel}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">{mvt.id}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate max-w-[280px]">{mvt.dci}</p>
                        <p className="text-[11px] text-slate-500">
                          {mvt.emplacementSource} ➔ <strong className="text-emerald-800">{mvt.emplacementDestination}</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 block">
                          {mvt.quantite.toLocaleString('fr-FR')} {mvt.unite}
                        </span>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <button
                            onClick={() => setSelectedMovementForPdf(mvt)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold flex items-center gap-1"
                            title="Imprimer Bon de Mouvement"
                          >
                            <Printer className="w-3 h-3 text-emerald-700" />
                            Bon de Mouvement
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IoT Live probes widget */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                      <h4 className="font-bold text-sm text-white">Sondes IoT — Chaîne du Froid 24h/7j</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                      Protocole OMS
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sensors.slice(0, 3).map(s => (
                      <div key={s.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">{s.emplacement}</span>
                          <span className="text-[10px] text-slate-400">{s.typeSonde} • Batt: {s.batteriePct}%</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-base font-black text-emerald-400 block">
                            {s.tempActuelle > 0 ? `+${s.tempActuelle}°C` : `${s.tempActuelle}°C`}
                          </span>
                          <span className="text-[10px] text-emerald-200">Consigne: {s.tempMinConsigne}°C à {s.tempMaxConsigne}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Groupe électrogène de secours : Prêt
                  </span>
                  <button
                    onClick={() => setActiveTab('coldchain')}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Détail sondes ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CARTOGRAPHIE DES RACKS & EMPLACEMENTS                             */}
        {/* ========================================================================= */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Zone Selector Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Visualisation des Emplacements & Racks Hub Owendo</h3>
                <p className="text-xs text-slate-500">Cliquez sur un rack pour consulter le contenu exact de la palette et son statut FEFO</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Filtrer par Zone :</span>
                {['ALL', 'ZONE_A', 'ZONE_B', 'ZONE_C', 'ZONE_D', 'ZONE_E'].map(zId => (
                  <button
                    key={zId}
                    onClick={() => setSelectedZoneFilter(zId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedZoneFilter === zId
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {zId === 'ALL' ? 'Toutes les Zones' : zId.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Racks Grid 2D Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {locations
                .filter(loc => selectedZoneFilter === 'ALL' || loc.zoneId === selectedZoneFilter)
                .map(loc => {
                  const isFefoCritical = loc.statutFefo === 'FEFO_PRIORITAIRE';
                  const isQuarantine = loc.statutQualite === 'BLOQUE_QUARANTAINE';

                  return (
                    <div
                      key={loc.id}
                      onClick={() => setSelectedLocationDetail(loc)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                        isQuarantine
                          ? 'bg-amber-50/50 border-amber-300 hover:border-amber-400'
                          : isFefoCritical
                          ? 'bg-red-50/40 border-red-300 hover:border-red-400'
                          : 'bg-white border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {loc.id}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                          isQuarantine ? 'bg-amber-100 text-amber-800' :
                          isFefoCritical ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isQuarantine ? 'Quarantaine' : isFefoCritical ? 'FEFO < 90j' : 'Conforme'}
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">{loc.niveau} • Max {loc.capaciteKg}kg</span>
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{loc.dci}</h4>
                        <div className="text-[11px] text-slate-600 flex justify-between pt-1">
                          <span>N° Lot : <strong className="font-mono text-slate-900">{loc.lotNumero}</strong></span>
                          <span>Péremption : <strong>{loc.datePeremption}</strong></span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Volume stocké :</span>
                        <span className="font-mono font-bold text-emerald-800">
                          {loc.quantiteCartons} cartons ({loc.quantiteUnites.toLocaleString('fr-FR')} un.)
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Location Detail Modal / Drawer */}
            {selectedLocationDetail && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-bold text-slate-900 text-base">Rack {selectedLocationDetail.id}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedLocationDetail(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Médicament Stocké :</span>
                      <strong className="text-slate-900 text-sm block mt-0.5">{selectedLocationDetail.dci}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">Code DCI : {selectedLocationDetail.codeDci}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">N° Lot Fabricant :</span>
                        <strong className="font-mono text-slate-900">{selectedLocationDetail.lotNumero}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">Date Péremption :</span>
                        <strong className="text-amber-700">{selectedLocationDetail.datePeremption}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-emerald-900">
                      <span>Quantité en Palette :</span>
                      <span className="font-mono font-black text-sm">{selectedLocationDetail.quantiteUnites.toLocaleString('fr-FR')} unités</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedLocationDetail(null)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GESTION DES LOTS & RÈGLE FEFO                                     */}
        {/* ========================================================================= */}
        {activeTab === 'batches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={batchSearchQuery}
                    onChange={(e) => setBatchSearchQuery(e.target.value)}
                    placeholder="Rechercher par DCI, N° Lot, Fabricant, Emplacement..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <select
                    value={selectedZoneFilter}
                    onChange={(e) => setSelectedZoneFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Toutes les zones de stockage</option>
                    <option value="ZONE_A">Zone A — Produits Secs</option>
                    <option value="ZONE_B">Zone B — Chaîne du Froid</option>
                    <option value="ZONE_C">Zone C — Solutés Massifs</option>
                    <option value="ZONE_D">Zone D — Stupéfiants</option>
                    <option value="ZONE_E">Zone E — Quarantaine LNCM</option>
                  </select>
                </div>

                <div>
                  <select
                    value={fefoFilter}
                    onChange={(e) => setFefoFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Tous les statuts FEFO</option>
                    <option value="CRITIQUE">Critique (&lt; 90 jours)</option>
                    <option value="NORMAL">Standard (&gt; 6 mois)</option>
                    <option value="QUARANTAINE">En Quarantaine LNCM</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <span>Affichage de <strong>{filteredBatches.length}</strong> lots pharmaceutiques enregistrés</span>
                <span className="font-semibold text-emerald-800">Règle FEFO active (First Expired, First Out)</span>
              </div>
            </div>

            {/* Batches Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">N° Lot & DCI</th>
                      <th className="py-3.5 px-4">Laboratoire Fabricant</th>
                      <th className="py-3.5 px-4">Emplacement WMS</th>
                      <th className="py-3.5 px-4 text-center">Régime Température</th>
                      <th className="py-3.5 px-4 text-right">Quantité Stock</th>
                      <th className="py-3.5 px-4">Date Péremption</th>
                      <th className="py-3.5 px-4 text-center">Statut FEFO</th>
                      <th className="py-3.5 px-4 text-center">Conformité LNCM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBatches.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{b.id}</span>
                          <span className="font-semibold text-slate-800 text-[11px] block">{b.dci}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-900 block">{b.fabricant}</span>
                          <span className="text-[10.5px] text-slate-500">{b.paysOrigine}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                          {b.emplacementActuel}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {b.temperatureStockage}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {b.quantiteStock.toLocaleString('fr-FR')} {b.uniteMesure}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{b.datePeremption}</span>
                          <span className={`text-[10px] font-semibold ${b.joursRestants < 90 ? 'text-rose-700' : 'text-slate-500'}`}>
                            {b.joursRestants} jours restants
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${b.statutFefoColor}`}>
                            {b.statutFefoLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${b.statutQualiteColor}`}>
                            {b.statutQualiteLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CHAÎNE DU FROID & CAPTEURS IOT                                    */}
        {/* ========================================================================= */}
        {activeTab === 'coldchain' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 rounded-2xl border border-blue-700 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-bold">Surveillance Thermique Temps Réel (IoT LoRaWAN & Cryosondes)</h3>
                  </div>
                  <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
                    Télésurveillance continue des enceintes frigorifiques du Hub d'Owendo. Système couplé aux alarmes SMS/Email et au basculement automatique sur groupe électrogène en cas de coupure SEEG.
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs text-right">
                  <span className="text-blue-300 block font-semibold">Générateur de Secours :</span>
                  <strong className="text-emerald-400 font-bold">100% OPÉRATIONNEL (Autonomie 72h)</strong>
                </div>
              </div>
            </div>

            {/* Probes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sensors.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-500 block">{s.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{s.emplacement}</h4>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${s.statutColor}`}>
                      {s.statut}
                    </span>
                  </div>

                  {/* Big Temp Gauge */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-500 block">Température Instantanée :</span>
                      <span className="text-3xl font-black font-mono text-slate-900">
                        {s.tempActuelle > 0 ? `+${s.tempActuelle}°C` : `${s.tempActuelle}°C`}
                      </span>
                    </div>
                    <div className="text-right text-xs text-slate-600 space-y-0.5">
                      <div>Consigne Min : <strong className="font-mono">{s.tempMinConsigne}°C</strong></div>
                      <div>Consigne Max : <strong className="font-mono">+{s.tempMaxConsigne}°C</strong></div>
                      <div>Hygrométrie : <strong className="font-mono">{s.humiditeActuelle}% HR</strong></div>
                    </div>
                  </div>

                  {/* 24h mini chart */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Relevés Horaires 24 Heures
                    </span>
                    <div className="grid grid-cols-8 gap-1.5 text-center">
                      {s.historique24h.map((h, idx) => (
                        <div key={idx} className="p-2 bg-slate-100 rounded-lg border border-slate-200/60">
                          <span className="text-[10px] text-slate-500 block">{h.heure}</span>
                          <span className="font-mono text-xs font-bold text-slate-900 block">
                            {h.temp > 0 ? `+${h.temp}` : h.temp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Transmission : {s.derniereTransmission}</span>
                    <span>Batterie Sonde : <strong>{s.batteriePct}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: INVENTAIRES TOURNANTS & ÉCARTS                                    */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Campagnes d'Inventaires Tournants & Régularisations</h3>
                <p className="text-xs text-slate-500">Comptage physique des racks, rapprochement avec le stock théorique WMS et édition des Procès-Verbaux officiels</p>
              </div>
              <button
                onClick={() => setIsNewCampaignModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 self-start md:self-auto transition-all"
              >
                <Plus className="w-4 h-4" />
                Nouvel Inventaire
              </button>
            </div>

            {/* Inventory Campaigns List */}
            <div className="space-y-4">
              {campaigns.map(camp => (
                <div key={camp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {camp.numeroPv}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${camp.statutColor}`}>
                          {camp.statutLabel}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{camp.titre}</h4>
                      <p className="text-xs text-slate-500">Zone : <strong>{camp.zoneNom}</strong> • Période : {camp.dateDebut} au {camp.dateCloture}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedCampaignForPdf(camp)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Procès-Verbal d'Inventaire
                      </button>
                    </div>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Théorique WMS</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{camp.stockTheoriqueTotal.toLocaleString('fr-FR')} un.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Physique Compté</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{camp.stockPhysiqueCompte.toLocaleString('fr-FR')} un.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Écart Quantité</span>
                      <span className={`font-mono font-bold text-sm ${camp.ecartQuantite < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {camp.ecartQuantite.toLocaleString('fr-FR')} un.
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Impact Valeur</span>
                      <span className={`font-mono font-black text-sm ${camp.valeurEcartXaf < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {camp.valeurEcartXaf.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <strong className="text-slate-800">Commission Tripartite :</strong> {camp.responsableInventaire} • {camp.superviseurPharma} • {camp.auditeurDaf}
                    </div>
                    <span className="font-bold text-emerald-800 font-mono">Conformité : {camp.tauxConformiteStock}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODALS INTEGRATION                                                        */}
      {/* ========================================================================= */}

      {/* 1. Fiche de Mouvement de Stock A4 PDF Modal */}
      <FicheMouvementStockPdfModal
        isOpen={!!selectedMovementForPdf}
        movement={selectedMovementForPdf}
        onClose={() => setSelectedMovementForPdf(null)}
      />

      {/* 2. PV d'Inventaire Tournant PDF Modal */}
      <PvInventairePdfModal
        isOpen={!!selectedCampaignForPdf}
        campaign={selectedCampaignForPdf}
        onClose={() => setSelectedCampaignForPdf(null)}
      />

      {/* 3. New Stock Movement Modal */}
      <NewStockMovementModal
        isOpen={isNewMovementModalOpen}
        onClose={() => setIsNewMovementModalOpen(false)}
        onSaveMovement={handleSaveMovement}
      />

      {/* 4. New Inventory Campaign Modal */}
      <NewInventoryCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSaveCampaign={handleSaveCampaign}
      />
    </div>
  );
}
