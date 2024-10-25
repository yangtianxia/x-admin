// Vue
import { defineComponent } from 'vue'

// Components
import { Icon } from '@/components/icon'
import { Form, FormItem, Input, Button } from 'ant-design-vue'

// Style
import style from '../index.module.less'

const [name, bem] = BEM('login-form', style)

export default defineComponent({
  name,

  setup() {
    return () => (
      <div class={bem()}>
        <div class={bem('title')}>登录 {import.meta.env.VITE_TITLE}</div>
        <div class={bem('subtitle')}>{import.meta.env.VITE_DESCRIPTION}</div>
        <Form>
          <FormItem>
            <Input
              placeholder="用户名"
              v-slots={{
                prefix: () => (
                  <Icon type="People" />
                )
              }}
            />
          </FormItem>
          <FormItem>
            <Input.Password
              visibilityToggle
              placeholder="登录密码"
              v-slots={{
                prefix: () => (
                  <Icon type="Lock" />
                )
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              block
              type="primary"
            >登录</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
})
