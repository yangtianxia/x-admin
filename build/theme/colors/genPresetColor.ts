import { findPresetColor, hasPresetColor } from '../utils'
import type { SeedToken } from '../types'

export const genPresetColor = (seedToken: SeedToken) => {
  return Object.keys(seedToken)
    .reduce(
      (ret, key) => {
        const cacheKey = findPresetColor(key)
        if (cacheKey) {
          const foundAt = key.indexOf('-')
          const cacheMap = ret[cacheKey] ??= {}

          let value = `var(--${key}) /* ${seedToken[key]} */`

          if (hasPresetColor(key)) {
            value = `rgb(var(--${key}) / <alpha-value>) /* ${seedToken[key]} */`
          }

          if (foundAt !== -1) {
            const num = parseInt(key.slice(foundAt + 1))
            cacheMap[num === 1 ? num * 50 : (num - 1) * 100] = value
          } else {
            cacheMap['DEFAULT'] = value
          }

          ret[cacheKey] = cacheMap
        }
        return ret
      }, {} as Record<string, Record<string, string>>
    )
}
