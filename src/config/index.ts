import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV || 'development';

export const REDIRECT_URL = ENVIRONMENT == 'development' ? 'http://localhost:8080/callback' : '';

export const STATE = uuidv4();

export const SCOPES = [

];

export const MARKET = 'US';
