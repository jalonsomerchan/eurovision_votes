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
  x: number;
  y: number;
  path: string;
  href: string;
  compareHref: string;
  rankingsHref: string;
}

const countryPositions: Record<string, [number, number]> = {
  AL: [58, 67], AD: [32, 61], AM: [78, 63], AU: [93, 86], AT: [45, 55], AZ: [84, 62], BA: [52, 63], BE: [37, 49], BG: [60, 64], BY: [62, 43], CH: [41, 56], CY: [68, 72], CZ: [48, 51], DE: [42, 48], DK: [43, 39], EE: [60, 32], ES: [27, 65], FI: [60, 23], FR: [35, 56], GB: [29, 44], GE: [81, 61], GR: [59, 70], HR: [50, 61], HU: [52, 56], IE: [23, 43], IL: [72, 77], IS: [18, 24], IT: [45, 66], LT: [59, 39], LU: [39, 51], LV: [60, 36], MA: [25, 77], MC: [39, 63], MD: [62, 56], ME: [55, 65], MK: [57, 66], MT: [48, 76], NL: [38, 46], NO: [46, 27], PL: [52, 48], PT: [21, 67], RO: [59, 58], RS: [55, 62], RU: [76, 37], SM: [46, 62], SE: [51, 29], SI: [49, 59], SK: [51, 54], TR: [70, 66], UA: [65, 51], XK: [56, 65], YU: [54, 63],
};

const countryShapeScale: Record<string, [number, number]> = {
  AU: [8, 5], ES: [5.2, 4], FR: [5, 4.4], GB: [3.4, 4.8], IT: [3.1, 5.4], NO: [3.4, 6.8], SE: [3.6, 6.4], FI: [3.8, 5.6], TR: [6.6, 3.2], UA: [5.8, 3.5], DE: [4.1, 4.4], PL: [4.4, 3.8], RU: [8, 4.8],
};

function fallbackPosition(index: number, total: number): [number, number] {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  return [50 + Math.cos(angle) * 37, 52 + Math.sin(angle) * 34];
}

function countryComparatorHref(countryCode: string, locale: Locale) {
  return `${getLocalizedPath('/comparador-paises/', locale)}?countries=${countryCode.toLowerCase()}`;
}

function countryPath(countryCode: string, x: number, y: number) {
  const [width, height] = countryShapeScale[countryCode] ?? [3.2, 2.7];
  const left = x - width / 2;
  const top = y - height / 2;
  const notch = Math.min(width, height) * 0.22;

  return [
    `M ${left + notch} ${top}`,
    `L ${left + width - notch} ${top + notch * 0.12}`,
    `L ${left + width} ${top + height * 0.44}`,
    `L ${left + width - notch * 0.42} ${top + height}`,
    `L ${left + notch * 0.4} ${top + height - notch * 0.15}`,
    `L ${left} ${top + height * 0.5}`,
    'Z',
  ].join(' ');
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
    .map((profile, index, all) => {
      const position = countryPositions[profile.countryCode] ?? fallbackPosition(index, all.length);
      return {
        countryCode: profile.countryCode,
        country: profile.country,
        flag: profile.flag,
        participations: profile.participations,
        wins: profile.wins,
        bestPlace: profile.bestPlace,
        lastParticipation: profile.lastYear,
        debut: profile.firstYear,
        x: position[0],
        y: position[1],
        path: countryPath(profile.countryCode, position[0], position[1]),
        href: getLocalizedPath(`/paises/${profile.countryCode.toLowerCase()}/`, locale),
        compareHref: countryComparatorHref(profile.countryCode, locale),
        rankingsHref: getLocalizedPath('/rankings/', locale),
      };
    })
    .sort((a, b) => a.country.localeCompare(b.country));
}
