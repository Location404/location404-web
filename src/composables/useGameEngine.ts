/**
 * Composable for Game Engine (SignalR)
 * Manages game state and SignalR connection
 */

import { ref, computed, onUnmounted } from 'vue'
import { useGameEngineService, useToast } from '@/composables'
import { useAuthStore } from '@/stores/auth'
import {
  MatchmakingStatus,
  GameStatus,
  type GameState,
  type MatchFoundResponse,
  type RoundStartedResponse,
  type RoundEndedResponse,
  type MatchEndedResponse,
  type GameMatch,
} from '@/types'

export const useGameEngine = () => {
  const gameService = useGameEngineService()
  const authStore = useAuthStore()
  const { success: toastSuccess, error: toastError } = useToast()

  // Game state
  const state = ref<GameState>({
    matchmakingStatus: MatchmakingStatus.IDLE,
    gameStatus: GameStatus.WAITING,
    currentMatch: null,
    currentRound: null,
    currentLocation: null,
    myGuess: null,
    opponentGuess: null,
    isMyTurn: false,
  })

  const isConnected = ref(false)
  const countdownSeconds = ref(0)
  let countdownTimer: number | null = null

  const isSearching = computed(() => state.value.matchmakingStatus === MatchmakingStatus.SEARCHING)
  const inMatch = computed(() =>
    state.value.currentMatch !== null &&
    state.value.matchmakingStatus !== MatchmakingStatus.MATCH_FOUND
  )
  const currentPlayerId = computed(() => authStore.userStore?.userId || '')
  const isPlayerA = computed(() => state.value.currentMatch?.playerAId === currentPlayerId.value)
  const isMatchFound = computed(() => state.value.matchmakingStatus === MatchmakingStatus.MATCH_FOUND)

  /**
   * Start countdown timer
   */
  const startCountdown = (seconds: number) => {
    countdownSeconds.value = seconds

    // Clear any existing timer
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }

    countdownTimer = setInterval(() => {
      countdownSeconds.value--
      if (countdownSeconds.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
        // Only PlayerA starts the round to avoid race condition
        if (isPlayerA.value) {
          startRound()
        }
      }
    }, 1000) as unknown as number
  }

  /**
   * Connect to SignalR hub
   * Authentication is handled by cookies (managed by backend)
   */
  const connect = async () => {
    if (isConnected.value) return

    try {
      await gameService.connect()
      isConnected.value = true

      // Setup event handlers
      setupEventHandlers()

      toastSuccess('Conectado ao servidor de jogo!')
    } catch (error) {
      toastError(error, 'Erro ao conectar ao servidor de jogo')
      throw error
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  const disconnect = async () => {
    // Clear countdown timer
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }

    await gameService.disconnect()
    isConnected.value = false
    resetState()
  }

  /**
   * Setup SignalR event handlers
   */
  const setupEventHandlers = () => {
    // Match Found
    gameService.onMatchFound = (data: MatchFoundResponse) => {
      console.log('[useGameEngine] MatchFound event received:', data)
      console.log('[useGameEngine] Current player ID:', currentPlayerId.value)
      console.log('[useGameEngine] Current matchmaking status:', state.value.matchmakingStatus)

      state.value.matchmakingStatus = MatchmakingStatus.MATCH_FOUND
      state.value.currentMatch = {
        id: data.matchId,
        playerAId: data.playerAId,
        playerBId: data.playerBId,
        startTime: data.startTime,
        endTime: '',
        playerWinnerId: null,
        playerLoserId: null,
        playerATotalPoints: 0,
        playerBTotalPoints: 0,
        pointsEarned: null,
        pointsLost: null,
        gameRounds: [],
        currentGameRound: null,
        totalRounds: 0,
      }

      console.log('[useGameEngine] Match state updated:', state.value.currentMatch)
      console.log('[useGameEngine] New matchmaking status:', state.value.matchmakingStatus)

      toastSuccess('Partida encontrada! Iniciando...')

      // Start countdown
      startCountdown(3)
    }

    // Round Started
    gameService.onRoundStarted = (data: RoundStartedResponse) => {
      console.log('[useGameEngine] RoundStarted event received:', data)
      console.log('[useGameEngine] Location data:', data.location)

      state.value.matchmakingStatus = MatchmakingStatus.IDLE
      state.value.gameStatus = GameStatus.ROUND_ACTIVE
      state.value.currentLocation = data.location
      state.value.currentRound = {
        id: data.roundId,
        gameMatchId: data.matchId,
        roundNumber: data.roundNumber,
        playerAId: state.value.currentMatch?.playerAId || '',
        playerBId: state.value.currentMatch?.playerBId || '',
        playerAPoints: null,
        playerBPoints: null,
        gameResponse: null,
        playerAGuess: null,
        playerBGuess: null,
        gameRoundEnded: false,
      }
      state.value.myGuess = null
      state.value.opponentGuess = null

      console.log('[useGameEngine] State updated - currentLocation:', state.value.currentLocation)
      toastSuccess(`Rodada ${data.roundNumber} iniciada!`)
    }

    // Guess Submitted
    gameService.onGuessSubmitted = (message: string) => {
      console.log('Palpite enviado:', message)
    }

    // Round Ended
    gameService.onRoundEnded = (data: RoundEndedResponse) => {
      console.log('[useGameEngine] RoundEnded event received:', data)

      state.value.gameStatus = GameStatus.ROUND_ENDED

      // Create a temporary round object to store the final results for display
      const finalRoundData = state.value.currentRound
        ? {
            ...state.value.currentRound,
            gameResponse: data.correctAnswer,
            playerAGuess: data.playerAGuess,
            playerBGuess: data.playerBGuess,
            playerAPoints: data.playerAPoints,
            playerBPoints: data.playerBPoints,
            gameRoundEnded: true,
          }
        : null

      // Store the final round data for display
      if (finalRoundData) {
        state.value.currentRound = finalRoundData
      }

      // Update match totals
      if (state.value.currentMatch) {
        state.value.currentMatch.playerATotalPoints = data.playerATotalPoints
        state.value.currentMatch.playerBTotalPoints = data.playerBTotalPoints

        // Add the completed round to the match's gameRounds array
        if (finalRoundData && state.value.currentMatch.gameRounds) {
          state.value.currentMatch.gameRounds.push(finalRoundData)
        }
      }

      const myPoints = isPlayerA.value ? data.playerAPoints : data.playerBPoints
      toastSuccess(`Rodada finalizada! Você fez ${myPoints} pontos`)
    }

    // Match Ended
    gameService.onMatchEnded = (data: MatchEndedResponse) => {
      console.log('[useGameEngine] MatchEnded event received:', data)

      state.value.gameStatus = GameStatus.MATCH_ENDED

      // Update match with final data
      if (state.value.currentMatch) {
        state.value.currentMatch.playerWinnerId = data.winnerId
        state.value.currentMatch.playerLoserId = data.loserId
        state.value.currentMatch.playerATotalPoints = data.playerATotalPoints
        state.value.currentMatch.playerBTotalPoints = data.playerBTotalPoints
        state.value.currentMatch.pointsEarned = data.pointsEarned
        state.value.currentMatch.pointsLost = data.pointsLost
        state.value.currentMatch.endTime = data.endTime
        state.value.currentMatch.gameRounds = data.rounds
      }

      const isWinner = data.winnerId === currentPlayerId.value
      const message = isWinner
        ? `Você venceu! +${data.pointsEarned} pontos`
        : `Você perdeu! -${data.pointsLost} pontos`

      toastSuccess(message)
    }

    // Left Queue
    gameService.onLeftQueue = (message: string) => {
      state.value.matchmakingStatus = MatchmakingStatus.IDLE
      console.log(message)
    }

    // Error
    gameService.onError = (message: string) => {
      toastError(message)
    }

    // Match Status
    gameService.onMatchStatus = (match: GameMatch) => {
      console.log('[useGameEngine] MatchStatus event received:', match)

      state.value.currentMatch = match

      // Only update currentRound if the backend has an active round
      if (match.currentGameRound) {
        state.value.currentRound = match.currentGameRound
        state.value.gameStatus = GameStatus.ROUND_ACTIVE
        console.log('[useGameEngine] Active round found in match status:', match.currentGameRound)
      } else {
        // Backend has no active round, ensure our state reflects this
        if (state.value.currentRound && !state.value.currentRound.gameRoundEnded) {
          console.warn('[useGameEngine] Backend has no active round but frontend does. Clearing frontend state.')
          state.value.currentRound = null
          state.value.currentLocation = null
          state.value.gameStatus = GameStatus.WAITING
        }
      }
    }
  }

  /**
   * Join matchmaking queue
   */
  const joinMatchmaking = async () => {
    if (!isConnected.value) {
      await connect()
    }

    try {
      state.value.matchmakingStatus = MatchmakingStatus.SEARCHING
      const message = await gameService.joinMatchmaking({
        playerId: currentPlayerId.value,
      })
      console.log(message)
    } catch (error) {
      state.value.matchmakingStatus = MatchmakingStatus.IDLE
      toastError(error, 'Erro ao entrar na fila')
      console.error(error)
    }
  }

  /**
   * Leave matchmaking queue
   */
  const leaveMatchmaking = async () => {
    try {
      await gameService.leaveMatchmaking(currentPlayerId.value)
      state.value.matchmakingStatus = MatchmakingStatus.IDLE
    } catch (error) {
      toastError(error, 'Erro ao sair da fila')
      console.error(error)
    }
  }

  /**
   * Start a new round
   */
  const startRound = async () => {
    if (!state.value.currentMatch) {
      toastError('Nenhuma partida ativa')
      return
    }

    try {
      // Clear previous round state before starting new round
      state.value.currentRound = null
      state.value.currentLocation = null
      state.value.myGuess = null
      state.value.opponentGuess = null
      state.value.gameStatus = GameStatus.WAITING

      console.log('[useGameEngine] Starting new round, cleared previous round state')

      await gameService.startRound({
        matchId: state.value.currentMatch.id,
      })
    } catch (error) {
      toastError(error, 'Erro ao iniciar rodada')
      console.error(error)
    }
  }

  /**
   * Submit a guess
   */
  const submitGuess = async (x: number, y: number) => {
    if (!state.value.currentMatch) {
      toastError('Nenhuma partida ativa')
      return
    }

    if (!state.value.currentRound) {
      toastError('Nenhuma rodada ativa')
      console.error('[useGameEngine] Cannot submit guess: no active round')
      return
    }

    if (state.value.gameStatus !== GameStatus.ROUND_ACTIVE) {
      toastError('A rodada não está ativa')
      console.error('[useGameEngine] Cannot submit guess: round status is', state.value.gameStatus)
      return
    }

    try {
      await gameService.submitGuess({
        matchId: state.value.currentMatch.id,
        playerId: currentPlayerId.value,
        x,
        y,
      })

      state.value.myGuess = { x, y }
    } catch (error) {
      toastError(error, 'Erro ao enviar palpite')
      console.error(error)
    }
  }

  /**
   * Get match status
   */
  const getMatchStatus = async () => {
    if (!state.value.currentMatch) return

    try {
      await gameService.getMatchStatus(state.value.currentMatch.id)
    } catch (error) {
      toastError(error, 'Erro ao obter status da partida')
      console.error(error)
    }
  }

  /**
   * Reset game state
   */
  const resetState = () => {
    state.value = {
      matchmakingStatus: MatchmakingStatus.IDLE,
      gameStatus: GameStatus.WAITING,
      currentMatch: null,
      currentRound: null,
      currentLocation: null,
      myGuess: null,
      opponentGuess: null,
      isMyTurn: false,
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    // State
    state,
    isConnected,
    isSearching,
    inMatch,
    isPlayerA,
    isMatchFound,
    countdownSeconds,

    // Actions
    connect,
    disconnect,
    joinMatchmaking,
    leaveMatchmaking,
    startRound,
    submitGuess,
    getMatchStatus,
    resetState,
  }
}
