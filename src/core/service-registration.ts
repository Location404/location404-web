/**
 * Service registration and bootstrap
 */

import { container } from './container'
import { SERVICE_TOKENS } from '@/types/service.types'
import { UserIdentityService } from '@/services/userIdentityService'
import { GameEngineService } from '@/services/gameEngineService'

/**
 * Register all application services
 */
export const registerServices = (): void => {
  // Register User Identity Service as singleton
  container.registerSingleton(
    SERVICE_TOKENS.USER_IDENTITY,
    () => new UserIdentityService()
  )

  // Register Game Engine Service as singleton
  container.registerSingleton(
    SERVICE_TOKENS.GAME_ENGINE,
    () => new GameEngineService()
  )

  console.log('✅ All services registered successfully')
}

/**
 * Bootstrap the application services
 */
export const bootstrapServices = (): void => {
  registerServices()
}
