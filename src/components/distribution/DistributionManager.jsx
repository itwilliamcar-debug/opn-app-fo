import React, { useState } from 'react';
import {
  Compass,
  Truck,
  MapPin,
  ShieldCheck,
  Package,
  Plus,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Navigation,
  Fuel,
  Wrench,
  Thermometer,
  Boxes,
  FileText,
  Activity,
  Anchor,
  Droplets,
  Smartphone,
  Wifi,
  WifiOff,
  Check,
  RotateCcw,
  Send,
  Radio,
  Gauge
} from 'lucide-react';

import {
  DISTRIBUTION_KPIS,
  PROVINCES_AXES,
  FLOTTE_MULTIMODALE,
  KITS_SANITAIRES_CATALOGUE,
  TOURNEES_EN_COURS,
  INCIDENTS_PISTE_LOGS,
  DISPENSAIRES_REPERTOIRE
} from '../../data/distributionData';

import OrdreMissionDistributionPdfModal from './OrdreMissionDistributionPdfModal';
import BordereauDechargeDispensairePdfModal from './BordereauDechargeDispensairePdfModal';
import FeuilleRouteConvoiPdfModal from './FeuilleRouteConvoiPdfModal';
import NewTourneeModal from './NewTourneeModal';
import NewIncidentPisteModal from './NewIncidentPisteModal';

