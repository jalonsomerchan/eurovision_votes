import { defaultLocale, locales, type Locale } from '../config/site';
import en from './translations/en.json';
import es from './translations/es.json';

export type TranslationKey = keyof typeof es;

const translations: Record<Locale, typeof es> = {
  es,
  en,
};

function joinPaths(...parts: string[]) {
  const cleanParts = parts
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);

  return `/${cleanParts.join('/')}${cleanParts.length ? '/' : ''}`;
}

export function isLocale(locale: string | undefined): locale is Locale {
  return Boolean(locale && locales.includes(locale as Locale));
}

export function getLocaleFromUrl(pathname: string): Locale {
  const basePath = import.meta.env.BASE_URL ?? '/';
  const pathnameWithoutBase = pathname.replace(new RegExp(`^${basePath}`), '/');
  const [, maybeLocale] = pathnameWithoutBase.split('/');

  if (isLocale(maybeLocale)) {
    return maybeLocale;
  }

  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    return translations[locale]?.[key] ?? translations[defaultLocale][key] ?? key;
  };
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const basePath = import.meta.env.BASE_URL ?? '/';
  const cleanPath = path.replace(/^\//, '');

  if (locale === defaultLocale) {
    return joinPaths(basePath, cleanPath);
  }

  return joinPaths(basePath, locale, cleanPath);
}

export function getAlternateLocales(currentLocale: Locale) {
  return locales.filter((locale) => locale !== currentLocale);
}
