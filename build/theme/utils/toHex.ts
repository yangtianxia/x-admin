import tinycolor from 'tinycolor2'

const blendChannelWithWhite = (colorChannel: number, alpha: number) => {
  return Math.floor(alpha * colorChannel + 255 * (1 - alpha))
}

const toHex2 = (input: number) => {
  return `0${input.toString(16).toUpperCase()}`.slice(-2)
}

export const toHex = (input: string) => {
  const result = tinycolor(input)
  if (result.isValid()) {
    const rgb = result.toRgb()
    const aplha = parseFloat(rgb.a.toString())
    return `#${[rgb.r, rgb.g, rgb.b].map((el) => toHex2(blendChannelWithWhite(el, aplha))).join('')}`
  }
  return input
}
