// Types
import type { VNode } from '../_utils/types'
import type { ResultCode } from './types'

// Vue
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Common
import { shallowMerge, omit } from '@txjs/shared'
import { isPlainObject, isString } from '@txjs/bool'

// Components
import Image from '../image'

// Component utils
import { createVNode } from '../_utils/basic'
import { VNodeProp } from '../_utils/props'
import { resultSharedProps, resultStatusConfig } from './utils'

const [name, bem] = BEM('result')

const resultProps = shallowMerge({}, resultSharedProps, {
  image: VNodeProp,
  title: VNodeProp,
  desc: VNodeProp,
  bottom: Function as PropType<VNode>,
  refresh: Function as PropType<UnknownCallback>
})

export type ResultProps = ExtractPropTypes<typeof resultProps>

export default defineComponent({
  name,

  props: resultProps,

  setup(props, { slots }) {
    const option = reactive({
      image: props.image,
      title: props.title,
      bottom: props.bottom,
      desc: props.desc
    })

    const withOption = (status: ResultCode, refresh?: UnknownCallback) => {
      const newConfig = resultStatusConfig[status]

      if (newConfig) {
        // 自定义状态不支持设置
        if (refresh && ['error', '500'].includes(status)) {
          option.desc = $t('result.500.desc')
        }

        shallowMerge(option, newConfig)
      }
    }

    const updateOption = () => {
      const currentStatus = props.status
      const currentRefresh = props.refresh
      const newOption = omit(props, ['status', 'refresh'])

      // 重新合并 option
      shallowMerge(option, newOption)

      if (isPlainObject(currentStatus)) {
        const { status, refresh, ...partial } = currentStatus
        if (isString(status)) {
          withOption(status, refresh || currentRefresh)
        }
        shallowMerge(option, partial)
      } else {
        withOption(currentStatus, currentRefresh)
      }
    }

    watch(
      () => props.status,
      updateOption
    )

    onMounted(updateOption)

    const renderImage = () => {
      const image = createVNode(slots.image || option.image, {
        render: (value) => (
          <Image
            lazyLoad={false}
            src={value}
            width="100%"
          />
        )
      })

      if (image) {
        return (
          <div class={bem('img')}>
            {image}
          </div>
        )
      }
    }

    const renderTitle = () => {
      const title = createVNode(slots.title || option.title)

      if (title) {
        return (
          <div class={bem('title')}>
            {title}
          </div>
        )
      }
    }

    const renderDesc = () => {
      const desc = createVNode(slots.desc || option.desc)

      if (desc) {
        return (
          <div class={bem('desc')}>
            {desc}
          </div>
        )
      }
    }

    const renderBottom = () => {
      const bottom = createVNode(slots.default || option.bottom)

      if (bottom) {
        return (
          <div class={bem('bottom')}>
            {bottom}
          </div>
        )
      }
    }

    return () => (
      <div class={bem()}>
        {renderImage()}
        {renderTitle()}
        {renderDesc()}
        {renderBottom()}
      </div>
    )
  }
})
