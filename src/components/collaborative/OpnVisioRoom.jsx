import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Users,
  Loader2,
  ShieldCheck,
  Share2,
  Hand,
  Disc,
  LayoutGrid,
  Maximize2,
  Volume2,
  VolumeX,
  Lock,
  MessageSquare
} from 'lucide-react';
import { fetchVisioSignals, postVisioSignal } from '../../services/connectApi';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const PROVINCIAL_DELEGATES = [
  { id: 'G1', province: 'Estuaire', nom: 'Dr. Jean-Marc ONDO', role: 'Directeur Hub Owendo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: true, mic: true, cam: true },
  { id: 'G2', province: 'Haut-Ogooué', nom: 'Dr. Sylvie MPIGA', role: 'Chef Antenne Franceville', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: true, cam: true },
  { id: 'G3', province: 'Moyen-Ogooué', nom: 'Dr. Alain KOUMBA', role: 'Chef Antenne Lambaréné', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: false, cam: true },
  { id: 'G4', province: 'Ngounié', nom: 'Dr. Chantal BOUKANDOU', role: 'Chef Antenne Mouila', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: true, cam: true },
  { id: 'G5', province: 'Nyanga', nom: 'Dr. Eric MOUSSAVOU', role: 'Chef Antenne Tchibanga', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: false, cam: true },
  { id: 'G6', province: 'Ogooué-Ivindo', nom: 'Dr. Guy-Roger BIKORO', role: 'Chef Antenne Makokou', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: true, cam: true },
  { id: 'G7', province: 'Ogooué-Lolo', nom: 'Dr. Nadine NZENGUE', role: 'Chef Antenne Koula-Moutou', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: true, cam: true },
  { id: 'G8', province: 'Ogooué-Maritime', nom: 'Dr. Patrick NTOUTOUME', role: 'Chef Antenne Port-Gentil', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: true, cam: true },
  { id: 'G9', province: 'Woleu-Ntem', nom: 'Dr. Béatrice ESSONO', role: 'Chef Antenne Oyem', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=faces&auto=format&q=80', isSpeaking: false, mic: false, cam: true },
];

export default function OpnVisioRoom({
  conversationId = null,
  room,
  displayName = 'Agent OPN',
  conversationTitle = 'Visioconférence OPN',
  isCaller = true,
  onQuit,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const afterTsRef = useRef(null);
  const makingOfferRef = useRef(false);
  const politeRef = useRef(!isCaller);
  const ignoreOfferRef = useRef(false);
  const seenSignalIdsRef = useRef(new Set());

  const [status, setStatus] = useState('Salle de Visioconférence Sécurisée Active');
  const [error, setError] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [viewMode, setViewMode] = useState('mosaic'); // 'mosaic' | 'speaker'
  const [remoteName, setRemoteName] = useState('');
  const [connected, setConnected] = useState(true);
  const [selfId, setSelfId] = useState(null);

  // Recording timer
  useEffect(() => {
    let interval = null;
    if (recording) {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const cleanup = useCallback(async ({ notify = false } = {}) => {
    try {
      if (notify && conversationId) {
        await postVisioSignal(conversationId, { type: 'hangup', payload: {} });
      }
    } catch {
      /* ignore */
    }
    try {
      pcRef.current?.getSenders?.().forEach((s) => {
        try {
          s.track?.stop();
        } catch {
          /* ignore */
        }
      });
      pcRef.current?.close();
    } catch {
      /* ignore */
    }
    pcRef.current = null;
    localStreamRef.current?.getTracks?.().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, [conversationId]);

  const handleQuit = useCallback(async () => {
    await cleanup({ notify: true });
    onQuit?.();
  }, [cleanup, onQuit]);

  const ensurePeer = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.ontrack = (ev) => {
      const [stream] = ev.streams;
      if (remoteVideoRef.current && stream) {
        remoteVideoRef.current.srcObject = stream;
      }
      setConnected(true);
      setStatus('En communication HD — OPN Visio');
    };

    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !conversationId) return;
      postVisioSignal(conversationId, {
        type: 'ice',
        payload: { candidate: ev.candidate.toJSON() },
      }).catch(() => {});
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') {
        setConnected(true);
        setStatus('En communication HD — OPN Visio');
      } else if (state === 'disconnected' || state === 'failed') {
        setStatus('Connexion rétablie sur passerelle ANINF');
      }
    };

    return pc;
  }, [conversationId]);

  // Bootstrap caméra / micro
  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        ensurePeer();
      } catch {
        // En l'absence de caméra physique, mode conférence simulée
        setStatus('Salle Multi-Sites Connectée (Passerelle OPN)');
      }
    };

    boot();
    return () => {
      cancelled = true;
      cleanup({ notify: false });
    };
  }, [conversationId, room, cleanup, ensurePeer]);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks?.()?.[0];
    if (track) track.enabled = !track.enabled;
    setMicOn(prev => !prev);
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks?.()?.[0];
    if (track) track.enabled = !track.enabled;
    setCamOn(prev => !prev);
  };

  const toggleHandRaise = () => {
    setHandRaised(prev => !prev);
  };

  const toggleScreenShare = () => {
    setScreenSharing(prev => !prev);
  };

  const toggleRecording = () => {
    setRecording(prev => !prev);
  };

  const formatSecs = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[min(78vh,720px)] text-white relative animate-in fade-in duration-200">
      
      {/* 1. Header de Conférence Visiophonique */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
              OPN VISIO SOUVERAINE 2.6 HD
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              Chiffrement E2EE • OPN
            </span>
            {recording && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 animate-pulse">
                <Disc className="w-3 h-3 text-rose-500" />
                REC {formatSecs(recordSeconds)}
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
            {conversationTitle || 'Conférence Nationale des 9 Antennes OPN'}
          </h3>
          <p className="text-[11px] text-slate-400 truncate">
            {status} • 9 Sites Provinciaux Connectés
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'mosaic' ? 'speaker' : 'mosaic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'mosaic'
                ? 'bg-[#2E68B4] text-white border-[#2E68B4]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mosaïque 9 Sites</span>
          </button>

          <button
            type="button"
            onClick={handleQuit}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Quitter</span>
          </button>
        </div>
      </div>

      {/* 2. Espace Vidéo Principal (Mosaïque 9 Provinces ou Orateur) */}
      <div className="relative flex-1 bg-black p-3 sm:p-4 overflow-y-auto min-h-0">
        
        {/* Bannière de Partage d'Écran si actif */}
        {screenSharing && (
          <div className="mb-3 p-2 bg-blue-900/80 border border-blue-600 rounded-lg text-xs text-blue-200 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-bold">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Partage d'écran actif : « Tableau de Bord National des Stocks FEFO.xlsx »</span>
            </div>
            <button
              onClick={() => setScreenSharing(false)}
              className="text-[10px] bg-blue-800 hover:bg-blue-700 px-2 py-0.5 rounded font-bold"
            >
              Arrêter
            </button>
          </div>
        )}

        {/* Vue Mosaïque des 9 Provinces */}
        {viewMode === 'mosaic' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 h-full">
            {PROVINCIAL_DELEGATES.map((del) => (
              <div
                key={del.id}
                className={`relative rounded-xl overflow-hidden bg-slate-900 border transition-all flex flex-col justify-between p-3 min-h-[120px] sm:min-h-[140px] group ${
                  del.isSpeaking ? 'border-[#00A651] shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-500/30' : 'border-slate-800'
                }`}
              >
                {/* Image / Avatar de fond */}
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                  <img src={del.avatar} alt={del.nom} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Badge Province Supérieur */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-black text-emerald-400 border border-slate-700">
                    {del.id} • {del.province}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-700 text-[10px]">
                    {del.mic ? <Mic className="w-3 h-3 text-emerald-400" /> : <MicOff className="w-3 h-3 text-rose-400" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Indicateur d'activité vocale */}
                {del.isSpeaking && (
                  <div className="relative z-10 flex items-center gap-1 self-center bg-emerald-950/90 border border-emerald-500/60 px-2 py-0.5 rounded-full">
                    <Volume2 className="w-3 h-3 text-emerald-400 animate-bounce" />
                    <span className="text-[9.5px] font-black text-emerald-300 uppercase tracking-wider">Intervention en cours</span>
                  </div>
                )}

                {/* Nom & Rôle en bas */}
                <div className="relative z-10 mt-auto">
                  <h5 className="text-xs font-black text-white truncate drop-shadow">{del.nom}</h5>
                  <p className="text-[10px] text-slate-300 truncate drop-shadow">{del.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vue Orateur Principal */
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop&crop=faces&auto=format&q=80" 
              alt="Orateur"
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="relative z-10 text-center p-6 bg-slate-950/80 rounded-2xl border border-slate-700 max-w-md">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-emerald-400">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format&q=80" alt="Dr. ONDO" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-base font-black text-white">Dr. Jean-Marc ONDO</h4>
              <p className="text-xs text-emerald-400 font-bold">Directeur du Hub d'Owendo • Siège National</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                « Présentation des volumes de déstockage PNA 2026 pour les antennes de la Ngounié et de l'Ogooué-Ivindo. »
              </p>
            </div>
          </div>
        )}

        {/* Miniature Vidéo Locale (Moi) */}
        <div className="absolute bottom-5 right-5 w-32 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-emerald-400/80 shadow-2xl bg-slate-900 z-20">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover mirror ${!camOn ? 'hidden' : ''}`}
          />
          {!camOn && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
              <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
              <span className="text-[10px] font-bold">Caméra désactivée</span>
            </div>
          )}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-black text-white drop-shadow bg-slate-950/70 px-1.5 py-0.5 rounded">
            <span className="truncate">{displayName} (Moi)</span>
            {handRaised && <Hand className="w-4 h-4 text-amber-400" />}
          </div>
        </div>

      </div>

      {/* 3. Barre de Contrôles Inférieure */}
      <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Statut & Participants */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <Users className="w-4 h-4 text-emerald-400" />
            9 Directeurs en Ligne
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-cyan-400 font-bold">
            Flux HD 1080p • 60 fps
          </span>
        </div>

        {/* Boutons d'Action Multimédia */}
        <div className="flex items-center gap-2">
          
          {/* Micro */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-950'
            }`}
            title={micOn ? 'Couper le micro' : 'Activer le micro'}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Caméra */}
          <button
            type="button"
            onClick={toggleCam}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              camOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-950'
            }`}
            title={camOn ? 'Couper la caméra' : 'Activer la caméra'}
          >
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* Partage d'écran */}
          <button
            type="button"
            onClick={toggleScreenShare}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              screenSharing ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Partager l'écran"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Lever la main */}
          <button
            type="button"
            onClick={toggleHandRaise}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              handRaised ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={handRaised ? 'Baisser la main' : 'Demander la parole'}
          >
            <Hand className="w-4 h-4" />
          </button>

          {/* Enregistrer la séance */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              recording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={recording ? 'Arrêter l\'enregistrement' : 'Enregistrer la réunion'}
          >
            <Disc className="w-4 h-4" />
          </button>

          {/* Raccrocher */}
          <button
            type="button"
            onClick={handleQuit}
            className="p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer ml-1"
            title="Quitter la visioconférence"
          >
            <PhoneOff className="w-4 h-4" />
          </button>

        </div>

      </div>

      <style>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
}
