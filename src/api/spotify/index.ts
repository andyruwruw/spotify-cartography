import SpotifyApi from 'spotify-web-api-node';

import {
  REDIRECT_URL,
  SCOPES,
  SPOTIFY_BASE_AUTH_URL,
  SPOTIFY_CLIENT_ID,
  STATE,
  MARKET,
} from '@/config';

export interface Response<T> {
  body: T;
}

const spotifyApi = new SpotifyApi();

const setAccessToken = (accessToken: string) => spotifyApi.setAccessToken(accessToken);

// eslint-disable-next-line max-len
const getAuthorizeUrl = (): string => `${SPOTIFY_BASE_AUTH_URL}?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&scope=${SCOPES.join('%20')}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&state=${STATE}`;

const getSavedTracks = async (offset = 0, limit = 50): Promise<Response<SpotifyApi.UsersSavedTracksResponse>> => spotifyApi.getMySavedTracks({
  market: MARKET,
  limit,
  offset,
});

const getTracksAudioFeatures = async (ids: string[]) => spotifyApi.getAudioFeaturesForTracks(ids);

const playSong = async (id: string) => spotifyApi.play({
  uris: [`spotify:track:${id}`],
});

const pause = async () => spotifyApi.pause();

// eslint-disable-next-line max-len
const transferUsersPlayback = async (deviceIds: string[], play: boolean) => spotifyApi.transferMyPlayback(
  deviceIds,
  { play },
);

export default {
  auth: {
    getAuthorizeUrl,
    setAccessToken,
  },
  library: {
    getSavedTracks,
  },
  tracks: {
    getTracksAudioFeatures,
  },
  playback: {
    playSong,
    pause,
    transferUsersPlayback,
  },
};
