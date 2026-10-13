import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Pill, 
  Building2, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  Filter, 
  TrendingUp, 
  Clock, 
  Coins, 
  HelpCircle, 
  Award, 
  Layers, 
  Eye, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  Info
} from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { 
  CITIZEN_MACRO_KPIS, 
  ESSENTIAL_MEDICINES_CATALOG, 
  PUBLIC_HEALTH_FACILITIES_DIRECTORY, 
  CITIZEN_REPORT_MOTIFS, 
  INITIAL_CITIZEN_REPORTS 
} from '../../data/publicCitizenData';
import { formatXAF } from '../../utils/formatters';
import FicheDisponibilitePdfModal from './FicheDisponibilitePdfModal';
import RecepisseSignalementPdfModal from './RecepisseSignalementPdfModal';
import NewCitizenSignalementModal from './NewCitizenSignalementModal';

export default function CitizenPortalManager({
  activePersona,
  sanctumReady,
  onNavigateModule
}) {
  const [activeTab, setActiveTab] = useState('recherche');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [selectedInsuranceScheme, setSelectedInsuranceScheme] = useState('fonds1_ge');
  const [selectedSimulatedMedicineId, setSelectedSimulatedMedicineId] = useState('MED-001');

  // État des Signalements Citoyens
  const [citizenReports, setCitizenReports] = useState(INITIAL_CITIZEN_REPORTS);
  const [reportFilterStatus, setReportFilterStatus] = useState('ALL');

  // Modales
  const [selectedMedForPdf, setSelectedMedForPdf] = useState(null);
  const [selectedReportForPdf, setSelectedReportForPdf] = useState(null);
  const [newSignalementModalOpen, setNewSignalementModalOpen] = useState(false);

  // Filtrage du catalogue
  const classesList = ['ALL', ...new Set(ESSENTIAL_MEDICINES_CATALOG.map(m => m.classe))];

  const filteredMedicines = ESSENTIAL_MEDICINES_CATALOG.filter(med => {
    const matchSearch = med.dci.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.nomCommercial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.classe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.indication.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClassFilter === 'ALL' || med.classe === selectedClassFilter;
    return matchSearch && matchClass;
  });

  const filteredReports = citizenReports.filter(rep => {
    if (reportFilterStatus === 'ALL') return true;
    return rep.statut === reportFilterStatus;
  });

  const simulatedMed = ESSENTIAL_MEDICINES_CATALOG.find(m => m.id === selectedSimulatedMedicineId) || ESSENTIAL_MEDICINES_CATALOG[0];

  const handleAddNewReport = (newRep) => {
    setCitizenReports(prev => [newRep, ...prev]);
    setSelectedReportForPdf(newRep);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Officiel & Bannière Transparence Citoyenne */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-emerald-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Liseré Gabon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#009e60]" />
          <div className="flex-1 bg-[#fcd116]" />
          <div className="flex-1 bg-[#3a75c4]" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Service Public d'Information Thérapeutique
              </span>
              <span className="text-xs text-slate-400 font-mono">Décret N° 00412/PR/MS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Portail Citoyen & Disponibilité Publique des Médicaments
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Consultez en direct les stocks disponibles dans les hôpitaux publics des 9 provinces, vérifiez les Prix Publics Plafonnés (Mercuriale) et déposez vos signalements auprès de l'Inspection OPN.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setNewSignalementModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-transform active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Signaler une Rupture / Surtarification</span>
            </button>
            <div className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Numéro Vert Gratuit</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{CITIZEN_MACRO_KPIS.numVertNationalGratuit}</span>
            </div>
          </div>
        </div>

        {/* 4 KPIs Clés Grand Public */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Disponibilité Publique
            </div>
            <div className="text-xl font-black text-white font-mono">{CITIZEN_MACRO_KPIS.tauxDisponibiliteNationale}%</div>
            <div className="text-[10px] text-emerald-400 font-medium">Panier Vital des 9 Provinces</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> Établissements Connectés
            </div>
            <div className="text-xl font-black text-white font-mono">{CITIZEN_MACRO_KPIS.structuresConnectees}</div>
            <div className="text-[10px] text-blue-300 font-medium">CHU, CHR, Antennes & Hôpitaux</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> Économie Tiers-Payant
            </div>
            <div className="text-xl font-black text-white font-mono">-{CITIZEN_MACRO_KPIS.economieMoyennePatientTiersPayantPct}%</div>
            <div className="text-[10px] text-amber-300 font-medium">Prise en Charge CNAMGS Moyenne</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> Délai d'Instruction Alertes
            </div>
            <div className="text-xl font-black text-white font-mono">{CITIZEN_MACRO_KPIS.delaiMoyenInstructionSignalementHeures}h</div>
            <div className="text-[10px] text-purple-300 font-medium">{CITIZEN_MACRO_KPIS.tauxResolutionSignalements}% de Résolution</div>
          </div>
        </div>
      </div>

      {/* 2. Barre de Navigation des 4 Onglets */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-sm p-1.5 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recherche')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'recherche'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>1. Recherche & Disponibilité Nationale</span>
        </button>

        <button
          onClick={() => setActiveTab('mercuriale')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'mercuriale'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>2. Mercuriale des Prix & Simulateur CNAMGS</span>
        </button>

        <button
          onClick={() => setActiveTab('signalements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'signalements'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>3. Guichet des Signalements Citoyens ({citizenReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('observatoire')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'observatoire'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>4. Observatoire Public des 9 Provinces</span>
        </button>
      </div>

      {/* 3. Contenu de l'Onglet Actif */}

      {/* TAB 1 : RECHERCHE & DISPONIBILITÉ NATIONALE */}
      {activeTab === 'recherche' && (
        <div className="space-y-5">
          {/* Barre de Recherche Multi-critères */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par DCI, Nom Commercial, Maladie (ex: Paludisme, Insuline, Oxytocine, Amoxicilline)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-56"
                >
                  <option value="ALL">Toutes les 9 Provinces</option>
                  {GABON_PROVINCES.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.capital})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtres par famille thérapeutique */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {classesList.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedClassFilter === cls
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls === 'ALL' ? 'Toutes les Classes' : cls}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des Médicaments avec Stocks par Structure */}
          <div className="space-y-4">
            {filteredMedicines.map((med) => {
              const facilitiesForMed = PUBLIC_HEALTH_FACILITIES_DIRECTORY.filter(f => {
                const hasStock = f.stocksLive && f.stocksLive[med.id];
                const matchProv = selectedProvince === 'ALL' || f.province === selectedProvince;
                return hasStock && matchProv;
              });

              return (
                <div key={med.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-emerald-300 transition-all">
                  
                  {/* Entête du Médicament */}
                  <div className="p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                            {med.classe}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {med.priorite}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900">{med.dci}</h3>
                        <p className="text-xs text-slate-500 font-medium">{med.nomCommercial} — {med.forme} ({med.dosage})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-medium block">Prix Public Plafonné (PPP)</span>
                        <span className="text-lg font-black text-emerald-700 font-mono">{formatXAF(med.prixPlafondXAF)}</span>
                      </div>

                      <button
                        onClick={() => setSelectedMedForPdf(med)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Fiche Officielle</span>
                      </button>
                    </div>
                  </div>

                  {/* Indication & Taux CNAMGS */}
                  <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <p className="text-slate-600 italic">
                      <span className="font-semibold text-slate-700">Indication : </span> {med.indication}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-bold text-slate-600">Reste à charge CNAMGS GE :</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {formatXAF(med.cnamgs?.fonds1_ge?.resteACharge || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Liste des structures publiques disposant du stock */}
                  <div className="p-5">
                    <h4 className="text-xs font-bold uppercase text-slate-600 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" /> 
                        Structures Publiques Disponibles ({facilitiesForMed.length} points de dispensation)
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Mise à jour temps réel OPN</span>
                    </h4>

                    {facilitiesForMed.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {facilitiesForMed.map(fac => {
                          const stockData = fac.stocksLive[med.id];
                          return (
                            <div key={fac.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-400 transition-all">
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h5 className="font-bold text-xs text-slate-900 leading-tight">{fac.nom}</h5>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex-shrink-0">
                                  {stockData.quantite} dispo
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> {fac.province} — {fac.ville}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {fac.telephone}</span>
                                <span className="text-slate-400">{stockData.maj}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800">
                        Aucun stock public répertorié dans la sélection actuelle. Composez le <strong>1410</strong> pour le réapprovisionnement d'urgence.
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2 : MERCURIALE & SIMULATEUR CNAMGS */}
      {activeTab === 'mercuriale' && (
        <div className="space-y-6">
          
          {/* Simulateur Interactif */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Coins className="w-4 h-4" /> Simulateur Officiel de Reste à Charge
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Calculez le montant exact exigible selon votre couverture CNAMGS
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Le montant calculé correspond au ticket modérateur légal maximum. Aucun frais annexe ne peut être réclamé dans les structures publiques.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/60 p-5 sm:p-6 rounded-xl border border-slate-700">
              
              {/* Choix du médicament */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">1. Choisissez le Médicament *</label>
                  <select
                    value={selectedSimulatedMedicineId}
                    onChange={(e) => setSelectedSimulatedMedicineId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-600 bg-slate-900 text-white px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ESSENTIAL_MEDICINES_CATALOG.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.dci} — {m.dosage} ({formatXAF(m.prixPlafondXAF)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Choix du régime d'assurance */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">2. Votre Régime d'Assurance Maladie *</label>
                  <select
                    value={selectedInsuranceScheme}
                    onChange={(e) => setSelectedInsuranceScheme(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-600 bg-slate-900 text-white px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="fonds1_ge">CNAMGS Fonds 1 : Agents Publics / GE (Prise en charge 80% / 90%)</option>
                    <option value="fonds2_prive">CNAMGS Fonds 2 : Salariés du Secteur Privé (Prise en charge 80%)</option>
                    <option value="fonds3_gef">CNAMGS Fonds 3 : Gabonais Économiquement Faibles / GEF (100% / 90%)</option>
                    <option value="ald">CNAMGS Affection Longue Durée / ALD (Prise en charge 100% Diabète/HTA/Cancer)</option>
                    <option value="non_assure">Non Assuré / Sans Carte CNAMGS (Plein Tarif Homologué 100%)</option>
                  </select>
                </div>
              </div>

              {/* Résultat du calcul */}
              <div className="bg-slate-900/90 p-5 rounded-xl border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 mb-3">
                    <span>Prix Public Plafonné (PPP) :</span>
                    <span className="font-mono font-bold text-white">{formatXAF(simulatedMed.prixPlafondXAF)}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-emerald-400">
                      <span>Part Prise en Charge CNAMGS :</span>
                      <span className="font-mono font-bold">
                        -{formatXAF(simulatedMed.prixPlafondXAF - (simulatedMed.cnamgs?.[selectedInsuranceScheme]?.resteACharge || 0))} 
                        ({simulatedMed.cnamgs?.[selectedInsuranceScheme]?.taux || 0}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Montant Maximum à Payer à la Caisse (Ticket Modérateur) :
                  </span>
                  <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                    {formatXAF(simulatedMed.cnamgs?.[selectedInsuranceScheme]?.resteACharge || 0)}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    {simulatedMed.cnamgs?.[selectedInsuranceScheme]?.label}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Tableau Exhaustif de la Mercuriale */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Mercuriale Nationale des Prix Publics Plafonnés</h3>
                <p className="text-xs text-slate-500">Tarifs officiels applicables sur l'ensemble du territoire gabonais</p>
              </div>
              <span className="text-xs font-mono text-slate-500">Mise à jour : {CITIZEN_MACRO_KPIS.derniereMajMercuriale}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase">
                    <th className="py-3 px-4">DCI & Présentation</th>
                    <th className="py-3 px-3">Classe Thérapeutique</th>
                    <th className="py-3 px-3 text-right">Prix Plafonné (PPP)</th>
                    <th className="py-3 px-3 text-right">Reste GE (90%)</th>
                    <th className="py-3 px-3 text-right">Reste GEF (100%)</th>
                    <th className="py-3 px-4 text-center">Fiche A4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {ESSENTIAL_MEDICINES_CATALOG.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{m.dci}</p>
                        <p className="text-[10px] text-slate-500">{m.nomCommercial} — {m.dosage}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{m.classe}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatXAF(m.prixPlafondXAF)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                        {formatXAF(m.cnamgs?.fonds1_ge?.resteACharge || 0)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                        {formatXAF(m.cnamgs?.fonds3_gef?.resteACharge || 0)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedMedForPdf(m)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Imprimer Fiche Officielle"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3 : GUICHET DES SIGNALEMENTS CITOYENS */}
      {activeTab === 'signalements' && (
        <div className="space-y-6">
          
          {/* Header Signalements */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> Registre National des Signalements & Alertes Usagers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Suivi des enquêtes de l'Inspection Pharmaceutique OPN et des réapprovisionnements d'urgence consécutifs aux plaintes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNewSignalementModalOpen(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Signalement Citoyen</span>
              </button>
            </div>
          </div>

          {/* Filtres de statut */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setReportFilterStatus('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                reportFilterStatus === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous les Dossiers ({citizenReports.length})
            </button>
            <button
              onClick={() => setReportFilterStatus('ENQUETE_EN_COURS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                reportFilterStatus === 'ENQUETE_EN_COURS'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Enquête en cours ({citizenReports.filter(r => r.statut === 'ENQUETE_EN_COURS').length})
            </button>
            <button
              onClick={() => setReportFilterStatus('TRAITE_REAPPROVISIONNE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                reportFilterStatus === 'TRAITE_REAPPROVISIONNE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Régularisé / Réapprovisionné ({citizenReports.filter(r => r.statut === 'TRAITE_REAPPROVISIONNE').length})
            </button>
          </div>

          {/* Cartes des Dossiers de Signalements */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-900 text-white">
                      {report.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${report.statutColor}`}>
                      {report.statutLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">{report.date}</span>
                    <button
                      onClick={() => setSelectedReportForPdf(report)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Récépissé A4</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Structure & Lieu :</span>
                    <p className="font-bold text-slate-900">{report.structure}</p>
                    <p className="text-slate-500">{report.province} ({report.ville})</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Médicament & Infraction :</span>
                    <p className="font-bold text-slate-900">{report.medicament}</p>
                    <p className="text-amber-700 font-semibold">{report.motifLabel}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Déclarant & Preuve :</span>
                    <p className="font-semibold text-slate-800">{report.declarantNom}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{report.preuveFournie}</p>
                  </div>
                </div>

                {/* Circonstances & Décision d'Inspection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Constat Déclaré :</span>
                    <p className="text-slate-700 italic">« {report.description} »</p>
                  </div>

                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">Mesure Prise par l'OPN :</span>
                    <p className="text-emerald-950 font-medium">{report.decisionInspection}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4 : OBSERVATOIRE PUBLIC DES 9 PROVINCES */}
      {activeTab === 'observatoire' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Observatoire Régional de la Disponibilité des Médicaments Essentiels
            </h3>
            <p className="text-xs text-slate-500">
              Taux de disponibilité consolidé des 50 molécules vitales dans les réseaux hospitaliers publics provinciaux.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {GABON_PROVINCES.map((prov) => {
                const facsInProv = PUBLIC_HEALTH_FACILITIES_DIRECTORY.filter(f => f.province === prov.name);
                const avgDispo = facsInProv.length > 0 
                  ? (facsInProv.reduce((acc, curr) => acc + curr.tauxDisponibilitePanierPct, 0) / facsInProv.length).toFixed(1)
                  : '92.0';

                return (
                  <div key={prov.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-slate-900">{prov.name}</h4>
                      <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {avgDispo}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Chef-lieu : {prov.capital}</p>
                    
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${avgDispo}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <span>{facsInProv.length || 2} Hôpitaux Référencés</span>
                      <span className="text-emerald-600 font-semibold">Chaîne Froid Conforme</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charte du Patient & Numéro Vert */}
          <div className="p-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-400" /> Charte Nationale de Transparence Thérapeutique
              </h4>
              <p className="text-xs text-slate-300 max-w-2xl">
                L'Office Pharmaceutique National garantit à chaque citoyen l'accès aux médicaments vitaux aux tarifs plafonnés par l'État sur l'ensemble des 9 provinces.
              </p>
            </div>

            <div className="px-5 py-3 bg-white/10 rounded-xl border border-white/20 text-center flex-shrink-0">
              <span className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Assistance Citoyenne 24h/24</span>
              <span className="text-lg font-black text-emerald-400 font-mono">1410 (Appel Gratuit)</span>
            </div>
          </div>

        </div>
      )}

      {/* MODALES A4 & SIGNALEMENT */}
      <FicheDisponibilitePdfModal
        isOpen={Boolean(selectedMedForPdf)}
        onClose={() => setSelectedMedForPdf(null)}
        medicine={selectedMedForPdf}
        selectedProvince={selectedProvince === 'ALL' ? 'Toutes les Provinces' : selectedProvince}
        facilities={PUBLIC_HEALTH_FACILITIES_DIRECTORY}
      />

      <RecepisseSignalementPdfModal
        isOpen={Boolean(selectedReportForPdf)}
        onClose={() => setSelectedReportForPdf(null)}
        report={selectedReportForPdf}
      />

      <NewCitizenSignalementModal
        isOpen={newSignalementModalOpen}
        onClose={() => setNewSignalementModalOpen(false)}
        onSubmitReport={handleAddNewReport}
      />

    </div>
  );
}
