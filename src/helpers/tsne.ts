/**
 * Provided by https://github.com/karpathy/tsnejs
 * Edited to Typescript
 */

// utility function
const assert = (condition: boolean, message: string): void | string => {
  if (!condition) {
    throw message || 'Assertion failed';
  }
};

// syntax sugar
const getopt = (
  opt: Record<string, any>,
  field: string,
  defaultval: any,
) => {
  // eslint-disable-next-line no-prototype-builtins
  if (opt.hasOwnProperty(field)) {
    return opt[field];
  }
  return defaultval;
};

// return 0 mean unit standard deviation random number
let return_v = false;
let v_val = 0.0;

const gaussRandom = (): number => {
  if (return_v) {
    return_v = false;
    return v_val;
  }
  const u = 2 * Math.random() - 1;
  const v = 2 * Math.random() - 1;
  const r = u * u + v * v;
  if (r === 0 || r > 1) {
    return gaussRandom();
  }
  // eslint-disable-next-line no-mixed-operators
  const c = Math.sqrt(-2 * Math.log(r) / r);
  v_val = v * c; // cache this for next function call for efficiency
  return_v = true;
  return u * c;
};

// return random normal number
const randn = (mu: number, std: number): number => mu + gaussRandom() * std;

// utilitity that creates contiguous vector of zeros of size n
const zeros = (n: number) => {
  if (typeof (n) === 'undefined' || Number.isNaN(n)) {
    return [];
  }
  if (typeof ArrayBuffer === 'undefined') {
    // lacking browser support
    const arr = new Array(n);
    for (let i = 0; i < n; i += 1) {
      arr[i] = 0;
    }
    return arr;
  }
  return new Float64Array(n); // typed arrays are faster
};

// utility that returns 2d array filled with random numbers
// or with value s, if provided
const randn2d = (
  n: number,
  d: number,
  s: number | undefined = undefined,
): Array<Array<number>> => {
  const uses = typeof s !== 'undefined';
  const x = [];
  for (let i = 0; i < n; i += 1) {
    const xhere = [];
    for (let j = 0; j < d; j += 1) {
      if (uses) {
        xhere.push(s);
      } else {
        xhere.push(randn(0.0, 1e-4));
      }
    }
    x.push(xhere);
  }
  return x as Array<Array<number>>;
};

// compute L2 distance between two vectors
const L2 = (x1: Array<number>, x2: Array<number>) => {
  const D = x1.length;
  let d = 0;
  for (let i = 0; i < D; i += 1) {
    const x1i = x1[i];
    const x2i = x2[i];
    d += (x1i - x2i) * (x1i - x2i);
  }
  return d;
};

// compute pairwise distance in all vectors in X
const xtod = (X: Array<Array<number>>) => {
  const N = X.length;
  const dist = zeros(N * N); // allocate contiguous array
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const d = L2(X[i], X[j]);
      dist[i * N + j] = d;
      dist[j * N + i] = d;
    }
  }
  return dist;
};

