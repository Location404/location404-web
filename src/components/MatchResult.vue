<template>
  <div class="absolute inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center">
    <div class="w-[90%] max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden">
      <!-- Header with Result -->
      <div class="relative overflow-hidden">
        <!-- Background Animation -->
        <div class="absolute inset-0"
             :class="isWinner ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'">
          <div class="absolute inset-0 opacity-20">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJWMzJoMnYyem0wLTRoLTJWMjhoMnYyem0wLTRoLTJWMjRoMnYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-12 text-center text-white">
          <div class="mb-6">
            <div class="text-7xl mb-4">{{ isWinner ? '🏆' : '😔' }}</div>
            <h1 class="text-5xl font-black mb-2">{{ isWinner ? 'VITÓRIA!' : 'DERROTA' }}</h1>
            <p class="text-2xl font-semibold opacity-90">
              {{ isWinner ? 'Parabéns! Você venceu a partida!' : 'Quase lá! Continue treinando!' }}
            </p>
          </div>

          <!-- Points Change -->
          <div class="inline-block bg-black/30 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/20">
            <p class="text-sm uppercase tracking-wider opacity-80 mb-1">Pontos de Ranking</p>
            <p class="text-4xl font-bold"
               :class="isWinner ? 'text-green-300' : 'text-red-300'">
              {{ isWinner ? '+' : '-' }}{{ pointsChange }}
            </p>
          </div>
        </div>
      </div>

      <!-- Match Stats -->
      <div class="p-8 space-y-6">
        <!-- Score Comparison -->
        <div class="bg-gray-800/60 rounded-xl p-6 border border-white/10">
          <h3 class="text-lg font-bold text-white mb-4 text-center">Placar Final</h3>
          <div class="flex justify-center items-center gap-8">
            <div class="text-center">
              <div class="text-sm text-white/60 mb-2">Você</div>
              <div class="text-5xl font-bold"
                   :class="isWinner ? 'text-green-400' : 'text-red-400'">
                {{ myTotalPoints }}
              </div>
            </div>
            <div class="text-3xl text-white/40 font-bold">—</div>
            <div class="text-center">
              <div class="text-sm text-white/60 mb-2">Oponente</div>
              <div class="text-5xl font-bold"
                   :class="!isWinner ? 'text-green-400' : 'text-red-400'">
                {{ opponentTotalPoints }}
              </div>
            </div>
          </div>
        </div>

        <!-- Round by Round -->
        <div class="bg-gray-800/60 rounded-xl p-6 border border-white/10">
          <h3 class="text-lg font-bold text-white mb-4">Desempenho por Rodada</h3>
          <div class="space-y-3">
            <div
              v-for="round in rounds"
              :key="round.id"
              class="flex items-center justify-between bg-gray-700/40 rounded-lg p-4"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <span class="text-blue-300 font-bold">{{ round.roundNumber }}</span>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">Rodada {{ round.roundNumber }}</p>
                  <p class="text-white/60 text-xs">
                    Você: {{ isPlayerA ? round.playerAPoints : round.playerBPoints }} pts |
                    Oponente: {{ isPlayerA ? round.playerBPoints : round.playerAPoints }} pts
                  </p>
                </div>
              </div>
              <div>
                <span
                  v-if="getRoundWinner(round) === 'you'"
                  class="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30"
                >
                  Ganhou
                </span>
                <span
                  v-else-if="getRoundWinner(round) === 'opponent'"
                  class="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30"
                >
                  Perdeu
                </span>
                <span
                  v-else
                  class="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30"
                >
                  Empate
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4 pt-4">
          <button
            @click="handlePlayAgain"
            class="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameRoundDto } from '@/types'

const props = defineProps<{
  winnerId: string | null
  loserId: string | null
  playerATotalPoints: number | null
  playerBTotalPoints: number | null
  pointsEarned: number | null
  pointsLost: number | null
  rounds: GameRoundDto[]
  isPlayerA: boolean
  currentPlayerId: string
}>()

const emit = defineEmits<{
  playAgain: []
}>()

const isWinner = computed(() => props.winnerId === props.currentPlayerId)

const myTotalPoints = computed(() =>
  props.isPlayerA ? props.playerATotalPoints : props.playerBTotalPoints
)

const opponentTotalPoints = computed(() =>
  props.isPlayerA ? props.playerBTotalPoints : props.playerATotalPoints
)

const pointsChange = computed(() =>
  isWinner.value ? props.pointsEarned : props.pointsLost
)

const getRoundWinner = (round: GameRoundDto): 'you' | 'opponent' | 'tie' => {
  const myPoints = props.isPlayerA ? round.playerAPoints : round.playerBPoints
  const opponentPoints = props.isPlayerA ? round.playerBPoints : round.playerAPoints

  if (myPoints === null || opponentPoints === null) return 'tie'
  if (myPoints > opponentPoints) return 'you'
  if (myPoints < opponentPoints) return 'opponent'
  return 'tie'
}

const handlePlayAgain = () => {
  emit('playAgain')
}
</script>
