import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Award, 
  Clock, 
  UserCheck, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  Printer, 
  Download, 
  Coins, 
  FileText, 
  Filter, 
  Calendar,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { 
  HR_MACRO_KPIS, 
  HR_METIERS_LIST, 
  HR_HABILITATIONS_CATALOG, 
  EMPLOYEES_DIRECTORY, 
  MONTHLY_ONCALL_SCHEDULES, 
  INITIAL_AFFECTATIONS_HISTORY 
} from '../../data/humanResourcesData';
import { formatXAF } from '../../utils/formatters';
import DecisionAffectationPdfModal from './DecisionAffectationPdfModal';
import TableauGardesPdfModal from './TableauGardesPdfModal';
import NewAffectationModal from './NewAffectationModal';

export default function HumanResourcesManager({
  activePersona,
  sanctumReady,
  onNavigateModule
}) {
  const [activeTab, setActiveTab] = useState('effectifs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedMetier, setSelectedMetier] = useState('ALL');

  // États pour les mutations & affectations
  const [affectationsList, setAffectationsList] = useState(INITIAL_AFFECTATIONS_HISTORY);
  const [oncallSchedules, setOncallSchedules] = useState(MONTHLY_ONCALL_SCHEDULES);

  // Modales
  const [selectedAffectationForPdf, setSelectedAffectationForPdf] = useState(null);
  const [isTableauGardesPdfOpen, setIsTableauGardesPdfOpen] = useState(false);
  const [isNewAffectationModalOpen, setIsNewAffectationModalOpen] = useState(false);

  // Filtrage du personnel
  const filteredEmployees = EMPLOYEES_DIRECTORY.filter((emp) => {
    const matchSearch = emp.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.poste.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProv = selectedProvince === 'ALL' || emp.province === selectedProvince;
    const matchMetier = selectedMetier === 'ALL' || emp.metierId === selectedMetier;
    return matchSearch && matchProv && matchMetier;
  });

  const handleAddNewAffectation = (newAff) => {
    setAffectationsList(prev => [newAff, ...prev]);
    setSelectedAffectationForPdf(newAff);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Officiel & Bannière RH Nationale */}
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
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direction des Ressources Humaines (DRH)
              </span>
              <span className="text-xs text-slate-400 font-mono">Effectif National : 342 Agents</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gestion Avancée des Ressources Humaines & Affectations Spécialisées
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Pilotage des carrières, habilitations pharmaceutiques/logistiques, astreintes sanitaires 24/7 et mobilité territoriale sur les 9 provinces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewAffectationModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Décision d'Affectation</span>
            </button>
            <button
              onClick={() => setIsTableauGardesPdfOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Tableau des Gardes</span>
            </button>
          </div>
        </div>

        {/* 4 KPIs Clés RH */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Collaborateurs Actifs
            </div>
            <div className="text-xl font-black text-white font-mono">{HR_MACRO_KPIS.effectifTotalNational}</div>
            <div className="text-[10px] text-emerald-400 font-medium">9 Antennes & Siège Owendo</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-blue-400" /> Habilitations Conformes
            </div>
            <div className="text-xl font-black text-white font-mono">{HR_MACRO_KPIS.tauxConformiteHabilitationsPct}%</div>
            <div className="text-[10px] text-blue-300 font-medium">Norme BPF, BPD OMS & CACES</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Permanence Gardes 24/7
            </div>
            <div className="text-xl font-black text-white font-mono">{HR_MACRO_KPIS.tauxCouvertureGardes247Pct}%</div>
            <div className="text-[10px] text-amber-300 font-medium">{HR_MACRO_KPIS.agentsEnAstreinteLive} Agents d'Astreinte Live</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1">
              <Coins className="w-3.5 h-3.5 text-purple-400" /> Sujétions & Éloignement
            </div>
            <div className="text-xl font-black text-white font-mono">48.5 M</div>
            <div className="text-[10px] text-purple-300 font-medium">FCFA Budget Mensuel Primes</div>
          </div>
        </div>
      </div>

      {/* 2. Barre de Navigation des 4 Onglets */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-sm p-1.5 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('effectifs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'effectifs'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Effectifs & Organigramme Territorial ({filteredEmployees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('habilitations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'habilitations'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>2. Habilitations & Compétences Métier</span>
        </button>

        <button
          onClick={() => setActiveTab('gardes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'gardes'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>3. Plannings de Garde & Astreintes 24/7 ({oncallSchedules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mutations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'mutations'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>4. Mutations & Décisions d'Affectation ({affectationsList.length})</span>
        </button>
      </div>

      {/* 3. Contenu de l'Onglet Actif */}

      {/* TAB 1 : EFFECTIFS & ORGANIGRAMME TERRITORIAL */}
      {activeTab === 'effectifs' && (
        <div className="space-y-5">
          {/* Filtres & Recherche */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, matricule OPN, titre ou fonction (ex: Pharmacien, Cariste, Hilux, Lambaréné)..."
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

            {/* Filtres par corps de métier */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedMetier('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedMetier === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous les Métiers ({EMPLOYEES_DIRECTORY.length})
              </button>
              {HR_METIERS_LIST.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetier(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedMetier === m.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.label.split(' / ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des Collaborateurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div key={emp.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-sm text-emerald-800">
                        {emp.prenom[0]}{emp.nom[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {emp.titre} {emp.prenom} {emp.nom}
                        </h4>
                        <p className="text-[10px] font-mono font-bold text-slate-500">{emp.matricule}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emp.statutColor}`}>
                      {emp.statutLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-slate-800">{emp.poste}</p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> {emp.site} ({emp.province})
                    </p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {emp.telephone}
                    </p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {emp.email}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {emp.habilitations.map(hId => {
                      const hab = HR_HABILITATIONS_CATALOG.find(h => h.id === hId);
                      return (
                        <span key={hId} className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-mono font-bold text-slate-700">
                          {hab?.code || hId}
                        </span>
                      );
                    })}
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {emp.ancienneteAnnees} ans d'ancienneté
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2 : HABILITATIONS & COMPÉTENCES */}
      {activeTab === 'habilitations' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" /> Matrice nationale des habilitations
            </h3>
            <p className="text-xs text-slate-500">
              Certifications réglementaires obligatoires pour le personnel pharmaceutique, cryogénique, logistique et de convoi de l'OPN.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {HR_HABILITATIONS_CATALOG.map((hab) => {
                const holdingCount = EMPLOYEES_DIRECTORY.filter(e => e.habilitations.includes(hab.id)).length;

                return (
                  <div key={hab.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                          {hab.code}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1">{hab.intitule}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded border border-slate-200">
                        {holdingCount} Habilités
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 border-t border-slate-200/60 pt-2">
                      <p><span className="font-semibold text-slate-700">Organisme Certificateur :</span> {hab.organisme}</p>
                      <p><span className="font-semibold text-slate-700">Périodicité de Recyclage :</span> Tous les {hab.validiteAnnees} ans</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Conforme Normes OMS
                      </span>
                      <span>Audité par l'Inspection OPN</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3 : PLANNINGS DE GARDE & ASTREINTES 24/7 */}
      {activeTab === 'gardes' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" /> Tours de Garde & Permanence Thérapeutique 24/7
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispositif d'urgence pour la délivrance des sérums vitaux, solutés massifs et approvisionnements de crise nocturne.
              </p>
            </div>

            <button
              onClick={() => setIsTableauGardesPdfOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimer Tableau de Garde Officiel</span>
            </button>
          </div>

          {/* Grille des Gardes Actives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oncallSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-amber-300 transition-all">
                
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {schedule.province}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{schedule.site}</h4>
                    <p className="text-xs text-slate-500">{schedule.periode}</p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {schedule.statutLabel}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="font-bold text-slate-900 flex items-center justify-between">
                      <span>Pharmacien Référent : {schedule.pharmacienGarde}</span>
                      <span className="font-mono text-emerald-700 text-[11px]">{schedule.pharmacienTel}</span>
                    </p>
                    <p className="text-slate-600">Technicien Froid : {schedule.technicienFroid} ({schedule.technicienFroidTel})</p>
                    <p className="text-slate-600">Chauffeur / Convoyeur : {schedule.chauffeurConvoi}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>Interventions cette semaine : <strong>{schedule.interventionsEffectuees} urgences</strong></span>
                    <span className="text-emerald-700 font-semibold">{schedule.structuresDesservies.join(', ')}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4 : MUTATIONS & DÉCISIONS D'AFFECTATION */}
      {activeTab === 'mutations' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Registre National des Décisions d'Affectation Provinciale
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Historique des mutations géographiques, primes de sujétion et fiches de poste signées par la Direction Générale.
              </p>
            </div>

            <button
              onClick={() => setIsNewAffectationModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Décision d'Affectation</span>
            </button>
          </div>

          {/* Liste des Décisions d'Affectation */}
          <div className="space-y-4">
            {affectationsList.map((aff) => (
              <div key={aff.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-900 text-white">
                      {aff.id}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {aff.statutLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">Date d'effet : {aff.dateEffet}</span>
                    <button
                      onClick={() => setSelectedAffectationForPdf(aff)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Décision d'Affectation</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Collaborateur :</span>
                    <p className="font-bold text-slate-900">{aff.employeNom}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{aff.matricule} — {aff.categorieIndiciaire}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Nouvelle Affectation :</span>
                    <p className="font-bold text-emerald-800">{aff.nouveauPoste}</p>
                    <p className="text-slate-600">{aff.provinceDestination} — {aff.siteDestination}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Primes & Logement :</span>
                    <p className="font-mono font-bold text-slate-900">+{formatXAF(aff.primeEloignementXAF)} / mois</p>
                    <p className="text-slate-500 text-[11px]">{aff.logementFonction}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-100">
                  <span className="font-semibold text-slate-800 not-italic">Justification : </span>
                  « {aff.motif} »
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* MODALES A4 & CRÉATION */}
      <DecisionAffectationPdfModal
        isOpen={Boolean(selectedAffectationForPdf)}
        onClose={() => setSelectedAffectationForPdf(null)}
        affectation={selectedAffectationForPdf}
      />

      <TableauGardesPdfModal
        isOpen={isTableauGardesPdfOpen}
        onClose={() => setIsTableauGardesPdfOpen(false)}
        schedules={oncallSchedules}
      />

      <NewAffectationModal
        isOpen={isNewAffectationModalOpen}
        onClose={() => setIsNewAffectationModalOpen(false)}
        onSubmitAffectation={handleAddNewAffectation}
      />

    </div>
  );
}
