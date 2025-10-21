/**
 * Game Engine Service
 * Handles game logic and SignalR communication
 */

import * as signalR from '@microsoft/signalr'
import type { IGameEngineService } from '@/types'
import type {
  JoinMatchmakingRequest,
  StartRoundRequest,
  SubmitGuessRequest,
  MatchFoundResponse,
  RoundStartedResponse,
  RoundEndedResponse,
  MatchEndedResponse,
  GameMatch,
} from '@/types/game.types'

export class GameEngineService implements IGameEngineService {
  private connection: signalR.HubConnection | null = null
  private readonly hubUrl: string

  // Event handlers (to be set by consumers)
  public onMatchFound: ((data: MatchFoundResponse) => void) | null = null
  public onRoundStarted: ((data: RoundStartedResponse) => void) | null = null
  public onGuessSubmitted: ((message: string) => void) | null = null
  public onRoundEnded: ((data: RoundEndedResponse) => void) | null = null
  public onMatchEnded: ((data: MatchEndedResponse) => void) | null = null
  public onMatchStatus: ((match: GameMatch) => void) | null = null
  public onLeftQueue: ((message: string) => void) | null = null
  public onError: ((message: string) => void) | null = null

  constructor() {
    // Get base URL from environment
    const apiUrl = import.meta.env.VITE_GAME_ENGINE_API || 'http://localhost:5000'
    this.hubUrl = `${apiUrl}/gamehub`
  }

  /**
   * Initialize SignalR connection
   * Authentication is handled by cookies (managed by backend)
   */
  async connect(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected')
      return
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true, // Important: sends cookies with requests
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    // Register server event handlers
    this.registerEventHandlers()

    try {
      await this.connection.start()
      console.log('✅ SignalR Connected to GameHub')
    } catch (error) {
      console.error('❌ SignalR Connection Error:', error)
      throw error
    }
  }

  /**
   * Register all SignalR event handlers
   */
  private registerEventHandlers(): void {
    if (!this.connection) return

    // MatchFound event
    this.connection.on('MatchFound', (data: MatchFoundResponse) => {
      console.log('🎮 Match Found:', data)
      this.onMatchFound?.(data)
    })

    // RoundStarted event
    this.connection.on('RoundStarted', (data: RoundStartedResponse) => {
      console.log('🎯 Round Started:', data)
      this.onRoundStarted?.(data)
    })

    // GuessSubmitted event
    this.connection.on('GuessSubmitted', (message: string) => {
      console.log('✅ Guess Submitted:', message)
      this.onGuessSubmitted?.(message)
    })

    // RoundEnded event
    this.connection.on('RoundEnded', (data: RoundEndedResponse) => {
      console.log('🏁 Round Ended:', data)
      this.onRoundEnded?.(data)
    })

    // MatchEnded event
    this.connection.on('MatchEnded', (data: MatchEndedResponse) => {
      console.log('🎊 Match Ended:', data)
      this.onMatchEnded?.(data)
    })

    // MatchStatus event
    this.connection.on('MatchStatus', (match: GameMatch) => {
      console.log('📊 Match Status:', match)
      this.onMatchStatus?.(match)
    })

    // LeftQueue event
    this.connection.on('LeftQueue', (message: string) => {
      console.log('👋 Left Queue:', message)
      this.onLeftQueue?.(message)
    })

    // Error event
    this.connection.on('Error', (message: string) => {
      console.error('❌ Game Error:', message)
      this.onError?.(message)
    })

    // Connection lifecycle events
    this.connection.onreconnecting((error) => {
      console.warn('🔄 SignalR reconnecting...', error)
    })

    this.connection.onreconnected((connectionId) => {
      console.log('✅ SignalR reconnected:', connectionId)
    })

    this.connection.onclose((error) => {
      console.error('❌ SignalR connection closed:', error)
    })
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop()
      console.log('🔌 SignalR Disconnected')
      this.connection = null
    }
  }

  /**
   * Join matchmaking queue
   */
  async joinMatchmaking(request: JoinMatchmakingRequest): Promise<string> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    return await this.connection.invoke<string>('JoinMatchmaking', request)
  }

  /**
   * Leave matchmaking queue
   */
  async leaveMatchmaking(playerId: string): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('LeaveMatchmaking', playerId)
  }

  /**
   * Start a new round
   */
  async startRound(request: StartRoundRequest): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('StartRound', request)
  }

  /**
   * Submit a guess for the current round
   */
  async submitGuess(request: SubmitGuessRequest): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('SubmitGuess', request)
  }

  /**
   * Get current match status
   */
  async getMatchStatus(matchId: string): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('GetMatchStatus', matchId)
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  /**
   * Get connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null
  }
}
