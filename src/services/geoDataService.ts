import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { runtimeConfig } from '@/config/runtime.config'

const API_BASE_URL = runtimeConfig.dataApi || 'http://localhost:5000'

export interface Coordinate {
  x: number
  y: number
}

export interface Location {
  id: string
  coordinate: Coordinate
  name: string
  country: string
  region: string
  heading: number | null
  pitch: number | null
  timesUsed: number
  averagePoints: number | null
  difficultyRating: number | null
  tags: string[]
  isActive: boolean
}

export interface PlayerStats {
  playerId?: string
  totalMatches: number
  wins: number
  losses: number
  draws: number
  winRate?: number
  totalRoundsPlayed: number
  totalPoints: number
  highestScore: number
  averagePointsPerRound?: number
  averageDistanceErrorKm?: number
  rankingPoints: number
  lastMatchAt: string | null
}

export interface GameRound {
  id: string
  roundNumber: number
  locationId: string
  correctAnswer: Coordinate
  playerAId: string
  playerAGuess: Coordinate | null
  playerADistance: number | null
  playerAPoints: number | null
  playerBId: string
  playerBGuess: Coordinate | null
  playerBDistance: number | null
  playerBPoints: number | null
  startedAt: string
  endedAt: string | null
  isCompleted: boolean
}

export interface GameMatch {
  id: string
  playerAId: string
  playerBId: string
  playerATotalPoints: number
  playerBTotalPoints: number
  winnerId: string | null
  loserId: string | null
  startedAt: string
  endedAt: string | null
  isCompleted: boolean
  rounds: GameRound[]
}

class GeoDataService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async getAllLocations(activeOnly = true): Promise<Location[]> {
    const response = await this.axiosInstance.get<Location[]>('/locations', {
      params: { activeOnly }
    })
    return response.data
  }

  async getLocationById(id: string): Promise<Location> {
    const response = await this.axiosInstance.get<Location>(`/locations/${id}`)
    return response.data
  }

  async getRandomLocation(): Promise<Location> {
    const response = await this.axiosInstance.get<Location>('/locations/random')
    return response.data
  }

  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    const response = await this.axiosInstance.get<PlayerStats>(`/players/${playerId}/stats`)
    return response.data
  }

  async getRanking(count = 10): Promise<PlayerStats[]> {
    const response = await this.axiosInstance.get<PlayerStats[]>('/players/ranking', {
      params: { count }
    })
    return response.data
  }

  async getMatchById(matchId: string): Promise<GameMatch> {
    const response = await this.axiosInstance.get<GameMatch>(`/matches/${matchId}`)
    return response.data
  }

  async getPlayerMatches(playerId: string, skip = 0, take = 20): Promise<GameMatch[]> {
    const response = await this.axiosInstance.get<GameMatch[]>(`/matches/player/${playerId}`, {
      params: { skip, take }
    })
    return response.data
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await this.axiosInstance.get('/health')
    return response.data
  }
}

export const geoDataService = new GeoDataService()
export default geoDataService
