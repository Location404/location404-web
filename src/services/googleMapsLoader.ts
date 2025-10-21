/**
 * Google Maps Loader Service
 * Ensures Google Maps script is loaded only once
 */

let isLoading = false
let isLoaded = false
let loadPromise: Promise<void> | null = null

const waitForGoogleMaps = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if ((window as any).google?.maps) {
        clearInterval(checkInterval)
        resolve()
      }
    }, 50)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve()
    }, 10000)
  })
}

export const loadGoogleMaps = (apiKey: string): Promise<void> => {
  // If already loaded, resolve immediately
  if (isLoaded && (window as any).google?.maps) {
    return Promise.resolve()
  }

  // If currently loading, return the existing promise
  if (isLoading && loadPromise) {
    return loadPromise
  }

  // Start loading
  isLoading = true
  loadPromise = new Promise(async (resolve, reject) => {
    // Check if already loaded by another component
    if ((window as any).google?.maps) {
      isLoaded = true
      isLoading = false
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`
    script.async = true
    script.defer = true

    script.onload = async () => {
      console.log('📦 Script loaded, waiting for google.maps...')
      await waitForGoogleMaps()
      isLoaded = true
      isLoading = false
      console.log('✅ Google Maps ready')
      resolve()
    }

    script.onerror = (error) => {
      isLoading = false
      loadPromise = null
      console.error('❌ Failed to load Google Maps:', error)
      reject(error)
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && !!(window as any).google?.maps
}
