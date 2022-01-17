import { spotifyApi } from './request';

/**
 * Retreives track full objects.
 *
 * @param ids The ids of the songs to retrieve.
 * @returns {Promise<Response<SpotifyApi.MultipleTracksResponse>>}
 */
const getTracks = async (ids: string[]) => spotifyApi.getTracks(ids);

/**
 * Retrieves audio features of a set of tracks.
 *
 * @param ids The ids of the songs to retrieve.
 * @returns {Promise<Response<SpotifyApi.AudioFeaturesResponse>>}
 */
const getTracksAudioFeatures = async (ids: string[]) => spotifyApi.getAudioFeaturesForTracks(ids);

export default {
  getTracks,
  getTracksAudioFeatures,
};
