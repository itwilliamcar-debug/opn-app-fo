import React, { useState } from 'react';
import { 
  Wrench, 
  Snowflake, 
  Zap, 
  Sun, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  Plus, 
  Search, 
  Building2, 
  MapPin, 
  Clock, 
  Coins, 
  Cpu, 
  Layers, 
  Radio, 
  Eye, 
  FileText,
  SlidersHorizontal,
  Flame,
  Gauge
} from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { 
  GMAO_MACRO_KPIS, 
  GMAO_EQUIPMENT_TYPES, 
  TECHNICAL_EQUIPMENTS_CATALOG, 
  MAINTENANCE_WORK_ORDERS, 
  THERMAL_QUALIFICATIONS_RECORDS 
} from '../../data/gmaoMaintenanceData';
import { formatXAF } from '../../utils/formatters';
import RapportQualificationFroidPdfModal from './RapportQualificationFroidPdfModal';
import BonInterventionGmaoPdfModal from './BonInterventionGmaoPdfModal';
import NewMaintenanceTicketModal from './NewMaintenanceTicketModal';

export default function GmaoMaintenanceManager({
  activePersona,
  sanctumReady,
  onNavigateModule
}) {
  const [activeTab, setActiveTab] = useState('parc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  // États des OT & Qualifications
  const [workOrdersList, setWorkOrdersList] = useState(MAINTENANCE_WORK_ORDERS);
  const [qualificationsList, setQualificationsList] = useState(THERMAL_QUALIFICATIONS_RECORDS);

  // Modales
  const [selectedWorkOrderForPdf, setSelectedWorkOrderForPdf] = useState(null);
  const [selectedQualifForPdf, setSelectedQualifForPdf] = useState(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // Filtrage du parc
  const filteredEquipments = TECHNICAL_EQUIPMENTS_CATALOG.filter((eq) => {
    const matchSearch = eq.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.marque.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProv = selectedProvince === 'ALL' || eq.province === selectedProvince;
    const matchType = selectedTypeFilter === 'ALL' || eq.type === selectedTypeFilter;
    return matchSearch && matchProv && matchType;
  });

  const handleAddNewWorkOrder = (newOT) => {
    setWorkOrdersList(prev => [newOT, ...prev]);
    setSelectedWorkOrderForPdf(newOT);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Officiel & Bannière GMAO */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Liseré Gabon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#009e60]" />
          <div className="flex-1 bg-[#fcd116]" />
          <div className="flex-1 bg-[#3a75c4]" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> Direction de la Maintenance & GMAO Centrale
              </span>
              <span className="text-xs text-slate-400 font-mono">Chaîne du Froid 2°C-8°C / -80°C</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Maintenance, GMAO & Sécurité des Infrastructures Froid et Énergies
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Supervision en temps réel des 18 chambres froides, 14 groupes électrogènes et 9 centrales solaires assurant la conservation vitale des médicaments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Déclarer une Intervention GMAO</span>
            </button>
            <button
              onClick={() => setSelectedQualifForPdf(qualificationsList[0])}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Snowflake className="w-4 h-4 text-blue-400" />
              <span>Rapport Qualification Froid</span>
            </button>
          </div>
        </div>

        {/* 4 KPIs Clés GMAO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Snowflake className="w-3.5 h-3.5 text-blue-400" /> Disponibilité Froid
            </div>
            <div className="text-xl font-black text-white font-mono">{GMAO_MACRO_KPIS.tauxDisponibiliteFroidGlobalPct}%</div>
            <div className="text-[10px] text-blue-300 font-medium">18 Chambres Froides 100% Conformes</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Sécurité Énergétique
            </div>
            <div className="text-xl font-black text-white font-mono">{GMAO_MACRO_KPIS.groupesElectrogenesSecours + GMAO_MACRO_KPIS.centralesSolairesHybrides}</div>
            <div className="text-[10px] text-amber-300 font-medium">Groupes (14) & Solaires (9)</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" /> Respect Préventif
            </div>
            <div className="text-xl font-black text-white font-mono">{GMAO_MACRO_KPIS.tauxExecutionPreventifPct}%</div>
            <div className="text-[10px] text-emerald-400 font-medium">MTTR Moyen : {GMAO_MACRO_KPIS.tempsMoyenReparationHeuresMTTR}h</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Métrologie & Étalonnage
            </div>
            <div className="text-xl font-black text-white font-mono">100%</div>
            <div className="text-[10px] text-purple-300 font-medium">Sondes PT100 Certifiées BPD</div>
          </div>
        </div>
      </div>

      {/* 2. Barre de Navigation des 4 Onglets */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-sm p-1.5 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('parc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'parc'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>1. Parc des Équipements Froid & Énergies ({filteredEquipments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('iot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'iot'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>2. Télémesure IoT & Supervision Live</span>
        </button>

        <button
          onClick={() => setActiveTab('ot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'ot'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>3. Ordres de Travail (OT) & Carnet d'Entretien ({workOrdersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('metrologie')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'metrologie'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          <span>4. Qualifications Métrologiques & Étalonnage ({qualificationsList.length})</span>
        </button>
      </div>

      {/* 3. Contenu de l'Onglet Actif */}

      {/* TAB 1 : PARC DES ÉQUIPEMENTS FROID & ÉNERGIES */}
      {activeTab === 'parc' && (
        <div className="space-y-5">
          {/* Filtres Multi-critères */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par Tag (CFP-OW-01), désignation, marque, site (ex: Dagard, Cummins, Franceville)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-56"
                >
                  <option value="ALL">Toutes les 9 Provinces</option>
                  {GABON_PROVINCES.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.capital})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtres par type d'équipement */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedTypeFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous les Équipements ({TECHNICAL_EQUIPMENTS_CATALOG.length})
              </button>
              {GMAO_EQUIPMENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTypeFilter(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedTypeFilter === t.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des Équipements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipments.map((eq) => (
              <div key={eq.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        {eq.type.includes('FROIDE') ? <Snowflake className="w-5 h-5" /> : eq.type.includes('SOLAIRE') ? <Sun className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {eq.tag}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{eq.province}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${eq.statutColor}`}>
                      {eq.statutLive}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight mb-2">{eq.nom}</h4>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p><span className="text-slate-400">Modèle :</span> <strong className="text-slate-800">{eq.marque} — {eq.modele}</strong></p>
                    <p><span className="text-slate-400">Site :</span> <span className="text-slate-700">{eq.site}</span></p>
                    <p><span className="text-slate-400">Fluide / Énergie :</span> <span className="text-slate-700">{eq.fluide}</span></p>
                    <p><span className="text-slate-400">Source Actuelle :</span> <span className="text-emerald-700 font-semibold">{eq.sourceEnergie}</span></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Température Live</span>
                    <span className="font-mono font-black text-blue-700 text-sm">{eq.tempLive}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Étalonnage</span>
                    <span className="text-[11px] font-bold text-emerald-700">Valide {eq.prochainEtalonnage.split('/')[2]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2 : TÉLÉMESURE IOT & SUPERVISION LIVE */}
      {activeTab === 'iot' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600 animate-pulse" /> Télémétrie en Direct des Enceintes Thermiques (IoT OPN)
            </h3>
            <p className="text-xs text-slate-500">
              Relevé continu des sondes calibrées PT100 avec monitoring de l'hygrométrie et de l'alimentation électrique secourue.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {TECHNICAL_EQUIPMENTS_CATALOG.filter(e => e.type.includes('FROIDE')).map((cf) => (
                <div key={cf.id} className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 space-y-4">
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                        {cf.tag}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">{cf.nom}</h4>
                      <p className="text-[10px] text-slate-500">{cf.site}</p>
                    </div>

                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                      <Activity className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Jauge de Température */}
                  <div className="p-4 bg-white rounded-xl border border-blue-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      Température Instantanée
                    </span>
                    <div className="text-3xl font-black text-blue-800 font-mono">
                      {cf.tempLive}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                      Consigne Nominale : {cf.consigneTemp}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Hygrométrie Live</span>
                      <strong className="text-slate-800 font-mono">{cf.hygrometrieLive}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Alimentation</span>
                      <strong className="text-emerald-700">{cf.sourceEnergie.split(' ')[0]}</strong>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3 : ORDRES DE TRAVAIL & CARNET D'ENTRETIEN */}
      {activeTab === 'ot' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" /> File Active des Ordres de Travail (OT) & Interventions GMAO
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Historique des maintenances préventives programmées, dépannages curatifs et remplacements de pièces détachées.
              </p>
            </div>

            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un Ordre de Travail</span>
            </button>
          </div>

          {/* Liste des OT */}
          <div className="space-y-4">
            {workOrdersList.map((ot) => (
              <div key={ot.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-amber-300 transition-all">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-900 text-white">
                      {ot.id}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {ot.typeOTLabel}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Priorité : {ot.priorite}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">{ot.dateCreation}</span>
                    <button
                      onClick={() => setSelectedWorkOrderForPdf(ot)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Bon d'Intervention</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Équipement & Localisation :</span>
                    <p className="font-bold text-slate-900">{ot.equipementNom}</p>
                    <p className="text-slate-500">{ot.province} ({ot.site})</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Technicien & Validation :</span>
                    <p className="font-bold text-slate-900">{ot.technicienAssigne}</p>
                    <p className="text-emerald-700 font-semibold">{ot.visaChefSite}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Arrêt Machine & Coût :</span>
                    <p className="font-mono font-bold text-slate-900">{ot.tempsArretMinutes} min d'arrêt</p>
                    <p className="text-emerald-700 font-bold font-mono">{formatXAF(ot.coutTotalXAF)}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-100 space-y-1">
                  <p><strong className="text-slate-800 not-italic">Travaux : </strong> « {ot.description} »</p>
                  <p className="text-slate-600 not-italic"><strong className="text-slate-800">Pièces Remplacées : </strong> {ot.piecesChangees}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4 : QUALIFICATIONS MÉTROLOGIQUES & ÉTALONNAGE */}
      {activeTab === 'metrologie' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-blue-600" /> Registre National des Cartographies Thermiques & Étalonnages BPD
            </h3>
            <p className="text-xs text-slate-500">
              Certificats de qualification métrologique garantissant la stricte homogénéité des températures (+2°C à +8°C).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {qualificationsList.map((qualif) => (
                <div key={qualif.id} className="p-5 rounded-2xl border border-blue-200 bg-white shadow-sm space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                          {qualif.equipementTag}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{qualif.equipementNom}</h4>
                        <p className="text-xs text-slate-500">{qualif.site} ({qualif.province})</p>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {qualif.resultatLabel.split(' (')[0]}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center my-3">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Min</span>
                        <span className="font-mono font-bold text-blue-700 text-xs">{qualif.tempMinimaEnregistree}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Moyenne</span>
                        <span className="font-mono font-black text-emerald-700 text-xs">{qualif.tempMoyenneMesuree}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Max</span>
                        <span className="font-mono font-bold text-amber-700 text-xs">{qualif.tempMaximaEnregistree}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      « {qualif.recommandations} »
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Audit : {qualif.dateQualification}</span>
                    <button
                      onClick={() => setSelectedQualifForPdf(qualif)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Rapport Officiel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODALES A4 & DÉCLARATION */}
      <RapportQualificationFroidPdfModal
        isOpen={Boolean(selectedQualifForPdf)}
        onClose={() => setSelectedQualifForPdf(null)}
        qualification={selectedQualifForPdf}
      />

      <BonInterventionGmaoPdfModal
        isOpen={Boolean(selectedWorkOrderForPdf)}
        onClose={() => setSelectedWorkOrderForPdf(null)}
        workOrder={selectedWorkOrderForPdf}
      />

      <NewMaintenanceTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSubmitTicket={handleAddNewWorkOrder}
      />

    </div>
  );
}
