import tinycolor2 from 'tinycolor2'
import { isPlainObject } from '@txjs/bool'

const colorToRgb = (input: string) => {
  const color = tinycolor2(input)
  if (color.isValid()) {
    return Object
      .values(color.toRgb())
      .slice(0, 3)
      .join(' ')
  }
}

const formatColor = (palettes: Record<string, any> = {}, prefix?: string) => {
  return Object
    .keys(palettes)
    .reduce(
      (obj, key) => {
        const value = palettes[key]
        if (isPlainObject(value)) {
          obj.push(...formatColor(value, key))
        }
        const rgb = colorToRgb(value)
        if (rgb) {
          const names = ['--color', prefix, key].filter(Boolean)
          obj.push(`${names.join('-')}:${rgb};`)
        }
        return obj
      }, [] as string[]
    )
    .join('')
}
