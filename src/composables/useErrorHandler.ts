/**
 * Composable for error handling
 */

import { toast } from 'vue-sonner'
import { extractErrorMessage, parseApiError, isNetworkError, isAuthError } from '@/utils/error-handler'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/config/constants'

export const useErrorHandler = () => {
  const router = useRouter()

  /**
   * Handle API errors with toast notifications
   */
  const handleError = (error: unknown, defaultMessage?: string): void => {
    const apiError = parseApiError(error)

    // Network error
    if (isNetworkError(error)) {
      toast.error('Erro de conexão. Verifique sua internet.')
      return
    }

    // Authentication error - redirect to login
    if (isAuthError(error)) {
      toast.error('Sessão expirada. Faça login novamente.')
      router.push({ name: ROUTE_NAMES.LOGIN })
      return
    }

    // Generic error
    const message = defaultMessage || apiError.message
    toast.error(message)
  }

  /**
   * Extract error message
   */
  const getErrorMessage = (error: unknown): string => {
    return extractErrorMessage(error)
  }

  return {
    handleError,
    getErrorMessage,
  }
}
