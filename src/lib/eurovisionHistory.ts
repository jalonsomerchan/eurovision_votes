import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, type Locale } from '../config/site';

export interface EurovisionEntry {
  year: number;
  country: string;
  countryCode?: string;
  flag?: string;
  artist?: string;
  song?: string;
  points?: number | null;
  place?: number | null;
  runningOrder?: number | null;
}

export interface EurovisionContest {
  year: number;
  hostCity?: string;
  hostCountry?: string;
  hostCountryCode?: string;
  hostFlag?: string;
  venue?: string;
  slogan?: string;
  date?: string;
  participants: number;
  winner?: string;
  winnerCode?: string;
  winnerFlag?: string;
  winnerArtist?: string;
  winnerSong?: string;
  winnerPoints?: number | null;
  entries: EurovisionEntry[];
}

export interface EurovisionHistoryData {
  contests: EurovisionContest[];
  sources: string[];
  generatedAt: string;
  datasetFound: boolean;
  locale: Locale;
}

type RecordLike = Record<string, unknown>;
type CountryMap = Record<string, string>;
type LocalizedCountryMap = Partial<Record<Locale, Record<string, string>>>;

const DATASET_DIR = path.join(process.cwd(), 'public', 'dataset');
const MAX_FILES = 4000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const YEAR_RE = /\b(19[5-9]\d|20\d{2})\b/;
const CONTESTANT_PATH_RE = /(?:^|[/\\])contestants[/\\](\d+)_([a-z]{2}(?:-[a-z]{3})?)(?:[/\\]|$)/i;

