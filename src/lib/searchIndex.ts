import { defaultLocale, type Locale } from '../config/site';
import { eurovision2026Contests } from '../config/eurovision2026';
import { getSearchLabels } from '../i18n/searchLabels';
import { getLocalizedPath } from '../i18n/ui';
import { listEurovisionCountryProfiles } from './eurovisionCountryProfiles';
import { getEurovisionEditions } from './eurovisionEditions';
import { rankingSlugs } from './eurovisionRankings';

export type SearchResultType = 'country' | 'edition' | 'song' | 'artist' | 'tool';

export interface SearchIndexItem {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  keywords: string[];
}

const unique = <T>(values: T[]) => [...new Set(values.filter(Boolean))] as T[];

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñç\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function itemText(item: SearchIndexItem) {
  return normalizeSearchText([item.title, item.description, ...item.keywords].join(' '));
}

export function filterSearchIndex(items: SearchIndexItem[], query: string, limit = 40) {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length < 2) return [];
  const tokens = normalizedQuery.split(' ').filter(Boolean);

  return items
    .map((item) => {
      const text = itemText(item);
      const title = normalizeSearchText(item.title);
      const matches = tokens.every((token) => text.includes(token));
      if (!matches) return null;
      const score = tokens.reduce((sum, token) => sum + (title.startsWith(token) ? 4 : title.includes(token) ? 2 : 1), 0);
      return { item, score };
    })
    .filter((entry): entry is { item: SearchIndexItem; score: number } => Boolean(entry))
    .sort((a, b) => b.score - a.score || a.item.type.localeCompare(b.item.type) || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((entry) => entry.item);
}

function rankingTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function toolItems(locale: Locale): SearchIndexItem[] {
  const labels = getSearchLabels(locale);
  const tools = [
    { id: 'vote', title: 'Vota Eurovision 2026', href: '/vota/', keywords: ['votar', 'puntuaciones', 'semifinal', 'final'] },
    { id: 'prediction', title: 'Quiniela Eurovision 2026', href: '/quiniela/', keywords: ['prediccion', 'quiniela', 'pronostico'] },
    { id: 'history', title: 'Histórico de Eurovision', href: '/historico/', keywords: ['historia', 'ediciones', 'resultados'] },
    { id: 'countries', title: labels.groups.country, href: '/paises/', keywords: ['paises', 'participantes'] },
    { id: 'timeline', title: 'Línea temporal de Eurovision', href: '/linea-tiempo/', keywords: ['timeline', 'cronologia', 'historia'] },
    { id: 'rankings', title: 'Rankings de Eurovision', href: '/rankings/', keywords: ['ranking', 'estadisticas', 'top'] },
    { id: 'country-comparator', title: 'Comparador de países', href: '/comparador-paises/', keywords: ['comparar', 'paises', 'estadisticas'] },
    { id: 'points-by-country', title: 'Puntos por país', href: '/puntos-por-pais/', keywords: ['puntos', 'votos', 'pais'] },
  ];

  return [
    ...tools.map((tool) => ({
      id: `tool:${tool.id}`,
      type: 'tool' as const,
      title: tool.title,
      description: labels.typeLabels.tool,
      href: getLocalizedPath(tool.href, locale),
      keywords: tool.keywords,
    })),
    ...rankingSlugs.map((slug) => ({
      id: `tool:ranking:${slug}`,
      type: 'tool' as const,
      title: rankingTitle(slug),
      description: 'Ranking',
      href: getLocalizedPath(`/rankings/${slug}/`, locale),
      keywords: ['ranking', slug],
    })),
  ];
}

export async function buildSearchIndex(locale: Locale = defaultLocale): Promise<SearchIndexItem[]> {
  const labels = getSearchLabels(locale);
  const [countries, editions] = await Promise.all([
    listEurovisionCountryProfiles(locale),
    getEurovisionEditions(locale),
  ]);

  const countryItems = countries.map((country) => ({
    id: `country:${country.countryCode}`,
    type: 'country' as const,
    title: country.country,
    description: `${labels.typeLabels.country} · ${country.participations}`,
    href: getLocalizedPath(`/paises/${country.countryCode.toLowerCase()}/`, locale),
    keywords: [country.countryCode, country.country, country.isCurrentParticipant ? '2026' : '', country.wins ? 'ganador winner' : ''],
  }));

  const editionItems = editions.map((edition) => ({
    id: `edition:${edition.year}`,
    type: 'edition' as const,
    title: `Eurovision ${edition.year}`,
    description: unique([edition.hostCity, edition.hostCountry, edition.winner].filter(Boolean)).join(' · ') || labels.typeLabels.edition,
    href: getLocalizedPath(`/ediciones/${edition.year}/`, locale),
    keywords: [String(edition.year), edition.hostCity ?? '', edition.hostCountry ?? '', edition.winner ?? '', edition.winnerArtist ?? '', edition.winnerSong ?? ''],
  }));

  const songItems = new Map<string, SearchIndexItem>();
  const artistItems = new Map<string, SearchIndexItem>();

  for (const edition of editions) {
    for (const round of edition.rounds) {
      for (const entry of round.entries) {
        if (entry.song) {
          const key = `${entry.song}|${entry.artist ?? ''}|${entry.countryCode ?? entry.country}`.toLowerCase();
          if (!songItems.has(key)) {
            songItems.set(key, {
              id: `song:${edition.year}:${key}`,
              type: 'song',
              title: entry.song,
              description: unique([entry.artist, entry.country, String(edition.year)]).join(' · '),
              href: getLocalizedPath(`/ediciones/${edition.year}/`, locale),
              keywords: [entry.song, entry.artist ?? '', entry.country, entry.countryCode ?? '', String(edition.year)],
            });
          }
        }

        if (entry.artist) {
          const key = entry.artist.toLowerCase();
          const current = artistItems.get(key);
          const years = current ? [...current.keywords, String(edition.year)] : [String(edition.year)];
          artistItems.set(key, {
            id: `artist:${key}`,
            type: 'artist',
            title: entry.artist,
            description: unique([entry.country, entry.song, String(edition.year)]).join(' · '),
            href: getLocalizedPath(`/ediciones/${edition.year}/`, locale),
            keywords: unique([entry.artist, entry.song ?? '', entry.country, entry.countryCode ?? '', ...years]),
          });
        }
      }
    }
  }

  for (const contest of eurovision2026Contests) {
    for (const song of contest.songs) {
      const href = getLocalizedPath('/vota/', locale);
      if (song.song) {
        songItems.set(`2026:${song.song}:${song.flag}`.toLowerCase(), {
          id: `song:2026:${song.flag}:${song.song}`,
          type: 'song',
          title: song.song,
          description: unique([song.artist, song.country, contest.name]).join(' · '),
          href,
          keywords: [song.song, song.artist, song.country, song.flag, contest.name, '2026'],
        });
      }
      artistItems.set(`2026:${song.artist}:${song.flag}`.toLowerCase(), {
        id: `artist:2026:${song.flag}:${song.artist}`,
        type: 'artist',
        title: song.artist,
        description: unique([song.country, song.song, contest.name]).join(' · '),
        href,
        keywords: [song.artist, song.song, song.country, song.flag, contest.name, '2026'],
      });
    }
  }

  return [
    ...countryItems,
    ...editionItems,
    ...songItems.values(),
    ...artistItems.values(),
    ...toolItems(locale),
  ];
}
