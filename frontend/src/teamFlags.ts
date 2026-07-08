const NAME_TO_CODE: Record<string, string> = {
  mexico: 'MEX',
  'south africa': 'RSA',
  'south korea': 'KOR',
  'korea republic': 'KOR',
  'czech republic': 'CZE',
  czechia: 'CZE',
  canada: 'CAN',
  'bosnia and herzegovina': 'BIH',
  qatar: 'QAT',
  switzerland: 'SUI',
  brazil: 'BRA',
  morocco: 'MAR',
  haiti: 'HAI',
  scotland: 'SCO',
  'united states': 'USA',
  usa: 'USA',
  paraguay: 'PAR',
  australia: 'AUS',
  turkey: 'TUR',
  türkiye: 'TUR',
  germany: 'GER',
  ecuador: 'ECU',
  'ivory coast': 'CIV',
  "côte d'ivoire": 'CIV',
  'côte d’ivoire': 'CIV',
  curaçao: 'CUR',
  curacao: 'CUR',
  netherlands: 'NED',
  japan: 'JPN',
  sweden: 'SWE',
  tunisia: 'TUN',
  belgium: 'BEL',
  egypt: 'EGY',
  iran: 'IRN',
  'ir iran': 'IRN',
  'new zealand': 'NZL',
  spain: 'ESP',
  'cape verde': 'CPV',
  'cabo verde': 'CPV',
  'saudi arabia': 'KSA',
  uruguay: 'URU',
  france: 'FRA',
  senegal: 'SEN',
  iraq: 'IRQ',
  norway: 'NOR',
  argentina: 'ARG',
  algeria: 'ALG',
  austria: 'AUT',
  jordan: 'JOR',
  portugal: 'POR',
  'dr congo': 'COD',
  'congo dr': 'COD',
  uzbekistan: 'UZB',
  colombia: 'COL',
  england: 'ENG',
  croatia: 'CRO',
  ghana: 'GHA',
  panama: 'PAN',
};

const NAME_TO_ISO2: Record<string, string> = {
  mexico: 'mx',
  'south africa': 'za',
  'south korea': 'kr',
  'korea republic': 'kr',
  'czech republic': 'cz',
  czechia: 'cz',
  canada: 'ca',
  'bosnia and herzegovina': 'ba',
  qatar: 'qa',
  switzerland: 'ch',
  brazil: 'br',
  morocco: 'ma',
  haiti: 'ht',
  scotland: 'gb-sct',
  'united states': 'us',
  usa: 'us',
  paraguay: 'py',
  australia: 'au',
  turkey: 'tr',
  türkiye: 'tr',
  germany: 'de',
  ecuador: 'ec',
  'ivory coast': 'ci',
  "côte d'ivoire": 'ci',
  'côte d’ivoire': 'ci',
  curaçao: 'cw',
  curacao: 'cw',
  netherlands: 'nl',
  japan: 'jp',
  sweden: 'se',
  tunisia: 'tn',
  belgium: 'be',
  egypt: 'eg',
  iran: 'ir',
  'ir iran': 'ir',
  'new zealand': 'nz',
  spain: 'es',
  'cape verde': 'cv',
  'cabo verde': 'cv',
  'saudi arabia': 'sa',
  uruguay: 'uy',
  france: 'fr',
  senegal: 'sn',
  iraq: 'iq',
  norway: 'no',
  argentina: 'ar',
  algeria: 'dz',
  austria: 'at',
  jordan: 'jo',
  portugal: 'pt',
  'dr congo': 'cd',
  'congo dr': 'cd',
  uzbekistan: 'uz',
  colombia: 'co',
  england: 'gb-eng',
  croatia: 'hr',
  ghana: 'gh',
  panama: 'pa',
};

const FIFA_CODE_TO_ISO2: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [nameKey, fifa] of Object.entries(NAME_TO_CODE)) {
    const iso = NAME_TO_ISO2[nameKey];
    if (!iso || fifa.length !== 3) continue;
    m[fifa.toLowerCase()] = iso;
  }
  return m;
})();

function normalizeKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function abbreviateTeamName(fullName: string): string {
  const key = normalizeKey(fullName);
  if (!key) return '???';
  const direct = NAME_TO_CODE[key];
  if (direct) return direct;
  const compact = key.replace(/\s+/g, '');
  for (const [k, code] of Object.entries(NAME_TO_CODE)) {
    if (k.replace(/\s+/g, '') === compact) return code;
  }
  const letters = fullName
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^A-Z]/g, '');
  if (letters.length >= 3) return letters.slice(0, 3);
  return key
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');
}

function iso2FromTeamName(fullName: string): string | null {
  const key = normalizeKey(fullName);
  if (!key) return null;
  const direct = NAME_TO_ISO2[key];
  if (direct) return direct;
  const compact = key.replace(/\s+/g, '');
  for (const [k, iso] of Object.entries(NAME_TO_ISO2)) {
    if (k.replace(/\s+/g, '') === compact) return iso;
  }
  if (/^[a-z]{3}$/.test(key)) {
    const fromFifa = FIFA_CODE_TO_ISO2[key];
    if (fromFifa) return fromFifa;
  }
  return null;
}

export function teamFlagImgSrc(fullName: string, widthPx = 48): string | null {
  const iso = iso2FromTeamName(fullName);
  if (!iso) return null;
  const w = widthPx;
  const h = Math.round((w * 3) / 4);
  return `https://flagcdn.com/${w}x${h}/${iso}.png`;
}
