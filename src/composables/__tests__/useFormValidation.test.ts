import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useFormValidation } from '../useFormValidation'

describe('useFormValidation', () => {
  const { isValidEmail, calculatePasswordStrength, usePasswordStrength, passwordsMatch } =
    useFormValidation()

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user@domain')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    it('should return false for emails with spaces', () => {
      expect(isValidEmail('user name@domain.com')).toBe(false)
      expect(isValidEmail('user@domain .com')).toBe(false)
    })
  })

  describe('calculatePasswordStrength', () => {
    it('should return score 0 for empty password', () => {
      const result = calculatePasswordStrength('')
      expect(result.score).toBe(0)
      expect(result.label).toBe('Muito fraca')
      expect(result.color).toBe('bg-red-500')
    })

    it('should return score 1 for password with 6+ characters', () => {
      const result = calculatePasswordStrength('abcdef')
      expect(result.score).toBe(1)
      expect(result.label).toBe('Fraca')
      expect(result.color).toBe('bg-orange-500')
    })

    it('should return score 2 for password with 10+ characters', () => {
      const result = calculatePasswordStrength('abcdefghij')
      expect(result.score).toBe(2)
      expect(result.label).toBe('Média')
      expect(result.color).toBe('bg-yellow-500')
    })

    it('should increase score for mixed case', () => {
      const result = calculatePasswordStrength('abcDEF')
      expect(result.score).toBe(2)
    })

    it('should increase score for numbers', () => {
      const result = calculatePasswordStrength('abc123')
      expect(result.score).toBe(2)
    })

    it('should increase score for special characters', () => {
      const result = calculatePasswordStrength('abc!@#')
      expect(result.score).toBe(2)
    })

    it('should return high score for very strong password', () => {
      const result = calculatePasswordStrength('Abc123!@#XYZ')
      expect(result.score).toBe(5)
      expect(result.label).toBe('Muito fraca')
      expect(result.color).toBe('bg-red-500')
    })

    it('should return high score for strong password', () => {
      const result = calculatePasswordStrength('Abc123XYZ0')
      expect(result.score).toBe(4)
      expect(result.label).toBe('Muito forte')
      expect(result.color).toBe('bg-green-500')
    })

    it('should handle password with only special characters', () => {
      const result = calculatePasswordStrength('!@#$%^')
      expect(result.score).toBe(2)
    })

    it('should handle password with only numbers', () => {
      const result = calculatePasswordStrength('123456')
      expect(result.score).toBe(2)
    })
  })

  describe('usePasswordStrength', () => {
    it('should return computed password strength', () => {
      const password = ref('weak')
      const strength = usePasswordStrength(password)

      expect(strength.value.score).toBe(0)
      expect(strength.value.label).toBe('Muito fraca')
    })

    it('should update when password changes', () => {
      const password = ref('weak')
      const strength = usePasswordStrength(password)

      expect(strength.value.score).toBe(0)

      password.value = 'StrongPass123!'
      expect(strength.value.score).toBe(5)
      expect(strength.value.label).toBe('Muito fraca')
    })

    it('should be reactive to password updates', () => {
      const password = ref('')
      const strength = usePasswordStrength(password)

      expect(strength.value.score).toBe(0)

      password.value = 'abc123'
      expect(strength.value.score).toBe(2)

      password.value = 'Abc123XYZ0'
      expect(strength.value.score).toBe(4)
    })
  })

  describe('passwordsMatch', () => {
    it('should return true when passwords match and not empty', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true)
      expect(passwordsMatch('abc', 'abc')).toBe(true)
    })

    it('should return false when passwords do not match', () => {
      expect(passwordsMatch('password123', 'password456')).toBe(false)
      expect(passwordsMatch('abc', 'def')).toBe(false)
    })

    it('should return false when passwords are empty', () => {
      expect(passwordsMatch('', '')).toBe(false)
    })

    it('should return false when only one password is empty', () => {
      expect(passwordsMatch('password', '')).toBe(false)
      expect(passwordsMatch('', 'password')).toBe(false)
    })

    it('should be case sensitive', () => {
      expect(passwordsMatch('Password', 'password')).toBe(false)
    })

    it('should handle special characters', () => {
      expect(passwordsMatch('pass!@#', 'pass!@#')).toBe(true)
      expect(passwordsMatch('pass!@#', 'pass@#$')).toBe(false)
    })
  })
})
