type TargetContext = '_self' | '_parent' | '_blank' | '_top'

export const openWindow = (
  url: string,
  options?: {
    target?: TargetContext,
    [key: string]: any
  }
) => {
  const { target = '_blank', ...other } = options || {}
  window.open(
    url,
    target,
    Object.entries(other)
      .reduce(
        (preValue: string[], curValue) => {
          const [key, value] = curValue
          return [...preValue, `${key}=${value}`]
        }, []
      )
      .join(',')
  )
}
