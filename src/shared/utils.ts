export const isMockEnabled = import.meta.env.VITE_MOCK === 'true'

export const printWarn = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.warn(...args)
  }
}

export const currentAPI = () => {
  if (isMockEnabled) {
    return ''
  }
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_PROXY_API
  }
  return import.meta.env.VITE_API
}

export const toIOSDate = (value: string) => {
  if (value.includes('-')) {
    return value.replace(/-/g, '/')
  }
  return value
}
