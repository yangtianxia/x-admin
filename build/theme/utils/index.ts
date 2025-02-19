import {
  presetColors,
  functionalColors,
  comprehensiveColors
} from '../constants'
import type { SeedToken } from '../types'

const presetColorKeys = Object.keys(presetColors)

const functionalColorKey = Object.keys(functionalColors)

const comprehensiveColorKey = Object.keys(comprehensiveColors)

export const hasPresetColor = (key: string) => {
  return presetColorKeys.includes(key)
}

export const findPresetColor = (key: string) => {
  return presetColorKeys.find((el) => key.startsWith(el))
}

export const hasFunctionalColor = (key: string) => {
  return functionalColorKey.includes(key)
}

export const findFunctionalColor = (key: string) => {
  return functionalColorKey.find((el) => key.startsWith(el))
}

export const hasComprehensiveColor = (key: string) => {
  return comprehensiveColorKey.includes(key)
}

export const matchColors = (seedToken: SeedToken) => {
  const whitelist = [...presetColorKeys, 'color']
  return Object.keys(seedToken)
    .reduce(
      (ret, key) => {
        if (whitelist.find((el) => key.startsWith(el))) {
          ret[key] = seedToken[key]
        }
        return ret
      }, {} as Record<string, any>
    )
}
