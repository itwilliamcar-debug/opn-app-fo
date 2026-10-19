import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  FileText,
  RefreshCw
} from 'lucide-react';

import { SICL_PROSPECTS_SEED } from '../../data/siclSeedData';
import { GABON_PROVINCIAL_ANTENNAS } from '../../data/provincialAntennaData';
import {
  fetchProspects,
  fetchCommercialReferentiel,
  createProspect,
  addProspectVisit,
  convertProspect,
} from '../../services/commercialApi';
import NewProspectModal from './NewProspectModal';
import LogVisitModal from './LogVisitModal';

export const PROSPECT_STATUSES = [
  { id: 'ALL', label: 'Tous les Statuts', color: 'bg-slate-100 text-slate-700' },
  { id: 'IDENTIFIE', label: '1. Identifié', color: 'bg-slate-100 text-slate-700' },
  { id: 'CONTACTE', label: '2. Contacté', color: 'bg-slate-100 text-slate-700' },
  { id: 'DEVIS_ENVOYE', label: '3. Devis Envoyé', color: 'bg-slate-200 text-slate-800' },
  { id: 'CONVERTI', label: '4. Converti Client', color: 'bg-slate-800 text-white' },
  { id: 'PERDU', label: 'Perdu / Sans Suite', color: 'bg-slate-100 text-slate-500' }
];

