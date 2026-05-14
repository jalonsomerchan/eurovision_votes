import { defaultLocale, type Locale } from '../config/site';
import { getSearchLabels } from '../i18n/searchLabels';
import { getLocalizedPath } from '../i18n/ui';
import { rankingSlugs } from './eurovisionRankings';
import type { SearchIndexItem } from './searchIndex';

type RankingSlug = typeof rankingSlugs[number];
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

export function getSearchToolItems(locale: Locale): SearchIndexItem[] {
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
