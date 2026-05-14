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
};

const labels: Record<Locale, VoteShareLabels> = {
  es: { eyebrow: 'Comparte tus votaciones', title: 'Comparte tu resultado', copy: 'Cuando hayas puntuado tus canciones, genera una imagen con tu ranking o comparte el enlace público de tus votaciones.', imageAction: 'Generar imagen', linkAction: 'Compartir enlace de mis votaciones', previewTitle: 'Imagen de tus votaciones', closePreview: 'Cerrar', shareImage: 'Compartir imagen', downloadImage: 'Descargar imagen', imageReady: 'Imagen generada correctamente.', imageEmpty: 'Puntúa canciones en esta gala antes de generar la imagen.', imageError: 'No se pudo generar la imagen en este navegador.', imageShared: 'Imagen compartida correctamente.', imageDownloaded: 'Imagen descargada correctamente.', shareUnavailable: 'No se pudo compartir la imagen en este dispositivo.' },
  en: { eyebrow: 'Share your votes', title: 'Share your result', copy: 'Once you have rated your songs, generate an image with your ranking or share the public link to your votes.', imageAction: 'Generate image', linkAction: 'Share my voting link', previewTitle: 'Image of your votes', closePreview: 'Close', shareImage: 'Share image', downloadImage: 'Download image', imageReady: 'Image generated successfully.', imageEmpty: 'Rate songs in this show before generating the image.', imageError: 'The image could not be generated in this browser.', imageShared: 'Image shared successfully.', imageDownloaded: 'Image downloaded successfully.', shareUnavailable: 'The image could not be shared on this device.' },
  fr: { eyebrow: 'Partagez vos votes', title: 'Partagez votre résultat', copy: 'Après avoir noté vos chansons, générez une image avec votre classement ou partagez le lien public de vos votes.', imageAction: 'Générer une image', linkAction: 'Partager le lien de mes votes', previewTitle: 'Image de vos votes', closePreview: 'Fermer', shareImage: 'Partager l’image', downloadImage: 'Télécharger l’image', imageReady: 'Image générée correctement.', imageEmpty: 'Notez des chansons de ce gala avant de générer l’image.', imageError: 'Impossible de générer l’image dans ce navigateur.', imageShared: 'Image partagée correctement.', imageDownloaded: 'Image téléchargée correctement.', shareUnavailable: 'Impossible de partager l’image sur cet appareil.' },
  pt: { eyebrow: 'Partilhe as suas votações', title: 'Partilhe o seu resultado', copy: 'Depois de pontuar as canções, gere uma imagem com o seu ranking ou partilhe a ligação pública das suas votações.', imageAction: 'Gerar imagem', linkAction: 'Partilhar ligação das minhas votações', previewTitle: 'Imagem das suas votações', closePreview: 'Fechar', shareImage: 'Partilhar imagem', downloadImage: 'Descarregar imagem', imageReady: 'Imagem gerada corretamente.', imageEmpty: 'Pontue canções nesta gala antes de gerar a imagem.', imageError: 'Não foi possível gerar a imagem neste navegador.', imageShared: 'Imagem partilhada corretamente.', imageDownloaded: 'Imagem descarregada corretamente.', shareUnavailable: 'Não foi possível partilhar a imagem neste dispositivo.' },
  ca: { eyebrow: 'Comparteix les teves votacions', title: 'Comparteix el teu resultat', copy: 'Quan hagis puntuat les cançons, genera una imatge amb el teu rànquing o comparteix l’enllaç públic de les teves votacions.', imageAction: 'Generar imatge', linkAction: 'Compartir enllaç de les meves votacions', previewTitle: 'Imatge de les teves votacions', closePreview: 'Tancar', shareImage: 'Compartir imatge', downloadImage: 'Descarregar imatge', imageReady: 'Imatge generada correctament.', imageEmpty: 'Puntua cançons en aquesta gala abans de generar la imatge.', imageError: 'No s’ha pogut generar la imatge en aquest navegador.', imageShared: 'Imatge compartida correctament.', imageDownloaded: 'Imatge descarregada correctament.', shareUnavailable: 'No s’ha pogut compartir la imatge en aquest dispositiu.' },
  eu: { eyebrow: 'Partekatu zure botoak', title: 'Partekatu zure emaitza', copy: 'Abestiak puntuatu ondoren, sortu zure rankingaren irudia edo partekatu zure botoen esteka publikoa.', imageAction: 'Sortu irudia', linkAction: 'Partekatu nire botoen esteka', previewTitle: 'Zure botoen irudia', closePreview: 'Itxi', shareImage: 'Partekatu irudia', downloadImage: 'Deskargatu irudia', imageReady: 'Irudia ondo sortu da.', imageEmpty: 'Puntuatu gala honetako abestiak irudia sortu aurretik.', imageError: 'Ezin izan da irudia sortu nabigatzaile honetan.', imageShared: 'Irudia ondo partekatu da.', imageDownloaded: 'Irudia ondo deskargatu da.', shareUnavailable: 'Ezin izan da irudia gailu honetan partekatu.' },
  gl: { eyebrow: 'Comparte as túas votacións', title: 'Comparte o teu resultado', copy: 'Cando puntúes as cancións, xera unha imaxe co teu ranking ou comparte a ligazón pública das túas votacións.', imageAction: 'Xerar imaxe', linkAction: 'Compartir ligazón das miñas votacións', previewTitle: 'Imaxe das túas votacións', closePreview: 'Pechar', shareImage: 'Compartir imaxe', downloadImage: 'Descargar imaxe', imageReady: 'Imaxe xerada correctamente.', imageEmpty: 'Puntúa cancións nesta gala antes de xerar a imaxe.', imageError: 'Non se puido xerar a imaxe neste navegador.', imageShared: 'Imaxe compartida correctamente.', imageDownloaded: 'Imaxe descargada correctamente.', shareUnavailable: 'Non se puido compartir a imaxe neste dispositivo.' },
};

export function getVoteShareLabels(locale: Locale = defaultLocale) {
  return labels[locale] ?? labels[defaultLocale];
}
