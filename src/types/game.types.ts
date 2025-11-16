/**
 * Game Engine related types (SignalR DTOs)
 */

export interface Coordinate {
  x: number
  y: number
}

export interface JoinMatchmakingRequest {
  playerId: string
}

export interface StartRoundRequest {
  matchId: string
}

export interface SubmitGuessRequest {
  matchId: string
  playerId: string
  x: number
  y: number
}

export interface EndRoundRequest {
  matchId: string
  responseX: number
  responseY: number
  playerAId: string
  playerAGuessX: number
  playerAGuessY: number
  playerBId: string
  playerBGuessX: number
  playerBGuessY: number
}

export interface MatchFoundResponse {
  matchId: string
  playerAId: string
  playerBId: string
  startTime: string
}

export interface LocationData {
  x: number // Latitude
  y: number // Longitude
  heading: number
  pitch: number
}

export interface RoundStartedResponse {
  matchId: string
  roundId: string
  roundNumber: number
  startTime: string
  location: LocationData
  startedAt: string
  durationSeconds: number
}

export interface RoundEndedResponse {
  matchId: string
  roundId: string
  roundNumber: number
  correctAnswer: Coordinate
  playerAGuess: Coordinate
  playerBGuess: Coordinate
  playerAPoints: number | null
  playerBPoints: number | null
  playerATotalPoints: number | null
  playerBTotalPoints: number | null
  roundWinnerId: string | null
}

export interface MatchEndedResponse {
  matchId: string
  winnerId: string | null
  loserId: string | null
  playerATotalPoints: number | null
  playerBTotalPoints: number | null
  pointsEarned: number | null
  pointsLost: number | null
  endTime: string
  rounds: GameRoundDto[]
}

export interface GameRoundDto {
  id: string
  gameMatchId: string
  roundNumber: number
  playerAId: string
  playerBId: string
  playerAPoints: number | null
  playerBPoints: number | null
  gameResponse: Coordinate | null
  playerAGuess: Coordinate | null
  playerBGuess: Coordinate | null
  gameRoundEnded: boolean
}

export interface GameMatch {
  id: string
  startTime: string
  endTime: string
  playerAId: string
  playerBId: string
  playerWinnerId: string | null
  playerLoserId: string | null
  playerATotalPoints: number | null
  playerBTotalPoints: number | null
  pointsEarned: number | null
  pointsLost: number | null
  gameRounds: GameRoundDto[] | null
  currentGameRound: GameRoundDto | null
  totalRounds: number
}

export enum MatchmakingStatus {
  IDLE = 'idle',
  SEARCHING = 'searching',
  MATCH_FOUND = 'match_found',
}

export enum GameStatus {
  WAITING = 'waiting',
  ROUND_ACTIVE = 'round_active',
  ROUND_ENDED = 'round_ended',
  MATCH_ENDED = 'match_ended',
}

export interface GameState {
  matchmakingStatus: MatchmakingStatus
  gameStatus: GameStatus
  currentMatch: GameMatch | null
  currentRound: GameRoundDto | null
  currentLocation: LocationData | null
  myGuess: Coordinate | null
  opponentGuess: Coordinate | null
  isMyTurn: boolean
}
