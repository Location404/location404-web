import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
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

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
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
    async (error) => {
      const originalRequest = error.config as RetryConfig

      const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh']
      const isAuthEndpoint = authEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      )

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => {
              return client.request(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          await axios.post(
            `${getBaseURL(ApiService.AUTH)}/auth/refresh`,
            {},
            { withCredentials: true }
          )

          processQueue(null)
          isRefreshing = false

          return client.request(originalRequest)
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError)
          processQueue(refreshError as Error)
          isRefreshing = false

          const { useAuthStore } = await import('@/stores/auth')
          const authStore = useAuthStore()
          authStore.logout()

          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }

          return Promise.reject(refreshError)
        }
      }

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
