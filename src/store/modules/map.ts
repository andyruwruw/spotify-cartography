import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import { TSNE } from '@keckelt/tsne';

import { Track } from '@/helpers/spotify-processing';
import * as ALL_10_1050_GRAPH from '@/assets/examples/all-10-1050-graph.json';
import * as LIKED_LIMITED_1000_15_1000_GRAPH from '@/assets/examples/liked-limited-1000-15-1000-graph.json';

interface GraphData {
  default: {
    graph: Array<Array<number>>;
  }
}

export interface MapModuleState {
  graph: Array<Array<number>>;
  tsne: null | TSNE;
  perplexity: number;
  epsilon: number;
  iterations: number;
  currentIteration: number;
  processDone: boolean;
  update: number;
  abort: boolean;
}

const defaultState = (): MapModuleState => ({
  graph: [],

  perplexity: 1,
  epsilon: 10,
  iterations: 1,

  tsne: null,

  currentIteration: 1,
  processDone: true,

  update: 1,

  abort: false,
});

const getters: GetterTree<MapModuleState, any> = {
  getGraph(state): Array<Array<number>> {
    return state.graph;
  },
  getPerplexity(state): number {
    return state.perplexity;
  },
  getEpsilon(state): number {
    return state.epsilon;
  },
  getIterations(state): number {
    return state.iterations;
  },
  getCurrentIteration(state): number {
    return state.currentIteration;
  },
  isProcessDone(state): boolean {
    return state.processDone;
  },
  getTSNE(state): TSNE {
    return state.tsne as TSNE;
  },
  getUpdate(state): number {
    return state.update;
  },
  isAbort(state): boolean {
    return state.abort;
  },
};

const mutations: MutationTree<MapModuleState> = {
  setGraph(state, graph: Array<Array<number>>) {
    state.graph = graph;
  },
  setTSNE(state, tsne: TSNE) {
    state.tsne = tsne;
  },
  setPerplexity(state, perplexity: number) {
    state.perplexity = perplexity;
  },
  setEpsilon(state, epsilon: number) {
    state.epsilon = epsilon;
  },
  setIterations(state, iterations: number) {
    state.iterations = iterations;
  },
  setCurrentIteration(state, iteration: number) {
    state.currentIteration = iteration;
  },
  setProcessState(state, done: boolean) {
    state.processDone = done;
  },
  bumpUpdate(state) {
    state.update = (state.update + 1) % 100;
  },
  setAbort(state, abort: boolean) {
    state.abort = abort;
  },
};

const actions: ActionTree<MapModuleState, any> = {
  changeSettings({ commit }, { perplexity, epsilon, iterations }) {
    commit('setPerplexity', perplexity);
    commit('setEpsilon', epsilon);
    commit('setIterations', iterations);
  },

  async firstProcess({ rootGetters, commit, dispatch }) {
    const tracks = Object.values(rootGetters['data/getTracks'] as Record<string, Track>);

    commit('setPerplexity', Math.round(tracks.length ** 0.5));
    commit('setEpsilon', 10);
    commit('setIterations', 1);

    dispatch('processData');
  },

  async processData({ commit, rootGetters, dispatch }) {
    commit('setProcessState', false);
    const tracks = Object.values(rootGetters['data/getTracks'] as Record<string, Track>);
    const vectors = tracks.map((track: Track) => [
      track.audioFeatures.valence,
      track.audioFeatures.energy,
      track.audioFeatures.danceability,
      track.audioFeatures.acousticness,
      track.audioFeatures.liveness,
      track.audioFeatures.speechiness,
      track.audioFeatures.instrumentalness,
      track.audioFeatures.tempo,
      track.audioFeatures.popularity,
    ]);

    if (tracks.length === 0) {
      return;
    }

    const opt = {
      epsilon: rootGetters['map/getEpsilon'] as number,
      perplexity: rootGetters['map/getPerplexity'] as number,
      dim: 3,
    };

    const tsne = new TSNE(opt);
    commit('setTSNE', tsne);

    tsne.initDataRaw(vectors);

    commit('setCurrentIteration', 0);

    setTimeout(() => dispatch('step', { iteration: 0 }), 0);
  },

  async step({ commit, rootGetters, dispatch }, { iteration }) {
    if (iteration === rootGetters['map/getIterations'] || rootGetters['map/isAbort']) {
      if (rootGetters['map/isAbort']) {
        commit('setAbort', false);
      }

      const graph = rootGetters['map/getTSNE'].getSolution();
      commit('setGraph', graph);

      commit('setProcessState', true);
      commit('bumpUpdate');
      return;
    }

    commit('setCurrentIteration', iteration + 1);

    await rootGetters['map/getTSNE'].step();

    if (iteration % 10 === 0) {
      const graph = rootGetters['map/getTSNE'].getSolution();
      commit('setGraph', graph);
      commit('bumpUpdate');
    }

    setTimeout(() => dispatch('step', { iteration: iteration + 1 }), 0);
  },

  abort({ commit }) {
    commit('setAbort', true);
  },

  loadExampleData({ commit }, key) {
    let graphs;
    let perplexity = 10;
    const iterations = 1000;

    if (key === 'all') {
      graphs = (ALL_10_1050_GRAPH as unknown as GraphData).default.graph;
      perplexity = 80;
    } else if (key === 'constellations') {
      graphs = (LIKED_LIMITED_1000_15_1000_GRAPH as unknown as GraphData).default.graph;
      perplexity = 15;
    }

    commit('setGraph', graphs);

    commit('setPerplexity', perplexity);
    commit('setEpsilon', 10);
    commit('setIterations', iterations);
  },
};

const module: Module<MapModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
