import React, { useEffect, useRef, useState } from 'react';
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
import { ensureSanctumSessionForPersona, getDemoPasswordForEmail, isRealSanctumToken } from '../../services/sanctumSession';
import { PROFILS_DEFAUT, USERS_PERSONAS, grouperProfilsDefaut } from '../../data/usersPersonas';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentPersona }) {
  const [email, setEmail] = useState(currentPersona?.email || 'jb.obame@opn.ga');
  const [password, setPassword] = useState('OPN2026@Libreville');
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpHint, setOtpHint] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [connectingPersonaId, setConnectingPersonaId] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const connectSeqRef = useRef(0);

  useEffect(() => {
    if (isOpen) return;
    setRequires2FA(false);
    setFormLoading(false);
    setErrorMessage('');
    setSuccessMessage('');
    setOtpCode('');
  }, [isOpen]);

  const mergePersonaWithApiUser = (persona, apiUser = {}) => {
    const antenneNum = apiUser.antenne_id || apiUser.antenneId || apiUser.province_id || null;
    return {
      ...persona,
      ...apiUser,
      nom: persona.nom || apiUser.nom || apiUser.name,
      name: apiUser.name || persona.nom,
      role: persona.role || apiUser.role,
      codeRole: persona.codeRole || apiUser.code_role || apiUser.codeRole,
      provinceId: persona.provinceId || apiUser.provinceId,
      province_id: antenneNum || apiUser.province_id,
      antenneId: antenneNum,
      antenne_id: antenneNum,
      structureId: apiUser.structure_id || apiUser.structureId,
      structure_id: apiUser.structure_id || apiUser.structureId,
      email: persona.email || apiUser.email,
      avatar: persona.avatar,
      habilitations: apiUser.habilitations || persona.habilitations,
    };
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      connectSeqRef.current += 1;
      setConnectingPersonaId(null);
      const res = await loginUser(email, password);

      if (res?.skipped) {
        setFormLoading(false);
        return;
      }
      if (res?.backendUnavailable) {
        setFormLoading(false);
        setSuccessMessage('');
        return;
      }
      if (res.requires_2fa && res.dev_otp_hint) {
        const verified = await verify2FA(email, String(res.dev_otp_hint));
        setFormLoading(false);
        if (verified?.skipped) return;
        if (verified?.backendUnavailable) {
          setSuccessMessage('');
          return;
        }
        if (verified?.token && isRealSanctumToken(verified.token)) {
          setSuccessMessage('Connexion réussie ! Session Sanctum active.');
          const matched = USERS_PERSONAS.find(p => p.email === email) || {
            id: 'USER-OPN',
            nom: verified.user?.nom || email.split('@')[0],
            email,
            role: 'Agent Métier OPN',
            codeRole: 'AGENT',
            initiales: 'OPN',
          };
          onAuthSuccess(mergePersonaWithApiUser(matched, verified.user), verified.token);
          onClose();
          return;
        }
        setRequires2FA(true);
        setOtpHint(String(res.dev_otp_hint));
        setErrorMessage(verified?.message || 'Code de sécurité refusé.');
      } else if (res.requires_2fa) {
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
          if (!session.backendUnavailable) {
            setErrorMessage(session.message || res.message || 'Identifiants invalides ou session impossible.');
          }
          setSuccessMessage('');
        }
      }
    } catch (err) {
      setFormLoading(false);
      if (!err?.backendUnavailable) setErrorMessage(err?.message || 'Erreur de connexion.');
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

  const remplirFormulaire = (persona) => {
    if (!persona?.email) return;
    setEmail(persona.email);
    const motDePasse = getDemoPasswordForEmail(persona.email);
    if (motDePasse) setPassword(motDePasse);
    setFormKey((n) => n + 1);
  };

  const handleInstantPersonaLogin = async (persona) => {
    const seq = ++connectSeqRef.current;
    remplirFormulaire(persona);
    setConnectingPersonaId(persona.id);
    setErrorMessage('');
    setSuccessMessage(`Connexion — ${persona.nom}`);
    try {
      const session = await ensureSanctumSessionForPersona(persona, { forceNew: true, preferQuick: true });
      if (session?.skipped || seq !== connectSeqRef.current) return;
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
        if (!session.backendUnavailable) {
          setErrorMessage(session.message || 'Impossible d’ouvrir la session.');
        }
        setSuccessMessage('');
      }
    } catch (err) {
      if (seq !== connectSeqRef.current) return;
      setConnectingPersonaId(null);
      setSuccessMessage('');
      if (!err?.backendUnavailable) setErrorMessage(err?.message || 'Connexion impossible.');
    }
  };

  const { nationaux, paires } = grouperProfilsDefaut(PROFILS_DEFAUT);

  const boutonProfil = (p, compact = false) => {
    if (!p) return null;
    const isConnecting = connectingPersonaId === p.id;
    const accent = p.accentColor || '#2E68B4';
    return (
      <button
        key={p.id}
        type="button"
        onClick={() => handleInstantPersonaLogin(p)}
        style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
        className={`w-full p-2.5 rounded bg-white border text-left transition-all flex items-center justify-between gap-2 shadow-xs ${
          isConnecting
            ? 'border-[#00A651] ring-1 ring-[#00A651]/40'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className={`${compact ? 'w-7 h-7 text-[9px]' : 'w-8 h-8 text-[10px]'} rounded-full ${p.badgeColor || 'bg-slate-500'} text-white font-black flex items-center justify-center shrink-0 border border-white shadow-sm`}>
            {p.initiales || 'OPN'}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-bold text-slate-900 leading-snug ${compact ? 'text-[11px]' : 'text-xs'}`}>{p.nom}</p>
            <p className={`font-semibold leading-snug ${compact ? 'text-[9px]' : 'text-[10px]'}`} style={{ color: accent }}>{p.role}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-[10px] font-bold rounded shrink-0 transition-colors shadow-xs inline-flex items-center gap-1 text-white ${
            isConnecting ? 'bg-emerald-600' : ''
          }`}
          style={isConnecting ? undefined : { backgroundColor: accent }}
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
  };

  const personaList = (
    <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col min-h-0">
      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
        Profils par défaut
      </span>
      <p className="text-[11px] text-slate-500 mt-1 mb-3">
        Ouvrez une session de démonstration sans saisir les identifiants.
      </p>
      <div className="space-y-3 overflow-y-auto max-h-[52vh] pr-1">
        <div className="space-y-2">
          {nationaux.map((p) => boutonProfil(p))}
        </div>

        {paires.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pt-2">
              9 antennes — Chef et Demandeur côte à côte
            </p>
            {paires.map((paire) => (
              <div key={paire.id} className="rounded-md border border-slate-200 bg-white/70 p-2 space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-600 px-0.5">
                  {paire.nom}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {boutonProfil(paire.chef, true)}
                  {boutonProfil(paire.demandeur, true)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center px-3 sm:px-4 pt-24 sm:pt-28 pb-8 overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full ${requires2FA ? 'max-w-xl' : 'max-w-7xl'} bg-white border border-slate-200 rounded-lg shadow-2xl relative flex flex-col max-h-[calc(100vh-8rem)]`}>
        <div className="flex items-start gap-3 px-6 sm:px-7 pt-5 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex-1 text-center space-y-1.5 pl-8">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 text-[#00A651] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {requires2FA ? 'Vérification 2FA' : 'Connexion Espace Métier (ERP OPN)'}
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] gap-5 items-start">
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs w-full max-w-[260px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Connexion personnalisée
            </span>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Identifiant ou email professionnel</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  key={`email-${formKey}`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@opn.ga"
                  autoComplete="username"
                  className="w-full pl-8 pr-2 py-1.5 text-[11px] border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Mot de passe</label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  key={`password-${formKey}`}
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-8 pr-2 py-1.5 text-[11px] border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2 px-3 rounded-md bg-[#00A651] hover:bg-[#008742] text-white font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1.5 mt-1 disabled:opacity-70"
            >
              {formLoading ? (
                <span>Vérification...</span>
              ) : (
                <>
                  <span>Se Connecter à l&apos;ERP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
