import {
  Response,
  spotifyApi,
} from './request';

/**
 * Plays a track.
 *
 * @param {string} id Id of the song to play.
 * @returns {Promise<Response<void>>}
 */
const playSong = async (id: string): Promise<Response<void>> => spotifyApi.play({
  uris: [`spotify:track:${id}`],
});

/**
 * Pauses the current playback.
 *
 * @returns {Promise<Response<void>>}
 */
const pause = async (): Promise<Response<void>> => spotifyApi.pause();

/**
 * Sets volume for current playback.
 *
 * @param {number} volume Volume percent to be set.
 * @returns {Promise<Response<void>>}
 */
const setVolume = async (volume: number): Promise<Response<void>> => spotifyApi.setVolume(volume);

/**
 * Transfer the current playback to a device.
 *
 * @param {string[]} deviceIds Ids of the devices to transfer the playback to.
 * @param {boolean} play Whether to start playing after the transfer.
 * @returns {Promise<Response<void>>}
 */
const transferUsersPlayback = async (
  deviceIds: string[],
  play: boolean,
): Promise<Response<void>> => spotifyApi.transferMyPlayback(
  deviceIds,
  { play },
);

export default {
  pause,
  playSong,
  transferUsersPlayback,
};
