import { defaultLocale, type Locale } from '../config/site';
import { getLocalizedPath } from '../i18n/ui';
import { getEurovisionEditions, type EurovisionEdition, type EditionEntry } from './eurovisionEditions';

export const rankingSlugs = [
  'mas-victorias',
  'mas-participaciones',
  'ganadores-por-decada',
  'mejores-puntuaciones',
  'mas-top-10',
  'sedes-repetidas',
  'ediciones-mas-participantes',
] as const;

export type RankingSlug = typeof rankingSlugs[number];

export interface RankingRow {
  rank?: number;
  label: string;
  value: number | string;
  detail?: string;
  countryCode?: string;
  flag?: string;
  year?: number;
  href?: string;
}

export interface RankingData {
  slug: RankingSlug;
  rows: RankingRow[];
  hasMissingPoints: boolean;
  hasMissingHosts: boolean;
}

type CountryStats = {
  country: string;
  countryCode?: string;
  flag?: string;
  participations: number;
  wins: number;
  top10: number;
};

type CountryKey = string;

function finalEntryKey(entry: EditionEntry): CountryKey {
  return (entry.countryCode || entry.country).toUpperCase();
}

function finalEntries(edition: EurovisionEdition) {
  return edition.rounds.find((round) => round.id === 'final')?.entries ?? edition.rounds.flatMap((round) => round.entries);
}

function countryStats(editions: EurovisionEdition[]) {
  const stats = new Map<CountryKey, CountryStats>();

  for (const edition of editions) {
    for (const entry of finalEntries(edition)) {
      const key = finalEntryKey(entry);
      const current = stats.get(key) ?? {
        country: entry.country,
        countryCode: entry.countryCode,
        flag: entry.flag,
        participations: 0,
        wins: 0,
        top10: 0,
      };

      current.participations += 1;
      if (entry.place === 1) current.wins += 1;
      if (typeof entry.place === 'number' && entry.place <= 10) current.top10 += 1;
      stats.set(key, current);
    }
  }

  return [...stats.values()];
}

function rankCountries(items: CountryStats[], valueKey: 'wins' | 'participations' | 'top10', locale: Locale) {
  return items
    .filter((item) => item[valueKey] > 0)
    .sort((a, b) => b[valueKey] - a[valueKey] || a.country.localeCompare(b.country))
    .slice(0, 25)
    .map((item, index) => ({
      rank: index + 1,
      label: item.country,
      value: item[valueKey],
      detail: `${item.participations}`,
      countryCode: item.countryCode,
      flag: item.flag,
      href: item.countryCode ? getLocalizedPath(`/paises/${item.countryCode.toLowerCase()}/`, locale) : undefined,
    }));
}

