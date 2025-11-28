<template>
  <div class="absolute inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-2 md:p-4">
    <div class="w-full h-full max-w-7xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden flex flex-col">
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
        <div class="relative z-10 p-8 text-center text-white">
          <div class="mb-4">
            <h1 class="text-4xl font-black mb-2">{{ isWinner ? 'VITÓRIA!' : 'DERROTA' }}</h1>
            <p class="text-xl font-semibold opacity-90">
              {{ isWinner ? 'Parabéns! Você venceu a partida!' : 'Quase lá! Continue treinando!' }}
            </p>
          </div>

          <!-- Points Change -->
          <div class="inline-block bg-black/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
            <p class="text-xs uppercase tracking-wider opacity-80 mb-1">Pontos de Ranking</p>
            <p class="text-3xl font-bold"
               :class="isWinner ? 'text-green-300' : 'text-red-300'">
              {{ isWinner ? '+' : '-' }}{{ pointsChange }}
            </p>
          </div>
        </div>
      </div>

      <!-- Match Stats -->
      <div class="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        <!-- Score Comparison -->
        <div class="bg-gray-800/60 rounded-xl p-5 border border-white/10">
          <h3 class="text-base font-bold text-white mb-3 text-center">Placar Final</h3>
          <div class="flex justify-center items-center gap-6">
            <div class="text-center">
              <div class="text-xs text-white/60 mb-1">Você</div>
              <div class="text-4xl font-bold"
                   :class="isWinner ? 'text-green-400' : 'text-red-400'">
                {{ myTotalPoints }}
              </div>
            </div>
            <div class="text-2xl text-white/40 font-bold">—</div>
            <div class="text-center">
              <div class="text-xs text-white/60 mb-1">Oponente</div>
              <div class="text-4xl font-bold"
                   :class="!isWinner ? 'text-green-400' : 'text-red-400'">
                {{ opponentTotalPoints }}
              </div>
            </div>
          </div>
        </div>

        <!-- Round by Round -->
        <div class="bg-gray-800/60 rounded-xl p-5 border border-white/10">
          <h3 class="text-base font-bold text-white mb-3">Desempenho por Rodada</h3>
          <div class="space-y-2">
            <div
              v-for="round in rounds"
              :key="round.id"
              class="flex items-center justify-between bg-gray-700/40 rounded-lg p-3"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <span class="text-blue-300 font-bold text-sm">{{ round.roundNumber }}</span>
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
                  class="px-2.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30"
                >
                  Ganhou
                </span>
                <span
                  v-else-if="getRoundWinner(round) === 'opponent'"
                  class="px-2.5 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30"
                >
                  Perdeu
                </span>
                <span
                  v-else
                  class="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30"
                >
                  Empate
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4 pt-2">
          <button
            @click="handlePlayAgain"
            class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-base font-bold rounded-xl transition transform hover:scale-105 shadow-lg"
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
