import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

import {
  convertTracks,
  getNumberSavedTracks,
  getSavedTracks,
  getTracksAudioFeatures,
  Track,
} from '@/helpers/spotify';

export interface DataModuleState {
  progress: number;
  progressSample: Array<Track>,
  tracks: Record<string, Track>;
  graph: Array<Array<number>>;
}

const defaultState = (): DataModuleState => ({
  progress: 0,
  progressSample: [] as Array<Track>,
  tracks: {},
  graph: [],
});

const getters: GetterTree<DataModuleState, any> = {
  getProgress: (state) => state.progress,
  getProgressSample: (state) => state.progressSample,
  getTracks(state): Record<string, Track> {
    return state.tracks;
  },
  getGraph(state) {
    return state.graph;
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
};

const actions: ActionTree<DataModuleState, any> = {
  async collectData({ commit, dispatch }) {
    const total = await getNumberSavedTracks();

    const tracks = {};

    for (let i = 0; i < total; i += 50) {
      const savedTracks = await getSavedTracks(i);

      const audioFeatures = await getTracksAudioFeatures(savedTracks);

      const sample = await convertTracks(
        tracks,
        savedTracks,
        audioFeatures,
      );

      commit('setProgress', i + 50 > total ? 1 : (i / total));
      commit('setProgressSample', sample);
    }

    commit('setTracks', tracks);
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
