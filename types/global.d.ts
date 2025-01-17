/// <reference types="@txjs/types" />

declare module '*.vue'
declare module '*.tsx'
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
  type SeedToken = typeof import('ant-design-vue')['theme']['defaultSeed']

  const $bem: typeof import('@txjs/bem')['default']
  const $http: typeof import('../src/shared/http')['default']
  const seedToken: Partial<SeedToken & Record<string, Partial<SeedToken>>>

  interface RouterViewEvent {
    Component: any
    route: import('vue-router').RouteLocationNormalized
  }
}

export {}
