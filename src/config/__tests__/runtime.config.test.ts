import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getRuntimeEnv, runtimeConfig } from '../runtime.config'

describe('runtime.config', () => {
  describe('getRuntimeEnv', () => {
    const originalWindow = globalThis.window
    const originalImportMeta = import.meta.env

    beforeEach(() => {
      delete (globalThis as any).window
    })

    afterEach(() => {
      globalThis.window = originalWindow
      Object.assign(import.meta.env, originalImportMeta)
    })

    it('should return value from window.APP_CONFIG when available', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_AUTH_API: 'http://window-api.com',
        },
      }

      const result = getRuntimeEnv('VITE_AUTH_API')

      expect(result).toBe('http://window-api.com')
    })

    it('should return value from import.meta.env when window.APP_CONFIG is not available', () => {
      (globalThis as any).window = {}
      import.meta.env.VITE_AUTH_API = 'http://import-meta-api.com'

      const result = getRuntimeEnv('VITE_AUTH_API')

      expect(result).toBe('http://import-meta-api.com')
    })

    it('should return empty string when no value is found', () => {
      (globalThis as any).window = {}
      delete import.meta.env.VITE_AUTH_API

      const result = getRuntimeEnv('VITE_AUTH_API')

      expect(result).toBe('')
    })

    it('should prioritize window.APP_CONFIG over import.meta.env', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_AUTH_API: 'http://window-api.com',
        },
      }
      import.meta.env.VITE_AUTH_API = 'http://import-meta-api.com'

      const result = getRuntimeEnv('VITE_AUTH_API')

      expect(result).toBe('http://window-api.com')
    })

    it('should handle undefined window gracefully', () => {
      delete (globalThis as any).window
      import.meta.env.VITE_AUTH_API = 'http://fallback-api.com'

      const result = getRuntimeEnv('VITE_AUTH_API')

      expect(result).toBe('http://fallback-api.com')
    })

    it('should return empty string for undefined keys', () => {
      (globalThis as any).window = { APP_CONFIG: {} }
      const result = getRuntimeEnv('NON_EXISTENT_KEY')

      expect(result).toBe('')
    })
  })

  describe('runtimeConfig', () => {
    const originalWindow = globalThis.window

    beforeEach(() => {
      delete (globalThis as any).window
    })

    afterEach(() => {
      globalThis.window = originalWindow
    })

    it('should expose authApi getter', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_AUTH_API: 'http://auth-api.com',
        },
      }

      expect(runtimeConfig.authApi).toBe('http://auth-api.com')
    })

    it('should expose gameApi getter', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_GAME_API: 'http://game-api.com',
        },
      }

      expect(runtimeConfig.gameApi).toBe('http://game-api.com')
    })

    it('should expose dataApi getter', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_DATA_API: 'http://data-api.com',
        },
      }

      expect(runtimeConfig.dataApi).toBe('http://data-api.com')
    })

    it('should expose googleMapsApiKey getter', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_GOOGLE_MAPS_API_KEY: 'test-api-key',
        },
      }

      expect(runtimeConfig.googleMapsApiKey).toBe('test-api-key')
    })

    it('should read values from runtime config', () => {
      (globalThis as any).window = {
        APP_CONFIG: {
          VITE_AUTH_API: 'http://test.com',
        },
      }

      expect(runtimeConfig.authApi).toBe('http://test.com')
    })
  })
})
