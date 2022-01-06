export interface WindowWithPlayer extends Window {
  onSpotifyWebPlaybackSDKReady: Function;
  Spotify: any;
}

(window as unknown as WindowWithPlayer).onSpotifyWebPlaybackSDKReady = () => {};

export const waitForSpotifyWebPlaybackSDKToLoad = async () => {
  return new Promise((resolve) => {
    if ((window as unknown as WindowWithPlayer).Spotify) {
      resolve((window as unknown as WindowWithPlayer).Spotify);
    } else {
      (window as unknown as WindowWithPlayer).onSpotifyWebPlaybackSDKReady = () => {
        resolve((window as unknown as WindowWithPlayer).Spotify);
      };
    }
  });
};

export const waitUntilUserHasSelectedPlayer = async (sdk: any) => {
  return new Promise((resolve) => {
    let interval = setInterval(async () => {
      let state = await sdk.getCurrentState();
      if (state !== null) {
        resolve(state);
        clearInterval(interval);
      }
    });
  });
};
