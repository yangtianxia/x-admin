import { defineComponent, inject, type ExtractPropTypes } from 'vue'
import { notNil } from '@txjs/bool'

import { Spin } from 'ant-design-vue'
import { Result } from '../result'
import { truthProp } from '../_utils/props'

import { SCAFFOLD_KEY } from './Scaffold'

const [name, bem] = $bem('x-scaffold-body')

const scaffoldBodyProps = {
  flex: truthProp,
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
      const empty = notNil(status.value)
      return (
        <Spin size="large" spinning={loading.value}>
          {status.value ? (
            <Result status={status.value} />
          ) : (
            <div {...attrs} class={bem({ empty, flex: props.flex })}>
              {slots.default?.()}
            </div>
          )}
        </Spin>
      )
    }
  },
})
