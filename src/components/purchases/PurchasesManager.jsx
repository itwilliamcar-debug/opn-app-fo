import React, { useState } from 'react';
import { 
  Globe, 
  ShoppingCart, 
  FileText, 
  Ship, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  Banknote, 
  TrendingUp, 
  CheckCheck, 
  ChevronRight,
  Anchor,
  Clock,
  Landmark,
  PackageCheck,
  Eye,
  FileCheck,
  Plane,
  Calculator,
  Percent,
  Receipt,
  BadgePercent,
  Coins,
  Scale
} from 'lucide-react';
import { 
  INTERNATIONAL_SUPPLIERS, 
  INTERNATIONAL_PURCHASE_ORDERS, 
  CURRENCY_RATES_TO_XAF 
} from '../../data/purchasesData';
import BonCommandeInternationalPdfModal from './BonCommandeInternationalPdfModal';
import DeclarationImportationPdfModal from './DeclarationImportationPdfModal';
import NewPurchaseOrderModal from './NewPurchaseOrderModal';
import CustomsClearanceModal from './CustomsClearanceModal';

export default function PurchasesManager({ activePersona, sanctumReady, onNavigateModule }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, documents, suppliers, shipping, simulator
  const [purchaseOrders, setPurchaseOrders] = useState(INTERNATIONAL_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useState(INTERNATIONAL_SUPPLIERS);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [supplierSearch, setSupplierSearch] = useState('');

  // Modals state
  const [selectedPoForPdf, setSelectedPoForPdf] = useState(null);
  const [selectedPoForDeclaration, setSelectedPoForDeclaration] = useState(null);
  const [selectedPoForCustoms, setSelectedPoForCustoms] = useState(null);
  const [newPoModalOpen, setNewPoModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Customs & Currency Simulator State
  const [simCurrency, setSimCurrency] = useState('EUR');
  const [simAmount, setSimAmount] = useState(150000);
  const [simIncoterm, setSimIncoterm] = useState('CIF_OWENDO');
  const [simContainerCount, setSimContainerCount] = useState(3);
  const [simStorageDays, setSimStorageDays] = useState(8);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Visa progression
  const handleAdvanceVisa = (orderId, step) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === orderId) {
          const updated = { ...po };
          const nowStr = new Date().toLocaleString('fr-FR');
          if (step === 'VISA_DIR') {
            updated.visaDir = {
              signataire: 'M. Pierre ONDO (Directeur Approvisionnements)',
              date: nowStr,
              statut: 'VALIDE',
              commentaire: 'Visa technique accordé.',
            };
            updated.statut = 'EN_VISA_DAF';
          } else if (step === 'VISA_DAF') {
            updated.visaDaf = {
              signataire: 'M. Eric BOULINGUI (Directeur Financier & Comptable)',
              date: nowStr,
              statut: 'VALIDE',
              commentaire: 'Visa engagement budgétaire et crédit documentaire BGFI Bank validé.',
            };
            updated.statut = 'EN_VISA_DG';
          } else if (step === 'VISA_DG') {
            updated.visaDg = {
              signataire: 'Dr. Jean-Claude MOUSSAVOU (Directeur Général OPN)',
              date: nowStr,
              statut: 'SIGNE',
              commentaire: 'Mandat d\'importation signé et exécutoire.',
            };
            updated.statut = 'EN_FABRICATION';
          }
          return updated;
        }
        return po;
      })
    );
    showToast(`Visa accordé avec succès pour la commande.`);
  };

  // Add new international order
  const handleSaveNewOrder = (newOrder) => {
    setPurchaseOrders([newOrder, ...purchaseOrders]);
    showToast(`Bon de Commande ${newOrder.numeroCommande} créé et transmis au circuit de visas !`);
  };

  // Confirm customs clearance
  const handleConfirmClearance = (clearanceData) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === clearanceData.orderId
          ? {
              ...po,
              statut: 'RECEPTIONNE_MAGASIN',
              shipping: {
                ...po.shipping,
                statutDouane: 'DÉDOUANEMENT_EFFECTUÉ_BAE',
                numeroSydonia: clearanceData.numeroSydonia,
                bonAEnleverBAE: clearanceData.bonAEnleverBAE,
              },
            }
          : po
      )
    );
    showToast(`Dédouanement validé pour le bon ${clearanceData.orderId}. Marchandises intégrées au Magasin Central Owendo !`);
  };

  // Filtered orders
  const displayedOrders = purchaseOrders.filter((po) => {
    const matchSearch = po.numeroCommande.toLowerCase().includes(orderSearch.toLowerCase()) ||
      po.fournisseurNom.toLowerCase().includes(orderSearch.toLowerCase()) ||
      po.fournisseurPays.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === 'ALL' || po.statut === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const displayedSuppliers = suppliers.filter((s) => {
    return s.nom.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.pays.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.type.toLowerCase().includes(supplierSearch.toLowerCase());
  });

  // KPIs
  const totalEngagementsXaf = purchaseOrders.reduce((acc, curr) => acc + (curr.montantTotalXaf || 0), 0);
  const commandesEnVisas = purchaseOrders.filter((po) => po.statut.includes('VISA')).length;
  const commandesEnTransit = purchaseOrders.filter((po) => po.statut === 'EN_TRANSIT_MARITIME' || po.statut === 'DEDOUANEMENT_OWENDO').length;
  const fournisseursActifs = suppliers.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#00A651] text-white px-4 py-3 rounded-lg shadow-2xl border border-emerald-300 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-xs font-bold">{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-white/80 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-32 h-32 bg-[#00A651]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Pôle Achats Internationaux & Laboratoires
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00A651]/20 border border-[#00A651]/40 text-[#00A651] text-[11px] font-bold">
                Devises : EUR • USD • XAF
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Achats, Marchés & Importations Pharmaceutiques
            </h1>
            
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
              <span>Bons de Commande Internationaux (BC)</span>
              <span>•</span>
              <span>Incoterms CIF Port d'Owendo</span>
              <span>•</span>
              <span>Visas DAF & Signatures DG</span>
              <span>•</span>
              <span>Dédouanement Sydonia</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedPoForDeclaration(purchaseOrders[0])}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all active:scale-95 cursor-pointer"
              title="Consulter et imprimer la Déclaration Prévisionnelle d'Importation & Franchise Douanière"
            >
              <Anchor className="w-4 h-4 text-amber-300" />
              <span>Déclaration Importation</span>
            </button>
            <button
              onClick={() => setNewPoModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouveau Bon de Commande (BC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A651] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Engagements Achats</span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {(totalEngagementsXaf / 1000000).toFixed(1)} M <span className="text-xs">XAF</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">{purchaseOrders.length} bons émis</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Circuit des Visas</span>
            <div className="text-lg font-black text-slate-900">{commandesEnVisas}</div>
            <span className="text-[10px] text-amber-700 font-bold">En instruction DIR/DAF/DG</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fret & Dédouanement</span>
            <div className="text-lg font-black text-slate-900">{commandesEnTransit}</div>
            <span className="text-[10px] text-cyan-800 font-semibold">En mer / Port d'Owendo</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Laboratoires Agréés</span>
            <div className="text-lg font-black text-slate-900">{fournisseursActifs}</div>
            <span className="text-[10px] text-purple-700 font-semibold">Pré-qualifiés OMS</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-sm overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tableau de Bord des Achats</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Bons de Commande Internationaux (BC)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
            {purchaseOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'documents'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bordereaux & Documents BC (PDF)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            {purchaseOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'shipping'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Anchor className="w-4 h-4" />
          <span>Suivi Maritime, Aérien & Douanes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-mono font-bold">
            {purchaseOrders.filter((po) => po.shipping).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'simulator'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Simulateur Dédouanement Owendo & Devises</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            GSEZ / Sydonia
          </span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'suppliers'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Laboratoires & Fournisseurs Agréés</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
            {suppliers.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Orders & Visa Pipeline */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Active Purchase Orders */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Commandes Internationales Récentes & Pipeline Visas
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#00A651] hover:underline flex items-center gap-1"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {purchaseOrders.slice(0, 4).map((po) => (
                    <div key={po.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900">{po.numeroCommande}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-xs text-slate-800">{po.fournisseurNom}</span>
                          <span className="text-slate-400 text-[11px]">({po.fournisseurPays})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {po.lignes?.length} articles • Incoterm : <strong className="text-slate-700">{po.incoterm}</strong> • ETA : {po.dateLivraisonPrevue}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-xs text-slate-900">
                            {po.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            po.statut === 'RECEPTIONNE_MAGASIN' ? 'bg-emerald-100 text-emerald-800' :
                            po.statut === 'DEDOUANEMENT_OWENDO' ? 'bg-cyan-100 text-cyan-800' :
                            po.statut === 'EN_TRANSIT_MARITIME' ? 'bg-blue-100 text-blue-800' :
                            po.statut.includes('VISA') ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {po.statut}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedPoForPdf(po)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>BC PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maritime Shipments Quick Overview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-cyan-700" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Cargaisons Maritimes & Aériennes en Transit</h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className="text-xs font-bold text-cyan-800 hover:underline flex items-center gap-1"
                  >
                    <span>Détails Fret</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchaseOrders.filter((po) => po.shipping).slice(0, 2).map((po) => (
                    <div key={po.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{po.shipping?.navire}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                          {po.shipping?.mode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {po.shipping?.portDepart} ➔ <strong className="text-slate-900">{po.shipping?.portArrivee}</strong>
                      </p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 text-slate-500">
                        <span>ETA : <strong className="text-slate-800">{po.shipping?.etaOwendo}</strong></span>
                        <span className="font-mono text-emerald-700 font-bold">{po.shipping?.connaissementBL}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Currency Rates & Top Suppliers */}
            <div className="space-y-6">
              
              {/* Currency Rates Box */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Cours des Devises (BEAC)</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Taux Officiel</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">1 Euro (EUR)</span>
                      <p className="text-[10px] text-slate-500">Parité fixe Zone Franc</p>
                    </div>
                    <span className="font-mono font-black text-[#00A651] text-sm">655.957 XAF</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">1 Dollar US (USD)</span>
                      <p className="text-[10px] text-slate-500">Taux indicatif interbancaire</p>
                    </div>
                    <span className="font-mono font-black text-blue-600 text-sm">605.50 XAF</span>
                  </div>
                </div>
              </div>

              {/* Top Qualified Laboratories */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Laboratoires Principaux</h4>
                  <span className="text-[10px] font-bold text-emerald-700">✓ Pré-qualifiés OMS</span>
                </div>

                <div className="space-y-2.5">
                  {suppliers.slice(0, 4).map((supp) => (
                    <div key={supp.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{supp.nom}</span>
                        <span className="font-mono text-[10px] font-bold text-slate-500">{supp.devisePref}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{supp.pays} • Délai : {supp.delaiMoyenJours}j • Note : ⭐ {supp.notationQualite}/5</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Purchase Orders List */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par N° commande, laboratoire, pays..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="EN_VISA_DIR">En visa DIR</option>
                <option value="EN_VISA_DAF">En visa DAF</option>
                <option value="EN_VISA_DG">En visa DG</option>
                <option value="EN_FABRICATION">En fabrication</option>
                <option value="EN_TRANSIT_MARITIME">En transit maritime</option>
                <option value="DEDOUANEMENT_OWENDO">En dédouanement</option>
                <option value="RECEPTIONNE_MAGASIN">Réceptionné magasin</option>
              </select>

              <button
                onClick={() => setNewPoModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau BC</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3">N° Commande</th>
                  <th className="py-3 px-3">Laboratoire Fabricant</th>
                  <th className="py-3 px-2 text-center">Incoterm</th>
                  <th className="py-3 px-2 text-center">Date Émission</th>
                  <th className="py-3 px-2 text-center">Date ETA</th>
                  <th className="py-3 px-3 text-right">Montant Devise</th>
                  <th className="py-3 px-3 text-right">Contrevaleur XAF</th>
                  <th className="py-3 px-2 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Actions & Visas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{po.numeroCommande}</div>
                      <div className="text-[10px] text-slate-500">{po.lignes?.length} références DCI</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{po.fournisseurNom}</div>
                      <div className="text-[10px] text-slate-500">{po.fournisseurPays} ({po.fournisseurCode})</div>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {po.incoterm.split(' ')[0]}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center text-slate-600 font-mono text-[11px]">{po.dateCommande}</td>
                    <td className="py-3 px-2 text-center text-slate-800 font-bold font-mono text-[11px]">{po.dateLivraisonPrevue}</td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {po.montantDevise?.toLocaleString('fr-FR')} {po.devise}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-black text-[#00A651]">
                      {po.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.statut === 'RECEPTIONNE_MAGASIN' ? 'bg-emerald-100 text-emerald-800' :
                        po.statut === 'DEDOUANEMENT_OWENDO' ? 'bg-cyan-100 text-cyan-800' :
                        po.statut === 'EN_TRANSIT_MARITIME' ? 'bg-blue-100 text-blue-800' :
                        po.statut.includes('VISA') ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {po.statut}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right space-x-1.5">
                      {po.statut === 'EN_VISA_DIR' && (
                        <button
                          onClick={() => handleAdvanceVisa(po.id, 'VISA_DIR')}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300"
                        >
                          Viser DIR
                        </button>
                      )}

                      {po.statut === 'EN_VISA_DAF' && (
                        <button
                          onClick={() => handleAdvanceVisa(po.id, 'VISA_DAF')}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[11px] border border-blue-300"
                        >
                          Viser DAF
                        </button>
                      )}

                      {po.statut === 'EN_VISA_DG' && (
                        <button
                          onClick={() => handleAdvanceVisa(po.id, 'VISA_DG')}
                          className="px-2.5 py-1 rounded bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-[11px]"
                        >
                          Signer DG
                        </button>
                      )}

                      {po.statut === 'DEDOUANEMENT_OWENDO' && (
                        <button
                          onClick={() => setSelectedPoForCustoms(po)}
                          className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[11px]"
                        >
                          Dédouaner Port
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedPoForPdf(po)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] inline-flex items-center gap-1"
                        title="Consulter le Bon de Commande Officiel"
                      >
                        <FileText className="w-3 h-3" />
                        <span>BC PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: BC Documents & PDFs */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Galerie des Bons de Commande Internationaux (BC)
              </h3>
              <p className="text-xs text-slate-500">Documents officiels prêts pour impression ou export PDF</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                      {po.numeroCommande}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {po.devise}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mt-2.5">{po.fournisseurNom}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{po.fournisseurPays} • {po.incoterm}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Émis le : <span className="font-semibold">{po.dateCommande}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Montant Total</span>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {po.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPoForPdf(po)}
                    className="px-3 py-1.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer / PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Suppliers & Laboratories Directory */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un laboratoire, pays, spécialité..."
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedSuppliers.map((supp) => (
              <div key={supp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {supp.codeFournisseur}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ Pré-qualifié OMS
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2">{supp.nom}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{supp.type}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Siège : <strong className="text-slate-700">{supp.siege}</strong></p>
                  <p className="text-[11px] text-slate-500">Contact : {supp.contactCommercial}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Agrément Gabon :</span>
                    <span className="font-mono font-bold text-emerald-700">{supp.agrementGabon}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Devise / Incoterm :</span>
                    <span className="font-bold text-slate-800">{supp.devisePref} • {supp.incotermHabituel}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Commandes OPN :</span>
                    <span className="font-bold text-slate-900">{supp.totalCommandesPassees} bons ({((supp.montantCumuleXaf || 0) / 1000000).toFixed(0)} M XAF)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 5: Maritime, Air & Customs Tracking */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Suivi du Fret Maritime / Aérien & Dédouanement Port d'Owendo
              </h3>
              <p className="text-xs text-slate-500">Traçabilité des conteneurs, navires, déclarations Sydonia et magasins</p>
            </div>
          </div>

          <div className="space-y-4">
            {purchaseOrders.filter((po) => po.shipping).map((po) => {
              const ship = po.shipping;
              return (
                <div key={po.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-cyan-900 bg-cyan-100 px-2.5 py-0.5 rounded border border-cyan-300">
                        {po.numeroCommande}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-xs text-slate-900">{ship.navire}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-700">{po.fournisseurNom}</span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Trajet : <span className="font-semibold text-slate-800">{ship.portDepart}</span> ➔ <strong className="text-slate-900">{ship.portArrivee}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      <span className="text-slate-500">Connaissement (BL/LTA) : <strong className="font-mono text-emerald-700">{ship.connaissementBL}</strong></span>
                      <span>•</span>
                      <span className="text-slate-500">Départ : <strong>{ship.dateDepart}</strong></span>
                      <span>•</span>
                      <span className="text-slate-500">ETA Owendo : <strong className="text-slate-900">{ship.etaOwendo}</strong></span>
                      <span>•</span>
                      <span className="text-slate-500">Fret : <strong>{ship.nombreConteneurs}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 shrink-0">
                    <div className="text-right text-xs">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-white border border-slate-200 block text-slate-700">
                        {ship.statutDouane}
                      </span>
                    </div>

                    {po.statut === 'RECEPTIONNE_MAGASIN' ? (
                      <span className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Entrée Magasin Central Validée</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedPoForCustoms(po)}
                        className="px-4 py-2.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                      >
                        <Anchor className="w-4 h-4" />
                        <span>Dédouaner & Entrée Magasin</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 6: Customs & Currency Landing Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl border border-blue-700/50 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold">Simulateur de Dédouanement Port d'Owendo & Couverture de Change</h3>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full">
                    Régime Spécial Santé 4000
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 max-w-3xl leading-relaxed">
                  Outil d'évaluation financière prévisionnelle des opérations d'importation : conversion multi-devises (EUR / USD / XAF), calcul des économies de franchise fiscale (TVA & Droits de douane) et simulation des frais de passage portuaire GSEZ Owendo.
                </p>
              </div>
              <button
                onClick={() => setSelectedPoForDeclaration(purchaseOrders[0])}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer"
              >
                <Anchor className="w-4 h-4 text-amber-300" />
                Déclaration d'Importation
              </button>
            </div>
          </div>

          {/* Simulator Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Interactive Simulator Inputs */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                Paramètres de la Commande Internationale
              </h4>

              {/* Devise & Montant */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Devise d'Achat</label>
                  <select
                    value={simCurrency}
                    onChange={(e) => setSimCurrency(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="EUR">Euro (€ EUR) — 655.957 XAF</option>
                    <option value="USD">Dollar US (USD) — 605.50 XAF</option>
                    <option value="INR">Roupie (₹ INR) — 7.30 XAF</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Montant Facture ({simCurrency})</label>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value) || 0)}
                    className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: 150000"
                  />
                </div>
              </div>

              {/* Incoterm & Volume Conteneurs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Incoterm Négocié</label>
                  <select
                    value={simIncoterm}
                    onChange={(e) => setSimIncoterm(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CIF_OWENDO">CIF Port d'Owendo (Recommandé)</option>
                    <option value="FOB_ORIGIN">FOB Port d'Origine (+ Fret)</option>
                    <option value="CIP_AERIEN">CIP Aéroport Léon Mba (Aérien)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre Conteneurs (40ft HC)</label>
                  <input
                    type="number"
                    value={simContainerCount}
                    onChange={(e) => setSimContainerCount(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              {/* Durée Séjour au Port */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Séjour Terminal Owendo (Jours)</span>
                  <span className="text-emerald-700">{simStorageDays} jours (Franchise OPN : 14 jours gratuits)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={simStorageDays}
                  onChange={(e) => setSimStorageDays(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Parités Officielles BEAC */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Cours Indicatifs de Référence (BEAC / CEMAC) :</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block">EUR / XAF</span>
                    <strong className="text-slate-900 font-mono">655.957</strong>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block">USD / XAF</span>
                    <strong className="text-slate-900 font-mono">605.500</strong>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block">INR / XAF</span>
                    <strong className="text-slate-900 font-mono">7.300</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Simulation Results & Fiscal Benefits */}
            {(() => {
              const rate = simCurrency === 'EUR' ? 655.957 : simCurrency === 'USD' ? 605.50 : 7.30;
              const valeurCifXaf = Math.round(simAmount * rate);
              const economieDouane = Math.round(valeurCifXaf * 0.10);
              const economieTva = Math.round(valeurCifXaf * 0.18);
              const gainTotalFranchise = economieDouane + economieTva;
              const fraisGsez = Math.round(simContainerCount * 380000);
              const surestaries = simStorageDays > 14 ? (simStorageDays - 14) * simContainerCount * 45000 : 0;
              const assuranceMaritime = Math.round(valeurCifXaf * 0.004);
              const coutTotalDebarque = valeurCifXaf + fraisGsez + surestaries + assuranceMaritime;

              return (
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Big Total Card */}
                  <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-700/60 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase">Valeur Débarquée Estimée (Port d'Owendo)</span>
                      <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 text-[10px] font-black rounded-full border border-emerald-400/30">
                        {simIncoterm.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {coutTotalDebarque.toLocaleString('fr-FR')} <span className="text-sm font-normal text-emerald-300">FCFA</span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-200/80 flex items-center justify-between pt-2 border-t border-emerald-800/60">
                      <span>Équivalent Devise : {simAmount.toLocaleString('fr-FR')} {simCurrency}</span>
                      <span>Taux appliqué : {rate} XAF</span>
                    </div>
                  </div>

                  {/* Savings highlight */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-600 text-white rounded-xl">
                        <BadgePercent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">
                          Économie de franchise douanière (Régime Santé 4000)
                        </h4>
                        <p className="text-[11px] text-emerald-800">
                          Droits de Douane 0% ({economieDouane.toLocaleString('fr-FR')} FCFA) + TVA 0% ({economieTva.toLocaleString('fr-FR')} FCFA)
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono font-black text-emerald-900 text-sm">
                      + {gainTotalFranchise.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>

                  {/* Cost Breakdown Table */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5">
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Décomposition Prévisionnelle des Coûts</span>
                      <span className="text-[10px] text-slate-400 font-normal">Terminal GSEZ Owendo</span>
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Marchandise CIF (Valeur Déclarée) :</span>
                        <span className="font-mono font-bold text-slate-900">{valeurCifXaf.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Frais Acconage & Manutention GSEZ ({simContainerCount} conteneurs) :</span>
                        <span className="font-mono font-semibold text-slate-800">{fraisGsez.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Assurance Maritime et Terrestre OPN (0.4%) :</span>
                        <span className="font-mono font-semibold text-slate-800">{assuranceMaritime.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Frais de Surestaries & Gardiennage :</span>
                        <span className={`font-mono font-bold ${surestaries > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {surestaries > 0 ? `${surestaries.toLocaleString('fr-FR')} FCFA (Dépassement)` : '0 FCFA (Dans la franchise)'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Printable BC PDF Modal */}
      <BonCommandeInternationalPdfModal
        isOpen={Boolean(selectedPoForPdf)}
        onClose={() => setSelectedPoForPdf(null)}
        purchaseOrder={selectedPoForPdf}
      />

      {/* Printable Declaration Importation A4 PDF Modal */}
      <DeclarationImportationPdfModal
        isOpen={Boolean(selectedPoForDeclaration)}
        onClose={() => setSelectedPoForDeclaration(null)}
        purchaseOrder={selectedPoForDeclaration}
      />

      {/* New Purchase Order Modal */}
      <NewPurchaseOrderModal
        isOpen={newPoModalOpen}
        onClose={() => setNewPoModalOpen(false)}
        suppliers={suppliers}
        onSaveOrder={handleSaveNewOrder}
      />

      {/* Customs Clearance Modal */}
      <CustomsClearanceModal
        isOpen={Boolean(selectedPoForCustoms)}
        onClose={() => setSelectedPoForCustoms(null)}
        purchaseOrder={selectedPoForCustoms}
        onConfirmClearance={handleConfirmClearance}
      />

    </div>
  );
}
