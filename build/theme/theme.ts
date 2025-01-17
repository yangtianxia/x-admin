import { camelToKebab, shallowMerge } from '@txjs/shared'
import { lightTheme, defaultPresetColorKeys, presetColorKeys } from './seed'

export const genDefaultColorMapToken = (seedToken: Record<string, any>) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const resultKey = defaultPresetColorKeys.find((item) => key.startsWith(item))
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

const AliasMapping: Record<string, string> = {
  'bg': 'backgroundColor',
  'border': 'borderColor',
  'text': 'textColor'
}

export const genPresetColorMapToken = (seedToken: Record<string, any>) => {
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
          const [str1, str2] = camelToKebab(trimKey).split('-')
          const type = AliasMapping[str1] || 'colors'
          const colorMap = ret[type][name] ??= {}
          if (str2) {
            colorMap[str2] = value
          } else if (str1 && type === 'colors') {
            colorMap[str1] = value
          } else {
            colorMap['DEFAULT'] = value
          }
          ret[type][name] = colorMap
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

const AntDesignThemeColor = genPresetColorMapToken(lightTheme)

shallowMerge(AntDesignThemeColor.colors, genDefaultColorMapToken(lightTheme))

export { AntDesignThemeColor }
