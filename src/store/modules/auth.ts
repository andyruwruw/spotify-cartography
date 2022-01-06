import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface AuthModuleState {
}

const defaultState = (): AuthModuleState => ({

});

const getters: GetterTree<AuthModuleState, any> = {
  
};

const mutations: MutationTree<AuthModuleState> = {

};

const actions: ActionTree<AuthModuleState, any> = {
};

const module: Module<AuthModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
