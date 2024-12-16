import { isURL } from '@txjs/bool'
import { currentAPI } from '@/shared/utils'

const pattern = /^data:image\/(.*);base64,$/i

export const useLocal = (path: string) => {
  return new URL(path, import.meta.url).href
}

export const useAssets = (path: string) => {
  return useLocal(`@/assets/${path}`)
}

export const useRemote = (path?: string) => {
  if (!path) return

  if (isURL(path) || pattern.test(path)) {
    return path
  }
  return `${currentAPI()}${path}`
}
