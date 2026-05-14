import { defaultLocale, type Locale } from '../config/site';
import { getLocalizedPath } from '../i18n/ui';
import { getEurovisionCountryProfile, listEurovisionCountryProfiles } from './eurovisionCountryProfiles';

export const mapMetrics = ['participations', 'wins', 'bestPlace', 'lastParticipation', 'debut'] as const;
export type MapMetric = typeof mapMetrics[number];

export interface EurovisionMapCountry {
  countryCode: string;
  country: string;
  flag: string;
  participations: number;
  wins: number;
  bestPlace: number | null;
  lastParticipation: number | null;
  debut: number | null;
  href: string;
  compareHref: string;
  rankingsHref: string;
}

function countryComparatorHref(countryCode: string, locale: Locale) {
  return `${getLocalizedPath('/comparador-paises/', locale)}?countries=${countryCode.toLowerCase()}`;
}

export function valueForMapMetric(country: EurovisionMapCountry, metric: MapMetric) {
  if (metric === 'participations') return country.participations;
  if (metric === 'wins') return country.wins;
  if (metric === 'bestPlace') return country.bestPlace ? Math.max(1, 27 - country.bestPlace) : 0;
  if (metric === 'lastParticipation') return country.lastParticipation ?? 0;
  return country.debut ?? 0;
}

export async function getEurovisionMapCountries(locale: Locale = defaultLocale): Promise<EurovisionMapCountry[]> {
  const summaries = await listEurovisionCountryProfiles(locale);
  const profiles = await Promise.all(summaries.map((summary) => getEurovisionCountryProfile(summary.countryCode, locale)));

  return profiles
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile))
    .map((profile) => ({
      countryCode: profile.countryCode,
      country: profile.country,
      flag: profile.flag,
      participations: profile.participations,
      wins: profile.wins,
      bestPlace: profile.bestPlace,
      lastParticipation: profile.lastYear,
      debut: profile.firstYear,
      href: getLocalizedPath(`/paises/${profile.countryCode.toLowerCase()}/`, locale),
      compareHref: countryComparatorHref(profile.countryCode, locale),
      rankingsHref: getLocalizedPath('/rankings/', locale),
    }))
    .sort((a, b) => a.country.localeCompare(b.country));
}
