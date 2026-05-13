import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, type Locale } from '../config/site';
import { eurovision2026Contests } from '../config/eurovision2026';
import { countryCodeFrom, flagUrlFromCountryCode, localizedCountryName, type CountryMap } from '../config/eurovisionCountries';
import { getEurovisionHistory } from './eurovisionHistory';

export interface EditionEntry {
  country: string;
  countryCode?: string;
  flag?: string;
  artist?: string;
  song?: string;
  runningOrder?: number | string | null;
  place?: number | null;
  points?: number | null;
  directFinalist?: boolean;
}

export interface EditionRound {
  id: string;
  label: string;
  entries: EditionEntry[];
}

export interface EurovisionEdition {
  year: number;
  hostCity?: string;
  hostCountry?: string;
  hostCountryCode?: string;
  hostFlag?: string;
  venue?: string;
  date?: string;
  winner?: string;
  winnerCode?: string;
  winnerFlag?: string;
  winnerArtist?: string;
  winnerSong?: string;
  winnerPoints?: number | null;
  participants: number;
  rounds: EditionRound[];
  stats: {
    rounds: number;
    averagePoints: number | null;
    maxPoints: number | null;
    songs: number;
  };
}

type RecordLike = Record<string, unknown>;
type ContestantInfo = { countryCode: string; artist?: string; song?: string };

const DATASET_DIR = path.join(process.cwd(), 'public', 'dataset');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CONTESTANT_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\](\d{4})[/\\]contestants[/\\](\d+)_([a-z]{2}(?:-[a-z]{3})?)[/\\]contestant\.json$/i;
const ROUND_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\](\d{4})[/\\]rounds[/\\]([^/\\]+)\.json$/i;
const editionsCache = new Map<Locale, Promise<EurovisionEdition[]>>();

function isRecord(value: unknown): value is RecordLike {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function walkJsonFiles(dir: string) {
  const files: string[] = [];
  const pending = [dir];

  while (pending.length) {
    const current = pending.pop();
    if (!current || !existsSync(current)) continue;

    for (const entry of readdirSync(current)) {
      if (entry === '.git' || entry === 'node_modules') continue;
      const fullPath = path.join(current, entry);
      const info = statSync(fullPath);
      if (info.isDirectory()) pending.push(fullPath);
      if (info.isFile() && entry.endsWith('.json') && info.size <= MAX_FILE_SIZE) files.push(fullPath);
    }
  }

  return files;
}

function loadCountryMap(): CountryMap {
  const countriesPath = path.join(DATASET_DIR, 'data', 'countries.json');
  if (!existsSync(countriesPath)) return {};

  try {
    const parsed = JSON.parse(readFileSync(countriesPath, 'utf8'));
    if (!isRecord(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).map(([code, name]) => [code.toUpperCase(), toText(name)]).filter(([, name]) => name));
  } catch {
    return {};
  }
}

function countryInfo(codeOrName: string, countryMap: CountryMap, locale: Locale) {
  const code = countryCodeFrom(codeOrName, countryMap) || codeOrName.toUpperCase();
  return {
    countryCode: code,
    country: localizedCountryName(code, countryMap, locale),
    flag: flagUrlFromCountryCode(code),
  };
}

function totalPoints(scores: unknown) {
  if (!Array.isArray(scores)) return null;
  const total = scores.find((score) => isRecord(score) && toText(score.name).toLowerCase() === 'total');
  const fallback = scores.find(isRecord);
  return toNumber(isRecord(total) ? total.points : isRecord(fallback) ? fallback.points : null);
}

function roundLabel(id: string) {
  const normalized = id.toLowerCase();
  if (normalized.includes('final') && !normalized.includes('semi')) return 'Final';
  if (normalized.includes('1')) return 'Semifinal 1';
  if (normalized.includes('2')) return 'Semifinal 2';
  return id.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function roundSortValue(round: EditionRound) {
  const id = round.id.toLowerCase();
  if (id.includes('final') && !id.includes('semi')) return 3;
  if (id.includes('1')) return 1;
  if (id.includes('2')) return 2;
  return 4;
}

function ensureThreeRounds(rounds: EditionRound[]) {
  const byId = new Map(rounds.map((round) => [round.id, round]));
  const aliases = [
    { id: 'semi-1', label: 'Semifinal 1', match: (round: EditionRound) => round.label.includes('1') },
    { id: 'semi-2', label: 'Semifinal 2', match: (round: EditionRound) => round.label.includes('2') },
    { id: 'final', label: 'Final', match: (round: EditionRound) => round.label === 'Final' },
  ];

  return aliases.map((alias) => rounds.find(alias.match) ?? byId.get(alias.id) ?? { id: alias.id, label: alias.label, entries: [] });
}

function readContestants(files: string[], countryMap: CountryMap, locale: Locale) {
  const contestants = new Map<string, ContestantInfo>();

  for (const filePath of files) {
    const relativePath = path.relative(DATASET_DIR, filePath);
    const match = relativePath.match(CONTESTANT_PATH_RE);
    if (!match) continue;

    const [, year, id, pathCode] = match;
    let info: ContestantInfo = { countryCode: pathCode.toUpperCase() };

    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
      if (isRecord(parsed)) {
        const country = countryInfo(toText(parsed.country) || pathCode, countryMap, locale);
        info = {
          countryCode: country.countryCode,
          artist: toText(parsed.artist) || toText(parsed.performer),
          song: toText(parsed.song) || toText(parsed.title),
        };
      }
    } catch {
      // Keep path metadata.
    }

    contestants.set(`${year}:${id}`, info);
  }

  return contestants;
}

function readDatasetRounds(files: string[], contestants: Map<string, ContestantInfo>, countryMap: CountryMap, locale: Locale) {
  const editions = new Map<number, EditionRound[]>();

  for (const filePath of files) {
    const relativePath = path.relative(DATASET_DIR, filePath);
    const match = relativePath.match(ROUND_PATH_RE);
    if (!match) continue;

    const [, rawYear, roundId] = match;
    const year = Number(rawYear);

    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
      if (!isRecord(parsed) || !Array.isArray(parsed.performances)) continue;

      const entries = parsed.performances.map((performance): EditionEntry | null => {
        if (!isRecord(performance)) return null;
        const contestantId = toNumber(performance.contestantId);
        if (contestantId === null) return null;
        const contestant = contestants.get(`${year}:${contestantId}`);
        if (!contestant) return null;
        const country = countryInfo(contestant.countryCode, countryMap, locale);

        return {
          ...country,
          artist: contestant.artist,
          song: contestant.song,
          runningOrder: toNumber(performance.running),
          place: toNumber(performance.place),
          points: totalPoints(performance.scores),
        };
      }).filter((entry): entry is EditionEntry => Boolean(entry));

      const round: EditionRound = { id: roundId, label: roundLabel(roundId), entries };
      const existing = editions.get(year) ?? [];
      existing.push(round);
      editions.set(year, existing);
    } catch {
      // Ignore malformed round files.
    }
  }

  return editions;
}

