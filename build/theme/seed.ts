import tailwindColors from 'tailwindcss/colors'
import { theme } from 'ant-design-vue'

/** 默认色盘 */
export const DEFAULT_PRESET_COLORS = {
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

export const PRESET_COLORS = {
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

export const defaultPresetColorKeys = Object.keys(DEFAULT_PRESET_COLORS)

export const presetColorKeys = Object.keys(PRESET_COLORS)

export const LightTheme = theme.defaultAlgorithm(defaultSeed)

export const DarkTheme = theme.darkAlgorithm(defaultSeed)
