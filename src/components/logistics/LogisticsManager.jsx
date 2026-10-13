import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Thermometer, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Eye, 
  ChevronRight, 
  RefreshCw, 
  Activity, 
  Building2, 
  Radio, 
  X,
  Send,
  Navigation,
  Check,
  Layers
} from 'lucide-react';
import { 
  OPN_LOGISTICS_VEHICLES, 
  OPN_CONVOYS_SEED, 
  OPN_COLD_CHAIN_SENSORS 
} from '../../data/logisticsData';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { formatXAF } from '../../utils/formatters';
import BordereauLivraisonPdfModal from './BordereauLivraisonPdfModal';
import { fetchLogisticsMissions, createLogisticsMission, updateMissionStatus } from '../../services/api';

export default function LogisticsManager({ activePersona, sanctumReady }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [convoys, setConvoys] = useState(OPN_CONVOYS_SEED);
  const [vehicles, setVehicles] = useState(OPN_LOGISTICS_VEHICLES);
  const [sensors, setSensors] = useState(OPN_COLD_CHAIN_SENSORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');
  const [selectedConvoiForBl, setSelectedConvoiForBl] = useState(null);
  const [isBlModalOpen, setIsBlModalOpen] = useState(false);
  const [isNewConvoiModalOpen, setIsNewConvoiModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formulaire de création de nouveau convoi
  const [newConvoiForm, setNewConvoiForm] = useState({
    nomConvoi: '',
    typeTransport: 'ROUTIER',
    vehiculeId: 'VEH-01',
    chauffeur: 'Jean-Marc MBOUMBA',
    chefConvoi: activePersona?.nom || 'Pharmacien Inspecteur OPN',
    antenneDepartId: 'G1',
    antenneDestinationId: 'G2',
    dateDepart: '18 Septembre 2026 à 06h00',
    dateArriveePrevue: '19 Septembre 2026 à 14h00',
    tonnageKg: 8500,
    nombreColis: 120,
    valeurMarchandiseXAF: 95000000,
    consignes: 'Vérification continue capteurs thermiques 2°C–8°C.'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Synchronisation des missions de transport et convois nationaux
  const refreshMissions = async () => {
    setLoading(true);
    try {
      const res = await fetchLogisticsMissions();
      if (res?.success && res.missions?.length > 0) {
        // Formater les missions backend si disponibles
        console.log('Missions logistiques chargées depuis Laravel:', res.missions);
      }
    } catch (e) {
      console.log('Utilisation du store logistique local:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMissions();
  }, [sanctumReady]);

  // Filtrage des convois
  const filteredConvoys = convoys.filter((c) => {
    const matchSearch = (c.nomConvoi + c.codeMission + c.blReference + c.antenneDestinationNom + c.chauffeur)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.statut === statusFilter;
    const matchProvince = provinceFilter === 'ALL' || c.antenneDestinationId === provinceFilter;
    return matchSearch && matchStatus && matchProvince;
  });

  // Métriques globales
  const totalTonnage = convoys.reduce((acc, c) => acc + (c.tonnageKg || 0), 0) / 1000;
  const activeConvoysCount = convoys.filter((c) => c.statut === 'EN_TRANSIT' || c.statut === 'EN_LIVRAISON').length;
  const completedConvoysCount = convoys.filter((c) => c.statut === 'LIVREE').length;
  const coldChainConformity = 100;

  // Création d'un nouveau convoi
  const handleCreateConvoi = async (e) => {
    e.preventDefault();
    const destProv = GABON_PROVINCES.find(p => p.id === newConvoiForm.antenneDestinationId) || GABON_PROVINCES[1];
    const veh = vehicles.find(v => v.id === newConvoiForm.vehiculeId) || vehicles[0];

    const codeMission = `MIS-2026-${String(convoys.length + 1).padStart(3, '0')}`;
    const blReference = `BL-OPN-2026-${String(convoys.length + 89).padStart(3, '0')}`;
    const odmRef = `ODM-OPN-2026-${randNumber(7420, 7999)}`;

    const newConvoiObj = {
      id: codeMission,
      codeMission: codeMission,
      ordreMissionRef: odmRef,
      blReference: blReference,
      nomConvoi: newConvoiForm.nomConvoi || `Convoi Axe ${destProv.nom} — ${destProv.chefLieu}`,
      typeTransport: newConvoiForm.typeTransport,
      vehicule: `${veh.type} (${veh.immat})`,
      chauffeur: newConvoiForm.chauffeur,
      chefConvoi: newConvoiForm.chefConvoi,
      convoyeurId: activePersona?.id || 'USR-CONV-01',
      antenneDepartId: 'G1',
      antenneDepartNom: 'Hub Central Owendo (Estuaire)',
      antenneDestinationId: destProv.id,
      antenneDestinationNom: `Antenne Provinciale de ${destProv.chefLieu} (${destProv.nom})`,
      etapesIntermediaires: ["Hub Owendo", destProv.chefLieu],
      dateDepart: newConvoiForm.dateDepart,
      dateArriveePrevue: newConvoiForm.dateArriveePrevue,
      statut: 'PLANIFIEE',
      temperatureActuelle: 4.2,
      temperatureConforme: true,
      tonnageKg: Number(newConvoiForm.tonnageKg),
      nombreColis: Number(newConvoiForm.nombreColis),
      valeurMarchandiseXAF: Number(newConvoiForm.valeurMarchandiseXAF),
      structuresDestinataires: [
        `Centre Hospitalier Régional de ${destProv.chefLieu}`,
        `Hôpital Départemental de ${destProv.chefLieu}`
      ],
      colisage: [
        { code: "012901002", designation: "Artéméther + Luméfantrine 20/120mg", forme: "Comprimé", lot: "LOT-ACT-2609", peremption: "11/2028", quantite: 10000, colis: "10 Cartons", temp: "2°C–8°C" },
        { code: "010901001", designation: "Chlorure de Sodium 0,9% Injectable 500ml", forme: "Soluté Massif", lot: "LOT-SOL-2609", peremption: "05/2029", quantite: 5000, colis: "50 Cartons", temp: "15°C–25°C" }
      ],
      qrToken: `QR-OPN-${blReference}-SECURE-${destProv.chefLieu.toUpperCase()}`,
      consignes: newConvoiForm.consignes
    };

    setConvoys([newConvoiObj, ...convoys]);
    setIsNewConvoiModalOpen(false);

    try {
      await createLogisticsMission({
        convoi_nom: newConvoiObj.nomConvoi,
        type_transport: newConvoiObj.typeTransport,
        vehicule_immat: veh.immat,
        vehicule_type: veh.type,
        chauffeur_ou_agent: newConvoiObj.chauffeur,
        antenne_depart_id: 1,
        antenne_destination_id: parseInt(destProv.id.replace('G', ''), 10) || 2
      });
      showToast(`Mission ${codeMission} et BL ${blReference} créés et synchronisés API.`);
    } catch (err) {
      try {
        const key = 'opn_logistics_missions_pending';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift({ ...newConvoiObj, pendingSync: true, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list.slice(0, 40)));
      } catch { /* ignore */ }
      showToast(
        `Mission ${codeMission} créée en local (API: ${err?.message || 'indisponible'}).`
      );
    }
  };

  // Mise à jour de statut de convoi
  const handleUpdateStatus = (convoiId, nextStatus) => {
    setConvoys(convoys.map(c => {
      if (c.id === convoiId) {
        return { ...c, statut: nextStatus };
      }
      return c;
    }));
    showToast(`✓ Statut du convoi ${convoiId} mis à jour : ${nextStatus}`);
  };

  // Ouverture de la modale BL
  const handleOpenBlModal = (convoi) => {
    setSelectedConvoiForBl(convoi);
    setIsBlModalOpen(true);
  };

  function randNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-[130] bg-[#102A4D] text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* En-tête Principal du Module Logistique */}
      <div className="bg-gradient-to-r from-[#102A4D] via-[#1A457A] to-[#102A4D] text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-blue-900/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
              <span>SYSTÈME NATIONAL D'EXPÉDITION & DISPATCHING OPN</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Truck className="w-7 h-7 text-[#FFDE16]" />
              Logistique & Expéditions — Hub Central Owendo
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
              Pilotage multimodal des convois vers les 9 antennes provinciales, télémétrie de la chaîne du froid 2°C–8°C et bordereaux de livraison (BL) sécurisés.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsNewConvoiModalOpen(true)}
              className="px-4 py-2.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:shadow-[0_0_16px_rgba(0,166,81,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>Programmer un Convoi</span>
            </button>
            <button
              onClick={refreshMissions}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Rafraîchir les flux"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Indicateurs Clés Métier Logistique */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Convois Actifs</span>
            <Navigation className="w-4 h-4 text-[#2E68B4]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeConvoysCount} Convois</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            En route vers les provinces
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tonnage Acheminé</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#2E68B4]">{totalTonnage.toFixed(1)} Tonnes</div>
          <div className="text-[10px] text-slate-500 font-medium">Médicaments & Solutés</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Chaîne du Froid</span>
            <Thermometer className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">100% Conforme</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Sondes IoT 2°C – 8°C Actives</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Missions Livrées</span>
            <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{completedConvoysCount} Missions</div>
          <div className="text-[10px] text-blue-600 font-semibold">Décharges numériques validées</div>
        </div>

      </div>

      {/* Navigation par Onglets */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'overview', label: 'Vue d\'Ensemble & Flux', icon: Activity },
          { id: 'convoys', label: `Convois & Missions (${convoys.length})`, icon: Truck },
          { id: 'deliveries', label: 'Bordereaux de Livraison (BL)', icon: FileText },
          { id: 'cold_chain', label: 'Télémétrie Chaîne du Froid (2°C–8°C)', icon: Thermometer },
          { id: 'flotte', label: `Flotte & Véhicules (${vehicles.length})`, icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2E68B4] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          ONGLET 1 : VUE D'ENSEMBLE & FLUX NATIONAUX
      ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Colonne Gauche : Convois en cours de transit */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Convois en Transit en Temps Réel
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#2E68B4] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Départ Hub Owendo
                </span>
              </div>

              <div className="space-y-3">
                {convoys.filter(c => c.statut === 'EN_TRANSIT' || c.statut === 'EN_LIVRAISON').map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#2E68B4] transition-all space-y-3 shadow-2xs">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#102A4D] text-white font-mono">
                          {c.codeMission}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {c.typeTransport}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {c.statut === 'EN_TRANSIT' ? 'En Route' : 'En Cours de Dépotage'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.nomConvoi}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{c.antenneDepartNom} → <strong>{c.antenneDestinationNom}</strong></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Véhicule</span>
                        <span className="font-semibold text-slate-800 truncate block">{c.vehicule}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Télémétrie Froid</span>
                        <span className="font-bold text-emerald-600">{c.temperatureActuelle}°C (2°C–8°C)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Poids & Colis</span>
                        <span className="font-bold text-slate-800">{(c.tonnageKg / 1000).toFixed(1)} T • {c.nombreColis} colis</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => handleOpenBlModal(c)}
                        className="text-xs font-bold text-[#2E68B4] hover:text-[#183B68] flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Bordereau de Livraison (BL)</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {c.statut === 'EN_TRANSIT' && (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'EN_LIVRAISON')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold"
                          >
                            Passer en Livraison
                          </button>
                        )}
                        {c.statut === 'EN_LIVRAISON' && (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'LIVREE')}
                            className="px-2.5 py-1 bg-[#00A651] hover:bg-[#008742] text-white rounded text-[11px] font-bold"
                          >
                            Valider Réception
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Colonne Droite : Axes Logistiques & Antennes Raccordées */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00A651]" />
                  Les 4 Grands Axes Logistiques OPN
                </h3>
                
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="p-1.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">AXE 1</span>
                    <div>
                      <strong className="text-slate-900 block">Axe Ferroviaire Transgabonais (Setrag)</strong>
                      <p className="text-[11px] text-slate-500">Owendo → Ndjolé (G3) → Booué (G6) → Lastoursville (G7) → Franceville (G2). Délai moyen : 24h à 36h.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">AXE 2</span>
                    <div>
                      <strong className="text-slate-900 block">Axe Routier Nord (RN2)</strong>
                      <p className="text-[11px] text-slate-500">Owendo → Lalara → Mitzic → Oyem (G9) → Bitam. Camions isothermes sécurisés. Délai : 24h.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded font-bold text-[10px]">AXE 3</span>
                    <div>
                      <strong className="text-slate-900 block">Axe Routier Centre-Sud (RN1)</strong>
                      <p className="text-[11px] text-slate-500">Owendo → Bifoun → Lambaréné (G3) → Mouila (G4) → Tchibanga (G5). Délai : 36h à 48h.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="p-1.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px]">AXE 4</span>
                    <div>
                      <strong className="text-slate-900 block">Axe Maritime & Aérien Spécial (G8)</strong>
                      <p className="text-[11px] text-slate-500">Port d'Owendo → Baie de Port-Gentil (Barge isotherme) & Fret Aérien Urgences. Délai : 6h à 12h.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          ONGLET 2 : CONVOIS & MISSIONS
      ========================================================================= */}
      {activeTab === 'convoys' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Barre de Recherche et Filtres */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par mission, convoi, chauffeur, BL ou antenne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2E68B4]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Tous les Statuts</option>
                <option value="PLANIFIEE">Planifiée</option>
                <option value="EN_TRANSIT">En Transit</option>
                <option value="EN_LIVRAISON">En Livraison</option>
                <option value="LIVREE">Livrée</option>
              </select>

              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Toutes les Provinces</option>
                {GABON_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} - {p.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tableau des Convois */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Réf. Mission</th>
                    <th className="py-3 px-4">Convoi & Destination</th>
                    <th className="py-3 px-4">Type Transport</th>
                    <th className="py-3 px-4">Chauffeur & Chef Convoi</th>
                    <th className="py-3 px-4 text-center">Température</th>
                    <th className="py-3 px-4 text-right">Poids & Valeur</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredConvoys.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {c.codeMission}
                        <span className="block text-[10px] text-slate-400 font-normal">{c.ordreMissionRef}</span>
                      </td>

                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{c.nomConvoi}</strong>
                        <span className="text-[11px] text-[#2E68B4] font-semibold">{c.antenneDestinationNom}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                          {c.typeTransport}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 truncate max-w-[160px]">{c.vehicule}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{c.chauffeur}</span>
                        <span className="text-[10px] text-slate-500">Chef : {c.chefConvoi}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.temperatureActuelle}°C
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <strong className="text-slate-900 block">{(c.tonnageKg / 1000).toFixed(1)} Tonnes</strong>
                        <span className="text-[10px] text-slate-500">{formatXAF(c.valeurMarchandiseXAF)}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.statut === 'LIVREE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : c.statut === 'EN_TRANSIT'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : c.statut === 'EN_LIVRAISON'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {c.statut}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenBlModal(c)}
                          className="px-3 py-1.5 bg-[#2E68B4] hover:bg-[#215091] text-white rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow-2xs transition-colors"
                          title="Générer et imprimer le Bordereau de Livraison"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>BL (PDF)</span>
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

      {/* =========================================================================
          ONGLET 3 : BORDEREAUX DE LIVRAISON (BL)
      ========================================================================= */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Registre Officiel des Bordereaux de Livraison (BL)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chaque bordereau généré comporte un QR Code cryptographique assurant la traçabilité intégrale de la remise des médicaments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {convoys.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#2E68B4] transition-all space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#102A4D] text-white text-xs font-mono font-bold rounded">
                        {c.blReference}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        {c.statut}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.nomConvoi}</h4>

                    <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                      <div><strong>Destination :</strong> {c.antenneDestinationNom}</div>
                      <div><strong>Colisage :</strong> {c.colisage?.length || 0} références • {c.nombreColis} colis</div>
                      <div><strong>Valeur :</strong> {formatXAF(c.valeurMarchandiseXAF)}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>QR Décharge prêt</span>
                    </div>

                    <button
                      onClick={() => handleOpenBlModal(c)}
                      className="px-3 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Afficher BL</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          ONGLET 4 : TÉLÉMÉTRIE CHAÎNE DU FROID
      ========================================================================= */}
      {activeTab === 'cold_chain' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensors.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{s.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {s.statut}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{s.nomVehicule}</h4>
                  <p className="text-[11px] text-slate-500">{s.trajet}</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-0.5">
                  <div className="text-2xl font-black text-emerald-700">{s.temperatureActuelle}°C</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Plage Normale (2°C – 8°C)</div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min / Max :</span>
                    <span className="font-semibold">{s.temperatureMin}°C / {s.temperatureMax}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batterie Sonde :</span>
                    <span className="font-semibold text-emerald-600">{s.batteriePct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signal Télécom :</span>
                    <span className="font-semibold text-slate-700">{s.signalGsm}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          ONGLET 5 : FLOTTE & VÉHICULES
      ========================================================================= */}
      {activeTab === 'flotte' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded">
                  {v.immat}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {v.mode}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{v.type}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Groupe : {v.groupeFroid}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacité :</span>
                  <strong>{(v.capaciteKg / 1000).toFixed(1)} T ({v.volumeM3} m³)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chauffeur Assigné :</span>
                  <span className="font-semibold">{v.chauffeur}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Localisation :</span>
                  <span className="font-medium text-[#2E68B4] truncate max-w-[170px]">{v.localisation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALE DE PROGRAMMATION D'UN NOUVEAU CONVOI */}
      {isNewConvoiModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Truck className="w-5 h-5 text-[#2E68B4]" />
                <h3 className="text-base font-black">Programmer une Nouvelle Mission de Convoi</h3>
              </div>
              <button onClick={() => setIsNewConvoiModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConvoi} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé du Convoi</label>
                <input
                  type="text"
                  required
                  value={newConvoiForm.nomConvoi}
                  onChange={(e) => setNewConvoiForm({ ...newConvoiForm, nomConvoi: e.target.value })}
                  placeholder="Ex: Convoi Spécial Solutés & ACT — Province Haut-Ogooué"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode de Transport</label>
                  <select
                    value={newConvoiForm.typeTransport}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, typeTransport: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="ROUTIER">Routier (RN1 / RN2)</option>
                    <option value="FERROVIAIRE">Ferroviaire (Setrag)</option>
                    <option value="MARITIME">Maritime (Port-Gentil)</option>
                    <option value="AERIEN">Fret Aérien Express</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Antenne Provinciale Destinataire</label>
                  <select
                    value={newConvoiForm.antenneDestinationId}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, antenneDestinationId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    {GABON_PROVINCES.filter(p => p.id !== 'G1').map((p) => (
                      <option key={p.id} value={p.id}>{p.id} - {p.chefLieu} ({p.nom})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Véhicule Assigné</label>
                  <select
                    value={newConvoiForm.vehiculeId}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, vehiculeId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.immat} - {v.type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Conducteur / Chauffeur</label>
                  <input
                    type="text"
                    required
                    value={newConvoiForm.chauffeur}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, chauffeur: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Poids (Kg)</label>
                  <input
                    type="number"
                    required
                    value={newConvoiForm.tonnageKg}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, tonnageKg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nbre Colis</label>
                  <input
                    type="number"
                    required
                    value={newConvoiForm.nombreColis}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, nombreColis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valeur (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={newConvoiForm.valeurMarchandiseXAF}
                    onChange={(e) => setNewConvoiForm({ ...newConvoiForm, valeurMarchandiseXAF: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consignes de Sécurité & Manipulation Froid</label>
                <textarea
                  rows="2"
                  value={newConvoiForm.consignes}
                  onChange={(e) => setNewConvoiForm({ ...newConvoiForm, consignes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewConvoiModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded-lg shadow"
                >
                  Valider & Générer BL
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODALE D'IMPRESSION DU BORDEREAU DE LIVRAISON (BL) OFFICIEL AVEC QR CODE */}
      <BordereauLivraisonPdfModal
        isOpen={isBlModalOpen}
        onClose={() => setIsBlModalOpen(false)}
        convoi={selectedConvoiForBl}
      />

    </div>
  );
}
