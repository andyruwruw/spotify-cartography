import {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import moment from 'moment';

import {
  combineTrackElements,
  getTracksAudioFeatures,
  Track,
} from '@/helpers/spotify-processing';
import { downloadJson } from '@/helpers/file';
import { REQUEST_TYPE } from '@/config';
import * as ALL_10_1050_TRACKS from '@/assets/examples/all-10-1050-tracks.json';
import * as SMALL_5_10_1000_TRACKS from '@/assets/examples/small-5-10-1000-tracks.json';
import * as SMALL_10_10_1000_TRACKS from '@/assets/examples/small-10-10-1000-tracks.json';
import * as SMALL_30_10_1000_TRACKS from '@/assets/examples/small-30-10-1000-tracks.json';
import * as SMALL_100_10_1000_TRACKS from '@/assets/examples/small-100-10-1000-tracks.json';
import api from '@/api';

interface TrackData {
  default: {
    tracks: Record<number, Track>;
  }
}

export interface DataModuleState {
  progress: number;
  type: string;
  timeRange: string;
  limit: number;
  offset: number;
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  albums: SpotifyApi.AlbumObjectSimplified[];
  artists: SpotifyApi.ArtistObjectSimplified[];
  tracks: Record<string, Track>;
  done: boolean;
  first: number;
  last: number;
}

const defaultState = (): DataModuleState => ({
  progress: 0,
  type: '',

  timeRange: '',

  limit: -1,
  offset: -1,

  playlists: [],
  albums: [],
  artists: [],

  tracks: {},

  done: false,

  first: Date.now(),
  last: 0,
});

const getters: GetterTree<DataModuleState, any> = {
  getProgress: (state): number => state.progress,
  getType: (state): string => state.type,
  getTimeRange: (state): string => state.timeRange,
  getLimit: (state): number => state.limit,
  getOffset: (state): number => state.offset,
  getPlaylists: (state): SpotifyApi.PlaylistObjectSimplified[] => state.playlists,
  getAlbums: (state): SpotifyApi.AlbumObjectSimplified[] => state.albums,
  getArtists: (state): SpotifyApi.ArtistObjectSimplified[] => state.artists,
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
  setPlaylists(state, playlists: SpotifyApi.PlaylistObjectSimplified[]) {
    state.playlists = playlists;
  },
  setAlbums(state, albums: SpotifyApi.AlbumObjectSimplified[]) {
    state.albums = albums;
  },
  setArtists(state, artists: SpotifyApi.ArtistObjectSimplified[]) {
    state.artists = artists;
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
  /**
   * Collects data based on parameters.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   */
  async collectData({
    commit,
    rootGetters,
    dispatch,
  }) {
    commit('setDone', false);

    if (rootGetters['data/getType'] === REQUEST_TYPE.TOP_LISTENED) {
      dispatch('collectTopListened');
    } else if (rootGetters['data/getType'] === REQUEST_TYPE.LIKED_SONGS) {
      dispatch('collectLikedTracks');
    } else if (rootGetters['data/getType'] === REQUEST_TYPE.PLAYLISTS) {
      dispatch('collectPlaylists');
    } else if (rootGetters['data/getType'] === REQUEST_TYPE.ALBUMS) {
      dispatch('collectAlbums');
    } else if (rootGetters['data/getType'] === REQUEST_TYPE.ARTISTS) {
      dispatch('collectArtists');
    }
  },

  /**
   * Collects top listened tracks from Spotify API.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   */
  async collectTopListened({ commit, rootGetters }) {
    if (rootGetters['data/getTimeRange'] === '') {
      return;
    }

    const tracks: Record<number, Track> = {};

    const response = await api.spotify.user.getTopListened(rootGetters['data/getTimeRange']);

    if (response.statusCode === 200) {
      const rawTracks = response.body.items;
      const attatchedData = rawTracks.map((track, index) => ({
        index,
        calculatedValue: index / rawTracks.length,
      }));
      const audioFeatures = await getTracksAudioFeatures(rawTracks);

      for (let i = 0; i < rawTracks.length; i += 1) {
        const track = combineTrackElements(
          rawTracks[i],
          attatchedData[i],
          audioFeatures[i],
        );

        if (track) {
          tracks[i] = track;
        }

        commit('setProgress', i / rawTracks.length);
      }

      commit('setProgress', 1);
      commit('setTracks', tracks);
      commit('setDone', true);
    } else {
      commit('setProgress', 1);
      commit('setDone', true);
    }
  },

  /**
   * Collects liked tracks from Spotify API.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   */
  async collectLikedTracks({ commit, rootGetters }) {
    const total = await api.spotify.library.getNumberSavedTracks();

    const tracks: Record<number, Track> = {};

    const start = rootGetters['data/getOffset'] === -1 ? 0 : rootGetters['data/getOffset'];
    const end = rootGetters['data/getLimit'] === -1 ? total : start + rootGetters['data/getLimit'];

    const firstAdded = new Date((await api.spotify.library.getSavedTracks(start, 1)).body.items[0].added_at).getTime();
    const lastAdded = new Date((await api.spotify.library.getSavedTracks(end, 1)).body.items[0].added_at).getTime();

    for (let i = start; i < end; i += 50) {
      const response = await api.spotify.library.getSavedTracks(i, i + 50 <= end ? 50 : end - i);

      const rawTracks = response.body.items.map((track) => track.track);
      const attatchedData = response.body.items.map((track, index) => ({
        added: (new Date(track.added_at)).getTime(),
        calculatedValue: ((new Date(track.added_at)).getTime() - firstAdded) / (lastAdded - firstAdded),
      }));
      const audioFeatures = await getTracksAudioFeatures(rawTracks);

      for (let j = 0; j < rawTracks.length; j += 1) {
        const track = combineTrackElements(
          rawTracks[j],
          attatchedData[j],
          audioFeatures[j],
        );

        if (track) {
          tracks[i + j - start] = track;
        }

        commit('setProgress', (i + j - start) / (end - start));
      }
    }

    commit('setProgress', 1);
    commit('setDone', true);
    commit('setTracks', tracks);
  },

  /**
   * Collects playlist tracks from Spotify API.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   */
  async collectPlaylists({ commit, rootGetters }) {
    if (rootGetters['data/getPlaylists'].length === 0) {
      return;
    }

    const tracks: Record<number, Track> = {};

    const playlists = rootGetters['data/getPlaylists'];

    for (let i = 0; i < playlists.length; i += 1) {
      const playlist = playlists[i];

      const total = await api.spotify.playlist.getNumberPlaylistTracks(playlist.id);

      for (let j = 0; j < total; j += 50) {
        const response = await api.spotify.playlist.getPlaylistTracks(
          playlist.id,
          j,
        );

        if (response.statusCode === 200) {
          const rawTracks = response.body.items.map((track) => track.track);
          const attatchedData = response.body.items.map((track, index) => ({
            added: new Date(track.added_at).getTime(),
            index: j + index,
            playlistId: playlist.id,
            calculatedValue: playlists.length > 1 ? i / playlists.length : (j + index) / total,
          }));
          const audioFeatures = await getTracksAudioFeatures(rawTracks);

          for (let k = 0; k < rawTracks.length; k += 1) {
            const track = combineTrackElements(
              rawTracks[k],
              attatchedData[k],
              audioFeatures[k],
            );

            if (track) {
              tracks[Object.keys(tracks).length] = track;
            }

            commit('setProgress', (i / playlists.length) + ((j + k) / total) / playlists.length);
          }
        } else if (response.statusCode === 429) {
          j -= 50;
        }
      }
    }

    commit('setProgress', 1);
    commit('setDone', true);
    commit('setTracks', tracks);
  },

  /**
   * Collects album tracks from Spotify API.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   */
  async collectAlbums({ commit, rootGetters }) {
    if (rootGetters['data/getAlbums'].length === 0) {
      return;
    }

    const tracks: Record<number, Track> = {};

    const albums = rootGetters['data/getAlbums'];

    for (let i = 0; i < albums.length; i += 1) {
      const album = albums[i];

      const totalTracks = await api.spotify.album.getNumberAlbumTracks(album.id);

      for (let j = 0; j < totalTracks; j += 50) {
        const simplifiedTrackResponse = await api.spotify.album.getAlbumTracks(
          album.id,
          j,
        );

        if (simplifiedTrackResponse.statusCode === 200) {
          const trackResponse = await api.spotify.tracks.getTracks(simplifiedTrackResponse.body.items.map((track) => track.id));

          if (trackResponse.statusCode === 200) {
            const rawTracks = trackResponse.body.tracks;
            const attatchedData = trackResponse.body.tracks.map((track, index) => ({
              added: new Date(album.release_date).getTime(),
              index: j + index,
              albumId: album.id,
              calculatedValue: albums.length > 1 ? i / albums.length : (j + index) / totalTracks,
            }));
            const audioFeatures = await getTracksAudioFeatures(rawTracks);

            for (let k = 0; k < rawTracks.length; k += 1) {
              const track = combineTrackElements(
                rawTracks[k],
                attatchedData[k],
                audioFeatures[k],
              );

              if (track) {
                tracks[Object.keys(tracks).length] = track;
              }

              commit('setProgress', i / albums.length + ((j + k) / totalTracks) / albums.length);
            }
          } else if (trackResponse.statusCode === 429) {
            j -= 50;
          }
        } else if (simplifiedTrackResponse.statusCode === 429) {
          j -= 50;
        }
      }
    }

    commit('setProgress', 1);
    commit('setDone', true);
    commit('setTracks', tracks);
  },

  /**
   * Collects artist tracks from Spotify API.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   * @returns {void}
   */
  async collectArtists({ commit, rootGetters }) {
    if (rootGetters['data/getArtists'].length === 0) {
      return;
    }

    const tracks: Record<number, Track> = {};

    const artists = rootGetters['data/getArtists'];

    for (let i = 0; i < artists.length; i += 1) {
      const artist = artists[i];

      const totalAlbums = await api.spotify.artist.getNumberArtistAlbums(artist.id);

      for (let j = 0; j < totalAlbums; j += 50) {
        const albumResponse = await api.spotify.artist.getArtistAlbums(
          artist.id,
          j,
        );

        if (albumResponse.statusCode === 200) {
          const rawAlbums = albumResponse.body.items;

          for (let k = 0; k < rawAlbums.length; k += 1) {
            const album = rawAlbums[k];

            const totalTracks = await api.spotify.album.getNumberAlbumTracks(album.id);

            for (let l = 0; l < totalTracks; l += 50) {
              const simplifiedTrackResponse = await api.spotify.album.getAlbumTracks(
                album.id,
                l,
              );

              if (simplifiedTrackResponse.statusCode === 200) {
                const trackResponse = await api.spotify.tracks.getTracks(simplifiedTrackResponse.body.items.map((track) => track.id));

                if (trackResponse.statusCode === 200) {
                  const rawTracks = trackResponse.body.tracks;
                  const attatchedData = trackResponse.body.tracks.map((track, index) => {
                    let calculatedValue = (l + index) / totalTracks;
                    if (rawAlbums.length > 1 || j > 0) {
                      calculatedValue = k / rawAlbums.length;
                    }
                    if (artists.length > 1) {
                      calculatedValue = i / artists.length;
                    }

                    return {
                      added: new Date(album.release_date).getTime(),
                      index: l + index,
                      artist: artist.id,
                      calculatedValue,
                    };
                  });
                  const audioFeatures = await getTracksAudioFeatures(rawTracks);

                  for (let m = 0; m < rawTracks.length; m += 1) {
                    const track = combineTrackElements(
                      rawTracks[m],
                      attatchedData[m],
                      audioFeatures[m],
                    );

                    if (track) {
                      tracks[Object.keys(tracks).length] = track;
                    }

                    commit('setProgress', (i / artists.length) + (j + k) / totalAlbums / artists.length + ((l + m) / totalTracks) / totalAlbums / artists.length);
                  }
                } else if (trackResponse.statusCode === 429) {
                  l -= 50;
                }
              } else if (simplifiedTrackResponse.statusCode === 429) {
                l -= 50;
              }
            }
          }
        } else if (albumResponse.statusCode === 429) {
          j -= 50;
        }
      }
    }

    commit('setProgress', 1);
    commit('setDone', true);
    commit('setTracks', tracks);
  },

  /**
   * Saves the user's data as a JSON.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   */
  async save({ rootGetters }) {
    const graph = rootGetters['map/getGraph'];
    const tracks = rootGetters['data/getTracks'];

    const data = {
      graph,
      tracks,
    };

    downloadJson(data, `spotify-cartography-data-${moment().format()}.json`);
  },

  /**
   * Loads example data from JSON's.
   *
   * @param {ActionContext<DataModuleState, any>} context Vuex context object.
   * @param {string} key Key of data to load.
   */
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

    commit('setTracks', tracks);
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

  changeSettingsPlaylists({ commit }, playlists) {
    commit('setPlaylists', playlists);
  },

  changeSettingsAlbums({ commit }, albums) {
    commit('setAlbums', albums);
  },

  changeSettingsArtists({ commit }, artists) {
    commit('setArtists', artists);
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
