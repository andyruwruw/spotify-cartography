import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

import api from '@/api';

export interface AuthModuleState {
  accessToken: string;
}

const defaultState = (): AuthModuleState => ({
  accessToken: '',
});

const getters: GetterTree<AuthModuleState, any> = {
  isAuthenticated: (state) => state.accessToken && state.accessToken.length > 0,
  getAccessToken: (state) => state.accessToken,
};

const mutations: MutationTree<AuthModuleState> = {
  setAccessToken(state, accessToken: string) {
    state.accessToken = accessToken;
  },
};

const actions: ActionTree<AuthModuleState, any> = {
  login(context) {
    const url = api.spotify.auth.getAuthorizeUrl();

    window.location.href = url;
  },

  callback({ commit, dispatch }, accessToken) {
    commit('setAccessToken', accessToken);

    api.spotify.auth.setAccessToken(accessToken);

    dispatch(
      'player/initialize',
      null,
      { root: true },
    );
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