export default function ProspectionCommercialeManager({ activePersona, onNavigateModule }) {
  const [prospects, setProspects] = useState(SICL_PROSPECTS_SEED);
  const [antennes, setAntennes] = useState(GABON_PROVINCIAL_ANTENNAS);
  const [typesStructures, setTypesStructures] = useState([]);
  const [structuresRef, setStructuresRef] = useState([]);
  const [apiReady, setApiReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedAntennaCode, setSelectedAntennaCode] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' | 'table'

  // Modals
  const [isNewProspectOpen, setIsNewProspectOpen] = useState(false);
  const [selectedProspectForVisit, setSelectedProspectForVisit] = useState(null);
  const [selectedProspectDetail, setSelectedProspectDetail] = useState(null);
  const [conversionSuccessModal, setConversionSuccessModal] = useState(null);

  const chargerDonnees = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [ref, liste] = await Promise.all([
        fetchCommercialReferentiel(),
        fetchProspects(),
      ]);
      if (Array.isArray(ref?.antennes) && ref.antennes.length) {
        setAntennes(ref.antennes.map((a) => ({
          provinceCode: a.code,
          province: a.nom,
          nom: a.nom,
          chefLieu: a.chef_lieu || a.ville,
        })));
      }
      if (Array.isArray(ref?.types_structures)) {
        setTypesStructures(ref.types_structures.map((t) => t.libelle || t.code).filter(Boolean));
      }
      if (Array.isArray(ref?.structures)) {
        setStructuresRef(ref.structures);
      }
      if (liste.length) {
        setProspects(liste);
        setApiReady(true);
      } else {
        setProspects(SICL_PROSPECTS_SEED);
        setApiReady(true);
      }
    } catch (err) {
      setApiReady(false);
      setProspects(SICL_PROSPECTS_SEED);
      setErrorMsg(err?.message || 'Mode hors-ligne : données locales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  // Filtered prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter(p => {
      const matchAntenna = selectedAntennaCode === 'ALL'
        || p.provinceCode === selectedAntennaCode
        || p.antenneId === selectedAntennaCode
        || String(p.antenneId || '').startsWith(selectedAntennaCode);
      const matchStatus = selectedStatus === 'ALL' || p.statut === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch = searchQuery === '' || 
        (p.nomStructure || '').toLowerCase().includes(q) ||
        (p.code || '').toLowerCase().includes(q) ||
        (p.localite || '').toLowerCase().includes(q) ||
        (p.contactNom || '').toLowerCase().includes(q);
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
  const handleSaveProspect = async (newProspect) => {
    if (apiReady) {
      try {
        const saved = await createProspect({
          ...newProspect,
          commercialAssignee: activePersona?.nom || newProspect.commercialAssignee,
        });
        setProspects((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
        return;
      } catch (err) {
        setErrorMsg(err?.message || 'Enregistrement API impossible — sauvegarde locale.');
      }
    }
    setProspects((prev) => [newProspect, ...prev]);
  };

  const handleSaveVisit = async (prospectId, newVisit, newStatus) => {
    if (apiReady) {
      try {
        const updated = await addProspectVisit(prospectId, newVisit, newStatus);
        setProspects((prev) => prev.map((p) => (p.id === prospectId ? updated : p)));
        return;
      } catch (err) {
        setErrorMsg(err?.message || 'Visite non synchronisée — mise à jour locale.');
      }
    }
    setProspects((prev) => prev.map((p) => {
      if (p.id === prospectId) {
        return {
          ...p,
          statut: newStatus,
          dateDerniereVisite: newVisit.date,
          joursDepuisVisite: 0,
          isDormant: false,
          historiqueVisites: [newVisit, ...(p.historiqueVisites || [])],
        };
      }
      return p;
    }));
  };

  const handleConvertToClient = async (prospect) => {
    if (apiReady) {
      try {
        const updated = await convertProspect(prospect.id);
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? updated : p)));
        setConversionSuccessModal({
          prospectNom: updated.nomStructure,
          prospectCode: updated.code,
          clientCode: updated.clientConvertiId,
          province: updated.province,
        });
        return;
      } catch (err) {
        setErrorMsg(err?.message || 'Conversion API impossible — mode local.');
      }
    }
    const newClientCode = `CLIENT-${Date.now().toString().slice(-6)}`;
    setProspects((prev) => prev.map((p) => {
      if (p.id === prospect.id) {
        return { ...p, statut: 'CONVERTI', clientConvertiId: newClientCode };
      }
      return p;
    }));
    setConversionSuccessModal({
      prospectNom: prospect.nomStructure,
      prospectCode: prospect.code,
      clientCode: newClientCode,
      province: prospect.province,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header — neutre (sans gradient coloré) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-200">
                Module M2 &amp; M10 SICL
              </span>
              <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Géolocalisation &amp; Mobilité Terrain
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Prospection Commerciale &amp; Gestion des Tiers
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Fiches structures de santé codifiées <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded border border-slate-200">PROS_&lt;Antenne&gt;_&lt;NNN&gt;</code>, capture GPS, suivi des visites, détection des prospects dormants &amp; conversion automatique en client.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={chargerDonnees}
              className="px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-2"
              title="Actualiser depuis le référentiel"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button
              onClick={() => setIsNewProspectOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl border border-slate-900 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Prospect Terrain
            </button>
          </div>
        </div>
        {(errorMsg || apiReady) && (
          <p className="mt-3 text-[11px] text-slate-500">
            {apiReady ? 'Données synchronisées avec le référentiel commercial.' : errorMsg}
          </p>
        )}

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Total Prospects</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.total}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Devis en Cours</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.devisEnvoyes}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Convertis Clients</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.convertis}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Taux de Conversion</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.conversionRate}%</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-slate-400" /> Dormants (&gt;90j)
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.dormants}</p>
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
            <option value="ALL">Toutes les antennes</option>
            {antennes.map(ant => (
              <option key={ant.provinceCode || ant.code} value={ant.provinceCode || ant.code}>
                {(ant.provinceCode || ant.code)} — {ant.province || ant.nom}
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

      {/* Dormants Alert Banner (RG-M2-01) — neutre */}
      {kpis.dormants > 0 && selectedStatus === 'ALL' && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-bold">Règle de gestion RG-M2-01 : {kpis.dormants} prospect(s) dormant(s) sans visite depuis plus de 90 jours.</p>
              <p className="text-[11px] text-slate-500">Ces structures nécessitent une relance prioritaire du Responsable d&apos;Antenne ou du Commercial.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setProspects(prev => prev.filter(p => p.isDormant));
              setSelectedStatus('ALL');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg shrink-0"
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
            { id: 'CONTACTE', title: '2. En Cours de Visite', bg: 'bg-slate-50', headerBg: 'bg-slate-200 text-slate-800' },
            { id: 'DEVIS_ENVOYE', title: '3. Devis Soumis', bg: 'bg-slate-50', headerBg: 'bg-slate-200 text-slate-800' },
            { id: 'CONVERTI', title: '4. Convertis Clients', bg: 'bg-slate-50', headerBg: 'bg-slate-200 text-slate-800' }
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
                          prospect.isDormant ? 'border-slate-400 ring-1 ring-slate-300' : 'border-slate-200'
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
                              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
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
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                              <AlertTriangle className="w-3 h-3" /> Dormant ({prospect.joursDepuisVisite}j sans visite)
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Visité il y a {prospect.joursDepuisVisite}j
                            </span>
                          )}

                          {prospect.clientConvertiId && (
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              Client {prospect.clientConvertiId}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedProspectForVisit(prospect)}
                            className="text-[11px] font-semibold text-slate-700 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                          >
                            <Calendar className="w-3 h-3 text-slate-500" />
                            Enregistrer Visite
                          </button>

                          {prospect.statut !== 'CONVERTI' && (
                            <button
                              onClick={() => handleConvertToClient(prospect)}
                              className="text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-900 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
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
                          <span className="text-[10px] font-mono text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-bold border border-slate-200">
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
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                          <AlertTriangle className="w-3 h-3" /> Dormant ({prospect.joursDepuisVisite}j)
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">
                          {prospect.dateDerniereVisite} ({prospect.joursDepuisVisite}j)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {prospect.statut}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProspectForVisit(prospect)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                        >
                          Visite
                        </button>
                        {prospect.statut !== 'CONVERTI' && (
                          <button
                            onClick={() => handleConvertToClient(prospect)}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-all"
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
        currentAntennaCode={selectedAntennaCode === 'ALL' ? (antennes[0]?.provinceCode || 'G9') : selectedAntennaCode}
        antennes={antennes}
        structureTypes={typesStructures}
        structuresRef={structuresRef}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Conversion Réussie (RG-M2-02)
            </span>
            
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Nouveau Client Officiel OPN
            </h3>
            
            <p className="text-xs text-slate-600 mt-1">
              La structure <strong className="text-slate-900">{conversionSuccessModal.prospectNom}</strong> ({conversionSuccessModal.prospectCode}) a été transformée avec succès.
            </p>

            <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
              <p className="flex justify-between">
                <span className="text-slate-500">Code Client National :</span>
                <strong className="text-slate-800 font-mono text-sm">{conversionSuccessModal.clientCode}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Antenne de Rattachement :</span>
                <strong className="text-slate-800">{conversionSuccessModal.province}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Historique Prospection :</span>
                <span className="text-slate-700 font-semibold">Conservé &amp; Attaché</span>
              </p>
            </div>

            <button
              onClick={() => setConversionSuccessModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all"
            >
              Fermer &amp; Continuer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
