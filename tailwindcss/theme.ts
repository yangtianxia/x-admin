import extend from 'extend'
import { theme } from 'ant-design-vue'
import { seedToken } from './seeds'

const defaultTokens = extend(true, {}, theme.defaultSeed, seedToken)

const light = theme.defaultAlgorithm(defaultTokens)

const dark = theme.darkAlgorithm(defaultTokens)

export default { light, dark }
