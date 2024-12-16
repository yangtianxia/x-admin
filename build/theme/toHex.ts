import tinycolor from 'tinycolor2'

const mixColorWithAlpha = (value: number, aplha: number) => {
  return Math.floor(aplha * parseInt(value.toString()) + 255 * (1 - aplha))
}

const toHex2 = (input: number) => {
  return `0${input.toString(16).toUpperCase()}`.slice(-2)
}

const toHex = (input: string) => {
  const color = tinycolor(input)
  if (color.isValid()) {
    const rgba = color.toRgb()
    const aplha = parseFloat(rgba.a.toString())
    const c = mixColorWithAlpha(rgba.r, aplha)
    const g = mixColorWithAlpha(rgba.g, aplha)
    const b = mixColorWithAlpha(rgba.b, aplha)
    return '#'.concat(toHex2(c)).concat(toHex2(g)).concat(toHex2(b))
  }
  return input
}

export default toHex
