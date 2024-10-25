// Vue
import {
  defineComponent,
  inject,
  type ExtractPropTypes
} from 'vue'

// Component utils
import { isNil, notNil } from '@txjs/bool'

// Components
import { Spin } from 'ant-design-vue'
import { APP_KEY } from './App'
import { Result } from '../result'

const [name, bem] = BEM('body')

const bodyProps = {
  shrink: Boolean
}

export type BodyProps = ExtractPropTypes<typeof bodyProps>

export default defineComponent({
  name,
  inheritAttrs: false,
  props: bodyProps,
  setup(props, { slots, attrs }) {
    const app = inject(APP_KEY)

    if (isNil(app)) {
      throw new Error('Body必须是App的字组件')
    }

    return () => {
      const { status, loading } = app
      const empty = notNil(status.value)
      return (
        <Spin
          size="large"
          spinning={loading.value}
        >
          {status.value ? (
            <Result status={status.value} />
          ) : (
            <div
              {...attrs}
              class={bem({ empty, shrink: props.shrink })}
            >
              {slots.default?.()}
            </div>
          )}
        </Spin>
      )
    }
  }
})
