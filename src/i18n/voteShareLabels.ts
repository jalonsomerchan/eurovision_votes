import { defaultLocale, type Locale } from '../config/site';

type VoteShareLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  imageAction: string;
  linkAction: string;
  previewTitle: string;
  closePreview: string;
  shareImage: string;
  downloadImage: string;
  imageReady: string;
  imageEmpty: string;
  imageError: string;
  imageShared: string;
  imageDownloaded: string;
  shareUnavailable: string;
  variantTop10: string;
  variantTop3: string;
  variantRunningOrder: string;
  variantScoreOrder: string;
  variantQualifiedOnly: string;
  generatedWith: string;
};

const generatedWith = 'Generado en eurovision.alon.one';

const labels: Record<Locale, VoteShareLabels> = {
  es: { eyebrow: 'Comparte tus votaciones', title: 'Comparte tu resultado', copy: 'Genera varias imágenes de tus votaciones y elige cuál quieres descargar o compartir.', imageAction: 'Generar imágenes', linkAction: 'Compartir enlace de mis votaciones', previewTitle: 'Elige una imagen de tus votaciones', closePreview: 'Cerrar', shareImage: 'Compartir imagen', downloadImage: 'Descargar imagen', imageReady: 'Imágenes generadas correctamente.', imageEmpty: 'Puntúa canciones en esta gala antes de generar la imagen.', imageError: 'No se pudo generar la imagen en este navegador.', imageShared: 'Imagen compartida correctamente.', imageDownloaded: 'Imagen descargada correctamente.', shareUnavailable: 'No se pudo compartir la imagen en este dispositivo.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'Todas por orden de participación', variantScoreOrder: 'Todas por orden de votos', variantQualifiedOnly: 'Solo países clasificados', generatedWith },
  en: { eyebrow: 'Share your votes', title: 'Share your result', copy: 'Generate several images from your votes and choose which one to download or share.', imageAction: 'Generate images', linkAction: 'Share my voting link', previewTitle: 'Choose an image of your votes', closePreview: 'Close', shareImage: 'Share image', downloadImage: 'Download image', imageReady: 'Images generated successfully.', imageEmpty: 'Rate songs in this show before generating the image.', imageError: 'The image could not be generated in this browser.', imageShared: 'Image shared successfully.', imageDownloaded: 'Image downloaded successfully.', shareUnavailable: 'The image could not be shared on this device.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'All votes by running order', variantScoreOrder: 'All votes by score', variantQualifiedOnly: 'Qualified countries only', generatedWith },
  fr: { eyebrow: 'Partagez vos votes', title: 'Partagez votre résultat', copy: 'Générez plusieurs images de vos votes et choisissez laquelle télécharger ou partager.', imageAction: 'Générer les images', linkAction: 'Partager le lien de mes votes', previewTitle: 'Choisissez une image de vos votes', closePreview: 'Fermer', shareImage: 'Partager l’image', downloadImage: 'Télécharger l’image', imageReady: 'Images générées correctement.', imageEmpty: 'Notez des chansons de ce gala avant de générer l’image.', imageError: 'Impossible de générer l’image dans ce navigateur.', imageShared: 'Image partagée correctement.', imageDownloaded: 'Image téléchargée correctement.', shareUnavailable: 'Impossible de partager l’image sur cet appareil.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'Tous les votes par ordre de passage', variantScoreOrder: 'Tous les votes par score', variantQualifiedOnly: 'Pays qualifiés uniquement', generatedWith },
  pt: { eyebrow: 'Partilhe as suas votações', title: 'Partilhe o seu resultado', copy: 'Gere várias imagens das suas votações e escolha qual pretende descarregar ou partilhar.', imageAction: 'Gerar imagens', linkAction: 'Partilhar ligação das minhas votações', previewTitle: 'Escolha uma imagem das suas votações', closePreview: 'Fechar', shareImage: 'Partilhar imagem', downloadImage: 'Descarregar imagem', imageReady: 'Imagens geradas corretamente.', imageEmpty: 'Pontue canções nesta gala antes de gerar a imagem.', imageError: 'Não foi possível gerar a imagem neste navegador.', imageShared: 'Imagem partilhada corretamente.', imageDownloaded: 'Imagem descarregada corretamente.', shareUnavailable: 'Não foi possível partilhar a imagem neste dispositivo.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'Todas por ordem de atuação', variantScoreOrder: 'Todas por ordem de votos', variantQualifiedOnly: 'Apenas países classificados', generatedWith },
  ca: { eyebrow: 'Comparteix les teves votacions', title: 'Comparteix el teu resultat', copy: 'Genera diverses imatges de les teves votacions i tria quina vols descarregar o compartir.', imageAction: 'Generar imatges', linkAction: 'Compartir enllaç de les meves votacions', previewTitle: 'Tria una imatge de les teves votacions', closePreview: 'Tancar', shareImage: 'Compartir imatge', downloadImage: 'Descarregar imatge', imageReady: 'Imatges generades correctament.', imageEmpty: 'Puntua cançons en aquesta gala abans de generar la imatge.', imageError: 'No s’ha pogut generar la imatge en aquest navegador.', imageShared: 'Imatge compartida correctament.', imageDownloaded: 'Imatge descarregada correctament.', shareUnavailable: 'No s’ha pogut compartir la imatge en aquest dispositiu.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'Totes per ordre d’actuació', variantScoreOrder: 'Totes per ordre de vots', variantQualifiedOnly: 'Només països classificats', generatedWith },
  eu: { eyebrow: 'Partekatu zure botoak', title: 'Partekatu zure emaitza', copy: 'Sortu zure botoen hainbat irudi eta aukeratu zein deskargatu edo partekatu nahi duzun.', imageAction: 'Sortu irudiak', linkAction: 'Partekatu nire botoen esteka', previewTitle: 'Aukeratu zure botoen irudi bat', closePreview: 'Itxi', shareImage: 'Partekatu irudia', downloadImage: 'Deskargatu irudia', imageReady: 'Irudiak ondo sortu dira.', imageEmpty: 'Puntuatu gala honetako abestiak irudia sortu aurretik.', imageError: 'Ezin izan da irudia sortu nabigatzaile honetan.', imageShared: 'Irudia ondo partekatu da.', imageDownloaded: 'Irudia ondo deskargatu da.', shareUnavailable: 'Ezin izan da irudia gailu honetan partekatu.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'Guztiak emanaldien ordenan', variantScoreOrder: 'Guztiak botoen ordenan', variantQualifiedOnly: 'Sailkatutako herrialdeak bakarrik', generatedWith },
  gl: { eyebrow: 'Comparte as túas votacións', title: 'Comparte o teu resultado', copy: 'Xera varias imaxes das túas votacións e escolle cal queres descargar ou compartir.', imageAction: 'Xerar imaxes', linkAction: 'Compartir ligazón das miñas votacións', previewTitle: 'Escolle unha imaxe das túas votacións', closePreview: 'Pechar', shareImage: 'Compartir imaxe', downloadImage: 'Descargar imaxe', imageReady: 'Imaxes xeradas correctamente.', imageEmpty: 'Puntúa cancións nesta gala antes de xerar a imaxe.', imageError: 'Non se puido xerar a imaxe neste navegador.', imageShared: 'Imaxe compartida correctamente.', imageDownloaded: 'Imaxe descargada correctamente.', shareUnavailable: 'Non se puido compartir a imaxe neste dispositivo.', variantTop10: 'Top 10', variantTop3: 'Top 3', variantRunningOrder: 'Todas por orde de actuación', variantScoreOrder: 'Todas por orde de votos', variantQualifiedOnly: 'Só países clasificados', generatedWith },
};

export function getVoteShareLabels(locale: Locale = defaultLocale) {
  return labels[locale] ?? labels[defaultLocale];
}
