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
  const THEME: {
    token?: import('ant-design-vue/es/theme/interface').AliasToken
    components?: import ('ant-design-vue/es/theme/interface').OverrideToken
  }

  const BEM: typeof import('@txjs/bem')['default']

  const $t: typeof import('../src/locale/t')['default']

  type ScrollElement = Element | Window

  type SetTimeout = ReturnType<typeof setTimeout> | null

  type SetInterval = ReturnType<typeof setInterval> | null

  type UnknownCallback<T = unknown, U = void> = (...args: T[]) => U

  type Numeric = number | string

  type Writeable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type NonNullableFields<T> = {
    [p in keyof T]: NonNullable<T[p]>
  }

  type NonNullableParams<T> = T extends (...args: infer P) => infer R
    ? (...args: { [K in keyof P]-?: NonNullable<P[K]> }) => R
    : never

  type KebabCase<S extends string> = S extends `${infer S1}${infer S2}`
    ? S2 extends Uncapitalize<S2>
      ? `${Uncapitalize<S1>}${KebabCase<S2>}`
      : `${Uncapitalize<S1>}-${KebabCase<S2>}`
    : S
}

export {}
