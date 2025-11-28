<template>
  <div class="relative w-full h-full" @mouseenter="hasHovered = true">
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Instructions overlay -->
    <div
      v-if="!guess && !hasHovered"
      class="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px] rounded-lg"
    >
      <div class="bg-black/70 text-white px-4 py-2 rounded-lg text-center">
        <p class="text-sm font-semibold">Clique para marcar</p>
      </div>
    </div>

    <!-- Guess marker info -->
    <div
      v-if="guess"
      class="absolute top-2 left-2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs"
    >
      <p class="font-semibold">Palpite marcado</p>
      <p class="text-xs text-white/70">Lat: {{ guess.x.toFixed(2) }}°</p>
      <p class="text-xs text-white/70">Lng: {{ guess.y.toFixed(2) }}°</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { loadGoogleMaps } from '@/services/googleMapsLoader'
import type { Coordinate } from '@/types'

const props = defineProps<{
  apiKey: string
  modelValue?: Coordinate | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Coordinate]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const guess = ref<Coordinate | null>(props.modelValue || null)
const hasHovered = ref(false)

let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null

const initMap = async () => {
  if (!mapContainer.value) return

  try {
    await loadGoogleMaps(props.apiKey)

    // Double-check that google.maps is available
    if (!(window as any).google?.maps) {
      throw new Error('Google Maps not loaded')
    }

    // Initialize map centered on the world
    map = new google.maps.Map(mapContainer.value, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    })

    // Add click listener
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        guess.value = { x: lat, y: lng }
        emit('update:modelValue', guess.value)

        // Update or create marker
        if (marker) {
          marker.setPosition(e.latLng)
        } else {
          marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#22C55E',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
            animation: google.maps.Animation.DROP,
          })
        }

        console.log('Guess placed:', guess.value)
      }
    })

    console.log('Map initialized')
  } catch (error) {
    console.error('Error initializing map:', error)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && map) {
      guess.value = newValue

      const position = { lat: newValue.x, lng: newValue.y }

      if (marker) {
        marker.setPosition(position)
      } else {
        marker = new google.maps.Marker({
          position,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#22C55E',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        })
      }
    } else if (!newValue && marker) {
      marker.setMap(null)
      marker = null
      guess.value = null
    }
  }
)

onMounted(() => {
  initMap()

  if (mapContainer.value) {
    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        google.maps.event.trigger(map, 'resize')
      }
    })
    resizeObserver.observe(mapContainer.value)
  }
})
</script>
