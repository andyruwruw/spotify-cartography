/* eslint-disable prefer-destructuring */
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

/**
 * Environment the session is running in, either 'development' or 'production'.
 * Determines redirect URL with Spotify.
 *
 * @type {string}
 */
export const ENVIRONMENT = process.env.VUE_APP_NODE_ENV || 'development';

/**
 * Spotify application client id.
 *
 * @type {string}
 */
export const SPOTIFY_CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;

/**
 * URL to authorize with Spotify.
 *
 * @type {string}
 */
export const SPOTIFY_BASE_AUTH_URL = 'https://accounts.spotify.com/authorize';

/**
 * URL to send the user to after they authorize the app.
 *
 * @type {string}
 */
export const REDIRECT_URL = ENVIRONMENT === 'development' ? 'http://localhost:8080/callback' : 'https://spotify-cartography.vercel.app/callback';

/**
 * State to pass to Spotify for authentication, unique to each session.
 * @type {string}
 */
export const STATE = uuidv4();

/**
 * Authorization scopes to request from Spotify.
 *
 * @type {string[]}
 */
export const SCOPES = [
  'streaming',
  'user-library-read',
  'user-top-read',
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
];

/**
 * Market to finds songs for.
 *
 * @type {string}
 */
export const MARKET = 'US';

/**
 * Element ID for Three.js canvas.
 *
 * @type {string}
 */
export const THREE_CONTAINER_ID = 'container';

/**
 * Static view distance for Three.js camera.
 *
 * @type {number}
 */
export const THREE_VIEW_DISTANCE = 10000;

/**
 * Background color for Three.js scene.
 *
 * @type {number}
 */
export const THREE_BACKGROUND_COLOR = 0x191927;

/**
 * Default color for Three.js material.
 *
 * @type {number}
 */
export const THREE_DEFAULT_MATERIAL_COLOR = 0xffffff;

/**
 * Values for Point Geometry.
 *
 * @type {Record<string, number>}
 */
export const POINT_GEOMETRY_DEFAULT_VALUES: Record<string, number> = {
  radius: 0.005,
  widthSegment: 3,
  heightSegment: 2,
};

/**
 * Default parameters for Three.js perspective camera.
 *
 * @type {Record<string, number>}
 */
export const PERSPECTIVE_CAMERA_DEFAULT_VALUES: Record<string, number> = {
  fov: 70,
  near: 0.01,
  far: THREE_VIEW_DISTANCE,
  x: 0,
  y: 0,
  z: 1,
};

/**
 * Default parameters for Three.js orthographic camera.
 *
 * @type {Record<string, number>}
 */
export const ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES: Record<string, number> = {
  leftDivisor: -2000,
  rightDivisor: 2000,
  topDivisor: 2000,
  bottomDivisor: -2000,
  near: 1,
  far: THREE_VIEW_DISTANCE,
  x: 0,
  y: 0,
  z: 5,
};

/**
 * Default parameters for Three.js orbit controls.
 */
export const ORBIT_CONTROLS_DEFAULT_VALUES: Record<string, number | boolean> = {
  enableDamping: true,
  dampingFactor: 0.25,
  enableZoom: true,
  maxDistance: 100,
  minDistance: 0.001,
};

/**
 * Types of requests.
 */
export const REQUEST_TYPE = {
  TOP_LISTENED: 'charts',
  LIKED_SONGS: 'liked',
  PLAYLISTS: 'playlists',
  ALBUMS: 'albums',
  ARTISTS: 'artists',
  NONE: 'none',
};

/**
 * Medians of audio feature distributions.
 */
export const AUDIO_FEATURE_MEDIANS = {
  valence: 0.5,
  energy: 0.5,
  danceability: 0.5,
  acousticness: 0.5,
  liveness: 0.5,
  speechiness: 0.5,
  instrumentalness: 0.5,
  tempo: 125,
  popularity: 50,
};
