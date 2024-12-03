import type { PropType } from 'vue'
import type { ResultStatus } from './types'
import { useLocal } from '@/hooks/assets'

import img404 from './image/404.svg'
import img500 from './image/500.svg'
import imgNetwork from './image/network.svg'
import imgError from './image/error.svg'

export const resultSharedProps = {
  status: {
    type: [String, Object] as PropType<ResultStatus>,
    default: null as unknown
  }
}

export const resultStatusConfig = {
  404: {
    title: $t('result.title.404'),
    image: useLocal(img404)
  },
  500: {
    title: $t('result.title.500'),
    image: useLocal(img500)
  },
  network: {
    title: $t('result.title.network'),
    image: useLocal(imgNetwork)
  },
  error: {
    title: $t('result.title.error'),
    image: useLocal(imgError)
  }
} as const

export const hasStatusConfig = (status: any) => {
  return status in resultStatusConfig
}
