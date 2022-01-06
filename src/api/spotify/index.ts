import SpotifyApi from 'spotify-web-api-node';

import { SCOPES, STATE, MARKET } from '@/config';

const spotifyApi = new SpotifyApi();

const getAuthorizeUrl = (): string => {
  return spotifyApi.createAuthorizeURL(SCOPES, STATE);
}

const getSavedTracks = async (offset: number = 0, limit: number = 50) => {
  return spotifyApi.getMySavedTracks({
    market: MARKET,
    limit,
    offset,
  });
}

const getTracksAudioFeatures = async (ids: string[]) => {
  return spotifyApi.getAudioFeaturesForTracks(ids);
}

const playSong = async (id: string) => {
  return spotifyApi.play({
    uris: [`spotify:track:${id}`],
  });
}

const pause = async () => {
  return spotifyApi.pause();
}

const transferUsersPlayback = async (deviceIds: string[], play: boolean) => {
  return spotifyApi.transferMyPlayback(
    deviceIds,
    { play },
  );
}

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
