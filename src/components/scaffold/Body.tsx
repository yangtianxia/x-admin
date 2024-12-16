// Vue
import {
  defineComponent,
  inject,
  type ExtractPropTypes
} from 'vue'

// Common
import { notNil } from '@txjs/bool'

// Components
import { Spin } from 'ant-design-vue'
import { Result } from '../result'
import { SCAFFOLD_KEY } from './Scaffold'

// Component utils
import { truthProp } from '../_utils/props'

const [name, bem] = $bem('scaffold-body')

const scaffoldBodyProps = {
  flex: truthProp,
  shrink: Boolean
}

export type ScaffoldBodyProps = ExtractPropTypes<typeof scaffoldBodyProps>

export default defineComponent({
  name,
  inheritAttrs: false,
  props: scaffoldBodyProps,
  setup(props, { slots, attrs }) {
    const scaffold = inject(SCAFFOLD_KEY)

    if (!scaffold) {
      throw new Error('[x-admin] ScaffoldBody必须是Scaffold的子组件！')
    }

    const { status, loading } = scaffold

    return () => {
      const { flex, shrink } = props
      const empty = notNil(status.value)
      return (
        <Spin
          size="large"
          spinning={loading.value}
        >
          {status.value ? <Result status={status.value} /> : (
            <div
              {...attrs}
              class={bem({ flex, shrink, empty })}
            >
              {slots.default?.()}
            </div>
          )}
        </Spin>
      )
    }
  }
})
