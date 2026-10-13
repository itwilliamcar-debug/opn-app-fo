import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Truck,
  PhoneCall,
  Radio,
  Loader2,
  RefreshCw,
  Video,
  FileText,
  Package,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Zap,
  Plus,
  X
} from 'lucide-react';
import {
  fetchEmergencies,
  fetchAntennes,
  triggerEmergencyAlert,
  resolveEmergency,
} from '../../services/api';
import { getSeverityBadge, formatXAF } from '../../utils/formatters';
import { 
  EMERGENCY_INCIDENTS_SEED, 
  CRISIS_RESPONSE_PROTOCOLS 
} from '../../data/emergencyCrisisData';
import ArreteRequisitionSanitairePdfModal from './ArreteRequisitionSanitairePdfModal';

export default function EmergencyControlCenter({
  activePersona,
  onOpenChat,
  sanctumReady = false,
}) {
  const [incidents, setIncidents] = useState(EMERGENCY_INCIDENTS_SEED);
  const [antennes, setAntennes] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(EMERGENCY_INCIDENTS_SEED[0]);
  const [selectedProtocolId, setSelectedProtocolId] = useState(EMERGENCY_INCIDENTS_SEED[0]?.protocoleRecommande || 'PROTO-PALU-GRAVE');
  const [activeTab, setActiveTab] = useState('actifs'); // 'actifs' | 'protocoles' | 'historique'
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Modales
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showArreteModal, setShowArreteModal] = useState(false);

  // Formulaire de déclaration d'alerte
  const [alertAntenneId, setAlertAntenneId] = useState('G4');
  const [alertType, setAlertType] = useState('PHARMACEUTIQUE');
  const [alertSeverity, setAlertSeverity] = useState('CRITIQUE');
  const [alertLocation, setAlertLocation] = useState('CHR de Mouila');
  const [alertTitre, setAlertTitre] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertProtocol, setAlertProtocol] = useState('PROTO-PALU-GRAVE');

  // Synchronisation avec API Sanctum si disponible
  const loadEmergencies = useCallback(async () => {
    if (!sanctumReady) return;

    setLoading(true);
    try {
      const [urgRes, antRes] = await Promise.all([
        fetchEmergencies(),
        fetchAntennes().catch(() => ({ antennes: [] })),
      ]);

      const liveList = Array.isArray(urgRes?.urgences) ? urgRes.urgences : [];
      if (liveList.length > 0) {
        // Fusionner avec la liste locale
        setIncidents((prev) => {
          const apiIds = new Set(liveList.map((u) => u.id));
          const notInApi = prev.filter((p) => !apiIds.has(p.id));
          return [...liveList, ...notInApi];
        });
      }

      if (Array.isArray(antRes?.antennes) && antRes.antennes.length > 0) {
        setAntennes(antRes.antennes);
      }
    } catch {
      // Garder les données souveraines sans bloquer
    } finally {
      setLoading(false);
    }
  }, [sanctumReady]);

  useEffect(() => {
    loadEmergencies();
  }, [loadEmergencies]);

  // Protocole associé à l'incident sélectionné
  const currentProtocol = useMemo(() => {
    const protoId = selectedIncident?.protocoleRecommande || selectedProtocolId;
    return (
      CRISIS_RESPONSE_PROTOCOLS.find((p) => p.id === protoId) ||
      CRISIS_RESPONSE_PROTOCOLS[0]
    );
  }, [selectedIncident, selectedProtocolId]);

  const activeIncidents = useMemo(
    () => incidents.filter((i) => i.statut !== 'RESOLU'),
    [incidents]
  );

  const resolvedIncidents = useMemo(
    () => incidents.filter((i) => i.statut === 'RESOLU'),
    [incidents]
  );

  const flashSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4500);
  };

  // Déclencher une alerte
  const handleTriggerAlert = async (e) => {
    e.preventDefault();
    if (!alertTitre.trim() || !alertDescription.trim()) return;

    setSubmitting(true);
    const newInc = {
      id: Date.now(),
      codeIncident: `URG-2026-${Math.floor(100 + Math.random() * 900)}`,
      titre: alertTitre.trim(),
      provinceId: alertAntenneId,
      provinceNom: `Province ${alertAntenneId}`,
      lieuPrecis: alertLocation,
      typeUrgence: alertType,
      gravite: alertSeverity,
      statut: 'EN_COURS',
      dateDeclaration: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      declarantNom: activePersona?.nom || 'Centre Opérationnel de Décision (COD)',
      description: alertDescription.trim(),
      equipeAffectee: 'Cellule de Riposte Sanitaire d\'Urgence COD',
      actionEngagee: 'Mobilisation des kits RSSE en cours et pré-alerte convoi.',
      tempsPriseEnChargeMinutes: 0,
      protocoleRecommande: alertProtocol,
      kitRequis: CRISIS_RESPONSE_PROTOCOLS.find((p) => p.id === alertProtocol)?.nom || 'Kit RSSE',
      valeurKitXAF: CRISIS_RESPONSE_PROTOCOLS.find((p) => p.id === alertProtocol)?.valeurEstimeeXAF || 3500000,
      coordonnees: { lat: 0.3901, lng: 9.4544 }
    };

    setIncidents([newInc, ...incidents]);
    setSelectedIncident(newInc);
    setSelectedProtocolId(alertProtocol);
    setShowTriggerModal(false);
    setSubmitting(false);

    // Reset
    setAlertTitre('');
    setAlertDescription('');

    flashSuccess(`Alerte sanitaire [${newInc.codeIncident}] déclarée avec succès au COD Libreville.`);

    // Essayer de soumettre à l'API si Sanctum prêt
    if (sanctumReady) {
      try {
        await triggerEmergencyAlert({
          antenne_id: 1,
          type_urgence: alertType,
          gravite: alertSeverity,
          lieu_precis: alertLocation,
          titre: alertTitre,
          description: alertDescription,
        });
      } catch {
        // Ignorer erreur API en local
      }
    }
  };

  // Résoudre un incident
  const handleResolveIncident = async (incId) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incId ? { ...i, statut: 'RESOLU', actionEngagee: 'Riposte complétée avec succès. Lots délivrés et archivés.' } : i
      )
    );
    if (selectedIncident?.id === incId) {
      setSelectedIncident((prev) => ({
        ...prev,
        statut: 'RESOLU',
        actionEngagee: 'Riposte complétée avec succès. Lots délivrés et archivés.',
      }));
    }
    flashSuccess(`Incident [${selectedIncident?.codeIncident || incId}] marqué comme résolu avec succès.`);

    if (sanctumReady) {
      try {
        await resolveEmergency(incId, 'Clôture opérationnelle par le COD.');
      } catch {
        // Ignorer
      }
    }
  };

  // Convoquer la cellule de crise Visio
  const handleOpenCrisisVisio = () => {
    if (onOpenChat) {
      onOpenChat();
    }
    flashSuccess(`Salle de crise visioconférence COD convoquée pour [${selectedIncident?.codeIncident}].`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Header Exécutif & Actions d'Urgence */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />
        
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider">
              CENTRE OPÉRATIONNEL DE DÉCISION & GESTION DES CRISES (COD / COUS)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Supervision des Urgences Sanitaires & Déploiement RSSE
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Déclenchement des kits de riposte sanitaire, réquisitions d'État et régulation médicale 24/7 sur les 9 Provinces du Gabon.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowTriggerModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer animate-pulse"
          >
            <Plus className="w-4 h-4" />
            Déclarer une Alerte Sanitaire
          </button>

          <button
            type="button"
            onClick={handleOpenCrisisVisio}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            Salle de Crise Visio COD
          </button>

          <button
            type="button"
            onClick={loadEmergencies}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Message de succès temporaire */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 2. Grille des 4 KPI Clés du Centre de Crise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Alertes en Cours</span>
            <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-rose-600 tracking-tight">
              {activeIncidents.length} Incident{activeIncidents.length > 1 ? 's' : ''}
            </h3>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              Surveillance active COUS Gabon
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Délai Prise en Charge</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-amber-700 tracking-tight">
              &lt; 24 Minutes
            </h3>
            <p className="text-[11px] font-bold text-emerald-700 mt-1">
              Objectif souverain respecté (&lt; 30 min)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Kits Riposte RSSE</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#00A651] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-[#00A651] tracking-tight">
              5 Protocoles RSSE
            </h3>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              2,85 Mrd FCFA mobilisables à Owendo
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase">Urgences Clôturées</span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-[#2E68B4] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-[#2E68B4] tracking-tight">
              {resolvedIncidents.length} Résolues
            </h3>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              100% avec PV de décharge sanitaire
            </p>
          </div>
        </div>

      </div>

      {/* 3. Bloc Principal : Liste des Incidents & Inspecteur de Riposte Sanitaire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche : Registre des Incidents (5 colonnes) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase">
                  Alertes Sanitaires Déclarées
                </h3>
              </div>

              {/* Filtre d'onglets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('actifs')}
                  className={`px-2 py-1 rounded text-[10.5px] font-bold cursor-pointer ${
                    activeTab === 'actifs' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Actives ({activeIncidents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('historique')}
                  className={`px-2 py-1 rounded text-[10.5px] font-bold cursor-pointer ${
                    activeTab === 'historique' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Historique ({resolvedIncidents.length})
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {(activeTab === 'actifs' ? activeIncidents : resolvedIncidents).map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncident(inc);
                      if (inc.protocoleRecommande) setSelectedProtocolId(inc.protocoleRecommande);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-black text-rose-700">
                        {inc.codeIncident}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                        inc.gravite === 'URGENCE_VITALE' ? 'bg-rose-600 text-white' :
                        inc.gravite === 'CRITIQUE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.gravite.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {inc.titre}
                    </h4>

                    <div className="flex items-center justify-between text-[10.5px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {inc.provinceNom}
                      </span>
                      <span className="font-mono">{inc.dateDeclaration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne Droite : Inspecteur d'Urgence Sanitaire & Moteur de Riposte (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          {selectedIncident ? (
            <div>
              
              {/* Entête Incident */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-mono text-xs font-black border border-rose-300">
                      {selectedIncident.codeIncident}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#2E68B4] text-xs font-bold border border-blue-200">
                      {selectedIncident.typeUrgence}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                      selectedIncident.statut === 'RESOLU' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedIncident.statut === 'RESOLU' ? 'CLÔTURÉ' : 'EN COURS DE TRAITEMENT'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Déclaré le</span>
                    <p className="font-mono text-xs font-bold text-slate-800">{selectedIncident.dateDeclaration}</p>
                  </div>
                </div>

                <h2 className="text-base font-black text-slate-900 mt-2">
                  {selectedIncident.titre}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <strong>{selectedIncident.lieuPrecis}</strong> ({selectedIncident.provinceNom})
                </p>
              </div>

              {/* Détail de la crise */}
              <div className="py-3 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-3 space-y-1.5">
                <p className="leading-relaxed">
                  <strong>Constat médical / logistique :</strong> {selectedIncident.description}
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Déclarant : <strong>{selectedIncident.declarantNom}</strong></span>
                  <span>Équipe assignée : <strong>{selectedIncident.equipeAffectee}</strong></span>
                </div>
              </div>

              {/* Moteur de Riposte Sanitaire & Dotation RSSE */}
              <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#00A651]" />
                    <h4 className="text-xs font-black uppercase text-slate-900">
                      Protocole de Riposte Sanitaire & Kit RSSE Assigné
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Délai cible : {currentProtocol.delaiRiposteCible}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#2E68B4] mb-2">
                  {currentProtocol.nom} ({currentProtocol.code})
                </p>

                {/* Tableau des items du kit */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 mb-3">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase text-[9px]">
                        <th className="p-2">DCI Médicament / Dispositif</th>
                        <th className="p-2 text-center">Quantité Réquisitionnée</th>
                        <th className="p-2">Lot RSSE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentProtocol.compositionItems.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 font-bold text-slate-900">{item.dci}</td>
                          <td className="p-2 text-center font-black text-rose-700">{item.quantite}</td>
                          <td className="p-2 font-mono text-slate-700">{item.lotOrigine}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                  <span>Vecteur : <strong>{currentProtocol.vecteurTransport}</strong></span>
                  <span>Valeur estimée : <strong className="text-emerald-700">{formatXAF(currentProtocol.valeurEstimeeXAF)}</strong></span>
                </div>
              </div>

              {/* Actions Exécutives */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowArreteModal(true)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  Arrêté de Réquisition
                </button>

                {selectedIncident.statut !== 'RESOLU' && (
                  <button
                    type="button"
                    onClick={() => handleResolveIncident(selectedIncident.id)}
                    className="py-2.5 px-3.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Clôturer l'Urgence
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenCrisisVisio}
                  className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all border border-slate-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  Visio COD
                </button>
              </div>

            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-12">
              Sélectionnez une alerte sanitaire dans la liste de gauche.
            </p>
          )}
        </div>

      </div>

      {/* Modale de Déclaration d'Alerte Sanitaire */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-300 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Déclarer une Alerte Sanitaire (COD Gabon)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriggerAlert} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Province Concernée :</label>
                <select
                  value={alertAntenneId}
                  onChange={(e) => setAlertAntenneId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="G1">G1 — Estuaire (Libreville / Owendo)</option>
                  <option value="G2">G2 — Haut-Ogooué (Franceville)</option>
                  <option value="G3">G3 — Moyen-Ogooué (Lambaréné)</option>
                  <option value="G4">G4 — Ngounié (Mouila)</option>
                  <option value="G5">G5 — Nyanga (Tchibanga)</option>
                  <option value="G6">G6 — Ogooué-Ivindo (Makokou)</option>
                  <option value="G7">G7 — Ogooué-Lolo (Koula-Moutou)</option>
                  <option value="G8">G8 — Ogooué-Maritime (Port-Gentil)</option>
                  <option value="G9">G9 — Woleu-Ntem (Oyem)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type d'Urgence :</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="PHARMACEUTIQUE">PHARMACEUTIQUE (Rupture)</option>
                    <option value="EPIDEMIQUE">ÉPIDÉMIQUE (Flambée)</option>
                    <option value="TOXICOLOGIQUE">TOXICOLOGIQUE (Morsures)</option>
                    <option value="LOGISTIQUE_FROID">LOGISTIQUE / FROID</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Niveau de Gravité :</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-rose-700"
                  >
                    <option value="URGENCE_VITALE">URGENCE VITALE</option>
                    <option value="CRITIQUE">CRITIQUE</option>
                    <option value="ELEVEE">ÉLEVÉE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lieu Précis (Structure de Santé) :</label>
                <input
                  type="text"
                  value={alertLocation}
                  onChange={(e) => setAlertLocation(e.target.value)}
                  placeholder="Ex : CHR de Mouila & Dispensaire de Lébamba"
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'Alerte :</label>
                <input
                  type="text"
                  value={alertTitre}
                  onChange={(e) => setAlertTitre(e.target.value)}
                  placeholder="Ex : Flambée paludisme grave pédiatrique"
                  className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Protocole RSSE Assigné :</label>
                <select
                  value={alertProtocol}
                  onChange={(e) => setAlertProtocol(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-[#2E68B4]"
                >
                  {CRISIS_RESPONSE_PROTOCOLS.map((proto) => (
                    <option key={proto.id} value={proto.id}>
                      {proto.code} : {proto.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description Circonstanciée :</label>
                <textarea
                  value={alertDescription}
                  onChange={(e) => setAlertDescription(e.target.value)}
                  placeholder="Préciser le nombre de patients affectés, stocks résiduels et besoins vitaux..."
                  rows={3}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTriggerModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
                >
                  {submitting ? 'Transmission COD...' : 'Diffuser l\'Alerte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale A4 Arrêté de Réquisition Sanitaire */}
      <ArreteRequisitionSanitairePdfModal
        isOpen={showArreteModal}
        onClose={() => setShowArreteModal(false)}
        incident={selectedIncident}
        protocol={currentProtocol}
        activePersona={activePersona}
      />

    </div>
  );
}
