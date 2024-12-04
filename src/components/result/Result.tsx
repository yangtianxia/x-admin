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
import { shallowMerge, pick } from '@txjs/shared'
import { isPlainObject } from '@txjs/bool'
import { resultSharedProps, resultStatusConfig } from './utils'

// Components
import { Image } from '../image'

// Component utils
import { createVNode } from '../_utils/basic'
import { VNodeProp } from '../_utils/props'
import type { VNode } from '../_utils/types'

// Types
import type { ResultCode } from './types'

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

    const merge = (status: ResultCode, refresh?: UnknownCallback) => {
      const config = resultStatusConfig[status]
      if (config) {
        if (refresh) {
          option.desc = $t('result.desc.500')
        }
        shallowMerge(option, config)
      }
    }

    const update = () => {
      const currentStatus = props.status
      const currentRefresh = props.refresh
      const newOption = pick(props, [ 'title', 'image', 'desc', 'bottom' ], true)

      if (isPlainObject(currentStatus)) {
        const { status, refresh, ...partial } = currentStatus
        if (status) {
          merge(status, refresh || currentRefresh)
        }
        shallowMerge(option, partial)
      } else {
        merge(currentStatus, currentRefresh)
      }
      shallowMerge(option, newOption)
    }

    watch(
      () => props.status,
      update
    )

    onMounted(update)

    const renderImage = () => {
      return createVNode(slots.image || option.image, {
        render: (value) => (
          <Image
            class={bem('img')}
            lazyLoad={false}
            src={value}
          />
        )
      })
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
