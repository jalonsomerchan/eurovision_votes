import { defaultLocale, type Locale } from '../config/site';
import type { MapMetric } from '../lib/eurovisionMapData';

type MapLabels = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  metricLabel: string;
  selectedTitle: string;
  noSelection: string;
  profileLink: string;
  compareLink: string;
  rankingsLink: string;
  tableTitle: string;
  country: string;
  value: string;
  wins: string;
  participations: string;
  bestPlace: string;
  lastParticipation: string;
  debut: string;
  unavailable: string;
  mapLabel: string;
  mapControls: string;
  zoomIn: string;
  zoomOut: string;
  resetMap: string;
  pointLabel: string;
  metrics: Record<MapMetric, string>;
};

const labels: Record<Locale, MapLabels> = {
  es: {
    title: 'Mapa de países de Eurovision',
    description: 'Explora en un mapa interactivo participaciones, victorias, mejores posiciones, debut y última participación de los países de Eurovision.',
    eyebrow: 'Mapa interactivo',
    intro: 'Cambia la métrica visual, amplía, arrastra el mapa y selecciona un país para ver su resumen histórico y enlaces internos.',
    metricLabel: 'Métrica del mapa', selectedTitle: 'País seleccionado', noSelection: 'Selecciona un país del mapa o una fila de la tabla para ver el resumen.', profileLink: 'Ver ficha del país', compareLink: 'Comparar país', rankingsLink: 'Ver rankings', tableTitle: 'Tabla accesible de países', country: 'País', value: 'Valor', wins: 'Victorias', participations: 'Participaciones', bestPlace: 'Mejor puesto', lastParticipation: 'Última participación', debut: 'Debut', unavailable: 'Sin dato', mapLabel: 'Mapa vectorial interactivo de países de Eurovision', mapControls: 'Controles del mapa', zoomIn: 'Ampliar', zoomOut: 'Reducir', resetMap: 'Restablecer', pointLabel: '{country}: {metric} {value}',
    metrics: { participations: 'Participaciones', wins: 'Victorias', bestPlace: 'Mejor posición', lastParticipation: 'Última participación', debut: 'Debut' },
  },
  en: {
    title: 'Eurovision country map', description: 'Explore Eurovision countries on an interactive map by appearances, wins, best placing, debut and latest participation.', eyebrow: 'Interactive map', intro: 'Switch the visual metric, zoom, drag the map and select a country to see its historic summary and internal links.', metricLabel: 'Map metric', selectedTitle: 'Selected country', noSelection: 'Select a country on the map or a table row to see the summary.', profileLink: 'Open country profile', compareLink: 'Compare country', rankingsLink: 'View rankings', tableTitle: 'Accessible country table', country: 'Country', value: 'Value', wins: 'Wins', participations: 'Appearances', bestPlace: 'Best place', lastParticipation: 'Latest participation', debut: 'Debut', unavailable: 'No data', mapLabel: 'Interactive vector Eurovision country map', mapControls: 'Map controls', zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetMap: 'Reset', pointLabel: '{country}: {metric} {value}',
    metrics: { participations: 'Appearances', wins: 'Wins', bestPlace: 'Best placing', lastParticipation: 'Latest participation', debut: 'Debut' },
  },
  fr: {
    title: 'Carte des pays de l’Eurovision', description: 'Explorez les pays de l’Eurovision sur une carte interactive par participations, victoires, meilleur classement, début et dernière participation.', eyebrow: 'Carte interactive', intro: 'Changez la métrique visuelle, zoomez, déplacez la carte et sélectionnez un pays pour voir son résumé historique et des liens internes.', metricLabel: 'Métrique de la carte', selectedTitle: 'Pays sélectionné', noSelection: 'Sélectionnez un pays sur la carte ou une ligne du tableau pour voir le résumé.', profileLink: 'Voir la fiche du pays', compareLink: 'Comparer le pays', rankingsLink: 'Voir les classements', tableTitle: 'Tableau accessible des pays', country: 'Pays', value: 'Valeur', wins: 'Victoires', participations: 'Participations', bestPlace: 'Meilleure place', lastParticipation: 'Dernière participation', debut: 'Début', unavailable: 'Aucune donnée', mapLabel: 'Carte vectorielle interactive des pays de l’Eurovision', mapControls: 'Contrôles de la carte', zoomIn: 'Zoom avant', zoomOut: 'Zoom arrière', resetMap: 'Réinitialiser', pointLabel: '{country} : {metric} {value}',
    metrics: { participations: 'Participations', wins: 'Victoires', bestPlace: 'Meilleur classement', lastParticipation: 'Dernière participation', debut: 'Début' },
  },
  pt: {
    title: 'Mapa de países da Eurovisão', description: 'Explore os países da Eurovisão num mapa interativo por participações, vitórias, melhor posição, estreia e última participação.', eyebrow: 'Mapa interativo', intro: 'Altere a métrica visual, amplie, arraste o mapa e selecione um país para ver o resumo histórico e ligações internas.', metricLabel: 'Métrica do mapa', selectedTitle: 'País selecionado', noSelection: 'Selecione um país no mapa ou uma linha da tabela para ver o resumo.', profileLink: 'Ver ficha do país', compareLink: 'Comparar país', rankingsLink: 'Ver rankings', tableTitle: 'Tabela acessível de países', country: 'País', value: 'Valor', wins: 'Vitórias', participations: 'Participações', bestPlace: 'Melhor posição', lastParticipation: 'Última participação', debut: 'Estreia', unavailable: 'Sem dados', mapLabel: 'Mapa vetorial interativo dos países da Eurovisão', mapControls: 'Controlos do mapa', zoomIn: 'Ampliar', zoomOut: 'Reduzir', resetMap: 'Repor', pointLabel: '{country}: {metric} {value}',
    metrics: { participations: 'Participações', wins: 'Vitórias', bestPlace: 'Melhor posição', lastParticipation: 'Última participação', debut: 'Estreia' },
  },
  ca: {
    title: 'Mapa de països d’Eurovisió', description: 'Explora els països d’Eurovisió en un mapa interactiu per participacions, victòries, millor posició, debut i última participació.', eyebrow: 'Mapa interactiu', intro: 'Canvia la mètrica visual, amplia, arrossega el mapa i selecciona un país per veure’n el resum històric i enllaços interns.', metricLabel: 'Mètrica del mapa', selectedTitle: 'País seleccionat', noSelection: 'Selecciona un país del mapa o una fila de la taula per veure el resum.', profileLink: 'Veure fitxa del país', compareLink: 'Comparar país', rankingsLink: 'Veure rànquings', tableTitle: 'Taula accessible de països', country: 'País', value: 'Valor', wins: 'Victòries', participations: 'Participacions', bestPlace: 'Millor posició', lastParticipation: 'Última participació', debut: 'Debut', unavailable: 'Sense dades', mapLabel: 'Mapa vectorial interactiu de països d’Eurovisió', mapControls: 'Controls del mapa', zoomIn: 'Ampliar', zoomOut: 'Reduir', resetMap: 'Restablir', pointLabel: '{country}: {metric} {value}',
    metrics: { participations: 'Participacions', wins: 'Victòries', bestPlace: 'Millor posició', lastParticipation: 'Última participació', debut: 'Debut' },
  },
  eu: {
    title: 'Eurovision herrialdeen mapa', description: 'Arakatu Eurovision herrialdeak mapa interaktibo batean parte-hartzeen, garaipenen, posturik onenaren, debutaren eta azken parte-hartzearen arabera.', eyebrow: 'Mapa interaktiboa', intro: 'Aldatu metrika bisuala, handitu, arrastatu mapa eta hautatu herrialde bat laburpen historikoa eta barne estekak ikusteko.', metricLabel: 'Maparen metrika', selectedTitle: 'Hautatutako herrialdea', noSelection: 'Hautatu mapako herrialde bat edo taulako errenkada bat laburpena ikusteko.', profileLink: 'Ikusi herrialdearen fitxa', compareLink: 'Konparatu herrialdea', rankingsLink: 'Ikusi rankingak', tableTitle: 'Herrialdeen taula irisgarria', country: 'Herrialdea', value: 'Balioa', wins: 'Garaipenak', participations: 'Parte-hartzeak', bestPlace: 'Posturik onena', lastParticipation: 'Azken parte-hartzea', debut: 'Debuta', unavailable: 'Daturik ez', mapLabel: 'Eurovision herrialdeen mapa bektorial interaktiboa', mapControls: 'Maparen kontrolak', zoomIn: 'Handitu', zoomOut: 'Txikitu', resetMap: 'Berrezarri', pointLabel: '{country}: {metric} {value}',
    metrics: { participations: 'Parte-hartzeak', wins: 'Garaipenak', bestPlace: 'Posturik onena', lastParticipation: 'Azken parte-hartzea', debut: 'Debuta' },
  },
  gl: {
    title: 'Mapa de países de Eurovisión', description: 'Explora os países de Eurovisión nun mapa interactivo por participacións, vitorias, mellor posición, debut e última participación.', eyebrow: 'Mapa interactivo', intro: 'Cambia a métrica visual, amplía, arrastra o mapa e selecciona un país para ver o seu resumo histórico e ligazóns internas.', metricLabel: 'Métrica do mapa', selectedTitle: 'País seleccionado', noSelection: 'Selecciona un país do mapa ou unha fila da táboa para ver o resumo.', profileLink: 'Ver ficha do país', compareLink: 'Comparar país', rankingsLink: 'Ver rankings', tableTitle: 'Táboa accesible de países', country: 'País', value: 'Valor', wins: 'Vitorias', participations: 'Participacións', bestPlace: 'Mellor posto', lastParticipation: 'Última participación', debut: 'Debut', unavailable: 'Sen dato', mapLabel: 'Mapa vectorial interactivo de países de Eurovisión', mapControls: 'Controis do mapa', zoomIn: 'Ampliar', zoomOut: 'Reducir', resetMap: 'Restablecer', pointLabel: '{country}: {metric} {value}',
    metrics: { participations: 'Participacións', wins: 'Vitorias', bestPlace: 'Mellor posto', lastParticipation: 'Última participación', debut: 'Debut' },
  },
};

export function getMapLabels(locale: Locale = defaultLocale) {
  return labels[locale] ?? labels[defaultLocale];
}
