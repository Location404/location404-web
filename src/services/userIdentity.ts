import axios from 'axios'

const useridentity = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

useridentity.interceptors.request.use(
  (config) => {
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

// useridentity.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     // Tratamento global de erros
//     if (error.response?.status === 401) {
//       // Token expirado ou inválido
//       localStorage.removeItem('auth_token')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )


export interface RegisterRequest{
  username: string  
  email: string
  password: string
}

export interface RegisterResponse{
  id: string,
  username: string,
  email: string,
}

export interface LoginRequest{
  email: string
  password: string
}

export interface LoginResponse{
  accessToken: string
  refreshToken: string
  refreshTokenExpiresAt: Date
  tokenType: string
  refreshTokenExpiresInSeconds: number
}

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await useridentity.post('users', data)
      return response.data
    } catch (error: any) {
      throw error
    }
    finally {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },

  async login(data: LoginRequest): Promise<LoginResponse> { 
    try {
      const response = await useridentity.post('auth/login', data)
      setTokenAndRefreshToken(response.data)
      return response.data;
    } catch (error: any) {
      throw error
    }
  },
}

function setTokenAndRefreshToken(response: LoginResponse) {
  localStorage.setItem('auth_token', response.accessToken)
  localStorage.setItem('refresh_token', response.refreshToken)
  localStorage.setItem('refresh_token_expires_at', response.refreshTokenExpiresAt.toString())
}

export default useridentity

