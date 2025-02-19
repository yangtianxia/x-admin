import { theme } from 'ant-design-vue'
import { comprehensiveColors } from './constants'

const defaultSeed = Object.assign({}, theme.defaultSeed, comprehensiveColors)

export const light = theme.defaultAlgorithm(defaultSeed)

export const dark = theme.darkAlgorithm(defaultSeed)
