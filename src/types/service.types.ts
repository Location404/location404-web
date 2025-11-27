/**
 * Service interfaces and types
 */

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from './auth.types'
import type { UserProfile, UpdateUserProfileRequest } from './user.types'

/**
 * User Identity Service Interface
 */
export interface IUserIdentityService {
  register(data: RegisterRequest): Promise<RegisterResponse>
  login(data: LoginRequest): Promise<LoginResponse>
  getUserProfile(): Promise<UserProfile>
  updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile>
  updateUserImageProfile(imageFile: File): Promise<void>
}

/**
 * Game Engine Service Interface
 */
export interface IGameEngineService {
  // SignalR connection (auth via cookies)
  connect(): Promise<void>
  disconnect(): Promise<void>
  isConnected(): boolean

  // Matchmaking
  joinMatchmaking(request: import('./game.types').JoinMatchmakingRequest): Promise<string>
  leaveMatchmaking(playerId: string): Promise<void>

  // Game actions
  startRound(request: import('./game.types').StartRoundRequest): Promise<void>
  submitGuess(request: import('./game.types').SubmitGuessRequest): Promise<void>
  getMatchStatus(matchId: string): Promise<void>

  // Event handlers
  onMatchFound: ((data: import('./game.types').MatchFoundResponse) => void) | null
  onRoundStarted: ((data: import('./game.types').RoundStartedResponse) => void) | null
  onGuessSubmitted: ((message: string) => void) | null
  onOpponentSubmitted: ((data: { playerId: string; matchId: string }) => void) | null
  onTimerAdjusted: ((data: { matchId: string; roundId: string; newDuration: number; adjustedAt: string }) => void) | null
  onRoundEnded: ((data: import('./game.types').RoundEndedResponse) => void) | null
  onMatchEnded: ((data: import('./game.types').MatchEndedResponse) => void) | null
  onMatchStatus: ((match: import('./game.types').GameMatch) => void) | null
  onLeftQueue: ((message: string) => void) | null
  onError: ((message: string) => void) | null
}

/**
 * Service injection tokens
 */
export const SERVICE_TOKENS = {
  USER_IDENTITY: Symbol('IUserIdentityService'),
  GAME_ENGINE: Symbol('IGameEngineService'),
} as const
