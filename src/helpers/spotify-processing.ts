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

/**
 * Retrieves number of saved tracks in user's library.
 *
 * @returns {Promise<number>}
 */
export const getNumberSavedTracks = async () => {
  const response = await api.spotify.library.getSavedTracks(0, 1);

  return response.body.total;
};

/**
 * Retrieves user's saved tracks on offset and condenses objects.
 *
 * @param {number} offset Where to start retrieving tracks.
 * @returns {Promise<CondensedSavedTrack[]>}
 */
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

/**
 * Retrieve's track audio features.
 *
 * @param {SpotifyApi.TrackObjectFull[]} tracks Track objects.
 * @returns {Promise<TrackAudioFeatures[]>}
 */
export const getTracksAudioFeatures = async (tracks: SpotifyApi.TrackObjectFull[]) => {
  const ids = tracks.map((track) => track.id);

  const response = await api.spotify.tracks.getTracksAudioFeatures(ids);

  return response.body.audio_features;
};

const canConvertTrack = (
  track: CondensedSavedTrack,
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
 * Converts tracks to a format that can be used for clustering.
 *
 * @param {Record<string, Track>} tracks Track objects converted to be added to.
 * @param {CondensedSavedTrack[]} savedTracks Track objects to be converted.
 * @param {SpotifyApi.AudioFeaturesObject[]} audioFeatures Track audio feature data to be converted.
 * @param {number} index Offset of track's to be added
 * @param {number} last Last track added date so far.
 * @param {number} first First track added date so far.
 * @returns {Promise<Record<string, number>>}
 */
export const convertTracks = async (
  tracks: Record<string, Track>,
  savedTracks: CondensedSavedTrack[],
  audioFeatures: SpotifyApi.AudioFeaturesObject[],
  index: number,
  last: number,
  first: number,
): Promise<Record<string, number>> => {
  const sample: Track[] = [];

  let newLast = last;
  let newFirst = first;

  for (let i = 0; i < savedTracks.length; i += 1) {
    if (canConvertTrack(savedTracks[i], audioFeatures[i])) {
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
