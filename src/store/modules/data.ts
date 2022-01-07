import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
}

export interface DataModuleState {
  progress: number;
  tracks: Record<string, Track>;
  graph: Array<Array<number>>;
}

const defaultState = (): DataModuleState => ({
  progress: 0,
  tracks: {},
  graph: [],
});

const getters: GetterTree<DataModuleState, any> = {
  getProgress: (state) => state.progress,
  getTracks(state): Record<string, Track> {
    return state.tracks;
  },
  getTrack(state, id): Track {
    return state.tracks[id];
  },
  getGraph(state) {
    return state.graph;
  },
};

const mutations: MutationTree<DataModuleState> = {
  setProgress(state, progress: number) {
    state.progress = progress;
  },
  setTracks(state, tracks: Record<string, Track>) {
    state.tracks = tracks;
  },
  setGraph(state, graph: Array<Array<number>>) {
    state.graph = graph;
  },
};

const actions: ActionTree<DataModuleState, any> = {
  collectData({ commit, dispatch }) {
    console.log('COLLECTING');
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
