/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_MOCK?: 'true' | 'false'
  VITE_API: string
  VITE_PROXY_API: string
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>
}
