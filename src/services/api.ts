import axios from 'axios'

// Configuração base do Axios
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Tratamento global de erros
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Interfaces para tipagem
export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// Serviços de autenticação
export const authService = {
  async register(data: RegisterData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error: any) {
      throw error
    }
    finally {
      // time out para simular loading
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },

  async login(data: LoginData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/login', data)
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  async getProfile(): Promise<ApiResponse> {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error: any) {
      throw error
    }
  }
}

export default api

