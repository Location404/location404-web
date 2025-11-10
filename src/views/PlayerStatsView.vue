<template>
  <div class="player-stats-view">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">📊 Minhas Estatísticas</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregando estatísticas...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="stats" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-gray-500 text-sm">Pontos ELO</div>
            <div class="text-3xl font-bold text-blue-600">{{ stats.rankingPoints }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-gray-500 text-sm">Partidas</div>
            <div class="text-3xl font-bold">{{ stats.totalMatches }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-gray-500 text-sm">Win Rate</div>
            <div class="text-3xl font-bold text-green-600">{{ stats.winRate?.toFixed(1) || '0.0' }}%</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-gray-500 text-sm">Maior Pontuação</div>
            <div class="text-3xl font-bold text-purple-600">{{ stats.highestScore }}</div>
          </div>
        </div>

        <!-- Detailed Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4">Estatísticas Detalhadas</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div class="text-gray-500 text-sm">Vitórias</div>
              <div class="text-2xl font-bold text-green-600">{{ stats.wins }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Derrotas</div>
              <div class="text-2xl font-bold text-red-600">{{ stats.losses }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Empates</div>
              <div class="text-2xl font-bold text-gray-600">{{ stats.draws }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Rodadas Jogadas</div>
              <div class="text-2xl font-bold">{{ stats.totalRoundsPlayed }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Pontos Totais</div>
              <div class="text-2xl font-bold">{{ stats.totalPoints.toLocaleString() }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Média por Rodada</div>
              <div class="text-2xl font-bold">{{ Math.round(stats.averagePointsPerRound || 0) }}</div>
            </div>
            <div class="col-span-2">
              <div class="text-gray-500 text-sm">Erro Médio de Distância</div>
              <div class="text-2xl font-bold">{{ Math.round(stats.averageDistanceErrorKm || 0) }} km</div>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Última Partida</div>
              <div class="text-sm text-gray-700">
                {{ stats.lastMatchAt ? new Date(stats.lastMatchAt).toLocaleString('pt-BR') : 'Nunca' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Match History -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4">Histórico de Partidas</h2>
          <div v-if="loadingMatches" class="text-center py-4">
            <p class="text-gray-600">Carregando partidas...</p>
          </div>
          <div v-else-if="matches.length === 0" class="text-center py-4 text-gray-500">
            Nenhuma partida encontrada
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="match in matches"
              :key="match.id"
              class="border rounded p-4 hover:bg-gray-50"
            >
              <div class="flex justify-between items-center">
                <div>
                  <span class="font-bold">
                    {{ match.winnerId === playerId ? '✅ Vitória' : match.loserId === playerId ? '❌ Derrota' : '🤝 Empate' }}
                  </span>
                  <span class="text-gray-500 ml-2">
                    {{ new Date(match.startedAt).toLocaleDateString('pt-BR') }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="font-bold">
                    {{ match.playerAId === playerId ? match.playerATotalPoints : match.playerBTotalPoints }} pts
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ match.rounds.length }} rodadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Você ainda não jogou nenhuma partida. Comece agora para ver suas estatísticas!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import geoDataService, { type PlayerStats, type GameMatch } from '@/services/geoDataService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const playerId = computed(() => authStore.userStore?.userId || '')

const stats = ref<PlayerStats | null>(null)
const matches = ref<GameMatch[]>([])
const loading = ref(false)
const loadingMatches = ref(false)
const error = ref<string | null>(null)

const loadStats = async () => {
  if (!playerId.value) {
    error.value = 'Você precisa estar logado para ver suas estatísticas'
    return
  }

  loading.value = true
  error.value = null

  try {
    stats.value = await geoDataService.getPlayerStats(playerId.value)
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Nenhuma estatística encontrada. Jogue algumas partidas!'
    } else {
      error.value = err.response?.data?.message || 'Erro ao carregar estatísticas'
    }
    console.error('Error loading stats:', err)
  } finally {
    loading.value = false
  }
}

const loadMatches = async () => {
  if (!playerId.value) return

  loadingMatches.value = true

  try {
    matches.value = await geoDataService.getPlayerMatches(playerId.value, 0, 10)
  } catch (err) {
    console.error('Error loading matches:', err)
  } finally {
    loadingMatches.value = false
  }
}

onMounted(() => {
  loadStats()
  loadMatches()
})
</script>

<style scoped>
.player-stats-view {
  min-height: 100vh;
  background-color: #f3f4f6;
}
</style>
