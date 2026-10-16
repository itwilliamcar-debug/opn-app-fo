import React, { useRef, useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Loader2,
} from 'lucide-react';
import { loginUser, verify2FA } from '../../services/api';
import { ensureSanctumSessionForPersona, isRealSanctumToken } from '../../services/sanctumSession';
import { PROFILS_DEFAUT, USERS_PERSONAS } from '../../data/usersPersonas';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentPersona }) {
  const [email, setEmail] = useState(currentPersona?.email || 'jb.obame@opn.ga');
  const [password, setPassword] = useState('OPN2026@Libreville');
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpHint, setOtpHint] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [connectingPersonaId, setConnectingPersonaId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const connectSeqRef = useRef(0);

  const mergePersonaWithApiUser = (persona, apiUser = {}) => ({
    ...persona,
    ...apiUser,
    nom: persona.nom || apiUser.nom || apiUser.name,
    role: persona.role || apiUser.role,
    codeRole: persona.codeRole || apiUser.code_role || apiUser.codeRole,
    provinceId: persona.provinceId || apiUser.provinceId,
    antenneId: apiUser.province_id || apiUser.provinceId || apiUser.antenne_id,
    antenne_id: apiUser.province_id || apiUser.antenne_id,
    structureId: apiUser.structure_id || apiUser.structureId,
    structure_id: apiUser.structure_id || apiUser.structureId,
    email: persona.email || apiUser.email,
    avatar: persona.avatar,
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await loginUser(email, password);

      if (res.requires_2fa) {
        setFormLoading(false);
        setRequires2FA(true);
        setOtpHint(res.dev_otp_hint || '');
        setSuccessMessage(res.message || 'Code 2FA transmis par SMS.');
      } else if (res.token && isRealSanctumToken(res.token)) {
        setFormLoading(false);
        setSuccessMessage('Connexion réussie ! Session Sanctum active.');
        const matched = USERS_PERSONAS.find(p => p.email === email) || {
          id: 'USER-OPN',
          nom: res.user?.nom || email.split('@')[0],
          email: email,
          role: 'Agent Métier OPN',
          codeRole: 'AGENT',
          initiales: 'OPN'
        };
        setTimeout(() => {
          onAuthSuccess(mergePersonaWithApiUser(matched, res.user), res.token);
          onClose();
        }, 200);
      } else {
        const persona = USERS_PERSONAS.find(p => p.email === email) || USERS_PERSONAS[0];
        setSuccessMessage('Ouverture de la session Sanctum...');
        const session = await ensureSanctumSessionForPersona(persona, { preferQuick: false });
        setFormLoading(false);
        if (session.success && isRealSanctumToken(session.token)) {
          onAuthSuccess(mergePersonaWithApiUser(persona, session.user), session.token);
          onClose();
        } else {
          setErrorMessage(session.message || res.message || 'Identifiants invalides ou API indisponible.');
          setSuccessMessage('');
        }
      }
    } catch (err) {
      setFormLoading(false);
      setErrorMessage(err?.message || 'Erreur de connexion à l’API Laravel.');
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage('');

    try {
      const res = await verify2FA(email, otpCode);
      setFormLoading(false);

      if (res.token && isRealSanctumToken(res.token)) {
        setSuccessMessage('Authentification forte 2FA validée ! Session Sanctum active.');
        const matched = USERS_PERSONAS.find(p => p.email === email) || USERS_PERSONAS[0];
        setTimeout(() => {
          onAuthSuccess(mergePersonaWithApiUser(matched, res.user), res.token);
          onClose();
        }, 200);
      } else {
        setErrorMessage(res.message || 'Code 2FA incorrect.');
      }
    } catch (err) {
      setFormLoading(false);
      setErrorMessage(err?.message || 'Erreur 2FA.');
    }
  };

  const handleInstantPersonaLogin = async (persona) => {
    const seq = ++connectSeqRef.current;
    setConnectingPersonaId(persona.id);
    setErrorMessage('');
    setSuccessMessage(`Connexion — ${persona.nom}`);
    try {
      const session = await ensureSanctumSessionForPersona(persona, { forceNew: true, preferQuick: true });
      if (seq !== connectSeqRef.current) return;
      setConnectingPersonaId(null);
      if (session.requires_2fa) {
        setEmail(persona.email);
        setRequires2FA(true);
        setOtpHint(session.dev_otp_hint || '');
        setSuccessMessage(session.message || 'Saisissez le code de vérification.');
        setConnectingPersonaId(null);
        return;
      }
      if (session.success && session.token) {
        onAuthSuccess(mergePersonaWithApiUser(persona, session.user), session.token);
        onClose();
      } else {
        setErrorMessage(session.message || 'Impossible d’activer Sanctum. Lancez npm run start:opn.');
        setSuccessMessage('');
      }
    } catch (err) {
      if (seq !== connectSeqRef.current) return;
      setConnectingPersonaId(null);
      setSuccessMessage('');
      setErrorMessage(err?.message || 'API Laravel injoignable (127.0.0.1:8002).');
    }
  };

  const personaList = (
    <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col min-h-0">
      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
        Profils par défaut
      </span>
      <p className="text-[11px] text-slate-500 mt-1 mb-3">
        Ouvrez une session de démonstration sans saisir les identifiants.
      </p>
      <div className="space-y-2 overflow-y-auto max-h-[52vh] pr-1">
        {PROFILS_DEFAUT.map((p) => {
          const isConnecting = connectingPersonaId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleInstantPersonaLogin(p)}
              className={`w-full p-2.5 rounded bg-white border text-left transition-all flex items-center justify-between gap-2 shadow-xs ${
                isConnecting
                  ? 'border-[#00A651] ring-1 ring-[#00A651]/40'
                  : 'border-slate-200 hover:border-[#2E68B4]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={p.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">{p.nom}</p>
                  <p className="text-[10px] text-[#2E68B4] font-semibold truncate">{p.role}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-bold rounded shrink-0 transition-colors shadow-xs inline-flex items-center gap-1 ${
                  isConnecting
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2E68B4] hover:bg-[#215091] text-white'
                }`}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    …
                  </>
                ) : (
                  'Ouvrir'
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center px-4 pt-32 pb-8 overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full ${requires2FA ? 'max-w-xl' : 'max-w-5xl'} bg-white border border-slate-200 rounded-lg shadow-2xl relative flex flex-col max-h-[calc(100vh-10rem)]`}>
        <div className="flex items-start gap-3 px-6 sm:px-7 pt-5 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex-1 text-center space-y-1.5 pl-8">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 text-[#00A651] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {requires2FA ? 'Vérification 2FA' : 'Connexion Espace Métier (ERP OPN)'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {requires2FA
                ? 'Saisissez le code de sécurité temporaire reçu par SMS ou token.'
                : 'Accès sécurisé pour la Direction Générale, les Approvisionnements et les 9 Antennes Provinciales.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 text-slate-500 hover:text-slate-800 p-1.5 rounded-md hover:bg-slate-100 border border-slate-200 bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 sm:px-7 py-5 space-y-5">

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!requires2FA ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Connexion personnalisée
            </span>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Identifiant ou email professionnel</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@opn.ga"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Mot de passe</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2.5 px-4 rounded-md bg-[#00A651] hover:bg-[#008742] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {formLoading ? (
                <span>Vérification des accès...</span>
              ) : (
                <>
                  <span>Se Connecter à l&apos;ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          {personaList}
          </div>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900">
              <p className="font-bold">Code OTP 2FA Requis</p>
              <p className="text-[11px] mt-0.5">{otpHint || 'Code de validation à 6 chiffres envoyé au terminal enregistré.'}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Code à 6 chiffres</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono text-center text-base tracking-widest bg-white focus:outline-none focus:border-[#2E68B4]"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2.5 px-4 rounded-md bg-[#00A651] hover:bg-[#008742] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Valider le code 2FA</span>
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
