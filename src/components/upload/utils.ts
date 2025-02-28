import { assetRemote } from '@/shared/asset'
import type { UploadFile, UploadResponse } from './types'

export const isVia = (file: UploadFile) => {
  return !!file.status && ['success', 'done'].includes(file.status)
}

export const fileToObj = (path: string) => {
  const uid = path.replace(/^.*\//, '')
  const remote = path
  return {
    uid,
    remote,
    name: uid,
    thumbUrl: assetRemote(remote),
    status: 'done' as const,
  }
}

export const formatFile = (
  obj: Record<string, any>,
  formatter?: (value: any) => string[]
) => {
  const result = {} as Record<string, string[]>
  for (const key in obj) {
    const item = obj[key]
    result[key] = formatter?.(key) ?? [item]
  }
  return result
}

export const makeUpload = () => {
  return [] as UploadFile<UploadResponse>[]
}

export const makeUploadLimit = (quantity = 1) => ({
  trigger: 'change' as const,
  validator: async (_: any, values: UploadFile[]) => {
    if (values.length < quantity) {
      throw new Error(`[0] 最少上传 ${quantity} 个`)
    }
  },
})

export const makeUploadException = () => ({
  trigger: 'change' as const,
  validator: async (_: any, values: UploadFile[]) => {
    if (values.some((file) => file.status === 'error')) {
      throw new Error('有文件上传异常')
    }
  },
})
