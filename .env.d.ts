/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API: string
  readonly VITE_GAME_API: string
  readonly VITE_DATA_API: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
