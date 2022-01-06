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

interface SpotifyWebPlaybackSDKLoadResolution {
  Player: any;
}

interface WebPlaybackImage {
  url: string;
}

interface WebPlaybackArtist {
  uri: string;
  name: string;
}

interface WebPlaybackTrack {
  uri: string;
  id: string | null;
  type: string;
  media_type: string;
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: Array<WebPlaybackImage>;
  },
  artists: Array<WebPlaybackArtist>;
}

interface WebPlaybackState{
  context: {
    uri: string;
    metadata: Record<string, any>;
  };
  disallows: Record<string, boolean>;
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack,
    previous_tracks: Array<WebPlaybackTrack>;
    next_tracks: Array<WebPlaybackTrack>;
  };
}

interface PlayerModuleState {
  track: WebPlaybackTrack | null;
}

const defaultState = (): PlayerModuleState => ({
  track: null,
});

const getters: GetterTree<PlayerModuleState, any> = {
  getTrack(state) {
    return state.track;
  },
};

const mutations: MutationTree<PlayerModuleState> = {
  setTrack(state, track: WebPlaybackTrack) {
    state.track = track;
  },
};

const actions: ActionTree<PlayerModuleState, any> = {
  async initialize({
    commit,
    rootGetters,
    dispatch,
  }) {
    (async () => {
      // eslint-disable-next-line max-len
      const { Player } = await (waitForSpotifyWebPlaybackSDKToLoad() as Promise<SpotifyWebPlaybackSDKLoadResolution>);
      const token = rootGetters['auth/getAccessToken'];

      const player = new Player({
        name: 'Spotify Cartographer',
        getOAuthToken: (cb: (accessToken: string) => void) => {
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

      player.addListener('player_state_changed', (state: WebPlaybackState) => {
        if (state) {
          dispatch('updatePlayerState', state);
        }
      });

      player.addListener('ready', (event: Record<string, string>) => {
        commit('setDeviceID', event.device_id);

        api.spotify.playback.transferUsersPlayback([event.device_id], true);
      });

      player.addListener('not_ready', (event: Record<string, string>) => {
        console.log('Device ID has gone offline', event.device_id);
      });

      const connected = await player.connect();

      if (connected) {
        await waitUntilUserHasSelectedPlayer(player);
      }
    })();
  },

  async updatePlayerState({ commit }, state: WebPlaybackState) {
    commit('setTrack', state.track_window.current_track);
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
