import { Validator, createValidation, createMessage } from '@txjs/validator'
import defaults from '@txjs/validator/defaults'
import zhCN from '@txjs/validator/locale/zhCN'

export const validator = new Validator({
  locale: 'zhCN',
  validation: createValidation(defaults),
  messages: {
    zhCN: createMessage(zhCN)
  }
})
