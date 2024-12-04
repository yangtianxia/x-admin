export const printWarn = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.warn(...args)
  }
}

export const currentAPI = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API
  }
  return import.meta.env.VITE_MOCK !== 'enable' ? import.meta.env.VITE_PROXY_API : ''
}

export const toIOSDate = (value: string) => {
  if (value.includes('-')) {
    return value.replace(/-/g, '/')
  }
  return value
}

export const camelToKebab = (input?: string) => {
  return input?.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
