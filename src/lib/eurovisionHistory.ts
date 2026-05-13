import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, type Locale } from '../config/site';
import { countryCodeFrom, flagUrlFromCountryCode, localizedCountryName, type CountryMap } from '../config/eurovisionCountries';

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
  contestantId?: number | null;
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
type FinalResult = { place?: number | null; points?: number | null; runningOrder?: number | null };

const DATASET_DIR = path.join(process.cwd(), 'public', 'dataset');
const SENIOR_DATASET_DIR = path.join(DATASET_DIR, 'data', 'senior');
const MAX_FILES = 4000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const YEAR_RE = /\b(19[5-9]\d|20\d{2})\b/;
const SENIOR_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\]/i;
const CONTESTANT_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\](\d{4})[/\\]contestants[/\\](\d+)_([a-z]{2}(?:-[a-z]{3})?)(?:[/\\]|$)/i;
const FINAL_ROUND_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\](\d{4})[/\\]rounds[/\\]final\.json$/i;
const historyCache = new Map<Locale, Promise<EurovisionHistoryData>>();

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

function isSeniorDatasetPath(filePath: string) {
  return SENIOR_PATH_RE.test(filePath);
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

function countryInfo(value: unknown, countryMap: CountryMap, locale: Locale) {
  const raw = toText(value);
  const code = raw ? countryCodeFrom(raw, countryMap) : '';
  const name = code ? localizedCountryName(code, countryMap, locale) : raw;

  return {
    code: code || undefined,
    name,
    flag: code ? flagUrlFromCountryCode(code) : undefined,
  };
}

function contestantPathInfo(filePath: string) {
  const match = filePath.match(CONTESTANT_PATH_RE);
  if (!match) return null;
  return {
    year: Number(match[1]),
    contestantId: Number(match[2]),
    countryCode: match[3].toUpperCase(),
  };
}

function finalResultKey(year: number, contestantId: number) {
  return `${year}:${contestantId}`;
}

function getTotalPoints(scores: unknown) {
  if (!Array.isArray(scores)) return null;
  const total = scores.find((score) => isRecord(score) && toText(score.name).toLowerCase() === 'total');
  const fallback = scores.find(isRecord);
  return toNumber(isRecord(total) ? total.points : isRecord(fallback) ? fallback.points : null);
}

function loadFinalResults(filePath: string, parsed: unknown, output: Map<string, FinalResult>) {
  const relativePath = path.relative(DATASET_DIR, filePath);
  const match = relativePath.match(FINAL_ROUND_PATH_RE);
  if (!match || !isRecord(parsed) || !Array.isArray(parsed.performances)) return;

  const year = Number(match[1]);
  for (const performance of parsed.performances) {
    if (!isRecord(performance)) continue;
    const contestantId = toNumber(performance.contestantId);
    if (contestantId === null) continue;
    output.set(finalResultKey(year, contestantId), {
      place: toNumber(performance.place),
      points: getTotalPoints(performance.scores),
      runningOrder: toNumber(performance.running),
    });
  }
}

function looksLikeVoteRow(record: RecordLike) {
  return Boolean(
    getValue(record, ['fromCountry', 'votingCountry', 'voterCountry', 'from']) &&
    getValue(record, ['toCountry', 'receivingCountry', 'recipientCountry', 'to']) &&
    getValue(record, ['points', 'score'])
  );
}

function entryFrom(record: RecordLike, filePath: string, countryMap: CountryMap, locale: Locale): EurovisionEntry | null {
  if (!isSeniorDatasetPath(filePath) || !filePath.includes('contestants')) return null;
  if (looksLikeVoteRow(record)) return null;
  const pathInfo = contestantPathInfo(filePath);
  if (!pathInfo) return null;
  const year = pathInfo.year || toYear(record, filePath);
  if (!year) return null;

  const country = countryInfo(getValue(record, ['country', 'participantCountry', 'entryCountry', 'nation', 'delegation']) ?? pathInfo.countryCode, countryMap, locale);
  const artist = toText(getValue(record, ['artist', 'artists', 'performer', 'performers', 'singer', 'act', 'contestant', 'participant']));
  const song = toText(getValue(record, ['song', 'songTitle', 'title', 'entry', 'composition']));
  const explicitPlace = toNumber(getValue(record, ['place', 'rank', 'position', 'placing', 'finalPlace', 'semiFinalPlace', 'resultPlace']));
  const place = explicitPlace ?? null;
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
    contestantId: pathInfo.contestantId,
  };
}

function contestInfoFrom(record: RecordLike, filePath: string, countryMap: CountryMap, locale: Locale) {
  if (!isSeniorDatasetPath(filePath)) return null;
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

function withFinalResult(entry: EurovisionEntry, finalResults: Map<string, FinalResult>) {
  if (entry.contestantId === undefined || entry.contestantId === null) return entry;
  const result = finalResults.get(finalResultKey(entry.year, entry.contestantId));
  if (!result) return entry;

  return {
    ...entry,
    place: result.place ?? entry.place,
    points: result.points ?? entry.points,
    runningOrder: result.runningOrder ?? entry.runningOrder,
  };
}

async function buildEurovisionHistory(locale: Locale = defaultLocale): Promise<EurovisionHistoryData> {
  if (!existsSync(SENIOR_DATASET_DIR)) {
    return { contests: [], sources: [], generatedAt: new Date().toISOString(), datasetFound: false, locale };
  }

  const countryMap = loadCountryMap();
  const jsonFiles = walkJsonFiles(SENIOR_DATASET_DIR);
  const objects: Array<{ record: RecordLike; filePath: string }> = [];
  const finalResults = new Map<string, FinalResult>();

  for (const filePath of jsonFiles) {
    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
      loadFinalResults(filePath, parsed, finalResults);
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
      const enrichedEntry = withFinalResult(entry, finalResults);
      const key = `${enrichedEntry.contestantId ?? enrichedEntry.countryCode ?? enrichedEntry.country}|${enrichedEntry.artist ?? ''}|${enrichedEntry.song ?? ''}`.toLowerCase();
      const existingIndex = contest.entries.findIndex((item) => `${item.contestantId ?? item.countryCode ?? item.country}|${item.artist ?? ''}|${item.song ?? ''}`.toLowerCase() === key);
      if (existingIndex === -1) contest.entries.push(enrichedEntry);
      contests.set(entry.year, contest);
    }
  }

  const result = [...contests.values()].map((contest) => {
    const entries = contest.entries
      .map((entry) => withFinalResult(entry, finalResults))
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

export async function getEurovisionHistory(locale: Locale = defaultLocale): Promise<EurovisionHistoryData> {
  const cached = historyCache.get(locale);
  if (cached) return cached;

  const promise = buildEurovisionHistory(locale);
  historyCache.set(locale, promise);
  return promise;
}
