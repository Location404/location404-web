/**
 * Game Engine Service
 * Handles game logic and SignalR communication (to be implemented)
 */

import type { AxiosInstance } from 'axios'
import { apiClients } from '@/config/axios.config'
import type { IGameEngineService } from '@/types'

export class GameEngineService implements IGameEngineService {
  private readonly client: AxiosInstance
  // private signalRConnection: HubConnection | null = null

  constructor() {
    this.client = apiClients.gameEngine
  }

  /**
   * Initialize SignalR connection
   * TODO: Implement when SignalR is ready
   */
  // async initializeSignalR(): Promise<void> {
  //   const connection = new HubConnectionBuilder()
  //     .withUrl(this.client.defaults.baseURL + '/gamehub')
  //     .withAutomaticReconnect()
  //     .build()
  //
  //   this.signalRConnection = connection
  //   await connection.start()
  // }

  /**
   * Placeholder methods - to be implemented
   */
}
