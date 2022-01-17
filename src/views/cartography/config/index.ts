interface TabDetails {
  name: string;
  key: string;
}

interface StatisticDetails {
  name: string;
  description: string;
  valueDescription: string;
  value: number;
  max: number;
  valueUnit: string;
  color: string;
  display: string;
}

interface HelpNote {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const TABS: Record<string, TabDetails> = {
  help: {
    name: 'Help',
    key: 'help',
  },
  tsne: {
    name: 'Algorithm',
    key: 'tsne',
  },
  weights: {
    name: 'Preferences',
    key: 'weights',
  },
};

export const STATISTIC_DETAILS = {
  valence: (value = -1): StatisticDetails => ({
    name: 'Happiness',
    description: 'Tracks with high valence (happiness) sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
    valueDescription: 'Happiness',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(255, 196, 1)',
    display: 'percent',
  }),
  acousticness: (value = -1): StatisticDetails => ({
    name: 'Acousticness',
    description: 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic.',
    valueDescription: 'Chance Track is Accoustic',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(248, 91, 91)',
    display: 'percent',
  }),
  energy: (value = -1): StatisticDetails => ({
    name: 'Energy',
    description: 'Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.',
    valueDescription: 'Energy',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(1, 162, 255)',
    display: 'percent',
  }),
  liveness: (value = -1): StatisticDetails => ({
    name: 'Liveness',
    description: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.',
    valueDescription: 'Chance Track is Live',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(159, 255, 121)',
    display: 'percent',
  }),
  danceability: (value = -1): StatisticDetails => ({
    name: 'Danceability',
    description: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.',
    valueDescription: 'Danceability',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(187, 74, 253)',
    display: 'percent',
  }),
  instrumentalness: (value = -1): StatisticDetails => ({
    name: 'Instrumentalness',
    description: 'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context.',
    valueDescription: 'Chance Track is Instrumental',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(65, 255, 214)',
    display: 'percent',
  }),
  popularity: (value = -1): StatisticDetails => ({
    name: 'Popularity',
    description: 'The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.',
    valueDescription: 'Popularity',
    value,
    max: 100,
    valueUnit: ' out of 100',
    color: 'rgb(230, 245, 100)',
    display: 'raw',
  }),
  speechiness: (value = -1): StatisticDetails => ({
    name: 'Speechiness',
    description: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music.',
    valueDescription: 'Amount of Spoken Word',
    value,
    max: 1,
    valueUnit: '%',
    color: 'rgb(255, 82, 241)',
    display: 'percent',
  }),
  tempo: (value = -1): StatisticDetails => ({
    name: 'Tempo',
    description: 'The overall estimated tempo of a track in beats per minute (BPM).',
    valueDescription: 'Tempo',
    value,
    max: 300,
    valueUnit: ' BPM',
    color: 'rgb(240, 124, 70)',
    display: 'raw',
  }),
  added: (value = 0): StatisticDetails => ({
    name: 'Added Date',
    description: '',
    valueDescription: '',
    value,
    max: 0,
    valueUnit: '',
    color: '',
    display: 'text',
  }),
};

export const HELP_DETAILS = `
Welcome to Spotify Cartography!
Every diamond you see in front of you is a song in your Spotify Library.
Use the "Algorithm" tab to sort the songs, bumping "Iterations" up to 50 should give you some interesting results.
You'll see a progress circle in the top-left once you click "Run".
Hovering over a song you can see its name and statistics.
Songs are grouped using these statistics. Genre, artist, and anything else isn't considered.
`;

export const HELP_NOTES: HelpNote[] = [
  {
    title: 'Rotate',
    description: 'Hold left-click and move the mouse to rotate around.',
    icon: 'mdi-rotate-orbit',
    color: 'rgb(255, 196, 1)',
  },
  {
    title: 'Pan',
    description: 'Hold right-click and move the mouse to pan the camera.',
    icon: 'mdi-pan',
    color: 'rgb(1, 162, 255)',
  },
  {
    title: 'Zoom',
    description: 'Use the mouse wheel to zoom in and out.',
    icon: 'mdi-magnify-plus',
    color: 'rgb(187, 74, 253)',
  },
  {
    title: 'Play Songs',
    description: 'Hold "Ctrl" and click on a song to play it.',
    icon: 'mdi-play-circle',
    color: 'rgb(230, 245, 100)',
  },
  {
    title: 'Song Details',
    description: 'Hover over a song to see its details.',
    icon: 'mdi-chart-bar',
    color: 'rgb(240, 124, 70)',
  },
  {
    title: 'Close Tabs',
    description: 'Click on a tab again to close it.',
    icon: 'mdi-close-circle',
    color: 'rgb(248, 91, 91)',
  },
];
