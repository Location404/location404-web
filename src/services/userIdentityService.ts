import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  
  if (import.meta.env.DEV) {
    console.log('Development mode: using proxy /api')
    return '/api'
  }
  
  if (apiUrl) {
    console.log('Production mode: using', apiUrl + '/api')
    return apiUrl + '/api'
  }
  
  console.warn('VITE_API_BASE_URL not set, using /api')
  return '/api'
}

const useridentity = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 10000,
})

useridentity.interceptors.request.use(
  (config: any) => {
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

useridentity.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message)
    return Promise.reject(error)
  }
)

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  username: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: string
  username: string
  email: string
  profileImage: string | null
}

export interface UserProfile {
  id: string
  username?: string
  email?: string
  password?: string
  profileImage?: string
}

export interface UpdateUserProfileRequest {
  username: string
  email: string
  password?: string
  profileImage?: File | null
}

export const useUserIdentityService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await useridentity.post('users', data)
    return response.data
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await useridentity.post('auth/login', data).then(res => {
      useAuthStore().login({
        email: res.data.email,
        userId: res.data.userId,
        username: res.data.username,
        profileImage: res.data.profileImage
      })

      return res.data
    })

    return response
  },

  async getUserProfile(): Promise<UserProfile> {
    const response = await useridentity.get('users/me')
    console.log('Fetched user profile:', response.data)
    return response.data
  },

  async updateUserProfile(data: any): Promise<UserProfile> {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('profileImage', data.profileImage)

    const response = await useridentity.patchForm(`users/${useAuthStore().userStore?.userId}`, formData)
    console.log('Updated user profile:', response.data)
    return response.data
  },

  async updateUserImageProfile(imageFile: File): Promise<void> {
    const formData = new FormData()
    formData.append('profileImage', imageFile)

    await useridentity.postForm(`users/${useAuthStore().userStore?.userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}