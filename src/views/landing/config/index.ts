export interface SampleObject {
  title: string;
  description: string;
  sampleSize: number;
  perplexity: number;
  epsilon: number;
  iterations: number;
  key: string;
  color: string;
}

export const SAMPLES = [
  {
    title: 'The Works',
    description: 'All of the author\'s library.',
    sampleSize: 6200,
    perplexity: 80,
    epsilon: 10,
    iterations: 1000,
    key: 'all',
    color: 'rgb(187, 74, 253)',
  },
  {
    title: 'Constellations',
    description: 'A subset of the author\'s library.',
    sampleSize: 1000,
    perplexity: 13,
    epsilon: 50,
    iterations: 1000,
    key: 'constellations',
    color: 'rgb(255, 196, 1)',
  },
  {
    title: 'Disjointed ',
    description: 'The author\'s top played from 5 years color coded by year.',
    sampleSize: 500,
    perplexity: 24,
    epsilon: 8,
    iterations: 1000,
    key: 'disjointed',
    color: 'rgb(159, 255, 121)',
  },
];
