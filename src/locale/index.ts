import { createI18n } from 'vue-i18n'
import { LOCALE } from '@/shared/constant'

import en from './lang/en-US'
import cn from './lang/zh-CN'

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
] as const

const defaultLocale = localStorage.getItem(LOCALE) || 'zh-CN'

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  legacy: false,
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': cn
  }
})

export default i18n
