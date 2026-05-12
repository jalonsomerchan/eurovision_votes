export const defaultLocale = 'es' as const;
export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const siteConfig = {
  name: 'Eurovision Votes 2026',
  description: 'Página para votar los países de Eurovision 2026 con guardado local, exportación e importación JSON.',
  url: import.meta.env.ASTRO_SITE ?? 'https://jalonsomerchan.github.io',
  base: import.meta.env.ASTRO_BASE ?? '/',
  author: 'Jorge Alonso',
  defaultLocale,
  locales,
};

export type SiteConfig = typeof siteConfig;
