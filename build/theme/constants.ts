import colors from 'tailwindcss/colors'
import { shallowMerge } from '@txjs/shared'

/** 预设颜色 */
export const presetColors = {
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

/** 功能颜色 */
export const functionalColors = {
  /** 品牌色 */
  colorPrimary: colors.blue['500'],
  /** 成功色 */
  colorSuccess: colors.green['500'],
  /** 警戒色 */
  colorWarning: colors.yellow['500'],
  /** 错误色 */
  colorError: colors.red['500'],
  /** 信息色 */
  colorInfo: colors.blue['500']
} as const

/** 全部颜色 */
export const comprehensiveColors = shallowMerge({}, presetColors, functionalColors)
