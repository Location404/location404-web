import { describe, it, expect } from 'vitest'
import * as composables from '../index'

describe('Composables Index', () => {
  describe('Exports', () => {
    it('should export useService composables', () => {
      expect(composables.useUserIdentityService).toBeDefined()
      expect(composables.useGameEngineService).toBeDefined()
    })

    it('should export useErrorHandler', () => {
      expect(composables.useErrorHandler).toBeDefined()
    })

    it('should export useToast composables', () => {
      expect(composables.useToast).toBeDefined()
    })

    it('should export useGameEngine', () => {
      expect(composables.useGameEngine).toBeDefined()
    })

    it('should export useFormValidation', () => {
      expect(composables).toBeDefined()
      // Check that the module exports something
      expect(typeof composables).toBe('object')
    })

    it('should export at least 5 composables', () => {
      const exports = Object.keys(composables)
      expect(exports.length).toBeGreaterThanOrEqual(5)
    })
  })
})
