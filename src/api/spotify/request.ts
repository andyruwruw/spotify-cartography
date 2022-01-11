import SpotifyApi from 'spotify-web-api-node';

export interface Response<T> {
  body: T;
}

export const spotifyApi = new SpotifyApi();
