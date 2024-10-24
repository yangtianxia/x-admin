import tinycolor2 from 'tinycolor2'
import extend from 'extend'
import { defineConfig } from 'pollen-css/utils'
import { pick } from '@txjs/shared'
import { isArray } from '@txjs/bool'
import { palettes } from './theme.mjs'

const generateSerial = (color, items) => {
	return items
		.reduce(
			(obj, value, index) => {
				if (index === 5) {
					obj[color] = value
				}
				obj[`${color}-${index + 1}`] = value
				return obj
			}, {}
		)
}

const paletteSerial = (palettes) => {
	return Object
		.keys(palettes)
		.reduce(
			(obj, key) => {
				const value = palettes[key]
        if (isArray(value)) {
          extend(obj, generateSerial(key, value))
        } else {
          obj[key] = value
        }
				return obj
			}, {}
		)
}

const alphaColor = (input) => {
  const color = tinycolor2(input)
  if (color.isValid()) {
    return Object
      .values(color.toRgb())
      .slice(0, 3)
      .toString()
  }
  return input
}

const formatterColor = (palettes = {}) => {
  return Object
    .keys(palettes)
    .reduce(
      (obj, key) => {
        const value = palettes[key]
        const color = alphaColor(value)
        const baseName = `${key}-base`
        obj[baseName] = color
        obj[key] = `rgb(var(--color-${baseName}))`
        return obj
      }, {}
    )
}

export default defineConfig((config) => {
  const presetColors = paletteSerial(palettes)
  const modules = pick(config, ['size', 'radius', 'layer', 'line', 'weight'])

  modules.size = {
    ...modules.size,
    none: '0px',
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px'
  }

  modules.weight = pick(modules.weight, ['light', 'regular', 'medium', 'semibold', 'bold'])

  modules.visibility = {
    none: 0,
    1: 0.2,
    2: 0.4,
    3: 0.6,
    4: 0.8,
    5: 1
  }

  modules.duration = {
    fast: '0.2s',
    slow: '0.3s'
  }

  modules.ease = {
    in: 'ease-in',
    out: 'ease-out'
  }

  modules.color = {
    ...formatterColor(presetColors),
    bgcolor: 'var(--color-grey-1)',
    active: 'var(--color-grey-2)',
    border: 'var(--color-grey-3)',
    text: 'var(--color-grey-9)',
    'text-base': 'var(--color-grey-8)',
    'text-light': 'var(--color-grey-7)',
    'text-weak': 'var(--color-grey-6)',
  }

  for (const key in config) {
    if (!modules[key]) {
      modules[key] = false
    }
  }

  return {
    modules,
    output: 'node_modules/pollen-css/dist/pollen.css'
  }
})
