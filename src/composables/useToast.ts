/**
 * Composable for toast notifications
 */

import { toast } from 'vue-sonner'
import { extractErrorMessage } from '@/utils/error-handler'

export const useToast = () => {
  /**
   * Show success toast
   */
  const success = (message: string): void => {
    toast.success(message)
  }

  /**
   * Show error toast with standardized error extraction
   */
  const error = (err: unknown, fallbackMessage?: string): void => {
    const message = extractErrorMessage(err)
    toast.error(fallbackMessage || message)
  }

  /**
   * Show info toast
   */
  const info = (message: string): void => {
    toast.info(message)
  }

  /**
   * Show warning toast
   */
  const warning = (message: string): void => {
    toast.warning(message)
  }

  /**
   * Show loading toast
   */
  const loading = (message: string): void => {
    toast.loading(message)
  }

  /**
   * Promise-based toast with standardized error handling
   */
  const promise = <T>(
    promiseFn: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error?: string
    }
  ): Promise<T> => {
    toast.promise(promiseFn, {
      loading: options.loading,
      success: options.success,
      error: (err: unknown) => {
        return options.error || extractErrorMessage(err)
      },
    })
    return promiseFn
  }

  return {
    success,
    error,
    info,
    warning,
    loading,
    promise,
  }
}
