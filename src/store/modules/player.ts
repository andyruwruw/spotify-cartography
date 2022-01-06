import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface PlayerModuleState {
}

const defaultState = (): PlayerModuleState => ({

});

const getters: GetterTree<PlayerModuleState, any> = {
  
};

const mutations: MutationTree<PlayerModuleState> = {

};

const actions: ActionTree<PlayerModuleState, any> = {
};

const module: Module<PlayerModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
