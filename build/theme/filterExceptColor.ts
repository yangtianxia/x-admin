import { defaultPresetColorKeys } from './seed'

const whiteList = [...defaultPresetColorKeys, 'color']

const isColor = (key: string) => {
  return whiteList.find((item) => key.startsWith(item))
}

const filterExceptColor = (seedToken: Record<string, any>) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        const resultKey = isColor(key)
        if (resultKey) {
          ret[key] = seedToken[key]
        }
        return ret
      }, {} as Record<string, any>
    )
}

export default filterExceptColor
