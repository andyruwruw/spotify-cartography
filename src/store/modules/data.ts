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

export interface DataModuleState {
  progress: number;
  progressSample: Array<Track>;
  tracks: Record<string, Track>;
  graph: Array<Array<number>>;
  done: boolean;
  tsne: null | TSNE;
  first: number;
  last: number;
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
};

const actions: ActionTree<DataModuleState, any> = {
  async collectData({ commit, dispatch }) {
    commit('setDone', false);

    const total = await getNumberSavedTracks();

    const tracks = {};

    // && i < 500
    let last = 0;
    let first = Date.now();

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

    // dispatch('processData');
  },

  async firstProcess({ rootGetters, commit }) {
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

    const opt = {
      epsiolon: 10,
      perplexity: Math.round(vectors.length ** 0.5),
      dim: 3,
    };

    const tsne = new TSNE(opt);

    commit('setTSNE', tsne);

    tsne.initDataRaw(vectors);

    tsne.step();

    const graph = tsne.getSolution();
    commit('setGraph', graph);
  },

  async processData({ commit, rootGetters }) {
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
