import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Phone, Video, X } from 'lucide-react';
import { getAuthToken } from '../../services/api';
import { isRealSanctumToken } from '../../services/sanctumSession';
import {
  fetchIncomingVisioInvites,
  fetchJitsiRoom,
  readVisioRing,
  subscribeVisioRing,
} from '../../services/connectApi';

const DISMISS_KEY = 'opn_visio_invite_dismissed';

function loadDismissed() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(DISMISS_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function saveDismissed(set) {
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...set].slice(-50)));
  } catch {
    /* ignore */
  }
}

function normalizeInvite(raw, myEmail) {
  if (!raw) return null;
  const callerEmail = String(raw.caller_email || raw.callerEmail || '').toLowerCase();
  const me = String(myEmail || '').toLowerCase();
  if (me && callerEmail && callerEmail === me) return null;

  const targets = Array.isArray(raw.targets) ? raw.targets : null;
  if (targets && me) {
    const hit = targets.some((t) => {
      const email = String(t?.email || t || '').toLowerCase();
      return email === me;
    });
    // Si la sonnerie locale liste des cibles et que je n'y suis pas → ignorer
    if (targets.length > 0 && !hit) return null;
  }

  const startedAt = raw.started_at || raw.startedAt || raw.published_at || raw.created_at;
  if (startedAt) {
    const age = Date.now() - new Date(startedAt).getTime();
    if (Number.isFinite(age) && age > 20 * 60 * 1000) return null;
  }

  const messageId = raw.message_id || raw.messageId || null;
  const conversationId = raw.conversation_id || raw.conversationId;
  if (!conversationId && !raw.room) return null;

  const dismissKey = String(
    messageId || `${conversationId}-${startedAt || raw.room || 'ring'}`
  );

  return {
    messageId,
    conversationId,
    room: raw.room || null,
    callerName: raw.caller_name || raw.callerName || 'Collègue OPN',
    title: raw.title || raw.conversationTitle || 'Visioconférence OPN',
    startedAt,
    dismissKey,
  };
}

/**
 * Bannière globale — invitation visio (API dédiée + sonnerie multi-onglets).
 */
export default function IncomingVisioBanner({
  activePersona,
  sanctumReady = false,
  onJoin,
  pollMs = 12000,
}) {
  const [invite, setInvite] = useState(null);
  const dismissedRef = useRef(loadDismissed());
  const busyRef = useRef(false);
  const myEmail = activePersona?.email || null;

  const applyCandidate = useCallback(
    (raw) => {
      const normalized = normalizeInvite(raw, myEmail);
      if (!normalized) return false;
      if (dismissedRef.current.has(normalized.dismissKey)) return false;
      setInvite(normalized);
      return true;
    },
    [myEmail]
  );

  const scanApi = useCallback(async () => {
    if (!sanctumReady || !isRealSanctumToken(getAuthToken())) {
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const list = await fetchIncomingVisioInvites();
      let found = null;
      for (const item of list || []) {
        const normalized = normalizeInvite(item, myEmail);
        if (!normalized) continue;
        if (dismissedRef.current.has(normalized.dismissKey)) continue;
        found = normalized;
        break;
      }
      setInvite(found);
    } catch {
      /* silencieux */
    } finally {
      busyRef.current = false;
    }
  }, [sanctumReady, myEmail]);

  useEffect(() => {
    // Sonnerie déjà présente (autre onglet vient d'appeler)
    applyCandidate(readVisioRing());

    const unsubscribe = subscribeVisioRing((payload) => {
      applyCandidate(payload);
    });

    scanApi();
    const timer = setInterval(scanApi, pollMs);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [applyCandidate, scanApi, pollMs]);

  // Re-scan immédiat quand le persona / session DAF devient prêt
  useEffect(() => {
    if (sanctumReady && myEmail) {
      applyCandidate(readVisioRing());
      scanApi();
    }
  }, [sanctumReady, myEmail, applyCandidate, scanApi]);

  const dismiss = () => {
    if (invite?.dismissKey) {
      dismissedRef.current.add(invite.dismissKey);
      saveDismissed(dismissedRef.current);
    }
    setInvite(null);
  };

  const join = async () => {
    if (!invite) return;
    let room = invite.room;
    try {
      if (!room && invite.conversationId) {
        const info = await fetchJitsiRoom(invite.conversationId);
        room = info?.room || info?.room_name || info?.jitsi_room || info?.data?.room;
      }
    } catch {
      /* join with whatever we have */
    }
    const payload = {
      conversationId: invite.conversationId,
      room,
      title: invite.title || 'Visioconférence OPN',
      callerName: invite.callerName,
    };
    dismiss();
    onJoin?.(payload);
  };

  if (!invite) return null;

  return (
    <div className="fixed top-16 left-1/2 z-[200] w-[min(96vw,440px)] -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300 print:hidden">
      <div className="rounded-md border-2 border-emerald-500 bg-white shadow-2xl overflow-hidden ring-4 ring-emerald-200/60">
        <div className="flex items-center gap-2 bg-emerald-700 px-3 py-2.5 text-white">
          <Phone className="w-4 h-4 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wide flex-1">
            Appel entrant — OPN Connect
          </p>
          <button type="button" onClick={dismiss} className="p-0.5 rounded hover:bg-emerald-600" aria-label="Ignorer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-3 space-y-2 bg-emerald-50/40">
          <p className="text-sm font-black text-slate-900">{invite.callerName}</p>
          <p className="text-xs text-slate-700">
            vous invite à la visioconférence
            {invite.title ? (
              <>
                {' '}
                « <strong>{invite.title}</strong> »
              </>
            ) : (
              '.'
            )}
          </p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={join}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-[#00A651] hover:bg-[#008f45] px-3 py-2.5 text-xs font-bold text-white shadow-sm"
            >
              <Video className="w-3.5 h-3.5" />
              Rejoindre maintenant
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
