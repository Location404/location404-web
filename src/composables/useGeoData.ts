import { ref } from 'vue'
import geoDataService, { type PlayerStats, type Location, type GameMatch } from '@/services/geoDataService'

export function useGeoData() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleError = (err: any, defaultMessage: string) => {
    error.value = err.response?.data?.message || defaultMessage
    console.error(err)
  }

  // Locations
  const getRandomLocation = async () => {
    loading.value = true
    error.value = null
    try {
      return await geoDataService.getRandomLocation()
    } catch (err: any) {
      handleError(err, 'Erro ao buscar localização')
      return null
    } finally {
      loading.value = false
    }
  }

  const getAllLocations = async (activeOnly = true) => {
    loading.value = true
    error.value = null
    try {
      return await geoDataService.getAllLocations(activeOnly)
    } catch (err: any) {
      handleError(err, 'Erro ao buscar localizações')
      return []
    } finally {
      loading.value = false
    }
  }

  // Stats
  const getPlayerStats = async (playerId: string) => {
    loading.value = true
    error.value = null
    try {
      return await geoDataService.getPlayerStats(playerId)
    } catch (err: any) {
      handleError(err, 'Erro ao buscar estatísticas do jogador')
      return null
    } finally {
      loading.value = false
    }
  }

  const getRanking = async (count = 10) => {
    loading.value = true
    error.value = null
    try {
      return await geoDataService.getRanking(count)
    } catch (err: any) {
      handleError(err, 'Erro ao buscar ranking')
      return []
    } finally {
      loading.value = false
    }
  }

  // Matches
  const getPlayerMatches = async (playerId: string, skip = 0, take = 20) => {
    loading.value = true
    error.value = null
    try {
      return await geoDataService.getPlayerMatches(playerId, skip, take)
    } catch (err: any) {
      handleError(err, 'Erro ao buscar partidas')
      return []
    } finally {
      loading.value = false
    }
  }

  const getMatchById = async (matchId: string) => {
    loading.value = true
    error.value = null
    try {
      return await geoDataService.getMatchById(matchId)
    } catch (err: any) {
      handleError(err, 'Erro ao buscar partida')
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getRandomLocation,
    getAllLocations,
    getPlayerStats,
    getRanking,
    getPlayerMatches,
    getMatchById
  }
}
