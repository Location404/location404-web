<template>
  <div class="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
    <div class="w-[90%] h-[90%] bg-gray-900/95 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 class="text-3xl font-bold text-center">Resultado da Rodada {{ roundNumber }}</h2>
      </div>

      <!-- Content -->
      <div class="flex-1 flex flex-col md:flex-row gap-4 p-6 overflow-hidden">
        <!-- Map Section (Left/Top) -->
        <div class="flex-1 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
          <RoundResultMap
            :api-key="apiKey"
            :correct-answer="correctAnswer"
            :player-a-guess="playerAGuess"
            :player-b-guess="playerBGuess"
            :is-player-a="isPlayerA"
          />
        </div>

        <!-- Stats Section (Right/Bottom) -->
        <div class="w-full md:w-96 flex flex-col gap-4">
          <!-- Your Result -->
          <div class="bg-gray-800/80 rounded-xl p-6 border-2"
               :class="myPoints! > opponentPoints! ? 'border-green-500' : myPoints! < opponentPoints! ? 'border-red-500' : 'border-yellow-500'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">Você</h3>
              <div class="text-3xl font-bold"
                   :class="myPoints! > opponentPoints! ? 'text-green-400' : myPoints! < opponentPoints! ? 'text-red-400' : 'text-yellow-400'">
                {{ myPoints }} pts
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-white/80">
                <span>Distância:</span>
                <span class="font-semibold text-white">{{ myDistance.toFixed(2) }} km</span>
              </div>
              <div class="flex justify-between text-white/80">
                <span>Coordenadas:</span>
                <span class="font-mono text-xs text-white">{{ myGuess.x.toFixed(2) }}°, {{ myGuess.y.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <!-- Opponent Result -->
          <div class="bg-gray-800/80 rounded-xl p-6 border-2"
               :class="opponentPoints! > myPoints! ? 'border-green-500' : opponentPoints! < myPoints! ? 'border-red-500' : 'border-yellow-500'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">Oponente</h3>
              <div class="text-3xl font-bold"
                   :class="opponentPoints! > myPoints! ? 'text-green-400' : opponentPoints! < myPoints! ? 'text-red-400' : 'text-yellow-400'">
                {{ opponentPoints }} pts
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-white/80">
                <span>Distância:</span>
                <span class="font-semibold text-white">{{ opponentDistance.toFixed(2) }} km</span>
              </div>
              <div class="flex justify-between text-white/80">
                <span>Coordenadas:</span>
                <span class="font-mono text-xs text-white">{{ opponentGuess.x.toFixed(2) }}°, {{ opponentGuess.y.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <!-- Correct Location -->
          <div class="bg-green-900/40 rounded-xl p-6 border-2 border-green-500/50">
            <h3 class="text-xl font-bold text-green-400 mb-4">Localização Correta</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-white/80">
                <span>Coordenadas:</span>
                <span class="font-mono text-xs text-white">{{ correctAnswer.x.toFixed(2) }}°, {{ correctAnswer.y.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <!-- Match Score -->
          <div class="bg-gray-800/80 rounded-xl p-6 border-2 border-white/20 mt-auto">
            <h3 class="text-lg font-bold text-white mb-3 text-center">Placar Geral</h3>
            <div class="flex justify-center items-center gap-6">
              <div class="text-center">
                <p class="text-sm text-white/60">Você</p>
                <p class="text-3xl font-bold text-white">{{ myTotalPoints }}</p>
              </div>
              <div class="text-2xl text-white/60 font-bold">VS</div>
              <div class="text-center">
                <p class="text-sm text-white/60">Oponente</p>
                <p class="text-3xl font-bold text-white">{{ opponentTotalPoints }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-gray-800/50 p-6 border-t-2 border-white/10">
        <div class="flex justify-center">
          <button
            @click="handleContinue"
            class="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl transition transform hover:scale-105 shadow-lg"
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
  playerAGuess: Coordinate
  playerBGuess: Coordinate
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

const myDistance = computed(() => calculateDistance(myGuess.value, props.correctAnswer))
const opponentDistance = computed(() => calculateDistance(opponentGuess.value, props.correctAnswer))

const handleContinue = () => {
  emit('continue')
}
</script>
