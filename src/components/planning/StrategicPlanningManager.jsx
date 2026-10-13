import React, { useState } from 'react';
import {
  TrendingUp,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Layers,
  FileText,
  Coins,
  Plus,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Package,
  Activity,
  Siren,
  Sliders,
  BarChart3,
  Flame
} from 'lucide-react';

import {
  STRATEGIC_KPIS,
  PROGRAMMES_SANTE_PUBLIQUE,
  PREDICTIVE_STOCK_WATCHLIST,
  RESERVES_STRATEGIQUES_ETAT,
  PLANS_APPROVISIONNEMENT_ANNUELS
} from '../../data/strategicPlanningData';

import PlanDirecteurApprovisionnementPdfModal from './PlanDirecteurApprovisionnementPdfModal';
import DeclarationDestockageUrgencePdfModal from './DeclarationDestockageUrgencePdfModal';
import NewStrategicPlanModal from './NewStrategicPlanModal';
import NewDestockageUrgenceModal from './NewDestockageUrgenceModal';

export default function StrategicPlanningManager({ activePersona, sanctumReady, onNavigateModule }) {
  const [activeTab, setActiveTab] = useState('apercu'); // apercu | plan_directeur | cmm_modele | ruptures_predictives | reserves_etat

  // State data
  const [plans, setPlans] = useState(PLANS_APPROVISIONNEMENT_ANNUELS);
  const [watchlist, setWatchlist] = useState(PREDICTIVE_STOCK_WATCHLIST);
  const [reserves, setReserves] = useState(RESERVES_STRATEGIQUES_ETAT);
  const [destockagesList, setDestockagesList] = useState([]);
  
  // Interactive CMM Simulator state
  const [simSelectedDci, setSimSelectedDci] = useState(PREDICTIVE_STOCK_WATCHLIST[0].id);
  const [simCoeffSaison, setSimCoeffSaison] = useState(1.45);
  const [simMoisSecurite, setSimMoisSecurite] = useState(4.0);
  const [simSearchQuery, setSimSearchQuery] = useState('');

  // Modals state
  const [selectedPlanForPdf, setSelectedPlanForPdf] = useState(null);
  const [selectedDestockageForPdf, setSelectedDestockageForPdf] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDestockageModalOpen, setIsDestockageModalOpen] = useState(false);

  const currentSimMed = watchlist.find(m => m.id === simSelectedDci) || watchlist[0];
  const simCmmCalculee = Math.round(currentSimMed.cmmStandard * simCoeffSaison);
  const simStockSecuriteUnites = Math.round(simCmmCalculee * simMoisSecurite);
  const simStockCibleTotal = simStockSecuriteUnites + (simCmmCalculee * 2); // 2 mois de roulement
  const simBesoinReassort = Math.max(0, simStockCibleTotal - currentSimMed.stockTotalNational);
  const simCoutReassortXaf = simBesoinReassort * currentSimMed.valeurUnitaireXaf;

  // Handlers
  const handlePlanCreated = (newP) => {
    setPlans([newP, ...plans]);
    setSelectedPlanForPdf(newP);
  };

  const handleDestockageCreated = (newD) => {
    setDestockagesList([newD, ...destockagesList]);
    setSelectedDestockageForPdf(newD);
  };

  const handleDirectPasserCommande = (med) => {
    if (onNavigateModule) {
      onNavigateModule('purchases');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Institutionnel Planification Stratégique */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009E49] to-[#2E68B4] flex items-center justify-center text-white shadow-md shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Gouvernance thérapeutique
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#2E68B4] border border-blue-200">
                  Horizon 6 à 24 Mois • Réserves d'État
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Planification Stratégique des Besoins Nationaux, Modélisation CMM & Réserves d'Urgence
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Budgétisation pluriannuelle, modélisation épidémiologique de la CMM, anticipation des ruptures et gestion des stocks inviolables d'État.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsDestockageModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Siren className="w-4 h-4 text-rose-700" />
              <span>Déstockage Urgence Crise</span>
            </button>

            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E68B4] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Actualiser Plan Directeur PNA</span>
            </button>
          </div>
        </div>

        {/* 5 Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'apercu', label: 'Aperçu Stratégique & Horizon', icon: Layers, badge: `${STRATEGIC_KPIS.autonomieNationaleMoyenneMois} Mois` },
            { id: 'plan_directeur', label: 'Plan Directeur Annuel (PNA)', icon: Coins, badge: '18.5 Mrd XAF' },
            { id: 'cmm_modele', label: 'Modélisation CMM & Saisonnalité', icon: Calculator, badge: 'Simulateur' },
            { id: 'ruptures_predictives', label: 'Détecteur Prédictif de Ruptures', icon: AlertTriangle, count: watchlist.filter(w => w.statutAlerte.includes('CRITIQUE') || w.statutAlerte.includes('ATTENTION')).length },
            { id: 'reserves_etat', label: 'Réserves Stratégiques d\'État (RSSE)', icon: ShieldCheck, count: reserves.length },
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
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    tab.count > 0 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ONGLET 1 : APERÇU STRATÉGIQUE & HORIZON NATIONAL */}
      {/* ========================================================================= */}
      {activeTab === 'apercu' && (
        <div className="space-y-6">
          
          {/* 4 KPIs Clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Budget Prévisionnel Annuel</span>
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Coins className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">18,50 Mrd FCFA</span>
                <span className="text-[11px] font-bold text-emerald-700">100% Voté</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Engagé : 13,87 Mrd FCFA (75.0% exécution)
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Autonomie Moyenne Hub</span>
                <span className="p-2 bg-blue-100 text-[#2E68B4] rounded-lg">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{STRATEGIC_KPIS.autonomieNationaleMoyenneMois} Mois</span>
                <span className="text-[11px] font-bold text-emerald-700">Sécurité &gt; 3 mois</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                320 DCI sous surveillance continue
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Réserves Stratégiques d'État</span>
                <span className="p-2 bg-purple-100 text-purple-800 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">2,85 Mrd FCFA</span>
                <span className="text-[11px] font-bold text-purple-700">Inviolable</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                4 Réserves de crise (Palu, Choléra, Mpox, Sérums)
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Vigilance Réassort & Ruptures</span>
                <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-800">{STRATEGIC_KPIS.alertesRupture30Jours} DCI</span>
                <span className="text-[11px] font-bold text-amber-900">Sous 30 jours</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                + 9 DCI en alerte sous 60 jours
              </p>
            </div>

          </div>

          {/* Grille des 5 Programmes Nationaux de Santé Publique */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Ventilation Stratégique des 5 Programmes Nationaux de Santé Publique
                </h3>
                <p className="text-xs text-slate-500">
                  Suivi de la consommation budgétaire et sécurisation des approvisionnements par axe thérapeutique.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Période 2026-2027
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROGRAMMES_SANTE_PUBLIQUE.map((prog) => (
                <div key={prog.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">
                        {prog.id}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {prog.tauxExecution}% exécuté
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {prog.nom}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{prog.responsable}</p>

                    <div className="space-y-1.5 mt-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Enveloppe Votée :</span>
                        <span className="font-bold text-slate-900 font-mono">{(prog.enveloppeAnnuelleXaf / 1000000).toFixed(1)} M FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Montant Engagé :</span>
                        <span className="font-semibold text-emerald-700 font-mono">{(prog.engageXaf / 1000000).toFixed(1)} M FCFA</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Médicaments Stratégiques :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {prog.medicamentsCles.map((m, mIdx) => (
                          <span key={mIdx} className="text-[9.5px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 italic">
                    {prog.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bandeau d'Action Rapide de Réassort */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-yellow-300" />
                Passation Automatisée des Commandes d'Approvisionnement
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Les besoins prédictifs calculés par la CMM peuvent être directement convertis en Dossiers d'Appel d'Offres et Bons de Commande Fournisseurs (Module 2 Achats).
              </p>
            </div>
            <button
              onClick={() => handleDirectPasserCommande()}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-extrabold shadow-sm transition-colors cursor-pointer shrink-0"
            >
              Ouvrir Module 2 Achats →
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 2 : PLAN DIRECTEUR ANNUEL D'APPROVISIONNEMENT (PNA) */}
      {/* ========================================================================= */}
      {activeTab === 'plan_directeur' && (
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Plan Directeur Annuel d'Approvisionnement (PNA 2026-2027)
              </h3>
              <p className="text-xs text-slate-500">
                Document cadre pluriannuel validé par le Ministère de la Santé et la Direction Générale OPN.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPlanForPdf(plans[0])}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Plan Directeur PNA</span>
              </button>

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Actualiser Budget</span>
              </button>
            </div>
          </div>

          {/* Grille Tranches Trimestrielles */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">
              Calendrier d'Engagement & Découpage Trimestriel des Marchés
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans[0]?.tranches?.map((tr, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{tr.trimestre}</span>
                    <span className="font-mono font-black text-sm text-slate-900 block mt-1">
                      {tr.montantPrevuXaf.toLocaleString()} FCFA
                    </span>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                      <span>Exécuté :</span>
                      <span className="font-mono font-bold text-emerald-700">{tr.montantExecuteXaf.toLocaleString()} XAF</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">Statut :</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {tr.statut.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 3 : MODÉLISATION CMM & SAISONNALITÉ */}
      {/* ========================================================================= */}
      {activeTab === 'cmm_modele' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne Gauche : Paramètres & Simulateur */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Simulateur CMM & Stocks Tampons</h3>
                    <p className="text-[11px] text-slate-500">Modélisation avec coefficient saisonnier</p>
                  </div>
                </div>

                {/* Sélecteur Médicament */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Médicament à Modéliser</label>
                  <select
                    value={simSelectedDci}
                    onChange={(e) => setSimSelectedDci(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {watchlist.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.designation} ({m.forme})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Curseur Coefficient Saison des Pluies */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Facteur Saisonnier (Pluies / Palu)</label>
                    <span className="font-mono font-bold text-emerald-700 text-xs">x {simCoeffSaison.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.8"
                    step="0.05"
                    value={simCoeffSaison}
                    onChange={(e) => setSimCoeffSaison(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>1.00 (Saison Sèche)</span>
                    <span>1.45 (Pic Pluies)</span>
                    <span>1.80 (Épidémie)</span>
                  </div>
                </div>

                {/* Curseur Mois de Sécurité */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Stock Tampon de Sécurité Cible</label>
                    <span className="font-mono font-bold text-blue-700 text-xs">{simMoisSecurite.toFixed(1)} Mois</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="6.0"
                    step="0.5"
                    value={simMoisSecurite}
                    onChange={(e) => setSimMoisSecurite(Number(e.target.value))}
                    className="w-full accent-[#2E68B4]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>2.0 mois (Min)</span>
                    <span>4.0 mois (Standard)</span>
                    <span>6.0 mois (Sécurité Max)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Colonne Droite : Résultats de la Modélisation */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Résultats de la Projection : {currentSimMed.designation}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Code DCI : {currentSimMed.codeDci} • Prix unitaire : {currentSimMed.valeurUnitaireXaf.toLocaleString()} FCFA</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                    simBesoinReassort > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {simBesoinReassort > 0 ? 'Réassort recommandé' : 'Stock conforme'}
                  </span>
                </div>

                {/* 4 Cartes de métriques simulées */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">CMM Ajustée</span>
                    <span className="text-sm font-black text-slate-900 font-mono mt-1 block">
                      {simCmmCalculee.toLocaleString()} u./mois
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">(Base : {currentSimMed.cmmStandard.toLocaleString()})</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Stock Tampon Sécurité</span>
                    <span className="text-sm font-black text-blue-700 font-mono mt-1 block">
                      {simStockSecuriteUnites.toLocaleString()} u.
                    </span>
                    <span className="text-[9px] text-blue-600 font-mono">{simMoisSecurite} mois de CMM</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Stock Total Existant</span>
                    <span className="text-sm font-black text-emerald-700 font-mono mt-1 block">
                      {currentSimMed.stockTotalNational.toLocaleString()} u.
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Hub + 9 Antennes</span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">Quantité à Commander</span>
                    <span className="text-sm font-black text-amber-900 font-mono mt-1 block">
                      {simBesoinReassort.toLocaleString()} u.
                    </span>
                    <span className="text-[9px] font-bold text-amber-800 font-mono">
                      Coût : {(simCoutReassortXaf / 1000000).toFixed(2)} M FCFA
                    </span>
                  </div>
                </div>

                {/* Explication Métier OPN */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-snug">
                  <p className="font-bold text-slate-900 mb-1">Formule Réglementaire de Calcul du Besoin Annuel :</p>
                  <p className="font-mono text-[11px] text-emerald-800 bg-white p-2 rounded border border-slate-200">
                    Besoin Réassort = [Stock Cible Sécurité ({simMoisSecurite} mois CMM) + 2 mois Roulement] - Stock National Disponible
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 4 : DÉTECTEUR PRÉDICTIF DE RUPTURES */}
      {/* ========================================================================= */}
      {activeTab === 'ruptures_predictives' && (
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Surveillance Prédictive des Stocks & Dates d'Épuisement (Runout Date)
              </h3>
              <p className="text-xs text-slate-500">
                Détection automatique des seuils d'alerte à 30, 60 et 90 jours pour déclencher les commandes avant rupture.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              {watchlist.length} DCI Stratégiques Sous Monitoring
            </span>
          </div>

          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {item.codeDci}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.statutAlerte === 'CRITIQUE_RUPTURE_IMMINENTE' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                        item.statutAlerte === 'ATTENTION_COMMANDE_REQUISE' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.statutAlerte.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.programme}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {item.designation} ({item.forme})
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Stock National</span>
                        <span className="font-mono font-bold text-slate-900">{item.stockTotalNational.toLocaleString()} u.</span>
                        <p className="text-[10px] text-slate-500">Hub : {item.stockActuelHubOwendo.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">CMM Ajustée</span>
                        <span className="font-mono font-bold text-slate-900">{item.cmmAjustee.toLocaleString()} u./mois</span>
                        <p className="text-[10px] text-slate-500">Coeff : x{item.coeffSaisonPluie}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Autonomie Estimée</span>
                        <span className={`font-mono font-bold ${item.autonomieMois <= 2.5 ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {item.autonomieMois} Mois
                        </span>
                        <p className="text-[10px] text-slate-500">Seuil alerte : {item.seuilAlerteMois} m.</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Date Épuisement</span>
                        <span className="font-mono font-bold text-slate-900">{item.dateEpuisementTheorique}</span>
                        <p className="text-[10px] text-emerald-700 font-semibold">Sans réassort</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-700 font-medium mt-2">
                      <b>Recommandation OPN :</b> {item.recommandation}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-4">
                    <button
                      onClick={() => handleDirectPasserCommande(item)}
                      className="w-full lg:w-44 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Créer BC Achats</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 5 : RÉSERVES STRATÉGIQUES D'ÉTAT & RIPOSTE */}
      {/* ========================================================================= */}
      {activeTab === 'reserves_etat' && (
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Réserves Stratégiques Sanitaires d'État (RSSE Inviolables)
              </h3>
              <p className="text-xs text-slate-500">
                Stocks de crise immédiatement mobilisables sous arrêté ministériel ou coordination COD.
              </p>
            </div>

            <button
              onClick={() => setIsDestockageModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Siren className="w-4 h-4" />
              <span>Déclencher Déstockage d'Urgence</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reserves.map((res) => (
              <div key={res.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-900 rounded border border-purple-200">
                      {res.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      Valeur : {res.valeurEstimeeXaf.toLocaleString()} FCFA
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{res.intitule}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{res.localisation}</p>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Composition Réservée & Stock Mobilisé :</span>
                    <ul className="space-y-1">
                      {res.composition.map((c, cIdx) => (
                        <li key={cIdx} className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-100">
                          <span className="font-medium text-slate-800">{c.dci}</span>
                          <span className="font-mono font-bold text-purple-900">
                            {c.quantiteReservee.toLocaleString()} {c.uom}
                            {c.quantiteMobilisee > 0 && (
                              <span className="text-rose-700 ml-1">({c.quantiteMobilisee.toLocaleString()} mobilisés)</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] text-slate-500 italic">Statut légal : Inviolable (Décret OPN)</span>
                  <button
                    onClick={() => {
                      const mobilisationData = {
                        id: res.id,
                        reference: `OPN-DESTOCK-${res.code}-2026`,
                        motif: `Déclaration de Mobilisation — ${res.intitule}`,
                        natureCrise: 'Alerte Sanitaire COD Niveau 2',
                        provincesCibles: 'Toutes Régions Sanitaires',
                        dateHeure: new Date().toLocaleDateString('fr-FR'),
                        reserveConcernee: res.intitule,
                        lignes: res.composition.map(c => ({
                          dci: c.dci,
                          quantiteReservee: c.quantiteReservee,
                          quantiteDestockee: Math.round(c.quantiteReservee * 0.2),
                          quantiteResiduelle: Math.round(c.quantiteReservee * 0.8),
                          uom: c.uom
                        }))
                      };
                      setSelectedDestockageForPdf(mobilisationData);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>Déclaration de Déstockage</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALES PDF ET CRÉATION */}
      {/* ========================================================================= */}
      
      {/* Plan Directeur PNA Modal */}
      <PlanDirecteurApprovisionnementPdfModal
        isOpen={Boolean(selectedPlanForPdf)}
        onClose={() => setSelectedPlanForPdf(null)}
        plan={selectedPlanForPdf}
      />

      {/* Déclaration Déstockage Urgence A4 Modal */}
      <DeclarationDestockageUrgencePdfModal
        isOpen={Boolean(selectedDestockageForPdf)}
        onClose={() => setSelectedDestockageForPdf(null)}
        destockage={selectedDestockageForPdf}
      />

      {/* New Strategic Plan Modal */}
      <NewStrategicPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      {/* New Destockage Urgence Modal */}
      <NewDestockageUrgenceModal
        isOpen={isDestockageModalOpen}
        onClose={() => setIsDestockageModalOpen(false)}
        onDestockageCreated={handleDestockageCreated}
      />

    </div>
  );
}
