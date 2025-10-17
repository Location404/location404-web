/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_IDENTITY_API: string
  readonly VITE_GAME_ENGINE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
