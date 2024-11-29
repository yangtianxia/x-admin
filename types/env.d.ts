/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 全局前缀 */
  VITE_PREFIX: string
  /** 网站标题 */
  VITE_TITLE: string
  /** 接口地址 */
  VITE_API: string
  /** 接口代理地址 */
  VITE_PROXY_API: string
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>
}
