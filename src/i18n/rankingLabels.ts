import { defaultLocale, type Locale } from '../config/site';
import type { RankingSlug } from '../lib/eurovisionRankings';

type RankingText = {
  title: string;
  description: string;
  intro: string;
  valueLabel: string;
  detailLabel: string;
};

const shared = {
  es: {
    indexTitle: 'Rankings históricos de Eurovision',
    indexDescription: 'Rankings evergreen de Eurovision con países con más victorias, participaciones, ganadores por década, puntuaciones, top 10, sedes repetidas y ediciones con más participantes.',
    indexIntro: 'Explora rankings históricos generados con el dataset disponible del proyecto. Cuando un dato no existe en la fuente, se indica de forma explícita y no se inventa información.',
    eyebrow: 'Rankings históricos',
    viewRanking: 'Ver ranking',
    ranking: 'Ranking',
    position: 'Posición',
    item: 'Elemento',
    limitationsTitle: 'Límites de los datos',
    defaultLimit: 'Estos rankings se calculan solo con los datos disponibles en el dataset actual. Las posiciones, puntos, sedes o participantes pueden faltar en algunas ediciones.',
    pointsLimit: 'Hay ediciones sin puntos completos, por lo que el ranking de puntuaciones solo incluye entradas con puntuación disponible.',
    hostsLimit: 'Hay ediciones sin sede o ciudad completa, por lo que el ranking de sedes repetidas solo usa sedes identificadas.',
    emptyTitle: 'Ranking sin datos suficientes',
    emptyDescription: 'No hay datos suficientes para construir este ranking con el dataset actual.',
    allRankings: 'Todos los rankings',
  },
  en: {
    indexTitle: 'Historical Eurovision rankings',
    indexDescription: 'Evergreen Eurovision rankings with most wins, participations, winners by decade, scores, top 10s, repeated host cities and editions with most participants.',
    indexIntro: 'Explore historical rankings generated from the dataset available in the project. When data is missing from the source, the page states it clearly and does not invent information.',
    eyebrow: 'Historical rankings',
    viewRanking: 'View ranking',
    ranking: 'Ranking',
    position: 'Position',
    item: 'Item',
    limitationsTitle: 'Data limits',
    defaultLimit: 'These rankings are calculated only from the data available in the current dataset. Places, points, venues or participants may be missing for some editions.',
    pointsLimit: 'Some editions do not include complete points, so the score ranking only includes entries with available points.',
    hostsLimit: 'Some editions do not include complete venue or city data, so the repeated host ranking only uses identified hosts.',
    emptyTitle: 'Not enough data for this ranking',
    emptyDescription: 'There is not enough data to build this ranking from the current dataset.',
    allRankings: 'All rankings',
  },
  fr: {
    indexTitle: 'Classements historiques de l’Eurovision',
    indexDescription: 'Classements evergreen de l’Eurovision : pays avec le plus de victoires, participations, gagnants par décennie, scores, top 10, lieux répétés et éditions les plus nombreuses.',
    indexIntro: 'Explorez des classements historiques générés avec le dataset disponible dans le projet. Lorsqu’une donnée manque, la page l’indique clairement et ne l’invente pas.',
    eyebrow: 'Classements historiques',
    viewRanking: 'Voir le classement',
    ranking: 'Classement',
    position: 'Position',
    item: 'Élément',
    limitationsTitle: 'Limites des données',
    defaultLimit: 'Ces classements sont calculés uniquement avec les données disponibles dans le dataset actuel. Des places, points, lieux ou participants peuvent manquer pour certaines éditions.',
    pointsLimit: 'Certaines éditions n’ont pas de points complets ; le classement des scores inclut donc seulement les entrées avec points disponibles.',
    hostsLimit: 'Certaines éditions n’ont pas de lieu ou de ville complète ; le classement des lieux répétés utilise seulement les lieux identifiés.',
    emptyTitle: 'Données insuffisantes pour ce classement',
    emptyDescription: 'Le dataset actuel ne contient pas assez de données pour construire ce classement.',
    allRankings: 'Tous les classements',
  },
  pt: {
    indexTitle: 'Rankings históricos da Eurovisão',
    indexDescription: 'Rankings evergreen da Eurovisão com mais vitórias, participações, vencedores por década, pontuações, top 10, sedes repetidas e edições com mais participantes.',
    indexIntro: 'Explore rankings históricos gerados com o dataset disponível no projeto. Quando falta um dado na fonte, a página indica-o claramente e não inventa informação.',
    eyebrow: 'Rankings históricos',
    viewRanking: 'Ver ranking',
    ranking: 'Ranking',
    position: 'Posição',
    item: 'Elemento',
    limitationsTitle: 'Limites dos dados',
    defaultLimit: 'Estes rankings são calculados apenas com os dados disponíveis no dataset atual. Posições, pontos, sedes ou participantes podem faltar em algumas edições.',
    pointsLimit: 'Algumas edições não incluem pontos completos, por isso o ranking de pontuações só inclui entradas com pontuação disponível.',
    hostsLimit: 'Algumas edições não incluem sede ou cidade completa, por isso o ranking de sedes repetidas só usa sedes identificadas.',
    emptyTitle: 'Ranking sem dados suficientes',
    emptyDescription: 'Não há dados suficientes para construir este ranking com o dataset atual.',
    allRankings: 'Todos os rankings',
  },
  ca: {
    indexTitle: 'Rànquings històrics d’Eurovisió',
    indexDescription: 'Rànquings evergreen d’Eurovisió amb més victòries, participacions, guanyadors per dècada, puntuacions, top 10, seus repetides i edicions amb més participants.',
    indexIntro: 'Explora rànquings històrics generats amb el dataset disponible del projecte. Quan una dada no existeix a la font, la pàgina ho indica clarament i no inventa informació.',
    eyebrow: 'Rànquings històrics',
    viewRanking: 'Veure rànquing',
    ranking: 'Rànquing',
    position: 'Posició',
    item: 'Element',
    limitationsTitle: 'Límits de les dades',
    defaultLimit: 'Aquests rànquings es calculen només amb les dades disponibles al dataset actual. Posicions, punts, seus o participants poden faltar en algunes edicions.',
    pointsLimit: 'Algunes edicions no inclouen punts complets, per això el rànquing de puntuacions només inclou entrades amb puntuació disponible.',
    hostsLimit: 'Algunes edicions no inclouen seu o ciutat completa, per això el rànquing de seus repetides només usa seus identificades.',
    emptyTitle: 'Rànquing sense dades suficients',
    emptyDescription: 'No hi ha dades suficients per construir aquest rànquing amb el dataset actual.',
    allRankings: 'Tots els rànquings',
  },
  eu: {
    indexTitle: 'Eurovisioneko ranking historikoak',
    indexDescription: 'Eurovisioneko ranking evergreenak: garaipen gehien, parte-hartze gehien, hamarkadako irabazleak, puntuazio onenak, top 10 gehien, egoitza errepikatuak eta parte-hartzaile gehieneko edizioak.',
    indexIntro: 'Arakatu proiektuko dataset erabilgarriarekin sortutako ranking historikoak. Daturen bat iturrian falta bada, orriak argi adierazten du eta ez du informazioa asmatzen.',
    eyebrow: 'Ranking historikoak',
    viewRanking: 'Ikusi rankinga',
    ranking: 'Rankinga',
    position: 'Postua',
    item: 'Elementua',
    limitationsTitle: 'Datuen mugak',
    defaultLimit: 'Ranking hauek uneko datasetean dauden datuekin bakarrik kalkulatzen dira. Edizio batzuetan postuak, puntuak, egoitzak edo parte-hartzaileak falta daitezke.',
    pointsLimit: 'Edizio batzuek ez dituzte puntu osoak; beraz, puntuazioen rankingean puntuazioa duten sarrerak bakarrik sartzen dira.',
    hostsLimit: 'Edizio batzuek ez dute egoitza edo hiria osorik; beraz, egoitza errepikatuen rankingean identifikatutako egoitzak bakarrik erabiltzen dira.',
    emptyTitle: 'Ez dago nahikoa datu rankingerako',
    emptyDescription: 'Uneko datasetarekin ezin da ranking hau eraikitzeko adina datu aurkitu.',
    allRankings: 'Ranking guztiak',
  },
  gl: {
    indexTitle: 'Rankings históricos de Eurovisión',
    indexDescription: 'Rankings evergreen de Eurovisión con máis vitorias, participacións, gañadores por década, puntuacións, top 10, sedes repetidas e edicións con máis participantes.',
    indexIntro: 'Explora rankings históricos xerados co dataset dispoñible no proxecto. Cando falta un dato na fonte, a páxina indícao claramente e non inventa información.',
    eyebrow: 'Rankings históricos',
    viewRanking: 'Ver ranking',
    ranking: 'Ranking',
    position: 'Posición',
    item: 'Elemento',
    limitationsTitle: 'Límites dos datos',
    defaultLimit: 'Estes rankings calcúlanse só cos datos dispoñibles no dataset actual. Posicións, puntos, sedes ou participantes poden faltar nalgunhas edicións.',
    pointsLimit: 'Algunhas edicións non inclúen puntos completos, polo que o ranking de puntuacións só inclúe entradas con puntuación dispoñible.',
    hostsLimit: 'Algunhas edicións non inclúen sede ou cidade completa, polo que o ranking de sedes repetidas só usa sedes identificadas.',
    emptyTitle: 'Ranking sen datos suficientes',
    emptyDescription: 'Non hai datos suficientes para construír este ranking co dataset actual.',
    allRankings: 'Todos os rankings',
  },
} as const;

