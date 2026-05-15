export type EurovisionSong = {
  runningOrder?: string;
  country: string;
  flag: string;
  artist: string;
  song: string;
  directFinalist?: boolean;
};

export type EurovisionContest = {
  id: string;
  name: string;
  description: string;
  songs: EurovisionSong[];
};

export const eurovision2026Contests: EurovisionContest[] = [
  {
    id: 'semi-1',
    name: 'Semifinal 1',
    description: 'Orden de actuación publicado para la primera semifinal, incluyendo los finalistas directos que actúan fuera de concurso.',
    songs: [
      { runningOrder: '01', country: 'Moldavia', flag: 'MD', artist: 'Satoshi', song: 'Viva, Moldova!' },
      { runningOrder: '02', country: 'Suecia', flag: 'SE', artist: 'FELICIA', song: 'My System' },
      { runningOrder: '03', country: 'Croacia', flag: 'HR', artist: 'LELEK', song: 'Andromeda' },
      { runningOrder: '04', country: 'Grecia', flag: 'GR', artist: 'Akylas', song: 'Ferto' },
      { runningOrder: '05', country: 'Portugal', flag: 'PT', artist: 'Bandidos do Cante', song: 'Rosa' },
      { runningOrder: '06', country: 'Georgia', flag: 'GE', artist: 'Bzikebi', song: 'On Replay' },
      { country: 'Italia', flag: 'IT', artist: 'Sal Da Vinci', song: 'Per Sempre Sì', directFinalist: true },
      { runningOrder: '07', country: 'Finlandia', flag: 'FI', artist: 'Linda Lampenius & Pete Parkkonen', song: 'Liekinheitin' },
      { runningOrder: '08', country: 'Montenegro', flag: 'ME', artist: 'Tamara Živković', song: 'Nova Zora' },
      { runningOrder: '09', country: 'Estonia', flag: 'EE', artist: 'Vanilla Ninja', song: 'Too Epic To Be True' },
      { runningOrder: '10', country: 'Israel', flag: 'IL', artist: 'Noam Bettan', song: 'Michelle' },
      { country: 'Alemania', flag: 'DE', artist: 'Sarah Engels', song: 'Fire', directFinalist: true },
      { runningOrder: '11', country: 'Bélgica', flag: 'BE', artist: 'ESSYLA', song: 'Dancing On The Ice' },
      { runningOrder: '12', country: 'Lituania', flag: 'LT', artist: 'Lion Ceccah', song: 'Sólo Quiero Más' },
      { runningOrder: '13', country: 'San Marino', flag: 'SM', artist: 'SENHIT feat. Boy George', song: 'Superstar' },
      { runningOrder: '14', country: 'Polonia', flag: 'PL', artist: 'ALICJA', song: 'Pray' },
      { runningOrder: '15', country: 'Serbia', flag: 'RS', artist: 'LAVINA', song: 'Kraj Mene' },
    ],
  },
  {
    id: 'semi-2',
    name: 'Semifinal 2',
    description: 'Orden de actuación publicado para la segunda semifinal, incluyendo países ya clasificados que actúan durante la gala.',
    songs: [
      { runningOrder: '01', country: 'Bulgaria', flag: 'BG', artist: 'DARA', song: 'Bangaranga' },
      { runningOrder: '02', country: 'Azerbaiyán', flag: 'AZ', artist: 'JIVA', song: 'Just Go' },
      { runningOrder: '03', country: 'Rumanía', flag: 'RO', artist: 'Alexandra Căpitănescu', song: 'Choke Me' },
      { runningOrder: '04', country: 'Luxemburgo', flag: 'LU', artist: 'Eva Marija', song: 'Mother Nature' },
      { runningOrder: '05', country: 'Chequia', flag: 'CZ', artist: 'Daniel Žižka', song: 'CROSSROADS' },
      { country: 'Francia', flag: 'FR', artist: 'Monroe', song: 'Regarde!', directFinalist: true },
      { runningOrder: '06', country: 'Armenia', flag: 'AM', artist: 'SIMÓN', song: 'Paloma Rumba' },
      { runningOrder: '07', country: 'Suiza', flag: 'CH', artist: 'Veronica Fusaro', song: 'Alice' },
      { runningOrder: '08', country: 'Chipre', flag: 'CY', artist: 'Antigoni', song: 'JALLA' },
      { country: 'Austria', flag: 'AT', artist: 'COSMÓ', song: 'TANZSCHEIN', directFinalist: true },
      { runningOrder: '09', country: 'Letonia', flag: 'LV', artist: 'Atvara', song: 'Ēnā' },
      { runningOrder: '10', country: 'Dinamarca', flag: 'DK', artist: 'Søren Torpegaard Lund', song: 'Før Vi Går Hjem' },
      { runningOrder: '11', country: 'Australia', flag: 'AU', artist: 'Delta Goodrem', song: 'Eclipse' },
      { runningOrder: '12', country: 'Ucrania', flag: 'UA', artist: 'Leléka', song: 'Ridnym' },
      { country: 'Reino Unido', flag: 'GB', artist: 'LOOK MUM NO COMPUTER', song: 'Eins, Zwei, Drei', directFinalist: true },
      { runningOrder: '13', country: 'Albania', flag: 'AL', artist: 'Alis', song: 'Nân' },
      { runningOrder: '14', country: 'Malta', flag: 'MT', artist: 'AIDAN', song: 'Bella' },
      { runningOrder: '15', country: 'Noruega', flag: 'NO', artist: 'JONAS LOVV', song: 'YA YA YA' },
    ],
  },
  {
    id: 'final',
    name: 'Final',
    description: 'Orden de actuación publicado para la final de Eurovisión 2026.',
    songs: [
      { runningOrder: '01', country: 'Noruega', flag: 'NO', artist: 'Kyle Alessandro', song: 'Lighter' },
      { runningOrder: '02', country: 'Luxemburgo', flag: 'LU', artist: 'Laura Thorn', song: 'La poupée monte le son' },
      { runningOrder: '03', country: 'Estonia', flag: 'EE', artist: 'Tommy Cash', song: 'Espresso Macchiato' },
      { runningOrder: '04', country: 'Israel', flag: 'IL', artist: 'Yuval Raphael', song: 'New Day Will Rise' },
      { runningOrder: '05', country: 'Lituania', flag: 'LT', artist: 'Katarsis', song: 'Tavo akys' },
      { runningOrder: '06', country: 'España', flag: 'ES', artist: 'Melody', song: 'Esa Diva' },
      { runningOrder: '07', country: 'Ucrania', flag: 'UA', artist: 'Ziferblat', song: 'Bird Of Pray' },
      { runningOrder: '08', country: 'Reino Unido', flag: 'GB', artist: 'Remember Monday', song: 'What The Hell Just Happened?' },
      { runningOrder: '09', country: 'Austria', flag: 'AT', artist: 'JJ', song: 'Wasted Love' },
      { runningOrder: '10', country: 'Islandia', flag: 'IS', artist: 'Væb', song: 'Róa' },
      { runningOrder: '11', country: 'Letonia', flag: 'LV', artist: 'Tautumeitas', song: 'Bur man laimi' },
      { runningOrder: '12', country: 'Países Bajos', flag: 'NL', artist: 'Claude', song: "C'est La Vie" },
      { runningOrder: '13', country: 'Finlandia', flag: 'FI', artist: 'Erika Vikman', song: 'Ich Komme' },
      { runningOrder: '14', country: 'Italia', flag: 'IT', artist: 'Lucio Corsi', song: 'Volevo essere un duro' },
      { runningOrder: '15', country: 'Polonia', flag: 'PL', artist: 'Justyna Steczkowska', song: 'Gaja' },
      { runningOrder: '16', country: 'Alemania', flag: 'DE', artist: 'Abor & Tynna', song: 'Baller' },
      { runningOrder: '17', country: 'Grecia', flag: 'GR', artist: 'Klavdia', song: 'Asteromáta' },
      { runningOrder: '18', country: 'Armenia', flag: 'AM', artist: 'Parg', song: 'Survivor' },
      { runningOrder: '19', country: 'Suiza', flag: 'CH', artist: 'Zoë Më', song: 'Voyage' },
      { runningOrder: '20', country: 'Malta', flag: 'MT', artist: 'Miriana Conte', song: 'Serving' },
      { runningOrder: '21', country: 'Portugal', flag: 'PT', artist: 'Napa', song: 'Deslocado' },
      { runningOrder: '22', country: 'Dinamarca', flag: 'DK', artist: 'Sissal', song: 'Hallucination' },
      { runningOrder: '23', country: 'Suecia', flag: 'SE', artist: 'KAJ', song: 'Bara Bada Bastu' },
      { runningOrder: '24', country: 'Francia', flag: 'FR', artist: 'Louane', song: 'Maman' },
      { runningOrder: '25', country: 'San Marino', flag: 'SM', artist: 'Gabry Ponte', song: "Tutta L'Italia" },
      { runningOrder: '26', country: 'Albania', flag: 'AL', artist: 'Shkodra Elektronike', song: 'Zjerm' },
    ],
  },
];
