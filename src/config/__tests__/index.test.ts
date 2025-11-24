import { describe, it, expect } from 'vitest'
import { runtimeConfig, getRuntimeEnv } from '../runtime.config'
import { ApiService, getBaseURL, authApi, gameApi, dataApi } from '../axios.config'

describe('Config Exports', () => {
  describe('Runtime Config', () => {
    it('should export runtimeConfig', () => {
      expect(runtimeConfig).toBeDefined()
    })

    it('should export getRuntimeEnv function', () => {
      expect(typeof getRuntimeEnv).toBe('function')
    })

    it('should have authApi getter', () => {
      expect(runtimeConfig.authApi).toBeDefined()
    })

    it('should have gameApi getter', () => {
      expect(runtimeConfig.gameApi).toBeDefined()
    })

    it('should have dataApi getter', () => {
      expect(runtimeConfig.dataApi).toBeDefined()
    })

    it('should have googleMapsApiKey getter', () => {
      expect(runtimeConfig.googleMapsApiKey).toBeDefined()
    })
  })

  describe('Axios Config', () => {
    it('should export ApiService enum', () => {
      expect(ApiService).toBeDefined()
      expect(ApiService.AUTH).toBe('AUTH')
      expect(ApiService.GAME).toBe('GAME')
      expect(ApiService.DATA).toBe('DATA')
    })

    it('should export getBaseURL function', () => {
      expect(typeof getBaseURL).toBe('function')
    })

    it('should be able to get base URL for AUTH', () => {
      const url = getBaseURL(ApiService.AUTH)
      expect(url).toContain('/api')
    })

    it('should be able to get base URL for GAME', () => {
      const url = getBaseURL(ApiService.GAME)
      expect(url).toContain('/api')
    })

    it('should be able to get base URL for DATA', () => {
      const url = getBaseURL(ApiService.DATA)
      expect(url).toContain('/api')
    })
  })
})
