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

export interface Track {
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

  return response.body.items.map((item) => item.track);
};

export const getTracksAudioFeatures = async (tracks: Array<SpotifyApi.TrackObjectFull>) => {
  const ids = tracks.map((track) => track.id);

  const response = await api.spotify.tracks.getTracksAudioFeatures(ids);

  return response.body.audio_features;
};

export const convertTracks = async (
  tracks: Record<string, Track>,
  savedTracks: Array<SpotifyApi.TrackObjectFull>,
  audioFeatures: SpotifyApi.AudioFeaturesObject[],
): Promise<Array<Track>> => {
  const sample: Array<Track> = [];

  for (let i = 0; i < savedTracks.length; i += 1) {
    if (audioFeatures[i] && savedTracks[i].album && savedTracks[i].album.images.length && savedTracks[i].album.images[0].url) {
      tracks[savedTracks[i].id] = {
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

  return sample;
};
