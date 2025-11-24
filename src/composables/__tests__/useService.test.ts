import { describe, it, expect, beforeEach } from 'vitest'
import { useUserIdentityService, useGameEngineService } from '../useService'
import { container } from '@/core/container'
import { SERVICE_TOKENS } from '@/types/service.types'

describe('useService', () => {
  // Mock services
  class MockUserIdentityService {
    getUserProfile() {
      return Promise.resolve({
        id: 'test-id',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'image.jpg',
      })
    }
  }

  class MockGameEngineService {
    connect() {
      return Promise.resolve()
    }
  }

  beforeEach(() => {
    container.clear()
    container.registerSingleton(
      SERVICE_TOKENS.USER_IDENTITY,
      () => new MockUserIdentityService()
    )
    container.registerSingleton(
      SERVICE_TOKENS.GAME_ENGINE,
      () => new MockGameEngineService()
    )
  })

  describe('useUserIdentityService', () => {
    it('should return user identity service instance', () => {
      const service = useUserIdentityService()

      expect(service).toBeInstanceOf(MockUserIdentityService)
    })

    it('should return same instance on multiple calls', () => {
      const service1 = useUserIdentityService()
      const service2 = useUserIdentityService()

      expect(service1).toBe(service2)
    })

    it('should have getUserProfile method', () => {
      const service = useUserIdentityService()

      expect(service.getUserProfile).toBeDefined()
      expect(typeof service.getUserProfile).toBe('function')
    })

    it('should be able to call service methods', async () => {
      const service = useUserIdentityService()

      const result = await service.getUserProfile()

      expect(result).toEqual({
        id: 'test-id',
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'image.jpg',
      })
    })
  })

  describe('useGameEngineService', () => {
    it('should return game engine service instance', () => {
      const service = useGameEngineService()

      expect(service).toBeInstanceOf(MockGameEngineService)
    })

    it('should return same instance on multiple calls', () => {
      const service1 = useGameEngineService()
      const service2 = useGameEngineService()

      expect(service1).toBe(service2)
    })

    it('should have connect method', () => {
      const service = useGameEngineService()

      expect(service.connect).toBeDefined()
      expect(typeof service.connect).toBe('function')
    })

    it('should be able to call service methods', async () => {
      const service = useGameEngineService()

      await expect(service.connect()).resolves.toBeUndefined()
    })
  })

  describe('Service Resolution', () => {
    it('should resolve different services independently', () => {
      const userService = useUserIdentityService()
      const gameService = useGameEngineService()

      expect(userService).not.toBe(gameService)
      expect(userService).toBeInstanceOf(MockUserIdentityService)
      expect(gameService).toBeInstanceOf(MockGameEngineService)
    })

    it('should maintain singleton pattern', () => {
      const user1 = useUserIdentityService()
      const game1 = useGameEngineService()
      const user2 = useUserIdentityService()
      const game2 = useGameEngineService()

      expect(user1).toBe(user2)
      expect(game1).toBe(game2)
    })
  })

  describe('Error Handling', () => {
    it('should throw error when service not registered', () => {
      container.clear()

      expect(() => useUserIdentityService()).toThrow('Service not found')
    })

    it('should throw error when game service not registered', () => {
      container.clear()

      expect(() => useGameEngineService()).toThrow('Service not found')
    })
  })
})
