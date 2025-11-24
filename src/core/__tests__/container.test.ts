import { describe, it, expect, beforeEach } from 'vitest'
import { container, inject } from '../container'

describe('Container', () => {
  // Test service classes
  class TestService {
    getValue() {
      return 'test-value'
    }
  }

  class AnotherService {
    getData() {
      return { data: 'test-data' }
    }
  }

  beforeEach(() => {
    container.clear()
  })

  describe('register', () => {
    it('should register a service with factory function', () => {
      const factory = () => new TestService()
      const identifier = Symbol('TestService')

      container.register(identifier, factory)

      expect(container.has(identifier)).toBe(true)
    })

    it('should resolve registered service', () => {
      const factory = () => new TestService()
      const identifier = Symbol('TestService')

      container.register(identifier, factory)
      const service = container.resolve<TestService>(identifier)

      expect(service).toBeInstanceOf(TestService)
      expect(service.getValue()).toBe('test-value')
    })

    it('should create new instance on each resolve', () => {
      const factory = () => new TestService()
      const identifier = Symbol('TestService')

      container.register(identifier, factory)

      const service1 = container.resolve<TestService>(identifier)
      const service2 = container.resolve<TestService>(identifier)

      expect(service1).not.toBe(service2)
    })

    it('should register multiple services', () => {
      const identifier1 = Symbol('TestService')
      const identifier2 = Symbol('AnotherService')

      container.register(identifier1, () => new TestService())
      container.register(identifier2, () => new AnotherService())

      expect(container.has(identifier1)).toBe(true)
      expect(container.has(identifier2)).toBe(true)
    })
  })

  describe('registerSingleton', () => {
    it('should register a singleton service', () => {
      const factory = () => new TestService()
      const identifier = Symbol('TestService')

      container.registerSingleton(identifier, factory)

      expect(container.has(identifier)).toBe(true)
    })

    it('should return same instance on multiple resolves', () => {
      const factory = () => new TestService()
      const identifier = Symbol('TestService')

      container.registerSingleton(identifier, factory)

      const service1 = container.resolve<TestService>(identifier)
      const service2 = container.resolve<TestService>(identifier)

      expect(service1).toBe(service2)
    })

    it('should call factory only once for singleton', () => {
      let callCount = 0
      const factory = () => {
        callCount++
        return new TestService()
      }
      const identifier = Symbol('TestService')

      container.registerSingleton(identifier, factory)
      container.resolve<TestService>(identifier)
      container.resolve<TestService>(identifier)
      container.resolve<TestService>(identifier)

      expect(callCount).toBe(1)
    })

    it('should not re-register singleton if already exists', () => {
      const factory1 = () => new TestService()
      const factory2 = () => new AnotherService()
      const identifier = Symbol('Service')

      container.registerSingleton(identifier, factory1)
      const service1 = container.resolve(identifier)

      container.registerSingleton(identifier, factory2)
      const service2 = container.resolve(identifier)

      expect(service1).toBe(service2)
      expect(service1).toBeInstanceOf(TestService)
    })
  })

  describe('registerClass', () => {
    it('should register a class constructor', () => {
      const identifier = Symbol('TestService')

      container.registerClass(identifier, TestService)

      expect(container.has(identifier)).toBe(true)
    })

    it('should resolve class instance', () => {
      const identifier = Symbol('TestService')

      container.registerClass(identifier, TestService)
      const service = container.resolve<TestService>(identifier)

      expect(service).toBeInstanceOf(TestService)
      expect(service.getValue()).toBe('test-value')
    })

    it('should create new instance on each resolve', () => {
      const identifier = Symbol('TestService')

      container.registerClass(identifier, TestService)

      const service1 = container.resolve<TestService>(identifier)
      const service2 = container.resolve<TestService>(identifier)

      expect(service1).not.toBe(service2)
    })

    it('should register multiple classes', () => {
      const identifier1 = Symbol('TestService')
      const identifier2 = Symbol('AnotherService')

      container.registerClass(identifier1, TestService)
      container.registerClass(identifier2, AnotherService)

      const service1 = container.resolve<TestService>(identifier1)
      const service2 = container.resolve<AnotherService>(identifier2)

      expect(service1).toBeInstanceOf(TestService)
      expect(service2).toBeInstanceOf(AnotherService)
    })
  })

  describe('resolve', () => {
    it('should throw error when service not found', () => {
      const identifier = Symbol('NonExistent')

      expect(() => container.resolve(identifier)).toThrow('Service not found')
    })

    it('should prioritize singleton over regular service', () => {
      const identifier = Symbol('TestService')
      const singletonInstance = new TestService()

      container.registerSingleton(identifier, () => singletonInstance)
      container.register(identifier, () => new TestService())

      const resolved = container.resolve<TestService>(identifier)

      expect(resolved).toBe(singletonInstance)
    })

    it('should resolve different services independently', () => {
      const id1 = Symbol('Service1')
      const id2 = Symbol('Service2')

      container.register(id1, () => new TestService())
      container.register(id2, () => new AnotherService())

      const service1 = container.resolve<TestService>(id1)
      const service2 = container.resolve<AnotherService>(id2)

      expect(service1).toBeInstanceOf(TestService)
      expect(service2).toBeInstanceOf(AnotherService)
    })
  })

  describe('has', () => {
    it('should return true for registered service', () => {
      const identifier = Symbol('TestService')

      container.register(identifier, () => new TestService())

      expect(container.has(identifier)).toBe(true)
    })

    it('should return true for registered singleton', () => {
      const identifier = Symbol('TestService')

      container.registerSingleton(identifier, () => new TestService())

      expect(container.has(identifier)).toBe(true)
    })

    it('should return false for non-existent service', () => {
      const identifier = Symbol('NonExistent')

      expect(container.has(identifier)).toBe(false)
    })

    it('should return false after clear', () => {
      const identifier = Symbol('TestService')

      container.register(identifier, () => new TestService())
      container.clear()

      expect(container.has(identifier)).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all registered services', () => {
      const id1 = Symbol('Service1')
      const id2 = Symbol('Service2')

      container.register(id1, () => new TestService())
      container.registerSingleton(id2, () => new AnotherService())

      container.clear()

      expect(container.has(id1)).toBe(false)
      expect(container.has(id2)).toBe(false)
    })

    it('should allow re-registration after clear', () => {
      const identifier = Symbol('TestService')

      container.register(identifier, () => new TestService())
      container.clear()
      container.register(identifier, () => new AnotherService())

      const service = container.resolve(identifier)
      expect(service).toBeInstanceOf(AnotherService)
    })
  })

  describe('inject helper', () => {
    it('should resolve service using inject helper', () => {
      const identifier = Symbol('TestService')

      container.register(identifier, () => new TestService())
      const service = inject<TestService>(identifier)

      expect(service).toBeInstanceOf(TestService)
      expect(service.getValue()).toBe('test-value')
    })

    it('should throw error when service not found', () => {
      const identifier = Symbol('NonExistent')

      expect(() => inject(identifier)).toThrow('Service not found')
    })

    it('should work with singletons', () => {
      const identifier = Symbol('TestService')

      container.registerSingleton(identifier, () => new TestService())

      const service1 = inject<TestService>(identifier)
      const service2 = inject<TestService>(identifier)

      expect(service1).toBe(service2)
    })
  })

  describe('Symbol identifiers', () => {
    it('should work with different symbols', () => {
      const id1 = Symbol('Service1')
      const id2 = Symbol('Service2')

      container.register(id1, () => new TestService())
      container.register(id2, () => new AnotherService())

      expect(container.has(id1)).toBe(true)
      expect(container.has(id2)).toBe(true)
      expect(id1).not.toBe(id2)
    })

    it('should not confuse symbols with same description', () => {
      const id1 = Symbol('Service')
      const id2 = Symbol('Service')

      container.register(id1, () => new TestService())
      container.register(id2, () => new AnotherService())

      const service1 = container.resolve(id1)
      const service2 = container.resolve(id2)

      expect(service1).toBeInstanceOf(TestService)
      expect(service2).toBeInstanceOf(AnotherService)
    })
  })
})
