/**
 * User profile related types
 */

export interface UserProfile {
  id: string
  username?: string
  email?: string
  password?: string
  profileImage?: string
}

export interface UpdateUserProfileRequest {
  id: string
  username: string
  email: string
  password?: string
  profileImage?: File | null
}
