import { spotifyApi } from './request';

/**
 * Retrieves artist albums.
 *
 * @param {string} id Artist ID.
 * @param {number} offset Where in the artist's albums to start getting albums.
 * @returns {Promise<Response<SpotifyApi.ArtistsAlbumsResponse>>}
 */
const getArtistAlbums = (id: string, offset: number) => spotifyApi.getArtistAlbums(id, {
  limit: 50,
  offset,
});

/**
 * Searches for an artist.
 *
 * @param {string} query Query to search for.
 * @returns {Promise<Response<SpotifyApi.SearchResponse>>} Search results.
 */
const search = (query: string) => spotifyApi.search(
  query,
  ['artist'],
  {
    limit: 20,
  },
);

export default {
  getArtistAlbums,
  search,
};
