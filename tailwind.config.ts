import type { Config } from 'tailwindcss'
import extend from 'extend'
import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'
import tailwindScrollbar from 'tailwind-scrollbar'
import { camelToKebab } from '@txjs/shared'
import { theme } from 'ant-design-vue'
import type { SeedToken } from 'ant-design-vue/es/theme/interface'

/** 品牌色 */
const colorPrimary = colors.blue[500]

/** 默认颜色 */
const defaultPresetColors = {
  blue: '#1677ff',
  purple: '#722ED1',
  cyan: '#13C2C2',
  green: '#52C41A',
  magenta: '#EB2F96',
  pink: '#eb2f96',
  red: '#F5222D',
  orange: '#FA8C16',
  yellow: '#FADB14',
  volcano: '#FA541C',
  geekblue: '#2F54EB',
  gold: '#FAAD14',
  lime: '#A0D911'
} as const

const presetColors = {
  /** 品牌色 */
  colorPrimary: colorPrimary,
  /** 成功色 */
  colorSuccess: colors.green['500'],
  /** 警戒色 */
  colorWarning: colors.yellow['500'],
  /** 错误色 */
  colorError: colors.red['500'],
  /** 信息色 */
  colorInfo: colors.blue['500']
} as const

export const seedToken = {
  ...defaultPresetColors,
  ...presetColors
}

const defaultSeed = extend(true, {}, theme.defaultSeed, seedToken)
const light = theme.defaultAlgorithm(defaultSeed)
const dark = theme.darkAlgorithm(defaultSeed)

const defaultPresetColorKeys = Object.keys(defaultPresetColors)
const genDefaultColorMapToken = (seedToken: SeedToken) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const value = seedToken[key]
        const resultKey = defaultPresetColorKeys.find((item) => key.startsWith(item))
        if (resultKey) {
          const colorMap = ret[resultKey] || {}
          const index = key.indexOf('-')
          if (index !== -1) {
            const num = parseInt(key.slice(index + 1))
            if (num === 1) {
              colorMap[num * 50] = value
            } else {
              colorMap[(num - 1) * 100] = value
            }
          } else {
            colorMap['DEFAULT'] = value
          }
          ret[resultKey] = colorMap
        }
        return ret
      }, {} as Record<string, Record<string, any>>
    )
}

const presetColorKeys = Object.keys(presetColors)
const genColorMapToken = (seedToken: SeedToken) => {
  return Object
    .keys(seedToken)
}

const genCssVariable = (seedToken: SeedToken) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const name = camelToKebab(key)
        ret[`--${name}`] = seedToken[key]
        return ret
      }, {} as Record<string, string>
    )
}

const config: Config = {
  mode: 'jit',
  darkMode: ['selector', '[data-mode="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      ...genDefaultColorMapToken(light),
      inherit: colors.inherit,
      transparent: colors.transparent,
      current: colors.current,
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      primary: presetColors.colorPrimary
    },
    extend: {
      textColor: {
        main: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        quaternary: 'var(--color-text-quaternary)'
      },
      backgroundColor: {
        container: 'var(--color-bg-container)',
        elevated: 'var(--color-bg-elevated)',
        layout: 'var(--color-bg-layout)',
        spotlight: 'var(--color-bg-spotlight)',
        fill: {
          DEFAULT: 'var(--color-fill)',
          secondary: 'var(--color-fill-secondary)',
          tertiary: 'var(--color-fill-tertiary)',
          quaternary: 'var(--color-fill-quaternary)'
        }
      },
      borderColor: {
        main: 'var(--color-border)',
        secondary: 'var(--color-border-secondary)'
      },
      fontFamily: {
        main: 'var(--font-family)'
      }
    }
  },
  plugins: [
    tailwindScrollbar,
    plugin(function({ addBase }) {
      addBase({
        '*,*:before,*:after': {
          'border-color': 'var(--color-border-secondary)',
        },
        ':root': genCssVariable(light),
        '.dark': genCssVariable(dark)
      })
    })
  ]
}

export default config
