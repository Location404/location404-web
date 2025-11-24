import { describe, it, expect } from 'vitest'
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  UserStore,
  UserProfile,
  UpdateUserProfileRequest,
  Coordinate,
} from '@/types'

describe('Type Definitions', () => {
  describe('Auth Types', () => {
    it('should accept valid RegisterRequest', () => {
      const request: RegisterRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }

      expect(request.username).toBe('testuser')
      expect(request.email).toBe('test@example.com')
      expect(request.password).toBe('password123')
    })

    it('should accept valid RegisterResponse', () => {
      const response: RegisterResponse = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
      }

      expect(response.id).toBe('user-123')
      expect(response.username).toBe('testuser')
    })

    it('should accept valid LoginRequest', () => {
      const request: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      }

      expect(request.email).toBe('test@example.com')
      expect(request.password).toBe('password123')
    })

    it('should accept valid LoginResponse', () => {
      const response: LoginResponse = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/image.jpg',
      }

      expect(response.userId).toBe('user-123')
      expect(response.profileImage).toBe('http://example.com/image.jpg')
    })

    it('should accept LoginResponse with null profileImage', () => {
      const response: LoginResponse = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: null,
      }

      expect(response.profileImage).toBeNull()
    })

    it('should accept valid UserStore', () => {
      const userStore: UserStore = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/image.jpg',
      }

      expect(userStore.userId).toBe('user-123')
    })

    it('should accept UserStore with null profileImage', () => {
      const userStore: UserStore = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: null,
      }

      expect(userStore.profileImage).toBeNull()
    })
  })

  describe('User Types', () => {
    it('should accept valid UserProfile', () => {
      const profile: UserProfile = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'http://example.com/image.jpg',
      }

      expect(profile.id).toBe('user-123')
      expect(profile.username).toBe('testuser')
    })

    it('should accept valid UpdateUserProfileRequest', () => {
      const request: UpdateUserProfileRequest = {
        id: 'user-123',
        username: 'newusername',
        email: 'new@example.com',
        password: 'newpassword',
        profileImage: null,
      }

      expect(request.id).toBe('user-123')
      expect(request.password).toBe('newpassword')
    })

    it('should accept UpdateUserProfileRequest without password', () => {
      const request: UpdateUserProfileRequest = {
        id: 'user-123',
        username: 'newusername',
        email: 'new@example.com',
      }

      expect(request.password).toBeUndefined()
    })

    it('should accept UpdateUserProfileRequest without profileImage', () => {
      const request: UpdateUserProfileRequest = {
        id: 'user-123',
        username: 'newusername',
        email: 'new@example.com',
      }

      expect(request.profileImage).toBeUndefined()
    })
  })

  describe('Game Types', () => {
    it('should accept valid Coordinate', () => {
      const coord: Coordinate = {
        x: 45.5,
        y: -73.6,
      }

      expect(coord.x).toBe(45.5)
      expect(coord.y).toBe(-73.6)
    })

    it('should accept Coordinate with zero values', () => {
      const coord: Coordinate = {
        x: 0,
        y: 0,
      }

      expect(coord.x).toBe(0)
      expect(coord.y).toBe(0)
    })

    it('should accept Coordinate with negative values', () => {
      const coord: Coordinate = {
        x: -45.5,
        y: -73.6,
      }

      expect(coord.x).toBe(-45.5)
      expect(coord.y).toBe(-73.6)
    })

    it('should accept Coordinate with max latitude', () => {
      const coord: Coordinate = {
        x: 90,
        y: 0,
      }

      expect(coord.x).toBe(90)
    })

    it('should accept Coordinate with max longitude', () => {
      const coord: Coordinate = {
        x: 0,
        y: 180,
      }

      expect(coord.y).toBe(180)
    })

    it('should accept Coordinate with min latitude', () => {
      const coord: Coordinate = {
        x: -90,
        y: 0,
      }

      expect(coord.x).toBe(-90)
    })

    it('should accept Coordinate with min longitude', () => {
      const coord: Coordinate = {
        x: 0,
        y: -180,
      }

      expect(coord.y).toBe(-180)
    })
  })

  describe('Type Consistency', () => {
    it('should have consistent userId field between UserStore and LoginResponse', () => {
      const loginResponse: LoginResponse = {
        userId: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: null,
      }

      const userStore: UserStore = {
        userId: loginResponse.userId,
        username: loginResponse.username,
        email: loginResponse.email,
        profileImage: loginResponse.profileImage,
      }

      expect(userStore.userId).toBe(loginResponse.userId)
    })

    it('should have consistent id field between RegisterResponse and UserProfile', () => {
      const registerResponse: RegisterResponse = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
      }

      const profile: UserProfile = {
        id: registerResponse.id,
        username: registerResponse.username,
        email: registerResponse.email,
        profileImage: '',
      }

      expect(profile.id).toBe(registerResponse.id)
    })
  })
})
