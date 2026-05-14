import { defaultLocale, type Locale } from '../config/site';
import type { SearchResultType } from '../lib/searchIndex';

type SearchLabels = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  inputLabel: string;
  inputPlaceholder: string;
  help: string;
  clear: string;
  initialTitle: string;
  initialCopy: string;
  emptyTitle: string;
  emptyCopy: string;
  errorTitle: string;
  errorCopy: string;
  status: string;
  openResult: string;
  groups: Record<SearchResultType, string>;
  typeLabels: Record<SearchResultType, string>;
};

const labels: Record<Locale, SearchLabels> = {
  es: {
    title: 'Buscador de Eurovision',
    description: 'Busca países, ediciones, canciones, artistas y herramientas del portal de Eurovision con resultados agrupados y enlaces internos.',
    eyebrow: 'Buscar en el portal',
    intro: 'Encuentra rápido países, ediciones históricas, canciones, artistas y utilidades usando el índice local del proyecto.',
    inputLabel: 'Buscar en Eurovision',
    inputPlaceholder: 'Prueba con Suecia, 2026, ABBA o rankings',
    help: 'Escribe al menos 2 caracteres. Puedes usar teclado, tildes o mayúsculas: el buscador normaliza la consulta.',
    clear: 'Limpiar búsqueda',
    initialTitle: 'Empieza a escribir para buscar',
    initialCopy: 'Los resultados aparecerán agrupados por tipo y enlazarán a páginas internas del portal.',
    emptyTitle: 'No hay resultados',
    emptyCopy: 'Prueba con otro país, año, canción, artista o herramienta.',
    errorTitle: 'No se pudo preparar el buscador',
    errorCopy: 'Recarga la página o navega por las secciones principales desde el menú.',
    status: '{count} resultados encontrados para “{query}”.',
    openResult: 'Abrir resultado',
    groups: { country: 'Países', edition: 'Ediciones', song: 'Canciones', artist: 'Artistas', tool: 'Herramientas' },
    typeLabels: { country: 'País', edition: 'Edición', song: 'Canción', artist: 'Artista', tool: 'Herramienta' },
  },
  en: {
    title: 'Eurovision search',
    description: 'Search countries, editions, songs, artists and portal tools with grouped results and internal links.',
    eyebrow: 'Search the portal',
    intro: 'Quickly find countries, historic editions, songs, artists and tools using the project’s local index.',
    inputLabel: 'Search Eurovision',
    inputPlaceholder: 'Try Sweden, 2026, ABBA or rankings',
    help: 'Type at least 2 characters. Accents and uppercase are normalized automatically.',
    clear: 'Clear search',
    initialTitle: 'Start typing to search',
    initialCopy: 'Results will appear grouped by type and link to internal portal pages.',
    emptyTitle: 'No results',
    emptyCopy: 'Try another country, year, song, artist or tool.',
    errorTitle: 'The search could not be prepared',
    errorCopy: 'Reload the page or browse the main sections from the menu.',
    status: '{count} results found for “{query}”.',
    openResult: 'Open result',
    groups: { country: 'Countries', edition: 'Editions', song: 'Songs', artist: 'Artists', tool: 'Tools' },
    typeLabels: { country: 'Country', edition: 'Edition', song: 'Song', artist: 'Artist', tool: 'Tool' },
  },
  fr: {
    title: 'Recherche Eurovision',
    description: 'Recherchez pays, éditions, chansons, artistes et outils du portail avec des résultats groupés et des liens internes.',
    eyebrow: 'Rechercher dans le portail',
    intro: 'Trouvez rapidement pays, éditions historiques, chansons, artistes et outils grâce à l’index local du projet.',
    inputLabel: 'Rechercher dans Eurovision',
    inputPlaceholder: 'Essayez Suède, 2026, ABBA ou classements',
    help: 'Saisissez au moins 2 caractères. Les accents et majuscules sont normalisés automatiquement.',
    clear: 'Effacer la recherche',
    initialTitle: 'Commencez à écrire pour chercher',
    initialCopy: 'Les résultats apparaîtront groupés par type avec des liens vers les pages internes.',
    emptyTitle: 'Aucun résultat',
    emptyCopy: 'Essayez un autre pays, une année, une chanson, un artiste ou un outil.',
    errorTitle: 'La recherche n’a pas pu être préparée',
    errorCopy: 'Rechargez la page ou parcourez les sections principales depuis le menu.',
    status: '{count} résultats trouvés pour « {query} ».',
    openResult: 'Ouvrir le résultat',
    groups: { country: 'Pays', edition: 'Éditions', song: 'Chansons', artist: 'Artistes', tool: 'Outils' },
    typeLabels: { country: 'Pays', edition: 'Édition', song: 'Chanson', artist: 'Artiste', tool: 'Outil' },
  },
  pt: {
    title: 'Pesquisa da Eurovisão',
    description: 'Pesquise países, edições, canções, artistas e ferramentas do portal com resultados agrupados e ligações internas.',
    eyebrow: 'Pesquisar no portal',
    intro: 'Encontre rapidamente países, edições históricas, canções, artistas e ferramentas usando o índice local do projeto.',
    inputLabel: 'Pesquisar na Eurovisão',
    inputPlaceholder: 'Experimente Suécia, 2026, ABBA ou rankings',
    help: 'Escreva pelo menos 2 caracteres. Acentos e maiúsculas são normalizados automaticamente.',
    clear: 'Limpar pesquisa',
    initialTitle: 'Comece a escrever para pesquisar',
    initialCopy: 'Os resultados aparecem agrupados por tipo e ligam a páginas internas do portal.',
    emptyTitle: 'Sem resultados',
    emptyCopy: 'Experimente outro país, ano, canção, artista ou ferramenta.',
    errorTitle: 'Não foi possível preparar a pesquisa',
    errorCopy: 'Recarregue a página ou navegue pelas secções principais no menu.',
    status: '{count} resultados encontrados para “{query}”.',
    openResult: 'Abrir resultado',
    groups: { country: 'Países', edition: 'Edições', song: 'Canções', artist: 'Artistas', tool: 'Ferramentas' },
    typeLabels: { country: 'País', edition: 'Edição', song: 'Canção', artist: 'Artista', tool: 'Ferramenta' },
  },
  ca: {
    title: 'Cercador d’Eurovisió',
    description: 'Cerca països, edicions, cançons, artistes i eines del portal amb resultats agrupats i enllaços interns.',
    eyebrow: 'Cerca al portal',
    intro: 'Troba ràpidament països, edicions històriques, cançons, artistes i eines amb l’índex local del projecte.',
    inputLabel: 'Cerca a Eurovisió',
    inputPlaceholder: 'Prova Suècia, 2026, ABBA o rànquings',
    help: 'Escriu com a mínim 2 caràcters. Els accents i majúscules es normalitzen automàticament.',
    clear: 'Netejar cerca',
    initialTitle: 'Comença a escriure per cercar',
    initialCopy: 'Els resultats apareixeran agrupats per tipus i enllaçaran a pàgines internes.',
    emptyTitle: 'No hi ha resultats',
    emptyCopy: 'Prova amb un altre país, any, cançó, artista o eina.',
    errorTitle: 'No s’ha pogut preparar el cercador',
    errorCopy: 'Recarrega la pàgina o navega per les seccions principals des del menú.',
    status: '{count} resultats trobats per a “{query}”.',
    openResult: 'Obrir resultat',
    groups: { country: 'Països', edition: 'Edicions', song: 'Cançons', artist: 'Artistes', tool: 'Eines' },
    typeLabels: { country: 'País', edition: 'Edició', song: 'Cançó', artist: 'Artista', tool: 'Eina' },
  },
  eu: {
    title: 'Eurovision bilatzailea',
    description: 'Bilatu herrialdeak, edizioak, abestiak, artistak eta atariko tresnak taldekatutako emaitzekin eta barne estekekin.',
    eyebrow: 'Bilatu atarian',
    intro: 'Aurkitu azkar herrialdeak, edizio historikoak, abestiak, artistak eta tresnak proiektuaren tokiko indizearekin.',
    inputLabel: 'Bilatu Eurovisionen',
    inputPlaceholder: 'Saiatu Suedia, 2026, ABBA edo rankingak',
    help: 'Idatzi gutxienez 2 karaktere. Azentuak eta maiuskulak automatikoki normalizatzen dira.',
    clear: 'Garbitu bilaketa',
    initialTitle: 'Hasi idazten bilatzeko',
    initialCopy: 'Emaitzak motaren arabera taldekatuta agertuko dira eta atariko barne orrietara eramango dute.',
    emptyTitle: 'Ez dago emaitzarik',
    emptyCopy: 'Saiatu beste herrialde, urte, abesti, artista edo tresna batekin.',
    errorTitle: 'Ezin izan da bilatzailea prestatu',
    errorCopy: 'Kargatu berriro orria edo nabigatu menu nagusiko ataletatik.',
    status: '{count} emaitza aurkitu dira “{query}” bilaketarako.',
    openResult: 'Ireki emaitza',
    groups: { country: 'Herrialdeak', edition: 'Edizioak', song: 'Abestiak', artist: 'Artistak', tool: 'Tresnak' },
    typeLabels: { country: 'Herrialdea', edition: 'Edizioa', song: 'Abestia', artist: 'Artista', tool: 'Tresna' },
  },
  gl: {
    title: 'Buscador de Eurovisión',
    description: 'Busca países, edicións, cancións, artistas e ferramentas do portal con resultados agrupados e ligazóns internas.',
    eyebrow: 'Buscar no portal',
    intro: 'Atopa rápido países, edicións históricas, cancións, artistas e ferramentas usando o índice local do proxecto.',
    inputLabel: 'Buscar en Eurovisión',
    inputPlaceholder: 'Proba Suecia, 2026, ABBA ou rankings',
    help: 'Escribe polo menos 2 caracteres. Os acentos e maiúsculas normalízanse automaticamente.',
    clear: 'Limpar busca',
    initialTitle: 'Comeza a escribir para buscar',
    initialCopy: 'Os resultados aparecerán agrupados por tipo e ligarán con páxinas internas do portal.',
    emptyTitle: 'Non hai resultados',
    emptyCopy: 'Proba con outro país, ano, canción, artista ou ferramenta.',
    errorTitle: 'Non se puido preparar o buscador',
    errorCopy: 'Recarga a páxina ou navega polas seccións principais desde o menú.',
    status: '{count} resultados atopados para “{query}”.',
    openResult: 'Abrir resultado',
    groups: { country: 'Países', edition: 'Edicións', song: 'Cancións', artist: 'Artistas', tool: 'Ferramentas' },
    typeLabels: { country: 'País', edition: 'Edición', song: 'Canción', artist: 'Artista', tool: 'Ferramenta' },
  },
};

export function getSearchLabels(locale: Locale = defaultLocale) {
  return labels[locale] ?? labels[defaultLocale];
}
