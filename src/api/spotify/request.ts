import SpotifyApi from 'spotify-web-api-node';

export interface Response<T> {
  body: T;
}

/**
 * Instance of spotify-web-api-node.
 */
export const spotifyApi = new SpotifyApi();
