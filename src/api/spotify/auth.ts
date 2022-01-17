import {
  REDIRECT_URL,
  SCOPES,
  SPOTIFY_BASE_AUTH_URL,
  SPOTIFY_CLIENT_ID,
  STATE,
} from '@/config';
import { spotifyApi } from './request';

// eslint-disable-next-line max-len
const getAuthorizeUrl = (): string => `${SPOTIFY_BASE_AUTH_URL}?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&scope=${SCOPES.join('%20')}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&state=${STATE}`;

/**
 * Sets the access token.
 *
 * @param {string} accessToken Access token to set.
 * @returns {void}
 */
const setAccessToken = (accessToken: string): void => spotifyApi.setAccessToken(accessToken);

export default {
  getAuthorizeUrl,
  setAccessToken,
};
