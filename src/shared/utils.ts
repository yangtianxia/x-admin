import { isAbsoluteUrl } from '@txjs/bool'
import { camelize } from '@txjs/shared'

export const printWarn = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.warn('[x-admin]', ...args)
  }
}

export const toIOSDate = (value: string) => {
  if (value.includes('-')) {
    return value.replace(/-/g, '/')
  }
  return value
}

export const upperFirst = (value: string) => {
  if (!value || !value.trim()) {
    return ''
  }
  return value.charAt(0).toUpperCase() + value.slice(0)
}

export const transformPathToName = (value: string) => {
  if (!value || isAbsoluteUrl(value)) {
    return ''
  }
  return upperFirst(camelize(value))
}
