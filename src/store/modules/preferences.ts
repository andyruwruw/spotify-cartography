import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface PreferencesModuleState {
  valenceWeight: number;
  energyWeight: number;
  danceabilityWeight: number;
  acousticnessWeight: number;
  livenessWeight: number;
  speechinessWeight: number;
  instrumentalnessWeight: number;
  tempoWeight: number;
  popularityWeight: number;
}

const defaultState = (): PreferencesModuleState => ({
  valenceWeight: 1,
  energyWeight: 1,
  danceabilityWeight: 1,
  acousticnessWeight: 1,
  livenessWeight: 1,
  speechinessWeight: 1,
  instrumentalnessWeight: 1,
  tempoWeight: 1,
  popularityWeight: 1,
});

const getters: GetterTree<PreferencesModuleState, any> = {
  getValenceWeight(state): number {
    return state.valenceWeight;
  },
  getEnergyWeight(state): number {
    return state.energyWeight;
  },
  getDanceabilityWeight(state): number {
    return state.danceabilityWeight;
  },
  getAcousticnessWeight(state): number {
    return state.acousticnessWeight;
  },
  getLivelinessWeight(state): number {
    return state.livenessWeight;
  },
  getSpeechinessWeight(state): number {
    return state.speechinessWeight;
  },
  getInstrumentalnessWeight(state): number {
    return state.instrumentalnessWeight;
  },
  getTempoWeight(state): number {
    return state.tempoWeight;
  },
  getPopularityWeight(state): number {
    return state.popularityWeight;
  },
};

const mutations: MutationTree<PreferencesModuleState> = {
  setValenceWeight(state, valenceWeight: number): void {
    state.valenceWeight = valenceWeight;
  },
  setEnergyWeight(state, energyWeight: number): void {
    state.energyWeight = energyWeight;
  },
  setDanceabilityWeight(state, danceabilityWeight: number): void {
    state.danceabilityWeight = danceabilityWeight;
  },
  setAcousticnessWeight(state, acousticnessWeight: number): void {
    state.acousticnessWeight = acousticnessWeight;
  },
  setLivelinessWeight(state, livenessWeight: number): void {
    state.livenessWeight = livenessWeight;
  },
  setSpeechinessWeight(state, speechinessWeight: number): void {
    state.speechinessWeight = speechinessWeight;
  },
  setInstrumentalnessWeight(state, instrumentalnessWeight: number): void {
    state.instrumentalnessWeight = instrumentalnessWeight;
  },
  setTempoWeight(state, tempoWeight: number): void {
    state.tempoWeight = tempoWeight;
  },
  setPopularityWeight(state, popularityWeight: number): void {
    state.popularityWeight = popularityWeight;
  },
};

const actions: ActionTree<PreferencesModuleState, any> = {
  /**
   * Sets weights for given attributes
   *.
   * @param {ActionContext<PreferencesModuleState, any>} context Vuex context object.
   * @param {object} payload Object containing weights for each attribute.
   */
  setWeights({ commit }, {
    valenceWeight,
    energyWeight,
    danceabilityWeight,
    acousticnessWeight,
    livenessWeight,
    speechinessWeight,
    instrumentalnessWeight,
    tempoWeight,
    popularityWeight,
  }): void {
    commit('setValenceWeight', valenceWeight);
    commit('setEnergyWeight', energyWeight);
    commit('setDanceabilityWeight', danceabilityWeight);
    commit('setAcousticnessWeight', acousticnessWeight);
    commit('setLivelinessWeight', livenessWeight);
    commit('setSpeechinessWeight', speechinessWeight);
    commit('setInstrumentalnessWeight', instrumentalnessWeight);
    commit('setTempoWeight', tempoWeight);
    commit('setPopularityWeight', popularityWeight);
  },
};

const module: Module<PreferencesModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
