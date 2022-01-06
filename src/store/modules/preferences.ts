import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface PreferencesModuleState {
}

const defaultState = (): PreferencesModuleState => ({

});

const getters: GetterTree<PreferencesModuleState, any> = {
  
};

const mutations: MutationTree<PreferencesModuleState> = {

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
