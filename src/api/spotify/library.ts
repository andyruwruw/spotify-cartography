import { MARKET } from '@/config';
import {
  Response,
  spotifyApi,
} from './request';

/**
 * Retrives the user's saved tracks.
 *
 * @param {number} offset What track to begin at.
 * @param {number} limit How many tracks to return.
 * @returns {Promise<Response<SpotifyApi.UsersSavedTracksResponse>>}
 */
const getSavedTracks = async (
  offset = 0,
  limit = 50,
): Promise<Response<SpotifyApi.UsersSavedTracksResponse>> => spotifyApi.getMySavedTracks({
  market: MARKET,
  limit,
  offset,
});

export default {
  getSavedTracks,
};
