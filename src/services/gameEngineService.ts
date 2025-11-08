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
import { runtimeConfig } from '@/config/runtime.config'

export class GameEngineService implements IGameEngineService {
  private connection: signalR.HubConnection | null = null
  private readonly hubUrl: string

  public onMatchFound: ((data: MatchFoundResponse) => void) | null = null
  public onRoundStarted: ((data: RoundStartedResponse) => void) | null = null
  public onGuessSubmitted: ((message: string) => void) | null = null
  public onRoundEnded: ((data: RoundEndedResponse) => void) | null = null
  public onMatchEnded: ((data: MatchEndedResponse) => void) | null = null
  public onMatchStatus: ((match: GameMatch) => void) | null = null
  public onLeftQueue: ((message: string) => void) | null = null
  public onError: ((message: string) => void) | null = null

  constructor() {
    const apiUrl = runtimeConfig.gameApi || 'http://localhost:5170'
    this.hubUrl = `${apiUrl}/gamehub`
  }

  async connect(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected')
      return
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    this.registerEventHandlers()

    try {
      await this.connection.start()
      console.log('✅ SignalR Connected to GameHub')
    } catch (error) {
      console.error('❌ SignalR Connection Error:', error)
      throw error
    }
  }

  private registerEventHandlers(): void {
    if (!this.connection) return

    this.connection.on('MatchFound', (data: MatchFoundResponse) => {
      console.log('🎮 Match Found:', data)
      this.onMatchFound?.(data)
    })

    this.connection.on('RoundStarted', (data: RoundStartedResponse) => {
      console.log('🎯 Round Started:', data)
      this.onRoundStarted?.(data)
    })

    this.connection.on('GuessSubmitted', (message: string) => {
      console.log('✅ Guess Submitted:', message)
      this.onGuessSubmitted?.(message)
    })

    this.connection.on('RoundEnded', (data: RoundEndedResponse) => {
      console.log('🏁 Round Ended:', data)
      this.onRoundEnded?.(data)
    })

    this.connection.on('MatchEnded', (data: MatchEndedResponse) => {
      console.log('🎊 Match Ended:', data)
      this.onMatchEnded?.(data)
    })

    this.connection.on('MatchStatus', (match: GameMatch) => {
      console.log('📊 Match Status:', match)
      this.onMatchStatus?.(match)
    })

    this.connection.on('LeftQueue', (message: string) => {
      console.log('👋 Left Queue:', message)
      this.onLeftQueue?.(message)
    })

    this.connection.on('Error', (message: string) => {
      console.error('❌ Game Error:', message)
      this.onError?.(message)
    })

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

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop()
      console.log('🔌 SignalR Disconnected')
      this.connection = null
    }
  }

  async joinMatchmaking(request: JoinMatchmakingRequest): Promise<string> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    return await this.connection.invoke<string>('JoinMatchmaking', request)
  }

  async leaveMatchmaking(playerId: string): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('LeaveMatchmaking', playerId)
  }

  async startRound(request: StartRoundRequest): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('StartRound', request)
  }

  async submitGuess(request: SubmitGuessRequest): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('SubmitGuess', request)
  }

  async getMatchStatus(matchId: string): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to game server')
    }

    await this.connection.invoke('GetMatchStatus', matchId)
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null
  }
}
