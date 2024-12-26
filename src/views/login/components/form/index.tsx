// Vue
import {
  defineComponent,
  ref,
  reactive,
  computed
} from 'vue'

// Common
import { pick } from '@txjs/shared'
import { makeString } from '@txjs/make'
import { useUserStore } from '@/stores'
import { useRedirect } from '@/hooks/redirect'
import { validator } from '@/shared/validator'

// Components
import { Icon } from '@/components/icon'
import { SendCode } from '@/components/send-code'
import {
  Form,
  FormItem,
  Input,
  Button,
  message,
  type FormInstance
} from 'ant-design-vue'

// Api
import { postLoginCode } from '@/api/user/login'

// Style
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
  agree: false
})

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const userStore = useUserStore()
    const redirect = useRedirect()

    const formRef = ref<FormInstance>()
    const formModel = reactive({
      ...getDefaultFormModel(),
      loading: false
    })

    /** 是否密码登录 */
    const isPwd = computed(() => formModel.method === 'pwd')

    /** 登录方式文本 */
    const loginMethodLabel = computed(() => formModel.method === 'pwd' ? $t('login.form.method.sms') : $t('login.form.method.pwd'))

    const formRules = validator.schema<typeof formModel>({
      username: {
        label: $t('login.form.label.username'),
        required: true
      },
      password: {
        label: $t('login.form.label.password'),
        required: true
      },
      telephone: {
        label: $t('login.form.label.telephone'),
        required: true,
        telephone: true
      },
      code: {
        label: $t('login.form.label.code'),
        required: true,
        maxlength: 6
      }
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
          await userStore.loginByPwd(
            pick(formModel, ['username', 'password'])
          )
        } else {
          await userStore.loginBySms(
            pick(formModel, ['telephone', 'code'])
          )
        }
        redirect.back()
        message.success($t('login.form.welcome'))
      } catch {
        formModel.loading = false
      }
    }

    const renderPwd = () => (
      <div key="pwd">
        <FormItem
          validateFirst
          name="username"
        >
          <Input
            v-model:value={formModel.username}
            placeholder={$t('login.form.placeholder.username')}
            prefix={<Icon type="People" />}
          />
        </FormItem>
        <FormItem
          validateFirst
          name="password"
        >
          <Input.Password
            v-model:value={formModel.password}
            visibilityToggle
            placeholder={$t('login.form.placeholder.password')}
            prefix={<Icon type="Lock" />}
          />
        </FormItem>
      </div>
    )

    const renderSms = () => (
      <div key="sms">
        <FormItem
          validateFirst
          name="telephone"
        >
          <Input
            v-model:value={formModel.telephone}
            type="tel"
            placeholder={$t('login.form.placeholder.telephone')}
            prefix={<Icon type="Phone" />}
          />
        </FormItem>
        <FormItem
          validateFirst
          name="code"
        >
          <Input
            v-model:value={formModel.code}
            placeholder={$t('login.form.placeholder.code')}
            prefix={<Icon type="Message" />}
            suffix={<SendCode beforeChange={postLoginCodeReq} />}
          />
        </FormItem>
      </div>
    )

    return () => (
      <div class={[style.form, 'md:min-w-[300px] max-w-[300px] max-sm:flex-auto']}>
        <h5 class="text text-h5 max-sm:hidden">{$t('login.form.title')} {$t('page.title')}</h5>
        <p class="text-tertiary text-sm mt-1 max-sm:hidden">{$t('page.description')}</p>
        <Form
          scrollToFirstError
          ref={formRef}
          model={formModel}
          rules={formRules}
          onFinish={onSubmit}
          class="sm:mt-9"
        >
          {isPwd.value ? renderPwd() : renderSms()}
          <div class="mt-6">
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={formModel.loading}
              disabled={formModel.loading}
            >{$t('login.form.submit')}</Button>
            <Button
              block
              type="text"
              class="text-tertiary mt-2"
              onClick={onLoginMethodSwitch}
            >{loginMethodLabel.value}</Button>
          </div>
        </Form>
      </div>
    )
  }
})
