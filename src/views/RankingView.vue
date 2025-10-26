<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-light via-gray-600 to-green-medium flex flex-col gap-10">
    <Toolbar />

    <main class="flex-grow overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="w-full h-full flex items-center justify-center">
        <div
          class="w-[80%] md:w-[80%] min-h-[80vh] shrink-0 flex flex-col relative bg-white/15 rounded-2xl shadow-xl border-2 border-white/25 ring-1 ring-green-light/20 mb-20 p-6 md:p-10 overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-cover bg-center filter blur-sm"
            :style="{ backgroundImage: `url(${background})` }"
          ></div>

          <div class="relative z-10 flex flex-col gap-6 h-full">
            <h1 class="text-3xl font-bold text-white text-center">🏆 Ranking Global</h1>

            <div v-if="loading" class="flex-1 flex items-center justify-center">
              <div class="flex flex-col items-center gap-4">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p class="text-white">Carregando ranking...</p>
              </div>
            </div>

            <div v-else-if="error" class="bg-red-500/80 border border-red-400 text-white px-4 py-3 rounded-lg">
              <p>{{ error }}</p>
            </div>

            <div v-else class="flex-1 flex flex-col gap-4 overflow-hidden">
              <div class="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col border border-white/20">
                <div class="overflow-auto flex-1">
                  <table class="min-w-full">
                    <thead class="bg-black/30 sticky top-0">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Posição
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Jogador
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Pontos ELO
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Partidas
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Vitórias
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Win Rate
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Média/Rodada
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10">
                      <tr
                        v-for="(player, index) in ranking"
                        :key="player.playerId"
                        :class="{
                          'bg-yellow-500/20': index === 0,
                          'bg-gray-400/20': index === 1,
                          'bg-orange-500/20': index === 2,
                          'hover:bg-white/10': true
                        }"
                        class="transition-colors"
                      >
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span class="text-lg font-bold text-white">
                            {{ index + 1 }}
                            <span v-if="index === 0">🥇</span>
                            <span v-else-if="index === 1">🥈</span>
                            <span v-else-if="index === 2">🥉</span>
                          </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <div class="text-sm font-medium text-white">
                            {{ player.playerId.substring(0, 8) }}...
                          </div>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <div class="text-sm font-bold text-blue-300">
                            {{ player.rankingPoints }}
                          </div>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-white/80">
                          {{ player.totalMatches }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/60 text-white">
                            {{ player.wins }}
                          </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-white/80">
                          {{ player.winRate.toFixed(1) }}%
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-white/80">
                          {{ Math.round(player.averagePointsPerRound) }} pts
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div v-if="ranking.length === 0" class="text-center py-12 text-white/60">
                    Nenhum jogador no ranking ainda. Seja o primeiro!
                  </div>
                </div>
              </div>

              <div class="text-center">
                <button
                  @click="loadRanking"
                  class="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition border border-white/30"
                >
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Toolbar from '@/components/ToolbarForm.vue'
import geoDataService, { type PlayerStats } from '@/services/geoDataService'
import background from '@/assets/bg.png'

const ranking = ref<PlayerStats[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadRanking = async () => {
  loading.value = true
  error.value = null

  try {
    ranking.value = await geoDataService.getRanking(100)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar ranking'
    console.error('Error loading ranking:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRanking()
})
</script>