const esRankings: Record<RankingSlug, RankingText> = {
  'mas-victorias': { title: 'Países con más victorias en Eurovision', description: 'Ranking histórico de países con más victorias en Eurovision, calculado con el dataset disponible y enlaces a sus fichas.', intro: 'Consulta qué países acumulan más triunfos históricos en Eurovision según las finales disponibles en el dataset.', valueLabel: 'Victorias', detailLabel: 'Participaciones' },
  'mas-participaciones': { title: 'Países con más participaciones en Eurovision', description: 'Ranking de países con más participaciones históricas en Eurovision y enlaces a las fichas por país.', intro: 'Este ranking ordena los países por número de apariciones registradas en el histórico disponible.', valueLabel: 'Participaciones', detailLabel: 'Victorias' },
  'ganadores-por-decada': { title: 'Ganadores de Eurovision por década', description: 'Ranking de países ganadores de Eurovision agrupados por décadas según el dataset histórico disponible.', intro: 'Revisa qué países destacaron como ganadores en cada década del festival.', valueLabel: 'Victorias en la década', detailLabel: 'País' },
  'mejores-puntuaciones': { title: 'Mejores puntuaciones históricas de Eurovision', description: 'Ranking de las puntuaciones más altas de Eurovision cuando el dataset incluye puntos disponibles.', intro: 'Listado de las mayores puntuaciones registradas en las finales con datos de puntos disponibles.', valueLabel: 'Puntos', detailLabel: 'Año' },
  'mas-top-10': { title: 'Países con más top 10 en Eurovision', description: 'Ranking histórico de países con más resultados en el top 10 de Eurovision.', intro: 'Este ranking mide la regularidad de los países contando finales con posición entre las diez primeras.', valueLabel: 'Top 10', detailLabel: 'Participaciones' },
  'sedes-repetidas': { title: 'Ciudades y sedes repetidas de Eurovision', description: 'Ranking de ciudades o sedes que han acogido Eurovision más de una vez según los datos disponibles.', intro: 'Consulta qué sedes o ciudades aparecen repetidas como anfitrionas en el dataset.', valueLabel: 'Veces', detailLabel: 'Años' },
  'ediciones-mas-participantes': { title: 'Ediciones de Eurovision con más participantes', description: 'Ranking histórico de ediciones de Eurovision con mayor número de países participantes.', intro: 'Ordena las ediciones por volumen de participantes registrados en el dataset.', valueLabel: 'Participantes', detailLabel: 'Sede' },
};

