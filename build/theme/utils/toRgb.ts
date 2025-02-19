import tinycolor from 'tinycolor2'
import { toHex } from './toHex'

export const toRgb = (input: string) => {
  const result = tinycolor(toHex(input))
  if (result.isValid()) {
    const rgb = result.toRgb()
    return [rgb.r, rgb.g, rgb.b].join(' ')
  }
  return input
}
