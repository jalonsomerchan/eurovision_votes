import { type Locale } from '../config/site';
import type { GlossaryRelatedKey } from '../config/eurovisionGlossary';

type GlossaryLabels = {
  eyebrow: string;
  indexTitle: string;
  indexDescription: string;
  indexIntro: string;
  termLabel: string;
  definitionLabel: string;
  synonymsLabel: string;
  relatedTitle: string;
  relatedDescription: string;
  viewTerm: string;
  backToGlossary: string;
  technicalNote: string;
  termsListLabel: string;
  related: Record<GlossaryRelatedKey, string>;
};

const labels: Record<Locale, GlossaryLabels> = {
  es: {
    eyebrow: 'Glosario eurovisivo',
    indexTitle: 'Glosario de Eurovision',
    indexDescription:
      'Diccionario indexable con términos clave de Eurovision: semifinal, final, Big Five, jurado, televoto, UER, running order, top 10 y nul points.',
    indexIntro:
      'Consulta definiciones breves y enlazadas de conceptos habituales del festival. Cuando una regla puede cambiar, el glosario la trata como configuración de cada edición.',
    termLabel: 'Término',
    definitionLabel: 'Definición',
    synonymsLabel: 'También se usa',
    relatedTitle: 'Páginas relacionadas',
    relatedDescription: 'Sigue navegando por datos, votaciones e histórico relacionados con este término.',
    viewTerm: 'Ver definición',
    backToGlossary: 'Volver al glosario',
    technicalNote: 'Nota de datos',
    termsListLabel: 'Lista de términos del glosario de Eurovision',
    related: {
      vote: 'Vota Eurovision 2026',
      stats: 'Estadísticas de votaciones',
      history: 'Histórico',
      countries: 'Países',
      countryPoints: 'Puntos por países',
      rankings: 'Rankings',
      editions: 'Ediciones',
    },
  },
  en: {
    eyebrow: 'Eurovision glossary',
    indexTitle: 'Eurovision glossary',
    indexDescription:
      'Indexable dictionary with key Eurovision terms: semi-final, final, Big Five, jury, televote, EBU, running order, top 10 and nul points.',
    indexIntro:
      'Browse short, linked definitions of common festival concepts. When a rule can change, the glossary treats it as edition-level configuration.',
    termLabel: 'Term',
    definitionLabel: 'Definition',
    synonymsLabel: 'Also used',
    relatedTitle: 'Related pages',
    relatedDescription: 'Keep browsing related voting data, statistics and history.',
    viewTerm: 'View definition',
    backToGlossary: 'Back to glossary',
    technicalNote: 'Data note',
    termsListLabel: 'List of Eurovision glossary terms',
    related: {
      vote: 'Vote Eurovision 2026',
      stats: 'Voting statistics',
      history: 'History',
      countries: 'Countries',
      countryPoints: 'Points by country',
      rankings: 'Rankings',
      editions: 'Editions',
    },
  },
  fr: {
    eyebrow: 'Glossaire Eurovision',
    indexTitle: 'Glossaire de l’Eurovision',
    indexDescription:
      'Dictionnaire indexable avec les termes clés de l’Eurovision : demi-finale, finale, Big Five, jury, télévote, UER, ordre de passage, top 10 et nul points.',
    indexIntro:
      'Consultez des définitions courtes et reliées des concepts courants du festival. Lorsqu’une règle peut changer, le glossaire la traite comme une configuration d’édition.',
    termLabel: 'Terme',
    definitionLabel: 'Définition',
    synonymsLabel: 'Aussi utilisé',
    relatedTitle: 'Pages liées',
    relatedDescription: 'Continuez avec les données, votes et historiques liés à ce terme.',
    viewTerm: 'Voir la définition',
    backToGlossary: 'Retour au glossaire',
    technicalNote: 'Note de données',
    termsListLabel: 'Liste des termes du glossaire Eurovision',
    related: {
      vote: 'Voter Eurovision 2026',
      stats: 'Statistiques de vote',
      history: 'Historique',
      countries: 'Pays',
      countryPoints: 'Points par pays',
      rankings: 'Classements',
      editions: 'Éditions',
    },
  },
  pt: {
    eyebrow: 'Glossário eurovisivo',
    indexTitle: 'Glossário da Eurovisão',
    indexDescription:
      'Dicionário indexável com termos-chave da Eurovisão: semifinal, final, Big Five, júri, televoto, UER, ordem de atuação, top 10 e nul points.',
    indexIntro:
      'Consulte definições breves e ligadas de conceitos habituais do festival. Quando uma regra pode mudar, o glossário trata-a como configuração de cada edição.',
    termLabel: 'Termo',
    definitionLabel: 'Definição',
    synonymsLabel: 'Também se usa',
    relatedTitle: 'Páginas relacionadas',
    relatedDescription: 'Continue a navegar por dados, votações e histórico relacionados com este termo.',
    viewTerm: 'Ver definição',
    backToGlossary: 'Voltar ao glossário',
    technicalNote: 'Nota de dados',
    termsListLabel: 'Lista de termos do glossário da Eurovisão',
    related: {
      vote: 'Votar Eurovisão 2026',
      stats: 'Estatísticas das votações',
      history: 'Histórico',
      countries: 'Países',
      countryPoints: 'Pontos por país',
      rankings: 'Rankings',
      editions: 'Edições',
    },
  },
  ca: {
    eyebrow: 'Glossari eurovisiu',
    indexTitle: 'Glossari d’Eurovisió',
    indexDescription:
      'Diccionari indexable amb termes clau d’Eurovisió: semifinal, final, Big Five, jurat, televot, UER, ordre d’actuació, top 10 i nul points.',
    indexIntro:
      'Consulta definicions breus i enllaçades de conceptes habituals del festival. Quan una norma pot canviar, el glossari la tracta com a configuració de cada edició.',
    termLabel: 'Terme',
    definitionLabel: 'Definició',
    synonymsLabel: 'També s’usa',
    relatedTitle: 'Pàgines relacionades',
    relatedDescription: 'Continua navegant per dades, votacions i històric relacionats amb aquest terme.',
    viewTerm: 'Veure definició',
    backToGlossary: 'Tornar al glossari',
    technicalNote: 'Nota de dades',
    termsListLabel: 'Llista de termes del glossari d’Eurovisió',
    related: {
      vote: 'Vota Eurovisió 2026',
      stats: 'Estadístiques de votacions',
      history: 'Històric',
      countries: 'Països',
      countryPoints: 'Punts per països',
      rankings: 'Rànquings',
      editions: 'Edicions',
    },
  },
  eu: {
    eyebrow: 'Eurovision glosarioa',
    indexTitle: 'Eurovision glosarioa',
    indexDescription:
      'Eurovisioneko termino nagusien hiztegi indexagarria: finalerdia, finala, Big Five, epaimahaia, telebotoa, UER, jardun ordena, top 10 eta nul points.',
    indexIntro:
      'Kontsultatu jaialdiko ohiko kontzeptuen definizio labur eta estekatuak. Arau bat alda daitekeenean, glosarioak edizio bakoitzeko konfigurazio gisa tratatzen du.',
    termLabel: 'Terminoa',
    definitionLabel: 'Definizioa',
    synonymsLabel: 'Erabiltzen da ere',
    relatedTitle: 'Lotutako orriak',
    relatedDescription: 'Jarraitu termino honekin lotutako datuak, botoak eta historikoa arakatzen.',
    viewTerm: 'Ikusi definizioa',
    backToGlossary: 'Itzuli glosariora',
    technicalNote: 'Datu-oharra',
    termsListLabel: 'Eurovision glosarioko terminoen zerrenda',
    related: {
      vote: 'Bozkatu Eurovision 2026',
      stats: 'Bozketen estatistikak',
      history: 'Historikoa',
      countries: 'Herrialdeak',
      countryPoints: 'Puntuak herrialdeka',
      rankings: 'Rankingak',
      editions: 'Edizioak',
    },
  },
  gl: {
    eyebrow: 'Glosario eurovisivo',
    indexTitle: 'Glosario de Eurovisión',
    indexDescription:
      'Dicionario indexable con termos clave de Eurovisión: semifinal, final, Big Five, xurado, televoto, UER, orde de actuación, top 10 e nul points.',
    indexIntro:
      'Consulta definicións breves e enlazadas de conceptos habituais do festival. Cando unha regra pode cambiar, o glosario trátaa como configuración de cada edición.',
    termLabel: 'Termo',
    definitionLabel: 'Definición',
    synonymsLabel: 'Tamén se usa',
    relatedTitle: 'Páxinas relacionadas',
    relatedDescription: 'Segue navegando por datos, votacións e histórico relacionados con este termo.',
    viewTerm: 'Ver definición',
    backToGlossary: 'Volver ao glosario',
    technicalNote: 'Nota de datos',
    termsListLabel: 'Lista de termos do glosario de Eurovisión',
    related: {
      vote: 'Vota Eurovisión 2026',
      stats: 'Estatísticas das votacións',
      history: 'Histórico',
      countries: 'Países',
      countryPoints: 'Puntos por países',
      rankings: 'Rankings',
      editions: 'Edicións',
    },
  },
};

export function getGlossaryLabels(locale: Locale) {
  return labels[locale] ?? labels.es;
}
