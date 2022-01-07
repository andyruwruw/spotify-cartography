import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

export interface AuthModuleState {
  accessToken: string;
}

const defaultState = (): AuthModuleState => ({
  accessToken: '',
});

const getters: GetterTree<AuthModuleState, any> = {
  getAccessToken: (state) => state.accessToken,
};

const mutations: MutationTree<AuthModuleState> = {
  setAccessToken(state, accessToken: string) {
    state.accessToken = accessToken;
  },
};

const actions: ActionTree<AuthModuleState, any> = {
  login(context) {
    console.log('login');
  },
  callback(context) {
    console.log('callback');
  },
  logout(context) {
    console.log('logout');
  },
};

const module: Module<AuthModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
