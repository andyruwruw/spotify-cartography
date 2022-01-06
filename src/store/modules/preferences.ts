import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface PreferencesModuleState {
  acousticnessWeight: number;
  danceabilityWeight: number;
  energyWeight: number;
  instrumentalnessWeight: number;
  livenessWeight: number;
  speechinessWeight: number;
  tempoWeight: number;
  valenceWeight: number;
}

const defaultState = (): PreferencesModuleState => ({
  acousticnessWeight: 0.5,
  danceabilityWeight: 0.5,
  energyWeight: 0.5,
  instrumentalnessWeight: 0.5,
  livenessWeight: 0.5,
  speechinessWeight: 0.5,
  tempoWeight: 0.5,
  valenceWeight: 0.5,
});

const getters: GetterTree<PreferencesModuleState, any> = {
  getAcousticnessWeight(state) {
    return state.acousticnessWeight;
  },
  getDanceabilityWeight(state) {
    return state.danceabilityWeight;
  },
  getEnergyWeight(state) {
    return state.energyWeight;
  },
  getInstrumentalnessWeight(state) {
    return state.instrumentalnessWeight;
  },
  getLivenessWeight(state) {
    return state.livenessWeight;
  },
  getSpeechinessWeight(state) {
    return state.speechinessWeight;
  },
  getTempoWeight(state) {
    return state.tempoWeight;
  },
  getValenceWeight(state) {
    return state.valenceWeight;
  },
};

const mutations: MutationTree<PreferencesModuleState> = {
  setAcousticnessWeight(state, acousticnessWeight: number) {
    state.acousticnessWeight = acousticnessWeight;
  },
  setDanceabilityWeight(state, danceabilityWeight: number) {
    state.danceabilityWeight = danceabilityWeight;
  },
  setEnergyWeight(state, energyWeight: number) {
    state.energyWeight = energyWeight;
  },
  setInstrumentalnessWeight(state, instrumentalnessWeight: number) {
    state.instrumentalnessWeight = instrumentalnessWeight;
  },
  setLivenessWeight(state, livenessWeight: number) {
    state.livenessWeight = livenessWeight;
  },
  setSpeechinessWeight(state, speechinessWeight: number) {
    state.speechinessWeight = speechinessWeight;
  },
  setTempoWeight(state, tempoWeight: number) {
    state.tempoWeight = tempoWeight;
  },
  setValenceWeight(state, valenceWeight: number) {
    state.valenceWeight = valenceWeight;
  },
};

const actions: ActionTree<PreferencesModuleState, any> = {
};

const module: Module<PreferencesModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