const rankingText: Record<Locale, Record<RankingSlug, RankingText>> = {
  es: esRankings,
  en: {
    'mas-victorias': { title: 'Countries with the most Eurovision wins', description: 'Historical ranking of countries with the most Eurovision wins, calculated from the available dataset with links to country profiles.', intro: 'See which countries have accumulated the most Eurovision victories according to the finals available in the dataset.', valueLabel: 'Wins', detailLabel: 'Participations' },
    'mas-participaciones': { title: 'Countries with the most Eurovision participations', description: 'Ranking of countries with the most historical Eurovision participations and links to country profiles.', intro: 'This ranking orders countries by the number of recorded appearances in the available history.', valueLabel: 'Participations', detailLabel: 'Wins' },
    'ganadores-por-decada': { title: 'Eurovision winners by decade', description: 'Ranking of Eurovision winning countries grouped by decade using the available historical dataset.', intro: 'Review which countries stood out as winners in each decade of the contest.', valueLabel: 'Wins in decade', detailLabel: 'Country' },
    'mejores-puntuaciones': { title: 'Best historical Eurovision scores', description: 'Ranking of the highest Eurovision scores when the dataset includes available points.', intro: 'A list of the highest scores recorded in finals with points data available.', valueLabel: 'Points', detailLabel: 'Year' },
    'mas-top-10': { title: 'Countries with the most Eurovision top 10s', description: 'Historical ranking of countries with the most top 10 results in Eurovision.', intro: 'This ranking measures consistency by counting finals where each country finished in the top ten.', valueLabel: 'Top 10s', detailLabel: 'Participations' },
    'sedes-repetidas': { title: 'Repeated Eurovision host cities and venues', description: 'Ranking of cities or venues that have hosted Eurovision more than once according to available data.', intro: 'See which venues or cities appear more than once as hosts in the dataset.', valueLabel: 'Times', detailLabel: 'Years' },
    'ediciones-mas-participantes': { title: 'Eurovision editions with the most participants', description: 'Historical ranking of Eurovision editions with the largest number of participating countries.', intro: 'Orders editions by the number of participants recorded in the dataset.', valueLabel: 'Participants', detailLabel: 'Host' },
  },
  fr: {
    'mas-victorias': { title: 'Pays avec le plus de victoires à l’Eurovision', description: 'Classement historique des pays avec le plus de victoires à l’Eurovision, calculé avec le dataset disponible.', intro: 'Découvrez les pays qui cumulent le plus de victoires selon les finales disponibles dans le dataset.', valueLabel: 'Victoires', detailLabel: 'Participations' },
    'mas-participaciones': { title: 'Pays avec le plus de participations à l’Eurovision', description: 'Classement des pays avec le plus de participations historiques à l’Eurovision.', intro: 'Ce classement ordonne les pays par nombre d’apparitions enregistrées dans l’historique disponible.', valueLabel: 'Participations', detailLabel: 'Victoires' },
    'ganadores-por-decada': { title: 'Gagnants de l’Eurovision par décennie', description: 'Classement des pays gagnants de l’Eurovision groupés par décennie.', intro: 'Voyez quels pays ont marqué chaque décennie comme gagnants du concours.', valueLabel: 'Victoires dans la décennie', detailLabel: 'Pays' },
    'mejores-puntuaciones': { title: 'Meilleurs scores historiques de l’Eurovision', description: 'Classement des scores les plus élevés de l’Eurovision lorsque les points sont disponibles.', intro: 'Liste des plus grands scores enregistrés dans les finales avec données de points disponibles.', valueLabel: 'Points', detailLabel: 'Année' },
    'mas-top-10': { title: 'Pays avec le plus de top 10 à l’Eurovision', description: 'Classement historique des pays avec le plus de résultats dans le top 10.', intro: 'Ce classement mesure la régularité en comptant les finales terminées dans les dix premières places.', valueLabel: 'Top 10', detailLabel: 'Participations' },
    'sedes-repetidas': { title: 'Villes et lieux répétés de l’Eurovision', description: 'Classement des villes ou lieux ayant accueilli l’Eurovision plus d’une fois.', intro: 'Consultez les lieux ou villes qui apparaissent plusieurs fois comme hôtes dans le dataset.', valueLabel: 'Fois', detailLabel: 'Années' },
    'ediciones-mas-participantes': { title: 'Éditions de l’Eurovision avec le plus de participants', description: 'Classement historique des éditions de l’Eurovision avec le plus de pays participants.', intro: 'Classe les éditions selon le nombre de participants enregistrés dans le dataset.', valueLabel: 'Participants', detailLabel: 'Lieu' },
  },
  pt: esRankings,
  ca: esRankings,
  eu: esRankings,
  gl: esRankings,
};

export function getRankingLabels(locale: Locale = defaultLocale) {
  return shared[locale] ?? shared[defaultLocale];
}

export function getRankingText(slug: RankingSlug, locale: Locale = defaultLocale) {
  return rankingText[locale]?.[slug] ?? rankingText[defaultLocale][slug];
}
