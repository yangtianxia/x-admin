import { camelToKebab } from '@txjs/shared'
import { findFunctionalColor, hasFunctionalColor } from '../utils'
import type { SeedToken } from '../types'

const alias: Record<string, any> = {
  bg: 'backgroundColor',
  border: 'borderColor',
  text: 'textColor'
}

const defaultValues: Record<string, Record<string, any>> = {
  colors: {},
  textColor: {},
  borderColor: {},
  backgroundColor: {}
}

const defaultType = 'colors'

export const genFunctionalColor = (seedToken: SeedToken) => {
  return Object.keys(seedToken)
    .reduce(
      (ret, key) => {
        const cacheKey = findFunctionalColor(key)
        if (cacheKey) {
          // ''
          // ['bg', 'hover']
          // ['hover']
          // ['active']
          const [str, str2] = camelToKebab(key.slice(cacheKey.length)).split('-')
          const type = alias[str] || defaultType
          const cacheMap = ret[type][cacheKey.slice(5).toLowerCase()] ??= {}

          let value = `var(--${camelToKebab(key)}) /* ${seedToken[key]} */`

          if (hasFunctionalColor(key)) {
            value = `rgb(var(--${camelToKebab(key)}) / <alpha-value>) /* ${seedToken[key]} */`
          }

          if (str2) {
            cacheMap[str2] = value
          } else if (str && type === defaultType) {
            cacheMap[str] = value
          } else {
            cacheMap['DEFAULT'] = value
          }
        }
        return ret
      }, defaultValues
    )
}