const countryTranslations: LocalizedCountryMap = {
  es: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaiyan', BY: 'Bielorrusia', BE: 'Belgica', BA: 'Bosnia y Herzegovina', BG: 'Bulgaria', HR: 'Croacia', CY: 'Chipre', CZ: 'Chequia', DK: 'Dinamarca', EE: 'Estonia', FI: 'Finlandia', FR: 'Francia', GE: 'Georgia', DE: 'Alemania', GR: 'Grecia', HU: 'Hungria', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Kazajistan', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Monaco', ME: 'Montenegro', MA: 'Marruecos', NL: 'Paises Bajos', MK: 'Macedonia del Norte', NO: 'Noruega', PL: 'Polonia', PT: 'Portugal', RO: 'Rumania', RU: 'Rusia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia y Montenegro', SK: 'Eslovaquia', SI: 'Eslovenia', ES: 'España', SE: 'Suecia', CH: 'Suiza', TR: 'Turquia', UA: 'Ucrania', GB: 'Reino Unido', 'GB-WLS': 'Gales', YU: 'Yugoslavia'
  },
  en: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijan', BY: 'Belarus', BE: 'Belgium', BA: 'Bosnia and Herzegovina', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', EE: 'Estonia', FI: 'Finland', FR: 'France', GE: 'Georgia', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IS: 'Iceland', IE: 'Ireland', IL: 'Israel', IT: 'Italy', KZ: 'Kazakhstan', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', MD: 'Moldova', MC: 'Monaco', ME: 'Montenegro', MA: 'Morocco', NL: 'Netherlands', MK: 'North Macedonia', NO: 'Norway', PL: 'Poland', PT: 'Portugal', RO: 'Romania', RU: 'Russia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia and Montenegro', SK: 'Slovakia', SI: 'Slovenia', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', TR: 'Turkey', UA: 'Ukraine', GB: 'United Kingdom', 'GB-WLS': 'Wales', YU: 'Yugoslavia'
  },
  fr: {
    AL: 'Albanie', AD: 'Andorre', AM: 'Armenie', AU: 'Australie', AT: 'Autriche', AZ: 'Azerbaidjan', BY: 'Bielorussie', BE: 'Belgique', BA: 'Bosnie-Herzegovine', BG: 'Bulgarie', HR: 'Croatie', CY: 'Chypre', CZ: 'Tchequie', DK: 'Danemark', EE: 'Estonie', FI: 'Finlande', FR: 'France', GE: 'Georgie', DE: 'Allemagne', GR: 'Grece', HU: 'Hongrie', IS: 'Islande', IE: 'Irlande', IL: 'Israel', IT: 'Italie', KZ: 'Kazakhstan', LV: 'Lettonie', LT: 'Lituanie', LU: 'Luxembourg', MT: 'Malte', MD: 'Moldavie', MC: 'Monaco', ME: 'Montenegro', MA: 'Maroc', NL: 'Pays-Bas', MK: 'Macedoine du Nord', NO: 'Norvege', PL: 'Pologne', PT: 'Portugal', RO: 'Roumanie', RU: 'Russie', SM: 'Saint-Marin', RS: 'Serbie', CS: 'Serbie-et-Montenegro', SK: 'Slovaquie', SI: 'Slovenie', ES: 'Espagne', SE: 'Suede', CH: 'Suisse', TR: 'Turquie', UA: 'Ukraine', GB: 'Royaume-Uni', 'GB-WLS': 'Pays de Galles', YU: 'Yougoslavie'
  },
  pt: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijao', BY: 'Bielorrussia', BE: 'Belgica', BA: 'Bosnia e Herzegovina', BG: 'Bulgaria', HR: 'Croacia', CY: 'Chipre', CZ: 'Chequia', DK: 'Dinamarca', EE: 'Estonia', FI: 'Finlandia', FR: 'Franca', GE: 'Georgia', DE: 'Alemanha', GR: 'Grecia', HU: 'Hungria', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Cazaquistao', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Monaco', ME: 'Montenegro', MA: 'Marrocos', NL: 'Paises Baixos', MK: 'Macedonia do Norte', NO: 'Noruega', PL: 'Polonia', PT: 'Portugal', RO: 'Romenia', RU: 'Russia', SM: 'Sao Marinho', RS: 'Servia', CS: 'Servia e Montenegro', SK: 'Eslovaquia', SI: 'Eslovenia', ES: 'Espanha', SE: 'Suecia', CH: 'Suica', TR: 'Turquia', UA: 'Ucrania', GB: 'Reino Unido', 'GB-WLS': 'Pais de Gales', YU: 'Jugoslavia'
  },
  ca: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaidjan', BY: 'Bielorussia', BE: 'Belgica', BA: 'Bosnia i Hercegovina', BG: 'Bulgaria', HR: 'Croacia', CY: 'Xipre', CZ: 'Txequia', DK: 'Dinamarca', EE: 'Estonia', FI: 'Finlandia', FR: 'Franca', GE: 'Georgia', DE: 'Alemanya', GR: 'Grecia', HU: 'Hongria', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Kazakhstan', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburg', MT: 'Malta', MD: 'Moldavia', MC: 'Monaco', ME: 'Montenegro', MA: 'Marroc', NL: 'Paisos Baixos', MK: 'Macedonia del Nord', NO: 'Noruega', PL: 'Polonia', PT: 'Portugal', RO: 'Romania', RU: 'Russia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia i Montenegro', SK: 'Eslovaquia', SI: 'Eslovenia', ES: 'Espanya', SE: 'Suecia', CH: 'Suissa', TR: 'Turquia', UA: 'Ucraina', GB: 'Regne Unit', 'GB-WLS': 'Gal·les', YU: 'Iugoslavia'
  },
  eu: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijan', BY: 'Bielorrusia', BE: 'Belgika', BA: 'Bosnia eta Herzegovina', BG: 'Bulgaria', HR: 'Kroazia', CY: 'Zipre', CZ: 'Txekia', DK: 'Danimarka', EE: 'Estonia', FI: 'Finlandia', FR: 'Frantzia', GE: 'Georgia', DE: 'Alemania', GR: 'Grezia', HU: 'Hungaria', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Kazakhstan', LV: 'Letonia', LT: 'Lituania', LU: 'Luxenburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Monako', ME: 'Montenegro', MA: 'Maroko', NL: 'Herbehereak', MK: 'Ipar Mazedonia', NO: 'Norvegia', PL: 'Polonia', PT: 'Portugal', RO: 'Errumania', RU: 'Errusia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia eta Montenegro', SK: 'Eslovakia', SI: 'Eslovenia', ES: 'Espainia', SE: 'Suedia', CH: 'Suitza', TR: 'Turkia', UA: 'Ukraina', GB: 'Erresuma Batua', 'GB-WLS': 'Gales', YU: 'Jugoslavia'
  },
  gl: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Acerbaixan', BY: 'Bielorrusia', BE: 'Belxica', BA: 'Bosnia e Hercegovina', BG: 'Bulgaria', HR: 'Croacia', CY: 'Chipre', CZ: 'Chequia', DK: 'Dinamarca', EE: 'Estonia', FI: 'Finlandia', FR: 'Francia', GE: 'Xeorxia', DE: 'Alemaña', GR: 'Grecia', HU: 'Hungria', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Casaquistan', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Monaco', ME: 'Montenegro', MA: 'Marrocos', NL: 'Paises Baixos', MK: 'Macedonia do Norte', NO: 'Noruega', PL: 'Polonia', PT: 'Portugal', RO: 'Romania', RU: 'Rusia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia e Montenegro', SK: 'Eslovaquia', SI: 'Eslovenia', ES: 'España', SE: 'Suecia', CH: 'Suiza', TR: 'Turquia', UA: 'Ucraína', GB: 'Reino Unido', 'GB-WLS': 'Gales', YU: 'Iugoslavia'
  },
};

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isRecord(value: unknown): value is RecordLike {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getValue(record: RecordLike, aliases: string[]) {
  const normalized = new Map(Object.entries(record).map(([key, value]) => [normalizeKey(key), value]));
  for (const alias of aliases) {
    const value = normalized.get(normalizeKey(alias));
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function toText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (isRecord(value)) {
    const name = getValue(value, ['name', 'englishName', 'fullName', 'title']);
    if (name) return toText(name);
  }
  return '';
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toYear(record: RecordLike, filePath: string) {
  const explicitYear = toNumber(getValue(record, ['year', 'contestYear', 'editionYear', 'eventYear']));
  if (explicitYear && explicitYear >= 1956 && explicitYear <= 2100) return Math.trunc(explicitYear);
  const match = filePath.match(YEAR_RE);
  return match ? Number(match[1]) : null;
}

function walkJsonFiles(dir: string) {
  const files: string[] = [];
  const pending = [dir];

  while (pending.length && files.length < MAX_FILES) {
    const current = pending.pop();
    if (!current || !existsSync(current)) continue;

    for (const entry of readdirSync(current)) {
      if (entry === '.git' || entry === 'node_modules') continue;
      const fullPath = path.join(current, entry);
      const info = statSync(fullPath);
      if (info.isDirectory()) pending.push(fullPath);
      if (info.isFile() && entry.toLowerCase().endsWith('.json') && info.size <= MAX_FILE_SIZE) files.push(fullPath);
    }
  }

  return files;
}

function collectObjects(value: unknown, filePath: string, output: Array<{ record: RecordLike; filePath: string }>) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectObjects(item, filePath, output));
    return;
  }

  if (!isRecord(value)) return;
  output.push({ record: value, filePath });
  for (const child of Object.values(value)) {
    if (Array.isArray(child) || isRecord(child)) collectObjects(child, filePath, output);
  }
}

