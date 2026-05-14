import { defaultLocale, type Locale } from '../config/site';
import { eurovision2026Contests } from '../config/eurovision2026';
import { getSearchLabels } from '../i18n/searchLabels';
import { getLocalizedPath } from '../i18n/ui';
import { listEurovisionCountryProfiles } from './eurovisionCountryProfiles';
import { getEurovisionEditions } from './eurovisionEditions';
import { rankingSlugs } from './eurovisionRankings';

export type SearchResultType = 'country' | 'edition' | 'song' | 'artist' | 'tool';
type RankingSlug = typeof rankingSlugs[number];

export interface SearchIndexItem {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  keywords: string[];
}

type ToolId = 'vote' | 'prediction' | 'history' | 'countries' | 'timeline' | 'rankings' | 'country-comparator' | 'points-by-country';

const toolTitles: Record<Locale, Record<ToolId, string>> = {
  es: { vote: 'Vota Eurovision 2026', prediction: 'Quiniela Eurovision 2026', history: 'Histórico de Eurovision', countries: 'Países', timeline: 'Línea temporal de Eurovision', rankings: 'Rankings de Eurovision', 'country-comparator': 'Comparador de países', 'points-by-country': 'Puntos por país' },
  en: { vote: 'Vote Eurovision 2026', prediction: 'Eurovision 2026 prediction', history: 'Eurovision history', countries: 'Countries', timeline: 'Eurovision timeline', rankings: 'Eurovision rankings', 'country-comparator': 'Country comparator', 'points-by-country': 'Points by country' },
  fr: { vote: 'Voter Eurovision 2026', prediction: 'Pronostic Eurovision 2026', history: 'Historique de l’Eurovision', countries: 'Pays', timeline: 'Chronologie de l’Eurovision', rankings: 'Classements Eurovision', 'country-comparator': 'Comparateur de pays', 'points-by-country': 'Points par pays' },
  pt: { vote: 'Votar na Eurovisão 2026', prediction: 'Prognóstico Eurovisão 2026', history: 'Histórico da Eurovisão', countries: 'Países', timeline: 'Linha temporal da Eurovisão', rankings: 'Rankings da Eurovisão', 'country-comparator': 'Comparador de países', 'points-by-country': 'Pontos por país' },
  ca: { vote: 'Vota Eurovisió 2026', prediction: 'Quiniela Eurovisió 2026', history: 'Històric d’Eurovisió', countries: 'Països', timeline: 'Línia temporal d’Eurovisió', rankings: 'Rànquings d’Eurovisió', 'country-comparator': 'Comparador de països', 'points-by-country': 'Punts per país' },
  eu: { vote: 'Bozkatu Eurovision 2026', prediction: 'Eurovision 2026 kiniela', history: 'Eurovision historia', countries: 'Herrialdeak', timeline: 'Eurovisioneko denbora-lerroa', rankings: 'Eurovision rankingak', 'country-comparator': 'Herrialdeen konparatzailea', 'points-by-country': 'Puntuak herrialdeka' },
  gl: { vote: 'Vota Eurovisión 2026', prediction: 'Quiniela Eurovisión 2026', history: 'Histórico de Eurovisión', countries: 'Países', timeline: 'Liña temporal de Eurovisión', rankings: 'Rankings de Eurovisión', 'country-comparator': 'Comparador de países', 'points-by-country': 'Puntos por país' },
};

