import { defaultLocale, type Locale } from '../config/site';

type VotePageSeoLabels = { title: string; description: string };

const labels: Record<Locale, VotePageSeoLabels> = {
  es: { title: 'Vota Eurovision 2026: semifinales y final', description: 'Puntúa las canciones votables de Eurovision 2026, guarda tus resultados y comparte una imagen o enlace público de tus votaciones.' },
  en: { title: 'Vote Eurovision 2026: semi-finals and final', description: 'Rate the votable Eurovision 2026 songs, save your results and share an image or public link to your votes.' },
  fr: { title: 'Vote Eurovision 2026 : demi-finales et finale', description: 'Notez les chansons votables de l’Eurovision 2026, enregistrez vos résultats et partagez une image ou un lien public vers vos votes.' },
  pt: { title: 'Votar na Eurovisão 2026: semifinais e final', description: 'Pontue as canções votáveis da Eurovisão 2026, guarde os resultados e partilhe uma imagem ou ligação pública das suas votações.' },
  ca: { title: 'Vota Eurovisió 2026: semifinals i final', description: 'Puntua les cançons votables d’Eurovisió 2026, desa els resultats i comparteix una imatge o enllaç públic de les teves votacions.' },
  eu: { title: 'Bozkatu Eurovision 2026: finalerdiak eta finala', description: 'Puntuatu Eurovision 2026ko abesti bozkagarriak, gorde emaitzak eta partekatu zure botoen irudia edo esteka publikoa.' },
  gl: { title: 'Vota Eurovisión 2026: semifinais e final', description: 'Puntúa as cancións votables de Eurovisión 2026, garda os resultados e comparte unha imaxe ou ligazón pública das túas votacións.' },
};

export function getVotePageSeoLabels(locale: Locale = defaultLocale) {
  return labels[locale] ?? labels[defaultLocale];
}
