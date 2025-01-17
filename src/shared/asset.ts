import { isAbsoluteUrl } from '@txjs/bool'

const BASE64_REGEX = /^data:image\/(.*);base64,$/i

/** 创建资源链接 */
export const assetUrl = (path: string) => {
  return new URL(path, import.meta.url).href
}

/** 加载本地资源 */
export const assetLocal = (path: string) => {
  return assetUrl(`@/assets/${path}`)
}

/** 加载远程资源 */
export const assetRemote = (path?: string) => {
  if (!path) {
    return ''
  }
  if (isAbsoluteUrl(path) || BASE64_REGEX.test(path)) {
    return path
  }
  return `${import.meta.env.REMOTE}${path}`
}
