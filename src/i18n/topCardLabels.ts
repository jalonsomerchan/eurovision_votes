import { type Locale } from '../config/site';

type TopCardLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  galaLabel: string;
  limitLegend: string;
  top5: string;
  top10: string;
  copyText: string;
  downloadImage: string;
  previewLabel: string;
  emptyTitle: string;
  emptyCopy: string;
  incompleteTitle: string;
  incompleteCopy: string;
  scoreLabel: string;
  summaryTitle: string;
  generatedWith: string;
  copied: string;
  copyError: string;
  downloaded: string;
  downloadError: string;
  flagAlt: string;
};

const topCardLabels: Record<Locale, TopCardLabels> = {
  es: {
    eyebrow: 'Tarjeta compartible',
    title: 'Genera tu top personal',
    copy: 'Elige gala y tamaño para crear una tarjeta con tus países favoritos a partir de los votos guardados.',
    galaLabel: 'Gala',
    limitLegend: 'Tamaño del top',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Copiar resumen accesible',
    downloadImage: 'Descargar imagen',
    previewLabel: 'Previsualización de tu top personal',
    emptyTitle: 'Aún no hay votos suficientes',
    emptyCopy: 'Puntúa canciones en esta gala para generar tu tarjeta compartible.',
    incompleteTitle: 'Top parcial',
    incompleteCopy: 'Se muestran solo los países que ya tienen puntuación guardada.',
    scoreLabel: '{score} puntos',
    summaryTitle: 'Mi {limit} de {contest} en Eurovision 2026',
    generatedWith: 'Generado con Eurovision 2026',
    copied: 'Resumen copiado al portapapeles.',
    copyError: 'No se pudo copiar el resumen automáticamente.',
    downloaded: 'Imagen descargada correctamente.',
    downloadError: 'No se pudo generar la imagen en este navegador.',
    flagAlt: 'Bandera de {country}',
  },
  en: {
    eyebrow: 'Shareable card',
    title: 'Generate your personal top',
    copy: 'Choose a show and size to create a card with your favourite countries from your saved votes.',
    galaLabel: 'Show',
    limitLegend: 'Top size',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Copy accessible summary',
    downloadImage: 'Download image',
    previewLabel: 'Preview of your personal top',
    emptyTitle: 'Not enough votes yet',
    emptyCopy: 'Rate songs in this show to generate your shareable card.',
    incompleteTitle: 'Partial top',
    incompleteCopy: 'Only countries with a saved score are shown.',
    scoreLabel: '{score} points',
    summaryTitle: 'My {limit} for {contest} at Eurovision 2026',
    generatedWith: 'Generated with Eurovision 2026',
    copied: 'Summary copied to clipboard.',
    copyError: 'The summary could not be copied automatically.',
    downloaded: 'Image downloaded successfully.',
    downloadError: 'The image could not be generated in this browser.',
    flagAlt: 'Flag of {country}',
  },
  fr: {
    eyebrow: 'Carte partageable',
    title: 'Générez votre top personnel',
    copy: 'Choisissez un gala et une taille pour créer une carte avec vos pays favoris à partir de vos votes enregistrés.',
    galaLabel: 'Gala',
    limitLegend: 'Taille du top',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Copier le résumé accessible',
    downloadImage: 'Télécharger l’image',
    previewLabel: 'Aperçu de votre top personnel',
    emptyTitle: 'Pas encore assez de votes',
    emptyCopy: 'Notez des chansons dans ce gala pour générer votre carte partageable.',
    incompleteTitle: 'Top partiel',
    incompleteCopy: 'Seuls les pays avec une note enregistrée sont affichés.',
    scoreLabel: '{score} points',
    summaryTitle: 'Mon {limit} de {contest} à l’Eurovision 2026',
    generatedWith: 'Généré avec Eurovision 2026',
    copied: 'Résumé copié dans le presse-papiers.',
    copyError: 'Impossible de copier automatiquement le résumé.',
    downloaded: 'Image téléchargée correctement.',
    downloadError: 'Impossible de générer l’image dans ce navigateur.',
    flagAlt: 'Drapeau de {country}',
  },
  pt: {
    eyebrow: 'Cartão partilhável',
    title: 'Gere o seu top pessoal',
    copy: 'Escolha a gala e o tamanho para criar um cartão com os seus países favoritos a partir dos votos guardados.',
    galaLabel: 'Gala',
    limitLegend: 'Tamanho do top',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Copiar resumo acessível',
    downloadImage: 'Descarregar imagem',
    previewLabel: 'Pré-visualização do seu top pessoal',
    emptyTitle: 'Ainda não há votos suficientes',
    emptyCopy: 'Pontue canções nesta gala para gerar o seu cartão partilhável.',
    incompleteTitle: 'Top parcial',
    incompleteCopy: 'São mostrados apenas os países com pontuação guardada.',
    scoreLabel: '{score} pontos',
    summaryTitle: 'O meu {limit} de {contest} na Eurovisão 2026',
    generatedWith: 'Gerado com Eurovision 2026',
    copied: 'Resumo copiado para a área de transferência.',
    copyError: 'Não foi possível copiar automaticamente o resumo.',
    downloaded: 'Imagem descarregada corretamente.',
    downloadError: 'Não foi possível gerar a imagem neste navegador.',
    flagAlt: 'Bandeira de {country}',
  },
  ca: {
    eyebrow: 'Targeta compartible',
    title: 'Genera el teu top personal',
    copy: 'Tria gala i mida per crear una targeta amb els teus països preferits a partir dels vots desats.',
    galaLabel: 'Gala',
    limitLegend: 'Mida del top',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Copiar resum accessible',
    downloadImage: 'Descarregar imatge',
    previewLabel: 'Previsualització del teu top personal',
    emptyTitle: 'Encara no hi ha prou vots',
    emptyCopy: 'Puntua cançons en aquesta gala per generar la targeta compartible.',
    incompleteTitle: 'Top parcial',
    incompleteCopy: 'Només es mostren els països que ja tenen puntuació desada.',
    scoreLabel: '{score} punts',
    summaryTitle: 'El meu {limit} de {contest} a Eurovisió 2026',
    generatedWith: 'Generat amb Eurovision 2026',
    copied: 'Resum copiat al porta-retalls.',
    copyError: 'No s’ha pogut copiar automàticament el resum.',
    downloaded: 'Imatge descarregada correctament.',
    downloadError: 'No s’ha pogut generar la imatge en aquest navegador.',
    flagAlt: 'Bandera de {country}',
  },
  eu: {
    eyebrow: 'Partekatzeko txartela',
    title: 'Sortu zure top pertsonala',
    copy: 'Aukeratu gala eta tamaina gordetako botoekin zure herrialde gogokoenen txartela sortzeko.',
    galaLabel: 'Gala',
    limitLegend: 'Toparen tamaina',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Kopiatu laburpen irisgarria',
    downloadImage: 'Deskargatu irudia',
    previewLabel: 'Zure top pertsonalaren aurrebista',
    emptyTitle: 'Oraindik ez dago boto nahikorik',
    emptyCopy: 'Puntuatu gala honetako abestiak partekatzeko txartela sortzeko.',
    incompleteTitle: 'Top partziala',
    incompleteCopy: 'Gordetako puntuazioa duten herrialdeak bakarrik erakusten dira.',
    scoreLabel: '{score} puntu',
    summaryTitle: 'Nire {limit}, {contest}, Eurovision 2026',
    generatedWith: 'Eurovision 2026rekin sortua',
    copied: 'Laburpena arbelean kopiatu da.',
    copyError: 'Ezin izan da laburpena automatikoki kopiatu.',
    downloaded: 'Irudia ondo deskargatu da.',
    downloadError: 'Ezin izan da irudia sortu nabigatzaile honetan.',
    flagAlt: '{country} herrialdearen bandera',
  },
  gl: {
    eyebrow: 'Tarxeta compartible',
    title: 'Xera o teu top persoal',
    copy: 'Escolle gala e tamaño para crear unha tarxeta cos teus países favoritos a partir dos votos gardados.',
    galaLabel: 'Gala',
    limitLegend: 'Tamaño do top',
    top5: 'Top 5',
    top10: 'Top 10',
    copyText: 'Copiar resumo accesible',
    downloadImage: 'Descargar imaxe',
    previewLabel: 'Previsualización do teu top persoal',
    emptyTitle: 'Aínda non hai votos suficientes',
    emptyCopy: 'Puntúa cancións nesta gala para xerar a túa tarxeta compartible.',
    incompleteTitle: 'Top parcial',
    incompleteCopy: 'Móstranse só os países que xa teñen puntuación gardada.',
    scoreLabel: '{score} puntos',
    summaryTitle: 'O meu {limit} de {contest} en Eurovisión 2026',
    generatedWith: 'Xerado con Eurovision 2026',
    copied: 'Resumo copiado no portapapeis.',
    copyError: 'Non se puido copiar automaticamente o resumo.',
    downloaded: 'Imaxe descargada correctamente.',
    downloadError: 'Non se puido xerar a imaxe neste navegador.',
    flagAlt: 'Bandeira de {country}',
  },
};

export function getTopCardLabels(locale: Locale) {
  return topCardLabels[locale] ?? topCardLabels.es;
}
