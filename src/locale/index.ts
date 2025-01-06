import { createI18n } from 'vue-i18n'
import { changeValidatorLocale } from '@/shared/validator'
import { LOCALE_KEY } from '@/shared/constant'

import en from './lang/en-US'
import cn from './lang/zh-CN'

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
] as const

const defaultLocale = localStorage.getItem(LOCALE_KEY) || 'zh-CN'

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

changeValidatorLocale(defaultLocale)

export default i18n
