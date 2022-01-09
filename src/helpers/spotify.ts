import SpotifyApi from 'spotify-web-api-node';

import api from '@/api';

export interface TrackAudioFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  popularity: number;
}

export interface CondensedSavedTrack extends SpotifyApi.TrackObjectFull {
  added: number;
}

export interface Track {
  added: number;
  id: string;
  name: string;
  artist: string;
  image: string;
  audioFeatures: TrackAudioFeatures;
}

export const getNumberSavedTracks = async () => {
  const response = await api.spotify.library.getSavedTracks(0, 1);

  return response.body.total;
};

export const getSavedTracks = async (offset: number) => {
  const response = await api.spotify.library.getSavedTracks(offset);

  return response.body.items.map((item: SpotifyApi.SavedTrackObject) => {
    const date = new Date(item.added_at);

    return {
      added: date.getTime(),
      ...item.track,
    };
  });
};

export const getTracksAudioFeatures = async (tracks: Array<SpotifyApi.TrackObjectFull>) => {
  const ids = tracks.map((track) => track.id);

  const response = await api.spotify.tracks.getTracksAudioFeatures(ids);

  return response.body.audio_features;
};

export const convertTracks = async (
  tracks: Record<string, Track>,
  savedTracks: Array<CondensedSavedTrack>,
  audioFeatures: SpotifyApi.AudioFeaturesObject[],
  index: number,
  last: number,
  first: number,
): Promise<Record<string, number>> => {
  const sample: Array<Track> = [];

  let newLast = last;
  let newFirst = first;

  for (let i = 0; i < savedTracks.length; i += 1) {
    if (audioFeatures[i]
      && Number.isNaN(audioFeatures[i].acousticness) === false
      && Number.isNaN(audioFeatures[i].danceability) === false
      && Number.isNaN(audioFeatures[i].energy) === false
      && Number.isNaN(audioFeatures[i].instrumentalness) === false
      && Number.isNaN(audioFeatures[i].liveness) === false
      && Number.isNaN(audioFeatures[i].speechiness) === false
      && Number.isNaN(audioFeatures[i].tempo) === false
      && Number.isNaN(audioFeatures[i].valence) === false
      && Number.isNaN(savedTracks[i].popularity) === false
      && savedTracks[i].album
      && savedTracks[i].album.images.length
      && savedTracks[i].album.images[0].url) {
      if (savedTracks[i].added > newLast) {
        newLast = savedTracks[i].added;
      }
      if (savedTracks[i].added < newFirst) {
        newFirst = savedTracks[i].added;
      }
      tracks[index + i] = {
        added: savedTracks[i].added,
        id: savedTracks[i].id,
        name: savedTracks[i].name,
        artist: savedTracks[i].artists.map((artist) => artist.name).join(', '),
        image: savedTracks[i].album.images[0].url,
        audioFeatures: {
          acousticness: audioFeatures[i].acousticness,
          danceability: audioFeatures[i].danceability,
          energy: audioFeatures[i].energy,
          instrumentalness: audioFeatures[i].instrumentalness,
          liveness: audioFeatures[i].liveness,
          speechiness: audioFeatures[i].speechiness,
          tempo: audioFeatures[i].tempo,
          valence: audioFeatures[i].valence,
          popularity: savedTracks[i].popularity,
        },
      };

      if (sample.length < 3) {
        sample.push(tracks[savedTracks[i].id]);
      }
    }
  }

  return {
    newLast,
    newFirst,
  };
};
