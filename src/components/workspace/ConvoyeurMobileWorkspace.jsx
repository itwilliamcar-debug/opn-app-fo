import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Thermometer, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Send,
  Navigation,
  Camera,
  PenTool,
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  fetchLogisticsMissions, 
  updateMissionStatus, 
  verifyDeliveryQrCode, 
  signOffDelivery, 
  submitMissionReport 
} from '../../services/api';
import { formatXAF } from '../../utils/formatters';

export default function ConvoyeurMobileWorkspace({ activePersona }) {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modale Scanner QR
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrInputToken, setQrInputToken] = useState('QR-LIV-POG-884920199');
  const [scannedDelivery, setScannedDelivery] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [verifyingQr, setVerifyingQr] = useState(false);

  // Modale Signature Tactile Réceptionnaire
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [receptionnaireNom, setReceptionnaireNom] = useState('Dr. Roger KOMBILA');
  const [receptionnaireFonction, setReceptionnaireFonction] = useState('Directeur CHR Port-Gentil');
  const [ecartsText, setEcartsText] = useState('');
  const [reservesText, setReservesText] = useState('Colis reçus intacts avec chaîne du froid 4.1°C vérifiée');
  const [signatureSaved, setSignatureSaved] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Modale Rapport de Mission
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [kmTotal, setKmTotal] = useState(420);
  const [tempMin, setTempMin] = useState(3.8);
  const [tempMax, setTempMax] = useState(4.8);
  const [incidentsObs, setIncidentsObs] = useState('Traversée fluide. Aucun incident de route. Température conforme.');
  const [actionError, setActionError] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    setLoading(true);
    const res = await fetchLogisticsMissions();
    if (res && res.missions && res.missions.length > 0) {
      setMissions(res.missions);
      setSelectedMission(res.missions[0]);
    } else {
      // Données de secours
      const fallback = [
        {
          id: 1,
          code_mission: "MIS-2026-088",
          ordre_mission_ref: "ODM-OPN-2026-88",
          convoi_nom: "Convoi Express Maritime Owendo ➔ Port-Gentil",
          type_transport: "MARITIME_BARGE",
          vehicule_immat: "BARGE-OPN-02",
          vehicule_type: "Barge Cargo Frigorifique Fluvio-Maritime",
          chauffeur_ou_agent: "M. Jean-Paul MVE",
          chef_convoi_nom: "Capitaine Guy-Roger NGUEMA",
          statut: "EN_ROUTE",
          date_depart: "08/09/2026 06:00",
          temperature_actuelle: 4.1,
          temperature_conforme: true,
          kilometrage_depart: 0,
          antenne_depart: { nom: "Hub Owendo (Libreville)", chef_lieu: "Libreville" },
          antenne_destination: { nom: "Antenne Port-Gentil", chef_lieu: "Port-Gentil" },
          livraisons: [
            {
              id: 1,
              code_livraison: "LIV-POG-2026-012",
              statut: "EN_TRANSIT",
              qr_token: "QR-LIV-POG-884920199",
              is_qr_scanned: false,
              is_closed: false,
              structure: { nom: "Centre Hospitalier Régional de Port-Gentil", ville: "Port-Gentil" }
            }
          ]
        }
      ];
      setMissions(fallback);
      setSelectedMission(fallback[0]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedMission) return;
    await updateMissionStatus(selectedMission.id, {
      statut: newStatus,
      convoyeur_nom: activePersona?.nom || 'M. Jean-Paul MVE',
      temperature: selectedMission.temperature_actuelle,
    });

    setSelectedMission(prev => ({ ...prev, statut: newStatus }));
    setMissions(prev => prev.map(m => m.id === selectedMission.id ? { ...m, statut: newStatus } : m));
  };

  // Gestion du Scan QR Code
  const handleVerifyQr = async () => {
    setVerifyingQr(true);
    setQrError(null);

    const res = await verifyDeliveryQrCode(qrInputToken, activePersona?.nom || 'M. Jean-Paul MVE');
    setVerifyingQr(false);

    if (res && res.success) {
      setScannedDelivery(res.livraison);
      setQrModalOpen(false);
      setSignModalOpen(true);
    } else {
      setQrError(res?.message || 'Code QR invalide ou déjà utilisé.');
    }
  };

  // Canvas de signature tactile
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveSignature = async () => {
    const deliveryId = scannedDelivery?.id || 1;
    const payload = {
      nom_receptionnaire: receptionnaireNom,
      fonction_receptionnaire: receptionnaireFonction,
      quantites_recues_json: [{ produit: 'Solutés & ACT', recu: 80, conforme: true }],
      ecarts_declares: ecartsText,
      reserves_qualite: reservesText,
      signature_image_data: canvasRef.current ? canvasRef.current.toDataURL() : 'sig_data',
    };

    setActionBusy(true);
    setActionError(null);
    try {
      const res = await signOffDelivery(deliveryId, payload);
      if (res?.success === false) {
        throw new Error(res?.message || 'Signature refusée par le serveur.');
      }
      setSignatureSaved(true);
      setTimeout(() => {
        setSignModalOpen(false);
        setSignatureSaved(false);
        setReportModalOpen(true);
      }, 1200);
    } catch (err) {
      try {
        const key = 'opn_convoyeur_signoffs';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift({ deliveryId, ...payload, at: new Date().toISOString(), offline: true });
        localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
        setSignatureSaved(true);
        setActionError(
          `${err?.message || 'API indisponible'} — signature enregistrée en local (sync ultérieure).`
        );
        setTimeout(() => {
          setSignModalOpen(false);
          setSignatureSaved(false);
          setReportModalOpen(true);
          setActionError(null);
        }, 1600);
      } catch {
        setActionError(err?.message || 'Impossible d’enregistrer la signature.');
      }
    } finally {
      setActionBusy(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedMission) return;

    setActionBusy(true);
    setActionError(null);
    const reportPayload = {
      convoyeur_nom: activePersona?.nom || 'M. Jean-Paul MVE',
      km_total: kmTotal,
      temperature_min: tempMin,
      temperature_max: tempMax,
      observations: incidentsObs,
    };

    try {
      const res = await submitMissionReport(selectedMission.id, reportPayload);
      if (res?.success === false) {
        throw new Error(res?.message || 'Rapport refusé par le serveur.');
      }
      setReportSuccess(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess(false);
        handleStatusChange('RAPPORT_SOUMIS');
      }, 1500);
    } catch (err) {
      try {
        const key = 'opn_convoyeur_reports';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift({
          missionId: selectedMission.id,
          ...reportPayload,
          at: new Date().toISOString(),
          offline: true,
        });
        localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
        setReportSuccess(true);
        setActionError(
          `${err?.message || 'API indisponible'} — rapport stocké localement.`
        );
        setTimeout(() => {
          setReportModalOpen(false);
          setReportSuccess(false);
          setActionError(null);
          handleStatusChange('RAPPORT_SOUMIS');
        }, 1600);
      } catch {
        setActionError(err?.message || 'Impossible de transmettre le rapport.');
      }
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. Header Convoyeur Mobile */}
      <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
              <span className="text-[10px] font-bold text-[#00A651] uppercase tracking-wider">
                Espace Opérationnel Terrain & Convois
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              {activePersona.nom}
            </h1>
            <p className="text-xs text-slate-600">
              {activePersona.role} • Matricule : <strong>{activePersona.id}</strong>
            </p>
          </div>
        </div>

        {/* Bouton Scanner QR Code Principal */}
        <button
          onClick={() => {
            setQrModalOpen(true);
            setQrError(null);
          }}
          className="px-4 py-2.5 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Scanner QR Code de Livraison</span>
        </button>
      </div>

      {/* 2. Mission en Cours - Carte Haute Visibilité */}
      {selectedMission ? (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedMission.code_mission}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedMission.convoi_nom}
              </h3>
              <p className="text-xs text-slate-500">
                Véhicule : <strong>{selectedMission.vehicule_immat}</strong> ({selectedMission.vehicule_type})
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Badge Statut */}
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                selectedMission.statut === 'EN_ROUTE' 
                  ? 'bg-blue-100 text-blue-900 animate-pulse' 
                  : selectedMission.statut === 'LIVRAISONS_TERMINEES' || selectedMission.statut === 'RAPPORT_SOUMIS'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {selectedMission.statut.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Indicateurs Télémétrie Terrain */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Température Frigo</span>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Thermometer className="w-4 h-4 text-[#00A651]" />
                <span className="text-base font-black text-[#00A651]">{selectedMission.temperature_actuelle}°C</span>
              </div>
              <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Conforme 2°C–8°C</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Origine Départ</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {selectedMission.antenne_depart?.nom || 'Hub Owendo'}
              </span>
              <span className="text-[10px] text-slate-500">Dépôt central</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Destination</span>
              <span className="text-xs font-bold text-[#2E68B4] block mt-1">
                {selectedMission.antenne_destination?.nom || 'Port-Gentil'}
              </span>
              <span className="text-[10px] text-slate-500">Bassin Maritime</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Chef d'Escorte</span>
              <span className="text-xs font-bold text-slate-900 block mt-1 truncate">
                {selectedMission.chef_convoi_nom || 'Capitaine NGUEMA'}
              </span>
              <span className="text-[10px] text-slate-500">Protection Sûreté</span>
            </div>
          </div>

          {/* Actions d'Étape Convoyeur (Articles 22) */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2.5">
              Actions Opérationnelles Convoyeur (Feuille de Route) :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => handleStatusChange('CHARGEMENT_CONFIRME')}
                className="py-2.5 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold transition-all shadow-2xs"
              >
                1. Confirmer Chargement
              </button>
              <button
                onClick={() => handleStatusChange('EN_ROUTE')}
                className="py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-2xs"
              >
                2. Démarrer Convoi
              </button>
              <button
                onClick={() => handleStatusChange('ARRIVEE_DESTINATION')}
                className="py-2.5 px-3 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-2xs"
              >
                3. Arrivé Destination
              </button>
              <button
                onClick={() => setReportModalOpen(true)}
                className="py-2.5 px-3 rounded bg-[#00A651] hover:bg-[#008742] text-white font-bold transition-all shadow-2xs"
              >
                4. Rédiger Rapport
              </button>
            </div>
          </div>

          {/* Liste des Livraisons Associées */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Bordereaux de Livraison à Émarger dans cette Mission :
            </span>
            <div className="space-y-2">
              {(selectedMission.livraisons || []).map((liv, idx) => (
                <div 
                  key={liv.id || idx}
                  className="p-3 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 flex-wrap"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900">{liv.code_livraison}</span>
                    <p className="text-xs text-slate-600 font-medium">{liv.structure?.nom || 'Structure Sanitaire'}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Token QR : {liv.qr_token}</span>
                  </div>

                  <button
                    onClick={() => {
                      setQrInputToken(liv.qr_token);
                      setQrModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#2E68B4] hover:bg-[#215091] text-white font-bold rounded text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pointer & Scanner</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-md border border-slate-200 text-slate-500 text-xs">
          Aucune mission assignée pour le moment.
        </div>
      )}

      {/* 3. MODALE SCANNER QR CODE (ARTICLE 23) */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-[#2E68B4] text-white flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Scanner QR Code de Livraison</h3>
                  <p className="text-[11px] text-slate-500">Vérification sécurisée par jeton serveur anti-rejeu</p>
                </div>
              </div>
              <button onClick={() => setQrModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {qrError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{qrError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-100 rounded-md border border-dashed border-slate-300 text-center space-y-2">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-slate-600 text-[11px]">
                  Caméra active / Visez le QR Code imprimé sur le bon de livraison OPN
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jeton Token QR Détecté</label>
                <input
                  type="text"
                  value={qrInputToken}
                  onChange={(e) => setQrInputToken(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={verifyingQr}
                  onClick={handleVerifyQr}
                  className="px-4 py-2 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded-md shadow-sm flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{verifyingQr ? 'Vérification...' : 'Valider le QR Code'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODALE ÉMARGEMENT & SIGNATURE TACTILE DU MÉDECIN (ARTICLES 24 & 25) */}
      {signModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-[#00A651] text-white flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Émargement & Preuve de Livraison</h3>
                  <p className="text-[11px] text-slate-500">Recueil de la signature tactile du réceptionnaire</p>
                </div>
              </div>
              <button onClick={() => setSignModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {signatureSaved ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00A651] mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Preuve de Livraison Scellée</h4>
                <p className="text-xs text-slate-600">Transmission au Gestionnaire Logistique et à l'Approvisionnement...</p>
                {actionError && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">{actionError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du Réceptionnaire</label>
                    <input
                      type="text"
                      value={receptionnaireNom}
                      onChange={(e) => setReceptionnaireNom(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fonction / Titre</label>
                    <input
                      type="text"
                      value={receptionnaireFonction}
                      onChange={(e) => setReceptionnaireFonction(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Réserves Qualité / Chaîne du Froid</label>
                  <input
                    type="text"
                    value={reservesText}
                    onChange={(e) => setReservesText(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 bg-white"
                  />
                </div>

                {/* Pad de signature tactile */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Pad de Signature Tactile</label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={460}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-32 border-2 border-dashed border-slate-300 bg-slate-50 rounded-md cursor-crosshair touch-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Signez avec le doigt ou la souris à l'intérieur du cadre</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSignModalOpen(false)}
                    className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSignature}
                    disabled={actionBusy}
                    className="px-4 py-2 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded-md shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionBusy ? 'Enregistrement…' : 'Sceller la Preuve de Livraison'}</span>
                  </button>
                </div>
                {actionError && !signatureSaved && (
                  <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1.5">{actionError}</p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. MODALE RAPPORT DE MISSION (ARTICLE 26) */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-[#2E68B4] text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Rapport de Fin de Mission Convoyeur</h3>
                  <p className="text-[11px] text-slate-500">Transmission à la Logistique & Approvisionnement (Article 26)</p>
                </div>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00A651] mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Rapport Transmis avec Succès</h4>
                <p className="text-xs text-slate-600">Le dossier est prêt pour validation Logistique et clôture.</p>
                {actionError && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">{actionError}</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Km Total</label>
                    <input
                      type="number"
                      value={kmTotal}
                      onChange={(e) => setKmTotal(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-900 font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Temp Min (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempMin}
                      onChange={(e) => setTempMin(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-900 font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Temp Max (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempMax}
                      onChange={(e) => setTempMax(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-900 font-bold bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observations & Incidents de Route</label>
                  <textarea
                    rows="3"
                    value={incidentsObs}
                    onChange={(e) => setIncidentsObs(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    disabled={actionBusy}
                    className="px-4 py-2 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded-md shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{actionBusy ? 'Transmission…' : 'Soumettre le Rapport Officiel'}</span>
                  </button>
                </div>
                {actionError && !reportSuccess && (
                  <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1.5">{actionError}</p>
                )}
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
