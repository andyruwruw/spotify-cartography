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
    title: 'Disjointed',
    description: 'The author\'s top played from 5 years color coded by year.',
    sampleSize: 500,
    perplexity: 24,
    epsilon: 8,
    iterations: 1000,
    key: 'disjointed',
    color: 'rgb(159, 255, 121)',
  },
  {
    title: 'Slinky',
    description: 'The author\'s top played from 5 years mapped based on mainly happiness, energy and tempo.',
    sampleSize: 500,
    perplexity: 24,
    epsilon: 8,
    iterations: 1000,
    key: 'slinky',
    color: 'rgb(1, 162, 255)',
  },
  {
    title: 'Intersection ',
    description: 'A comparison of Cage the Elephant and Portugal. The Man.',
    sampleSize: 444,
    perplexity: 21,
    epsilon: 10,
    iterations: 1000,
    key: 'intersection',
    color: 'rgb(248, 91, 91)',
  },
  {
    title: 'Story Book',
    description: 'John Mayor\'s music colored by album depicting their separate and overlapping features.',
    sampleSize: 231,
    perplexity: 15,
    epsilon: 10,
    iterations: 1000,
    key: 'story-book',
    color: 'rgb(240, 124, 70)',
  },
  {
    title: 'Eddies',
    description: 'All of the author\'s library mapped without taking popularity or liveness into account, focusing on emotions and composition.',
    sampleSize: 6200,
    perplexity: 79,
    epsilon: 10,
    iterations: 1000,
    key: 'eddies',
    color: 'rgb(65, 255, 214)',
  },
];
