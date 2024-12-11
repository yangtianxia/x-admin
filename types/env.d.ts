/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * MOCK
   * - disable - 禁用
   * - enable - 启用
   */
  VITE_MOCK?: 'disable' | 'enable' | undefined
  /** 接口地址 */
  VITE_API: string
  /** 接口代理地址 */
  VITE_PROXY_API: string
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>
}
