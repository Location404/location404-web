<template>
  <div class="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-4">
    <div class="w-full h-full bg-gray-900/95 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <h2 class="text-2xl font-bold text-center">Resultado da Rodada {{ roundNumber }}</h2>
      </div>

      <!-- Content -->
      <div class="flex-1 flex flex-col md:flex-row gap-2 p-3 overflow-hidden">
        <!-- Map Section (Left/Top) - Ocupa maior parte da tela -->
        <div class="flex-1 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 min-h-[400px] md:min-h-0">
          <RoundResultMap
            :api-key="apiKey"
            :correct-answer="correctAnswer"
            :player-a-guess="playerAGuess"
            :player-b-guess="playerBGuess"
            :is-player-a="isPlayerA"
          />
        </div>

        <!-- Stats Section (Right/Bottom) - Compacta -->
        <div class="w-full md:w-64 flex flex-col gap-2.5 md:overflow-y-auto shrink-0">
          <!-- Your Result -->
          <div class="bg-gray-800/80 rounded-xl p-3 border-2"
               :class="myPoints! > opponentPoints! ? 'border-green-500' : myPoints! < opponentPoints! ? 'border-red-500' : 'border-yellow-500'">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-white">Você</h3>
              <div class="text-xl font-bold"
                   :class="myPoints! > opponentPoints! ? 'text-green-400' : myPoints! < opponentPoints! ? 'text-red-400' : 'text-yellow-400'">
                {{ myPoints }} pts
              </div>
            </div>
            <div v-if="myGuess === null" class="text-red-400 text-center text-xs">
              ⏱️ Tempo esgotado! Sem palpite.
            </div>
            <div v-else class="space-y-1 text-xs">
              <div class="flex justify-between text-white/80">
                <span>Distância:</span>
                <span class="font-semibold text-white">{{ myDistance.toFixed(2) }} km</span>
              </div>
              <div class="flex justify-between text-white/80">
                <span>Coordenadas:</span>
                <span class="font-mono text-[10px] text-white">{{ myGuess.x.toFixed(2) }}°, {{ myGuess.y.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <!-- Opponent Result -->
          <div class="bg-gray-800/80 rounded-xl p-3 border-2"
               :class="opponentPoints! > myPoints! ? 'border-green-500' : opponentPoints! < myPoints! ? 'border-red-500' : 'border-yellow-500'">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-white">Oponente</h3>
              <div class="text-xl font-bold"
                   :class="opponentPoints! > myPoints! ? 'text-green-400' : opponentPoints! < myPoints! ? 'text-red-400' : 'text-yellow-400'">
                {{ opponentPoints }} pts
              </div>
            </div>
            <div v-if="opponentGuess === null" class="text-red-400 text-center text-xs">
              ⏱️ Tempo esgotado! Sem palpite.
            </div>
            <div v-else class="space-y-1 text-xs">
              <div class="flex justify-between text-white/80">
                <span>Distância:</span>
                <span class="font-semibold text-white">{{ opponentDistance.toFixed(2) }} km</span>
              </div>
              <div class="flex justify-between text-white/80">
                <span>Coordenadas:</span>
                <span class="font-mono text-[10px] text-white">{{ opponentGuess.x.toFixed(2) }}°, {{ opponentGuess.y.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <!-- Correct Location -->
          <div class="bg-green-900/40 rounded-xl p-3 border-2 border-green-500/50">
            <h3 class="text-base font-bold text-green-400 mb-2">Localização Correta</h3>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between text-white/80">
                <span>Coordenadas:</span>
                <span class="font-mono text-[10px] text-white">{{ correctAnswer.x.toFixed(2) }}°, {{ correctAnswer.y.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <!-- Match Score -->
          <div class="bg-gray-800/80 rounded-xl p-3 border-2 border-white/20 mt-auto">
            <h3 class="text-sm font-bold text-white mb-2 text-center">Placar Geral</h3>
            <div class="flex justify-center items-center gap-3">
              <div class="text-center">
                <p class="text-[10px] text-white/60">Você</p>
                <p class="text-xl font-bold text-white">{{ myTotalPoints }}</p>
              </div>
              <div class="text-base text-white/60 font-bold">VS</div>
              <div class="text-center">
                <p class="text-[10px] text-white/60">Oponente</p>
                <p class="text-xl font-bold text-white">{{ opponentTotalPoints }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-gray-800/50 p-4 border-t-2 border-white/10">
        <div class="flex justify-center">
          <button
            @click="handleContinue"
            class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-base font-bold rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            {{ canStartNewRound ? 'Próxima Rodada' : 'Ver Resultado Final' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RoundResultMap from './RoundResultMap.vue'
import type { Coordinate } from '@/types'

const props = defineProps<{
  apiKey: string
  roundNumber: number
  correctAnswer: Coordinate
  playerAGuess: Coordinate | null
  playerBGuess: Coordinate | null
  playerAPoints: number | null
  playerBPoints: number | null
  playerATotalPoints: number | null
  playerBTotalPoints: number | null
  isPlayerA: boolean
  canStartNewRound: boolean
}>()

const emit = defineEmits<{
  continue: []
}>()

// Calculate distances using Haversine formula
const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371 // Earth's radius in km
  const lat1 = coord1.x * Math.PI / 180
  const lat2 = coord2.x * Math.PI / 180
  const deltaLat = (coord2.x - coord1.x) * Math.PI / 180
  const deltaLon = (coord2.y - coord1.y) * Math.PI / 180

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const myGuess = computed(() => props.isPlayerA ? props.playerAGuess : props.playerBGuess)
const opponentGuess = computed(() => props.isPlayerA ? props.playerBGuess : props.playerAGuess)

const myPoints = computed(() => props.isPlayerA ? props.playerAPoints : props.playerBPoints)
const opponentPoints = computed(() => props.isPlayerA ? props.playerBPoints : props.playerAPoints)

const myTotalPoints = computed(() => props.isPlayerA ? props.playerATotalPoints : props.playerBTotalPoints)
const opponentTotalPoints = computed(() => props.isPlayerA ? props.playerBTotalPoints : props.playerATotalPoints)

const myDistance = computed(() => myGuess.value ? calculateDistance(myGuess.value, props.correctAnswer) : 0)
const opponentDistance = computed(() => opponentGuess.value ? calculateDistance(opponentGuess.value, props.correctAnswer) : 0)

const handleContinue = () => {
  emit('continue')
}
</script>