// compute (p_{i|j} + p_{j|i})/(2n)
const d2p = (
  D: Array<number>,
  perplexity: number,
  tol: number,
) => {
  const Nf = Math.sqrt(D.length); // this better be an integer
  const N = Math.floor(Nf);
  assert(N === Nf, 'D should have square number of elements.');
  const Htarget = Math.log(perplexity); // target entropy of distribution
  const P = zeros(N * N); // temporary probability matrix

  const prow = zeros(N); // a temporary storage compartment
  for (let i = 0; i < N; i += 1) {
    let betamin = -Infinity;
    let betamax = Infinity;
    let beta = 1; // initial value of precision
    let done = false;
    const maxtries = 50;

    // perform binary search to find a suitable precision beta
    // so that the entropy of the distribution is appropriate
    let num = 0;
    while (!done) {
      // debugger;

      // compute entropy and kernel row with beta precision
      let psum = 0.0;
      for (let j = 0; j < N; j += 1) {
        let pj = Math.exp(-D[i * N + j] * beta);
        if (i === j) {
          pj = 0; // we dont care about diagonals
        }
        prow[j] = pj;
        psum += pj;
      }
      // normalize p and compute entropy
      let Hhere = 0.0;
      let pj = 0;
      for (let j = 0; j < N; j += 1) {
        if (psum !== 0) {
          pj = prow[j] / psum;
        }
        prow[j] = pj;
        if (pj > 1e-7) {
          Hhere -= pj * Math.log(pj);
        }
      }

      // adjust beta based on result
      if (Hhere > Htarget) {
        // entropy was too high (distribution too diffuse)
        // so we need to increase the precision for more peaky distribution
        betamin = beta; // move up the bounds
        if (betamax === Infinity) {
          beta *= 2;
        } else {
          beta = (beta + betamax) / 2;
        }
      } else {
        // converse case. make distrubtion less peaky
        betamax = beta;
        if (betamin === -Infinity) {
          beta /= 2;
        } else {
          beta = (beta + betamin) / 2;
        }
      }

      // stopping conditions: too many tries or got a good precision
      num += 1;
      if (Math.abs(Hhere - Htarget) < tol) {
        done = true;
      }
      if (num >= maxtries) {
        done = true;
      }
    }
    // copy over the final prow to P at row i
    for (let j = 0; j < N; j += 1) {
      P[i * N + j] = prow[j];
    }
  } // end loop over examples i

  // symmetrize P and normalize it to sum to 1 over all ij
  const Pout = zeros(N * N);
  const N2 = N * 2;
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < N; j += 1) {
      Pout[i * N + j] = Math.max((P[i * N + j] + P[j * N + i]) / N2, 1e-100);
    }
  }

  return Pout;
};

// helper function
const sign = (x: number) => {
  if (x > 0) {
    return 1;
  }
  if (x < 0) {
    return -1;
  }
  return 0;
};

export interface TsneOptions {
  perplexity?: number;
  dim?: number;
  epsilon?: number;
}

export class tSNE {
  perplexity: number;

  dim: number;

  epsilon: number;

  iter: number;

  P: any[] | Float64Array | undefined;

  N: number | undefined;

  Y: Array<Array<number>> | undefined;

  gains: Array<Array<number>> | undefined;

  ystep: Array<Array<number>> | undefined;

  constructor(opt: TsneOptions) {
    const options = opt || {};
    this.perplexity = getopt(
      options,
      'perplexity',
      30,
    ); // effective number of nearest neighbors
    this.dim = getopt(
      options,
      'dim',
      2,
    ); // by default 2-D tSNE
    this.epsilon = getopt(
      options,
      'epsilon',
      10,
    ); // learning rate
    this.iter = 0;
  }

  // this function takes a set of high-dimensional points
  // and creates matrix P from them using gaussian kernel
  initDataRaw(X: Array<Array<number>>) {
    const N = X.length;
    const D = X[0].length;
    assert(N > 0, ' X is empty? You must have some data!');
    assert(D > 0, ' X[0] is empty? Where is the data?');
    const dists = xtod(X); // convert X to distances using gaussian kernel
    this.P = d2p(
      dists as number[],
      this.perplexity,
      1e-4,
    ); // attach to object
    this.N = N; // back up the size of the dataset
    this.initSolution(); // refresh this
  }

