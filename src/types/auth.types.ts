/**
 * Authentication related types
 */

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

export interface UserStore {
  userId: string
  username: string
  email: string
  profileImage: string | null
}
