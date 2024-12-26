import { Validator } from '@txjs/validator'

export const validator = new Validator({
  message: Validator.message,
  validation: Validator.validation
})

export const changeValidatorLocale = (value: string) => {
  switch (value) {
    case 'zh-CN':
      validator.setLocale('zhCN')
      break
    case 'en-US':
      validator.setLocale('enUS')
      break
  }
}
