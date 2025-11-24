import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ApiService, getBaseURL } from '../axios.config'

vi.mock('../runtime.config', () => ({
  runtimeConfig: {
    get authApi() {
      return 'http://auth.com'
    },
    get gameApi() {
      return ''
    },
    get dataApi() {
      return 'http://data.com'
    },
  },
}))

describe('axios.config', () => {
  describe('getBaseURL', () => {
    it('should return full URL when runtime config has value for AUTH service', () => {
      const result = getBaseURL(ApiService.AUTH)

      expect(result).toBe('http://auth.com/api')
    })

    it('should return only base path when runtime config is empty for GAME service', () => {
      const result = getBaseURL(ApiService.GAME)

      expect(result).toBe('/api')
    })

    it('should return full URL when runtime config has value for DATA service', () => {
      const result = getBaseURL(ApiService.DATA)

      expect(result).toBe('http://data.com/api')
    })

    it('should handle all ApiService types', () => {
      const authUrl = getBaseURL(ApiService.AUTH)
      const gameUrl = getBaseURL(ApiService.GAME)
      const dataUrl = getBaseURL(ApiService.DATA)

      expect(authUrl).toContain('/api')
      expect(gameUrl).toContain('/api')
      expect(dataUrl).toContain('/api')
    })

    it('should append base path to runtime URL', () => {
      const url = getBaseURL(ApiService.AUTH)

      expect(url.endsWith('/api')).toBe(true)
    })
  })

  describe('ApiService enum', () => {
    it('should have AUTH value', () => {
      expect(ApiService.AUTH).toBe('AUTH')
    })

    it('should have GAME value', () => {
      expect(ApiService.GAME).toBe('GAME')
    })

    it('should have DATA value', () => {
      expect(ApiService.DATA).toBe('DATA')
    })

    it('should have exactly 3 values', () => {
      const values = Object.values(ApiService)
      expect(values).toHaveLength(3)
    })
  })
})