function loadCountryMap(): CountryMap {
  const countriesPath = path.join(DATASET_DIR, 'data', 'countries.json');
  if (!existsSync(countriesPath)) return {};

  try {
    const parsed = JSON.parse(readFileSync(countriesPath, 'utf8'));
    if (!isRecord(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed)
        .map(([code, name]) => [code.toUpperCase(), toText(name)])
        .filter(([, name]) => name),
    );
  } catch {
    return {};
  }
}

function countryCodeFrom(value: unknown, countryMap: CountryMap) {
  const raw = toText(value);
  if (!raw) return '';
  const upper = raw.toUpperCase();
  if (countryMap[upper] || countryTranslations.en?.[upper]) return upper;
  const normalizedRaw = normalizeKey(raw);
  const found = Object.entries(countryMap).find(([, name]) => normalizeKey(name) === normalizedRaw);
  return found?.[0] ?? '';
}

function flagEmoji(code: string) {
  if (code === 'GB-WLS') return '🏴';
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️';
  return [...code].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join('');
}

function countryInfo(value: unknown, countryMap: CountryMap, locale: Locale) {
  const code = countryCodeFrom(value, countryMap);
  const raw = toText(value);
  const name = code
    ? countryTranslations[locale]?.[code] ?? countryTranslations[defaultLocale]?.[code] ?? countryTranslations.en?.[code] ?? countryMap[code] ?? raw
    : raw;

  return {
    code: code || undefined,
    name,
    flag: code ? flagEmoji(code) : undefined,
  };
}

