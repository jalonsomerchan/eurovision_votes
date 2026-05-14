import { defaultLocale, type Locale } from '../config/site';

type VoteShareLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  imageAction: string;
  linkAction: string;
  imageReady: string;
  imageEmpty: string;
};

const labels: Record<Locale, VoteShareLabels> = {
  es: { eyebrow: 'Comparte tus votaciones', title: 'Comparte tu resultado', copy: 'Cuando hayas puntuado tus canciones, genera una imagen con tu ranking o comparte el enlace público de tus votaciones.', imageAction: 'Generar imagen', linkAction: 'Compartir enlace de mis votaciones', imageReady: 'Imagen generada correctamente.', imageEmpty: 'Puntúa canciones en esta gala antes de generar la imagen.' },
  en: { eyebrow: 'Share your votes', title: 'Share your result', copy: 'Once you have rated your songs, generate an image with your ranking or share the public link to your votes.', imageAction: 'Generate image', linkAction: 'Share my voting link', imageReady: 'Image generated successfully.', imageEmpty: 'Rate songs in this show before generating the image.' },
  fr: { eyebrow: 'Partagez vos votes', title: 'Partagez votre résultat', copy: 'Après avoir noté vos chansons, générez une image avec votre classement ou partagez le lien public de vos votes.', imageAction: 'Générer une image', linkAction: 'Partager le lien de mes votes', imageReady: 'Image générée correctement.', imageEmpty: 'Notez des chansons de ce gala avant de générer l’image.' },
  pt: { eyebrow: 'Partilhe as suas votações', title: 'Partilhe o seu resultado', copy: 'Depois de pontuar as canções, gere uma imagem com o seu ranking ou partilhe a ligação pública das suas votações.', imageAction: 'Gerar imagem', linkAction: 'Partilhar ligação das minhas votações', imageReady: 'Imagem gerada corretamente.', imageEmpty: 'Pontue canções nesta gala antes de gerar a imagem.' },
  ca: { eyebrow: 'Comparteix les teves votacions', title: 'Comparteix el teu resultat', copy: 'Quan hagis puntuat les cançons, genera una imatge amb el teu rànquing o comparteix l’enllaç públic de les teves votacions.', imageAction: 'Generar imatge', linkAction: 'Compartir enllaç de les meves votacions', imageReady: 'Imatge generada correctament.', imageEmpty: 'Puntua cançons en aquesta gala abans de generar la imatge.' },
  eu: { eyebrow: 'Partekatu zure botoak', title: 'Partekatu zure emaitza', copy: 'Abestiak puntuatu ondoren, sortu zure rankingaren irudia edo partekatu zure botoen esteka publikoa.', imageAction: 'Sortu irudia', linkAction: 'Partekatu nire botoen esteka', imageReady: 'Irudia ondo sortu da.', imageEmpty: 'Puntuatu gala honetako abestiak irudia sortu aurretik.' },
  gl: { eyebrow: 'Comparte as túas votacións', title: 'Comparte o teu resultado', copy: 'Cando puntúes as cancións, xera unha imaxe co teu ranking ou comparte a ligazón pública das túas votacións.', imageAction: 'Xerar imaxe', linkAction: 'Compartir ligazón das miñas votacións', imageReady: 'Imaxe xerada correctamente.', imageEmpty: 'Puntúa cancións nesta gala antes de xerar a imaxe.' },
};

export function getVoteShareLabels(locale: Locale = defaultLocale) {
  return labels[locale] ?? labels[defaultLocale];
}
