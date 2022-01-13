import { MARKET } from '@/config';
import {
  Response,
  spotifyApi,
} from './request';

/**
 * Retrives the user's saved tracks.
 *
 * @returns {Promise<number>}
 */
const getNumberSavedTracks = async (): Promise<number> => {
  const response = await spotifyApi.getMySavedTracks({
    market: MARKET,
    limit: 1,
  });

  if (response.statusCode === 200) {
    return response.body.total;
  }
  return 0;
};

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
  getNumberSavedTracks,
  getSavedTracks,
};
