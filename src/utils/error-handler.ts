/**
 * Centralized error handling utilities
 */

import type { AxiosError } from 'axios'

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

/**
 * Extract error message from various error types
 */
export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  const axiosError = error as AxiosError<{ message?: string }>

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message
  }

  if (axiosError.message) {
    return axiosError.message
  }

  return 'Erro desconhecido. Tente novamente mais tarde.'
}

/**
 * Parse axios error into structured ApiError
 */
export const parseApiError = (error: unknown): ApiError => {
  const axiosError = error as AxiosError<{ message?: string; code?: string }>

  return {
    message: extractErrorMessage(error),
    status: axiosError.response?.status,
    code: axiosError.response?.data?.code,
    details: axiosError.response?.data,
  }
}

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  const axiosError = error as AxiosError
  return !axiosError.response && axiosError.message === 'Network Error'
}

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  const axiosError = error as AxiosError
  return axiosError.response?.status === 401 || axiosError.response?.status === 403
}
