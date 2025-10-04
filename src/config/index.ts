// Configuração centralizada da aplicação
interface AppConfig {
  API_BASE_URL: string
}

export function getConfig(): AppConfig {
  if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
    const runtimeConfig = (window as any).__APP_CONFIG__
  
    if (runtimeConfig.API_BASE_URL && !runtimeConfig.API_BASE_URL.startsWith('__')) {
      return {
        API_BASE_URL: runtimeConfig.API_BASE_URL
      }
    }
  }
  
  return {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }
}

export const config = getConfig()
