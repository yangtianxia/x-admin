import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { changeValidatorLocale } from '@/shared/validator'
import { LOCALE_KEY } from '@/shared/constant'

export const useLocale = () => {
  const i18n = useI18n()
  const currentLocale = computed(() =>
    i18n.locale.value
  )
  const changeLocale = (value: string) => {
    if (i18n.locale.value === value) return
    i18n.locale.value = value
    changeValidatorLocale(value)
    localStorage.setItem(LOCALE_KEY, value)
    message.success(i18n.t('header.action.locale'))
  }
  return {
    currentLocale,
    changeLocale
  }
}
