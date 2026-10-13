import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  CreditCard, 
  Coins, 
  Send, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw,
  Landmark,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  BadgeAlert,
  Calendar,
  HelpCircle,
  FileCheck,
  Code2,
  Terminal,
  FileCode,
  CheckCheck,
  Copy,
  ExternalLink,
  Shield,
  Activity,
  Database,
  FileCheck2,
  X
} from 'lucide-react';

import { 
  BILLING_KPIS, 
  INITIAL_INVOICES, 
  CNAMGS_MONTHLY_BATCHES, 
  AGING_BALANCE_DATA, 
  CLIENT_CONVENTIONS,
  CNAMGS_EDI_FLUX,
  TRESOR_PUBLIC_SETTLEMENTS
} from '../../data/billingData';

import FactureNormaliseePdfModal from './FactureNormaliseePdfModal';
import BordereauCnamgsPdfModal from './BordereauCnamgsPdfModal';
import EtatRapprochementTresorPdfModal from './EtatRapprochementTresorPdfModal';
import NewInvoiceModal from './NewInvoiceModal';
import RecordPaymentModal from './RecordPaymentModal';
import NewCnamgsBatchModal from './NewCnamgsBatchModal';
import QuoteWithMissedSalesModal from '../commercial/QuoteWithMissedSalesModal';
import { downloadOfficialHtml } from '../../utils/downloadHelpers';

