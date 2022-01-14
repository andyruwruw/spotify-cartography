import api from '@/api';

export interface TrackAttatchedData {
  added?: number;
  playlistId?: string;
  albumId?: string;
  artistId?: string;
  index?: number;
  calculatedValue: number;
}

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
  attatchedData: TrackAttatchedData;
  id: string;
  name: string;
  artist: string;
  image: string;
  audioFeatures: TrackAudioFeatures;
}

export const sleepyTime = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retrieve's track audio features.
 *
 * @param {SpotifyApi.TrackObjectFull[]} tracks Track objects.
 * @returns {Promise<TrackAudioFeatures[]>}
 */
export const getTracksAudioFeatures = async (tracks: SpotifyApi.TrackObjectSimplified[]) => {
  const ids = tracks.map((track) => track.id);

  const audioFeatures: SpotifyApi.AudioFeaturesObject[] = [];

  while (ids.length > 0) {
    const response = await api.spotify.tracks.getTracksAudioFeatures(ids.splice(0, 50));

    response.body.audio_features.forEach((audioFeature) => {
      audioFeatures.push(audioFeature);
    });
  }

  return audioFeatures;
};

/**
 * Whether enough data is present to deposit.
 *
 * @param {SpotifyApi.TrackObjectFull} track
 * @param {SpotifyApi.AudioFeaturesObject} audioFeatures
 * @returns {boolean} Whether enough data is present to deposit.
 */
const isCombinable = (
  track: SpotifyApi.TrackObjectFull,
  audioFeatures: SpotifyApi.AudioFeaturesObject,
): boolean => (audioFeatures
  && Number.isNaN(audioFeatures.acousticness) === false
  && Number.isNaN(audioFeatures.danceability) === false
  && Number.isNaN(audioFeatures.energy) === false
  && Number.isNaN(audioFeatures.instrumentalness) === false
  && Number.isNaN(audioFeatures.liveness) === false
  && Number.isNaN(audioFeatures.speechiness) === false
  && Number.isNaN(audioFeatures.tempo) === false
  && Number.isNaN(audioFeatures.valence) === false
  && Number.isNaN(track.popularity) === false
  && track.album !== null
  && track.album.images.length > 0
  && track.album.images[0].url !== null);

/**
 * Combines track data to be deposited.
 *
 * @param {SpotifyApi.TrackObjectFull} track Track full object.
 * @param {TrackAttatchedData} attatchedData Attatched data to track.
 * @param {SpotifyApi.AudioFeaturesObject} audioFeatures Track audio features.
 * @returns {Track} Combined data to be deposited.
 */
export const combineTrackElements = (
  track: SpotifyApi.TrackObjectFull,
  attatchedData: TrackAttatchedData,
  audioFeatures: SpotifyApi.AudioFeaturesObject,
): Track | null => {
  if (isCombinable(track, audioFeatures)) {
    return {
      attatchedData,
      id: track.id,
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(', '),
      image: track.album.images[0].url,
      audioFeatures: {
        acousticness: audioFeatures.acousticness,
        danceability: audioFeatures.danceability,
        energy: audioFeatures.energy,
        instrumentalness: audioFeatures.instrumentalness,
        liveness: audioFeatures.liveness,
        speechiness: audioFeatures.speechiness,
        tempo: audioFeatures.tempo,
        valence: audioFeatures.valence,
        popularity: track.popularity,
      },
    };
  }
  return null;
};
