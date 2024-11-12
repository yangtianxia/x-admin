export const devWarn = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.warn(...args)
  }
}

export const toIOSDate = (value: string) => {
  if (value.includes('-')) {
    return value.replace(/-/g, '/')
  }
  return value
}

export const getCSSVar = (input: string, alpha = 1) => {
  return `rgba(var(--color-${input}-rgb), ${alpha})`
}
