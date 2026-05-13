import { defaultLocale, type Locale } from '../config/site';
import { getEurovisionEditions, type EurovisionEdition, type EditionEntry } from './eurovisionEditions';

export interface CountryYearResult {
  year: number;
  place: number | null;
  points: number | null;
  won: boolean;
}

export interface CountryDecadeResult {
  decade: string;
  participations: number;
  wins: number;
  bestPlace: number | null;
  averagePoints: number | null;
}

export interface CountryComparison {
  countryCode: string;
  country: string;
  flag?: string;
  participations: number;
  wins: number;
  bestPlace: number | null;
  averagePoints: number | null;
  lastParticipation: number | null;
  resultsByDecade: CountryDecadeResult[];
  yearlyResults: CountryYearResult[];
}

type CountrySeed = Pick<CountryComparison, 'countryCode' | 'country' | 'flag'>;

function average(values: number[]) {
  if (!values.length) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function decadeFromYear(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

function entryKey(entry: EditionEntry) {
  return (entry.countryCode || entry.country).toUpperCase();
}

function countrySeedFrom(entry: EditionEntry): CountrySeed | null {
  const countryCode = entry.countryCode?.toUpperCase();
  if (!countryCode) return null;
  return { countryCode, country: entry.country, flag: entry.flag };
}

function bestEntry(entries: EditionEntry[]) {
  const ranked = entries.filter((entry) => typeof entry.place === 'number');
  if (ranked.length) return [...ranked].sort((a, b) => (a.place ?? 999) - (b.place ?? 999))[0];

  const scored = entries.filter((entry) => typeof entry.points === 'number');
  if (scored.length) return [...scored].sort((a, b) => (b.points ?? -1) - (a.points ?? -1))[0];

  return entries[0];
}

function resultForEdition(countryCode: string, edition: EurovisionEdition): CountryYearResult | null {
  const entries = edition.rounds.flatMap((round) => round.entries.filter((entry) => entryKey(entry) === countryCode));
  if (!entries.length) return null;

  const finalEntry = edition.rounds.find((round) => round.id === 'final')?.entries.find((entry) => entryKey(entry) === countryCode);
  const selectedEntry = finalEntry ?? bestEntry(entries);
  const fallbackPoints = entries.map((entry) => entry.points).filter((points): points is number => typeof points === 'number');

  return {
    year: edition.year,
    place: selectedEntry?.place ?? null,
    points: selectedEntry?.points ?? (fallbackPoints.length ? Math.max(...fallbackPoints) : null),
    won: Boolean(finalEntry && finalEntry.place === 1),
  };
}

function summarizeDecades(results: CountryYearResult[]) {
  const byDecade = new Map<string, CountryYearResult[]>();
  for (const result of results) {
    const decade = decadeFromYear(result.year);
    byDecade.set(decade, [...(byDecade.get(decade) ?? []), result]);
  }

  return [...byDecade.entries()]
    .map(([decade, items]) => {
      const places = items.map((item) => item.place).filter((place): place is number => typeof place === 'number');
      const points = items.map((item) => item.points).filter((point): point is number => typeof point === 'number');

      return {
        decade,
        participations: items.length,
        wins: items.filter((item) => item.won).length,
        bestPlace: places.length ? Math.min(...places) : null,
        averagePoints: average(points),
      };
    })
    .sort((a, b) => Number(b.decade.slice(0, 4)) - Number(a.decade.slice(0, 4)));
}

function summarizeCountry(seed: CountrySeed, editions: EurovisionEdition[]): CountryComparison {
  const yearlyResults = editions
    .map((edition) => resultForEdition(seed.countryCode, edition))
    .filter((result): result is CountryYearResult => Boolean(result))
    .sort((a, b) => b.year - a.year);
  const places = yearlyResults.map((result) => result.place).filter((place): place is number => typeof place === 'number');
  const points = yearlyResults.map((result) => result.points).filter((point): point is number => typeof point === 'number');

  return {
    ...seed,
    participations: yearlyResults.length,
    wins: yearlyResults.filter((result) => result.won).length,
    bestPlace: places.length ? Math.min(...places) : null,
    averagePoints: average(points),
    lastParticipation: yearlyResults[0]?.year ?? null,
    resultsByDecade: summarizeDecades(yearlyResults),
    yearlyResults,
  };
}

export async function listCountryComparisons(locale: Locale = defaultLocale): Promise<CountryComparison[]> {
  const editions = await getEurovisionEditions(locale);
  const countries = new Map<string, CountrySeed>();

  for (const edition of editions) {
    for (const entry of edition.rounds.flatMap((round) => round.entries)) {
      const seed = countrySeedFrom(entry);
      if (seed && !countries.has(seed.countryCode)) countries.set(seed.countryCode, seed);
    }
  }

  return [...countries.values()]
    .map((country) => summarizeCountry(country, editions))
    .sort((a, b) => a.country.localeCompare(b.country));
}
