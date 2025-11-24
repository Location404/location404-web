import { describe, it, expect } from 'vitest'
import {
  extractErrorMessage,
  parseApiError,
  isNetworkError,
  isAuthError,
  type ApiError,
} from '../error-handler'
import type { AxiosError } from 'axios'

describe('error-handler', () => {
  describe('extractErrorMessage', () => {
    it('should return string error as is', () => {
      const result = extractErrorMessage('Test error message')
      expect(result).toBe('Test error message')
    })

    it('should extract message from Error instance', () => {
      const error = new Error('Error instance message')
      const result = extractErrorMessage(error)
      expect(result).toBe('Error instance message')
    })

    it('should extract message from axios error response', () => {
      const axiosError = {
        response: {
          data: {
            message: 'API error message',
          },
        },
      } as AxiosError<{ message: string }>

      const result = extractErrorMessage(axiosError)
      expect(result).toBe('API error message')
    })

    it('should extract message from axios error', () => {
      const axiosError = {
        message: 'Axios error message',
      } as AxiosError

      const result = extractErrorMessage(axiosError)
      expect(result).toBe('Axios error message')
    })

    it('should return default message for unknown error', () => {
      const result = extractErrorMessage({ unknown: 'error' })
      expect(result).toBe('Erro desconhecido. Tente novamente mais tarde.')
    })
  })

  describe('parseApiError', () => {
    it('should parse axios error with all fields', () => {
      const axiosError = {
        message: 'Request failed',
        response: {
          status: 400,
          data: {
            message: 'Bad request',
            code: 'BAD_REQUEST',
            extra: 'detail',
          },
        },
      } as AxiosError<{ message: string; code: string; extra: string }>

      const result: ApiError = parseApiError(axiosError)

      expect(result.message).toBe('Bad request')
      expect(result.status).toBe(400)
      expect(result.code).toBe('BAD_REQUEST')
      expect(result.details).toEqual({
        message: 'Bad request',
        code: 'BAD_REQUEST',
        extra: 'detail',
      })
    })

    it('should parse error without response', () => {
      const error = new Error('Simple error')
      const result = parseApiError(error)

      expect(result.message).toBe('Simple error')
      expect(result.status).toBeUndefined()
      expect(result.code).toBeUndefined()
    })

    it('should parse axios error without data', () => {
      const axiosError = {
        message: 'Network error',
        response: {
          status: 500,
        },
      } as AxiosError

      const result = parseApiError(axiosError)

      expect(result.message).toBe('Network error')
      expect(result.status).toBe(500)
    })
  })

  describe('isNetworkError', () => {
    it('should return true for network error', () => {
      const axiosError = {
        message: 'Network Error',
      } as AxiosError

      const result = isNetworkError(axiosError)
      expect(result).toBe(true)
    })

    it('should return false when response exists', () => {
      const axiosError = {
        message: 'Network Error',
        response: { status: 500 },
      } as AxiosError

      const result = isNetworkError(axiosError)
      expect(result).toBe(false)
    })

    it('should return false for other errors', () => {
      const axiosError = {
        message: 'Request failed',
      } as AxiosError

      const result = isNetworkError(axiosError)
      expect(result).toBe(false)
    })
  })

  describe('isAuthError', () => {
    it('should return true for 401 status', () => {
      const axiosError = {
        response: { status: 401 },
      } as AxiosError

      const result = isAuthError(axiosError)
      expect(result).toBe(true)
    })

    it('should return true for 403 status', () => {
      const axiosError = {
        response: { status: 403 },
      } as AxiosError

      const result = isAuthError(axiosError)
      expect(result).toBe(true)
    })

    it('should return false for other status codes', () => {
      const axiosError = {
        response: { status: 404 },
      } as AxiosError

      const result = isAuthError(axiosError)
      expect(result).toBe(false)
    })

    it('should return false when no response', () => {
      const axiosError = {} as AxiosError

      const result = isAuthError(axiosError)
      expect(result).toBe(false)
    })
  })
})