function editionStats(rounds: EditionRound[]) {
  const entries = rounds.flatMap((round) => round.entries);
  const points = entries.map((entry) => entry.points).filter((value): value is number => typeof value === 'number');

  return {
    rounds: rounds.filter((round) => round.entries.length).length,
    averagePoints: points.length ? Number((points.reduce((sum, value) => sum + value, 0) / points.length).toFixed(2)) : null,
    maxPoints: points.length ? Math.max(...points) : null,
    songs: entries.length,
  };
}

function createCurrentEdition(countryMap: CountryMap, locale: Locale): EurovisionEdition {
  const rounds = ensureThreeRounds(eurovision2026Contests.map((contest) => ({
    id: contest.id,
    label: contest.name,
    entries: contest.songs.map((song) => ({
      ...countryInfo(song.flag, countryMap, locale),
      artist: song.artist,
      song: song.song,
      runningOrder: song.runningOrder,
      place: null,
      points: null,
      directFinalist: song.directFinalist,
    })),
  })));
  const participants = new Set(rounds.flatMap((round) => round.entries.map((entry) => entry.countryCode ?? entry.country))).size;

  return {
    year: 2026,
    participants,
    rounds,
    stats: editionStats(rounds),
  };
}

async function buildEditions(locale: Locale) {
  const countryMap = loadCountryMap();
  const history = await getEurovisionHistory(locale);
  const byYear = new Map<number, EurovisionEdition>();

  for (const contest of history.contests) {
    byYear.set(contest.year, {
      year: contest.year,
      hostCity: contest.hostCity,
      hostCountry: contest.hostCountry,
      hostCountryCode: contest.hostCountryCode,
      hostFlag: contest.hostFlag,
      venue: contest.venue,
      date: contest.date,
      winner: contest.winner,
      winnerCode: contest.winnerCode,
      winnerFlag: contest.winnerFlag,
      winnerArtist: contest.winnerArtist,
      winnerSong: contest.winnerSong,
      winnerPoints: contest.winnerPoints,
      participants: contest.participants,
      rounds: ensureThreeRounds([{ id: 'final', label: 'Final', entries: contest.entries }]),
      stats: editionStats([{ id: 'final', label: 'Final', entries: contest.entries }]),
    });
  }

  if (existsSync(DATASET_DIR)) {
    const files = walkJsonFiles(DATASET_DIR);
    const contestants = readContestants(files, countryMap, locale);
    const roundsByYear = readDatasetRounds(files, contestants, countryMap, locale);

    for (const [year, rounds] of roundsByYear) {
      const sortedRounds = ensureThreeRounds(rounds.sort((a, b) => roundSortValue(a) - roundSortValue(b)));
      const edition = byYear.get(year);
      if (!edition) continue;
      edition.rounds = sortedRounds;
      edition.stats = editionStats(sortedRounds);
      edition.participants = new Set(sortedRounds.flatMap((round) => round.entries.map((entry) => entry.countryCode ?? entry.country))).size || edition.participants;
      const finalWinner = sortedRounds.find((round) => round.label === 'Final')?.entries.find((entry) => entry.place === 1);
      if (finalWinner) {
        edition.winner = finalWinner.country;
        edition.winnerCode = finalWinner.countryCode;
        edition.winnerFlag = finalWinner.flag;
        edition.winnerArtist = finalWinner.artist;
        edition.winnerSong = finalWinner.song;
        edition.winnerPoints = finalWinner.points;
      }
    }
  }

  byYear.set(2026, createCurrentEdition(countryMap, locale));
  return [...byYear.values()].sort((a, b) => b.year - a.year);
}

export async function listEurovisionEditionYears(locale: Locale = defaultLocale) {
  const editions = await getEurovisionEditions(locale);
  return editions.map((edition) => edition.year);
}

export async function getEurovisionEdition(year: number, locale: Locale = defaultLocale) {
  const editions = await getEurovisionEditions(locale);
  return editions.find((edition) => edition.year === year) ?? null;
}

export async function getEurovisionEditions(locale: Locale = defaultLocale) {
  const cached = editionsCache.get(locale);
  if (cached) return cached;
  const promise = buildEditions(locale);
  editionsCache.set(locale, promise);
  return promise;
}