  // this function takes a given distance matrix and creates
  // matrix P from them.
  // D is assumed to be provided as a list of lists, and should be symmetric
  initDataDist(D: Array<Array<number>>) {
    const N = D.length;
    assert(N > 0, ' X is empty? You must have some data!');
    // convert D to a (fast) typed array version
    const dists = zeros(N * N); // allocate contiguous array
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) {
        const d = D[i][j];
        dists[i * N + j] = d;
        dists[j * N + i] = d;
      }
    }
    this.P = d2p(
      dists as number[],
      this.perplexity,
      1e-4,
    );
    this.N = N;
    this.initSolution(); // refresh this
  }

  // (re)initializes the solution to random
  initSolution() {
    // generate random solution to t-SNE
    this.Y = randn2d(this.N as number, this.dim); // the solution
    this.gains = randn2d(
      this.N as number,
      this.dim,
      1.0,
    ); // step gains to accelerate progress in unchanging directions
    this.ystep = randn2d(
      this.N as number,
      this.dim,
      0.0,
    ); // momentum accumulator
    this.iter = 0;
  }

  // return pointer to current solution
  getSolution() {
    return this.Y;
  }

  // perform a single step of optimization to improve the embedding
  step() {
    this.iter += 1;
    const N = this.N as number;

    const cg = this.costGrad(this.Y as Array<Array<number>>); // evaluate gradient
    const { cost } = cg;
    const { grad } = cg;

    // perform gradient step
    const ymean = zeros(this.dim);
    for (let i = 0; i < N; i += 1) {
      for (let d = 0; d < this.dim; d += 1) {
        const gid = grad[i][d];
        const sid = (this.ystep as Array<Array<number>>)[i][d];
        const gainid = (this.gains as Array<Array<number>>)[i][d];

        // compute gain update
        let newgain = sign(gid) === sign(sid) ? gainid * 0.8 : gainid + 0.2;
        if (newgain < 0.01) newgain = 0.01; // clamp
        (this.gains as Array<Array<number>>)[i][d] = newgain; // store for next turn

        // compute momentum step direction
        const momval = this.iter < 250 ? 0.5 : 0.8;
        const newsid = momval * sid - this.epsilon * newgain * grad[i][d];
        (this.ystep as Array<Array<number>>)[i][d] = newsid; // remember the step we took

        // step!
        (this.Y as Array<Array<number>>)[i][d] += newsid;
        // eslint-disable-next-line max-len
        ymean[d] += (this.Y as Array<Array<number>>)[i][d]; // accumulate mean so that we can center later
      }
    }

    // reproject Y to be zero mean
    for (let i = 0; i < N; i += 1) {
      for (let d = 0; d < this.dim; d += 1) {
        (this.Y as Array<Array<number>>)[i][d] -= ymean[d] / N;
      }
    }

    return cost; // return current cost
  }

  // for debugging: gradient check
  debugGrad() {
    const N = this.N as number;

    const cg = this.costGrad(this.Y as Array<Array<number>>); // evaluate gradient
    const { grad } = cg;

    const e = 1e-5;
    for (let i = 0; i < N; i += 1) {
      for (let d = 0; d < this.dim; d += 1) {
        const yold = (this.Y as Array<Array<number>>)[i][d];

        (this.Y as Array<Array<number>>)[i][d] = yold + e;
        const cg0 = this.costGrad(this.Y as Array<Array<number>>);

        (this.Y as Array<Array<number>>)[i][d] = yold - e;
        const cg1 = this.costGrad(this.Y as Array<Array<number>>);

        const analytic = grad[i][d];
        const numerical = (cg0.cost - cg1.cost) / (2 * e);

        (this.Y as Array<Array<number>>)[i][d] = yold;
      }
    }
  }

  // return cost and gradient, given an arrangement
  costGrad(Y: Array<Array<number>>) {
    const N = this.N as number;
    const { dim } = this; // dim of output space
    const P = this.P as any[] | Float64Array;

    const pmul = this.iter < 100 ? 4 : 1; // trick that helps with local optima

    // compute current Q distribution, unnormalized first
    const Qu = zeros(N * N);
    let qsum = 0.0;
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) {
        let dsum = 0.0;
        for (let d = 0; d < dim; d += 1) {
          const dhere = Y[i][d] - Y[j][d];
          dsum += dhere * dhere;
        }
        const qu = 1.0 / (1.0 + dsum); // Student t-distribution
        Qu[i * N + j] = qu;
        Qu[j * N + i] = qu;
        qsum += 2 * qu;
      }
    }
    // normalize Q distribution to sum to 1
    const NN = N * N;
    const Q = zeros(NN);
    for (let q = 0; q < NN; q += 1) {
      Q[q] = Math.max(Qu[q] / qsum, 1e-100);
    }

    let cost = 0.0;
    const grad = [];
    for (let i = 0; i < N; i += 1) {
      const gsum = new Array(dim); // init grad for point i
      for (let d = 0; d < dim; d += 1) { gsum[d] = 0.0; }
      for (let j = 0; j < N; j += 1) {
        // eslint-disable-next-line max-len
        cost += -P[i * N + j] * Math.log(Q[i * N + j]); // accumulate cost (the non-constant portion at least...)
        const premult = 4 * (pmul * P[i * N + j] - Q[i * N + j]) * Qu[i * N + j];
        for (let d = 0; d < dim; d += 1) {
          gsum[d] += premult * (Y[i][d] - Y[j][d]);
        }
      }
      grad.push(gsum);
    }

    return { cost, grad };
  }
}
