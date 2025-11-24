import { describe, it, expect, beforeEach, vi } from 'vitest'
import { registerServices, bootstrapServices } from '../service-registration'
import { container } from '../container'
import { SERVICE_TOKENS } from '@/types/service.types'

// Mock services
vi.mock('@/services/userIdentityService', () => ({
  UserIdentityService: class {
    getUserProfile = vi.fn()
    logout = vi.fn()
  },
}))

vi.mock('@/services/gameEngineService', () => ({
  GameEngineService: class {
    connect = vi.fn()
    disconnect = vi.fn()
  },
}))

describe('Service Registration', () => {
  beforeEach(() => {
    container.clear()
    vi.clearAllMocks()
  })

  describe('registerServices', () => {
    it('should register user identity service', () => {
      registerServices()

      expect(container.has(SERVICE_TOKENS.USER_IDENTITY)).toBe(true)
    })

    it('should register game engine service', () => {
      registerServices()

      expect(container.has(SERVICE_TOKENS.GAME_ENGINE)).toBe(true)
    })

    it('should register services as singletons', () => {
      registerServices()

      const userService1 = container.resolve(SERVICE_TOKENS.USER_IDENTITY)
      const userService2 = container.resolve(SERVICE_TOKENS.USER_IDENTITY)

      expect(userService1).toBe(userService2)
    })

    it('should log success message', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      registerServices()

      expect(consoleSpy).toHaveBeenCalledWith('✅ All services registered successfully')

      consoleSpy.mockRestore()
    })

    it('should allow resolving user identity service', () => {
      registerServices()

      const service = container.resolve(SERVICE_TOKENS.USER_IDENTITY)

      expect(service).toBeDefined()
      expect(service.getUserProfile).toBeDefined()
    })

    it('should allow resolving game engine service', () => {
      registerServices()

      const service = container.resolve(SERVICE_TOKENS.GAME_ENGINE)

      expect(service).toBeDefined()
      expect(service.connect).toBeDefined()
    })

    it('should register both services in single call', () => {
      registerServices()

      expect(container.has(SERVICE_TOKENS.USER_IDENTITY)).toBe(true)
      expect(container.has(SERVICE_TOKENS.GAME_ENGINE)).toBe(true)
    })
  })

  describe('bootstrapServices', () => {
    it('should call registerServices', () => {
      bootstrapServices()

      expect(container.has(SERVICE_TOKENS.USER_IDENTITY)).toBe(true)
      expect(container.has(SERVICE_TOKENS.GAME_ENGINE)).toBe(true)
    })

    it('should be idempotent', () => {
      bootstrapServices()
      const service1 = container.resolve(SERVICE_TOKENS.USER_IDENTITY)

      bootstrapServices()
      const service2 = container.resolve(SERVICE_TOKENS.USER_IDENTITY)

      // Services should be the same since they are singletons
      expect(service1).toBe(service2)
    })

    it('should complete successfully', () => {
      expect(() => bootstrapServices()).not.toThrow()
    })

    it('should log success message', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      bootstrapServices()

      expect(consoleSpy).toHaveBeenCalledWith('✅ All services registered successfully')

      consoleSpy.mockRestore()
    })
  })

  describe('Integration', () => {
    it('should allow service resolution after bootstrap', () => {
      bootstrapServices()

      const userService = container.resolve(SERVICE_TOKENS.USER_IDENTITY)
      const gameService = container.resolve(SERVICE_TOKENS.GAME_ENGINE)

      expect(userService).toBeDefined()
      expect(gameService).toBeDefined()
    })

    it('should maintain singleton pattern across multiple resolves', () => {
      bootstrapServices()

      const user1 = container.resolve(SERVICE_TOKENS.USER_IDENTITY)
      const user2 = container.resolve(SERVICE_TOKENS.USER_IDENTITY)
      const game1 = container.resolve(SERVICE_TOKENS.GAME_ENGINE)
      const game2 = container.resolve(SERVICE_TOKENS.GAME_ENGINE)

      expect(user1).toBe(user2)
      expect(game1).toBe(game2)
    })

    it('should work after container clear and re-registration', () => {
      bootstrapServices()
      container.clear()
      bootstrapServices()

      expect(container.has(SERVICE_TOKENS.USER_IDENTITY)).toBe(true)
      expect(container.has(SERVICE_TOKENS.GAME_ENGINE)).toBe(true)
    })
  })
})
