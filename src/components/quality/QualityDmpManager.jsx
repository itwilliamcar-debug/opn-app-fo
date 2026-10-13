import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  FileSpreadsheet,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  Building,
  Thermometer,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Check,
  RefreshCw,
  FlaskConical,
  TestTube2,
  Microscope,
  Dna,
  Percent,
  CheckCheck
} from 'lucide-react';
import {
  QUALITY_KPIS,
  QUALITY_INSPECTIONS,
  PHARMACOVIGILANCE_REPORTS,
  DMP_AMM_REGISTRY,
  BPD_AUDITS
} from '../../data/qualityDmpData';
import { formatNumber, formatXAF } from '../../utils/formatters';
import CertificatLiberationLotPdfModal from './CertificatLiberationLotPdfModal';
import FichePharmacovigilancePdfModal from './FichePharmacovigilancePdfModal';
import NewQualityInspectionModal from './NewQualityInspectionModal';
import NewPharmacovigilanceModal from './NewPharmacovigilanceModal';
import NewAmmDmpModal from './NewAmmDmpModal';

export default function QualityDmpManager({ activePersona, sanctumReady, onNavigateModule }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, inspections, analytics, pharmacovigilance, amm, bpd
  
  // Data States
  const [inspections, setInspections] = useState(QUALITY_INSPECTIONS);
  const [pvReports, setPvReports] = useState(PHARMACOVIGILANCE_REPORTS);
  const [ammList, setAmmList] = useState(DMP_AMM_REGISTRY);
  const [bpdAudits, setBpdAudits] = useState(BPD_AUDITS);

  // Selected Lot for Analytical LNCM testing
  const [selectedLotForAnalytics, setSelectedLotForAnalytics] = useState(QUALITY_INSPECTIONS[0] || null);
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Search & Filter States
  const [inspectionSearch, setInspectionSearch] = useState('');
  const [inspectionFilter, setInspectionFilter] = useState('ALL');
  
  const [pvSearch, setPvSearch] = useState('');
  const [pvFilter, setPvFilter] = useState('ALL');

  const [ammSearch, setAmmSearch] = useState('');
  const [ammFilter, setAmmFilter] = useState('ALL');

  // Modal States
  const [selectedInspectionForPdf, setSelectedInspectionForPdf] = useState(null);
  const [selectedPvForPdf, setSelectedPvForPdf] = useState(null);
  const [newInspectionModalOpen, setNewInspectionModalOpen] = useState(false);
  const [newPvModalOpen, setNewPvModalOpen] = useState(false);
  const [newAmmModalOpen, setNewAmmModalOpen] = useState(false);

  // Handlers
  const handleSaveNewInspection = (newIns) => {
    setInspections([newIns, ...inspections]);
  };

  const handleSaveNewPv = (newPv) => {
    setPvReports([newPv, ...pvReports]);
  };

  const handleSaveNewAmm = (newAmm) => {
    setAmmList([newAmm, ...ammList]);
  };

  const handleUpdateInspectionStatus = (id, newStatut) => {
    setInspections(inspections.map(ins => {
      if (ins.id === id) {
        return {
          ...ins,
          statut: newStatut,
          observations: newStatut === 'LIBERE_CONFORME'
            ? 'Lot validé conforme suite à contre-expertise analytique.'
            : newStatut === 'QUARANTAINE_INVESTIGATION'
            ? 'Mis en quarantaine par le Pharmacien Chef National.'
            : 'Lot rejeté non conforme par décision DMP / LNCM.'
        };
      }
      return ins;
    }));
  };

  // Filtered Inspections
  const filteredInspections = inspections.filter(ins => {
    const matchesSearch = 
      ins.produitNom.toLowerCase().includes(inspectionSearch.toLowerCase()) ||
      ins.numeroLot.toLowerCase().includes(inspectionSearch.toLowerCase()) ||
      ins.numeroCertificat.toLowerCase().includes(inspectionSearch.toLowerCase()) ||
      ins.laboratoire.toLowerCase().includes(inspectionSearch.toLowerCase());
    
    if (inspectionFilter === 'ALL') return matchesSearch;
    return matchesSearch && ins.statut === inspectionFilter;
  });

  // Filtered Pharmacovigilance
  const filteredPvReports = pvReports.filter(report => {
    const matchesSearch = 
      report.produitSuspect.toLowerCase().includes(pvSearch.toLowerCase()) ||
      report.numeroLot.toLowerCase().includes(pvSearch.toLowerCase()) ||
      report.structureNotificatrice.toLowerCase().includes(pvSearch.toLowerCase()) ||
      report.id.toLowerCase().includes(pvSearch.toLowerCase());
    
    if (pvFilter === 'ALL') return matchesSearch;
    if (pvFilter === 'RAPPEL') return matchesSearch && report.rappelDeLotDeclenche;
    return matchesSearch && report.gravite === pvFilter;
  });

  // Filtered AMM
  const filteredAmm = ammList.filter(amm => {
    const matchesSearch = 
      amm.dci.toLowerCase().includes(ammSearch.toLowerCase()) ||
      amm.nomCommercial.toLowerCase().includes(ammSearch.toLowerCase()) ||
      amm.numeroAmm.toLowerCase().includes(ammSearch.toLowerCase()) ||
      amm.laboratoireTitulaire.toLowerCase().includes(ammSearch.toLowerCase());
    
    if (ammFilter === 'ALL') return matchesSearch;
    return matchesSearch && amm.statut === ammFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Direction du Médicament et de la Pharmacie (DMP) & LNCM
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Qualité et conformité sanitaire
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Contrôle Qualité, Pharmacovigilance & Homologation DMP
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Libération officielle des lots à réception, traçabilité analytique LNCM, gestion des alertes de pharmacovigilance et registre national des AMM du Ministère de la Santé.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setNewInspectionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-teal-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Contrôle LNCM</span>
            </button>

            <button
              onClick={() => setNewPvModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-rose-600/25 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Déclarer une Alerte PV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-sm p-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Aperçu & Vigilance Qualité</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'inspections'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Contrôles LNCM & Libération Lots</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 text-teal-800 font-black">
            {inspections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Registre Analytique LNCM (HPLC & Dissolution)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
            Laboratoire National
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pharmacovigilance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pharmacovigilance'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pharmacovigilance & Alertes</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-black">
            {pvReports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('amm')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'amm'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Homologations & Registre AMM (DMP)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
            {ammList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bpd')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'bpd'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Audits BPD & Chaîne du Froid</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 text-teal-800 font-black">
            {bpdAudits.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux de Conformité LNCM</p>
                <h3 className="text-2xl font-black text-slate-900">{QUALITY_KPIS.tauxConformiteGlobal}%</h3>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {QUALITY_KPIS.lotsLiberesConformes} lots libérés sur {QUALITY_KPIS.lotsControlesTotal}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lots en Quarantaine</p>
                <h3 className="text-2xl font-black text-amber-700">{QUALITY_KPIS.lotsEnQuarantaine}</h3>
                <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  Investigations physico-chimiques
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pharmacovigilance & Rappels</p>
                <h3 className="text-2xl font-black text-rose-700">{QUALITY_KPIS.alertesPharmacovigilanceActives}</h3>
                <p className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  {QUALITY_KPIS.rappelsDeLotEnCours} rappel national actif
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AMM Gabon Actives</p>
                <h3 className="text-2xl font-black text-emerald-700">{QUALITY_KPIS.ammValidesTotal}</h3>
                <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  {QUALITY_KPIS.ammEnRenouvellement} en cours de renouvellement
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileCheck2 className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Active Alert Banner if any */}
          <div className="bg-gradient-to-r from-rose-900 to-rose-950 rounded-2xl p-5 text-white shadow-lg border border-rose-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-600/40 border border-rose-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-700 text-white border border-rose-600">
                  ALERTE SANITAIRE NATIONALE DMP — NIVEAU 1
                </span>
                <h4 className="font-bold text-sm mt-1">Rappel de Lot Urgent : Paracétamol Sirop 500mg/5ml (Lot PTI-PCM-2026-119)</h4>
                <p className="text-xs text-rose-200">
                  Suspension totale de dispensation sur l'ensemble du territoire gabonais (9 antennes & officines). Teneur anormale en diéthylène glycol identifiée par le LNCM.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('pharmacovigilance')}
              className="px-4 py-2 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs shrink-0 shadow-md transition-colors"
            >
              Consulter la Fiche d'Alerte
            </button>
          </div>

          {/* Grid: Dernières Inspections & Répartition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 2 Cols: Derniers Contrôles Qualité LNCM */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">Dernières Inspections & Libérations de Lots</h3>
                </div>
                <button
                  onClick={() => setActiveTab('inspections')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Voir tous les contrôles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {inspections.slice(0, 4).map((ins) => (
                  <div key={ins.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{ins.produitNom}</h4>
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Lot: {ins.numeroLot}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {ins.laboratoire} • {formatNumber(ins.quantiteLot)} unités • Contrôlé le {ins.dateControle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ins.statut === 'LIBERE_CONFORME'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ins.statut === 'QUARANTAINE_INVESTIGATION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ins.statut === 'LIBERE_CONFORME' ? 'Libéré Conforme' : ins.statut === 'QUARANTAINE_INVESTIGATION' ? 'En Quarantaine' : 'Rejeté'}
                      </span>

                      <button
                        onClick={() => setSelectedInspectionForPdf(ins)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                        title="Voir le Certificat LNCM"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1 Col: Audits BPD & Chaîne du Froid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">Conformité BPD & Froid</h3>
                </div>
                <button
                  onClick={() => setActiveTab('bpd')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Détails</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {bpdAudits.map((audit) => (
                  <div key={audit.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{audit.siteNom}</h5>
                        <span className="text-[10px] text-slate-500">Audité le {audit.dateAudit}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800">
                        {audit.scoreConformitePourcent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${audit.scoreConformitePourcent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INSPECTIONS & LIBERATION DE LOTS */}
      {activeTab === 'inspections' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Filters & Actions Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par médicament, lot, certificat, labo..."
                  value={inspectionSearch}
                  onChange={(e) => setInspectionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={inspectionFilter}
                onChange={(e) => setInspectionFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="LIBERE_CONFORME">Libérés Conformes</option>
                <option value="QUARANTAINE_INVESTIGATION">En Quarantaine</option>
                <option value="REJETE_NON_CONFORME">Rejetés / Non conformes</option>
              </select>
            </div>

            <button
              onClick={() => setNewInspectionModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Contrôle LNCM</span>
            </button>
          </div>

          {/* Inspections Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10.5px]">
                    <th className="py-3 px-4">Réf & Certificat</th>
                    <th className="py-3 px-4">Médicament DCI</th>
                    <th className="py-3 px-4">Lot & Fabricant</th>
                    <th className="py-3 px-4">Dosage LNCM</th>
                    <th className="py-3 px-4">Température</th>
                    <th className="py-3 px-4">Statut Décision</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInspections.map((ins) => (
                    <tr key={ins.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-teal-800">{ins.id}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{ins.numeroCertificat}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{ins.produitNom}</div>
                        <div className="text-[10.5px] text-slate-500">{ins.forme} • {ins.dosage}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800">{ins.numeroLot}</div>
                        <div className="text-[10.5px] text-slate-500 truncate">{ins.laboratoire}</div>
                        <div className="text-[9.5px] text-rose-700 font-medium">Pér : {ins.datePeremption}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{ins.dosagePrincipeActif}</div>
                        <div className="text-[10px] text-slate-500">Dissol : {ins.essaiDissolution}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10.5px] font-medium ${ins.temperatureTransport.includes('Dépassement') ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
                          {ins.temperatureTransport}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block ${
                          ins.statut === 'LIBERE_CONFORME'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ins.statut === 'QUARANTAINE_INVESTIGATION'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ins.statut.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ins.statut === 'QUARANTAINE_INVESTIGATION' && (
                            <button
                              onClick={() => handleUpdateInspectionStatus(ins.id, 'LIBERE_CONFORME')}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 transition-colors"
                              title="Libérer ce lot suite aux analyses complémentaires"
                            >
                              Libérer
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedInspectionForPdf(ins)}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1 transition-colors"
                            title="Voir et Imprimer le Certificat Officiel LNCM"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Certificat Officiel</span>
                          </button>
                        </div>
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
      {/* TAB : REGISTRE ANALYTIQUE LNCM (HPLC, DISSOLUTION & STÉRILITÉ)            */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-teal-700/50 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-teal-400" />
                  <h3 className="text-lg font-bold">Laboratoire National de Contrôle du Médicament (LNCM) — Paillasse Analytique</h3>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full">
                    Normes OMS / Pharmacopée Européenne
                  </span>
                </div>
                <p className="text-xs text-teal-200/80 max-w-3xl leading-relaxed">
                  Supervision physico-chimique et microbiologique des lots importés : dosage du principe actif par HPLC, cinétique de dissolution in vitro, recherche d'endotoxines bactériennes LAL et validation des critères de libération sanitaire pour la distribution nationale.
                </p>
              </div>

              {selectedLotForAnalytics && (
                <button
                  onClick={() => setSelectedInspectionForPdf(selectedLotForAnalytics)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                >
                  <Printer className="w-4 h-4 text-teal-200" />
                  Certificat d'Analyse
                </button>
              )}
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 bg-emerald-900 text-white text-xs font-bold rounded-xl border border-emerald-500 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Lot Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Lot sous analyse :</span>
              <select
                value={selectedLotForAnalytics?.id || ''}
                onChange={(e) => {
                  const found = inspections.find(i => i.id === e.target.value);
                  if (found) setSelectedLotForAnalytics(found);
                }}
                className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                {inspections.map(ins => (
                  <option key={ins.id} value={ins.id}>
                    {ins.produitNom} — Lot {ins.numeroLot} ({ins.statut})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                selectedLotForAnalytics?.statut === 'LIBERE_CONFORME'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : selectedLotForAnalytics?.statut === 'QUARANTAINE_INVESTIGATION'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}>
                Statut : {selectedLotForAnalytics?.statut}
              </span>
            </div>
          </div>

          {/* 4 Analytical Assay Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: HPLC Assay */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Dosage HPLC (Principe Actif)</span>
                <FlaskConical className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {selectedLotForAnalytics?.dosagePrincipeActif || '99.8% (Conforme)'}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '99.8%' }} />
              </div>
              <span className="text-[10px] text-slate-500 block">Spécification : 95.0% – 105.0%</span>
            </div>

            {/* Card 2: Dissolution Rate */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Cinétique de Dissolution</span>
                <TestTube2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-blue-900 font-mono">
                {selectedLotForAnalytics?.essaiDissolution || 'Q = 88% à 30 min'}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
              <span className="text-[10px] text-slate-500 block">Norme USP : Q ≥ 80% à 30 min</span>
            </div>

            {/* Card 3: Endotoxines / Stérilité */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Stérilité & Endotoxines LAL</span>
                <Microscope className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-emerald-800">
                &lt; 0.05 EU/ml (Négatif)
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stérilité validée à J+14</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Limite admissible : 0.25 EU/ml</span>
            </div>

            {/* Card 4: Uniformité & pH */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Uniformité de Masse & pH</span>
                <Dna className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                Écart : ± 1.2% • pH 6.8
              </div>
              <span className="text-[11px] text-slate-600">Aspect visuel limpide et sans particule</span>
              <span className="text-[10px] text-slate-500 block">Tolérance : ± 5.0% • pH 6.5–7.5</span>
            </div>

          </div>

          {/* Analytical Laboratory Details Panel & Action Workbench */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Rapport Analytique LNCM — {selectedLotForAnalytics?.produitNom} (Lot : {selectedLotForAnalytics?.numeroLot})
                </h4>
                <p className="text-xs text-slate-500">
                  Fabricant : {selectedLotForAnalytics?.laboratoire} • Certificat N° {selectedLotForAnalytics?.numeroCertificat}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedLotForAnalytics) return;
                    setIsTestingInProgress(true);
                    setTimeout(() => {
                      const dosage = `${(98.5 + Math.random() * 1.4).toFixed(1)}% (Conforme)`;
                      const dissolution = `Q = ${Math.round(85 + Math.random() * 8)}% à 30 min`;
                      const updated = {
                        ...selectedLotForAnalytics,
                        dosagePrincipeActif: dosage,
                        essaiDissolution: dissolution,
                        observations: `Contre-expertise LNCM du ${new Date().toLocaleString('fr-FR')} : dosage ${dosage}, dissolution ${dissolution}. Lot conforme aux monographies Ph. Eur. / OMS.`,
                        derniereAnalyseAt: new Date().toISOString(),
                      };
                      setSelectedLotForAnalytics(updated);
                      setInspections((prev) =>
                        prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i))
                      );
                      setIsTestingInProgress(false);
                      showToast(
                        `Contre-expertise analytique terminée pour le lot ${updated.numeroLot} : conforme.`
                      );
                    }, 900);
                  }}
                  disabled={isTestingInProgress}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingInProgress ? 'animate-spin' : ''}`} />
                  <span>{isTestingInProgress ? 'Analyse en cours...' : 'Relancer Analyse'}</span>
                </button>

                {selectedLotForAnalytics?.statut !== 'LIBERE_CONFORME' ? (
                  <button
                    onClick={() => {
                      if (selectedLotForAnalytics) {
                        handleUpdateInspectionStatus(selectedLotForAnalytics.id, 'LIBERE_CONFORME');
                        setSelectedLotForAnalytics({ ...selectedLotForAnalytics, statut: 'LIBERE_CONFORME' });
                        showToast(`Lot ${selectedLotForAnalytics.numeroLot} libéré conforme avec visa du Pharmacien Chef !`);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Signer et Libérer le Lot</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (selectedLotForAnalytics) {
                        handleUpdateInspectionStatus(selectedLotForAnalytics.id, 'QUARANTAINE_INVESTIGATION');
                        setSelectedLotForAnalytics({ ...selectedLotForAnalytics, statut: 'QUARANTAINE_INVESTIGATION' });
                        showToast(`Lot ${selectedLotForAnalytics.numeroLot} placé en quarantaine pour investigation.`);
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Placer en Quarantaine</span>
                  </button>
                )}
              </div>
            </div>

            {/* Technical Observations & Pharmacopoeia Reference */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Méthode de Dosage</span>
                <p className="font-semibold text-slate-800">Chromatographie Liquide Haute Performance (HPLC-UV / DAD)</p>
                <p className="text-[11px] text-slate-500">Colonne C18 (250 x 4.6 mm, 5µm), Débit 1.0 ml/min, Détection 254 nm.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Conservation & Froid</span>
                <p className="font-semibold text-emerald-800">{selectedLotForAnalytics?.temperatureTransport || '+2°C à +8°C'}</p>
                <p className="text-[11px] text-slate-500">Enregistreurs de température USB conformes aux Bonnes Pratiques de Distribution.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Décision DMP / LNCM</span>
                <p className="font-bold text-slate-900">{selectedLotForAnalytics?.observations || 'Lot validé conforme pour approvisionnement national.'}</p>
                <p className="text-[11px] text-slate-500">Signataire : Pharmacien Responsable LNCM Gabon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHARMACOVIGILANCE */}
      {activeTab === 'pharmacovigilance' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Header Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par médicament, lot, hôpital..."
                  value={pvSearch}
                  onChange={(e) => setPvSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <select
                value={pvFilter}
                onChange={(e) => setPvFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">Toutes les gravités</option>
                <option value="CRITIQUE_VITAL">Critique vital</option>
                <option value="GRAVE_HOSPITALISATION">Grave / Hospitalisation</option>
                <option value="MODERE">Modéré</option>
                <option value="MINEUR">Mineur</option>
                <option value="RAPPEL">Rappels de lot actifs</option>
              </select>
            </div>

            <button
              onClick={() => setNewPvModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Déclarer un Effet Indésirable</span>
            </button>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPvReports.map((report) => (
              <div
                key={report.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3.5 transition-all hover:shadow-md ${
                  report.rappelDeLotDeclenche ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-rose-800">{report.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        report.gravite === 'CRITIQUE_VITAL'
                          ? 'bg-rose-600 text-white'
                          : report.gravite === 'GRAVE_HOSPITALISATION'
                          ? 'bg-orange-600 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {report.gravite.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{report.produitSuspect}</h4>
                    <p className="text-[11px] text-slate-500">
                      Lot : <strong className="font-mono text-rose-700">{report.numeroLot}</strong> • {report.laboratoire}
                    </p>
                  </div>

                  {report.rappelDeLotDeclenche && (
                    <span className="px-2.5 py-1 rounded-md text-[9.5px] font-black uppercase tracking-wider bg-rose-700 text-white flex items-center gap-1 shadow-sm shrink-0">
                      <AlertOctagon className="w-3 h-3" />
                      RAPPEL ACTIF
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Structure Notificatrice :</span>
                    <strong className="text-slate-900 text-right">{report.structureNotificatrice}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Patient :</span>
                    <strong className="text-slate-800">{report.patientAge} • {report.patientSexe}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Imputabilité OMS :</span>
                    <strong className="text-teal-800">{report.imputabiliteOms}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-serif line-clamp-2 italic">
                  « {report.descriptionReaction} »
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500">Notifié le {report.dateNotification}</span>
                  <button
                    onClick={() => setSelectedPvForPdf(report)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Fiche Officielle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: HOMOLOGATIONS AMM DMP */}
      {activeTab === 'amm' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Search & Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par DCI, marque, n° AMM, laboratoire..."
                  value={ammSearch}
                  onChange={(e) => setAmmSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={ammFilter}
                onChange={(e) => setAmmFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="VALIDE">Valides</option>
                <option value="EN_INSTRUCTION">En instruction</option>
                <option value="EN_RENOUVELLEMENT">En renouvellement</option>
                <option value="SUSPENDU">Suspendus</option>
              </select>
            </div>

            <button
              onClick={() => setNewAmmModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer une AMM</span>
            </button>
          </div>

          {/* AMM Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10.5px]">
                    <th className="py-3 px-4">Numéro AMM</th>
                    <th className="py-3 px-4">DCI & Nom Commercial</th>
                    <th className="py-3 px-4">Laboratoire Titulaire</th>
                    <th className="py-3 px-4">Préqualification / Norme</th>
                    <th className="py-3 px-4">Validité (5 ans)</th>
                    <th className="py-3 px-4">CNAMGS</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAmm.map((amm) => (
                    <tr key={amm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-teal-800 text-xs px-2 py-0.5 bg-teal-50 rounded border border-teal-200">
                          {amm.numeroAmm}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{amm.nomCommercial}</div>
                        <div className="text-[10.5px] text-slate-600">{amm.dci} • {amm.formeDosage}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{amm.laboratoireTitulaire}</div>
                        <div className="text-[10px] text-slate-500 truncate">{amm.siteFabrication}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10.5px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {amm.classificationOms}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">Octroi : {amm.dateOctroiAmm}</div>
                        <div className="text-[10px] text-rose-700 font-bold">Exp : {amm.dateExpirationAmm}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{amm.tauxRemboursementCnamgs}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          amm.statut === 'VALIDE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : amm.statut === 'EN_RENOUVELLEMENT'
                            ? 'bg-blue-100 text-blue-800'
                            : amm.statut === 'EN_INSTRUCTION'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {amm.statut.replace('_', ' ')}
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

      {/* TAB 5: BPD & CHAINE DU FROID */}
      {activeTab === 'bpd' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bpdAudits.map((audit) => (
              <div key={audit.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                      Site : {audit.provinceId}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 mt-1">{audit.siteNom}</h4>
                    <p className="text-xs text-slate-500">Auditeur : {audit.auditeurPrincipal}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-700">{audit.scoreConformitePourcent}%</span>
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase">{audit.statut.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Chaîne du Froid 2°C–8°C :</span>
                    <strong className="text-slate-900 font-mono">{audit.criteres.chaineFroid.note}/10</strong>
                  </div>
                  <p className="text-[10px] text-slate-500 italic pl-2 border-l-2 border-teal-500">{audit.criteres.chaineFroid.statut}</p>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600 font-medium">Traçabilité FEFO :</span>
                    <strong className="text-slate-900 font-mono">{audit.criteres.fefoTracabilite.note}/10</strong>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600 font-medium">Zone de Quarantaine :</span>
                    <strong className="text-slate-900 font-mono">{audit.criteres.gestionQuarantaine.note}/10</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h6 className="font-bold text-[10.5px] uppercase text-slate-800 mb-1">Plan d'Actions Correctives (CAPA) :</h6>
                  <p className="text-xs text-slate-600">{audit.capaActions}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* PDF Modals */}
      <CertificatLiberationLotPdfModal
        inspection={selectedInspectionForPdf}
        isOpen={!!selectedInspectionForPdf}
        onClose={() => setSelectedInspectionForPdf(null)}
      />

      <FichePharmacovigilancePdfModal
        report={selectedPvForPdf}
        isOpen={!!selectedPvForPdf}
        onClose={() => setSelectedPvForPdf(null)}
      />

      {/* Action Modals */}
      <NewQualityInspectionModal
        isOpen={newInspectionModalOpen}
        onClose={() => setNewInspectionModalOpen(false)}
        onSaveInspection={handleSaveNewInspection}
        activePersona={activePersona}
      />

      <NewPharmacovigilanceModal
        isOpen={newPvModalOpen}
        onClose={() => setNewPvModalOpen(false)}
        onSaveReport={handleSaveNewPv}
        activePersona={activePersona}
      />

      <NewAmmDmpModal
        isOpen={newAmmModalOpen}
        onClose={() => setNewAmmModalOpen(false)}
        onSaveAmm={handleSaveNewAmm}
      />

    </div>
  );
}
