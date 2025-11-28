<template>
  <div class="relative w-full h-full">
    <div ref="streetViewContainer" class="w-full h-full"></div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div class="text-center text-white">
        <svg
          class="animate-spin h-12 w-12 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm">Carregando Street View...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-red-900/80 backdrop-blur-sm"
    >
      <div class="text-center text-white p-6">
        <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="font-bold mb-2">Street View Indisponível</p>
        <p class="text-xs text-white/80">Não há cobertura do Google Street View nesta localização</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { loadGoogleMaps } from '@/services/googleMapsLoader'
import type { LocationData } from '@/types'

const props = defineProps<{
  location: LocationData
  apiKey: string
}>()

const streetViewContainer = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
let panorama: google.maps.StreetViewPanorama | null = null
let streetViewService: google.maps.StreetViewService | null = null

const initStreetView = async () => {
  if (!streetViewContainer.value) return

  isLoading.value = true
  hasError.value = false

  try {
    await loadGoogleMaps(props.apiKey)

    if (!(window as any).google?.maps) {
      throw new Error('Google Maps not loaded')
    }

    const requestedPosition = {
      lat: props.location.x, // X = Latitude
      lng: props.location.y, // Y = Longitude
    }

    console.log('🗺️ Requesting Street View for position:', requestedPosition)

    streetViewService = new google.maps.StreetViewService()

    streetViewService.getPanorama(
      {
        location: requestedPosition,
        radius: 100,
        source: google.maps.StreetViewSource.OUTDOOR,
      },
      (data, status) => {
        if (status === google.maps.StreetViewStatus.OK && data) {
          console.log('✅ Street View available at:', data.location?.latLng?.toJSON())

          panorama = new google.maps.StreetViewPanorama(streetViewContainer.value!, {
            pano: data.location?.pano,
            pov: {
              heading: props.location.heading,
              pitch: props.location.pitch,
            },
            zoom: 0,
            addressControl: false,
            showRoadLabels: false,
            zoomControl: true,
            panControl: false,
            enableCloseButton: false,
            fullscreenControl: false,
            linksControl: true,
            clickToGo: true,
            disableDefaultUI: false,
            disableDoubleClickZoom: false,
            scrollwheel: true,
            motionTracking: false,
            motionTrackingControl: false,
          })

          isLoading.value = false
          hasError.value = false
        } else {
          console.error('Street View not available. Status:', status)
          console.error('Requested position:', requestedPosition)

          isLoading.value = false
          hasError.value = true

          // Fallback: try to initialize anyway
          panorama = new google.maps.StreetViewPanorama(streetViewContainer.value!, {
            position: requestedPosition,
            pov: {
              heading: props.location.heading,
              pitch: props.location.pitch,
            },
            zoom: 0,
            addressControl: false,
            showRoadLabels: false,
            zoomControl: true,
            panControl: false,
            enableCloseButton: false,
            fullscreenControl: false,
            linksControl: true,
            clickToGo: true,
            disableDefaultUI: false,
            disableDoubleClickZoom: false,
            scrollwheel: true,
            motionTracking: false,
            motionTrackingControl: false,
          })

          setTimeout(() => {
            hasError.value = false
          }, 3000)
        }
      }
    )
  } catch (error) {
    console.error('💥 Error initializing Street View:', error)
    isLoading.value = false
    hasError.value = true
  }
}

// Watch for location changes
watch(
  () => props.location,
  (newLocation) => {
    if (!streetViewService || !newLocation) return

    isLoading.value = true
    hasError.value = false

    const position = {
      lat: newLocation.x,
      lng: newLocation.y,
    }

    console.log('🔄 Updating Street View location:', position)

    streetViewService.getPanorama(
      {
        location: position,
        radius: 100,
        source: google.maps.StreetViewSource.OUTDOOR,
      },
      (data, status) => {
        if (status === google.maps.StreetViewStatus.OK && data && panorama) {
          console.log('Street View available at new position:', data.location?.latLng?.toJSON())

          panorama.setPano(data.location?.pano || '')
          panorama.setPov({
            heading: newLocation.heading,
            pitch: newLocation.pitch,
          })

          isLoading.value = false
          hasError.value = false
        } else {
          console.error('Street View not available at new location. Status:', status)

          isLoading.value = false
          hasError.value = true

          if (panorama) {
            panorama.setPosition(position)
            panorama.setPov({
              heading: newLocation.heading,
              pitch: newLocation.pitch,
            })
          }

          setTimeout(() => {
            hasError.value = false
          }, 3000)
        }
      }
    )
  },
  { deep: true }
)

onMounted(() => {
  initStreetView()
})
</script>
