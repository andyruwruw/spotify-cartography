import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

import {
  waitForSpotifyWebPlaybackSDKToLoad,
  waitUntilUserHasSelectedPlayer,
} from '@/helpers/spotify-web-playback-sdk';
import api from '@/api';

export interface SpotifyWebPlaybackSDKLoadResolution {
  Player: any;
}

export interface PlayerModuleState {
}

const defaultState = (): PlayerModuleState => ({

});

const getters: GetterTree<PlayerModuleState, any> = {
  
};

const mutations: MutationTree<PlayerModuleState> = {

};

const actions: ActionTree<PlayerModuleState, any> = {
  initialize: async function({
    commit,
    rootGetters,
    dispatch,
  }) {
    (async () => {
      const { Player } = await (waitForSpotifyWebPlaybackSDKToLoad() as Promise<SpotifyWebPlaybackSDKLoadResolution>);
      const token = rootGetters['auth/getAccessToken'];

      const player = new Player({
        name: 'Spotify Cartographer',
        getOAuthToken: (cb: Function) => {
          cb(token);
        },
      });

      player.addListener('initialization_error', (event: Record<string, string>) => {
        console.error('initialization_error', event.message);
      });

      player.addListener('authentication_error', (event: Record<string, string>) => {
        console.error('authentication_error', event.message);
      });

      player.addListener('account_error', (event: Record<string, string>) => {
        console.error('account_error', event.message);
      });

      player.addListener('playback_error', (event: Record<string, string>) => {
        console.error('playback_error', event.message);
      });

      // Playback status updates
      player.addListener('player_state_changed', (state: any) => {
        if (state) {
          dispatch('setPlaybackContext', state);
          dispatch('setPlayback');
          dispatch('track/updateTrack', state, { root: true });
        }
      });

      player.addListener('ready', (event: Record<string, string>) => {
        commit('setDeviceID', event.device_id);

        api.spotify.playback.transferUsersPlayback([ event.device_id ], true);
      });

      player.addListener('not_ready', (event: Record<string, string>) => {
        console.log('Device ID has gone offline', event.device_id);
      });

      // Connect to the player!
      let connected = await player.connect();

      if (connected) {
        await waitUntilUserHasSelectedPlayer(player);
      }
    })();
  },
};

const module: Module<PlayerModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
