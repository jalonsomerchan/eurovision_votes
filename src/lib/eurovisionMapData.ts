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
  AL: [41.15, 20.17], AD: [42.51, 1.52], AM: [40.07, 45.04], AU: [-25.27, 133.78], AT: [47.52, 14.55], AZ: [40.14, 47.58], BA: [43.92, 17.68], BE: [50.5, 4.47], BG: [42.73, 25.49], BY: [53.71, 27.95], CH: [46.82, 8.23], CY: [35.13, 33.43], CZ: [49.82, 15.47], DE: [51.17, 10.45], DK: [56.26, 9.5], EE: [58.6, 25.01], ES: [40.46, -3.75], FI: [61.92, 25.75], FR: [46.23, 2.21], GB: [55.38, -3.44], GE: [42.32, 43.36], GR: [39.07, 21.82], HR: [45.1, 15.2], HU: [47.16, 19.5], IE: [53.41, -8.24], IL: [31.05, 34.85], IS: [64.96, -19.02], IT: [41.87, 12.57], LT: [55.17, 23.88], LU: [49.82, 6.13], LV: [56.88, 24.6], MA: [31.79, -7.09], MC: [43.74, 7.42], MD: [47.41, 28.37], ME: [42.71, 19.37], MK: [41.61, 21.75], MT: [35.94, 14.38], NL: [52.13, 5.29], NO: [60.47, 8.47], PL: [51.92, 19.15], PT: [39.4, -8.22], RO: [45.94, 24.97], RS: [44.02, 21.01], RU: [61.52, 105.32], SM: [43.94, 12.46], SE: [60.13, 18.64], SI: [46.15, 14.99], SK: [48.67, 19.7], TR: [38.96, 35.24], UA: [48.38, 31.17], XK: [42.6, 20.9], YU: [44.02, 21.01],
};

function countryComparatorHref(countryCode: string, locale: Locale) {
  return `${getLocalizedPath('/comparador-paises/', locale)}?countries=${countryCode.toLowerCase()}`;
}

function countryCoordinatesFor(countryCode: string) {
  return countryCoordinates[countryCode] ?? [54, 14];
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
    .sort((a, b) => a.country.localeCompare(b.country));
}