export default function DistributionManager({ activePersona, sanctumReady, onNavigateModule }) {
  const [activeTab, setActiveTab] = useState('apercu'); // apercu | tournees | telesuivi | driver_pwa | flotte | kits
  
  // State data
  const [tournees, setTournees] = useState(TOURNEES_EN_COURS);
  const [incidents, setIncidents] = useState(INCIDENTS_PISTE_LOGS);
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');
  const [selectedVecteurFilter, setSelectedVecteurFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedTourneeForPdf, setSelectedTourneeForPdf] = useState(null);
  const [selectedTourneeForFeuilleRoute, setSelectedTourneeForFeuilleRoute] = useState(null);
  const [selectedEtapeForPdf, setSelectedEtapeForPdf] = useState(null);
  const [isTourneeModalOpen, setIsTourneeModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Driver Offline PWA Simulation State
  const [isDriverOffline, setIsDriverOffline] = useState(false);
  const [offlineLogCount, setOfflineLogCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [telemetryTemp, setTelemetryTemp] = useState(4.6);
  const [telemetryPisteState, setTelemetryPisteState] = useState('Piste Latérite (Dégradée)');
  const [driverCheckins, setDriverCheckins] = useState([
    { id: 1, step: 'PK 0 - Owendo Magasin Central', time: '06:00', temp: '+4.2°C', status: 'VALIDÉ', road: 'Asphalte (Excellent)' },
    { id: 2, step: 'PK 185 - Bifoun Carrefour Escorte', time: '09:15', temp: '+4.5°C', status: 'VALIDÉ', road: 'Asphalte (Bon)' },
    { id: 3, step: 'PK 240 - Lambaréné CHR G3', time: '11:00', temp: '+4.1°C', status: 'VALIDÉ', road: 'Asphalte (Bon)' }
  ]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDriverWaypointCheckin = (stepName) => {
    const newEntry = {
      id: Date.now(),
      step: stepName,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      temp: `+${telemetryTemp.toFixed(1)}°C`,
      status: isDriverOffline ? 'STOCKÉ_LOCAL_HORS_LIGNE' : 'TRANSMIS_SERVEUR_LIVE',
      road: telemetryPisteState,
      syncedAt: isDriverOffline ? null : new Date().toISOString(),
    };
    setDriverCheckins((prev) => [...prev, newEntry]);
    if (isDriverOffline) {
      setOfflineLogCount((prev) => prev + 1);
      showToast(`Étape "${stepName}" enregistrée en cache local (hors-ligne)`);
    } else {
      try {
        const key = 'opn_driver_checkins_live';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift(newEntry);
        localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
      } catch { /* ignore */ }
      showToast(`Étape "${stepName}" journalisée (COD local + tampon navigateur)`);
    }
  };

  const handleSyncOfflineData = () => {
    const pending =
      driverCheckins.filter((d) => d.status === 'STOCKÉ_LOCAL_HORS_LIGNE').length || offlineLogCount;
    const syncedAt = new Date().toISOString();
    setDriverCheckins((prev) =>
      prev.map((d) =>
        d.status === 'STOCKÉ_LOCAL_HORS_LIGNE'
          ? { ...d, status: 'TRANSMIS_SERVEUR_LIVE', syncedAt }
          : d
      )
    );
    setOfflineLogCount(0);
    setIsDriverOffline(false);
    setLastSyncAt(syncedAt);
    try {
      const key = 'opn_driver_checkins_synced';
      const pendingRows = driverCheckins.filter((d) => d.status === 'STOCKÉ_LOCAL_HORS_LIGNE');
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([...pendingRows, ...list].slice(0, 100)));
    } catch { /* ignore */ }
    showToast(
      pending > 0
        ? `Sync locale terminée : ${pending} relevé(s) marqués transmis (journal navigateur).`
        : 'Aucun relevé hors-ligne en attente — journal à jour.'
    );
  };

  // Handlers
  const handleOpenOrdreMissionPdf = (trn) => {
    setSelectedTourneeForPdf(trn);
  };

  const handleOpenDechargePdf = (trn, etp) => {
    setSelectedTourneeForPdf(trn);
    setSelectedEtapeForPdf(etp);
  };

  const handleTourneeCreated = (newTrn) => {
    setTournees([newTrn, ...tournees]);
    setSelectedTourneeForPdf(newTrn);
  };

  const handleIncidentLogged = (newInc) => {
    setIncidents([newInc, ...incidents]);
  };

  // Filtered Tournées
  const filteredTournees = tournees.filter((t) => {
    const matchProvince = selectedProvinceFilter === 'ALL' || t.provinceId === selectedProvinceFilter;
    const matchVecteur = selectedVecteurFilter === 'ALL' || t.typeVecteur === selectedVecteurFilter;
    const matchSearch =
      t.intitule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.equipage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.provinceNom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProvince && matchVecteur && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Institutionnel OPN Dernier Kilomètre */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Logistique territoriale
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#2E68B4] border border-blue-200">
                  9 Provinces • 162 Postes de Soins Primaires
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Distribution Régionale du Dernier Kilomètre & Flotte OPN (Gabon Profond)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilotage des convois tout-terrain 4x4, pirogues fluviales motorisées et caissons froids 72h vers les dispensaires ruraux.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setSelectedTourneeForFeuilleRoute(tournees[0])}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Consulter et imprimer la Feuille de Route Officielle de Convoi (A4)"
            >
              <Truck className="w-4 h-4 text-amber-200" />
              <span>Feuille de Route Convoi (A4)</span>
            </button>

            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Signaler Incident Piste</span>
            </button>

            <button
              onClick={() => setIsTourneeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#009E49] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Planifier Nouvelle Tournée</span>
            </button>
          </div>
        </div>

        {/* 6 Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'apercu', label: 'Aperçu & Couverture Territoriale', icon: Layers, badge: `${DISTRIBUTION_KPIS.tauxCouvertureTerritoriale}%` },
            { id: 'tournees', label: 'Planificateur de Tournées', icon: Compass, count: tournees.length },
            { id: 'driver_pwa', label: 'Mode Chauffeur PWA (Hors-Ligne)', icon: Smartphone, badge: isDriverOffline ? 'HORS-LIGNE' : 'GPS ACTIF' },
            { id: 'telesuivi', label: 'Télésuivi & Événements de Piste', icon: Activity, badge: `${DISTRIBUTION_KPIS.incidentsPisteEnCours} Aléas` },
            { id: 'flotte', label: 'Flotte Multimodale & Froid', icon: Truck, count: FLOTTE_MULTIMODALE.length },
            { id: 'kits', label: 'Kits Sanitaires & Dotations', icon: Package, count: KITS_SANITAIRES_CATALOGUE.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ONGLET 1 : APERÇU & COUVERTURE TERRITORIALE */}
      {/* ========================================================================= */}
      {activeTab === 'apercu' && (
        <div className="space-y-6">
          
          {/* 4 KPIs Clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Taux de Couverture Rurale</span>
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{DISTRIBUTION_KPIS.tauxCouvertureTerritoriale}%</span>
                <span className="text-[11px] font-bold text-emerald-700">148/162 Postes</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${DISTRIBUTION_KPIS.tauxCouvertureTerritoriale}%` }} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Tournées Actives & Convois</span>
                <span className="p-2 bg-blue-100 text-[#2E68B4] rounded-lg">
                  <Compass className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{DISTRIBUTION_KPIS.tourneesActives}</span>
                <span className="text-[11px] text-slate-500">En déplacement live</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {DISTRIBUTION_KPIS.glacieresActivesEnRoute} Glacières sous chaîne du froid
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Distances & Navigation Mois</span>
                <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                  <Anchor className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{DISTRIBUTION_KPIS.kmPisteParcourusMois.toLocaleString()} km</span>
                <span className="text-[11px] font-bold text-teal-700">+ {DISTRIBUTION_KPIS.milesNautiquesParcourusMois} MN</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Pistes latérite, cours d'eau & lagunes
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Kits d'Urgence Livrés</span>
                <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{DISTRIBUTION_KPIS.kitsDistribuesMois}</span>
                <span className="text-[11px] font-bold text-amber-800">Soins d'Urgence</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Accouchement, Palu, Vaccins, SRO
              </p>
            </div>

          </div>

          {/* Grille des 9 Provinces & Taux de Couverture */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Taux de Desserte des 9 Provinces du Gabon (Réseau Soins Primaires)
                </h3>
                <p className="text-xs text-slate-500">
                  Suivi de la régularité d'approvisionnement des dispensaires et centres médicaux de chaque province.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Objectif National : ≥ 90%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROVINCES_AXES.map((prov) => (
                <div key={prov.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-black text-[10px] flex items-center justify-center font-mono">
                        {prov.id}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{prov.nom}</h4>
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      prov.tauxCouverture >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prov.tauxCouverture}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2">
                    {prov.nbDispensaires} Dispensaires ruraux • Chef-lieu : {prov.chefLieu}
                  </p>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-2">
                    <div
                      className={`h-1.5 rounded-full ${prov.tauxCouverture >= 90 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                      style={{ width: `${prov.tauxCouverture}%` }}
                    />
                  </div>

                  <div className="space-y-1 text-[10px] text-slate-600 border-t border-slate-200/80 pt-2">
                    {prov.axesPrincipaux.map((axe) => (
                      <div key={axe.id} className="flex items-center justify-between">
                        <span className="truncate pr-2">{axe.nom}</span>
                        <span className="font-mono text-slate-400 shrink-0">{axe.distanceKm} km/MN</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bandeau Alertes Pistes & Météo Live */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 rounded-r-xl p-4 bg-white border border-slate-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase">
                  Alertes Pistes & Conditions d'Accès Dernier Kilomètre ({incidents.length} Signalements)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {incidents.slice(0, 2).map((inc) => (
                    <div key={inc.id} className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-900">{inc.province} • {inc.typeIncident.replace('_', ' ')}</span>
                        <span className="text-[10px] font-mono text-slate-500">{inc.dateHeure}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug">{inc.description}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-1">Impact Froid : {inc.impactChaineFroid}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 2 : PLANIFICATEUR DE TOURNÉES */}
      {/* ========================================================================= */}
      {activeTab === 'tournees' && (
        <div className="space-y-4">
          
          {/* Barre de Recherche et Filtres */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex-1 w-full sm:w-auto relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une tournée, un axe, un chauffeur, une province..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <select
                value={selectedProvinceFilter}
                onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">Toutes les Provinces (9)</option>
                {PROVINCES_AXES.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} — {p.nom}</option>
                ))}
              </select>

              <select
                value={selectedVecteurFilter}
                onChange={(e) => setSelectedVecteurFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">Tous Vecteurs</option>
                <option value="TERRESTRE_4X4">Piste 4x4 Terrestre</option>
                <option value="FLUVIAL_PIROGUE">Pirogue Fluviale</option>
                <option value="MARITIME_CHALOUPE">Chaloupe Maritime/Lagune</option>
              </select>

              <button
                onClick={() => setIsTourneeModalOpen(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvelle Tournée</span>
              </button>
            </div>
          </div>

          {/* Liste des Tournées */}
          <div className="space-y-3">
            {filteredTournees.map((trn) => (
              <div key={trn.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Info principale */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {trn.reference || trn.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        trn.statut === 'EN_ROUTE' ? 'bg-emerald-100 text-emerald-800' :
                        trn.statut === 'PROGRAMME' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {trn.statut === 'EN_ROUTE' ? 'En déplacement' : 'Programmée'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        Province {trn.provinceNom}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {trn.typeVecteur === 'FLUVIAL_PIROGUE' ? 'Pirogue Fluviale' : trn.typeVecteur === 'MARITIME_CHALOUPE' ? 'Chaloupe Lagune' : 'Convoi 4x4'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {trn.intitule}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Moyen & Équipage</span>
                        <span className="font-semibold text-slate-800">{trn.vehiculeAssigne}</span>
                        <p className="text-[11px] text-slate-500">{trn.equipage}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Planning Départ / Retour</span>
                        <span className="font-semibold text-slate-800">{trn.dateDepart}</span>
                        <p className="text-[11px] text-slate-500">Retour prévu : {trn.dateRetourPrevue}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Cargaison & Valeur</span>
                        <span className="font-semibold text-slate-800">{trn.poidsTotalKg} kg • {trn.valeurMarchandiseXaf.toLocaleString()} FCFA</span>
                        <p className="text-[11px] text-emerald-700 font-bold">
                          {trn.etapes ? trn.etapes.filter(e => e.dechargeSignee).length : 0} / {trn.etapes ? trn.etapes.filter(e => e.type === 'LIVRAISON').length : 0} Décharges émargées
                        </p>
                      </div>
                    </div>

                    {/* Progression Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                        <span>Progression du circuit</span>
                        <span>{trn.progressionPourcent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${trn.progressionPourcent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Bouton PDF */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-4">
                    <button
                      onClick={() => handleOpenOrdreMissionPdf(trn)}
                      className="w-full lg:w-48 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Ordre de Mission A4</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('telesuivi');
                      }}
                      className="w-full lg:w-48 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Voir Jalons & Décharges</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 3 : TÉLÉSUIVI & ÉVÉNEMENTS DE PISTE */}
      {/* ========================================================================= */}
      {activeTab === 'telesuivi' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne Gauche : Étapes en Direct d'une Tournée */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                      Jalons de Livraison & Décharges par Étape
                    </h3>
                    <p className="text-xs text-slate-500">
                      Émargement physique et édition du bordereau de réception pour chaque dispensaire.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                    Tournée Active : TRN-2026-089 (Moyen-Ogooué)
                  </span>
                </div>

                {/* Timeline des étapes */}
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {tournees[0]?.etapes?.map((etp, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                        etp.statut === 'EFFECTUE' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                        etp.statut === 'EN_APPROCHE' ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' :
                        'bg-slate-300 text-slate-700'
                      }`}>
                        {etp.ordre}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <h4 className="font-bold text-xs text-slate-900">{etp.structure}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            etp.statut === 'EFFECTUE' ? 'bg-emerald-100 text-emerald-800' :
                            etp.statut === 'EN_APPROCHE' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {etp.statut === 'EFFECTUE' ? 'Livré / Émargé' : etp.statut === 'EN_APPROCHE' ? 'En Approche' : 'Programmé'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Prévu : {etp.heurePrevue} {etp.heureReelle && `• Réalisé : ${etp.heureReelle}`}
                        </p>

                        {etp.recepteur && (
                          <p className="text-[11px] font-semibold text-slate-700 mt-1">
                            Réceptionnaire : {etp.recepteur}
                          </p>
                        )}

                        {etp.kits && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {etp.kits.map((k, kIdx) => (
                              <span key={kIdx} className="text-[10px] font-semibold bg-white border border-slate-300 text-[#2E68B4] px-2 py-0.5 rounded">
                                {k}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Décharge PDF */}
                        {etp.type === 'LIVRAISON' && (
                          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                            <button
                              onClick={() => handleOpenDechargePdf(tournees[0], etp)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Bordereau de Décharge</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Colonne Droite : Journal des Incidents & Obstacles */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Journal des Incidents de Piste</span>
                  </h3>
                  <button
                    onClick={() => setIsIncidentModalOpen(true)}
                    className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded transition-colors"
                  >
                    + Déclarer
                  </button>
                </div>

                <div className="space-y-3">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950">{inc.axe}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          inc.gravite === 'MOYENNE' ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {inc.gravite}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug">{inc.description}</p>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200/60 flex justify-between">
                        <span>Action : {inc.actionCorrective}</span>
                        <span className="font-mono">{inc.dateHeure}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 4 : FLOTTE OPN & ÉQUIPEMENTS FROID */}
      {/* ========================================================================= */}
      {activeTab === 'flotte' && (
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Flotte multimodale OPN (4x4, Pirogues & Chaloupes)
              </h3>
              <p className="text-xs text-slate-500">
                Véhicules renforcés, moteurs hors-bord marinisés et caissons isothermes passifs certifiés OMS.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              6 Vecteurs Actifs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLOTTE_MULTIMODALE.map((veh) => (
              <div key={veh.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                      {veh.immatriculation}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${veh.badgeColor}`}>
                      {veh.statut === 'EN_ROUTE' ? 'En Mission' : veh.statut === 'DISPONIBLE' ? 'Disponible Quai' : 'Maintenance'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    {veh.designation}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{veh.antenneRattachement}</p>

                  <div className="space-y-1.5 mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacité Charge / Volume :</span>
                      <span className="font-bold text-slate-800">{veh.capaciteChargeKg} kg • {veh.capaciteVolumeM3} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chauffeur / Piroguier :</span>
                      <span className="font-semibold text-slate-900">{veh.chauffeurAssigne}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Compteur Actuel :</span>
                      <span className="font-mono font-bold text-slate-800">{veh.compteurKm.toLocaleString()} km/MN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Niveau Carburant :</span>
                      <span className="font-mono font-bold text-emerald-700">{veh.carburantNiveau}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-emerald-50 rounded border border-emerald-200 text-[10.5px]">
                    <span className="font-bold text-emerald-950 block">Équipement Froid Embarqué :</span>
                    <span className="text-emerald-800 font-medium">{veh.equipementsFroid}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Dernière révision : {veh.dernierEntretien}</span>
                  <span>Prochaine vidange : {veh.prochaineVidangeKm.toLocaleString()} km</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 5 : KITS SANITAIRES & DOTATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'kits' && (
        <div className="space-y-6">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Catalogue des Kits Sanitaires Standardisés OPN (Soins Primaires & Urgence)
              </h3>
              <p className="text-xs text-slate-500">
                Packs thérapeutiques prêts à l'emploi scellés et calibrés pour les besoins des dispensaires isolés.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              5 Kits Homologués
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {KITS_SANITAIRES_CATALOGUE.map((kit) => (
              <div key={kit.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                      {kit.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {kit.valeurXaf.toLocaleString()} FCFA
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{kit.libelle}</h4>
                  <p className="text-xs text-slate-500 mt-1">{kit.destination}</p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                    <span>Poids : <b>{kit.poidsKg} kg</b></span>
                    <span>Volume : <b>{kit.volumeM3} m³</b></span>
                    <span className="text-emerald-700 font-bold">Froid : {kit.temperatureStockage}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Composition Thérapeutique du Kit :
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {kit.contenu.map((item, iIdx) => (
                        <li key={iIdx} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                          <span className="truncate pr-2">{item.dci}</span>
                          <span className="font-bold text-slate-900 shrink-0 font-mono text-[11px]">
                            {item.quantite} {item.uom}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Répertoire Sommaire des Dispensaires */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-3">
              Répertoire Échantillon des Dispensaires Ruraux & Fréquence de Ravitaillement
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5">Structure Sanitaire</th>
                    <th className="p-2.5">Province</th>
                    <th className="p-2.5">Mode d'Accès</th>
                    <th className="p-2.5">Population</th>
                    <th className="p-2.5">Responsable</th>
                    <th className="p-2.5">Dotation Mensuelle</th>
                    <th className="p-2.5">Dernier Ravitaillement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DISPENSAIRES_REPERTOIRE.map((dsp) => (
                    <tr key={dsp.id} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-bold text-slate-900">{dsp.nom}</td>
                      <td className="p-2.5 text-slate-700">{dsp.province}</td>
                      <td className="p-2.5 text-slate-600 font-medium">{dsp.acces}</td>
                      <td className="p-2.5 font-mono">{dsp.populationDesservie.toLocaleString()} hab.</td>
                      <td className="p-2.5 text-slate-800">{dsp.responsable}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700">{dsp.dotationMensuelleXaf.toLocaleString()} FCFA</td>
                      <td className="p-2.5 text-slate-600">{dsp.dernierRavitaillement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET : MODE CHAUFFEUR PWA & CONVOI HORS-LIGNE                          */}
      {/* ========================================================================= */}
      {activeTab === 'driver_pwa' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Chauffeur PWA */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-2xl border border-amber-600/40 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold">Poste de Conduite & Télésuivi Chauffeur PWA</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                    isDriverOffline 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  }`}>
                    {isDriverOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                    {isDriverOffline ? 'Mode Hors-Ligne (Piste Forestière)' : 'Réseau 4G / Satellite Connecté'}
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 max-w-3xl leading-relaxed">
                  Interface mobile embarquée tout-terrain : permet aux chauffeurs de convois d'émarger aux étapes (Waypoints), d'enregistrer la température de la chambre froide et de qualifier la météo des pistes même sans réseau mobile. Synchronisation automatique au retour de la connexion.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setIsDriverOffline(!isDriverOffline);
                    showToast(isDriverOffline ? 'Réseau rétabli : Reconnexion au serveur OPN.' : 'Simulation Hors-Ligne activée (Zone blanche).');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDriverOffline
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isDriverOffline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                  <span>{isDriverOffline ? 'Rétablir Réseau' : 'Simuler Hors-Ligne'}</span>
                </button>

                <button
                  onClick={() => setSelectedTourneeForFeuilleRoute(tournees[0])}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-200" />
                  Feuille de Route
                </button>
              </div>
            </div>
          </div>

          {/* Sync status alert if offline logs exist */}
          {offlineLogCount > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600 text-white rounded-xl">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    {offlineLogCount} relevé(s) en mémoire tampon locale (IndexDB PWA)
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Les données sont sécurisées sur le terminal. Cliquez pour forcer la transmission vers le COD Central.
                    {lastSyncAt
                      ? ` Dernière sync : ${new Date(lastSyncAt).toLocaleTimeString('fr-FR')}.`
                      : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSyncOfflineData}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                Synchroniser ({offlineLogCount})
              </button>
            </div>
          )}

          {/* Grid: Driver Dashboard & Action Center */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Vehicle & Current Checkpoint Controls */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Télémétrie Véhicule & Convoi</h4>
                </div>
                <span className="font-mono text-xs font-bold text-slate-800">GA-8821-OPN (Isuzu 12T)</span>
              </div>

              {/* Gauge sensors */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Chambre Froid</span>
                  <div className="flex items-center justify-center gap-1 mt-1 text-emerald-700 font-mono font-black text-lg">
                    <Thermometer className="w-4 h-4" />
                    +{telemetryTemp.toFixed(1)}°C
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">Conforme (+2/+8)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Autonomie Gasoil</span>
                  <div className="flex items-center justify-center gap-1 mt-1 text-slate-900 font-mono font-black text-lg">
                    <Fuel className="w-4 h-4 text-amber-600" />
                    340 L
                  </div>
                  <span className="text-[10px] text-slate-500">~ 620 km</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Escorte Sécurité</span>
                  <div className="flex items-center justify-center gap-1 mt-1 text-blue-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Active
                  </div>
                  <span className="text-[10px] text-blue-700">Brigade Bifoun</span>
                </div>
              </div>

              {/* Road Condition selector */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Relevé Météo & Praticabilité de la Piste Actuelle :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Asphalte (Bon)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                    { label: 'Piste Dégradée', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                    { label: 'Bourbiers / Coupée', color: 'bg-red-50 text-red-800 border-red-300' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTelemetryPisteState(p.label)}
                      className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        telemetryPisteState === p.label ? `${p.color} ring-2 ring-emerald-500 font-black` : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waypoints Checkin Buttons */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Valider le Prochain Point Kilométrique (Émargement GPS) :
                </label>
                <div className="space-y-2">
                  {[
                    'PK 380 - Antenne Provinciale Mouila (G4)',
                    'PK 520 - Dispensaire Rural de Ndendé',
                    'PK 610 - Antenne Régionale Tchibanga (G5)'
                  ].map((wpt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDriverWaypointCheckin(wpt)}
                      className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-900">{wpt}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg">
                        Émarger
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Live Checkin Logs */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Journal de Bord des Pointages Embarqués</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{driverCheckins.length} relevés</span>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {driverCheckins.map((chk) => (
                    <div key={chk.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{chk.step}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>Heure : <strong>{chk.time}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-emerald-700 font-bold">Froid : {chk.temp}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 italic block">{chk.road}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        chk.status === 'TRANSMIS_SERVEUR_LIVE' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {chk.status === 'TRANSMIS_SERVEUR_LIVE' ? 'LIVE' : 'CACHE PWA'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Protocole ANINF Gabon • Mode Sync PWA Service Worker Actif</span>
                <span className="font-bold text-emerald-700">Prêt pour audit logistique</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALES PDF ET CRÉATION */}
      {/* ========================================================================= */}
      
      {/* Ordre de Mission A4 Modal */}
      <OrdreMissionDistributionPdfModal
        isOpen={Boolean(selectedTourneeForPdf) && !selectedEtapeForPdf}
        onClose={() => setSelectedTourneeForPdf(null)}
        tournee={selectedTourneeForPdf}
      />

      {/* Bordereau Décharge Dispensaire A4 Modal */}
      <BordereauDechargeDispensairePdfModal
        isOpen={Boolean(selectedTourneeForPdf) && Boolean(selectedEtapeForPdf)}
        onClose={() => {
          setSelectedTourneeForPdf(null);
          setSelectedEtapeForPdf(null);
        }}
        tournee={selectedTourneeForPdf}
        etape={selectedEtapeForPdf}
      />

      {/* Feuille de Route Convoi Modal */}
      <FeuilleRouteConvoiPdfModal
        isOpen={Boolean(selectedTourneeForFeuilleRoute)}
        onClose={() => setSelectedTourneeForFeuilleRoute(null)}
        tournee={selectedTourneeForFeuilleRoute}
      />

      {/* New Tournée Modal */}
      <NewTourneeModal
        isOpen={isTourneeModalOpen}
        onClose={() => setIsTourneeModalOpen(false)}
        onTourneeCreated={handleTourneeCreated}
      />

      {/* New Incident Modal */}
      <NewIncidentPisteModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onIncidentLogged={handleIncidentLogged}
        tournees={tournees}
      />

    </div>
  );
}
