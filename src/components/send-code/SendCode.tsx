// Vue
import {
  defineComponent,
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
  beforeText: makeStringProp($t('send-code.text.before')),
  text: {
    type: VNodeProp,
    default: $t('send-code.text.default')
  },
  afterText: {
    type: VNodeProp,
    default: $t('send-code.text.after')
  },
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

    const formatTpl = computed(() =>
      props.beforeText.replace(/^\[S\](.*)?$/g, `${state.interval}$1`)
    )

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
      const text = state.disabled
        ? formatTpl.value
        : state.finish
          ? props.afterText
          : slots.default || props.text
      return createVNode(text)
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
