import { describe, it, expect } from 'vitest'
import * as types from '../index'
import type {
  RegisterRequest,
  LoginRequest,
  UserStore,
  UserProfile,
  Coordinate,
} from '../index'

describe('Types Index', () => {
  describe('Type Exports', () => {
    it('should allow importing RegisterRequest type', () => {
      const request: RegisterRequest = {
        username: 'test',
        email: 'test@example.com',
        password: 'pass123',
      }
      expect(request).toBeDefined()
    })

    it('should allow importing LoginRequest type', () => {
      const request: LoginRequest = {
        email: 'test@example.com',
        password: 'pass123',
      }
      expect(request).toBeDefined()
    })

    it('should allow importing UserStore type', () => {
      const user: UserStore = {
        userId: '123',
        username: 'test',
        email: 'test@example.com',
        profileImage: null,
      }
      expect(user).toBeDefined()
    })

    it('should allow importing UserProfile type', () => {
      const profile: UserProfile = {
        id: '123',
        username: 'test',
        email: 'test@example.com',
        profileImage: 'image.jpg',
      }
      expect(profile).toBeDefined()
    })

    it('should allow importing Coordinate type', () => {
      const coord: Coordinate = {
        x: 0,
        y: 0,
      }
      expect(coord).toBeDefined()
    })

    it('should have multiple exports', () => {
      // Verify that the module exports are accessible
      expect(types).toBeDefined()
      expect(typeof types).toBe('object')
    })
  })
})
