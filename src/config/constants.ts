/**
 * Application constants
 */

export const API_CONSTANTS = {
  TIMEOUT: 10000,
  AUTH_PATH: '/api',
  GAME_PATH: '/api',
  DATA_PATH: '/api',
} as const

export const STORAGE_KEYS = {
  AUTH_STORE: 'auth',
} as const

export const ROUTE_NAMES = {
  LOGIN: 'login',
  REGISTER: 'register',
  PLAY: 'play',
  RANKING: 'ranking',
  CONFIG: 'config',
} as const

export const ROUTE_PATHS = {
  LOGIN: '/login',
  REGISTER: '/register',
  PLAY: '/play',
  RANKING: '/ranking',
  CONFIG: '/config',
} as const

export const ENV_KEYS = {
  AUTH_API: 'VITE_AUTH_API',
  GAME_API: 'VITE_GAME_API',
  DATA_API: 'VITE_DATA_API',
  GOOGLE_MAPS_API_KEY: 'VITE_GOOGLE_MAPS_API_KEY',
} as const
