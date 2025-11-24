import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useErrorHandler } from '../useErrorHandler'
import { AxiosError } from 'axios'

// Hoist mock functions
const { mockToastError, mockPush } = vi.hoisted(() => ({
  mockToastError: vi.fn(),
  mockPush: vi.fn(),
}))

// Mock vue-sonner
vi.mock('vue-sonner', () => ({
  toast: {
    error: mockToastError,
  },
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock ROUTE_NAMES
vi.mock('@/config/constants', () => ({
  ROUTE_NAMES: {
    LOGIN: 'login',
  },
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    mockToastError.mockClear()
    mockPush.mockClear()
  })

  describe('handleError', () => {
    it('should show network error message for network errors', () => {
      const { handleError } = useErrorHandler()
      const networkError = {
        isAxiosError: true,
        message: 'Network Error',
        code: 'ERR_NETWORK',
      } as AxiosError

      handleError(networkError)

      expect(mockToastError).toHaveBeenCalledWith('Erro de conexão. Verifique sua internet.')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should show auth error and redirect to login for 401 errors', () => {
      const { handleError } = useErrorHandler()
      const authError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      } as AxiosError

      handleError(authError)

      expect(mockToastError).toHaveBeenCalledWith('Sessão expirada. Faça login novamente.')
      expect(mockPush).toHaveBeenCalledWith({ name: 'login' })
    })

    it('should show auth error and redirect to login for 403 errors', () => {
      const { handleError } = useErrorHandler()
      const authError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      } as AxiosError

      handleError(authError)

      expect(mockToastError).toHaveBeenCalledWith('Sessão expirada. Faça login novamente.')
      expect(mockPush).toHaveBeenCalledWith({ name: 'login' })
    })

    it('should show error message from axios response', () => {
      const { handleError } = useErrorHandler()
      const apiError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Validation error' },
        },
      } as AxiosError

      handleError(apiError)

      expect(mockToastError).toHaveBeenCalledWith('Validation error')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should show default message when provided', () => {
      const { handleError } = useErrorHandler()
      const error = new Error('Some error')

      handleError(error, 'Custom error message')

      expect(mockToastError).toHaveBeenCalledWith('Custom error message')
    })

    it('should show generic error message for string errors', () => {
      const { handleError } = useErrorHandler()
      const error = 'Simple error string'

      handleError(error)

      expect(mockToastError).toHaveBeenCalledWith('Simple error string')
    })

    it('should show generic error message for Error instances', () => {
      const { handleError } = useErrorHandler()
      const error = new Error('Error message')

      handleError(error)

      expect(mockToastError).toHaveBeenCalledWith('Error message')
    })

    it('should handle unknown error types', () => {
      const { handleError } = useErrorHandler()
      const error = { someProperty: 'value' }

      handleError(error)

      expect(mockToastError).toHaveBeenCalledWith('Erro desconhecido. Tente novamente mais tarde.')
    })

    it('should prioritize default message over parsed error', () => {
      const { handleError } = useErrorHandler()
      const apiError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'API error' },
        },
      } as AxiosError

      handleError(apiError, 'Override message')

      expect(mockToastError).toHaveBeenCalledWith('Override message')
    })

    it('should handle pure network errors without response', () => {
      const { handleError } = useErrorHandler()
      const networkError = {
        isAxiosError: true,
        message: 'Network Error',
        code: 'ERR_NETWORK',
      } as AxiosError

      handleError(networkError)

      expect(mockToastError).toHaveBeenCalledWith('Erro de conexão. Verifique sua internet.')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle timeout errors', () => {
      const { handleError } = useErrorHandler()
      const timeoutError = {
        isAxiosError: true,
        message: 'timeout of 5000ms exceeded',
        code: 'ECONNABORTED',
      } as AxiosError

      handleError(timeoutError)

      expect(mockToastError).toHaveBeenCalledWith('timeout of 5000ms exceeded')
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from axios error', () => {
      const { getErrorMessage } = useErrorHandler()
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Bad request' },
        },
      } as AxiosError

      const message = getErrorMessage(error)

      expect(message).toBe('Bad request')
    })

    it('should extract message from Error instance', () => {
      const { getErrorMessage } = useErrorHandler()
      const error = new Error('Test error')

      const message = getErrorMessage(error)

      expect(message).toBe('Test error')
    })

    it('should extract message from string error', () => {
      const { getErrorMessage } = useErrorHandler()
      const error = 'String error'

      const message = getErrorMessage(error)

      expect(message).toBe('String error')
    })

    it('should return default message for unknown errors', () => {
      const { getErrorMessage } = useErrorHandler()
      const error = { unknown: true }

      const message = getErrorMessage(error)

      expect(message).toBe('Erro desconhecido. Tente novamente mais tarde.')
    })

    it('should extract message from axios network error', () => {
      const { getErrorMessage } = useErrorHandler()
      const error = {
        isAxiosError: true,
        message: 'Network Error',
        code: 'ERR_NETWORK',
      } as AxiosError

      const message = getErrorMessage(error)

      expect(message).toBe('Network Error')
    })
  })
})
