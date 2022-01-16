import api from '@/api';
import { AUDIO_FEATURE_MEDIANS } from '@/config';

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

/**
 * Alters value based on weight un-uniformly based on distance to median.
 *
 * @param {number} value Original value.
 * @param {number} weight Weight of value.
 * @param {number} median Approximate median of value distribution.
 * @returns {number} Number weighted by weight and distance to median.
 */
const getValueOffWeight = (
  value: number,
  weight: number,
  median: number,
): number => {
  if (weight === 1) {
    return value;
  } if (weight === 0) {
    return median;
  }

  const deviation = value - median; // -50

  const weightedDeviation = deviation * weight; // -10

  const distanceWeight = Math.abs(deviation) / median; // 1

  const inverseWeight = 1 - weight; // .8
  const finalDeviation = weightedDeviation + (weightedDeviation * distanceWeight * inverseWeight); // -10 + (-10 * 1 * .8)

  return median + finalDeviation;
};

/**
 * Generates the vectors based on track object.
 *
 * @param {Track} track Track object
 * @param {number} valenceWeight Weight of valence.
 * @param {number} energyWeight Weight of energy.
 * @param {number} danceabilityWeight Weight of danceability.
 * @param {number} acousticnessWeight Weight of acousticness.
 * @param {number} livenessWeight Weight of liveness.
 * @param {number} speechinessWeight Weight of speechiness.
 * @param {number} instrumentalnessWeight Weight of instrumentalness.
 * @param {number} tempoWeight Weight of tempo.
 * @param {number} popularityWeight Weight of popularity.
 * @returns {number[]} Vector of track values.
 */
export const generateVector = (
  track: Track,
  valenceWeight = 1,
  energyWeight = 1,
  danceabilityWeight = 1,
  acousticnessWeight = 1,
  livenessWeight = 1,
  speechinessWeight = 1,
  instrumentalnessWeight = 1,
  tempoWeight = 1,
  popularityWeight = 1,
) => ([
  getValueOffWeight(track.audioFeatures.valence, valenceWeight, AUDIO_FEATURE_MEDIANS.valence),
  getValueOffWeight(track.audioFeatures.energy, energyWeight, AUDIO_FEATURE_MEDIANS.energy),
  getValueOffWeight(track.audioFeatures.danceability, danceabilityWeight, AUDIO_FEATURE_MEDIANS.danceability),
  getValueOffWeight(track.audioFeatures.acousticness, acousticnessWeight, AUDIO_FEATURE_MEDIANS.acousticness),
  getValueOffWeight(track.audioFeatures.liveness, livenessWeight, AUDIO_FEATURE_MEDIANS.liveness),
  getValueOffWeight(track.audioFeatures.speechiness, speechinessWeight, AUDIO_FEATURE_MEDIANS.speechiness),
  getValueOffWeight(track.audioFeatures.instrumentalness, instrumentalnessWeight, AUDIO_FEATURE_MEDIANS.instrumentalness),
  getValueOffWeight(track.audioFeatures.tempo, tempoWeight, AUDIO_FEATURE_MEDIANS.tempo),
  getValueOffWeight(track.audioFeatures.popularity, popularityWeight, AUDIO_FEATURE_MEDIANS.popularity),
]);
