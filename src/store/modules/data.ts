import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

import {
  convertTracks,
  getNumberSavedTracks,
  getSavedTracks,
  getTracksAudioFeatures,
  Track,
} from '@/helpers/spotify-processing';
import { downloadJson } from '@/helpers/file';
import * as ALL_10_1050_TRACKS from '@/assets/examples/all-10-1050-tracks.json';
import * as SMALL_5_10_1000_TRACKS from '@/assets/examples/small-5-10-1000-tracks.json';
import * as SMALL_10_10_1000_TRACKS from '@/assets/examples/small-10-10-1000-tracks.json';
import * as SMALL_30_10_1000_TRACKS from '@/assets/examples/small-30-10-1000-tracks.json';
import * as SMALL_100_10_1000_TRACKS from '@/assets/examples/small-100-10-1000-tracks.json';
import moment from 'moment';

interface TrackData {
  default: {
    tracks: Record<number, Track>;
  }
}

export interface DataModuleState {
  progress: number;
  total: number;
  type: string;
  timeRange: string;
  limit: number;
  offset: number;
  playlistIds: string[];
  albumIds: string[];
  artistIds: string[];
  tracks: Record<string, Track>;
  done: boolean;
  first: number;
  last: number;
}

const defaultState = (): DataModuleState => ({
  progress: 0,
  total: -1,
  type: '',

  timeRange: '',

  limit: -1,
  offset: -1,

  playlistIds: [],
  albumIds: [],
  artistIds: [],

  tracks: {},

  done: false,

  first: Date.now(),
  last: 0,
});

const getters: GetterTree<DataModuleState, any> = {
  getProgress: (state): number => state.progress,
  getTotal: (state): number => state.total,
  getType: (state): string => state.type,
  getTimeRange: (state): string => state.timeRange,
  getLimit: (state): number => state.limit,
  getOffset: (state): number => state.offset,
  getPlaylistIds: (state): string[] => state.playlistIds,
  getAlbumIds: (state): string[] => state.albumIds,
  getArtistIds: (state): string[] => state.artistIds,
  getTracks(state): Record<string, Track> {
    return state.tracks;
  },
  isDone(state): boolean {
    return state.done;
  },
  getFirstAndLast(state): [number, number] {
    return [state.first, state.last];
  },
};

const mutations: MutationTree<DataModuleState> = {
  setProgress(state, progress: number) {
    state.progress = progress;
  },
  setTotal(state, total: number) {
    state.total = total;
  },
  setType(state, type: string) {
    state.type = type;
  },
  setTimeRange(state, timeRange: string) {
    state.timeRange = timeRange;
  },
  setLimit(state, limit: number) {
    state.limit = limit;
  },
  setOffset(state, offset: number) {
    state.offset = offset;
  },
  setPlaylistIds(state, playlistIds: string[]) {
    state.playlistIds = playlistIds;
  },
  setAlbumIds(state, albumIds: string[]) {
    state.albumIds = albumIds;
  },
  setArtistIds(state, artistIds: string[]) {
    state.artistIds = artistIds;
  },
  setTracks(state, tracks: Record<string, Track>) {
    state.tracks = tracks;
  },
  setDone(state, done: boolean) {
    state.done = done;
  },
  setFirstAndLast(state, { first, last }) {
    state.first = first;
    state.last = last;
  },
};

const actions: ActionTree<DataModuleState, any> = {
  async getTotal({ commit }) {
    commit('setTotal', await getNumberSavedTracks());
  },

  async collectData({ commit, rootGetters, dispatch }) {
    commit('setDone', false);

    if (rootGetters['data/getTotal'] === -1) {
      dispatch('getTotal');
    }

    const total = rootGetters['data/getTotal'];

    const tracks = {};

    // && i < 500
    let last = 0;
    let first = Date.now();

    // && i < 1000 For when things get scary...

    for (let i = 0; i < total; i += 50) {
      const savedTracks = await getSavedTracks(i);

      const audioFeatures = await getTracksAudioFeatures(savedTracks);

      const {
        newLast,
        newFirst,
      } = await convertTracks(
        tracks,
        savedTracks,
        audioFeatures,
        i,
        last,
        first,
      );

      last = newLast;
      first = newFirst;

      commit('setFirstAndLast', { first, last });
      commit('setProgress', i + 50 >= total ? 1 : (i / total));
    }

    commit('setDone', true);
    commit('setTracks', tracks);
  },

  async save({ rootGetters }) {
    const graph = rootGetters['map/getGraph'];
    const tracks = rootGetters['data/getTracks'];

    const data = {
      graph,
      tracks,
    };

    downloadJson(data, `spotify-cartography-data-${moment().format()}.json`);
  },

  loadExampleData({ commit, dispatch }, key) {
    dispatch('map/loadExampleData', key, { root: true });
    let tracks;

    if (key === 'all') {
      tracks = (ALL_10_1050_TRACKS as unknown as TrackData).default.tracks;
    } else if (key === 'small') {
      tracks = (SMALL_5_10_1000_TRACKS as unknown as TrackData).default.tracks;
    } else if (key === 'medium') {
      tracks = (SMALL_10_10_1000_TRACKS as unknown as TrackData).default.tracks;
    } else if (key === 'large') {
      tracks = (SMALL_30_10_1000_TRACKS as unknown as TrackData).default.tracks;
    } else if (key === 'x-large') {
      tracks = (SMALL_100_10_1000_TRACKS as unknown as TrackData).default.tracks;
    }

    const keys = Object.keys(tracks as Record<string, Track>);
    let first = Date.now();
    let last = 0;

    for (let i = 0; i < keys.length; i += 1) {
      const track = (tracks as Record<string, Track>)[i];

      if (track !== undefined && 'added' in track) {
        if (track.added < first) {
          first = track.added;
        }
        if (track.added > last) {
          last = track.added;
        }
      }
    }

    commit('setTracks', tracks);
    commit('setFirstAndLast', { first, last });
  },

  changeSettingsType({ commit }, type) {
    commit('setType', type);
  },

  changeSettingsTimeRange({ commit }, timeRange) {
    commit('setTimeRange', timeRange);
  },

  changeSettingsLimit({ commit }, limit) {
    commit('setLimit', limit);
  },

  changeSettingsOffset({ commit }, offset) {
    commit('setOffset', offset);
  },

  changeSettingsPlaylistIds({ commit }, playlistIds) {
    commit('setPlaylistIds', playlistIds);
  },

  changeSettingsAlbumIds({ commit }, albumIds) {
    commit('setPlaylistIds', albumIds);
  },

  changeSettingsArtistIds({ commit }, artistIds) {
    commit('setPlaylistIds', artistIds);
  },
};

const module: Module<DataModuleState, Record<string, any>> = {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions,
};

export default module;
