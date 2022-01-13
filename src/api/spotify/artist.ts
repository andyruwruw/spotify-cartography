import { spotifyApi } from './request';

/**
 * Retrieves number of artist albums.
 *
 * @param {string} id Artist ID.
 * @returns {number}
 */
const getNumberArtistAlbums = async (id: string) => {
  const response = await spotifyApi.getArtistAlbums(id, {
    limit: 1,
    include_groups: 'album,single',
  });

  if (response.statusCode === 200) {
    return response.body.total;
  }
  return 0;
};

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
  include_groups: 'album,single',
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
  getNumberArtistAlbums,
  getArtistAlbums,
  search,
};
