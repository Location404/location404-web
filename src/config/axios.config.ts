import axios, { type AxiosInstance } from 'axios'
import { API_CONSTANTS } from './constants'
import { runtimeConfig } from './runtime.config'

export enum ApiService {
  AUTH = 'AUTH',
  GAME = 'GAME',
  DATA = 'DATA',
}

const SERVICE_CONFIG = {
  [ApiService.AUTH]: {
    getter: () => runtimeConfig.authApi,
    basePath: API_CONSTANTS.AUTH_PATH,
  },
  [ApiService.GAME]: {
    getter: () => runtimeConfig.gameApi,
    basePath: API_CONSTANTS.GAME_PATH,
  },
  [ApiService.DATA]: {
    getter: () => runtimeConfig.dataApi,
    basePath: API_CONSTANTS.DATA_PATH,
  },
} as const

export const getBaseURL = (service: ApiService): string => {
  const config = SERVICE_CONFIG[service]
  const apiUrl = config.getter()

  if (!apiUrl) {
    return config.basePath
  }

  return apiUrl + config.basePath
}

export const createApiClient = (service: ApiService): AxiosInstance => {
  const client = axios.create({
    baseURL: getBaseURL(service),
    withCredentials: true,
    timeout: API_CONSTANTS.TIMEOUT,
  })

  client.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      console.error(`[${service}] Request Error:`, error)
      return Promise.reject(error)
    }
  )

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

export const apiClients = {
  auth: createApiClient(ApiService.AUTH),
  game: createApiClient(ApiService.GAME),
  data: createApiClient(ApiService.DATA),
} as const
