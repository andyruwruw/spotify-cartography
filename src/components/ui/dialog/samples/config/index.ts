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
    description: 'All of the author\'s library iterated with t-SNE 1000 times at ideal settings.',
    sampleSize: 6200,
    perplexity: 80,
    epsilon: 10,
    iterations: 1000,
    key: 'all',
    color: 'rgb(187, 74, 253)',
  },
  {
    title: 'Disconnected',
    description: 'A small sample of the author\'s library run with minimal perplexity.',
    sampleSize: 1000,
    perplexity: 5,
    epsilon: 10,
    iterations: 1000,
    key: 'small',
    color: 'rgb(255, 196, 1)',
  },
  {
    title: 'Webbing',
    description: 'A small sample of the author\'s library run with low perplexity.',
    sampleSize: 1000,
    perplexity: 10,
    epsilon: 10,
    iterations: 1000,
    key: 'medium',
    color: 'rgb(240, 124, 70)',
  },
  {
    title: 'Globe',
    description: 'A small sample of the author\'s library run with ideal perplexity.',
    sampleSize: 1000,
    perplexity: 30,
    epsilon: 10,
    iterations: 1000,
    key: 'large',
    color: 'rgb(230, 245, 100)',
  },
  {
    title: 'Batman',
    description: 'A small sample of the author\'s library run with too much perplexity.',
    sampleSize: 1000,
    perplexity: 100,
    epsilon: 10,
    iterations: 1000,
    key: 'x-large',
    color: 'rgb(1, 162, 255)',
  },
];
