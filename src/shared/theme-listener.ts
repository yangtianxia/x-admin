import mitt, { type Handler } from 'mitt'
import { THEME_LIGHT, THEME_DARK } from '@/constant/theme'

const emitter = mitt()

const key = Symbol('THEME_CHANGE')

let themeMedia: MediaQueryList | null

function formatTheme(matches: boolean) {
  return matches ? THEME_LIGHT : THEME_DARK
}

function changeHandler(evt: MediaQueryListEvent) {
  emitter.emit(key, formatTheme(evt.matches))
}

export function setThemeListener() {
  if (themeMedia) return
  themeMedia = window.matchMedia('(prefers-color-scheme: light)')
  themeMedia.addEventListener('change', changeHandler)
}

export function listenerThemeChange(
  handler: (media: string) => void,
  immediate = true
) {
  emitter.on(key, handler as Handler)
  if (immediate && themeMedia) {
    handler(formatTheme(themeMedia.matches))
  }
}

export function removeThemeListener() {
  emitter.off(key)
  themeMedia?.removeEventListener('change', changeHandler)
  themeMedia = null
}
