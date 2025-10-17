/**
 * Composable for dependency injection
 * Provides easy access to services from Vue components
 */

import { inject } from '@/core/container'
import { SERVICE_TOKENS } from '@/types/service.types'
import type { IUserIdentityService, IGameEngineService } from '@/types'

/**
 * Get User Identity Service instance
 */
export const useUserIdentityService = (): IUserIdentityService => {
  return inject<IUserIdentityService>(SERVICE_TOKENS.USER_IDENTITY)
}

/**
 * Get Game Engine Service instance
 */
export const useGameEngineService = (): IGameEngineService => {
  return inject<IGameEngineService>(SERVICE_TOKENS.GAME_ENGINE)
}
