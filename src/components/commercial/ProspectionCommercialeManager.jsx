import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Camera, 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  Eye, 
  Plus, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  FileText
} from 'lucide-react';

import { SICL_PROSPECTS_SEED } from '../../data/siclSeedData';
import { GABON_PROVINCIAL_ANTENNAS } from '../../data/provincialAntennaData';
import { generateOpnDocNumber } from '../../utils/codificationHelper';
import NewProspectModal from './NewProspectModal';
import LogVisitModal from './LogVisitModal';

export const PROSPECT_STATUSES = [
  { id: 'ALL', label: 'Tous les Statuts', color: 'bg-slate-100 text-slate-700' },
  { id: 'IDENTIFIE', label: '1. Identifié', color: 'bg-slate-100 text-slate-800' },
  { id: 'CONTACTE', label: '2. Contacté', color: 'bg-blue-100 text-blue-800' },
  { id: 'DEVIS_ENVOYE', label: '3. Devis Envoyé', color: 'bg-amber-100 text-amber-800' },
  { id: 'CONVERTI', label: '4. Converti Client', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'PERDU', label: 'Perdu / Sans Suite', color: 'bg-rose-100 text-rose-800' }
];

export default function ProspectionCommercialeManager({ activePersona, onNavigateModule }) {
  const [prospects, setProspects] = useState(SICL_PROSPECTS_SEED);
  const [selectedAntennaCode, setSelectedAntennaCode] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' | 'table'

  // Modals
  const [isNewProspectOpen, setIsNewProspectOpen] = useState(false);
  const [selectedProspectForVisit, setSelectedProspectForVisit] = useState(null);
  const [selectedProspectDetail, setSelectedProspectDetail] = useState(null);
  const [conversionSuccessModal, setConversionSuccessModal] = useState(null);

  // Filtered prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter(p => {
      const matchAntenna = selectedAntennaCode === 'ALL' || p.provinceCode === selectedAntennaCode;
      const matchStatus = selectedStatus === 'ALL' || p.statut === selectedStatus;
      const matchSearch = searchQuery === '' || 
        p.nomStructure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.localite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contactNom.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAntenna && matchStatus && matchSearch;
    });
  }, [prospects, selectedAntennaCode, selectedStatus, searchQuery]);

  // Statistics & KPIs
  const kpis = useMemo(() => {
    const total = prospects.length;
    const convertis = prospects.filter(p => p.statut === 'CONVERTI').length;
    const devisEnvoyes = prospects.filter(p => p.statut === 'DEVIS_ENVOYE').length;
    const dormants = prospects.filter(p => p.isDormant).length;
    const conversionRate = total > 0 ? Math.round((convertis / total) * 100) : 0;
    
    return {
      total,
      convertis,
      devisEnvoyes,
      dormants,
      conversionRate
    };
  }, [prospects]);

  // Handlers
  const handleSaveProspect = (newProspect) => {
    setProspects(prev => [newProspect, ...prev]);
  };

  const handleSaveVisit = (prospectId, newVisit, newStatus) => {
    setProspects(prev => prev.map(p => {
      if (p.id === prospectId) {
        return {
          ...p,
          statut: newStatus,
          dateDerniereVisite: newVisit.date,
          joursDepuisVisite: 0,
          isDormant: false,
          historiqueVisites: [newVisit, ...p.historiqueVisites]
        };
      }
      return p;
    }));
  };

  const handleConvertToClient = (prospect) => {
    const newClientCode = generateOpnDocNumber('CLIENT', { sequence: Math.floor(Math.random() * 800) + 50 });
    
    setProspects(prev => prev.map(p => {
      if (p.id === prospect.id) {
        return {
          ...p,
          statut: 'CONVERTI',
          clientConvertiId: newClientCode
        };
      }
      return p;
    }));

    setConversionSuccessModal({
      prospectNom: prospect.nomStructure,
      prospectCode: prospect.code,
      clientCode: newClientCode,
      province: prospect.province
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#00A651] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-white/5 transform skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/30 backdrop-blur-sm">
                Module M2 &amp; M10 SICL
              </span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Géolocalisation &amp; Mobilité Terrain
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Prospection Commerciale &amp; Gestion des Tiers
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1">
              Fiches structures de santé codifiées <code className="bg-black/20 px-1 py-0.5 rounded">PROS_&lt;Antenne&gt;_&lt;NNN&gt;</code>, capture GPS, suivi des visites, détection des prospects dormants &amp; conversion automatique en client.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewProspectOpen(true)}
              className="px-4 py-2.5 bg-white text-[#003366] hover:bg-slate-50 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#00A651]" />
              Nouveau Prospect Terrain
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">Total Prospects</p>
            <p className="text-xl font-black text-white mt-0.5">{kpis.total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">Devis en Cours</p>
            <p className="text-xl font-black text-amber-300 mt-0.5">{kpis.devisEnvoyes}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">Convertis Clients</p>
            <p className="text-xl font-black text-emerald-300 mt-0.5">{kpis.convertis}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">Taux de Conversion</p>
            <p className="text-xl font-black text-white mt-0.5">{kpis.conversionRate}%</p>
          </div>
          <div className={`backdrop-blur-md rounded-xl p-3 border ${kpis.dormants > 0 ? 'bg-rose-500/20 border-rose-300/30' : 'bg-white/10 border-white/10'}`}>
            <p className="text-[10px] font-medium text-rose-200 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-300" /> Dormants (&gt;90j)
            </p>
            <p className="text-xl font-black text-rose-300 mt-0.5">{kpis.dormants}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Views */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Search */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher structure, ville, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            />
          </div>

          {/* Antenne Filter */}
          <select
            value={selectedAntennaCode}
            onChange={(e) => setSelectedAntennaCode(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 text-slate-700 bg-white"
          >
            <option value="ALL">Toutes les 9 Antennes</option>
            {GABON_PROVINCIAL_ANTENNAS.map(ant => (
              <option key={ant.provinceCode} value={ant.provinceCode}>
                {ant.provinceCode} — {ant.province}
              </option>
            ))}
          </select>

          {/* Statut Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 text-slate-700 bg-white"
          >
            {PROSPECT_STATUSES.map(st => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              viewMode === 'pipeline' 
                ? 'bg-white text-[#003366] shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vue Pipeline (Kanban)
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              viewMode === 'table' 
                ? 'bg-white text-[#003366] shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vue Tableau
          </button>
        </div>
      </div>

      {/* Dormants Alert Banner (RG-M2-01) */}
      {kpis.dormants > 0 && selectedStatus === 'ALL' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <p className="text-xs font-bold">Règle de gestion RG-M2-01 : {kpis.dormants} prospect(s) dormant(s) sans visite depuis plus de 90 jours !</p>
              <p className="text-[11px] text-amber-700">Ces structures nécessitent une relance prioritaire du Responsable d'Antenne ou du Commercial.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setProspects(prev => prev.filter(p => p.isDormant));
              setSelectedStatus('ALL');
            }}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm shrink-0"
          >
            Filtrer les Dormants
          </button>
        </div>
      )}

      {/* Main Content View */}
      {viewMode === 'pipeline' ? (
        
        /* Pipeline Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { id: 'IDENTIFIE', title: '1. Identifiés & Nouveaux', bg: 'bg-slate-50', headerBg: 'bg-slate-200 text-slate-800' },
            { id: 'CONTACTE', title: '2. En Cours de Visite', bg: 'bg-blue-50/50', headerBg: 'bg-blue-100 text-blue-900' },
            { id: 'DEVIS_ENVOYE', title: '3. Devis Soumis', bg: 'bg-amber-50/50', headerBg: 'bg-amber-100 text-amber-900' },
            { id: 'CONVERTI', title: '4. Convertis Clients', bg: 'bg-emerald-50/50', headerBg: 'bg-emerald-100 text-emerald-900' }
          ].map(col => {
            const colProspects = filteredProspects.filter(p => p.statut === col.id);
            return (
              <div key={col.id} className={`${col.bg} rounded-2xl p-4 border border-slate-200 flex flex-col`}>
                
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl ${col.headerBg} font-bold text-xs flex items-center justify-between mb-3 shadow-sm`}>
                  <span>{col.title}</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded-full text-[11px] text-slate-800">
                    {colProspects.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colProspects.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      Aucune structure
                    </div>
                  ) : (
                    colProspects.map(prospect => (
                      <div 
                        key={prospect.id} 
                        className={`bg-white rounded-xl p-3.5 border shadow-sm hover:shadow-md transition-all ${
                          prospect.isDormant ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                        }`}
                      >
                        {/* Structure Thumbnail & Codes */}
                        <div className="flex items-start gap-3">
                          <img 
                            src={prospect.photoUrl} 
                            alt={prospect.nomStructure} 
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-bold text-[#003366] bg-blue-50 px-1.5 py-0.5 rounded">
                                {prospect.code}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {prospect.provinceCode}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-1" title={prospect.nomStructure}>
                              {prospect.nomStructure}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">{prospect.typeStructure}</p>
                          </div>
                        </div>

                        {/* Location & Contact */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                          <p className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {prospect.localite}, {prospect.adresse || prospect.province}
                          </p>
                          <p className="flex items-center gap-1 truncate font-medium">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            {prospect.telephone} ({prospect.contactNom})
                          </p>
                        </div>

                        {/* Dormant Badge or Last Visit */}
                        <div className="mt-2.5 flex items-center justify-between text-[10px]">
                          {prospect.isDormant ? (
                            <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertTriangle className="w-3 h-3" /> Dormant ({prospect.joursDepuisVisite}j sans visite)
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Visité il y a {prospect.joursDepuisVisite}j
                            </span>
                          )}

                          {prospect.clientConvertiId && (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Client {prospect.clientConvertiId}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedProspectForVisit(prospect)}
                            className="text-[11px] font-bold text-[#003366] hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                          >
                            <Calendar className="w-3 h-3 text-[#00A651]" />
                            Enregistrer Visite
                          </button>

                          {prospect.statut !== 'CONVERTI' && (
                            <button
                              onClick={() => handleConvertToClient(prospect)}
                              className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 transition-all"
                              title="Convertir en Client avec création de code N<NNNN>"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Convertir
                            </button>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3">Structure / Code</th>
                  <th className="p-3">Antenne &amp; Ville</th>
                  <th className="p-3">Typologie</th>
                  <th className="p-3">Contact &amp; Tél</th>
                  <th className="p-3">Dernière Visite</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProspects.map(prospect => (
                  <tr key={prospect.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={prospect.photoUrl} 
                          alt="" 
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{prospect.nomStructure}</p>
                          <span className="text-[10px] font-mono text-[#003366] bg-blue-50 px-1.5 py-0.2 rounded font-bold">
                            {prospect.code}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">
                      <p className="font-semibold text-slate-800">{prospect.localite}</p>
                      <p className="text-[10px] text-slate-500">{prospect.province} ({prospect.provinceCode})</p>
                    </td>
                    <td className="p-3 text-slate-700">{prospect.typeStructure}</td>
                    <td className="p-3 text-slate-700">
                      <p className="font-medium text-slate-900">{prospect.contactNom}</p>
                      <p className="text-[10px] text-slate-500">{prospect.telephone}</p>
                    </td>
                    <td className="p-3">
                      {prospect.isDormant ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Dormant ({prospect.joursDepuisVisite}j)
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">
                          {prospect.dateDerniereVisite} ({prospect.joursDepuisVisite}j)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        prospect.statut === 'CONVERTI' ? 'bg-emerald-100 text-emerald-800' :
                        prospect.statut === 'DEVIS_ENVOYE' ? 'bg-amber-100 text-amber-800' :
                        prospect.statut === 'CONTACTE' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {prospect.statut}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProspectForVisit(prospect)}
                          className="px-2 py-1 text-[11px] font-bold text-[#003366] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Visite
                        </button>
                        {prospect.statut !== 'CONVERTI' && (
                          <button
                            onClick={() => handleConvertToClient(prospect)}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                          >
                            Convertir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewProspectModal
        isOpen={isNewProspectOpen}
        onClose={() => setIsNewProspectOpen(false)}
        onSaveProspect={handleSaveProspect}
        currentAntennaCode={selectedAntennaCode === 'ALL' ? 'G1' : selectedAntennaCode}
      />

      {selectedProspectForVisit && (
        <LogVisitModal
          isOpen={!!selectedProspectForVisit}
          onClose={() => setSelectedProspectForVisit(null)}
          prospect={selectedProspectForVisit}
          onSaveVisit={handleSaveVisit}
        />
      )}

      {/* Conversion Success Notification Modal (RG-M2-02) */}
      {conversionSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl border border-emerald-200 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Conversion Réussie (RG-M2-02)
            </span>
            
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Nouveau Client Officiel OPN !
            </h3>
            
            <p className="text-xs text-slate-600 mt-1">
              La structure <strong className="text-slate-900">{conversionSuccessModal.prospectNom}</strong> ({conversionSuccessModal.prospectCode}) a été transformée avec succès.
            </p>

            <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
              <p className="flex justify-between">
                <span className="text-slate-500">Code Client National :</span>
                <strong className="text-emerald-700 font-mono text-sm">{conversionSuccessModal.clientCode}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Antenne de Rattachement :</span>
                <strong className="text-slate-800">{conversionSuccessModal.province}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Historique Prospection :</span>
                <span className="text-emerald-700 font-bold">Conservé &amp; Attaché</span>
              </p>
            </div>

            <button
              onClick={() => setConversionSuccessModal(null)}
              className="w-full py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Fermer &amp; Continuer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
