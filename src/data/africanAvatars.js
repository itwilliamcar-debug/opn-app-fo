/**
 * Portraits Unsplash — personnes noires africaines UNIQUES (vérifiés visuellement)
 */
const face = (id, w = 200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${w}&fit=crop&crop=faces&auto=format&q=80`;

/** Hommes noirs africains */
export const HOMMES = [
  face('photo-1531384441138-2736e62e0919'),
  face('photo-1522529599102-193c0d76b5b6'),
  face('photo-1463453091185-61582044d556'),
  face('photo-1570158268183-d296b2892211'),
  face('photo-1565884280295-98eb83e41c65'),
  face('photo-1587064712555-6e206484699b'),
  face('photo-1506277886164-e25aa3f4ef7f'),
  face('photo-1605980776566-0486c3ac7617'),
  face('photo-1654155427842-a4a249bf693e'),
  face('photo-1566492031773-4f4e44671857'),
  face('photo-1752650143052-fab46a8c2735'),
  face('photo-1596580817363-a4a8f67d4bc8'),
  face('photo-1584119164246-461d43e9bab3'),
  face('photo-1524660988542-c440de9c0fde'),
  face('photo-1531901599143-df5010ab9438'),
];

/** Femmes noires africaines */
export const FEMMES = [
  face('photo-1531123897727-8f129e1688ce'),
  face('photo-1589156280159-27698a70f29e'),
  face('photo-1507152832244-10d45c7eda57'),
  face('photo-1573497491765-dccce02b29df'),
  face('photo-1755705098259-172041d16a1a'),
  face('photo-1765607476283-ca2d8201ddd4'),
  face('photo-1763328728510-064ea03a1f8a'),
  face('photo-1767249615394-c2f36d563a2d'),
];

export const DEFAULT_AVATAR_HOMME = HOMMES[0];
export const DEFAULT_AVATAR_FEMME = FEMMES[0];
export const DEFAULT_AVATAR = DEFAULT_AVATAR_HOMME;

export const avatarSize = (url, w = 150) => {
  if (!url) return DEFAULT_AVATAR.replace(/w=\d+/g, `w=${w}`).replace(/h=\d+/g, `h=${w}`);
  if (/[?&]w=\d+/.test(url)) {
    return url.replace(/([?&])w=\d+/, `$1w=${w}`).replace(/([?&])h=\d+/, `$1h=${w}`);
  }
  return `${url}${url.includes('?') ? '&' : '?'}w=${w}&h=${w}&fit=crop&crop=faces`;
};
