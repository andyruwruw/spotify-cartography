export interface WindowWithPlayer extends Window {
  onSpotifyWebPlaybackSDKReady: () => null | undefined;
  Spotify: any;
  setPlayer: (player: any) => void;
}

/**
 * Run when Spotify Web Playback SDK is ready.
 */
(window as unknown as WindowWithPlayer).onSpotifyWebPlaybackSDKReady = () => null;

/**
 * Run when Spotify Web Playback SDK is loading.
 *
 * @returns {Promise<SpotifyWebPlaybackSDKLoadResolution>}
 */
export const waitForSpotifyWebPlaybackSDKToLoad = async () => new Promise((resolve) => {
  if ((window as unknown as WindowWithPlayer).Spotify) {
    resolve((window as unknown as WindowWithPlayer).Spotify);
  } else {
    ((window as unknown as WindowWithPlayer).onSpotifyWebPlaybackSDKReady as () => void) = () => {
      resolve((window as unknown as WindowWithPlayer).Spotify);
    };
  }
});

/**
 * Run when waiting for user to transfer playback.
 *
 * @param sdk
 * @returns
 */
export const waitUntilUserHasSelectedPlayer = async (sdk: any) => new Promise((resolve) => {
  const interval = setInterval(async () => {
    const state = await sdk.getCurrentState();
    if (state !== null) {
      resolve(state);
      clearInterval(interval);
    }
  });
});

/**
 * Sets Player as web player.
 *
 * @param player
 */
export const setPlayer = (player: any): void => {
  (window as unknown as WindowWithPlayer).setPlayer(player);
};
