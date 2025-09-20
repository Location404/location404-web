import axios from 'axios'
import router from '@/router'
import { computed } from 'vue'
import { authStore } from '@/stores/auth'

const useridentity = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const accessToken = computed(() => authStore().getAccessToken())

useridentity.interceptors.request.use(
  (config) => {
    if (accessToken.value !== null) {
      config.headers.Authorization = `Bearer ${accessToken.value}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

useridentity.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true
      try {
        const refreshResponse = await useridentity.post('/auth/refresh-token')
        const newAccessToken = refreshResponse.data.accessToken

        authStore().setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return useridentity(originalRequest)
      } catch (refreshError) {
        
        authStore().logout()
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  id: string,
  username: string,
  email: string,
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: string
  accessToken: string
  refreshToken: string
  username: string
  email: string
}

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await useridentity.post('users', data)
    return response.data
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await useridentity.post('auth/login', data)
    return response.data
  },
}