import { defineComponent, ref, reactive, computed } from 'vue'
import { pick } from '@txjs/shared'
import { makeString } from '@txjs/make'
import { useUserStore } from '@/store'
import { useRedirect } from '@/hooks/redirect'
import { validator } from '@/shared/validator'

import { postLoginCode } from '@/api/user/login'

import {
  Form,
  FormItem,
  Input,
  Button,
  message,
  type FormInstance,
} from 'ant-design-vue'
import { Icon } from '@/components/icon'
import { SendCode } from '@/components/send-code'

import style from './index.module.less'

type LoginMethod = 'pwd' | 'sms'

const getDefaultFormModel = () => ({
  /** 登录方式 */
  method: makeString<LoginMethod>('pwd'),
  /** 用户名 */
  username: makeString(),
  /** 登录密码 */
  password: makeString(),
  /** 手机号 */
  telephone: makeString(),
  /** 短信验证码 */
  code: makeString(),
  /** 隐私协议 */
  agree: false,
})

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const userStore = useUserStore()
    const redirect = useRedirect()

    const formRef = ref<FormInstance>()
    const formModel = reactive({
      ...getDefaultFormModel(),
      loading: false,
    })

    /** 是否密码登录 */
    const isPwd = computed(() => formModel.method === 'pwd')

    const formRules = validator.schema({
      username: {
        label: '用户名',
        required: true,
      },
      password: {
        label: '登录密码',
        required: true,
      },
      telephone: {
        label: '手机号码',
        required: true,
        telephone: true,
      },
      code: {
        label: '短信验证码',
        required: true,
        maxlength: 6,
      },
    })

    /** 切换登录方式 */
    const onLoginMethodSwitch = () => {
      if (isPwd.value) {
        formModel.method = 'sms'
      } else {
        formModel.method = 'pwd'
      }
    }

    /** 请求登录验证码 */
    const postLoginCodeReq = async () => {
      try {
        await formRef.value?.validate(['telephone'])
        await postLoginCode(formModel.telephone)
        return true
      } catch {
        return false
      }
    }

    /** 提交登录 */
    const onSubmit = async () => {
      if (formModel.loading) return
      formModel.loading = true
      try {
        if (isPwd.value) {
          const params = pick(formModel, ['username', 'password'])
          await userStore.loginByPwd(params)
        } else {
          const params = pick(formModel, ['telephone', 'code'])
          await userStore.loginBySms(params)
        }
        redirect.back()
        message.success('欢迎回来!')
      } catch {
        formModel.loading = false
      }
    }

    const renderPwd = () => (
      <div key='pwd'>
        <FormItem validateFirst name='username'>
          <Input
            placeholder='用户名'
            prefix={<Icon type='People' />}
            v-model:value={formModel.username}
          />
        </FormItem>
        <FormItem validateFirst name='password'>
          <Input.Password
            visibilityToggle
            placeholder='登录密码'
            prefix={<Icon type='Lock' />}
            v-model:value={formModel.password}
          />
        </FormItem>
      </div>
    )

    const renderSms = () => (
      <div key='sms'>
        <FormItem validateFirst name='telephone'>
          <Input
            type='tel'
            placeholder='手机号码'
            prefix={<Icon type='Phone' />}
            v-model:value={formModel.telephone}
          />
        </FormItem>
        <FormItem validateFirst name='code'>
          <Input
            placeholder='短信验证码'
            prefix={<Icon type='Message' />}
            suffix={<SendCode beforeChange={postLoginCodeReq} />}
            v-model:value={formModel.code}
          />
        </FormItem>
      </div>
    )

    return () => (
      <div
        class={[style.form, 'max-w-[300px] max-sm:flex-auto md:min-w-[300px]']}
      >
        <h5 class='text-h5 text max-sm:hidden'>
          登录 {import.meta.env.VITE_TITLE}
        </h5>
        <p class='mt-1 text-sm text-tertiary max-sm:hidden'>
          一个基于Vue3生态打造的后台应用模版
        </p>
        <Form
          scrollToFirstError
          ref={formRef}
          model={formModel}
          rules={formRules}
          onFinish={onSubmit}
          class='sm:mt-9'
        >
          {isPwd.value ? renderPwd() : renderSms()}
          <div class='mt-6'>
            <Button
              block
              type='primary'
              htmlType='submit'
              loading={formModel.loading}
              disabled={formModel.loading}
            >
              登录
            </Button>
            <Button
              block
              type='text'
              class='mt-2 text-tertiary'
              onClick={onLoginMethodSwitch}
            >
              {isPwd.value ? '验证码' : '密码'}登录
            </Button>
          </div>
        </Form>
      </div>
    )
  },
})
