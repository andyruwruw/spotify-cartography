import { MARKET } from '@/config';
import { spotifyApi } from './request';

/**
 * Retrieves a Spotify album's tracks.
 *
 * @param {string} id Id of the album.
 * @param {number} offset Where in the album to start getting tracks.
 * @returns {Promise<Response<SpotifyApi.AlbumTracksResponse>>}
 */
const getNumberAlbumTracks = async (id: string) => {
  const response = await spotifyApi.getAlbumTracks(id, {
    limit: 1,
    market: MARKET,
  });

  if (response.statusCode === 200) {
    return response.body.total;
  }
  return 0;
};

/**
 * Retrieves a Spotify album's tracks.
 *
 * @param {string} id Id of the album.
 * @param {number} offset Where in the album to start getting tracks.
 * @returns {Promise<Response<SpotifyApi.AlbumTracksResponse>>}
 */
const getAlbumTracks = (id: string, offset: number) => spotifyApi.getAlbumTracks(id, {
  limit: 50,
  offset,
  market: MARKET,
});

/**
 * Searches for an album.
 *
 * @param {string} query Query to search for.
 * @returns {Promise<Response<SpotifyApi.SearchResponse>>} Search results.
 */
const search = (query: string) => spotifyApi.search(
  query,
  ['album'],
  {
    limit: 20,
  },
);

export default {
  getNumberAlbumTracks,
  getAlbumTracks,
  search,
};
