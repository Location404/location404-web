/**
 * User Identity Service
 * Handles authentication and user profile management
 */

import type { AxiosInstance } from 'axios'
import { apiClients } from '@/config/axios.config'
import { useAuthStore } from '@/stores/auth'
import type {
  IUserIdentityService,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
  UpdateUserProfileRequest,
} from '@/types'

export class UserIdentityService implements IUserIdentityService {
  private readonly client: AxiosInstance

  constructor() {
    this.client = apiClients.auth
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>('users', data)
    return response.data
  }

  /**
   * Login user and update auth store
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('auth/login', data)

    // Update auth store
    const authStore = useAuthStore()
    await authStore.login({
      email: response.data.email,
      userId: response.data.userId,
      username: response.data.username,
      profileImage: response.data.profileImage,
    })

    return response.data
  }

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>('users/me')
    console.log('Fetched user profile:', response.data)
    return response.data
  }

  /**
   * Get multiple users profiles (batch)
   */
  async getUsersProfiles(userIds: string[]): Promise<Array<{ id: string; username: string; profileImage: string }>> {
    const response = await this.client.post<Array<{ id: string; username: string; profileImage: string }>>('users/profiles', {
      userIds
    })
    return response.data
  }

  /**
   * Update user profile
   */
  async updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile> {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('email', data.email)

    if (data.password) {
      formData.append('password', data.password)
    }

    if (data.profileImage) {
      formData.append('profileImage', data.profileImage)
    }

    const authStore = useAuthStore()
    const userId = authStore.userStore?.userId

    if (!userId) {
      throw new Error('User not authenticated')
    }

    const response = await this.client.patchForm<UserProfile>(`users/${userId}`, formData)
    console.log('Updated user profile:', response.data)
    return response.data
  }

  /**
   * Update user profile image
   */
  async updateUserImageProfile(imageFile: File): Promise<void> {
    const formData = new FormData()
    formData.append('profileImage', imageFile)

    const authStore = useAuthStore()
    const userId = authStore.userStore?.userId

    if (!userId) {
      throw new Error('User not authenticated')
    }

    await this.client.postForm(`users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}
