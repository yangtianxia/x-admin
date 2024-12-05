/// <reference types="@txjs/types" />

declare module '*.vue'
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'
declare module '*.json'

declare global {
  const BEM: typeof import('@txjs/bem')['default']
  const $t: typeof import('../src/locale')['default']['global']['t']
  const themeColors: Record<string, string>
}

export {}
