import { defaultPresetColorKeys } from './seed'

const whiteList = [...defaultPresetColorKeys, 'color']

const filterExceptColor = (seedToken: Record<string, any>) => {
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        if (whiteList.find((item) => key.startsWith(item))) {
          ret[key] = seedToken[key]
        }
        return ret
      }, {} as Record<string, any>
    )
}

export default filterExceptColor
