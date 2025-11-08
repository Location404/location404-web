<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="w-[80%] md:w-[80%] min-h-[80vh] shrink-0 flex flex-col relative bg-white/15 rounded-2xl shadow-xl border-2 border-white/25 ring-1 ring-green-light/20 mb-20 overflow-hidden"
      :class="{ 'p-6 md:p-10': !inMatch }"
    >
      <!-- Background for idle/searching states -->
      <div
        v-if="!inMatch"
        class="absolute inset-0 bg-cover bg-center filter blur-sm"
        :style="{ backgroundImage: `url(${background})` }"
      ></div>

      <!-- Street View Panorama (when in match and location available) -->
      <div v-if="inMatch && state.currentLocation" class="absolute inset-0 rounded-2xl overflow-hidden">
        <StreetViewPanorama :location="state.currentLocation" :api-key="googleMapsApiKey" />
      </div>

      <!-- Main Content Overlay (only for idle/searching/match-found) -->
      <div v-if="!inMatch" class="relative z-10 w-full flex-1 flex flex-col">
        <!-- Matchmaking: Idle State - Show Play Button -->
        <div v-if="!isSearching && !isMatchFound" class="flex-1 flex items-center justify-center">
          <button
            type="button"
            @click="handleFindMatch"
            class="flex items-center justify-center w-32 h-32 rounded-full text-white bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-2xl"
            aria-label="Play"
          >
            <svg class="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <!-- Matchmaking: Searching State -->
        <div v-if="isSearching" class="flex-1 flex items-center justify-center">
          <div class="flex flex-col items-center gap-6 bg-black/60 backdrop-blur-md rounded-2xl p-8">
            <div class="flex justify-center">
              <svg
                class="animate-spin h-16 w-16 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p class="text-white text-xl font-semibold">Procurando oponente...</p>
            <button
              @click="handleLeaveQueue"
              class="px-6 py-3 bg-red-500/80 hover:bg-red-600 text-white font-semibold rounded-lg transition"
            >
              Cancelar Busca
            </button>
          </div>
        </div>

        <!-- Match Found: Countdown State -->
        <div v-if="isMatchFound" class="flex-1 flex items-center justify-center">
          <div class="flex flex-col items-center gap-6 bg-black/60 backdrop-blur-md rounded-2xl p-8">
            <p class="text-white text-2xl font-bold mb-2">Partida Encontrada!</p>
            <div class="relative flex items-center justify-center">
              <!-- Countdown Circle Progress -->
              <svg class="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="none"
                  class="text-white/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="none"
                  class="text-green-500 transition-all duration-1000 ease-linear"
                  :style="{
                    strokeDasharray: `${2 * Math.PI * 56}`,
                    strokeDashoffset: `${Math.max(0, 2 * Math.PI * 56 * (1 - Math.min(1, countdownSeconds / 3)))}`

                  }"
                  stroke-linecap="round"
                />
              </svg>
              <!-- Countdown Number -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-6xl font-black text-white">{{ countdownSeconds }}</span>
              </div>
            </div>
            <p class="text-white/80 text-lg">Iniciando em...</p>
          </div>
        </div>
      </div>

      <!-- Game Screen: Match Found (separate layer, same level as Street View) -->
      <div v-if="inMatch" class="absolute inset-0 pointer-events-none">
        <!-- Top Bar: Match Info -->
        <div class="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-md border-b border-white/10 p-3 pointer-events-auto z-40">
          <div class="flex justify-between items-center">
            <!-- Score Info -->
            <div class="flex items-center gap-4">
              <div class="bg-white/10 rounded-lg px-3 py-1.5">
                <p class="text-xs text-white/60">Você</p>
                <p class="text-lg font-bold text-white">
                  {{
                    isPlayerA
                      ? state.currentMatch?.playerATotalPoints || 0
                      : state.currentMatch?.playerBTotalPoints || 0
                  }}
                  pts
                </p>
              </div>
              <span class="text-white/80 text-sm font-bold">VS</span>
              <div class="bg-white/10 rounded-lg px-3 py-1.5">
                <p class="text-xs text-white/60">Oponente</p>
                <p class="text-lg font-bold text-white">
                  {{
                    isPlayerA
                      ? state.currentMatch?.playerBTotalPoints || 0
                      : state.currentMatch?.playerATotalPoints || 0
                  }}
                  pts
                </p>
              </div>
            </div>

            <!-- Round Info -->
            <div v-if="state.currentRound" class="bg-white/10 rounded-lg px-3 py-1.5">
              <p class="text-xs text-white/80">
                Rodada <span class="font-bold">{{ state.currentRound.roundNumber }}</span> de 3
              </p>
            </div>
          </div>
        </div>

        <!-- Guess Map (Bottom Right Corner) - clickable -->
        <div
          v-if="state.currentRound && state.gameStatus === 'round_active'"
          class="absolute bottom-20 right-4 w-64 h-40 hover:w-[600px] hover:h-[450px] rounded-lg overflow-hidden shadow-2xl border-2 border-white/30 transition-all duration-300 ease-in-out pointer-events-auto z-50"
        >
          <GuessMap
            :api-key="googleMapsApiKey"
            v-model="state.myGuess"
          />
        </div>

        <!-- Bottom Bar: Actions - clickable -->
        <div
          v-if="state.currentRound"
          class="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-3 pointer-events-auto z-40"
        >
          <div class="flex justify-center">
            <button
              v-if="state.myGuess && state.gameStatus === 'round_active'"
              @click="handleConfirmGuess"
              class="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Confirmar Palpite
            </button>
            <div v-else-if="state.gameStatus === 'round_active'" class="text-white/60 text-xs">
              Clique no mini-mapa para fazer seu palpite
            </div>
            <div v-else class="text-white/60 text-xs">
              Rodada {{ state.currentRound?.roundNumber || 0 }} - Status: {{ state.gameStatus }}
            </div>
          </div>
        </div>
      </div>

      <!-- Round Result Overlay -->
      <RoundResult
        v-if="state.gameStatus === GameStatus.ROUND_ENDED && state.currentRound?.gameResponse"
        :api-key="googleMapsApiKey"
        :round-number="state.currentRound.roundNumber"
        :correct-answer="state.currentRound.gameResponse"
        :player-a-guess="state.currentRound.playerAGuess!"
        :player-b-guess="state.currentRound.playerBGuess!"


        :player-a-points="state.currentRound.playerAPoints"
        :player-b-points="state.currentRound.playerBPoints"
        :player-a-total-points="state.currentMatch?.playerATotalPoints ?? null"
        :player-b-total-points="state.currentMatch?.playerBTotalPoints ?? null"
        :is-player-a="isPlayerA"
        :can-start-new-round="(state.currentMatch?.gameRounds?.length ?? 0) < 3"
        @continue="handleContinueFromResult"
      />

      <!-- Match Result Overlay -->
      <MatchResult
        v-if="state.gameStatus === GameStatus.MATCH_ENDED && state.currentMatch"
        :winner-id="state.currentMatch.playerWinnerId"
        :loser-id="state.currentMatch.playerLoserId"
        :player-a-total-points="state.currentMatch.playerATotalPoints"
        :player-b-total-points="state.currentMatch.playerBTotalPoints"
        :points-earned="state.currentMatch.pointsEarned"
        :points-lost="state.currentMatch.pointsLost"
        :rounds="state.currentMatch.gameRounds ?? []"
        :is-player-a="isPlayerA"
        :current-player-id="authStore.userStore?.userId ?? ''"
        @play-again="handlePlayAgain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameEngine } from '@/composables'
