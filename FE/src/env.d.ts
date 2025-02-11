interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly BASE_URL: string
  // LiveKit
  readonly VITE_LIVEKIT_API_KEY: string
  readonly VITE_LIVEKIT_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
