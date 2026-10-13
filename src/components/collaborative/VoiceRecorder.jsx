import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Send, X } from 'lucide-react';

const PREFERRED_MIME = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null;
  return PREFERRED_MIME.find((t) => MediaRecorder.isTypeSupported(t)) || '';
}

/**
 * Enregistreur vocal MediaRecorder pour OPN Connect
 */
export default function VoiceRecorder({
  onSend,
  onCancel,
  disabled,
  onRecordingChange,
}) {
  const [unsupported, setUnsupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);

  useEffect(() => {
    if (typeof MediaRecorder === 'undefined') {
      setUnsupported(true);
    }
    return () => {
      stopTracks();
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    onRecordingChange?.(isRecording);
  }, [isRecording, onRecordingChange]);

  function stopTracks() {
    streamRef.current?.getTracks()?.forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    if (disabled || unsupported) return;
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      chunksRef.current = [];
      secondsRef.current = 0;
      setSeconds(0);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
    } catch (err) {
      setError(
        err?.name === 'NotAllowedError'
          ? 'Micro refusé — autorisez l’accès navigateur.'
          : 'Impossible de démarrer l’enregistrement audio.'
      );
      stopTracks();
    }
  }

  function cancelRecording() {
    clearInterval(timerRef.current);
    try {
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch {
      /* ignore */
    }
    stopTracks();
    chunksRef.current = [];
    setIsRecording(false);
    setSeconds(0);
    secondsRef.current = 0;
    onCancel?.();
  }

  function finishAndSend() {
    if (!mediaRecorderRef.current || sending) return;
    setSending(true);
    clearInterval(timerRef.current);

    const recorder = mediaRecorderRef.current;
    const mime =
      recorder.mimeType || pickMimeType() || 'audio/webm';
    const duration = Math.max(1, secondsRef.current);

    recorder.onstop = async () => {
      stopTracks();
      const blob = new Blob(chunksRef.current, { type: mime });
      chunksRef.current = [];
      setIsRecording(false);
      try {
        await onSend?.(blob, duration);
      } catch (err) {
        setError(err?.message || 'Échec envoi de la note vocale.');
      } finally {
        setSending(false);
        setSeconds(0);
        secondsRef.current = 0;
      }
    };

    try {
      if (recorder.state !== 'inactive') recorder.stop();
    } catch {
      setSending(false);
      setError('Enregistrement interrompu.');
    }
  }

  if (unsupported) {
    return (
      <div className="flex-1 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
        MediaRecorder non supporté par ce navigateur — notes vocales indisponibles.
      </div>
    );
  }

  if (!isRecording) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={startRecording}
          className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-[#2E68B4] transition-all disabled:opacity-40"
          title="Enregistrer une note vocale"
        >
          <Mic className="w-4 h-4" />
        </button>
        {error && (
          <span className="text-[11px] text-rose-600 font-medium truncate max-w-[10rem]">
            {error}
          </span>
        )}
      </div>
    );
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="w-full flex items-center justify-between gap-2 p-2 rounded-md bg-rose-50 border border-rose-200">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
        <span className="text-xs font-bold text-rose-700 truncate">
          Enregistrement… {mm}:{ss}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={cancelRecording}
          disabled={sending}
          className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          title="Annuler"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={finishAndSend}
          disabled={sending || seconds < 1}
          className="px-2.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-[11px] font-semibold flex items-center gap-1"
        >
          {sending ? (
            <Square className="w-3 h-3" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          Envoyer
        </button>
      </div>
    </div>
  );
}
