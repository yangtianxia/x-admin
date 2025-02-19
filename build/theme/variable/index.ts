import { camelToKebab } from '@txjs/shared'
import { light, dark } from '../seed'
import { getSeedTokenValue, genCSSVariable } from './genCSSVariable'

const genVariable = () => {
  return Object.keys(light)
    .reduce(
      (ret, key) => {
        ret[key as keyof typeof light] = `var(--${camelToKebab(key)}) /* ${getSeedTokenValue(key, light)} */`
        return ret
      }, {} as Record<keyof typeof light, string>
    )
}

export default {
  ...genVariable(),
  light: genCSSVariable(light),
  dark: genCSSVariable(dark, true)
}
