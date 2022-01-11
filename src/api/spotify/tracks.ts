import { spotifyApi } from './request';

/**
 * Retrieves audio features of a set of tracks.
 *
 * @param ids The ids of the songs to retrieve.
 * @returns {Promise<Response<SpotifyApi.AudioFeaturesResponse>>}
 */
const getTracksAudioFeatures = async (ids: string[]) => spotifyApi.getAudioFeaturesForTracks(ids);

export default {
  getTracksAudioFeatures,
};
