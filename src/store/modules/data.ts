import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import { TSNE } from '@keckelt/tsne';

import {
  convertTracks,
  getNumberSavedTracks,
  getSavedTracks,
  getTracksAudioFeatures,
  Track,
} from '@/helpers/spotify';
import { downloadJson } from '@/helpers/file';
// import { DATA as ALL_10_1050 } from '@/assets/examples/all-10-1050';

export interface DataModuleState {
  progress: number;
  progressSample: Array<Track>;
  tracks: Record<string, Track>;
  graph: Array<Array<number>>;
  done: boolean;
  tsne: null | TSNE;
  first: number;
  last: number;
  perplexity: number;
  epsilon: number;
  iterations: number;
  currentIteration: number;
  processDone: boolean;
  update: number;
  abort: boolean;
}

const defaultState = (): DataModuleState => ({
  progress: 0,
  progressSample: [] as Array<Track>,
  tracks: {},
  graph: [],
  done: false,
  tsne: null,
  first: Date.now(),
  last: 0,
  perplexity: 1,
  epsilon: 10,
  iterations: 1,
  currentIteration: 1,
  processDone: true,
  update: 1,
  abort: false,
});

const getters: GetterTree<DataModuleState, any> = {
  getProgress: (state): number => state.progress,
  getProgressSample: (state): Array<Track> => state.progressSample,
  getTracks(state): Record<string, Track> {
    return state.tracks;
  },
  getGraph(state): Array<Array<number>> {
    return state.graph;
  },
  isDone(state): boolean {
    return state.done;
  },
  getFirstAndLast(state): [number, number] {
    return [state.first, state.last];
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

const mutations: MutationTree<DataModuleState> = {
  setProgress(state, progress: number) {
    state.progress = progress;
  },
  setProgressSample(state, sample: Array<Track>) {
    state.progressSample = sample;
  },
  setTracks(state, tracks: Record<string, Track>) {
    state.tracks = tracks;
  },
  setGraph(state, graph: Array<Array<number>>) {
    state.graph = graph;
  },
  setDone(state, done: boolean) {
    state.done = done;
  },
  setTSNE(state, tsne: TSNE) {
    state.tsne = tsne;
  },
  setFirstAndLast(state, { first, last }) {
    state.first = first;
    state.last = last;
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

const actions: ActionTree<DataModuleState, any> = {
  async collectData({ commit, dispatch }) {
    commit('setDone', false);

    const total = await getNumberSavedTracks();

    const tracks = {};

    // && i < 500
    let last = 0;
    let first = Date.now();

    // && i < 1000 For when things get scary...

    for (let i = 0; i < total && i < 1000; i += 50) {
      const savedTracks = await getSavedTracks(i);

      const audioFeatures = await getTracksAudioFeatures(savedTracks);

      const {
        newLast,
        newFirst,
      } = await convertTracks(
        tracks,
        savedTracks,
        audioFeatures,
        i,
        last,
        first,
      );

      last = newLast;
      first = newFirst;

      commit('setFirstAndLast', { first, last });
      commit('setProgress', i + 50 >= total ? 1 : (i / total));
    }

    commit('setDone', true);
    commit('setTracks', tracks);
  },

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
      epsilon: rootGetters['data/getEpsilon'] as number,
      perplexity: rootGetters['data/getPerplexity'] as number,
      dim: 3,
    };

    const tsne = new TSNE(opt);
    commit('setTSNE', tsne);

    tsne.initDataRaw(vectors);

    const iterations = rootGetters['data/getIterations'];
    commit('setCurrentIteration', 0);

    setTimeout(() => dispatch('step', { iteration: 0 }), 0);
  },

  async step({ commit, rootGetters, dispatch }, { iteration }) {
    if (iteration === rootGetters['data/getIterations'] || rootGetters['data/isAbort']) {
      if (rootGetters['data/isAbort']) {
        commit('setAbort', false);
      }

      const graph = rootGetters['data/getTSNE'].getSolution();
      commit('setGraph', graph);

      commit('setProcessState', true);
      commit('bumpUpdate');
      return;
    }

    commit('setCurrentIteration', iteration + 1);

    await rootGetters['data/getTSNE'].step();

    if (iteration % 10 === 0) {
      const graph = rootGetters['data/getTSNE'].getSolution();
      commit('setGraph', graph);
      commit('bumpUpdate');
    }

    setTimeout(() => dispatch('step', { iteration: iteration + 1 }), 0);
  },

  abort({ commit }) {
    commit('setAbort', true);
  },

  async save({ rootGetters }) {
    const graph = rootGetters['data/getGraph'];
    const tracks = rootGetters['data/getTracks'];

    const data = {
      graph,
      tracks,
    };

    downloadJson(data, 'data.json');
  },

  loadExampleData({ commit }) {
    console.log('hi');
    // commit('setTracks', ALL_10_1050.tracks);
    // commit('setGraph', ALL_10_1050.graph);

    // commit('setPerplexity', Math.round(ALL_10_1050.graph.length ** 0.5));
    // commit('setEpsilon', 10);
    // commit('setIterations', 1050);
  },
};

const module: Module<DataModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
