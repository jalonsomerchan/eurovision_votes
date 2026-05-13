import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, type Locale } from '../config/site';
import { countryCodeFrom, flagUrlFromCountryCode, localizedCountryName, type CountryMap } from '../config/eurovisionCountries';

export interface CountryPointsTarget {
  country: string;
  countryCode: string;
  flag: string;
  totalPoints: number;
  voteCount: number;
  rounds: number;
  years: number[];
  averagePoints: number;
}

export interface CountryPointsSource {
  country: string;
  countryCode: string;
  flag: string;
  totalGiven: number;
  targets: CountryPointsTarget[];
}

export interface CountryPointsData {
  sources: CountryPointsSource[];
  datasetFound: boolean;
  locale: Locale;
  generatedAt: string;
}

type RecordLike = Record<string, unknown>;
type TargetAccumulator = {
  totalPoints: number;
  voteCount: number;
  rounds: Set<string>;
  years: Set<number>;
};

const DATASET_DIR = path.join(process.cwd(), 'public', 'dataset');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ROUND_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\](\d{4})[/\\]rounds[/\\][^/\\]+\.json$/i;
const CONTESTANT_PATH_RE = /(?:^|[/\\])data[/\\]senior[/\\](\d{4})[/\\]contestants[/\\](\d+)_([a-z]{2}(?:-[a-z]{3})?)[/\\]contestant\.json$/i;

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
      if (info.isFile() && entry.toLowerCase().endsWith('.json') && info.size <= MAX_FILE_SIZE) files.push(fullPath);
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

function countryInfo(code: string, countryMap: CountryMap, locale: Locale) {
  const countryCode = countryCodeFrom(code, countryMap) || code.toUpperCase();
  return {
    countryCode,
    country: localizedCountryName(countryCode, countryMap, locale),
    flag: flagUrlFromCountryCode(countryCode),
  };
}

function loadContestantCountries(jsonFiles: string[]) {
  const countriesByYearAndId = new Map<string, string>();

  for (const filePath of jsonFiles) {
    const relativePath = path.relative(DATASET_DIR, filePath);
    const match = relativePath.match(CONTESTANT_PATH_RE);
    if (!match) continue;

    const [, year, contestantId, pathCountryCode] = match;
    let countryCode = pathCountryCode.toUpperCase();

    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
      if (isRecord(parsed)) countryCode = toText(parsed.country).toUpperCase() || countryCode;
    } catch {
      // Keep country code from path.
    }

    countriesByYearAndId.set(`${year}:${contestantId}`, countryCode);
  }

  return countriesByYearAndId;
}

function totalScore(scores: unknown) {
  if (!Array.isArray(scores)) return null;
  const total = scores.find((score) => isRecord(score) && toText(score.name).toLowerCase() === 'total');
  return isRecord(total) ? total : scores.find(isRecord) ?? null;
}

function addVote(store: Map<string, Map<string, TargetAccumulator>>, from: string, to: string, points: number, year: number, roundKey: string) {
  if (!from || !to || from === to || !Number.isFinite(points)) return;

  const source = store.get(from) ?? new Map<string, TargetAccumulator>();
  const target = source.get(to) ?? { totalPoints: 0, voteCount: 0, rounds: new Set<string>(), years: new Set<number>() };

  target.totalPoints += points;
  target.voteCount += 1;
  target.rounds.add(roundKey);
  target.years.add(year);
  source.set(to, target);
  store.set(from, source);
}

function readRoundVotes(filePath: string, contestantCountries: Map<string, string>, store: Map<string, Map<string, TargetAccumulator>>) {
  const relativePath = path.relative(DATASET_DIR, filePath);
  const match = relativePath.match(ROUND_PATH_RE);
  if (!match) return;

  const year = Number(match[1]);
  const roundKey = relativePath.replace(/\\/g, '/');

  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    if (!isRecord(parsed) || !Array.isArray(parsed.performances)) return;

    for (const performance of parsed.performances) {
      if (!isRecord(performance)) continue;
      const contestantId = toNumber(performance.contestantId);
      if (contestantId === null) continue;
      const to = contestantCountries.get(`${year}:${contestantId}`);
      const score = totalScore(performance.scores);
      if (!to || !score || !isRecord(score.votes)) continue;

      for (const [from, rawPoints] of Object.entries(score.votes)) {
        const points = toNumber(rawPoints);
        if (points !== null) addVote(store, from.toUpperCase(), to, points, year, roundKey);
      }
    }
  } catch {
    // Ignore malformed round files.
  }
}

export async function getEurovisionCountryPoints(locale: Locale = defaultLocale): Promise<CountryPointsData> {
  if (!existsSync(DATASET_DIR)) {
    return { sources: [], datasetFound: false, locale, generatedAt: new Date().toISOString() };
  }

  const countryMap = loadCountryMap();
  const jsonFiles = walkJsonFiles(DATASET_DIR);
  const contestantCountries = loadContestantCountries(jsonFiles);
  const votes = new Map<string, Map<string, TargetAccumulator>>();

  jsonFiles.forEach((filePath) => readRoundVotes(filePath, contestantCountries, votes));

  const sources = [...votes.entries()].map(([sourceCode, targets]) => {
    const source = countryInfo(sourceCode, countryMap, locale);
    const targetList = [...targets.entries()].map(([targetCode, target]) => {
      const targetCountry = countryInfo(targetCode, countryMap, locale);
      const voteCount = target.voteCount || 1;
      return {
        ...targetCountry,
        totalPoints: target.totalPoints,
        voteCount: target.voteCount,
        rounds: target.rounds.size,
        years: [...target.years].sort((a, b) => a - b),
        averagePoints: Number((target.totalPoints / voteCount).toFixed(2)),
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints || b.voteCount - a.voteCount || a.country.localeCompare(b.country));

    return {
      ...source,
      totalGiven: targetList.reduce((sum, target) => sum + target.totalPoints, 0),
      targets: targetList,
    };
  }).filter((source) => source.countryCode !== 'WLD' && source.targets.length)
    .sort((a, b) => a.country.localeCompare(b.country));

  return {
    sources,
    datasetFound: true,
    locale,
    generatedAt: new Date().toISOString(),
  };
}
