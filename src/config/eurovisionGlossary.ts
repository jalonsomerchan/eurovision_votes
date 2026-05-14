import { defaultLocale, type Locale } from './site';

export type GlossaryTermId =
  | 'semifinal'
  | 'final'
  | 'big-five'
  | 'jury'
  | 'televote'
  | 'ebu'
  | 'running-order'
  | 'top-10'
  | 'nul-points';

export type GlossaryRelatedKey = 'vote' | 'stats' | 'history' | 'countries' | 'countryPoints' | 'rankings' | 'editions';

type GlossaryText = {
  slug: string;
  term: string;
  shortDefinition: string;
  definition: string;
  note?: string;
  synonyms?: string[];
};

type GlossaryConfig = {
  id: GlossaryTermId;
  related: GlossaryRelatedKey[];
  texts: Record<Locale, GlossaryText>;
};

export type GlossaryTerm = GlossaryText & {
  id: GlossaryTermId;
  related: GlossaryRelatedKey[];
};

const terms: GlossaryConfig[] = [
  {
    id: 'semifinal',
    related: ['vote', 'history', 'editions'],
    texts: {
      es: {
        slug: 'semifinal',
        term: 'Semifinal',
        shortDefinition: 'Ronda previa que reparte plazas para la final del festival.',
        definition:
          'Una semifinal es una ronda anterior a la final en la que varios países actúan para intentar clasificarse. El número de semifinales, plazas disponibles y sistema de clasificación depende de la normativa de cada edición.',
        synonyms: ['semis', 'ronda semifinal'],
      },
      en: {
        slug: 'semi-final',
        term: 'Semi-final',
        shortDefinition: 'A qualifying round that allocates places in the final.',
        definition:
          'A semi-final is a round before the final where countries perform to try to qualify. The number of semi-finals, available places and qualification method depend on the rules configured for each edition.',
        synonyms: ['semifinal', 'semi'],
      },
      fr: {
        slug: 'demi-finale',
        term: 'Demi-finale',
        shortDefinition: 'Tour de qualification qui donne accès à la finale.',
        definition:
          'Une demi-finale est un tour organisé avant la finale où plusieurs pays tentent de se qualifier. Le nombre de demi-finales, de places et le mode de qualification dépendent des règles de chaque édition.',
        synonyms: ['demi', 'tour de qualification'],
      },
      pt: {
        slug: 'semifinal',
        term: 'Semifinal',
        shortDefinition: 'Ronda de apuramento que dá acesso à final.',
        definition:
          'Uma semifinal é uma ronda anterior à final em que vários países atuam para tentar qualificar-se. O número de semifinais, vagas e método de qualificação depende das regras de cada edição.',
        synonyms: ['meia-final'],
      },
      ca: {
        slug: 'semifinal',
        term: 'Semifinal',
        shortDefinition: 'Ronda prèvia que reparteix places per a la final.',
        definition:
          'Una semifinal és una ronda anterior a la final en què diversos països actuen per intentar classificar-se. El nombre de semifinals, places i sistema de classificació depèn de les normes de cada edició.',
        synonyms: ['semis', 'ronda semifinal'],
      },
      eu: {
        slug: 'finalerdia',
        term: 'Finalerdia',
        shortDefinition: 'Finalerako plazak banatzen dituen aurreko txanda.',
        definition:
          'Finalerdia finalaren aurreko txanda bat da, non hainbat herrialdek sailkatzea bilatzen duten. Finalerdi kopurua, plazak eta sailkatzeko modua edizio bakoitzeko arauen araberakoak dira.',
        synonyms: ['sailkapen txanda'],
      },
      gl: {
        slug: 'semifinal',
        term: 'Semifinal',
        shortDefinition: 'Rolda previa que reparte prazas para a final.',
        definition:
          'Unha semifinal é unha rolda anterior á final na que varios países actúan para intentar clasificarse. O número de semifinais, prazas e sistema de clasificación depende das normas de cada edición.',
        synonyms: ['semis', 'rolda semifinal'],
      },
    },
  },
  {
    id: 'final',
    related: ['vote', 'stats', 'history', 'editions'],
    texts: {
      es: {
        slug: 'final',
        term: 'Final',
        shortDefinition: 'Gala decisiva en la que se ordenan los resultados principales.',
        definition:
          'La final es la gala principal de una edición. En ella compiten los países clasificados y los finalistas directos configurados para esa edición, y se publica el resultado final según el sistema de votación vigente.',
        synonyms: ['gran final'],
      },
      en: {
        slug: 'final',
        term: 'Final',
        shortDefinition: 'The decisive show where the main results are ranked.',
        definition:
          'The final is the main show of an edition. It includes the qualified countries and the direct finalists configured for that year, and publishes the final result according to the voting system in force.',
        synonyms: ['grand final'],
      },
      fr: {
        slug: 'finale',
        term: 'Finale',
        shortDefinition: 'Soirée décisive où le classement principal est établi.',
        definition:
          'La finale est la soirée principale d’une édition. Elle réunit les pays qualifiés et les finalistes directs configurés pour cette année, puis publie le résultat final selon le système de vote en vigueur.',
        synonyms: ['grande finale'],
      },
      pt: {
        slug: 'final',
        term: 'Final',
        shortDefinition: 'Gala decisiva onde se ordenam os resultados principais.',
        definition:
          'A final é a gala principal de uma edição. Nela competem os países qualificados e os finalistas diretos configurados para esse ano, e é publicado o resultado final segundo o sistema de votação vigente.',
        synonyms: ['grande final'],
      },
      ca: {
        slug: 'final',
        term: 'Final',
        shortDefinition: 'Gala decisiva en què s’ordenen els resultats principals.',
        definition:
          'La final és la gala principal d’una edició. Hi competeixen els països classificats i els finalistes directes configurats per a aquell any, i s’hi publica el resultat final segons el sistema de votació vigent.',
        synonyms: ['gran final'],
      },
      eu: {
        slug: 'finala',
        term: 'Finala',
        shortDefinition: 'Emaitza nagusiak erabakitzen diren gala.',
        definition:
          'Finala edizio bateko gala nagusia da. Bertan sailkatutako herrialdeek eta edizio horretarako konfiguratutako finalista zuzenek parte hartzen dute, indarrean dagoen bozketa sistemaren arabera.',
        synonyms: ['final handia'],
      },
      gl: {
        slug: 'final',
        term: 'Final',
        shortDefinition: 'Gala decisiva na que se ordenan os resultados principais.',
        definition:
          'A final é a gala principal dunha edición. Nela compiten os países clasificados e os finalistas directos configurados para ese ano, e publícase o resultado final segundo o sistema de votación vixente.',
        synonyms: ['gran final'],
      },
    },
  },
  {
    id: 'big-five',
    related: ['history', 'countries', 'editions'],
    texts: {
      es: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'Grupo de países que suele acceder directamente a la final.',
        definition:
          'Big Five se usa para referirse a Alemania, España, Francia, Italia y Reino Unido cuando una edición los configura como finalistas directos por su papel financiero en el certamen. La condición concreta debe leerse desde la configuración de la edición.',
        note: 'No conviene asumir que cualquier regla de acceso directo es permanente: debe venir de los datos de la edición.',
      },
      en: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'A group of countries often configured as direct finalists.',
        definition:
          'Big Five refers to Germany, Spain, France, Italy and the United Kingdom when an edition configures them as direct finalists because of their financial role in the contest. The exact status should come from the edition data.',
        note: 'Direct-final rules should not be treated as permanent unless the edition configuration says so.',
      },
      fr: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'Groupe de pays souvent configuré comme finaliste direct.',
        definition:
          'Big Five désigne l’Allemagne, l’Espagne, la France, l’Italie et le Royaume-Uni lorsqu’une édition les configure comme finalistes directs en raison de leur rôle financier dans le concours. Le statut exact doit venir des données de l’édition.',
        note: 'Les règles d’accès direct ne doivent pas être considérées comme permanentes sans configuration explicite.',
      },
      pt: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'Grupo de países frequentemente configurado como finalista direto.',
        definition:
          'Big Five refere-se à Alemanha, Espanha, França, Itália e Reino Unido quando uma edição os configura como finalistas diretos pelo seu papel financeiro no concurso. O estatuto exato deve vir dos dados da edição.',
        note: 'As regras de acesso direto não devem ser tratadas como permanentes sem configuração clara.',
      },
      ca: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'Grup de països que sovint accedeix directament a la final.',
        definition:
          'Big Five fa referència a Alemanya, Espanya, França, Itàlia i el Regne Unit quan una edició els configura com a finalistes directes pel seu paper financer al concurs. L’estat concret ha de venir de les dades de l’edició.',
        note: 'Les normes d’accés directe no s’han de considerar permanents sense configuració explícita.',
      },
      eu: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'Sarritan finalista zuzen gisa konfiguratzen den herrialde taldea.',
        definition:
          'Big Five Alemaniari, Espainiari, Frantziari, Italiari eta Erresuma Batuari buruz erabiltzen da, edizio batek finalista zuzen gisa konfiguratzen dituenean lehiaketan duten finantza rolagatik. Egoera zehatza edizioaren datuetatik etorri behar da.',
        note: 'Sarbide zuzeneko arauak ez dira iraunkortzat hartu behar konfigurazio argirik gabe.',
      },
      gl: {
        slug: 'big-five',
        term: 'Big Five',
        shortDefinition: 'Grupo de países que adoita acceder directamente á final.',
        definition:
          'Big Five úsase para referirse a Alemaña, España, Francia, Italia e Reino Unido cando unha edición os configura como finalistas directos polo seu papel financeiro no certame. A condición concreta debe lerse desde os datos da edición.',
        note: 'Non convén asumir que as regras de acceso directo son permanentes sen configuración clara.',
      },
    },
  },
  {
    id: 'jury',
    related: ['stats', 'history', 'rankings'],
    texts: {
      es: {
        slug: 'jurado',
        term: 'Jurado',
        shortDefinition: 'Voto emitido por paneles profesionales o nacionales según la edición.',
        definition:
          'El jurado agrupa votos de paneles profesionales o nacionales cuando el sistema de una edición lo contempla. Su peso, formato y combinación con otros votos puede cambiar, por lo que debe tratarse como dato configurable.',
        synonyms: ['voto del jurado'],
      },
      en: {
        slug: 'jury',
        term: 'Jury',
        shortDefinition: 'Votes cast by professional or national panels depending on the edition.',
        definition:
          'The jury groups votes from professional or national panels when the edition system includes them. Its weight, format and combination with other votes can change, so it should be treated as configurable data.',
        synonyms: ['jury vote'],
      },
      fr: {
        slug: 'jury',
        term: 'Jury',
        shortDefinition: 'Vote de panels professionnels ou nationaux selon l’édition.',
        definition:
          'Le jury regroupe les votes de panels professionnels ou nationaux lorsque le système d’une édition le prévoit. Son poids, son format et sa combinaison avec d’autres votes peuvent changer.',
        synonyms: ['vote du jury'],
      },
      pt: {
        slug: 'juri',
        term: 'Júri',
        shortDefinition: 'Voto de painéis profissionais ou nacionais conforme a edição.',
        definition:
          'O júri agrupa votos de painéis profissionais ou nacionais quando o sistema de uma edição o prevê. O seu peso, formato e combinação com outros votos pode mudar, por isso deve ser tratado como dado configurável.',
        synonyms: ['voto do júri'],
      },
      ca: {
        slug: 'jurat',
        term: 'Jurat',
        shortDefinition: 'Vot de panells professionals o nacionals segons l’edició.',
        definition:
          'El jurat agrupa vots de panells professionals o nacionals quan el sistema d’una edició ho preveu. El seu pes, format i combinació amb altres vots pot canviar, així que s’ha de tractar com una dada configurable.',
        synonyms: ['vot del jurat'],
      },
      eu: {
        slug: 'epaimahaia',
        term: 'Epaimahaia',
        shortDefinition: 'Edizioaren arabera panel profesionalek edo nazionalek emandako botoa.',
        definition:
          'Epaimahaiak panel profesional edo nazionalen botoak biltzen ditu edizio bateko sistemak hala aurreikusten duenean. Pisua, formatua eta beste botoekin duen konbinazioa alda daitezke.',
        synonyms: ['epaimahaiaren botoa'],
      },
      gl: {
        slug: 'xurado',
        term: 'Xurado',
        shortDefinition: 'Voto emitido por paneis profesionais ou nacionais segundo a edición.',
        definition:
          'O xurado agrupa votos de paneis profesionais ou nacionais cando o sistema dunha edición o contempla. O seu peso, formato e combinación con outros votos pode cambiar, polo que debe tratarse como dato configurable.',
        synonyms: ['voto do xurado'],
      },
    },
  },
  {
    id: 'televote',
    related: ['vote', 'stats', 'history'],
    texts: {
      es: {
        slug: 'televoto',
        term: 'Televoto',
        shortDefinition: 'Voto del público recogido por los canales habilitados en cada edición.',
        definition:
          'El televoto representa el voto del público cuando una edición lo incluye. Puede recogerse por teléfono, SMS, app u otros sistemas, y su peso frente al jurado depende de la configuración vigente.',
        synonyms: ['voto popular', 'voto del público'],
      },
      en: {
        slug: 'televote',
        term: 'Televote',
        shortDefinition: 'Public voting collected through the channels enabled for an edition.',
        definition:
          'The televote represents the public vote when an edition includes it. It may be collected by phone, SMS, app or other systems, and its weight against the jury depends on the current configuration.',
        synonyms: ['public vote'],
      },
      fr: {
        slug: 'televote',
        term: 'Télévote',
        shortDefinition: 'Vote du public recueilli par les canaux activés pour une édition.',
        definition:
          'Le télévote représente le vote du public lorsqu’une édition l’inclut. Il peut être recueilli par téléphone, SMS, application ou d’autres systèmes, et son poids dépend de la configuration en vigueur.',
        synonyms: ['vote du public'],
      },
      pt: {
        slug: 'televoto',
        term: 'Televoto',
        shortDefinition: 'Voto do público recolhido pelos canais ativos em cada edição.',
        definition:
          'O televoto representa o voto do público quando uma edição o inclui. Pode ser recolhido por telefone, SMS, app ou outros sistemas, e o seu peso face ao júri depende da configuração vigente.',
        synonyms: ['voto popular'],
      },
      ca: {
        slug: 'televot',
        term: 'Televot',
        shortDefinition: 'Vot del públic recollit pels canals habilitats en cada edició.',
        definition:
          'El televot representa el vot del públic quan una edició l’inclou. Pot recollir-se per telèfon, SMS, app o altres sistemes, i el seu pes respecte al jurat depèn de la configuració vigent.',
        synonyms: ['vot popular'],
      },
      eu: {
        slug: 'telebotoa',
        term: 'Telebotoa',
        shortDefinition: 'Edizio bakoitzean gaitutako kanalen bidez jasotako publikoaren botoa.',
        definition:
          'Telebotoak publikoaren botoa adierazten du edizio batek barne hartzen duenean. Telefonoz, SMS bidez, aplikazioz edo beste sistema batzuen bidez jaso daiteke, eta epaimahaiarekiko pisua konfigurazioaren araberakoa da.',
        synonyms: ['publikoaren botoa'],
      },
      gl: {
        slug: 'televoto',
        term: 'Televoto',
        shortDefinition: 'Voto do público recollido polos canais habilitados en cada edición.',
        definition:
          'O televoto representa o voto do público cando unha edición o inclúe. Pode recollerse por teléfono, SMS, app ou outros sistemas, e o seu peso fronte ao xurado depende da configuración vixente.',
        synonyms: ['voto popular'],
      },
    },
  },
  {
    id: 'ebu',
    related: ['history', 'editions'],
    texts: {
      es: {
        slug: 'uer',
        term: 'UER',
        shortDefinition: 'Unión Europea de Radiodifusión, entidad organizadora del certamen.',
        definition:
          'UER son las siglas en español de la Unión Europea de Radiodifusión. En inglés se usa EBU. Es la organización que coordina el Festival de Eurovision junto a las emisoras participantes y la televisión anfitriona.',
        synonyms: ['EBU', 'Unión Europea de Radiodifusión'],
      },
      en: {
        slug: 'ebu',
        term: 'EBU',
        shortDefinition: 'European Broadcasting Union, the organisation behind the contest.',
        definition:
          'EBU stands for European Broadcasting Union. It coordinates the Eurovision Song Contest together with participating broadcasters and the host broadcaster.',
        synonyms: ['European Broadcasting Union', 'UER'],
      },
      fr: {
        slug: 'uer',
        term: 'UER',
        shortDefinition: 'Union européenne de radio-télévision, organisation du concours.',
        definition:
          'UER désigne l’Union européenne de radio-télévision, appelée EBU en anglais. Elle coordonne le Concours Eurovision avec les diffuseurs participants et le diffuseur hôte.',
        synonyms: ['EBU', 'Union européenne de radio-télévision'],
      },
      pt: {
        slug: 'uer',
        term: 'UER',
        shortDefinition: 'União Europeia de Radiodifusão, entidade organizadora do concurso.',
        definition:
          'UER é a sigla portuguesa para União Europeia de Radiodifusão, conhecida em inglês como EBU. Coordena o Festival Eurovisão juntamente com as emissoras participantes e a televisão anfitriã.',
        synonyms: ['EBU', 'União Europeia de Radiodifusão'],
      },
      ca: {
        slug: 'uer',
        term: 'UER',
        shortDefinition: 'Unió Europea de Radiodifusió, entitat organitzadora del concurs.',
        definition:
          'UER són les sigles de la Unió Europea de Radiodifusió, EBU en anglès. Coordina el Festival d’Eurovisió juntament amb les emissores participants i la televisió amfitriona.',
        synonyms: ['EBU', 'Unió Europea de Radiodifusió'],
      },
      eu: {
        slug: 'uer',
        term: 'UER',
        shortDefinition: 'Europako Irrati-Telebista Batasuna, lehiaketa koordinatzen duen erakundea.',
        definition:
          'UER Europako Irrati-Telebista Batasunari buruz erabiltzen da; ingelesez EBU da. Eurovision jaialdia koordinatzen du parte hartzen duten irrati-telebistekin eta anfitrioi katearekin batera.',
        synonyms: ['EBU', 'Europako Irrati-Telebista Batasuna'],
      },
      gl: {
        slug: 'uer',
        term: 'UER',
        shortDefinition: 'Unión Europea de Radiodifusión, entidade organizadora do certame.',
        definition:
          'UER son as siglas da Unión Europea de Radiodifusión, coñecida en inglés como EBU. Coordina o Festival de Eurovisión xunto coas emisoras participantes e a televisión anfitrioa.',
        synonyms: ['EBU', 'Unión Europea de Radiodifusión'],
      },
    },
  },
  {
    id: 'running-order',
    related: ['vote', 'history', 'editions'],
    texts: {
      es: {
        slug: 'running-order',
        term: 'Running order',
        shortDefinition: 'Orden de actuación de las canciones en una ronda.',
        definition:
          'Running order es el orden en el que actúan los países dentro de una semifinal, final u otra ronda. Puede influir en cómo se consulta una gala, pero no debe confundirse con la posición final en la tabla de resultados.',
        synonyms: ['orden de actuación', 'orden de salida'],
      },
      en: {
        slug: 'running-order',
        term: 'Running order',
        shortDefinition: 'The performance order of songs in a round.',
        definition:
          'Running order is the order in which countries perform within a semi-final, final or other round. It helps follow a show, but it is not the same as the final placing in the results table.',
        synonyms: ['performance order'],
      },
      fr: {
        slug: 'ordre-de-passage',
        term: 'Ordre de passage',
        shortDefinition: 'Ordre dans lequel les chansons sont interprétées dans un tour.',
        definition:
          'L’ordre de passage indique quand les pays se produisent dans une demi-finale, une finale ou un autre tour. Il ne doit pas être confondu avec la place finale dans le classement.',
        synonyms: ['running order'],
      },
      pt: {
        slug: 'ordem-de-atuacao',
        term: 'Ordem de atuação',
        shortDefinition: 'Ordem em que as canções atuam numa ronda.',
        definition:
          'A ordem de atuação indica quando os países atuam numa semifinal, final ou outra ronda. Ajuda a seguir a gala, mas não é a mesma coisa que a posição final nos resultados.',
        synonyms: ['running order'],
      },
      ca: {
        slug: 'ordre-actuacio',
        term: 'Ordre d’actuació',
        shortDefinition: 'Ordre en què actuen les cançons dins d’una ronda.',
        definition:
          'L’ordre d’actuació indica quan actuen els països en una semifinal, final o altra ronda. Ajuda a seguir la gala, però no s’ha de confondre amb la posició final de resultats.',
        synonyms: ['running order'],
      },
      eu: {
        slug: 'jardun-ordena',
        term: 'Jardun ordena',
        shortDefinition: 'Kantek txanda batean duten jarduteko hurrenkera.',
        definition:
          'Jardun ordenak herrialdeek finalerdi, final edo beste txanda batean noiz jarduten duten adierazten du. Gala jarraitzeko balio du, baina ez da emaitzen taulako azken postua.',
        synonyms: ['running order'],
      },
      gl: {
        slug: 'orde-de-actuacion',
        term: 'Orde de actuación',
        shortDefinition: 'Orde na que actúan as cancións nunha rolda.',
        definition:
          'A orde de actuación indica cando actúan os países nunha semifinal, final ou outra rolda. Axuda a seguir a gala, pero non debe confundirse coa posición final na táboa de resultados.',
        synonyms: ['running order'],
      },
    },
  },
  {
    id: 'top-10',
    related: ['rankings', 'history', 'countries'],
    texts: {
      es: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'Resultado entre los diez primeros puestos de una clasificación.',
        definition:
          'Top 10 se usa para señalar que una canción, país o edición aparece entre las diez primeras posiciones de una tabla. En análisis históricos conviene indicar si se calcula sobre final, semifinal u otra ronda.',
        synonyms: ['diez primeros'],
      },
      en: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'A result within the first ten places of a ranking.',
        definition:
          'Top 10 means that a song, country or edition appears among the first ten positions of a table. Historical analysis should state whether it is calculated from the final, a semi-final or another round.',
        synonyms: ['top ten'],
      },
      fr: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'Résultat parmi les dix premières places d’un classement.',
        definition:
          'Top 10 indique qu’une chanson, un pays ou une édition figure parmi les dix premières positions d’un classement. Les analyses doivent préciser si le calcul porte sur la finale, une demi-finale ou un autre tour.',
        synonyms: ['dix premiers'],
      },
      pt: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'Resultado entre as dez primeiras posições de uma classificação.',
        definition:
          'Top 10 indica que uma canção, país ou edição aparece entre as dez primeiras posições de uma tabela. Em análises históricas convém indicar se é calculado sobre a final, semifinal ou outra ronda.',
        synonyms: ['dez primeiros'],
      },
      ca: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'Resultat entre les deu primeres posicions d’una classificació.',
        definition:
          'Top 10 indica que una cançó, país o edició apareix entre les deu primeres posicions d’una taula. En anàlisi històrica cal indicar si es calcula sobre la final, semifinal o altra ronda.',
        synonyms: ['deu primers'],
      },
      eu: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'Sailkapen bateko lehen hamar postuen arteko emaitza.',
        definition:
          'Top 10 esateak kanta, herrialde edo edizio bat taula bateko lehen hamar postuen artean dagoela adierazten du. Analisi historikoetan zein txandaren gainean kalkulatzen den zehaztu behar da.',
        synonyms: ['lehen hamarrak'],
      },
      gl: {
        slug: 'top-10',
        term: 'Top 10',
        shortDefinition: 'Resultado entre os dez primeiros postos dunha clasificación.',
        definition:
          'Top 10 úsase para indicar que unha canción, país ou edición aparece entre as dez primeiras posicións dunha táboa. En análises históricas cómpre indicar se se calcula sobre final, semifinal ou outra rolda.',
        synonyms: ['dez primeiros'],
      },
    },
  },
  {
    id: 'nul-points',
    related: ['rankings', 'history', 'stats'],
    texts: {
      es: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'Expresión asociada a terminar una votación sin puntos.',
        definition:
          'Nul points es una expresión popular para hablar de una candidatura que acaba una votación con cero puntos. Al usarla en datos conviene indicar la ronda, el sistema de votación y si el cero corresponde al total o a una parte concreta.',
        synonyms: ['cero puntos'],
      },
      en: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'A phrase associated with ending a vote with zero points.',
        definition:
          'Nul points is a popular phrase for an entry that ends a vote with zero points. In data pages, it is useful to state the round, voting system and whether the zero refers to the total or to a specific component.',
        synonyms: ['zero points'],
      },
      fr: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'Expression associée à une candidature terminant avec zéro point.',
        definition:
          'Nul points est une expression populaire pour une candidature qui termine un vote avec zéro point. Dans les données, il faut préciser le tour, le système de vote et si le zéro correspond au total ou à une partie précise.',
        synonyms: ['zéro point'],
      },
      pt: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'Expressão associada a terminar uma votação sem pontos.',
        definition:
          'Nul points é uma expressão popular para uma candidatura que termina uma votação com zero pontos. Em páginas de dados convém indicar a ronda, o sistema de votação e se o zero corresponde ao total ou a uma componente.',
        synonyms: ['zero pontos'],
      },
      ca: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'Expressió associada a acabar una votació sense punts.',
        definition:
          'Nul points és una expressió popular per a una candidatura que acaba una votació amb zero punts. En dades convé indicar la ronda, el sistema de votació i si el zero correspon al total o a una part concreta.',
        synonyms: ['zero punts'],
      },
      eu: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'Bozketa bat punturik gabe amaitzearekin lotutako esamoldea.',
        definition:
          'Nul points esamolde ezaguna da bozketa bat zero punturekin amaitzen duen hautagaitzaz hitz egiteko. Datuetan txanda, bozketa sistema eta zeroa guztizkoari edo osagai bati dagokion zehaztea komeni da.',
        synonyms: ['zero puntu'],
      },
      gl: {
        slug: 'nul-points',
        term: 'Nul points',
        shortDefinition: 'Expresión asociada a rematar unha votación sen puntos.',
        definition:
          'Nul points é unha expresión popular para falar dunha candidatura que remata unha votación con cero puntos. En datos convén indicar a rolda, o sistema de votación e se o cero corresponde ao total ou a unha parte concreta.',
        synonyms: ['cero puntos'],
      },
    },
  },
];

