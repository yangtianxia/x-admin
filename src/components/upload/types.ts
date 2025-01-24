import type { UploadFile as _UploadFile } from 'ant-design-vue'

export type UploadType = 'image' | 'video' | 'file'

export type UploadResponse = {
  success: boolean
  code: number
  msg: string
  data?: {
    path: string
  }
}

export interface UploadFile<T = any> extends _UploadFile<T> {
  remote?: string
}
