/**
 * Emojis OPN Connect — simples (style WhatsApp), sans animation.
 */
export const CONNECT_EMOJIS = [
  { code: 'smile', unicode: '😊', label: 'Sourire' },
  { code: 'grin', unicode: '😄', label: 'Content' },
  { code: 'laugh', unicode: '😂', label: 'Rire' },
  { code: 'wink', unicode: '😉', label: 'Clin d’œil' },
  { code: 'love', unicode: '😍', label: 'Amour' },
  { code: 'think', unicode: '🤔', label: 'Réfléchir' },
  { code: 'sad', unicode: '😢', label: 'Triste' },
  { code: 'angry', unicode: '😠', label: 'Colère' },
  { code: 'thumbsup', unicode: '👍', label: 'OK' },
  { code: 'thumbsdown', unicode: '👎', label: 'Non' },
  { code: 'clap', unicode: '👏', label: 'Bravo' },
  { code: 'pray', unicode: '🙏', label: 'Merci' },
  { code: 'heart', unicode: '❤️', label: 'Cœur' },
  { code: 'fire', unicode: '🔥', label: 'Top' },
  { code: 'check', unicode: '✅', label: 'Validé' },
  { code: 'party', unicode: '🎉', label: 'Fête' },
  { code: 'muscle', unicode: '💪', label: 'Force' },
  { code: 'gabon', unicode: '🇬🇦', label: 'Gabon' },
  { code: 'med', unicode: '💊', label: 'Pharma' },
  { code: 'truck', unicode: '🚚', label: 'Convoi' },
  { code: 'hospital', unicode: '🏥', label: 'Hôpital' },
  { code: 'phone', unicode: '📞', label: 'Appel' },
  { code: 'wave', unicode: '👋', label: 'Salut' },
  { code: 'ok', unicode: '👌', label: 'Parfait' },
];

/** Réactions rapides (barre sous message) */
export const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '👏', '🔥'];

export function getEmojiByCode(code) {
  return CONNECT_EMOJIS.find((e) => e.code === code) || null;
}

export function resolveEmojiDisplay(message) {
  const code = message?.emoji_code || message?.emojiCode;
  const fromCode = code ? getEmojiByCode(code) : null;
  if (fromCode) {
    return {
      unicode: fromCode.unicode,
      label: fromCode.label,
      code: fromCode.code,
    };
  }
  const body = message?.body || message?.texte || '';
  const match = CONNECT_EMOJIS.find((e) => body.includes(e.unicode));
  if (match) {
    return {
      unicode: match.unicode,
      label: match.label,
      code: match.code,
    };
  }
  return {
    unicode: body || '🙂',
    label: 'Emoji',
    code: code || 'custom',
  };
}

/**
 * Agrège les réactions API/meta au format WhatsApp :
 * [{ emoji, count, user_ids, reacted_by_me }]
 */
export function normalizeReactions(message, myUserId = null) {
  const raw = message?.reactions ?? message?.meta?.reactions ?? null;
  if (!raw) return [];

  // Déjà agrégé par l'API
  if (Array.isArray(raw) && raw.length > 0 && raw[0]?.emoji && raw[0]?.count != null) {
    return raw.map((row) => ({
      emoji: row.emoji,
      count: Number(row.count) || (row.user_ids || []).length || 0,
      user_ids: Array.isArray(row.user_ids) ? row.user_ids.map(Number) : [],
      reacted_by_me: Boolean(
        row.reacted_by_me ??
          (myUserId != null &&
            (row.user_ids || []).some((id) => String(id) === String(myUserId)))
      ),
    }));
  }

  let map = {};
  if (Array.isArray(raw)) {
    raw.forEach((row) => {
      const emoji = row.emoji || row.unicode;
      if (!emoji) return;
      map[emoji] = Array.isArray(row.user_ids)
        ? row.user_ids.map(Number)
        : Array.isArray(row.users)
          ? row.users.map((u) => Number(u.id || u))
          : [];
    });
  } else if (typeof raw === 'object') {
    Object.entries(raw).forEach(([emoji, users]) => {
      map[emoji] = Array.isArray(users) ? users.map(Number) : [];
    });
  }

  return Object.entries(map)
    .filter(([, ids]) => ids.length > 0)
    .map(([emoji, user_ids]) => ({
      emoji,
      count: user_ids.length,
      user_ids,
      reacted_by_me:
        myUserId != null && user_ids.some((id) => String(id) === String(myUserId)),
    }))
    .sort((a, b) => b.count - a.count || a.emoji.localeCompare(b.emoji));
}
