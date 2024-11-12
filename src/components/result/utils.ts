import type { PropType } from 'vue'
import type { ResultStatus } from './types'

const resolve = (path: string) => {
  return new URL(`image/${path}`, import.meta.url).href
}

export const resultSharedProps = {
  status: {
    type: [String, Object] as PropType<ResultStatus>,
    default: null as unknown
  }
}

export const resultStatusConfig = {
  404: {
    title: $t('result.title.404'),
    image: resolve('404.svg')
  },
  500: {
    title: $t('result.title.500'),
    image: resolve('500.svg')
  },
  network: {
    title: $t('result.title.network'),
    image: resolve('network.svg')
  },
  error: {
    title: $t('result.title.error'),
    image: resolve('error.svg')
  }
} as const
