import { type Locale } from '../config/site';
import { getGlossaryTermSlug, type GlossaryRelatedKey, type GlossaryTermId } from '../config/eurovisionGlossary';
import { getLocalizedPath } from '../i18n/ui';

const relatedPaths: Record<GlossaryRelatedKey, string> = {
  vote: '/vota/',
  stats: '/stats/',
  history: '/historico/',
  countries: '/paises/',
  countryPoints: '/puntos-por-pais/',
  rankings: '/rankings/',
  editions: '/historico/',
};

export function getGlossaryIndexPath(locale: Locale) {
  return getLocalizedPath('/glosario/', locale);
}

export function getGlossaryTermPath(id: GlossaryTermId, locale: Locale) {
  return getLocalizedPath(`/glosario/${getGlossaryTermSlug(id, locale)}/`, locale);
}

export function getGlossaryRelatedPath(key: GlossaryRelatedKey, locale: Locale) {
  return getLocalizedPath(relatedPaths[key], locale);
}
