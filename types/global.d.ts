/// <reference types="@txjs/types" />

declare global {
  type ISeedToken = typeof import('ant-design-vue')['theme']['defaultSeed']

  interface IRouterView<T = any> {
    Component: T
    route: import('vue-router').RouteLocationNormalized
  }

  interface IUserInfo {}

  interface IPageQuery {}

  interface IPageRes<T> {}

  const __SEED_TOKEN__: Partial<ISeedToken & Record<string, Partial<ISeedToken>>>

  const $bem: typeof import('@txjs/bem')['default']

  const $http: typeof import('../src/shared/http')['default']
}

export {}
