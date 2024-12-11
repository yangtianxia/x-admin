// Vue
import {
  defineComponent,
  toRef,
  reactive,
  computed,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Common
import { useCountDown } from '@vant/use'
import {
  omit,
  shallowMerge,
  callInterceptor,
  type Interceptor
} from '@txjs/shared'

// Components
import { Button, type ButtonProps } from 'ant-design-vue'

// Component utils
import { createVNode } from '../_utils/basic'
import {
  VNodeProp,
  makeNumberProp,
  makeStringProp
} from '../_utils/props'

const [name, bem] = $bem('send-code')

const sendCodeProps = shallowMerge({}, {
  interval: makeNumberProp(60),
  size: makeStringProp<ButtonProps['size']>('small'),
  type: makeStringProp<ButtonProps['type']>('text'),
  beforeText: String,
  text: VNodeProp,
  afterText: VNodeProp,
  beforeChange: Function as PropType<Interceptor>
})

const sendCodePropsKeys = [
  'interval',
  'beforeText',
  'text',
  'afterText',
  'beforeChange',
  'finish'
] as const

export type SendCodeProps = ExtractPropTypes<typeof sendCodeProps>

export default defineComponent({
  name,
  props: sendCodeProps,
  setup(props, { slots }) {
    const beforeText = toRef(() => props.beforeText || $t('send-code.text.before'))
    const text = toRef(() => props.text || $t('send-code.text.default'))
    const afterText = toRef(() => props.afterText || $t('send-code.text.after'))
    const state = reactive({
      interval: props.interval,
      disabled: false,
      loading: false,
      finish: false
    })

    const { start, reset } = useCountDown({
      time: state.interval * 1000,
      onChange: ({ total }) => {
        state.interval = Math.floor(total / 1000)
      },
      onFinish: () => {
        state.disabled = false
        state.finish = true
        state.interval = props.interval
        reset()
      }
    })

    const formatTpl = computed(() => beforeText.value.replace(/^\[S\](.*)?$/g, `${state.interval}$1`))

    const onClick = () => {
      state.loading = true
      callInterceptor(props.beforeChange, {
        done: () => {
          state.disabled = true
          state.finish = false
          state.loading = false
          start()
        },
        canceled: () => {
          state.loading = false
        }
      })
    }

    const renderText = () => {
      const node = state.disabled
        ? formatTpl.value
        : state.finish
          ? afterText.value
          : slots.default || text.value
      return createVNode(node)
    }

    return () => (
      <Button
        {...omit(shallowMerge({}, props, state), sendCodePropsKeys)}
        class={bem()}
        onClick={onClick}
      >
        {renderText()}
      </Button>
    )
  }
})
