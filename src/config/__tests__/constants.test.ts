import { describe, it, expect } from 'vitest'
import {
  API_CONSTANTS,
  STORAGE_KEYS,
  ROUTE_NAMES,
  ROUTE_PATHS,
  ENV_KEYS,
} from '../constants'

describe('constants', () => {
  describe('API_CONSTANTS', () => {
    it('should have correct timeout value', () => {
      expect(API_CONSTANTS.TIMEOUT).toBe(10000)
    })

    it('should have correct auth path', () => {
      expect(API_CONSTANTS.AUTH_PATH).toBe('/api')
    })

    it('should have correct game path', () => {
      expect(API_CONSTANTS.GAME_PATH).toBe('/api')
    })

    it('should have correct data path', () => {
      expect(API_CONSTANTS.DATA_PATH).toBe('/api')
    })
  })

  describe('STORAGE_KEYS', () => {
    it('should have auth store key', () => {
      expect(STORAGE_KEYS.AUTH_STORE).toBe('auth')
    })
  })

  describe('ROUTE_NAMES', () => {
    it('should have login route name', () => {
      expect(ROUTE_NAMES.LOGIN).toBe('login')
    })

    it('should have register route name', () => {
      expect(ROUTE_NAMES.REGISTER).toBe('register')
    })

    it('should have play route name', () => {
      expect(ROUTE_NAMES.PLAY).toBe('play')
    })

    it('should have ranking route name', () => {
      expect(ROUTE_NAMES.RANKING).toBe('ranking')
    })

    it('should have config route name', () => {
      expect(ROUTE_NAMES.CONFIG).toBe('config')
    })
  })

  describe('ROUTE_PATHS', () => {
    it('should have login route path', () => {
      expect(ROUTE_PATHS.LOGIN).toBe('/login')
    })

    it('should have register route path', () => {
      expect(ROUTE_PATHS.REGISTER).toBe('/register')
    })

    it('should have play route path', () => {
      expect(ROUTE_PATHS.PLAY).toBe('/play')
    })

    it('should have ranking route path', () => {
      expect(ROUTE_PATHS.RANKING).toBe('/ranking')
    })

    it('should have config route path', () => {
      expect(ROUTE_PATHS.CONFIG).toBe('/config')
    })
  })

  describe('ENV_KEYS', () => {
    it('should have auth API key', () => {
      expect(ENV_KEYS.AUTH_API).toBe('VITE_AUTH_API')
    })

    it('should have game API key', () => {
      expect(ENV_KEYS.GAME_API).toBe('VITE_GAME_API')
    })

    it('should have data API key', () => {
      expect(ENV_KEYS.DATA_API).toBe('VITE_DATA_API')
    })

    it('should have Google Maps API key', () => {
      expect(ENV_KEYS.GOOGLE_MAPS_API_KEY).toBe('VITE_GOOGLE_MAPS_API_KEY')
    })
  })
})
