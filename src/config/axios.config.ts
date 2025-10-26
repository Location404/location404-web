/**
 * Axios HTTP client configuration for multiple services
 */

import axios, { type AxiosInstance } from 'axios'
import { API_CONSTANTS, ENV_KEYS } from './constants'

/**
 * Service type enum
 */
export enum ApiService {
  USER_IDENTITY = 'USER_IDENTITY',
  GAME_ENGINE = 'GAME_ENGINE',
}

/**
 * Configuration for each API service
 */
const SERVICE_CONFIG = {
  [ApiService.USER_IDENTITY]: {
    envKey: ENV_KEYS.USER_IDENTITY_API,
    basePath: API_CONSTANTS.USER_IDENTITY_PATH,
  },
  [ApiService.GAME_ENGINE]: {
    envKey: ENV_KEYS.GAME_ENGINE_API,
    basePath: API_CONSTANTS.GAME_ENGINE_PATH,
  },
} as const

/**
 * Get the base URL for a specific API service based on environment
 */
export const getBaseURL = (service: ApiService): string => {
  const config = SERVICE_CONFIG[service]
  const apiUrl = import.meta.env[config.envKey]

  if (import.meta.env.DEV) {
    return config.basePath
  }

  if (apiUrl) {
    const fullUrl = apiUrl + config.basePath
    return fullUrl
  }

  console.warn(`${service} - ${config.envKey} not set, using ${config.basePath}`)
  return config.basePath
}

/**
 * Create and configure an Axios instance for any API service
 */
export const createApiClient = (service: ApiService): AxiosInstance => {
  const client = axios.create({
    baseURL: getBaseURL(service),
    withCredentials: true,
    timeout: API_CONSTANTS.TIMEOUT,
  })

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      console.error(`[${service}] Request Error:`, error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.error(
        `[${service}] API Error:`,
        error.response?.status,
        error.config?.url,
        error.message
      )
      return Promise.reject(error)
    }
  )

  return client
}

/**
 * Pre-configured axios instances for each service
 */
export const apiClients = {
  userIdentity: createApiClient(ApiService.USER_IDENTITY),
  gameEngine: createApiClient(ApiService.GAME_ENGINE),
} as const