import { useAuthStore } from '@/stores/auth'
import { GameStatus } from '@/types'
import { runtimeConfig } from '@/config/runtime.config'
import StreetViewPanorama from './StreetViewPanorama.vue'
import GuessMap from './GuessMap.vue'
import RoundResult from './RoundResult.vue'
import MatchResult from './MatchResult.vue'
import background from '@/assets/bg.png'

const googleMapsApiKey = runtimeConfig.googleMapsApiKey || ''
const authStore = useAuthStore()

const {
  state,
  isSearching,
  inMatch,
  isPlayerA,
  isMatchFound,
  countdownSeconds,
  connect,
  joinMatchmaking,
  leaveMatchmaking,
  startRound,
  submitGuess,
  resetState,
} = useGameEngine()

onMounted(async () => {
  await connect()
})

const handleFindMatch = async () => {
  await joinMatchmaking()
}

const handleLeaveQueue = async () => {
  await leaveMatchmaking()
}

const handleConfirmGuess = async () => {
  if (!state.value.myGuess) return

  await submitGuess(state.value.myGuess.x, state.value.myGuess.y)
}

const handleContinueFromResult = async () => {
  if (state.value.currentMatch?.gameRounds && state.value.currentMatch.gameRounds.length < 3) {
    // Start next round
    await startRound()
  }
  // If match ended, the handler will take care of showing match end screen
}

const handlePlayAgain = async () => {
  resetState()
  await joinMatchmaking()
}
</script>