function contestantPathInfo(filePath: string) {
  const match = filePath.match(CONTESTANT_PATH_RE);
  if (!match) return null;
  return {
    place: Number(match[1]) + 1,
    countryCode: match[2].toUpperCase(),
  };
}

function looksLikeVoteRow(record: RecordLike) {
  return Boolean(
    getValue(record, ['fromCountry', 'votingCountry', 'voterCountry', 'from']) &&
    getValue(record, ['toCountry', 'receivingCountry', 'recipientCountry', 'to']) &&
    getValue(record, ['points', 'score'])
  );
}

function entryFrom(record: RecordLike, filePath: string, countryMap: CountryMap, locale: Locale): EurovisionEntry | null {
  if (!filePath.includes('contestants')) return null;
  if (looksLikeVoteRow(record)) return null;
  const year = toYear(record, filePath);
  if (!year) return null;

  const pathInfo = contestantPathInfo(filePath);
  const country = countryInfo(getValue(record, ['country', 'participantCountry', 'entryCountry', 'nation', 'delegation']) ?? pathInfo?.countryCode, countryMap, locale);
  const artist = toText(getValue(record, ['artist', 'artists', 'performer', 'performers', 'singer', 'act', 'contestant', 'participant']));
  const song = toText(getValue(record, ['song', 'songTitle', 'title', 'entry', 'composition']));
  const explicitPlace = toNumber(getValue(record, ['place', 'rank', 'position', 'placing', 'finalPlace', 'semiFinalPlace', 'resultPlace']));
  const place = explicitPlace ?? pathInfo?.place ?? null;
  const points = toNumber(getValue(record, ['points', 'totalPoints', 'score', 'totalScore', 'finalPoints']));
  const runningOrder = toNumber(getValue(record, ['runningOrder', 'draw', 'order', 'startPosition']));

  if (!country.name || (!artist && !song && place === null && points === null)) return null;
  if (country.name.length > 60 || artist.length > 120 || song.length > 160) return null;

  return {
    year,
    country: country.name,
    countryCode: country.code,
    flag: country.flag,
    artist: artist || undefined,
    song: song || undefined,
    points,
    place,
    runningOrder,
  };
}

function contestInfoFrom(record: RecordLike, filePath: string, countryMap: CountryMap, locale: Locale) {
  const year = toYear(record, filePath);
  if (!year) return null;

  const isContestFile = /(?:^|[/\\])contest\.json$/i.test(filePath);
  const hostCity = toText(getValue(record, ['hostCity', 'city', 'host', 'locationCity']));
  const hostCountry = countryInfo(getValue(record, isContestFile ? ['hostCountry', 'countryHost', 'locationCountry', 'country'] : ['hostCountry', 'countryHost', 'locationCountry']), countryMap, locale);
  const venue = toText(getValue(record, ['venue', 'arena', 'location', 'place']));
  const slogan = toText(getValue(record, ['slogan', 'theme']));
  const date = toText(getValue(record, ['date', 'finalDate', 'eventDate', 'grandFinalDate']));
  const winner = countryInfo(getValue(record, ['winner', 'winningCountry', 'winnerCountry']), countryMap, locale);

  if (!hostCity && !hostCountry.name && !venue && !slogan && !date && !winner.name) return null;
  return {
    year,
    hostCity,
    hostCountry: hostCountry.name,
    hostCountryCode: hostCountry.code,
    hostFlag: hostCountry.flag,
    venue,
    slogan,
    date,
    winner: winner.name,
    winnerCode: winner.code,
    winnerFlag: winner.flag,
  };
}

