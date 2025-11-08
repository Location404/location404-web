declare global {
  interface Window {
    APP_CONFIG?: {
      VITE_AUTH_API?: string
      VITE_GAME_API?: string
      VITE_DATA_API?: string
      VITE_GOOGLE_MAPS_API_KEY?: string
    }
  }
}

export const getRuntimeEnv = (key: string): string => {
  if (typeof window !== 'undefined' && window.APP_CONFIG?.[key as keyof typeof window.APP_CONFIG]) {
    return window.APP_CONFIG[key as keyof typeof window.APP_CONFIG] || ''
  }

  if (import.meta.env[key]) {
    return import.meta.env[key] as string
  }

  return ''
}

export const runtimeConfig = {
  get authApi() {
    return getRuntimeEnv('VITE_AUTH_API')
  },
  get gameApi() {
    return getRuntimeEnv('VITE_GAME_API')
  },
  get dataApi() {
    return getRuntimeEnv('VITE_DATA_API')
  },
  get googleMapsApiKey() {
    return getRuntimeEnv('VITE_GOOGLE_MAPS_API_KEY')
  }
} as const