export const glossaryTermIds = terms.map((term) => term.id);

function getText(term: GlossaryConfig, locale: Locale): GlossaryText {
  return term.texts[locale] ?? term.texts[defaultLocale];
}

export function listGlossaryTerms(locale: Locale): GlossaryTerm[] {
  return terms
    .map((term) => ({ id: term.id, related: term.related, ...getText(term, locale) }))
    .sort((a, b) => a.term.localeCompare(b.term, locale));
}

export function getGlossaryTerm(id: GlossaryTermId, locale: Locale): GlossaryTerm {
  const term = terms.find((item) => item.id === id) ?? terms[0];
  return { id: term.id, related: term.related, ...getText(term, locale) };
}

export function getGlossaryTermSlug(id: GlossaryTermId, locale: Locale): string {
  return getGlossaryTerm(id, locale).slug;
}

export function findGlossaryTermBySlug(slug: string | undefined, locale?: Locale): GlossaryTerm | undefined {
  if (!slug) return undefined;
  const normalizedSlug = slug.toLowerCase();
  const localesToCheck = locale ? [locale, defaultLocale] : Object.keys(terms[0].texts);

  for (const currentLocale of localesToCheck) {
    const term = terms.find((item) => getText(item, currentLocale as Locale).slug.toLowerCase() === normalizedSlug);
    if (term) return { id: term.id, related: term.related, ...getText(term, currentLocale as Locale) };
  }

  return undefined;
}

export function getGlossaryStaticPaths(locale: Locale) {
  return terms.map((term) => ({ params: { slug: getText(term, locale).slug } }));
}
