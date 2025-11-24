import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useToast } from '../useToast'
import { toast } from 'vue-sonner'

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    promise: vi.fn(),
  },
}))

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('success', () => {
    it('should call toast.success with message', () => {
      const { success } = useToast()

      success('Success message')

      expect(toast.success).toHaveBeenCalledWith('Success message')
      expect(toast.success).toHaveBeenCalledTimes(1)
    })
  })

  describe('error', () => {
    it('should call toast.error with extracted error message', () => {
      const { error } = useToast()

      error(new Error('Test error'))

      expect(toast.error).toHaveBeenCalledWith('Test error')
      expect(toast.error).toHaveBeenCalledTimes(1)
    })

    it('should use fallback message when provided', () => {
      const { error } = useToast()

      error(new Error('Test error'), 'Custom fallback')

      expect(toast.error).toHaveBeenCalledWith('Custom fallback')
    })

    it('should extract message from string error', () => {
      const { error } = useToast()

      error('String error')

      expect(toast.error).toHaveBeenCalledWith('String error')
    })

    it('should handle unknown error types', () => {
      const { error } = useToast()

      error({ unknown: 'error' })

      expect(toast.error).toHaveBeenCalledWith('Erro desconhecido. Tente novamente mais tarde.')
    })
  })

  describe('info', () => {
    it('should call toast.info with message', () => {
      const { info } = useToast()

      info('Info message')

      expect(toast.info).toHaveBeenCalledWith('Info message')
      expect(toast.info).toHaveBeenCalledTimes(1)
    })
  })

  describe('warning', () => {
    it('should call toast.warning with message', () => {
      const { warning } = useToast()

      warning('Warning message')

      expect(toast.warning).toHaveBeenCalledWith('Warning message')
      expect(toast.warning).toHaveBeenCalledTimes(1)
    })
  })

  describe('loading', () => {
    it('should call toast.loading with message', () => {
      const { loading } = useToast()

      loading('Loading message')

      expect(toast.loading).toHaveBeenCalledWith('Loading message')
      expect(toast.loading).toHaveBeenCalledTimes(1)
    })
  })

  describe('promise', () => {
    it('should call toast.promise with correct options', () => {
      const { promise } = useToast()
      const mockPromise = Promise.resolve('data')

      promise(mockPromise, {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      })

      expect(toast.promise).toHaveBeenCalledWith(
        mockPromise,
        expect.objectContaining({
          loading: 'Loading...',
          success: 'Success!',
        })
      )
    })

    it('should return the promise', async () => {
      const { promise } = useToast()
      const mockPromise = Promise.resolve('data')

      const result = promise(mockPromise, {
        loading: 'Loading...',
        success: 'Success!',
      })

      await expect(result).resolves.toBe('data')
    })

    it('should handle success function', () => {
      const { promise } = useToast()
      const mockPromise = Promise.resolve('data')
      const successFn = (data: string) => `Success with ${data}`

      promise(mockPromise, {
        loading: 'Loading...',
        success: successFn,
      })

      expect(toast.promise).toHaveBeenCalledWith(
        mockPromise,
        expect.objectContaining({
          success: successFn,
        })
      )
    })

    it('should use custom error message when provided', () => {
      const { promise } = useToast()
      const mockPromise = Promise.reject(new Error('Test error'))

      promise(mockPromise, {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Custom error',
      })

      expect(toast.promise).toHaveBeenCalled()
      mockPromise.catch(() => {})
    })
  })
})
