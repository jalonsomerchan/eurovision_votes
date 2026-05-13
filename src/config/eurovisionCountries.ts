import { defaultLocale, type Locale } from './site';

export type CountryMap = Record<string, string>;

type LocalizedCountryMap = Partial<Record<Locale, Record<string, string>>>;

export const countryTranslations: LocalizedCountryMap = {
  es: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaiyán', BY: 'Bielorrusia', BE: 'Bélgica', BA: 'Bosnia y Herzegovina', BG: 'Bulgaria', HR: 'Croacia', CY: 'Chipre', CZ: 'Chequia', DK: 'Dinamarca', EE: 'Estonia', FI: 'Finlandia', FR: 'Francia', GE: 'Georgia', DE: 'Alemania', GR: 'Grecia', HU: 'Hungría', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Kazajistán', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Mónaco', ME: 'Montenegro', MA: 'Marruecos', NL: 'Países Bajos', MK: 'Macedonia del Norte', NO: 'Noruega', PL: 'Polonia', PT: 'Portugal', RO: 'Rumanía', RU: 'Rusia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia y Montenegro', SK: 'Eslovaquia', SI: 'Eslovenia', ES: 'España', SE: 'Suecia', CH: 'Suiza', TR: 'Turquía', UA: 'Ucrania', GB: 'Reino Unido', 'GB-WLS': 'Gales', YU: 'Yugoslavia'
  },
  en: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijan', BY: 'Belarus', BE: 'Belgium', BA: 'Bosnia and Herzegovina', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', EE: 'Estonia', FI: 'Finland', FR: 'France', GE: 'Georgia', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IS: 'Iceland', IE: 'Ireland', IL: 'Israel', IT: 'Italy', KZ: 'Kazakhstan', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', MD: 'Moldova', MC: 'Monaco', ME: 'Montenegro', MA: 'Morocco', NL: 'Netherlands', MK: 'North Macedonia', NO: 'Norway', PL: 'Poland', PT: 'Portugal', RO: 'Romania', RU: 'Russia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia and Montenegro', SK: 'Slovakia', SI: 'Slovenia', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', TR: 'Turkey', UA: 'Ukraine', GB: 'United Kingdom', 'GB-WLS': 'Wales', YU: 'Yugoslavia'
  },
  fr: {
    AL: 'Albanie', AD: 'Andorre', AM: 'Arménie', AU: 'Australie', AT: 'Autriche', AZ: 'Azerbaïdjan', BY: 'Biélorussie', BE: 'Belgique', BA: 'Bosnie-Herzégovine', BG: 'Bulgarie', HR: 'Croatie', CY: 'Chypre', CZ: 'Tchéquie', DK: 'Danemark', EE: 'Estonie', FI: 'Finlande', FR: 'France', GE: 'Géorgie', DE: 'Allemagne', GR: 'Grèce', HU: 'Hongrie', IS: 'Islande', IE: 'Irlande', IL: 'Israël', IT: 'Italie', KZ: 'Kazakhstan', LV: 'Lettonie', LT: 'Lituanie', LU: 'Luxembourg', MT: 'Malte', MD: 'Moldavie', MC: 'Monaco', ME: 'Monténégro', MA: 'Maroc', NL: 'Pays-Bas', MK: 'Macédoine du Nord', NO: 'Norvège', PL: 'Pologne', PT: 'Portugal', RO: 'Roumanie', RU: 'Russie', SM: 'Saint-Marin', RS: 'Serbie', CS: 'Serbie-et-Monténégro', SK: 'Slovaquie', SI: 'Slovénie', ES: 'Espagne', SE: 'Suède', CH: 'Suisse', TR: 'Turquie', UA: 'Ukraine', GB: 'Royaume-Uni', 'GB-WLS': 'Pays de Galles', YU: 'Yougoslavie'
  },
  pt: {
    AL: 'Albânia', AD: 'Andorra', AM: 'Armênia', AU: 'Austrália', AT: 'Áustria', AZ: 'Azerbaijão', BY: 'Bielorrússia', BE: 'Bélgica', BA: 'Bósnia e Herzegovina', BG: 'Bulgária', HR: 'Croácia', CY: 'Chipre', CZ: 'Chéquia', DK: 'Dinamarca', EE: 'Estônia', FI: 'Finlândia', FR: 'França', GE: 'Geórgia', DE: 'Alemanha', GR: 'Grécia', HU: 'Hungria', IS: 'Islândia', IE: 'Irlanda', IL: 'Israel', IT: 'Itália', KZ: 'Cazaquistão', LV: 'Letônia', LT: 'Lituânia', LU: 'Luxemburgo', MT: 'Malta', MD: 'Moldávia', MC: 'Mônaco', ME: 'Montenegro', MA: 'Marrocos', NL: 'Países Baixos', MK: 'Macedônia do Norte', NO: 'Noruega', PL: 'Polônia', PT: 'Portugal', RO: 'Romênia', RU: 'Rússia', SM: 'São Marinho', RS: 'Sérvia', CS: 'Sérvia e Montenegro', SK: 'Eslováquia', SI: 'Eslovênia', ES: 'Espanha', SE: 'Suécia', CH: 'Suíça', TR: 'Turquia', UA: 'Ucrânia', GB: 'Reino Unido', 'GB-WLS': 'País de Gales', YU: 'Iugoslávia'
  },
  ca: {
    AL: 'Albània', AD: 'Andorra', AM: 'Armènia', AU: 'Austràlia', AT: 'Àustria', AZ: 'Azerbaidjan', BY: 'Bielorússia', BE: 'Bèlgica', BA: 'Bòsnia i Hercegovina', BG: 'Bulgària', HR: 'Croàcia', CY: 'Xipre', CZ: 'Txèquia', DK: 'Dinamarca', EE: 'Estònia', FI: 'Finlàndia', FR: 'França', GE: 'Geòrgia', DE: 'Alemanya', GR: 'Grècia', HU: 'Hongria', IS: 'Islàndia', IE: 'Irlanda', IL: 'Israel', IT: 'Itàlia', KZ: 'Kazakhstan', LV: 'Letònia', LT: 'Lituània', LU: 'Luxemburg', MT: 'Malta', MD: 'Moldàvia', MC: 'Mònaco', ME: 'Montenegro', MA: 'Marroc', NL: 'Països Baixos', MK: 'Macedònia del Nord', NO: 'Noruega', PL: 'Polònia', PT: 'Portugal', RO: 'Romania', RU: 'Rússia', SM: 'San Marino', RS: 'Sèrbia', CS: 'Sèrbia i Montenegro', SK: 'Eslovàquia', SI: 'Eslovènia', ES: 'Espanya', SE: 'Suècia', CH: 'Suïssa', TR: 'Turquia', UA: 'Ucraïna', GB: 'Regne Unit', 'GB-WLS': 'Gal·les', YU: 'Iugoslàvia'
  },
  eu: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijan', BY: 'Bielorrusia', BE: 'Belgika', BA: 'Bosnia eta Herzegovina', BG: 'Bulgaria', HR: 'Kroazia', CY: 'Zipre', CZ: 'Txekia', DK: 'Danimarka', EE: 'Estonia', FI: 'Finlandia', FR: 'Frantzia', GE: 'Georgia', DE: 'Alemania', GR: 'Grezia', HU: 'Hungaria', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Kazakhstan', LV: 'Letonia', LT: 'Lituania', LU: 'Luxenburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Monako', ME: 'Montenegro', MA: 'Maroko', NL: 'Herbehereak', MK: 'Ipar Mazedonia', NO: 'Norvegia', PL: 'Polonia', PT: 'Portugal', RO: 'Errumania', RU: 'Errusia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia eta Montenegro', SK: 'Eslovakia', SI: 'Eslovenia', ES: 'Espainia', SE: 'Suedia', CH: 'Suitza', TR: 'Turkia', UA: 'Ukraina', GB: 'Erresuma Batua', 'GB-WLS': 'Gales', YU: 'Jugoslavia'
  },
  gl: {
    AL: 'Albania', AD: 'Andorra', AM: 'Armenia', AU: 'Australia', AT: 'Austria', AZ: 'Acerbaixán', BY: 'Bielorrusia', BE: 'Bélxica', BA: 'Bosnia e Hercegovina', BG: 'Bulgaria', HR: 'Croacia', CY: 'Chipre', CZ: 'Chequia', DK: 'Dinamarca', EE: 'Estonia', FI: 'Finlandia', FR: 'Francia', GE: 'Xeorxia', DE: 'Alemaña', GR: 'Grecia', HU: 'Hungría', IS: 'Islandia', IE: 'Irlanda', IL: 'Israel', IT: 'Italia', KZ: 'Casaquistán', LV: 'Letonia', LT: 'Lituania', LU: 'Luxemburgo', MT: 'Malta', MD: 'Moldavia', MC: 'Mónaco', ME: 'Montenegro', MA: 'Marrocos', NL: 'Países Baixos', MK: 'Macedonia do Norte', NO: 'Noruega', PL: 'Polonia', PT: 'Portugal', RO: 'Romanía', RU: 'Rusia', SM: 'San Marino', RS: 'Serbia', CS: 'Serbia e Montenegro', SK: 'Eslovaquia', SI: 'Eslovenia', ES: 'España', SE: 'Suecia', CH: 'Suíza', TR: 'Turquía', UA: 'Ucraína', GB: 'Reino Unido', 'GB-WLS': 'Gales', YU: 'Iugoslavia'
  },
};

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function countryCodeFrom(value: string, countryMap: CountryMap) {
  const upper = value.toUpperCase();
  if (countryMap[upper] || countryTranslations.en?.[upper]) return upper;

  const normalizedValue = normalizeKey(value);
  const found = Object.entries(countryMap).find(([, name]) => normalizeKey(name) === normalizedValue);
  return found?.[0] ?? '';
}

export function flagCodeFromCountryCode(code: string) {
  if (code === 'GB-WLS') return 'GB';
  return /^[A-Z]{2}$/.test(code) ? code : '';
}

export function flagUrlFromCountryCode(code: string) {
  const flagCode = flagCodeFromCountryCode(code);
  return flagCode ? `https://flagsapi.com/${flagCode}/flat/64.png` : '';
}

export function localizedCountryName(code: string, countryMap: CountryMap, locale: Locale) {
  return countryTranslations[locale]?.[code]
    ?? countryTranslations[defaultLocale]?.[code]
    ?? countryTranslations.en?.[code]
    ?? countryMap[code]
    ?? code;
}