function mergeText(current: string | undefined, next: string | undefined) {
  if (!current && next) return next;
  return current;
}

export async function getEurovisionHistory(locale: Locale = defaultLocale): Promise<EurovisionHistoryData> {
  if (!existsSync(DATASET_DIR)) {
    return { contests: [], sources: [], generatedAt: new Date().toISOString(), datasetFound: false, locale };
  }

  const countryMap = loadCountryMap();
  const jsonFiles = walkJsonFiles(DATASET_DIR);
  const objects: Array<{ record: RecordLike; filePath: string }> = [];

  for (const filePath of jsonFiles) {
    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
      collectObjects(parsed, path.relative(DATASET_DIR, filePath), objects);
    } catch {
      // Ignore invalid or non-standard JSON files in the dataset.
    }
  }

  const contests = new Map<number, EurovisionContest>();
  const sources = [...new Set(jsonFiles.map((file) => path.relative(DATASET_DIR, file)))].sort();

  for (const { record, filePath } of objects) {
    const info = contestInfoFrom(record, filePath, countryMap, locale);
    if (info) {
      const contest = contests.get(info.year) ?? { year: info.year, participants: 0, entries: [] };
      contest.hostCity = mergeText(contest.hostCity, info.hostCity);
      contest.hostCountry = mergeText(contest.hostCountry, info.hostCountry);
      contest.hostCountryCode = mergeText(contest.hostCountryCode, info.hostCountryCode);
      contest.hostFlag = mergeText(contest.hostFlag, info.hostFlag);
      contest.venue = mergeText(contest.venue, info.venue);
      contest.slogan = mergeText(contest.slogan, info.slogan);
      contest.date = mergeText(contest.date, info.date);
      contest.winner = mergeText(contest.winner, info.winner);
      contest.winnerCode = mergeText(contest.winnerCode, info.winnerCode);
      contest.winnerFlag = mergeText(contest.winnerFlag, info.winnerFlag);
      contests.set(info.year, contest);
    }

    const entry = entryFrom(record, filePath, countryMap, locale);
    if (entry) {
      const contest = contests.get(entry.year) ?? { year: entry.year, participants: 0, entries: [] };
      const key = `${entry.countryCode ?? entry.country}|${entry.artist ?? ''}|${entry.song ?? ''}`.toLowerCase();
      const existingIndex = contest.entries.findIndex((item) => `${item.countryCode ?? item.country}|${item.artist ?? ''}|${item.song ?? ''}`.toLowerCase() === key);
      if (existingIndex === -1) contest.entries.push(entry);
      contests.set(entry.year, contest);
    }
  }

  const result = [...contests.values()].map((contest) => {
    const entries = contest.entries
      .sort((a, b) => (a.place ?? 999) - (b.place ?? 999) || (a.runningOrder ?? 999) - (b.runningOrder ?? 999) || a.country.localeCompare(b.country));
    const winner = entries.find((entry) => entry.place === 1) ?? [...entries].sort((a, b) => (b.points ?? -1) - (a.points ?? -1))[0];

    return {
      ...contest,
      entries,
      participants: entries.length,
      winner: contest.winner || winner?.country,
      winnerCode: contest.winnerCode || winner?.countryCode,
      winnerFlag: contest.winnerFlag || winner?.flag,
      winnerArtist: winner?.artist,
      winnerSong: winner?.song,
      winnerPoints: winner?.points,
    };
  }).filter((contest) => contest.participants > 0 || contest.hostCity || contest.hostCountry || contest.winner)
    .sort((a, b) => b.year - a.year);

  return {
    contests: result,
    sources,
    generatedAt: new Date().toISOString(),
    datasetFound: true,
    locale,
  };
}
