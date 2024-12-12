import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import tailwindColors from 'tailwindcss/colors'
import tailwindScrollbar from 'tailwind-scrollbar'
import tinycolor from 'tinycolor2'
import { camelToKebab, shallowMerge } from '@txjs/shared'
import { theme } from 'ant-design-vue'
import type { SeedToken } from 'ant-design-vue/es/theme/interface'

const DEFAULT_PRESET_COLORS = {
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

const PRESET_COLORS = {
  /** 品牌色 */
  colorPrimary: tailwindColors.blue['500'],
  /** 成功色 */
  colorSuccess: tailwindColors.green['500'],
  /** 警戒色 */
  colorWarning: tailwindColors.yellow['500'],
  /** 错误色 */
  colorError: tailwindColors.red['500'],
  /** 信息色 */
  colorInfo: tailwindColors.blue['500']
} as const

export const seedToken = {
  ...DEFAULT_PRESET_COLORS,
  ...PRESET_COLORS
}

const defaultSeed = {
  ...theme.defaultSeed,
  ...seedToken
}

export const light = theme.defaultAlgorithm(defaultSeed)

export const dark = theme.darkAlgorithm(defaultSeed)

/** 转CSS Variable白名单 */
const whiteList = [
  'motionUnit',
  'lineType',
  'motionBase',
  'sizeUnit',
  'sizeStep',
  'colorWhite',
  'opacityImage',
  'colorTextBase',
  'colorBgBase',
]

/** 转Hex颜色 */
const hexList = [
  'colorText',
  'colorTextSecondary',
  'colorTextTertiary',
  'colorTextQuaternary'
]

const mixColorWithAlpha = (value: number, aplha: number) => {
  return Math.floor(aplha * parseInt(value.toString()) + 255 * (1 - aplha))
}

const toHex2 = (input: number) => {
  return `0${input.toString(16).toUpperCase()}`.slice(-2)
}

const toHex = (input: string) => {
  const color = tinycolor(input)
  if (color.isValid()) {
    const rgba = color.toRgb()
    const aplha = parseFloat(rgba.a.toString())
    const c = mixColorWithAlpha(rgba.r, aplha)
    const g = mixColorWithAlpha(rgba.g, aplha)
    const b = mixColorWithAlpha(rgba.b, aplha)
    return '#'
      .concat(toHex2(c))
      .concat(toHex2(g))
      .concat(toHex2(b))
  }
  return input
}

const genCSSVariable = (seedToken: SeedToken) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        if (!whiteList.includes(key)) {
          const name = camelToKebab(key)
          const value = hexList.includes(key) ? toHex(seedToken[key]) : seedToken[key]
          ret[`--${name}`] = value
        }
        return ret
      }, {} as Record<string, string>
    )
}

const genDefaultColorMapToken = (seedToken: SeedToken) => {
  const presetColorKeys = Object.keys(DEFAULT_PRESET_COLORS)
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const resultKey = presetColorKeys.find((item) => key.startsWith(item))
        if (resultKey) {
          const colorMap = ret[resultKey] || {}
          const index = key.indexOf('-')
          const value = `var(--${key}) /* ${seedToken[key]} */`
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
  const presetColorKeys = Object.keys(PRESET_COLORS)
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
        return ret
      }, {
        colors: {},
        textColor: {},
        backgroundColor: {},
        borderColor: {}
      } as Record<string, Record<string, any>>
    )
}

const presetColors = genPresetColorMapToken(light)

shallowMerge(presetColors.colors, genDefaultColorMapToken(light))

const config: Config = {
  mode: 'jit',
  darkMode: ['class'],
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      inherit: tailwindColors.inherit,
      transparent: tailwindColors.transparent,
      current: tailwindColors.current,
      white: tailwindColors.white,
      black: tailwindColors.black
    },
    extend: {
      ...presetColors,
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
        DEFAULT: `var(--color-border-secondary) /* ${light.colorBorderSecondary} */`,
        100: `var(--color-border) /* ${light.colorBorder} */`
      },
      borderWidth: {
        DEFAULT: `var(--line-width) /* ${light.lineWidth} */`,
        bold: `var(--line-width-bold) /* ${light.lineWidthBold} */`
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
        ':root': genCSSVariable(light),
        '.dark': genCSSVariable(dark),
        'html,:host': {
          'font-family': 'var(--font-family)'
        },
        'html,body': {
          'background-color': 'var(--color-bg-container)'
        }
      })
    })
  ]
}

export default config
