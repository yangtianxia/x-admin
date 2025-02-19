import { shallowMerge } from '@txjs/shared'
import { genPresetColor } from './genPresetColor'
import { genFunctionalColor } from './genFunctionalColor'
import { light } from '../seed'

const theme = genFunctionalColor(light)

shallowMerge(theme.colors, genPresetColor(light))

export default theme
