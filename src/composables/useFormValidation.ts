/**
 * Composable for form validation
 */

import { computed, type Ref } from 'vue'

export interface PasswordStrength {
  score: number
  label: string
  color: string
}

export const useFormValidation = () => {
  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Calculate password strength
   */
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0

    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

    const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

    return {
      score,
      label: labels[score] || 'Muito fraca',
      color: colors[score] || 'bg-red-500',
    }
  }

  /**
   * Create computed password strength
   */
  const usePasswordStrength = (password: Ref<string>) => {
    return computed(() => calculatePasswordStrength(password.value))
  }

  /**
   * Validate password match
   */
  const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0
  }

  return {
    isValidEmail,
    calculatePasswordStrength,
    usePasswordStrength,
    passwordsMatch,
  }
}
