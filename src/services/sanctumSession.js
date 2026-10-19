/**
 * Session Sanctum OPN — login réel aligné sur DatabaseSeeder
 * (démo : mots de passe connus + 2FA auto via dev_otp_hint — DEV uniquement)
 */
import { loginUser, verify2FA, setAuthToken, getAuthToken, fetchAuthMe, demoQuickLogin } from './api';

/** Mots de passe des profils de démonstration, y compris sur le site en ligne. */
const DEMO_LOGIN_ENABLED = true;

export const DEMO_PASSWORDS_BY_EMAIL = DEMO_LOGIN_ENABLED
  ? {
      'superadmin@opn.ga': 'OPN2026@SuperAdmin',
      'admin.metier@opn.ga': 'OPN2026@Metier',
      'admin.it@opn.ga': 'OPN2026@AdminIT',
      'jb.obame@opn.ga': 'OPN2026@Libreville',
      'dir.operations@opn.ga': 'OPN2026@Direction',
      'daf@opn.ga': 'OPN2026@Finance',
      's.ntsame@opn.ga': 'OPN2026@Owendo',
      'g.ndzie@opn.ga': 'OPN2026@CollabAppro',
      'j.obiang@opn.ga': 'OPN2026@CollabAppro2',
      'achats@opn.ga': 'OPN2026@Achats',
      'pharmacien.national@opn.ga': 'OPN2026@PharmacieNat',
      'pharmacie.frv@opn.ga': 'OPN2026@PharmacieFrv',
      'chef.antenne.est@opn.ga': 'OPN2026@Estuaire',
      'chef.antenne.frv@opn.ga': 'OPN2026@Franceville',
      'chef.antenne.lam@opn.ga': 'OPN2026@Lambarene',
      'chef.antenne.mou@opn.ga': 'OPN2026@Mouila',
      'chef.antenne.tch@opn.ga': 'OPN2026@Tchibanga',
      'chef.antenne.mak@opn.ga': 'OPN2026@Makokou',
      'chef.antenne.klm@opn.ga': 'OPN2026@KoulaMoutou',
      'chef.antenne.pog@opn.ga': 'OPN2026@PortGentil',
      'chef.antenne.oye@opn.ga': 'OPN2026@Oyem',
      'pharmacie.est@opn.ga': 'OPN2026@PharmaEst',
      'pharmacie.demandeur.frv@opn.ga': 'OPN2026@PharmaFrv',
      'pharmacie.lam@opn.ga': 'OPN2026@PharmaLam',
      'pharmacie.mou@opn.ga': 'OPN2026@PharmaMou',
      'pharmacie.tch@opn.ga': 'OPN2026@PharmaTch',
      'pharmacie.mak@opn.ga': 'OPN2026@PharmaMak',
      'pharmacie.klm@opn.ga': 'OPN2026@PharmaKlm',
      'pharmacien.pog@opn.ga': 'OPN2026@PharmaciePog',
      'pharmacie.oye@opn.ga': 'OPN2026@PharmaOye',
      'commercial.oyem@opn.ga': 'OPN2026@Vendeur',
      'urgences@opn.ga': 'OPN2026@Urgences',
      'logistique@opn.ga': 'OPN2026@Logistique',
      'securite.convois@opn.ga': 'OPN2026@Securite',
      'convoyeur@opn.ga': 'OPN2026@Convoyeur',
      'structure.pog@opn.ga': 'OPN2026@ChrPog',
      'communication@opn.ga': 'OPN2026@Com',
      'audit.interne@opn.ga': 'OPN2026@Audit',
    }
  : {};

const DEFAULT_DEMO_PASSWORD = DEMO_LOGIN_ENABLED ? 'OPN2026@Libreville' : null;

/** Token Sanctum Laravel : "{id}|{hash}" — pas les faux token-OPN-... */
export function isRealSanctumToken(token) {
  if (!token || typeof token !== 'string') return false;
  if (token.startsWith('token-')) return false;
  return token.includes('|') && token.length > 20;
}

export function getDemoPasswordForEmail(email) {
  if (!DEMO_LOGIN_ENABLED || !email) return null;
  return DEMO_PASSWORDS_BY_EMAIL[String(email).toLowerCase()] || DEFAULT_DEMO_PASSWORD;
}

/**
 * Ouvre / rafraîchit une session Sanctum pour un persona (email).
 * Priorité : demo-quick (local) — JAMAIS de bcrypt enchaîné derrière (sature artisan serve).
 */
export async function ensureSanctumSessionForPersona(personaOrEmail, options = {}) {
  const email =
    typeof personaOrEmail === 'string'
      ? personaOrEmail
      : personaOrEmail?.email;

  if (!email) {
    return { success: false, message: 'Email persona manquant.' };
  }

  const forceNew = options.forceNew === true;
  const preferQuick = options.preferQuick !== false && DEMO_LOGIN_ENABLED;

  if (!forceNew) {
    const current = getAuthToken();
    if (isRealSanctumToken(current)) {
      try {
        const me = await fetchAuthMe();
        const meEmail = me?.email || me?.user?.email;
        if (meEmail && String(meEmail).toLowerCase() === String(email).toLowerCase()) {
          return { success: true, token: current, user: me?.user || me, reused: true };
        }
        setAuthToken(null);
      } catch {
        setAuthToken(null);
      }
    }
  } else {
    setAuthToken(null);
  }

  if (preferQuick) {
    const quick = await demoQuickLogin(email);
    if (quick?.skipped) return { success: false, skipped: true };
    if (quick?.token && isRealSanctumToken(quick.token)) {
      setAuthToken(quick.token);
      return { success: true, token: quick.token, user: quick.user, demo_quick: true };
    }
    if (quick?.backendUnavailable) {
      return { success: false, backendUnavailable: true, message: '' };
    }
  }

  const password = getDemoPasswordForEmail(email);
  if (!password) {
    return {
      success: false,
      message:
        'Login demode desactive en production. Saisissez email/mot de passe dans Acces Intranet.',
    };
  }

  const loginRes = await loginUser(email, password);

  if (loginRes?.skipped) return { success: false, skipped: true };
  if (loginRes?.backendUnavailable) {
    return { success: false, backendUnavailable: true, message: '' };
  }

  if (loginRes?.token && isRealSanctumToken(loginRes.token)) {
    setAuthToken(loginRes.token);
    return { success: true, token: loginRes.token, user: loginRes.user };
  }

  if (loginRes?.requires_2fa) {
    const otp = loginRes.dev_otp_hint;
    if (!otp) {
      return {
        success: false,
        requires_2fa: true,
        email,
        message: loginRes.message || 'Saisissez le code de vérification reçu.',
      };
    }
    const otpRes = await verify2FA(email, String(otp));
    if (otpRes?.token && isRealSanctumToken(otpRes.token)) {
      setAuthToken(otpRes.token);
      return { success: true, token: otpRes.token, user: otpRes.user };
    }
    return {
      success: false,
      message: otpRes?.message || 'Echec validation 2FA Sanctum.',
    };
  }

  return {
    success: false,
    message: loginRes?.message || 'Impossible d’obtenir un token Sanctum.',
  };
}
