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
  latitude: number;
  longitude: number;
  href: string;
  compareHref: string;
  rankingsHref: string;
}

const countryCoordinates: Record<string, [number, number]> = {
  AD: [42.51, 1.52], AL: [41.33, 19.82], AM: [40.18, 44.51], AT: [48.21, 16.37], AU: [-35.28, 149.13], AZ: [40.38, 49.89], BA: [43.86, 18.41], BE: [50.85, 4.35], BG: [42.7, 23.32], BY: [53.9, 27.56], CH: [46.95, 7.44], CS: [44.82, 20.46], CY: [35.17, 33.36], CZ: [50.08, 14.44], DE: [52.52, 13.4], DK: [55.68, 12.57], EE: [59.44, 24.75], ES: [40.42, -3.7], FI: [60.17, 24.94], FR: [48.86, 2.35], GB: [51.51, -0.13], 'GB-WLS': [51.48, -3.18], GE: [41.72, 44.79], GR: [37.98, 23.73], HR: [45.81, 15.98], HU: [47.5, 19.04], IE: [53.35, -6.26], IL: [31.78, 35.22], IS: [64.15, -21.94], IT: [41.9, 12.5], KZ: [51.16, 71.47], LT: [54.69, 25.28], LU: [49.61, 6.13], LV: [56.95, 24.11], MA: [34.02, -6.83], MC: [43.74, 7.42], MD: [47.01, 28.86], ME: [42.43, 19.26], MK: [41.99, 21.43], MT: [35.9, 14.51], NL: [52.37, 4.9], NO: [59.91, 10.75], PL: [52.23, 21.01], PT: [38.72, -9.14], RO: [44.43, 26.1], RS: [44.82, 20.46], RU: [55.76, 37.62], SE: [59.33, 18.07], SI: [46.06, 14.51], SK: [48.15, 17.11], SM: [43.94, 12.45], TR: [39.93, 32.86], UA: [50.45, 30.52], XK: [42.66, 21.16], YU: [44.82, 20.46],
};

function countryComparatorHref(countryCode: string, locale: Locale) {
  return `${getLocalizedPath('/comparador-paises/', locale)}?countries=${countryCode.toLowerCase()}`;
}

function countryCoordinatesFor(countryCode: string) {
  return countryCoordinates[countryCode] ?? [0, 0];
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
    .map((profile) => {
      const [latitude, longitude] = countryCoordinatesFor(profile.countryCode);
      return {
        countryCode: profile.countryCode,
        country: profile.country,
        flag: profile.flag,
        participations: profile.participations,
        wins: profile.wins,
        bestPlace: profile.bestPlace,
        lastParticipation: profile.lastYear,
        debut: profile.firstYear,
        latitude,
        longitude,
        href: getLocalizedPath(`/paises/${profile.countryCode.toLowerCase()}/`, locale),
        compareHref: countryComparatorHref(profile.countryCode, locale),
        rankingsHref: getLocalizedPath('/rankings/', locale),
      };
    })
    .filter((country) => country.latitude !== 0 || country.longitude !== 0)
    .sort((a, b) => a.country.localeCompare(b.country));
}
