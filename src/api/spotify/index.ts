import SpotifyApi from 'spotify-web-api-node';

import {
  SCOPES,
  STATE,
  MARKET,
} from '@/config';

const spotifyApi = new SpotifyApi();

const getAuthorizeUrl = (): string => spotifyApi.createAuthorizeURL(SCOPES, STATE);

const getSavedTracks = async (offset = 0, limit = 50) => spotifyApi.getMySavedTracks({
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
