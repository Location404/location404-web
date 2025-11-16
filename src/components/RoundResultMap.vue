<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { loadGoogleMaps } from '@/services/googleMapsLoader'
import type { Coordinate } from '@/types'

const props = defineProps<{
  apiKey: string
  correctAnswer: Coordinate
  playerAGuess: Coordinate | null
  playerBGuess: Coordinate | null
  isPlayerA: boolean
}>()

const mapContainer = ref<HTMLDivElement | null>(null)

let map: google.maps.Map | null = null
let correctMarker: google.maps.Marker | null = null
let playerAMarker: google.maps.Marker | null = null
let playerBMarker: google.maps.Marker | null = null
let polylineA: google.maps.Polyline | null = null
let polylineB: google.maps.Polyline | null = null

const initMap = async () => {
  if (!mapContainer.value) return

  try {
    await loadGoogleMaps(props.apiKey)

    if (!(window as any).google?.maps) {
      throw new Error('Google Maps not loaded')
    }

    // Initialize map centered on correct answer
    map = new google.maps.Map(mapContainer.value, {
      center: { lat: props.correctAnswer.x, lng: props.correctAnswer.y },
      zoom: 3,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })

    // Create correct answer marker (green)
    correctMarker = new google.maps.Marker({
      position: { lat: props.correctAnswer.x, lng: props.correctAnswer.y },
      map: map,
      label: {
        text: '✓',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: '#22C55E',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
      title: 'Localização Correta',
    })

    if (props.playerAGuess) {
      playerAMarker = new google.maps.Marker({
        position: { lat: props.playerAGuess.x, lng: props.playerAGuess.y },
        map: map,
        label: {
          text: props.isPlayerA ? 'V' : 'O',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: props.isPlayerA ? 'Seu Palpite' : 'Palpite do Oponente',
      })
    }

    if (props.playerBGuess) {
      playerBMarker = new google.maps.Marker({
        position: { lat: props.playerBGuess.x, lng: props.playerBGuess.y },
        map: map,
        label: {
          text: props.isPlayerA ? 'O' : 'V',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: props.isPlayerA ? 'Palpite do Oponente' : 'Seu Palpite',
      })
    }

    if (props.playerAGuess) {
      polylineA = new google.maps.Polyline({
        path: [
          { lat: props.playerAGuess.x, lng: props.playerAGuess.y },
          { lat: props.correctAnswer.x, lng: props.correctAnswer.y },
        ],
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        map: map,
      })
    }

    if (props.playerBGuess) {
      polylineB = new google.maps.Polyline({
        path: [
          { lat: props.playerBGuess.x, lng: props.playerBGuess.y },
          { lat: props.correctAnswer.x, lng: props.correctAnswer.y },
        ],
        geodesic: true,
        strokeColor: '#EF4444',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        map: map,
      })
    }

    const bounds = new google.maps.LatLngBounds()
    bounds.extend({ lat: props.correctAnswer.x, lng: props.correctAnswer.y })
    if (props.playerAGuess) {
      bounds.extend({ lat: props.playerAGuess.x, lng: props.playerAGuess.y })
    }
    if (props.playerBGuess) {
      bounds.extend({ lat: props.playerBGuess.x, lng: props.playerBGuess.y })
    }
    map.fitBounds(bounds)

    // Add some padding
    const padding = { top: 50, right: 50, bottom: 50, left: 50 }
    map.fitBounds(bounds, padding)

    console.log('Result map initialized')
  } catch (error) {
    console.error('Error initializing result map:', error)
  }
}

onMounted(() => {
  initMap()
})
</script>