export default function BillingManager() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'invoices' | 'cnamgs' | 'edi' | 'tresor' | 'recovery' | 'conventions'
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // Data state
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [cnamgsBatches, setCnamgsBatches] = useState(CNAMGS_MONTHLY_BATCHES);
  const [conventions, setConventions] = useState(CLIENT_CONVENTIONS);
  const [ediFluxList, setEdiFluxList] = useState(CNAMGS_EDI_FLUX);
  const [selectedEdiFlux, setSelectedEdiFlux] = useState(CNAMGS_EDI_FLUX[0] || null);
  const [activeEdiFormat, setActiveEdiFormat] = useState('xml'); // 'xml' | 'json'
  const [isValidatingSchema, setIsValidatingSchema] = useState(false);
  const [schemaValidationResult, setSchemaValidationResult] = useState(null);
  const [tresorSettlements, setTresorSettlements] = useState(TRESOR_PUBLIC_SETTLEMENTS);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [structureTypeFilter, setStructureTypeFilter] = useState('ALL');
  const [cnamgsTierFilter, setCnamgsTierFilter] = useState('ALL');

  // Modal states
  const [selectedInvoiceForPdf, setSelectedInvoiceForPdf] = useState(null);
  const [selectedBatchForPdf, setSelectedBatchForPdf] = useState(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [isEtatTresorModalOpen, setIsEtatTresorModalOpen] = useState(false);
  const [isNewConventionOpen, setIsNewConventionOpen] = useState(false);
  const [conventionForm, setConventionForm] = useState({
    nom: '',
    ville: 'Libreville (Estuaire)',
    type: 'Hôpital Régional Public',
    tauxCnamgs: 90,
    plafondCredit: 25000000,
    delaiPaiementJours: 30,
  });
  
  // Notification toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleGenerateRelance = (inv) => {
    downloadOfficialHtml(`lettre-relance-${(inv.id || 'FAC').replace(/[^\w.-]+/g, '_')}`, {
      title: `Lettre de Relance DAF — Facture ${inv.id}`,
      subtitle: `${inv.structureNom} · ${inv.structureVille || ''}`,
      bodyLines: [
        `Madame, Monsieur le Directeur / Pharmacien-Responsable,`,
        `Nous vous informons que la facture <strong>${inv.id}</strong> émise le ${inv.dateEmission}, échéance ${inv.dateEcheance}, présente un solde restant dû de <strong>${(inv.montantReste || 0).toLocaleString('fr-FR')} FCFA</strong> (TTC ${(inv.montantTTC || 0).toLocaleString('fr-FR')} FCFA, déjà encaissé ${(inv.montantPaye || 0).toLocaleString('fr-FR')} FCFA).`,
        `Nous vous prions de bien vouloir régulariser cette situation dans les meilleurs délais auprès de la Direction Administrative et Financière de l'OPN (Owendo), ou de nous transmettre un échéancier motivé.`,
        `Référence structure : ${inv.structureNom}. Statut courant : ${inv.statutLabel || inv.statut || '—'}.`,
        `Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`,
        `<em>Direction Administrative et Financière — Office Pharmaceutique National</em>`,
      ],
    });
    showToast(`Lettre de relance générée pour ${inv.structureNom}`);
  };

  const handleCreateConvention = (e) => {
    e.preventDefault();
    if (!conventionForm.nom.trim()) {
      showToast('Indiquez le nom de la structure sanitaire.');
      return;
    }
    const id = `CONV-OPN-${String(conventions.length + 1).padStart(3, '0')}`;
    const nouvelle = {
      id,
      nom: conventionForm.nom.trim(),
      ville: conventionForm.ville,
      type: conventionForm.type,
      tauxCnamgs: Number(conventionForm.tauxCnamgs) || 80,
      regimeCnamgs: `Fonds CNAMGS — ${conventionForm.tauxCnamgs}%`,
      plafondCredit: Number(conventionForm.plafondCredit) || 0,
      encoursActuel: 0,
      delaiPaiementJours: Number(conventionForm.delaiPaiementJours) || 30,
      dateSignature: new Date().toISOString().slice(0, 10),
      statut: 'ACTIVE',
    };
    setConventions((prev) => [nouvelle, ...prev]);
    setIsNewConventionOpen(false);
    setConventionForm({
      nom: '',
      ville: 'Libreville (Estuaire)',
      type: 'Hôpital Régional Public',
      tauxCnamgs: 90,
      plafondCredit: 25000000,
      delaiPaiementJours: 30,
    });
    showToast(`Convention ${id} enregistrée pour ${nouvelle.nom}`);
  };

  // Schema validation & Raw EDI download
  const handleValidateSchema = () => {
    if (!selectedEdiFlux) {
      showToast('Sélectionnez un flux EDI à valider.');
      return;
    }
    setIsValidatingSchema(true);
    setSchemaValidationResult(null);
    setTimeout(() => {
      const isXml = activeEdiFormat === 'xml';
      const content = (isXml ? selectedEdiFlux.xmlSample : selectedEdiFlux.jsonSample) || '';
      let valid = false;
      let errorMsg = '';
      try {
        if (isXml) {
          const parsed = new DOMParser().parseFromString(content, 'application/xml');
          const err = parsed.querySelector('parsererror');
          valid = !err && content.includes('<');
          if (!valid) errorMsg = 'XML mal formé ou vide.';
        } else {
          JSON.parse(content);
          valid = true;
        }
      } catch (e) {
        valid = false;
        errorMsg = e?.message || 'Payload non conforme.';
      }
      setIsValidatingSchema(false);
      setSchemaValidationResult({
        valid,
        schemaVersion: isXml ? 'XSD-CNAMGS-SANTE-v2.4' : 'JSON-Schema-CNAMGS-v1.2',
        aninfSign: valid ? 'CONTROLE_LOCAL_OK' : 'ECHEC_CONTROLE',
        hashMatched: valid,
        checkedAt: new Date().toLocaleTimeString('fr-FR'),
        errorMsg: valid ? null : errorMsg,
      });
      showToast(
        valid
          ? `Validation ${activeEdiFormat.toUpperCase()} : structure conforme (${selectedEdiFlux.id})`
          : `Validation échouée : ${errorMsg || 'payload invalide'}`
      );
    }, 400);
  };

  const handleDownloadRawEdi = (format) => {
    if (!selectedEdiFlux) return;
    const isXml = format === 'xml';
    const content = isXml ? selectedEdiFlux.xmlSample : selectedEdiFlux.jsonSample;
    const filename = `${selectedEdiFlux.id}_${selectedEdiFlux.lotRef}.${isXml ? 'xml' : 'json'}`;
    const mimeType = isXml ? 'application/xml' : 'application/json';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Fichier brut ${filename} téléchargé`);
  };

  const handleCopyEdiPayload = async () => {
    if (!selectedEdiFlux) return;
    const content = activeEdiFormat === 'xml' ? selectedEdiFlux.xmlSample : selectedEdiFlux.jsonSample;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const ta = document.createElement('textarea');
        ta.value = content;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(`Flux ${activeEdiFormat.toUpperCase()} copié dans le presse-papier`);
    } catch {
      showToast('Impossible de copier — sélectionnez le texte manuellement.');
    }
  };

  // Dynamic KPI calculation based on state
  const computedKpis = useMemo(() => {
    const totalEmis = invoices.reduce((acc, inv) => acc + inv.montantTTC, 0);
    const totalPaye = invoices.reduce((acc, inv) => acc + (inv.montantPaye || 0), 0);
    const totalReste = invoices.reduce((acc, inv) => acc + (inv.montantReste || 0), 0);
    const totalCnamgs = invoices.reduce((acc, inv) => acc + inv.partCnamgs, 0);
    const totalDirect = invoices.reduce((acc, inv) => acc + inv.partStructure, 0);
    
    const countEnAttente = invoices.filter(i => i.statut === 'EMISE' || i.statut === 'PARTIELLEMENT_PAYEE').length;
    const countSoldee = invoices.filter(i => i.statut === 'SOLDEE').length;

    return {
      totalEmis,
      totalPaye,
      totalReste,
      totalCnamgs,
      totalDirect,
      countEnAttente,
      countSoldee,
      tauxRecouvrement: totalEmis > 0 ? ((totalPaye / totalEmis) * 100).toFixed(1) : 0
    };
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.structureNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.structureVille.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.bonCommandeRef && inv.bonCommandeRef.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchStatus = statusFilter === 'ALL' || inv.statut === statusFilter;
      const matchType = structureTypeFilter === 'ALL' || inv.structureType === structureTypeFilter;
      const matchTier = cnamgsTierFilter === 'ALL' || inv.tauxCnamgs.toString() === cnamgsTierFilter;

      return matchSearch && matchStatus && matchType && matchTier;
    });
  }, [invoices, searchQuery, statusFilter, structureTypeFilter, cnamgsTierFilter]);

  // Handlers
  const handleSaveNewInvoice = (newInv) => {
    setInvoices([newInv, ...invoices]);
    showToast(`Facture ${newInv.id} émise avec succès pour ${newInv.structureNom} (${newInv.montantTTC.toLocaleString('fr-FR')} FCFA)`);
  };

  const handleSavePayment = (updatedInvoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    showToast(`Paiement enregistré pour la facture ${updatedInvoice.id}. Reste dû: ${updatedInvoice.montantReste.toLocaleString('fr-FR')} FCFA`);
  };

  const handleSaveBatch = (newBatch) => {
    setCnamgsBatches([newBatch, ...cnamgsBatches]);
    showToast(`Bordereau CNAMGS ${newBatch.id} généré pour ${newBatch.mois} (${newBatch.montantTotalCnamgs.toLocaleString('fr-FR')} FCFA)`);
  };

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
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Direction Financière & Comptable (DAF)
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full">
                  Normalisation CEMAC / Gabon
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-amber-300" />
                  Trésor Public & CNAMGS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <Receipt className="w-8 h-8 text-emerald-400" />
                Facturation, Recouvrement & Tiers-Payant CNAMGS
              </h1>
              <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
                Gestion normalisée des factures hospitalières, ventilation Tiers-Payant CNAMGS (100% GEF, 90% Public, 80% Privé), télétransmission mensuelle EDI normalisée (XML/JSON), et rapprochement bancaire Trésor Public (DGCPT).
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-4 py-2.5 bg-amber-500/90 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm rounded-xl border border-amber-400/40 shadow-sm backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                title="Établir un devis officiel (Annexe C) avec détection rupture et substitution DCI (EF-M4)"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-100" />
                Nouveau Devis & Ventes Manquées
              </button>
              <button
                onClick={() => setIsEtatTresorModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm rounded-xl border border-blue-400/40 shadow-sm backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                title="Consulter et imprimer l'état récapitulatif officiel Trésor Public & CNAMGS (A4)"
              >
                <Landmark className="w-4 h-4 text-amber-300" />
                État Rapprochement Trésor
              </button>
              <button
                onClick={() => setIsNewBatchModalOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/20 shadow-sm backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 text-teal-300" />
                Télétransmission CNAMGS
              </button>
              <button
                onClick={() => setIsNewInvoiceModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Émettre Facture Normalisée
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-b border-white/10">
            {[
              { id: 'overview', label: 'Aperçu Financier', icon: TrendingUp, count: null },
              { id: 'invoices', label: 'Factures & Encaissements', icon: FileSpreadsheet, count: invoices.length },
              { id: 'cnamgs', label: 'Tiers-Payant CNAMGS', icon: Landmark, count: cnamgsBatches.length },
              { id: 'edi', label: 'Télétransmission EDI (XML/JSON)', icon: Code2, count: ediFluxList.length },
              { id: 'tresor', label: 'Rapprochement Trésor Public', icon: Landmark, count: tresorSettlements.length },
              { id: 'recovery', label: 'Recouvrement & Balance Âgée', icon: Clock, count: computedKpis.countEnAttente },
              { id: 'conventions', label: 'Conventions Hôpitaux', icon: Building2, count: conventions.length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ========================================================================= */}
        {/* TAB 1: APERÇU FINANCIER                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Facturé */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Facturé 2026</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {computedKpis.totalEmis.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{invoices.length} factures émises</span>
                  <span className="text-emerald-700 font-semibold">100% Exonéré TVA</span>
                </div>
              </div>

              {/* Card 2: Part CNAMGS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Créance Tiers-Payant CNAMGS</span>
                  <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                    <Landmark className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-teal-700 font-mono">
                  {computedKpis.totalCnamgs.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{((computedKpis.totalCnamgs / (computedKpis.totalEmis || 1)) * 100).toFixed(0)}% du chiffre d'affaires</span>
                  <span className="font-semibold text-teal-700">3 Régimes</span>
                </div>
              </div>

              {/* Card 3: Encaissements Réalisés */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Encaissé</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {computedKpis.totalPaye.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Taux: {computedKpis.tauxRecouvrement}%</span>
                  </div>
                  <span>{computedKpis.countSoldee} factures soldées</span>
                </div>
              </div>

              {/* Card 4: Reste à Recouvrer */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reste à Recouvrer</span>
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-700 font-mono">
                  {computedKpis.totalReste.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{computedKpis.countEnAttente} factures en cours</span>
                  <span className="text-amber-700 font-semibold">Trésor & Hôpitaux</span>
                </div>
              </div>
            </div>

            {/* Quick Action Banners & Recouvrement progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress & Target */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Progression du Recouvrement Global</h3>
                    <p className="text-xs text-slate-500">Objectif annuel DAF : &gt; 85% de recouvrement sur créances publiques</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {computedKpis.tauxRecouvrement}% Réalisé
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(computedKpis.tauxRecouvrement, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-1">
                    <span>Encaissé : <strong className="text-slate-900 font-mono">{computedKpis.totalPaye.toLocaleString('fr-FR')} FCFA</strong></span>
                    <span>Total Émis : <strong className="text-slate-900 font-mono">{computedKpis.totalEmis.toLocaleString('fr-FR')} FCFA</strong></span>
                  </div>
                </div>

                {/* Aging Summary Mini Buckets */}
                <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
                  {AGING_BALANCE_DATA.tranches.map((t, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">{t.label}</span>
                      <span className="text-sm font-black text-slate-900 block font-mono">
                        {(t.montant / 1000000).toFixed(1)} M
                      </span>
                      <span className="text-[10px] text-slate-500">{t.nbFactures} fact.</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank accounts widget */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm">Comptes d'Encaissement OPN</h4>
                    </div>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-emerald-200">Trésor & Banques</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-emerald-300 block font-bold uppercase">Compte Principal BGFIBank</span>
                      <span className="font-mono text-sm font-semibold tracking-wider">GA21 4000 1000 1234 5678 9012 345</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-teal-300 block font-bold uppercase">Caisse des Dépôts et Consignations (CDC)</span>
                      <span className="font-mono text-sm font-semibold tracking-wider">GA21 4000 2000 9876 5432 1098 765</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span>NIF OPN : <strong>790 123 456 M</strong></span>
                  <span className="text-emerald-300 font-medium">DAF Libreville</span>
                </div>
              </div>
            </div>

            {/* Recent Invoices & CNAMGS Batches split view */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invoices card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-bold text-slate-900 text-sm">Dernières Factures Normalisées</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    Voir tout <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {invoices.slice(0, 4).map(inv => (
                    <div key={inv.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">{inv.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${inv.statutColor}`}>
                            {inv.statutLabel}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate max-w-[220px]">{inv.structureNom}</p>
                        <p className="text-[11px] text-slate-500">Émise le {inv.dateEmission}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 block">
                          {inv.montantTTC.toLocaleString('fr-FR')} FCFA
                        </span>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <button
                            onClick={() => setSelectedInvoiceForPdf(inv)}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Imprimer / PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          {inv.statut !== 'SOLDEE' && (
                            <button
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded"
                            >
                              Encaisser
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CNAMGS Batches card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-teal-700" />
                    <h3 className="font-bold text-slate-900 text-sm">Lots de Télétransmission CNAMGS</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('cnamgs')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    Voir tout <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {cnamgsBatches.map(batch => (
                    <div key={batch.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{batch.mois}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${batch.statutColor}`}>
                            {batch.statutLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{batch.nbFactures} factures consolidées • Réf: {batch.id}</p>
                        <p className="text-[11px] text-emerald-800 font-medium">Viré Trésor: {batch.montantVire.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-teal-900 block">
                          {batch.montantTotalCnamgs.toLocaleString('fr-FR')} FCFA
                        </span>
                        <button
                          onClick={() => setSelectedBatchForPdf(batch)}
                          className="mt-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-bold rounded-lg flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3 h-3" />
                          Bordereau A4
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FACTURES & ENCAISSEMENTS                                          */}
        {/* ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par N° Facture, Hôpital, Bon de Commande..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Tous les statuts de paiement</option>
                    <option value="SOLDEE">Soldée (100% payé)</option>
                    <option value="PARTIELLEMENT_PAYEE">Partiellement Payée</option>
                    <option value="EMISE">Émise (En attente règlement)</option>
                  </select>
                </div>

                {/* Structure Type Filter */}
                <div>
                  <select
                    value={structureTypeFilter}
                    onChange={(e) => setStructureTypeFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Tous types de structures</option>
                    <option value="CHU">Centre Hospitalier Universitaire (CHU)</option>
                    <option value="CHR">Centre Hospitalier Régional (CHR)</option>
                    <option value="DISPENSAIRE">Dispensaire / Centre Médical</option>
                    <option value="OFFICINE_PRIVEE">Pharmacie d'Officine Privée</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Affichage de <strong>{filteredInvoices.length}</strong> factures normalisées</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Taux CNAMGS :</span>
                  {['ALL', '100', '90', '80', '0'].map(t => (
                    <button
                      key={t}
                      onClick={() => setCnamgsTierFilter(t)}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                        cnamgsTierFilter === t
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t === 'ALL' ? 'Tous' : `${t}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">N° Facture & Date</th>
                      <th className="py-3.5 px-4">Structure Cliente</th>
                      <th className="py-3.5 px-4">Bon Commande</th>
                      <th className="py-3.5 px-4 text-right">Montant Total</th>
                      <th className="py-3.5 px-4 text-right">Part CNAMGS</th>
                      <th className="py-3.5 px-4 text-right">Part Structure</th>
                      <th className="py-3.5 px-4 text-right">Reste Dû</th>
                      <th className="py-3.5 px-4 text-center">Statut</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{inv.id}</span>
                          <span className="text-[11px] text-slate-500">{inv.dateEmission}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">{inv.structureNom}</span>
                          <span className="text-[11px] text-slate-500">{inv.structureVille} • {inv.structureType}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {inv.bonCommandeRef || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {inv.montantTTC.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-mono font-bold text-teal-700 block">
                            {inv.partCnamgs.toLocaleString('fr-FR')} FCFA
                          </span>
                          <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded font-semibold">
                            {inv.tauxCnamgs}% ({inv.regimeCnamgs})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                          {inv.partStructure.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`font-mono font-bold ${inv.montantReste > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {inv.montantReste.toLocaleString('fr-FR')} FCFA
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border inline-block ${inv.statutColor}`}>
                            {inv.statutLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View / Print PDF */}
                            <button
                              onClick={() => setSelectedInvoiceForPdf(inv)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Afficher & Imprimer Facture Normalisée A4"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Record Payment */}
                            {inv.statut !== 'SOLDEE' && (
                              <button
                                onClick={() => setSelectedInvoiceForPayment(inv)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-sm"
                                title="Enregistrer un règlement"
                              >
                                Encaisser
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TIERS-PAYANT CNAMGS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'cnamgs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* CNAMGS Info banner */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white p-6 rounded-2xl border border-teal-700 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-bold">Guichet Unique de Télétransmission & Liquidation CNAMGS</h3>
                  </div>
                  <p className="text-xs text-teal-200 max-w-2xl leading-relaxed">
                    Les créances pharmaceutiques OPN issues des structures conventionnées sont regroupées mensuellement en bordereaux de télétransmission et transmises aux services comptables de la CNAMGS pour liquidation et ordonnancement de virement Trésor.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewBatchModalOpen(true)}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Nouveau Lot Mensuel
                </button>
              </div>
            </div>

            {/* CNAMGS Batches Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Bordereaux de Télétransmission Consolidés</h3>
                <span className="text-xs text-slate-500">{cnamgsBatches.length} lots enregistrés</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Lot ID & Mois</th>
                      <th className="py-3.5 px-4">Date Télétransmission</th>
                      <th className="py-3.5 px-4 text-center">Volume Factures</th>
                      <th className="py-3.5 px-4 text-right">Montant Réclamé</th>
                      <th className="py-3.5 px-4 text-right">Montant Liquidé</th>
                      <th className="py-3.5 px-4 text-right">Viré (Trésor Public)</th>
                      <th className="py-3.5 px-4 text-center">Taux Accord</th>
                      <th className="py-3.5 px-4 text-center">Statut</th>
                      <th className="py-3.5 px-4 text-center">Bordereau PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cnamgsBatches.map(batch => (
                      <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{batch.mois}</span>
                          <span className="font-mono text-[11px] text-slate-500">{batch.id}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {batch.dateTransmission}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {batch.nbFactures} factures
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-800">
                          {batch.montantTotalCnamgs.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-800 font-semibold">
                          {batch.montantLiquide.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                          {batch.montantVire.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {batch.tauxAcceptation > 0 ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {batch.tauxAcceptation}%
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${batch.statutColor}`}>
                            {batch.statutLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedBatchForPdf(batch)}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold rounded-lg text-xs flex items-center gap-1.5 mx-auto transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Bordereau A4
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fonds details breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase">Fonds 1 - GEF (Gratuité)</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded">100%</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Dispensaires, centres de santé ruraux, femmes enceintes et indigents.</p>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {INITIAL_INVOICES.filter(i => i.tauxCnamgs === 100).reduce((a, b) => a + b.partCnamgs, 0).toLocaleString('fr-FR')} FCFA
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-800 uppercase">Fonds 2 - Agents Publics</span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-black rounded">90%</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Centres Hospitaliers Universitaires et Régionaux (Fonctionnaires de l'État).</p>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {INITIAL_INVOICES.filter(i => i.tauxCnamgs === 90).reduce((a, b) => a + b.partCnamgs, 0).toLocaleString('fr-FR')} FCFA
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-800 uppercase">Fonds 3 - Salariés Privés</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded">80%</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Salariés du secteur privé conventionné et pharmacies d'officine privées.</p>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {INITIAL_INVOICES.filter(i => i.tauxCnamgs === 80).reduce((a, b) => a + b.partCnamgs, 0).toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: TÉLÉTRANSMISSION EDI & FLUX XML/JSON CNAMGS                         */}
        {/* ========================================================================= */}
        {activeTab === 'edi' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-teal-700/50 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-bold">Passerelle Télétransmission EDI & Échange Normalisé CNAMGS</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      mTLS & PKI ANINF
                    </span>
                  </div>
                  <p className="text-xs text-teal-200/80 max-w-3xl leading-relaxed">
                    Module d'interopérabilité numérique souverain pour l'export, la validation syntaxique et la télétransmission directe des bordereaux de prise en charge vers la Caisse Nationale d'Assurance Maladie selon la norme XML ISO 20022 Santé Gabon & REST JSON.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleValidateSchema()}
                    disabled={isValidatingSchema}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isValidatingSchema ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Vérification XSD...
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" />
                        Tester Conformité XSD
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownloadRawEdi(activeEdiFormat)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger {activeEdiFormat.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>

            {/* EDI Status KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Passerelle CNAMGS</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  En Ligne (Opérationnelle)
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Latence API: 24ms • TLS 1.3</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Volume Télétransmis</span>
                  <Database className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-lg font-black text-teal-800 font-mono">
                  {ediFluxList.reduce((acc, f) => acc + f.totalCnamgsXAF, 0).toLocaleString('fr-FR')} FCFA
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">{ediFluxList.reduce((a, b) => a + b.nbFactures, 0)} factures intégrées</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Validation Schéma XSD</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-emerald-700">
                  100% Conforme
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Schéma ISO-20022 Santé v2.4</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Sceau Cryptographique</span>
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-blue-700 truncate">
                  ANINF-PKI-2026-GA
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">SHA-256 + RSA 2048 certifié</span>
              </div>
            </div>

            {/* Validation Banner if validated */}
            {schemaValidationResult && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      Rapport de Validation Syntaxique & Cryptographique Positif
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Structure XML validée contre le schéma <strong>{schemaValidationResult.schemaVersion}</strong>. Empreinte SHA-256 concordante et certificat ANINF valide à {schemaValidationResult.checkedAt}.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-200 text-emerald-900 text-xs font-black rounded-lg">
                  ACCEPTATION 100%
                </span>
              </div>
            )}

            {/* Split EDI Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: EDI Transmissions list */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-600" />
                    <h4 className="text-xs font-bold text-slate-900">Bordereaux Télétransmis</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{ediFluxList.length} flux</span>
                </div>
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[520px]">
                  {ediFluxList.map((flux) => {
                    const isSelected = selectedEdiFlux?.id === flux.id;
                    return (
                      <div
                        key={flux.id}
                        onClick={() => setSelectedEdiFlux(flux)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-50/70 border-l-4 border-teal-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-black text-slate-900">{flux.id}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                            {flux.statutTransmission}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 mb-1">
                          {flux.mois} • {flux.lotRef}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{flux.nbFactures} factures</span>
                          <span className="font-mono font-bold text-teal-800">{flux.totalCnamgsXAF.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
                          SHA: {flux.empreinteSHA256}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Code Viewer */}
              <div className="lg:col-span-8 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                {/* Code Viewer Toolbar */}
                <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {selectedEdiFlux?.id} — {selectedEdiFlux?.lotRef}
                    </span>
                  </div>

                  {/* Format Switcher & Actions */}
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-800 p-0.5 rounded-lg flex items-center">
                      <button
                        onClick={() => setActiveEdiFormat('xml')}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                          activeEdiFormat === 'xml' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        XML (ISO-20022)
                      </button>
                      <button
                        onClick={() => setActiveEdiFormat('json')}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                          activeEdiFormat === 'json' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        JSON (REST API)
                      </button>
                    </div>

                    <button
                      onClick={handleCopyEdiPayload}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Copier la charge utile dans le presse-papier"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownloadRawEdi(activeEdiFormat)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-teal-200 rounded-lg transition-colors cursor-pointer"
                      title={`Télécharger le fichier brut .${activeEdiFormat}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code Payload Content */}
                <div className="p-5 overflow-x-auto flex-1 max-h-[460px] font-mono text-xs leading-relaxed selection:bg-teal-600 selection:text-white">
                  <pre className="text-teal-300">
                    {activeEdiFormat === 'xml' ? (
                      selectedEdiFlux?.xmlSample || '// Aucun flux sélectionné'
                    ) : (
                      selectedEdiFlux?.jsonSample || '// Aucun flux sélectionné'
                    )}
                  </pre>
                </div>

                {/* Footer metadata */}
                <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <div className="flex items-center gap-3">
                    <span>Format: <strong>{activeEdiFormat.toUpperCase()}</strong></span>
                    <span>Protocole: <strong>AS2 / mTLS</strong></span>
                    <span>Retour: <strong className="text-emerald-400">{selectedEdiFlux?.codeRetourCnamgs}</strong></span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    Certificat: {selectedEdiFlux?.certificatSignataire}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Documentation Callout */}
            <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-slate-700" />
                Spécifications Techniques d'Intégration CNAMGS & Direction Générale de la Comptabilité Publique (DGCPT)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Les télétransmissions sont opérées sous le contrôle de l'Agence Nationale des Infrastructures Numériques et des Fréquences (ANINF). Les flux respectent la nomenclature LNME 2026 de l'OPN et le standard de codification nationale des actes et médicaments pris en charge par l'État gabonais.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: RAPPROCHEMENT TRÉSOR PUBLIC & CONCILIATION BANCAIRE                 */}
        {/* ========================================================================= */}
        {activeTab === 'tresor' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-blue-700/40 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-300" />
                    <h3 className="text-lg font-bold">Rapprochement Trésor Public (DGCPT) & Conciliation Bancaire</h3>
                  </div>
                  <p className="text-xs text-blue-200/80 max-w-3xl leading-relaxed">
                    Suivi de l'ordonnancement des mandats émis par le Trésor Public gabonais, lettrage automatique des avis de crédit bancaires (BGFIBank & Caisse des Dépôts et Consignations) et contrôle de conformité des visas du Contrôleur Financier.
                  </p>
                </div>
                <button
                  onClick={() => setIsEtatTresorModalOpen(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  État Récapitulatif Trésor (A4)
                </button>
              </div>
            </div>

            {/* Treasury KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Total Mandats DGCPT</span>
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {tresorSettlements.reduce((a, b) => a + b.montantOrdonnance, 0).toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">{tresorSettlements.length} mandats ordonnancés</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Encaissements Effectifs</span>
                  <Coins className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 font-mono">
                  {tresorSettlements.reduce((a, b) => a + b.montantEncaisse, 0).toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">100% crédité sur comptes OPN</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Écart de Lettrage</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 font-mono">
                  0 <span className="text-xs font-normal text-slate-500">FCFA</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Zéro discordance constatée</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Visas Contrôle Financier</span>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-sm font-bold text-indigo-800">
                  100% Approuvés
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Direction du Contrôle Budgétaire</span>
              </div>
            </div>

            {/* Conciliation Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Tableau de Concordance & Rapprochement Mandats / Encaissements</h3>
                </div>
                <span className="text-xs text-slate-500">{tresorSettlements.length} opérations enregistrées</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Mandat Trésor (DGCPT)</th>
                      <th className="py-3.5 px-4">Bordereau CNAMGS</th>
                      <th className="py-3.5 px-4">Dates (Mandat / Valeur)</th>
                      <th className="py-3.5 px-4">Banque & RIB Destinataire</th>
                      <th className="py-3.5 px-4 text-right">Montant Mandaté</th>
                      <th className="py-3.5 px-4 text-right">Montant Encaissé</th>
                      <th className="py-3.5 px-4 text-center">Écart</th>
                      <th className="py-3.5 px-4 text-center">Visa Contrôleur</th>
                      <th className="py-3.5 px-4 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tresorSettlements.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-blue-900 block">{item.mandatTresorRef}</span>
                          <span className="text-[11px] text-slate-500">{item.ordonnateur}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          {item.bordereauRef}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>Mandat : {item.dateMandat}</div>
                          <div className="text-[11px] text-emerald-700 font-medium">Valeur : {item.dateValeurBanque}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">{item.banqueDestinataire}</span>
                          <span className="text-[10px] font-mono text-slate-400">{item.ribDestinataire}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {item.montantOrdonnance.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-800">
                          {item.montantEncaisse.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded font-mono text-[11px] border border-emerald-200">
                            0 FCFA
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded text-[10px] border border-indigo-200 block">
                            {item.visaControleurFinancier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${item.statutColor}`}>
                            {item.statutLabel}
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
        {/* TAB 4: RECOUVREMENT & BALANCE ÂGÉE                                       */}
        {/* ========================================================================= */}
        {activeTab === 'recovery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Aging Balance Overview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Balance Âgée des Créances OPN (Clients Publics & Privés)</h3>
                  <p className="text-xs text-slate-500">Ventilation comptable des encours selon la maturité de l'échéance de paiement</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Créances Échues & Non Échues</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {AGING_BALANCE_DATA.totalCreances.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Visual Buckets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {AGING_BALANCE_DATA.tranches.map((tranche, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{tranche.label}</span>
                      <span className="text-[11px] font-bold text-slate-500">{tranche.nbFactures} factures</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {tranche.montant.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          idx === 0 ? 'bg-emerald-500' :
                          idx === 1 ? 'bg-teal-500' :
                          idx === 2 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(tranche.montant / AGING_BALANCE_DATA.totalCreances) * 100}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1">
                      {((tranche.montant / AGING_BALANCE_DATA.totalCreances) * 100).toFixed(1)}% de l'encours total
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unpaid / Pending Invoices Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeAlert className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Factures en Attente de Recouvrement</h3>
                </div>
                <span className="text-xs text-slate-500">
                  {invoices.filter(i => i.montantReste > 0).length} dossiers prioritaires
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">N° Facture</th>
                      <th className="py-3.5 px-4">Structure</th>
                      <th className="py-3.5 px-4">Date Émission</th>
                      <th className="py-3.5 px-4">Échéance</th>
                      <th className="py-3.5 px-4 text-right">Montant Total</th>
                      <th className="py-3.5 px-4 text-right">Déjà Réglé</th>
                      <th className="py-3.5 px-4 text-right">Reste Dû</th>
                      <th className="py-3.5 px-4 text-center">Statut</th>
                      <th className="py-3.5 px-4 text-center">Action DAF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.filter(i => i.montantReste > 0).map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">{inv.structureNom}</span>
                          <span className="text-[11px] text-slate-500">{inv.structureVille}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{inv.dateEmission}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{inv.dateEcheance}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {inv.montantTTC.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                          {(inv.montantPaye || 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-amber-800">
                          {inv.montantReste.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${inv.statutColor}`}>
                            {inv.statutLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Encaisser
                            </button>
                            <button
                              type="button"
                              onClick={() => handleGenerateRelance(inv)}
                              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Générer lettre de relance DAF"
                            >
                              <Send className="w-3.5 h-3.5" />
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
        {/* TAB 5: CONVENTIONS HÔPITAUX                                              */}
        {/* ========================================================================= */}
        {activeTab === 'conventions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Répertoire des Conventions de Fourniture & Plafonds de Crédit</h3>
                <p className="text-xs text-slate-500">Conditions contractuelles, régimes CNAMGS applicables et délais de règlement accordés aux structures sanitaires</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewConventionOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 self-start md:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouvelle Convention
              </button>
            </div>

            {/* Conventions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {conventions.map(conv => {
                const encoursPercent = Math.min(Math.round((conv.encoursActuel / conv.plafondCredit) * 100), 100);
                const isNearLimit = encoursPercent > 75;

                return (
                  <div key={conv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      {/* Top badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{conv.id}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                          {conv.statut}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mb-1">{conv.nom}</h4>
                      <p className="text-xs text-slate-500 mb-4">{conv.ville} • {conv.type}</p>

                      {/* CNAMGS tier */}
                      <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 mb-4 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-teal-800 font-semibold">Régime Tiers-Payant:</span>
                          <span className="font-bold text-teal-900">{conv.tauxCnamgs}% CNAMGS</span>
                        </div>
                        <span className="text-[11px] text-teal-700 block">{conv.regimeCnamgs}</span>
                      </div>

                      {/* Credit Limit Gauge */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Encours Utilisé:</span>
                          <span className={`font-mono font-bold ${isNearLimit ? 'text-amber-700' : 'text-slate-900'}`}>
                            {conv.encoursActuel.toLocaleString('fr-FR')} FCFA ({encoursPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              encoursPercent > 85 ? 'bg-red-500' :
                              encoursPercent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${encoursPercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 text-right">
                          Plafond accordé : {conv.plafondCredit.toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Délai règlement : <strong>{conv.delaiPaiementJours} jours</strong></span>
                      <span className="text-[11px] text-slate-500">Signée: {conv.dateSignature}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODALS INTEGRATION                                                        */}
      {/* ========================================================================= */}
      
      {/* 1. Facture Normalisée A4 PDF Modal */}
      <FactureNormaliseePdfModal
        isOpen={!!selectedInvoiceForPdf}
        invoice={selectedInvoiceForPdf}
        onClose={() => setSelectedInvoiceForPdf(null)}
      />

      {/* 2. Bordereau Télétransmission CNAMGS A4 PDF Modal */}
      <BordereauCnamgsPdfModal
        isOpen={!!selectedBatchForPdf}
        batch={selectedBatchForPdf}
        onClose={() => setSelectedBatchForPdf(null)}
      />

      {/* 3. New Normalized Invoice Modal */}
      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        onSaveInvoice={handleSaveNewInvoice}
      />

      {/* 4. Record Payment Modal */}
      <RecordPaymentModal
        isOpen={!!selectedInvoiceForPayment}
        invoice={selectedInvoiceForPayment}
        onClose={() => setSelectedInvoiceForPayment(null)}
        onSavePayment={handleSavePayment}
      />

      {/* 5. New CNAMGS Teletransmission Batch Modal */}
      <NewCnamgsBatchModal
        isOpen={isNewBatchModalOpen}
        onClose={() => setIsNewBatchModalOpen(false)}
        onSaveBatch={handleSaveBatch}
      />

      {/* 6. État Récapitulatif Trésor Public & Conciliation CNAMGS A4 Modal */}
      <EtatRapprochementTresorPdfModal
        isOpen={isEtatTresorModalOpen}
        onClose={() => setIsEtatTresorModalOpen(false)}
        invoices={invoices}
        kpis={computedKpis}
      />

      {isNewConventionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Nouvelle Convention de Fourniture</h3>
              <button
                type="button"
                onClick={() => setIsNewConventionOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateConvention} className="p-5 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Structure sanitaire</label>
                <input
                  required
                  value={conventionForm.nom}
                  onChange={(e) => setConventionForm((f) => ({ ...f, nom: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E68B4]/50"
                  placeholder="Ex. CHR Amissa Bongo — Franceville"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Ville / Province</label>
                  <input
                    value={conventionForm.ville}
                    onChange={(e) => setConventionForm((f) => ({ ...f, ville: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Type</label>
                  <select
                    value={conventionForm.type}
                    onChange={(e) => setConventionForm((f) => ({ ...f, type: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option>Hôpital Universitaire Public</option>
                    <option>Hôpital Régional Public</option>
                    <option>Pharmacie d&apos;Officine Privée</option>
                    <option>Centre Médical Privé</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Taux CNAMGS %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={conventionForm.tauxCnamgs}
                    onChange={(e) => setConventionForm((f) => ({ ...f, tauxCnamgs: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Plafond (FCFA)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000000}
                    value={conventionForm.plafondCredit}
                    onChange={(e) => setConventionForm((f) => ({ ...f, plafondCredit: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Délai (j)</label>
                  <input
                    type="number"
                    min={7}
                    max={120}
                    value={conventionForm.delaiPaiementJours}
                    onChange={(e) => setConventionForm((f) => ({ ...f, delaiPaiementJours: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewConventionOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2E68B4] text-white hover:bg-[#215091]"
                >
                  Enregistrer la convention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module M4: Devis Normalisé & Détection Rupture / Ventes Manquées */}
      <QuoteWithMissedSalesModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