function decadeFromYear(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

function winnersByDecade(editions: EurovisionEdition[]) {
  const byDecade = new Map<string, Map<string, { country: string; countryCode?: string; flag?: string; wins: number }>>();

  for (const edition of editions) {
    const winner = finalEntries(edition).find((entry) => entry.place === 1) ?? (edition.winnerCode ? { country: edition.winner, countryCode: edition.winnerCode, flag: edition.winnerFlag, place: 1 } as EditionEntry : null);
    if (!winner?.country) continue;
    const decade = decadeFromYear(edition.year);
    const decadeMap = byDecade.get(decade) ?? new Map();
    const key = finalEntryKey(winner);
    const current = decadeMap.get(key) ?? { country: winner.country, countryCode: winner.countryCode, flag: winner.flag, wins: 0 };
    current.wins += 1;
    decadeMap.set(key, current);
    byDecade.set(decade, decadeMap);
  }

  return [...byDecade.entries()]
    .sort((a, b) => Number(b[0].slice(0, 4)) - Number(a[0].slice(0, 4)))
    .flatMap(([decade, winners], decadeIndex) => [...winners.values()]
      .sort((a, b) => b.wins - a.wins || a.country.localeCompare(b.country))
      .slice(0, 5)
      .map((winner, index) => ({
        rank: index === 0 ? decadeIndex + 1 : undefined,
        label: decade,
        value: winner.wins,
        detail: winner.country,
        countryCode: winner.countryCode,
        flag: winner.flag,
      })));
}

function bestScores(editions: EurovisionEdition[], locale: Locale) {
  return editions
    .flatMap((edition) => finalEntries(edition).map((entry) => ({ edition, entry })))
    .filter(({ entry }) => typeof entry.points === 'number')
    .sort((a, b) => (b.entry.points ?? 0) - (a.entry.points ?? 0) || b.edition.year - a.edition.year)
    .slice(0, 25)
    .map(({ edition, entry }, index) => ({
      rank: index + 1,
      label: entry.country,
      value: entry.points ?? 0,
      detail: `${edition.year}`,
      countryCode: entry.countryCode,
      flag: entry.flag,
      year: edition.year,
      href: getLocalizedPath(`/ediciones/${edition.year}/`, locale),
    }));
}

function repeatedHosts(editions: EurovisionEdition[], locale: Locale) {
  const hosts = new Map<string, { label: string; count: number; years: number[] }>();

  for (const edition of editions) {
    const label = [edition.hostCity, edition.venue].filter(Boolean).join(' · ') || edition.hostCity || edition.venue;
    if (!label) continue;
    const key = label.toLowerCase();
    const current = hosts.get(key) ?? { label, count: 0, years: [] };
    current.count += 1;
    current.years.push(edition.year);
    hosts.set(key, current);
  }

  return [...hosts.values()]
    .filter((host) => host.count > 1)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 25)
    .map((host, index) => ({
      rank: index + 1,
      label: host.label,
      value: host.count,
      detail: host.years.sort((a, b) => b - a).join(', '),
      href: host.years[0] ? getLocalizedPath(`/ediciones/${host.years[0]}/`, locale) : undefined,
    }));
}

function editionsByParticipants(editions: EurovisionEdition[], locale: Locale) {
  return editions
    .filter((edition) => edition.participants > 0)
    .sort((a, b) => b.participants - a.participants || b.year - a.year)
    .slice(0, 25)
    .map((edition, index) => ({
      rank: index + 1,
      label: `Eurovision ${edition.year}`,
      value: edition.participants,
      detail: [edition.hostCity, edition.hostCountry].filter(Boolean).join(', '),
      year: edition.year,
      href: getLocalizedPath(`/ediciones/${edition.year}/`, locale),
    }));
}

export function hasRankingSlug(value: string | undefined): value is RankingSlug {
  return Boolean(value && rankingSlugs.includes(value as RankingSlug));
}

export async function getEurovisionRanking(slug: RankingSlug, locale: Locale = defaultLocale): Promise<RankingData> {
  const editions = await getEurovisionEditions(locale);
  const stats = countryStats(editions);
  const hasMissingPoints = editions.some((edition) => finalEntries(edition).some((entry) => typeof entry.points !== 'number'));
  const hasMissingHosts = editions.some((edition) => !edition.hostCity && !edition.venue);

  const rows = slug === 'mas-victorias'
    ? rankCountries(stats, 'wins', locale)
    : slug === 'mas-participaciones'
      ? rankCountries(stats, 'participations', locale)
      : slug === 'ganadores-por-decada'
        ? winnersByDecade(editions)
        : slug === 'mejores-puntuaciones'
          ? bestScores(editions, locale)
          : slug === 'mas-top-10'
            ? rankCountries(stats, 'top10', locale)
            : slug === 'sedes-repetidas'
              ? repeatedHosts(editions, locale)
              : editionsByParticipants(editions, locale);

  return { slug, rows, hasMissingPoints, hasMissingHosts };
}

export async function listEurovisionRankings(locale: Locale = defaultLocale) {
  return Promise.all(rankingSlugs.map((slug) => getEurovisionRanking(slug, locale)));
}
