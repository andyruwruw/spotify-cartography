import { spotifyApi } from './request';

/**
 * Retrieves playlist tracks.
 *
 * @param {string} id Playlist ID.
 * @param {number} offset Where in the playlist to start getting tracks.
 * @returns {Promise<Response<SpotifyApi.PlaylistTrackResponse>>}
 */
const getPlaylistTracks = (id: string, offset: number) => spotifyApi.getPlaylistTracks(id, {
  limit: 50,
  offset,
});

/**
 * Searches for a playlist.
 *
 * @param {string} query Query to search for.
 * @returns {Promise<Response<SpotifyApi.SearchResponse>>} Search results.
 */
const search = (query: string) => spotifyApi.search(
  query,
  ['playlist'],
  {
    limit: 20,
  },
);

export default {
  getPlaylistTracks,
  search,
};
