import { type Locale } from '../config/site';

type NavigationLabels = {
  dataMenu: string;
  eurovision2026: string;
  festival2026: string;
  glossary: string;
  historicalMenu: string;
  prediction: string;
  voteStatsCta: string;
};

type FooterLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  tools: string;
  games: string;
  openProject: string;
};

export type FooterProject = {
  name: string;
  href: string;
};

const navigationLabels: Record<Locale, NavigationLabels> = {
  es: {
    dataMenu: 'Datos',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Festival',
    glossary: 'Glosario',
    historicalMenu: 'Histórico',
    prediction: 'Quiniela',
    voteStatsCta: 'Estadísticas de votaciones',
  },
  en: {
    dataMenu: 'Data',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Festival',
    glossary: 'Glossary',
    historicalMenu: 'History',
    prediction: 'Prediction',
    voteStatsCta: 'Voting statistics',
  },
  fr: {
    dataMenu: 'Données',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Festival',
    glossary: 'Glossaire',
    historicalMenu: 'Historique',
    prediction: 'Pronostic',
    voteStatsCta: 'Statistiques de vote',
  },
  pt: {
    dataMenu: 'Dados',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Festival',
    glossary: 'Glossário',
    historicalMenu: 'Histórico',
    prediction: 'Prognóstico',
    voteStatsCta: 'Estatísticas das votações',
  },
  ca: {
    dataMenu: 'Dades',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Festival',
    glossary: 'Glossari',
    historicalMenu: 'Històric',
    prediction: 'Quiniela',
    voteStatsCta: 'Estadístiques de votacions',
  },
  eu: {
    dataMenu: 'Datuak',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Jaialdia',
    glossary: 'Glosarioa',
    historicalMenu: 'Historikoa',
    prediction: 'Kiniela',
    voteStatsCta: 'Bozketen estatistikak',
  },
  gl: {
    dataMenu: 'Datos',
    eurovision2026: 'Eurovision 2026',
    festival2026: 'Festival',
    glossary: 'Glosario',
    historicalMenu: 'Histórico',
    prediction: 'Quiniela',
    voteStatsCta: 'Estatísticas das votacións',
  },
};

const footerLabels: Record<Locale, FooterLabels> = {
  es: {
    eyebrow: 'Otros proyectos',
    title: 'Más herramientas y juegos de AlonSoftware',
    copy: 'Explora utilidades rápidas y juegos ligeros creados para usarse desde cualquier dispositivo.',
    tools: 'Herramientas',
    games: 'Juegos',
    openProject: 'Abrir {project}',
  },
  en: {
    eyebrow: 'Other projects',
    title: 'More tools and games by AlonSoftware',
    copy: 'Explore fast utilities and lightweight games made to work on any device.',
    tools: 'Tools',
    games: 'Games',
    openProject: 'Open {project}',
  },
  fr: {
    eyebrow: 'Autres projets',
    title: 'Plus d’outils et de jeux par AlonSoftware',
    copy: 'Découvrez des utilitaires rapides et des jeux légers pensés pour tous les appareils.',
    tools: 'Outils',
    games: 'Jeux',
    openProject: 'Ouvrir {project}',
  },
  pt: {
    eyebrow: 'Outros projetos',
    title: 'Mais ferramentas e jogos da AlonSoftware',
    copy: 'Explore utilitários rápidos e jogos leves criados para qualquer dispositivo.',
    tools: 'Ferramentas',
    games: 'Jogos',
    openProject: 'Abrir {project}',
  },
  ca: {
    eyebrow: 'Altres projectes',
    title: 'Més eines i jocs d’AlonSoftware',
    copy: 'Explora utilitats ràpides i jocs lleugers creats per usar-se des de qualsevol dispositiu.',
    tools: 'Eines',
    games: 'Jocs',
    openProject: 'Obrir {project}',
  },
  eu: {
    eyebrow: 'Beste proiektu batzuk',
    title: 'AlonSoftware-ren tresna eta joko gehiago',
    copy: 'Arakatu edozein gailutan erabiltzeko sortutako utilitate azkarrak eta joko arinak.',
    tools: 'Tresnak',
    games: 'Jokoak',
    openProject: 'Ireki {project}',
  },
  gl: {
    eyebrow: 'Outros proxectos',
    title: 'Máis ferramentas e xogos de AlonSoftware',
    copy: 'Explora utilidades rápidas e xogos lixeiros creados para usarse desde calquera dispositivo.',
    tools: 'Ferramentas',
    games: 'Xogos',
    openProject: 'Abrir {project}',
  },
};

export const footerTools: FooterProject[] = [
  { name: 'FácilPDF', href: 'https://facilpdf.alon.one' },
  { name: 'FacilIMG', href: 'https://facilimg.alon.one' },
  { name: 'Print a Calendar', href: 'https://printacalendar.alon.one' },
];

export const footerGames: FooterProject[] = [
  { name: 'HitYear', href: 'https://hityear.alon.one' },
  { name: 'Democrazy', href: 'https://democrazy.alon.one' },
  { name: 'Hamster Run', href: 'https://hamsterrun.alon.one' },
  { name: 'Mundial de fútbol 2026', href: 'https://mundial2026.alon.one' },
];

export function getNavigationLabels(locale: Locale) {
  return navigationLabels[locale] ?? navigationLabels.es;
}

export function getFooterLabels(locale: Locale) {
  return footerLabels[locale] ?? footerLabels.es;
}

export function formatProjectLabel(template: string, project: string) {
  return template.replaceAll('{project}', project);
}