import type { PropType } from 'vue'
import type { ResultStatus } from './types'
import { assetUrl } from '@/shared/asset'

import img404 from './image/404.svg'
import img500 from './image/500.svg'
import imgNetwork from './image/network.svg'
import imgError from './image/error.svg'

export const resultSharedProps = {
  status: {
    type: [String, Number, Object] as PropType<ResultStatus>,
    default: null as unknown,
  },
}

export const resultStatusConfig = {
  404: {
    title: '页面不存在或已删除',
    image: assetUrl(img404),
  },
  500: {
    title: '抱歉，服务请求异常',
    image: assetUrl(img500),
  },
  network: {
    title: '网络异常，请检查设备网络连接',
    image: assetUrl(imgNetwork),
  },
  error: {
    title: '抱歉，访问发生错误',
    image: assetUrl(imgError),
  },
} as const

export const hasStatusConfig = (status: any) => {
  return status in resultStatusConfig
}
