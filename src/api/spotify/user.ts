import { spotifyApi } from './request';

/**
 * Get user's public information.
 *
 * @returns {Promise<Response<SpotifyApi.CurrentUsersProfileResponse>>}
 */
const getMe = async () => spotifyApi.getMe();

/**
 * Gets user's top listened for a given period.
 *
 * @param {} timeRange Time range to receive top tracks for.
 * @returns {Promise<Response<SpotifyApi.UsersTopTracksResponse>>} Top listened tracks.
 */
const getTopListened = async (timeRange: 'long_term' | 'medium_term' | 'short_term' | undefined) => spotifyApi.getMyTopTracks({
  limit: 50,
  time_range: timeRange,
});

export default {
  getMe,
  getTopListened,
};
