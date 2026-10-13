import React, { useState } from 'react';
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  FileText, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  QrCode, 
  ThermometerSnowflake, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  ArrowRight,
  Boxes,
  CheckCheck,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Activity,
  ArrowRightLeft,
  Scale
} from 'lucide-react';
import { 
  GABON_PROVINCIAL_ANTENNAS, 
  REGIONAL_HEALTH_STRUCTURES, 
  PROVINCIAL_ORDERS_SEED, 
  PROVINCIAL_STOCK_INVENTORY, 
  INCOMING_NATIONAL_CONVOYS 
} from '../../data/provincialAntennaData';
import BordereauLivraisonProvincialPdfModal from './BordereauLivraisonProvincialPdfModal';
import BordereauTransfertInterAntennesPdfModal from './BordereauTransfertInterAntennesPdfModal';
import PvReceptionConvoiModal from './PvReceptionConvoiModal';
import NewLocalOrderModal from './NewLocalOrderModal';

export default function ProvincialAntennaManager({ activePersona, sanctumReady, onNavigateModule }) {
  // Determine initial province based on persona or default to Haut-Ogooué (G2)
  const defaultAntenna = GABON_PROVINCIAL_ANTENNAS.find(
    (a) => a.provinceCode === (activePersona?.province || 'G2')
  ) || GABON_PROVINCIAL_ANTENNAS[0];

  const [selectedProvinceCode, setSelectedProvinceCode] = useState(defaultAntenna.provinceCode);
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, delivery_notes, stocks, incoming_convoys, transfers
  
  // State data
  const [orders, setOrders] = useState(PROVINCIAL_ORDERS_SEED);
  const [stockItems, setStockItems] = useState(PROVINCIAL_STOCK_INVENTORY);
  const [incomingConvoys, setIncomingConvoys] = useState(INCOMING_NATIONAL_CONVOYS);
  const [selectedTransferForPdf, setSelectedTransferForPdf] = useState(null);

  // Inter-antenna transfers state
  const [interAntennaTransfers, setInterAntennaTransfers] = useState([
    {
      id: "TRF-INTER-2026-001",
      date: "2026-09-16",
      source: "Antenne G1 - Estuaire (Hub Central Owendo)",
      destination: "Antenne G6 - Ogooué-Ivindo (Makokou)",
      pharmacienSource: "Dr. Guy-Roger MBA (Pharmacien Régional G1)",
      pharmacienDest: "Dr. Clarisse OBAME (Pharmacienne Régionale G6)",
      motif: "Péréquation d'urgence suite à hausse de cas de paludisme",
      vecteur: "Convoi Frigorifique Tout-Terrain 4x4",
      temperature: "+2°C à +8°C",
      statut: "EN_COURS_ACHEMINEMENT",
      statutColor: "bg-blue-100 text-blue-800",
      nbArticles: 5,
      totalXaf: 18438000
    },
    {
      id: "TRF-INTER-2026-002",
      date: "2026-09-12",
      source: "Antenne G2 - Haut-Ogooué (Franceville)",
      destination: "Antenne G7 - Ogooué-Lolo (Koula-Moutou)",
      pharmacienSource: "Dr. Paul MENGUE (Pharmacien Régional G2)",
      pharmacienDest: "Dr. Jean-Hervé KOUMBA (Pharmacien Régional G7)",
      motif: "Cession antibiotiques injectables et solutés massifs",
      vecteur: "Véhicule Isuzu 4x4 Antenne G2",
      temperature: "+15°C à +25°C",
      statut: "RECEPTIONNE_CONFORME",
      statutColor: "bg-emerald-100 text-emerald-800",
      nbArticles: 4,
      totalXaf: 9450000
    }
  ]);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('ALL');

  // Modals state
  const [selectedOrderForBl, setSelectedOrderForBl] = useState(null);
  const [selectedConvoiForPv, setSelectedConvoiForPv] = useState(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const currentAntenna = GABON_PROVINCIAL_ANTENNAS.find((a) => a.provinceCode === selectedProvinceCode) || defaultAntenna;

  // Filtered lists for current province
  const currentProvinceOrders = orders.filter((o) => o.provinceCode === selectedProvinceCode);
  const currentProvinceStocks = stockItems.filter((s) => s.provinceCode === selectedProvinceCode);
  const currentProvinceConvoys = incomingConvoys.filter((c) => c.provinceCode === selectedProvinceCode);

  const displayedOrders = currentProvinceOrders.filter((o) => {
    const matchSearch = o.codeCommande.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.structureNom.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.ville.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === 'ALL' || o.statut === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const displayedStocks = currentProvinceStocks.filter((s) => {
    const matchSearch = s.designation.toLowerCase().includes(stockSearch.toLowerCase()) ||
      s.codeDci.includes(stockSearch);
    const matchCat = stockCategoryFilter === 'ALL' || s.categorie === stockCategoryFilter;
    return matchSearch && matchCat;
  });

  const categories = Array.from(new Set(currentProvinceStocks.map((s) => s.categorie)));

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Order workflow transitions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const isNowReady = newStatus === 'PRETE_LIVRAISON' || newStatus === 'LIVREE';
          const blCode = o.codeBlAssocie || (isNowReady ? `BL-${selectedProvinceCode}-2026-${o.codeCommande.slice(-4)}` : null);
          return {
            ...o,
            statut: newStatus,
            codeBlAssocie: blCode,
            lignes: o.lignes.map((l) => ({
              ...l,
              quantiteAllouee: isNowReady ? (l.quantiteAllouee || l.quantiteDemandee) : l.quantiteAllouee,
              quantiteLivree: newStatus === 'LIVREE' ? (l.quantiteLivree || l.quantiteAllouee || l.quantiteDemandee) : l.quantiteLivree,
            })),
          };
        }
        return o;
      })
    );
    showToast(`Statut de la commande mis à jour sur : ${newStatus}`);
  };

  // Add new order
  const handleSaveNewOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
    showToast(`Commande ${newOrder.codeCommande} enregistrée avec succès pour ${newOrder.structureNom} !`);
  };

  // Confirm convoy arrival
  const handleConfirmConvoyReception = (receptionData) => {
    setIncomingConvoys((prev) =>
      prev.map((c) =>
        c.id === receptionData.convoiId ? { ...c, statut: receptionData.statut, pvData: receptionData } : c
      )
    );

    // Auto increment stock
    const convoi = incomingConvoys.find((c) => c.id === receptionData.convoiId);
    if (convoi && convoi.lotsContenus) {
      setStockItems((prev) =>
        prev.map((item) => {
          const matchedLot = convoi.lotsContenus.find((l) => l.codeDci === item.codeDci);
          if (matchedLot) {
            const addedQty = matchedLot.quantite;
            return {
              ...item,
              stockPhysique: item.stockPhysique + addedQty,
              stockDisponible: item.stockDisponible + addedQty,
              lots: [
                ...item.lots,
                {
                  numeroLot: matchedLot.lot,
                  dateFabrication: '2026-02-01',
                  datePeremption: '2028-12-31',
                  quantite: addedQty,
                  emplacement: 'Arrivage Réceptionné Owendo',
                  laboratoire: 'Hub Central OPN Owendo',
                  statutQualite: 'CONFORME_LIBERE',
                },
              ],
            };
          }
          return item;
        })
      );
    }

    showToast(`PV de réception validé pour le convoi ${receptionData.convoiCode}. Stock mis à jour !`);
  };

  // Stock quick adjustment
  const handleQuickAdjustStock = (stockId, addedQty) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === stockId) {
          const newPhysique = Math.max(0, item.stockPhysique + addedQty);
          const newDispo = Math.max(0, item.stockDisponible + addedQty);
          return {
            ...item,
            stockPhysique: newPhysique,
            stockDisponible: newDispo,
          };
        }
        return item;
      })
    );
    showToast('Inventaire ajusté avec succès.');
  };

  // KPIs
  const totalCommandes = currentProvinceOrders.length;
  const commandesPretesOuLivrees = currentProvinceOrders.filter((o) => o.statut === 'PRETE_LIVRAISON' || o.statut === 'LIVREE').length;
  const commandesEnAttente = currentProvinceOrders.filter((o) => o.statut === 'RECUE' || o.statut === 'VALIDEE' || o.statut === 'EN_PREPARATION').length;
  const convoisEnApproche = currentProvinceConvoys.filter((c) => c.statut === 'EN_TRANSIT' || c.statut === 'EN_APPROCHE').length;
  const articlesSousSeuil = currentProvinceStocks.filter((s) => s.stockDisponible <= s.seuilAlerteMin).length;

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

      {/* Top Banner & Province Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00A651]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00A651]/20 border border-[#00A651]/40 text-[#00A651] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Pôle Provincial OPN
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                {currentAntenna.chambreFroideStatut}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentAntenna.nom || `Antenne Provinciale de ${currentAntenna.ville}`}
            </h1>
            
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>Chef-lieu : <strong className="text-white">{currentAntenna.chefLieu}</strong></span>
              <span>•</span>
              <span>Responsable : <strong className="text-white">{currentAntenna.responsable}</strong> ({currentAntenna.titreResponsable})</span>
              <span>•</span>
              <span>Ligne directe : <strong className="text-emerald-400">{currentAntenna.contact}</strong></span>
            </p>
          </div>

          {/* Province Switcher & Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-600/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Changer d'Antenne</label>
                <select
                  value={selectedProvinceCode}
                  onChange={(e) => setSelectedProvinceCode(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {GABON_PROVINCIAL_ANTENNAS.map((ant) => (
                    <option key={ant.id} value={ant.provinceCode} className="bg-slate-900 text-white">
                      {ant.province} — {ant.ville}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('transfers')}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Péréquation Inter-Antennes</span>
            </button>

            <button
              onClick={() => setNewOrderModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouvelle Commande</span>
            </button>

            {currentProvinceConvoys.some((c) => c.statut === 'EN_TRANSIT' || c.statut === 'EN_APPROCHE') && (
              <button
                onClick={() => {
                  const targetConv = currentProvinceConvoys.find((c) => c.statut === 'EN_TRANSIT' || c.statut === 'EN_APPROCHE') || currentProvinceConvoys[0];
                  setSelectedConvoiForPv(targetConv);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Réceptionner Convoi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A651] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Taux de Service</span>
            <div className="text-lg font-black text-slate-900">{currentAntenna.tauxService}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Approvisionnement continu</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Valeur Stock Local</span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {(currentAntenna.valeurStockXaf / 1000000).toFixed(1)} M <span className="text-xs">XAF</span>
            </div>
            <span className="text-[10px] text-slate-500">{currentAntenna.couvertureMois} mois autonomie</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Commandes Locales</span>
            <div className="text-lg font-black text-slate-900">{totalCommandes}</div>
            <span className="text-[10px] text-amber-700 font-bold">{commandesEnAttente} en cours de traitement</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Arrivages Owendo</span>
            <div className="text-lg font-black text-slate-900">{currentProvinceConvoys.length}</div>
            <span className="text-[10px] text-purple-700 font-bold">{convoisEnApproche} en approche</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
            articlesSousSeuil > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Alertes Seuil Min</span>
            <div className={`text-lg font-black ${articlesSousSeuil > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {articlesSousSeuil}
            </div>
            <span className="text-[10px] text-slate-500">{articlesSousSeuil > 0 ? 'Réappro requis' : 'Stock nominal'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-sm overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Tableau de Bord & Activité</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Commandes Formations Sanitaires</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
            {currentProvinceOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('delivery_notes')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'delivery_notes'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bordereaux de Livraison (BL)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            {currentProvinceOrders.filter((o) => o.codeBlAssocie).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stocks')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'stocks'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stocks Locaux & FEFO</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
            {currentProvinceStocks.length} DCI
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incoming_convoys')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'incoming_convoys'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Arrivages Convois (Owendo)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono font-bold">
            {currentProvinceConvoys.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'transfers'
              ? 'border-[#00A651] text-[#00A651]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Péréquation Inter-Antennes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
            {interAntennaTransfers.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Activity Feed */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Dernières Commandes des Formations Sanitaires ({currentAntenna.ville})
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
                  {currentProvinceOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">{order.codeCommande}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-xs text-slate-800">{order.structureNom}</span>
                          {order.priorite === 'URGENTE' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                              Urgente
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {order.lignes?.length} références • Demandé par {order.demandeurNom} • Souhaité le {order.dateSouhaitee}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-xs text-slate-900">
                            {order.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.statut === 'LIVREE' ? 'bg-emerald-100 text-emerald-800' :
                            order.statut === 'PRETE_LIVRAISON' ? 'bg-blue-100 text-blue-800' :
                            order.statut === 'VALIDEE' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.statut === 'PRETE_LIVRAISON' ? 'Prête (BL émis)' : order.statut}
                          </span>
                        </div>

                        {order.codeBlAssocie ? (
                          <button
                            onClick={() => setSelectedOrderForBl(order)}
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200"
                            title="Voir Bordereau de Livraison (BL)"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>BL</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'PRETE_LIVRAISON')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                          >
                            Émettre BL
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incoming Convoys from Owendo */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Arrivages Réapprovisionnement en transit depuis Owendo
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('incoming_convoys')}
                    className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <span>Voir tout</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {currentProvinceConvoys.map((conv) => (
                    <div key={conv.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">{conv.convoiCode}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-700 font-semibold">{conv.modeTransport}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {conv.nombreColis} colis ({conv.tonnageKg} kg) • Chauffeur : {conv.chefConvoi}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                            <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                            {conv.temperatureSonde}
                          </span>
                        </div>

                        {conv.statut === 'RECEPTIONNE_CONFORME' ? (
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Réceptionné
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedConvoiForPv(conv)}
                            className="px-3 py-1.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>PV Réception</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Antenna Identity & Cold Chain Status */}
            <div className="space-y-6">
              
              {/* Cold Room & Infrastructure */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Chambre Froide Antenne</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    En Ligne (IoT)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200 text-center">
                  <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">Température Relevée en continu</span>
                  <div className="text-2xl font-black text-cyan-950 font-mono mt-1">3.8 °C</div>
                  <p className="text-[10px] text-cyan-700 mt-1">Sonde calibrée conforme OMS (2°C – 8°C)</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Capacité de Stockage :</span>
                    <span className="font-bold text-slate-800">{currentAntenna.capaciteStockM3} m³</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Structures Rattachées :</span>
                    <span className="font-bold text-slate-800">{currentAntenna.structuresCount} formations</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Autonomie en Stock :</span>
                    <span className="font-bold text-emerald-700">{currentAntenna.couvertureMois} mois</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Délai Navette Owendo :</span>
                    <span className="font-bold text-slate-800">48h à 72h max</span>
                  </div>
                </div>
              </div>

              {/* Health Facilities List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Structures Sanitaires Desservies</h4>
                  <span className="text-[10px] font-bold text-slate-400">Province {selectedProvinceCode}</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {REGIONAL_HEALTH_STRUCTURES.filter((s) => s.provinceCode === selectedProvinceCode).map((str) => (
                    <div key={str.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900">{str.nom}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                        <span>{str.type} • {str.ville}</span>
                        <span className="font-mono text-emerald-700 font-bold">{str.cnamgsConvention}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Orders List & Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par N° commande, structure sanitaire, ville..."
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
                <option value="RECUE">Reçue (À valider)</option>
                <option value="VALIDEE">Validée Pharma</option>
                <option value="PRETE_LIVRAISON">Prête à livrer (BL émis)</option>
                <option value="LIVREE">Livrée & Émargée</option>
              </select>

              <button
                onClick={() => setNewOrderModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Commande</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3">N° Commande</th>
                  <th className="py-3 px-3">Structure Sanitaire</th>
                  <th className="py-3 px-2 text-center">Priorité</th>
                  <th className="py-3 px-2 text-center">Date Dde</th>
                  <th className="py-3 px-2 text-center">Souhaitée</th>
                  <th className="py-3 px-3 text-right">Montant XAF</th>
                  <th className="py-3 px-2 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Actions & BL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{order.codeCommande}</div>
                      {order.codeBlAssocie && (
                        <div className="text-[10px] font-mono text-emerald-700 font-semibold">{order.codeBlAssocie}</div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{order.structureNom}</div>
                      <div className="text-[10px] text-slate-500">{order.structureType} • {order.ville}</div>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.priorite === 'URGENCE_VITALE' ? 'bg-rose-100 text-rose-800' :
                        order.priorite === 'URGENTE' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.priorite}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center text-slate-600 font-mono text-[11px]">{order.dateCommande}</td>
                    <td className="py-3 px-2 text-center text-slate-800 font-bold font-mono text-[11px]">{order.dateSouhaitee}</td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {order.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.statut === 'LIVREE' ? 'bg-emerald-100 text-emerald-800' :
                        order.statut === 'PRETE_LIVRAISON' ? 'bg-blue-100 text-blue-800' :
                        order.statut === 'VALIDEE' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.statut === 'PRETE_LIVRAISON' ? 'Prête (BL)' : order.statut}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right space-x-1.5">
                      {order.statut === 'RECUE' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'VALIDEE')}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300"
                        >
                          Valider Pharma
                        </button>
                      )}

                      {(order.statut === 'VALIDEE' || order.statut === 'RECUE') && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'PRETE_LIVRAISON')}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px]"
                        >
                          Émettre BL
                        </button>
                      )}

                      {order.statut === 'PRETE_LIVRAISON' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'LIVREE')}
                          className="px-2.5 py-1 rounded bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-[11px]"
                        >
                          Confirmer Livraison
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrderForBl(order)}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 inline-flex items-center gap-1"
                        title="Consulter ou imprimer le Bordereau de Livraison"
                      >
                        <FileText className="w-3 h-3" />
                        <span>BL PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 3: Delivery Notes (BL) */}
      {activeTab === 'delivery_notes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Registre des Bordereaux de Livraison (BL) Provinciaux
              </h3>
              <p className="text-xs text-slate-500">Documents officiels A4 avec QR Code de décharge numérique et visas</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
              Antenne {currentAntenna.province}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProvinceOrders.filter((o) => o.codeBlAssocie || o.statut === 'PRETE_LIVRAISON' || o.statut === 'LIVREE').map((order) => {
              const blCode = order.codeBlAssocie || `BL-${selectedProvinceCode}-2026-${order.codeCommande.slice(-4)}`;
              return (
                <div key={order.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {blCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.statut === 'LIVREE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.statut === 'LIVREE' ? 'Émargé & Livré' : 'En transit local'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs mt-2.5">{order.structureNom}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{order.structureType} • {order.ville}</p>
                    <p className="text-[11px] text-slate-600 mt-1">Réf : <span className="font-mono font-semibold">{order.codeCommande}</span></p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Montant BL</span>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {order.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrderForBl(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimer / PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Stock & FEFO Inventory */}
      {activeTab === 'stocks' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          
          {/* Stock Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par DCI, lot, indication..."
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={stockCategoryFilter}
                onChange={(e) => setStockCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="ALL">Toutes les familles</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Code DCI</th>
                  <th className="py-3 px-3">Désignation & Forme</th>
                  <th className="py-3 px-2 text-center">N° Lot & Péremption</th>
                  <th className="py-3 px-2 text-right">Physique</th>
                  <th className="py-3 px-2 text-right">Réservé</th>
                  <th className="py-3 px-2 text-right">Disponible</th>
                  <th className="py-3 px-2 text-center">Seuil Min</th>
                  <th className="py-3 px-3 text-right">P.U. (XAF)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStocks.map((item) => {
                  const isLow = item.stockDisponible <= item.seuilAlerteMin;
                  const firstLot = item.lots?.[0] || {};
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.codeDci}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{item.designation}</span>
                          {item.chaineFroid && (
                            <span className="text-cyan-600" title="Chaîne du Froid 2°C-8°C">Froid</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.forme} • {item.categorie}</div>
                      </td>

                      <td className="py-3 px-2 text-center">
                        <div className="font-mono font-bold text-[10px] text-slate-800">{firstLot.numeroLot || '—'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Exp : {firstLot.datePeremption || '—'}</div>
                      </td>

                      <td className="py-3 px-2 text-right font-mono font-semibold text-slate-800">{item.stockPhysique}</td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500">{item.stockReserve}</td>
                      <td className={`py-3 px-2 text-right font-mono font-black ${isLow ? 'text-rose-600' : 'text-[#00A651]'}`}>
                        {item.stockDisponible}
                      </td>

                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isLow ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.seuilAlerteMin}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-900 font-bold">
                        {item.prixUnitaireXaf?.toLocaleString('fr-FR')}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleQuickAdjustStock(item.id, 50)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                            title="Ajout stock inventaire"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleQuickAdjustStock(item.id, -10)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                            title="Sortie stock"
                          >
                            -10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Incoming National Convoys */}
      {activeTab === 'incoming_convoys' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Suivi des Convois & Réapprovisionnements Nationaux
              </h3>
              <p className="text-xs text-slate-500">Expéditions parties du Hub Central d'Owendo à destination de l'antenne</p>
            </div>
          </div>

          <div className="space-y-4">
            {currentProvinceConvoys.map((conv) => (
              <div key={conv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                      {conv.convoiCode}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-xs text-slate-800">{conv.modeTransport}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">{conv.blNationalCode}</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Départ : <span className="font-semibold text-slate-900">{conv.dateDepart}</span> • Arrivée prévue : <span className="font-semibold text-slate-900">{conv.dateArriveePrevue}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    <span className="text-slate-500">Colis : <strong>{conv.nombreColis} colis ({conv.tonnageKg} kg)</strong></span>
                    <span>•</span>
                    <span className="text-slate-500">Chauffeur : <strong>{conv.chefConvoi}</strong> ({conv.contactChefConvoi})</span>
                    <span>•</span>
                    <span className="text-slate-500">Valeur Fret : <strong>{conv.valeurMarchandiseXaf?.toLocaleString('fr-FR')} XAF</strong></span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-1.5">
                    <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
                    <span>Sonde : {conv.temperatureSonde} (OK)</span>
                  </div>

                  {conv.statut === 'RECEPTIONNE_CONFORME' ? (
                    <span className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PV Réceptionné & Signé</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedConvoiForPv(conv)}
                      className="px-4 py-2.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Établir PV de Réception</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Inter-Antenna Equalization Transfers */}
      {activeTab === 'transfers' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase">
                    Dispositif National de Régulation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                    Péréquation Inter-Régionale
                  </span>
                </div>
                <h2 className="text-xl font-black">
                  Péréquation & Équilibrage des Stocks Inter-Antennes
                </h2>
                <p className="text-xs text-blue-200/80 max-w-2xl">
                  Transferts régulés de stocks de sécurité entre les 9 provinces gabonaises. Évite les ruptures locales lors de flambées épidémiques saisonnières sans attendre les réapprovisionnements internationaux.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const sampleTransfer = {
                      id: `TRF-INTER-2026-${Math.floor(100 + Math.random() * 900)}`,
                      date: new Date().toISOString().split('T')[0],
                      source: `${currentAntenna.nom || currentAntenna.ville} (${currentAntenna.provinceCode})`,
                      destination: 'Antenne G6 - Ogooué-Ivindo (Makokou)',
                      pharmacienSource: `${currentAntenna.responsable} (${currentAntenna.titreResponsable})`,
                      pharmacienDest: 'Dr. Clarisse OBAME (Pharmacienne Régionale G6)',
                      motif: 'Péréquation sanitaire d\'urgence — Cession de stock solidaire',
                      vecteur: 'Convoi Frigorifique Tout-Terrain 4x4 (GA-8821-OPN)',
                      temperature: '+2°C à +8°C',
                      statut: 'EN_COURS_ACHEMINEMENT',
                      statutColor: 'bg-blue-100 text-blue-800',
                      nbArticles: 5,
                      totalXaf: 18438000
                    };
                    setSelectedTransferForPdf(sampleTransfer);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Émettre Bordereau Officiel A4</span>
                </button>
              </div>
            </div>
          </div>

          {/* 9-Province Stock Autonomy Gauge */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  Autonomie Consommation Moyenne Mensuelle (CMM) — 9 Provinces
                </h3>
                <p className="text-[11px] text-slate-500">
                  Visualisation du ratio stock disponible / CMM. Objectif souverain : 60 à 90 jours de réserve dans chaque pôle provincial.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">PNA 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GABON_PROVINCIAL_ANTENNAS.map((antenna) => {
                const isCurrent = antenna.provinceCode === selectedProvinceCode;
                const autonomyDays = Math.round(parseFloat(antenna.couvertureMois || 2.5) * 30);
                const isUnderStocked = autonomyDays < 45;
                const isOverStocked = autonomyDays > 85;

                return (
                  <div
                    key={antenna.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {antenna.provinceCode}
                        </span>
                        <div>
                          <div className="text-xs font-black text-slate-900">{antenna.province}</div>
                          <div className="text-[10px] text-slate-500">{antenna.ville}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isUnderStocked
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isOverStocked
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {autonomyDays} jours
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Taux de Service :</span>
                        <span className="font-bold text-slate-800">{antenna.tauxService}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isUnderStocked
                              ? 'bg-rose-500'
                              : isOverStocked
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (autonomyDays / 120) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-0.5">
                        <span>Min (30j)</span>
                        <span>Nominal (60j-90j)</span>
                        <span>Max (120j)</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {antenna.structureCount} hôpitaux rattachés
                      </span>
                      <button
                        onClick={() => {
                          const customTransfer = {
                            id: `TRF-INTER-2026-${Math.floor(100 + Math.random() * 900)}`,
                            date: new Date().toISOString().split('T')[0],
                            source: `${currentAntenna.nom || currentAntenna.ville} (${currentAntenna.provinceCode})`,
                            destination: `${antenna.nom || antenna.ville} (${antenna.provinceCode})`,
                            pharmacienSource: `${currentAntenna.responsable} (${currentAntenna.titreResponsable})`,
                            pharmacienDest: `${antenna.responsable} (${antenna.titreResponsable})`,
                            motif: `Péréquation inter-antennes vers ${antenna.province}`,
                            vecteur: 'Convoi Frigorifique Tout-Terrain 4x4 (GA-8821-OPN)',
                            temperature: '+2°C à +8°C',
                            statut: 'EN_COURS_ACHEMINEMENT',
                            statutColor: 'bg-blue-100 text-blue-800',
                            nbArticles: 5,
                            totalXaf: 14500000
                          };
                          setSelectedTransferForPdf(customTransfer);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span>Céder du Stock</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transfers History Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Registre des Transferts et Cessions Inter-Antennes</h3>
              </div>
              <span className="text-xs text-slate-500">{interAntennaTransfers.length} transferts enregistrés</span>
            </div>

            <div className="divide-y divide-slate-100">
              {interAntennaTransfers.map((trf) => (
                <div key={trf.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {trf.id}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trf.statutColor}`}>
                        {trf.statut.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">du {trf.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800 pt-1">
                      <span className="text-slate-900">{trf.source}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-blue-900">{trf.destination}</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Motif : <strong className="text-slate-700">{trf.motif}</strong>
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Vecteur : <strong>{trf.vecteur}</strong></span>
                      <span>•</span>
                      <span>Chaîne du froid : <strong className="text-cyan-700">{trf.temperature}</strong></span>
                      <span>•</span>
                      <span>Montant valorisé : <strong className="text-slate-900 font-mono">{trf.totalXaf.toLocaleString('fr-FR')} XAF</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedTransferForPdf(trf)}
                      className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Bordereau A4</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Printable Delivery Note (BL) Modal */}
      <BordereauLivraisonProvincialPdfModal
        isOpen={Boolean(selectedOrderForBl)}
        onClose={() => setSelectedOrderForBl(null)}
        order={selectedOrderForBl}
        antenna={currentAntenna}
      />

      {/* Convoy Reception PV Modal */}
      <PvReceptionConvoiModal
        isOpen={Boolean(selectedConvoiForPv)}
        onClose={() => setSelectedConvoiForPv(null)}
        convoi={selectedConvoiForPv}
        onConfirmReception={handleConfirmConvoyReception}
        antenna={currentAntenna}
      />

      {/* New Local Order Modal */}
      <NewLocalOrderModal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
        structures={REGIONAL_HEALTH_STRUCTURES}
        stockItems={currentProvinceStocks}
        onSaveOrder={handleSaveNewOrder}
        provinceCode={selectedProvinceCode}
      />

      {/* Printable Inter-Antenna Transfer Modal */}
      <BordereauTransfertInterAntennesPdfModal
        isOpen={Boolean(selectedTransferForPdf)}
        onClose={() => setSelectedTransferForPdf(null)}
        transfer={selectedTransferForPdf}
      />

    </div>
  );
}
