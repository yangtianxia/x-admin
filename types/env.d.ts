/// <reference types="vite/client" />

interface ImportMetaEnv {
  API: string
  REMOTE: string
  VITE_TITLE: string
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>
}
