/**
 * Session Sanctum OPN — login réel aligné sur DatabaseSeeder
 * (démo : mots de passe connus + 2FA auto via dev_otp_hint — DEV uniquement)
 */
import { loginUser, verify2FA, setAuthToken, getAuthToken, fetchAuthMe, demoQuickLogin } from './api';

/** Mots de passe démo = seeder Laravel — jamais embarqués en build production */
const DEMO_LOGIN_ENABLED =
  import.meta.env.DEV === true || import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true';

export const DEMO_PASSWORDS_BY_EMAIL = DEMO_LOGIN_ENABLED
  ? {
      'superadmin@opn.ga': 'OPN2026@SuperAdmin',
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
      'chef.antenne.pog@opn.ga': 'OPN2026@PortGentil',
      'urgences@opn.ga': 'OPN2026@Urgences',
      'logistique@opn.ga': 'OPN2026@Logistique',
      'securite.convois@opn.ga': 'OPN2026@Securite',
      'convoyeur@opn.ga': 'OPN2026@Convoyeur',
      'pharmacien.pog@opn.ga': 'OPN2026@PharmaciePog',
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

  // Chemin rapide démo — exclusif (pas de fallback bcrypt qui empile 1–20 s par tentative)
  if (preferQuick) {
    const quick = await demoQuickLogin(email);
    if (quick?.token && isRealSanctumToken(quick.token)) {
      setAuthToken(quick.token);
      return { success: true, token: quick.token, user: quick.user, demo_quick: true };
    }
    return {
      success: false,
      message:
        quick?.message ||
        'Login démo impossible. Vérifiez npm run start:opn puis réessayez.',
    };
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

  if (loginRes?.token && isRealSanctumToken(loginRes.token)) {
    setAuthToken(loginRes.token);
    return { success: true, token: loginRes.token, user: loginRes.user };
  }

  if (loginRes?.requires_2fa) {
    const otp = loginRes.dev_otp_hint;
    if (!otp) {
      return {
        success: false,
        message: '2FA requis — saisissez le code OTP (hint dispo en env local seulement).',
        requires_2fa: true,
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
