export interface WindowWithPlayer extends Window {
  onSpotifyWebPlaybackSDKReady: () => null | undefined;
  Spotify: any;
}

(window as unknown as WindowWithPlayer).onSpotifyWebPlaybackSDKReady = () => null;

export const waitForSpotifyWebPlaybackSDKToLoad = async () => new Promise((resolve) => {
  if ((window as unknown as WindowWithPlayer).Spotify) {
    resolve((window as unknown as WindowWithPlayer).Spotify);
  } else {
    ((window as unknown as WindowWithPlayer).onSpotifyWebPlaybackSDKReady as () => void) = () => {
      resolve((window as unknown as WindowWithPlayer).Spotify);
    };
  }
});

export const waitUntilUserHasSelectedPlayer = async (sdk: any) => new Promise((resolve) => {
  const interval = setInterval(async () => {
    const state = await sdk.getCurrentState();
    if (state !== null) {
      resolve(state);
      clearInterval(interval);
    }
  });
});
