import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export interface EurovisionEntry {
  year: number;
  country: string;
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
  venue?: string;
  slogan?: string;
  date?: string;
  participants: number;
  winner?: string;
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
}

type RecordLike = Record<string, unknown>;
type CountryMap = Record<string, string>;

const DATASET_DIR = path.join(process.cwd(), 'public', 'dataset');
const MAX_FILES = 4000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const YEAR_RE = /\b(19[5-9]\d|20\d{2})\b/;
const CONTESTANT_PATH_RE = /(?:^|[/\\])contestants[/\\](\d+)_([a-z]{2}(?:-[a-z]{3})?)(?:[/\\]|$)/i;

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

function countryName(value: unknown, countryMap: CountryMap) {
  const raw = toText(value);
  if (!raw) return '';
  const code = raw.toUpperCase();
  return countryMap[code] ?? raw;
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

function entryFrom(record: RecordLike, filePath: string, countryMap: CountryMap): EurovisionEntry | null {
  if (!filePath.includes('contestants')) return null;
  if (looksLikeVoteRow(record)) return null;
  const year = toYear(record, filePath);
  if (!year) return null;

  const pathInfo = contestantPathInfo(filePath);
  const country = countryName(getValue(record, ['country', 'participantCountry', 'entryCountry', 'nation', 'delegation']) ?? pathInfo?.countryCode, countryMap);
  const artist = toText(getValue(record, ['artist', 'artists', 'performer', 'performers', 'singer', 'act', 'contestant', 'participant']));
  const song = toText(getValue(record, ['song', 'songTitle', 'title', 'entry', 'composition']));
  const explicitPlace = toNumber(getValue(record, ['place', 'rank', 'position', 'placing', 'finalPlace', 'semiFinalPlace', 'resultPlace']));
  const place = explicitPlace ?? pathInfo?.place ?? null;
  const points = toNumber(getValue(record, ['points', 'totalPoints', 'score', 'totalScore', 'finalPoints']));
  const runningOrder = toNumber(getValue(record, ['runningOrder', 'draw', 'order', 'startPosition']));

  if (!country || (!artist && !song && place === null && points === null)) return null;
  if (country.length > 60 || artist.length > 120 || song.length > 160) return null;

  return {
    year,
    country,
    artist: artist || undefined,
    song: song || undefined,
    points,
    place,
    runningOrder,
  };
}

function contestInfoFrom(record: RecordLike, filePath: string, countryMap: CountryMap) {
  const year = toYear(record, filePath);
  if (!year) return null;

  const isContestFile = /(?:^|[/\\])contest\.json$/i.test(filePath);
  const hostCity = toText(getValue(record, ['hostCity', 'city', 'host', 'locationCity']));
  const hostCountry = countryName(getValue(record, isContestFile ? ['hostCountry', 'countryHost', 'locationCountry', 'country'] : ['hostCountry', 'countryHost', 'locationCountry']), countryMap);
  const venue = toText(getValue(record, ['venue', 'arena', 'location', 'place']));
  const slogan = toText(getValue(record, ['slogan', 'theme']));
  const date = toText(getValue(record, ['date', 'finalDate', 'eventDate', 'grandFinalDate']));
  const winner = countryName(getValue(record, ['winner', 'winningCountry', 'winnerCountry']), countryMap);

  if (!hostCity && !hostCountry && !venue && !slogan && !date && !winner) return null;
  return { year, hostCity, hostCountry, venue, slogan, date, winner };
}

function mergeText(current: string | undefined, next: string | undefined) {
  if (!current && next) return next;
  return current;
}

export async function getEurovisionHistory(): Promise<EurovisionHistoryData> {
  if (!existsSync(DATASET_DIR)) {
    return { contests: [], sources: [], generatedAt: new Date().toISOString(), datasetFound: false };
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
    const info = contestInfoFrom(record, filePath, countryMap);
    if (info) {
      const contest = contests.get(info.year) ?? { year: info.year, participants: 0, entries: [] };
      contest.hostCity = mergeText(contest.hostCity, info.hostCity);
      contest.hostCountry = mergeText(contest.hostCountry, info.hostCountry);
      contest.venue = mergeText(contest.venue, info.venue);
      contest.slogan = mergeText(contest.slogan, info.slogan);
      contest.date = mergeText(contest.date, info.date);
      contest.winner = mergeText(contest.winner, info.winner);
      contests.set(info.year, contest);
    }

    const entry = entryFrom(record, filePath, countryMap);
    if (entry) {
      const contest = contests.get(entry.year) ?? { year: entry.year, participants: 0, entries: [] };
      const key = `${entry.country}|${entry.artist ?? ''}|${entry.song ?? ''}`.toLowerCase();
      const existingIndex = contest.entries.findIndex((item) => `${item.country}|${item.artist ?? ''}|${item.song ?? ''}`.toLowerCase() === key);
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
  };
}
