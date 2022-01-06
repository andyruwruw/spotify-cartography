import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface TrackModuleState {
}

const defaultState = (): TrackModuleState => ({

});

const getters: GetterTree<TrackModuleState, any> = {
  
};

const mutations: MutationTree<TrackModuleState> = {

};

const actions: ActionTree<TrackModuleState, any> = {
};

const module: Module<TrackModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
