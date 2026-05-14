import type { Locale } from '../config/site';

export type TimelineMilestoneType = 'contest' | 'format' | 'voting';

type LocalizedMilestoneText = Record<Locale, {
  title: string;
  description: string;
}>;

export interface EurovisionTimelineMilestone {
  year: number;
  type: TimelineMilestoneType;
  text: LocalizedMilestoneText;
}

export const eurovisionTimelineMilestones: EurovisionTimelineMilestone[] = [
  {
    year: 1956,
    type: 'contest',
    text: {
      es: { title: 'Primera edición del festival', description: 'Eurovision comenzó como concurso internacional de canciones con la primera edición registrada en el histórico.' },
      en: { title: 'First contest edition', description: 'Eurovision began as an international song contest with the first edition recorded in the history dataset.' },
      fr: { title: 'Première édition du concours', description: 'L’Eurovision a commencé comme concours international de chansons avec la première édition recensée dans l’historique.' },
      pt: { title: 'Primeira edição do festival', description: 'A Eurovisão começou como concurso internacional de canções com a primeira edição registada no histórico.' },
      ca: { title: 'Primera edició del festival', description: 'Eurovisió va començar com a concurs internacional de cançons amb la primera edició registrada a l’històric.' },
      eu: { title: 'Jaialdiaren lehen edizioa', description: 'Eurovision nazioarteko abesti-lehiaketa gisa hasi zen historikoan jasotako lehen edizioarekin.' },
      gl: { title: 'Primeira edición do festival', description: 'Eurovisión comezou como concurso internacional de cancións coa primeira edición rexistrada no histórico.' },
    },
  },
  {
    year: 2004,
    type: 'format',
    text: {
      es: { title: 'Aparecen las semifinales', description: 'El formato empieza a incorporar semifinales para ordenar una participación cada vez más amplia.' },
      en: { title: 'Semi-finals appear', description: 'The format starts adding semi-finals to organise an increasingly large field of participants.' },
      fr: { title: 'Arrivée des demi-finales', description: 'Le format commence à intégrer des demi-finales pour organiser une participation de plus en plus large.' },
      pt: { title: 'Chegam as semifinais', description: 'O formato começa a incluir semifinais para organizar uma participação cada vez maior.' },
      ca: { title: 'Arriben les semifinals', description: 'El format comença a incorporar semifinals per ordenar una participació cada vegada més àmplia.' },
      eu: { title: 'Finalerdiak agertu ziren', description: 'Formatuak finalerdiak gehitzen hasi zen gero eta parte-hartze handiagoa antolatzeko.' },
      gl: { title: 'Chegan as semifinais', description: 'O formato empeza a incorporar semifinais para ordenar unha participación cada vez máis ampla.' },
    },
  },
  {
    year: 2008,
    type: 'format',
    text: {
      es: { title: 'Dos semifinales', description: 'El festival pasa a organizar dos semifinales antes de la final, un hito relevante para comparar ediciones modernas.' },
      en: { title: 'Two semi-finals', description: 'The contest moves to two semi-finals before the final, a useful milestone when comparing modern editions.' },
      fr: { title: 'Deux demi-finales', description: 'Le concours passe à deux demi-finales avant la finale, un repère utile pour comparer les éditions modernes.' },
      pt: { title: 'Duas semifinais', description: 'O festival passa a organizar duas semifinais antes da final, um marco útil para comparar edições modernas.' },
      ca: { title: 'Dues semifinals', description: 'El festival passa a organitzar dues semifinals abans de la final, una fita útil per comparar edicions modernes.' },
      eu: { title: 'Bi finalerdi', description: 'Jaialdiak finalaren aurretik bi finalerdi antolatzera igaro zen, edizio modernoak alderatzeko mugarri erabilgarria.' },
      gl: { title: 'Dúas semifinais', description: 'O festival pasa a organizar dúas semifinais antes da final, un fito útil para comparar edicións modernas.' },
    },
  },
  {
    year: 2016,
    type: 'voting',
    text: {
      es: { title: 'Presentación separada de jurado y televoto', description: 'La presentación de resultados separa jurado y televoto, por lo que las puntuaciones modernas requieren contexto.' },
      en: { title: 'Jury and televote shown separately', description: 'Results start showing jury and televote separately, so modern scores need context.' },
      fr: { title: 'Jury et télévote présentés séparément', description: 'Les résultats présentent séparément jury et télévote ; les scores modernes doivent donc être contextualisés.' },
      pt: { title: 'Júri e televoto apresentados separadamente', description: 'Os resultados passam a mostrar júri e televoto em separado, por isso as pontuações modernas precisam de contexto.' },
      ca: { title: 'Jurat i televot presentats per separat', description: 'Els resultats passen a separar jurat i televot, per això les puntuacions modernes necessiten context.' },
      eu: { title: 'Epaimahaia eta telebotoa bereizita', description: 'Emaitzek epaimahaia eta telebotoa bereizita erakusten dituzte, eta puntuazio modernoek testuingurua behar dute.' },
      gl: { title: 'Xurado e televoto presentados por separado', description: 'Os resultados pasan a separar xurado e televoto, polo que as puntuacións modernas precisan contexto.' },
    },
  },
];
