import { defaultLocale, type Locale } from '../config/site';
import { eurovision2026Contests } from '../config/eurovision2026';
import { flagUrlFromCountryCode, localizedCountryName } from '../config/eurovisionCountries';
import { getEurovisionHistory, type EurovisionEntry } from './eurovisionHistory';

export interface CurrentEditionEntry {
  contestName: string;
  runningOrder?: string;
  artist: string;
  song: string;
  directFinalist?: boolean;
}

export interface CountryProfile {
  countryCode: string;
  country: string;
  flag: string;
  currentEntries: CurrentEditionEntry[];
  isCurrentParticipant: boolean;
  participations: number;
  wins: number;
  averagePlace: number | null;
  bestPlace: number | null;
  averagePoints: number | null;
  totalPoints: number;
  firstYear: number | null;
  lastYear: number | null;
  history: EurovisionEntry[];
}

function countryMapFromHistory(history: Awaited<ReturnType<typeof getEurovisionHistory>>) {
  const map: Record<string, string> = {};
  for (const contest of history.contests) {
    for (const entry of contest.entries) {
      if (entry.countryCode) map[entry.countryCode] = entry.country;
    }
  }
  return map;
}

function currentEditionEntries(countryCode: string): CurrentEditionEntry[] {
  return eurovision2026Contests.flatMap((contest) => contest.songs
    .filter((song) => song.flag.toUpperCase() === countryCode)
    .map((song) => ({
      contestName: contest.name,
      runningOrder: song.runningOrder,
      artist: song.artist,
      song: song.song,
      directFinalist: song.directFinalist,
    })));
}

function roundedAverage(values: number[]) {
  if (!values.length) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

export async function listEurovisionCountryCodes(locale: Locale = defaultLocale) {
  const history = await getEurovisionHistory(locale);
  const codes = new Set<string>();

  for (const contest of history.contests) {
    for (const entry of contest.entries) {
      if (entry.countryCode) codes.add(entry.countryCode);
    }
  }

  for (const contest of eurovision2026Contests) {
    for (const song of contest.songs) codes.add(song.flag.toUpperCase());
  }

  return [...codes].sort();
}

export async function getEurovisionCountryProfile(countryCodeParam: string, locale: Locale = defaultLocale): Promise<CountryProfile | null> {
  const countryCode = countryCodeParam.toUpperCase();
  const validCodes = await listEurovisionCountryCodes(locale);
  if (!validCodes.includes(countryCode)) return null;

  const historyData = await getEurovisionHistory(locale);
  const countryMap = countryMapFromHistory(historyData);
  const country = localizedCountryName(countryCode, countryMap, locale);
  const history = historyData.contests
    .flatMap((contest) => contest.entries.filter((entry) => entry.countryCode === countryCode))
    .sort((a, b) => b.year - a.year);

  const places = history.map((entry) => entry.place).filter((place): place is number => typeof place === 'number');
  const points = history.map((entry) => entry.points).filter((point): point is number => typeof point === 'number');
  const years = history.map((entry) => entry.year);
  const currentEntries = currentEditionEntries(countryCode);

  return {
    countryCode,
    country,
    flag: flagUrlFromCountryCode(countryCode),
    currentEntries,
    isCurrentParticipant: currentEntries.length > 0,
    participations: history.length,
    wins: places.filter((place) => place === 1).length,
    averagePlace: roundedAverage(places),
    bestPlace: places.length ? Math.min(...places) : null,
    averagePoints: roundedAverage(points),
    totalPoints: points.reduce((sum, point) => sum + point, 0),
    firstYear: years.length ? Math.min(...years) : null,
    lastYear: years.length ? Math.max(...years) : null,
    history,
  };
}
