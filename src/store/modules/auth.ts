import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

import api from '@/api';

export interface AuthModuleState {
  displayName: string;
  accessToken: string;
}

const defaultState = (): AuthModuleState => ({
  displayName: '',
  accessToken: '',
});

const getters: GetterTree<AuthModuleState, any> = {
  isAuthenticated: (state) => state.accessToken && state.accessToken.length > 0,
  getAccessToken: (state) => state.accessToken,
  getDisplayName: (state) => state.displayName,
};

const mutations: MutationTree<AuthModuleState> = {
  setDisplayName(state, displayName: string) {
    state.displayName = displayName;
  },
  setAccessToken(state, accessToken: string) {
    state.accessToken = accessToken;
  },
};

const actions: ActionTree<AuthModuleState, any> = {
  login(context) {
    const url = api.spotify.auth.getAuthorizeUrl();

    window.location.href = url;
  },

  async callback({ commit, dispatch }, accessToken) {
    commit('setAccessToken', accessToken);

    api.spotify.auth.setAccessToken(accessToken);

    dispatch(
      'player/initialize',
      null,
      { root: true },
    );

    const user = (await api.spotify.user.getMe()).body;

    commit('setDisplayName', user.display_name);
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
