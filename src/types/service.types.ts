/**
 * Service interfaces and types
 */

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from './auth.types'
import type { UserProfile, UpdateUserProfileRequest } from './user.types'

/**
 * User Identity Service Interface
 */
export interface IUserIdentityService {
  register(data: RegisterRequest): Promise<RegisterResponse>
  login(data: LoginRequest): Promise<LoginResponse>
  getUserProfile(): Promise<UserProfile>
  updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile>
  updateUserImageProfile(imageFile: File): Promise<void>
}

/**
 * Game Engine Service Interface
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGameEngineService {
  // To be implemented when game engine is ready
}

/**
 * Service injection tokens
 */
export const SERVICE_TOKENS = {
  USER_IDENTITY: Symbol('IUserIdentityService'),
  GAME_ENGINE: Symbol('IGameEngineService'),
} as const
