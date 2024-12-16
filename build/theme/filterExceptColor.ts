import { defaultPresetColorKeys } from './seed'

const prefixList = [...defaultPresetColorKeys, 'color']

const isIncludeColor = (key: string) => {
  return prefixList.find((item) => key.startsWith(item))
}

const filterExceptColor = (seedToken: Record<string, any>) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const resultKey = isIncludeColor(key)
        if (resultKey) {
          ret[key] = seedToken[key]
        }
        return ret
      }, {} as Record<string, any>
    )
}

export default filterExceptColor
