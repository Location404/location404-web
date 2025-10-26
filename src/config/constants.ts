/**
 * Application constants
 */

export const API_CONSTANTS = {
  TIMEOUT: 10000,
  USER_IDENTITY_PATH: '/useridentityapi',
  GAME_ENGINE_PATH: '/gameengineapi',
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
  USER_IDENTITY_API: 'VITE_USER_IDENTITY_API',
  GAME_ENGINE_API: 'VITE_GAME_ENGINE_API',
} as const
