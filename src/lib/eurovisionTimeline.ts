import { defaultLocale, type Locale } from '../config/site';
import { eurovisionTimelineMilestones, type TimelineMilestoneType } from '../data/eurovisionTimelineMilestones';
import { getLocalizedPath } from '../i18n/ui';
import { getEurovisionEditions, type EurovisionEdition } from './eurovisionEditions';

export type TimelineType = TimelineMilestoneType | 'edition';

export interface TimelineMilestone {
  title: string;
  description: string;
  type: TimelineMilestoneType;
}

export interface TimelineEntry {
  year: number;
  decade: string;
  title: string;
  hostCity?: string;
  hostCountry?: string;
  hostCountryCode?: string;
  venue?: string;
  winner?: string;
  winnerCode?: string;
  participants: number;
  editionHref: string;
  hostHref?: string;
  winnerHref?: string;
  types: TimelineType[];
  milestones: TimelineMilestone[];
}

export interface TimelineFilterOption {
  value: string;
  label: string;
}

export interface EurovisionTimeline {
  entries: TimelineEntry[];
  filters: {
    decades: TimelineFilterOption[];
    hosts: TimelineFilterOption[];
    winners: TimelineFilterOption[];
    types: TimelineType[];
  };
}

function countryHref(countryCode: string | undefined, locale: Locale) {
  return countryCode ? getLocalizedPath(`/paises/${countryCode.toLowerCase()}/`, locale) : undefined;
}

function decadeFromYear(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

function sortOptions(options: Map<string, string>) {
  return [...options.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function buildMilestoneMap(locale: Locale) {
  const map = new Map<number, TimelineMilestone[]>();

  for (const milestone of eurovisionTimelineMilestones) {
    const text = milestone.text[locale] ?? milestone.text[defaultLocale];
    const current = map.get(milestone.year) ?? [];
    current.push({ title: text.title, description: text.description, type: milestone.type });
    map.set(milestone.year, current);
  }

  return map;
}

function toTimelineEntry(edition: EurovisionEdition, locale: Locale, milestones: TimelineMilestone[]): TimelineEntry {
  const types: TimelineType[] = ['edition', ...new Set(milestones.map((milestone) => milestone.type))];

  return {
    year: edition.year,
    decade: decadeFromYear(edition.year),
    title: `Eurovision ${edition.year}`,
    hostCity: edition.hostCity,
    hostCountry: edition.hostCountry,
    hostCountryCode: edition.hostCountryCode,
    venue: edition.venue,
    winner: edition.winner,
    winnerCode: edition.winnerCode,
    participants: edition.participants,
    editionHref: getLocalizedPath(`/ediciones/${edition.year}/`, locale),
    hostHref: countryHref(edition.hostCountryCode, locale),
    winnerHref: countryHref(edition.winnerCode, locale),
    types,
    milestones,
  };
}

export async function getEurovisionTimeline(locale: Locale = defaultLocale): Promise<EurovisionTimeline> {
  const editions = await getEurovisionEditions(locale);
  const milestoneMap = buildMilestoneMap(locale);
  const entries = editions
    .map((edition) => toTimelineEntry(edition, locale, milestoneMap.get(edition.year) ?? []))
    .sort((a, b) => b.year - a.year);

  const decades = new Map<string, string>();
  const hosts = new Map<string, string>();
  const winners = new Map<string, string>();
  const types = new Set<TimelineType>(['edition']);

  for (const entry of entries) {
    decades.set(entry.decade, entry.decade);
    if (entry.hostCountryCode && entry.hostCountry) hosts.set(entry.hostCountryCode, entry.hostCountry);
    if (entry.winnerCode && entry.winner) winners.set(entry.winnerCode, entry.winner);
    entry.types.forEach((type) => types.add(type));
  }

  return {
    entries,
    filters: {
      decades: [...decades.entries()]
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => Number(b.value.slice(0, 4)) - Number(a.value.slice(0, 4))),
      hosts: sortOptions(hosts),
      winners: sortOptions(winners),
      types: [...types],
    },
  };
}
