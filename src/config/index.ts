/* eslint-disable prefer-destructuring */
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const ENVIRONMENT = process.env.VUE_APP_NODE_ENV || 'development';

export const SPOTIFY_CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;

export const SPOTIFY_BASE_AUTH_URL = 'https://accounts.spotify.com/authorize';

export const REDIRECT_URL = ENVIRONMENT === 'development' ? 'http://localhost:8080/callback' : 'https://spotify-cartography.vercel.app/callback';

export const STATE = uuidv4();

export const SCOPES = [
  'streaming',
  'user-library-read',
  'user-top-read',
  'user-read-email',
  'user-read-private',
];

export const MARKET = 'US';