const rankingTitles: Record<Locale, Record<RankingSlug, string>> = {
  es: { 'mas-victorias': 'Países con más victorias', 'mas-participaciones': 'Países con más participaciones', 'ganadores-por-decada': 'Ganadores por década', 'mejores-puntuaciones': 'Mejores puntuaciones', 'mas-top-10': 'Países con más top 10', 'sedes-repetidas': 'Sedes repetidas', 'ediciones-mas-participantes': 'Ediciones con más participantes' },
  en: { 'mas-victorias': 'Countries with most wins', 'mas-participaciones': 'Countries with most appearances', 'ganadores-por-decada': 'Winners by decade', 'mejores-puntuaciones': 'Best scores', 'mas-top-10': 'Countries with most top 10s', 'sedes-repetidas': 'Repeated venues', 'ediciones-mas-participantes': 'Editions with most participants' },
  fr: { 'mas-victorias': 'Pays avec le plus de victoires', 'mas-participaciones': 'Pays avec le plus de participations', 'ganadores-por-decada': 'Gagnants par décennie', 'mejores-puntuaciones': 'Meilleurs scores', 'mas-top-10': 'Pays avec le plus de top 10', 'sedes-repetidas': 'Salles répétées', 'ediciones-mas-participantes': 'Éditions avec le plus de participants' },
  pt: { 'mas-victorias': 'Países com mais vitórias', 'mas-participaciones': 'Países com mais participações', 'ganadores-por-decada': 'Vencedores por década', 'mejores-puntuaciones': 'Melhores pontuações', 'mas-top-10': 'Países com mais top 10', 'sedes-repetidas': 'Sedes repetidas', 'ediciones-mas-participantes': 'Edições com mais participantes' },
  ca: { 'mas-victorias': 'Països amb més victòries', 'mas-participaciones': 'Països amb més participacions', 'ganadores-por-decada': 'Guanyadors per dècada', 'mejores-puntuaciones': 'Millors puntuacions', 'mas-top-10': 'Països amb més top 10', 'sedes-repetidas': 'Seus repetides', 'ediciones-mas-participantes': 'Edicions amb més participants' },
  eu: { 'mas-victorias': 'Garaipen gehien dituzten herrialdeak', 'mas-participaciones': 'Parte-hartze gehien dituzten herrialdeak', 'ganadores-por-decada': 'Irabazleak hamarkadaka', 'mejores-puntuaciones': 'Puntuazio onenak', 'mas-top-10': 'Top 10 gehien dituzten herrialdeak', 'sedes-repetidas': 'Errepikatutako egoitzak', 'ediciones-mas-participantes': 'Parte-hartzaile gehien izan dituzten edizioak' },
  gl: { 'mas-victorias': 'Países con máis vitorias', 'mas-participaciones': 'Países con máis participacións', 'ganadores-por-decada': 'Gañadores por década', 'mejores-puntuaciones': 'Mellores puntuacións', 'mas-top-10': 'Países con máis top 10', 'sedes-repetidas': 'Sedes repetidas', 'ediciones-mas-participantes': 'Edicións con máis participantes' },
};

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

function toolItems(locale: Locale): SearchIndexItem[] {
  const labels = getSearchLabels(locale);
  const titles = toolTitles[locale] ?? toolTitles[defaultLocale];
  const rankingNames = rankingTitles[locale] ?? rankingTitles[defaultLocale];
  const tools: Array<{ id: ToolId; href: string; keywords: string[] }> = [
    { id: 'vote', href: '/vota/', keywords: ['votar', 'vote', 'puntuaciones', 'semifinal', 'final'] },
    { id: 'prediction', href: '/quiniela/', keywords: ['prediccion', 'prediction', 'quiniela', 'pronostico'] },
    { id: 'history', href: '/historico/', keywords: ['historia', 'history', 'ediciones', 'resultados'] },
    { id: 'countries', href: '/paises/', keywords: ['paises', 'countries', 'participantes'] },
    { id: 'timeline', href: '/linea-tiempo/', keywords: ['timeline', 'cronologia', 'historia'] },
    { id: 'rankings', href: '/rankings/', keywords: ['ranking', 'estadisticas', 'top'] },
    { id: 'country-comparator', href: '/comparador-paises/', keywords: ['comparar', 'compare', 'paises', 'estadisticas'] },
    { id: 'points-by-country', href: '/puntos-por-pais/', keywords: ['puntos', 'points', 'votos', 'pais'] },
  ];

  return [
    ...tools.map((tool) => ({
      id: `tool:${tool.id}`,
      type: 'tool' as const,
      title: titles[tool.id],
      description: labels.typeLabels.tool,
      href: getLocalizedPath(tool.href, locale),
      keywords: tool.keywords,
    })),
    ...rankingSlugs.map((slug) => ({
      id: `tool:ranking:${slug}`,
      type: 'tool' as const,
      title: rankingNames[slug],
      description: labels.groups.tool,
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
