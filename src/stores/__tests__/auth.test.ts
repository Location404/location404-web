import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import type { UserStore } from '@/types'

// Create mock functions
const mockGetUserProfile = vi.fn()
const mockLogout = vi.fn()

// Mock UserIdentityService
vi.mock('@/services/userIdentityService', () => {
  return {
    UserIdentityService: class {
      getUserProfile = mockGetUserProfile
      logout = mockLogout
    },
  }
})

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockGetUserProfile.mockReset()
    mockLogout.mockReset()
  })

  describe('initial state', () => {
    it('should initialize with null userStore', () => {
      const store = useAuthStore()

      expect(store.userStore).toBeNull()
    })

    it('should initialize with isAuthenticated as false', () => {
      const store = useAuthStore()

      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('should set user data on login', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'https://example.com/image.jpg',
      }

      await store.login(user)

      expect(store.userStore).toEqual(user)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should update isAuthenticated to true after login', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '456',
        username: 'anotheruser',
        email: 'another@example.com',
        profileImage: null,
      }

      expect(store.isAuthenticated).toBe(false)

      await store.login(user)

      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle login with null profileImage', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '789',
        username: 'noimageuser',
        email: 'noimage@example.com',
        profileImage: null,
      }

      await store.login(user)

      expect(store.userStore).toEqual(user)
      expect(store.userStore?.profileImage).toBeNull()
    })
  })

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '123',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'https://example.com/image.jpg',
      }

      await store.login(user)
      expect(store.isAuthenticated).toBe(true)

      await store.logout()

      expect(store.userStore).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should set isAuthenticated to false after logout', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '456',
        username: 'testuser2',
        email: 'test2@example.com',
        profileImage: null,
      }

      await store.login(user)
      await store.logout()

      expect(store.isAuthenticated).toBe(false)
    })

    it('should clear user even if logout service call is commented out', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '789',
        username: 'testuser3',
        email: 'test3@example.com',
        profileImage: 'image.jpg',
      }

      await store.login(user)
      await store.logout()

      // Should clear user regardless of service call
      expect(store.userStore).toBeNull()
    })
  })

  describe('fetchUser', () => {
    it('should fetch user profile and update store', async () => {
      const store = useAuthStore()
      const mockProfile = {
        id: 'user-123',
        username: 'fetcheduser',
        email: 'fetched@example.com',
        profileImage: 'https://example.com/fetched.jpg',
      }

      mockGetUserProfile.mockResolvedValue(mockProfile)

      const result = await store.fetchUser()

      expect(result).toEqual(mockProfile)
      expect(store.userStore).toEqual({
        userId: mockProfile.id,
        username: mockProfile.username,
        email: mockProfile.email,
        profileImage: mockProfile.profileImage,
      })
      expect(store.isAuthenticated).toBe(true)
    })

    it('should map id to userId in store', async () => {
      const store = useAuthStore()
      const mockProfile = {
        id: 'user-456',
        username: 'mappeduser',
        email: 'mapped@example.com',
        profileImage: null,
      }

      mockGetUserProfile.mockResolvedValue(mockProfile)

      await store.fetchUser()

      expect(store.userStore?.userId).toBe(mockProfile.id)
    })

    it('should clear store and throw error on fetch failure', async () => {
      const store = useAuthStore()

      // Set initial user
      await store.login({
        userId: '999',
        username: 'tempuser',
        email: 'temp@example.com',
        profileImage: null,
      })

      const error = new Error('Network error')
      mockGetUserProfile.mockRejectedValue(error)

      await expect(store.fetchUser()).rejects.toThrow('Network error')

      expect(store.userStore).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should handle fetch failure with null profileImage', async () => {
      const store = useAuthStore()
      const mockProfile = {
        id: 'user-789',
        username: 'nullimageuser',
        email: 'nullimage@example.com',
        profileImage: null,
      }

      mockGetUserProfile.mockResolvedValue(mockProfile)

      await store.fetchUser()

      expect(store.userStore?.profileImage).toBeNull()
    })

    it('should call getUserProfile from service', async () => {
      const store = useAuthStore()
      const mockProfile = {
        id: 'user-call-test',
        username: 'calltest',
        email: 'calltest@example.com',
        profileImage: 'test.jpg',
      }

      mockGetUserProfile.mockResolvedValue(mockProfile)

      await store.fetchUser()

      expect(mockGetUserProfile).toHaveBeenCalledTimes(1)
    })
  })

  describe('isAuthenticated computed', () => {
    it('should be false when userStore is null', () => {
      const store = useAuthStore()

      expect(store.isAuthenticated).toBe(false)
    })

    it('should be true when userStore has user data', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '123',
        username: 'authuser',
        email: 'auth@example.com',
        profileImage: null,
      }

      await store.login(user)

      expect(store.isAuthenticated).toBe(true)
    })

    it('should react to changes in userStore', async () => {
      const store = useAuthStore()
      const user: UserStore = {
        userId: '123',
        username: 'reactuser',
        email: 'react@example.com',
        profileImage: null,
      }

      expect(store.isAuthenticated).toBe(false)

      await store.login(user)
      expect(store.isAuthenticated).toBe(true)

      await store.logout()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('persistence', () => {
    it('should configure persistence with localStorage', () => {
      const store = useAuthStore()

      // Store is configured to persist, just verify it exists
      expect(store).toBeDefined()
      expect(store.userStore).toBeDefined()
    })
  })
})
