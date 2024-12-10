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

const genDefaultColorMapToken = (seedToken: SeedToken) => {
  const presetColorKeys = Object.keys(defaultPresetColors)
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const resultKey = presetColorKeys.find((item) => key.startsWith(item))
        if (resultKey) {
          const colorMap = ret[resultKey] || {}
          const index = key.indexOf('-')
          const value = `var(--color-${key}) /* ${seedToken[key]} */`
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
      }, {} as Record<string, Record<string, string>>
    )
}

const genPresetColorMapToken = (seedToken: SeedToken) => {
  const presetColorKeys = Object.keys(presetColors)
  const aliasMaps = {
    'bg': 'backgroundColor',
    'border': 'borderColor',
    'text': 'textColor'
  }
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const resultKey = presetColorKeys.find((item) => key.startsWith(item))
        if (resultKey) {
          const name = resultKey.slice(5).toLowerCase()
          const trimKey = key.slice(resultKey.length)
          const value = `var(--${camelToKebab(key)}) /* ${seedToken[key]} */`
          // ''
          // ['bg', 'hover']
          // ['hover']
          // ['active']
          const [a1, a2] = camelToKebab(trimKey).split('-')
          const alias = aliasMaps[a1] || 'colors'
          const colorMap = ret[alias][name] ??= {}
          if (a2) {
            colorMap[a2] = value
          } else if (alias === 'colors') {
            if (a1) {
              colorMap[a1] = value
            } else {
              colorMap['DEFAULT'] = value
            }
          } else {
            colorMap['DEFAULT'] = value
          }
          ret[alias][name] = colorMap
        }
        console.log(ret)
        return ret
      }, {
        colors: {},
        textColor: {},
        backgroundColor: {},
        borderColor: {}
      } as Record<string, Record<string, any>>
    )
}

const config: Config = {
  mode: 'jit',
  darkMode: ['class'],
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...genDefaultColorMapToken(light),
      inherit: colors.inherit,
      transparent: colors.transparent,
      current: colors.current,
      white: colors.white,
      black: colors.black,
      gray: colors.gray
    },
    borderWidth: {
      DEFAULT: `var(--line-width) /* ${light.lineWidth} */`
    },
    extend: {
      ...genPresetColorMapToken(light),
      textColor: {
        main: `var(--color-text) /* ${light.colorText} */`,
        secondary: `var(--color-text-secondary) /* ${light.colorTextSecondary} */`,
        tertiary: `var(--color-text-tertiary) /* ${light.colorTextTertiary} */`,
        quaternary: `var(--color-text-quaternary) /* ${light.colorTextQuaternary} */`
      },
      backgroundColor: {
        container: `var(--color-bg-container) /* ${light.colorBgContainer} */`,
        elevated: `var(--color-bg-elevated) /* ${light.colorBgElevated} */`,
        layout: `var(--color-bg-layout) /* ${light.colorBgLayout} */`,
        spotlight: `var(--color-bg-spotlight) /* ${light.colorBgSpotlight} */`,
        fill: {
          DEFAULT: `var(--color-fill) /* ${light.colorFill} */`,
          secondary: `var(--color-fill-secondary) /* ${light.colorFillSecondary} */`,
          tertiary: `var(--color-fill-tertiary) /* ${light.colorFillTertiary} */`,
          quaternary: `var(--color-fill-quaternary) /* ${light.colorFillQuaternary} */`
        }
      },
      borderColor: {
        main: `var(--color-border) /* ${light.colorBorder} */`,
        secondary: `var(--color-border-secondary) /* ${light.colorBorderSecondary} */`
      },
      fontFamily: {
        main: `var(--font-family) /* ${light.fontFamily} */`
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
