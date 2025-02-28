import { defineComponent, type PropType, type ExtractPropTypes } from 'vue'
import {
  IconProvider,
  DEFAULT_ICON_CONFIGS,
} from '@icon-park/vue-next/lib/runtime'
import { camelize } from '@txjs/shared'
import { isNil } from '@txjs/bool'
import { printWarn } from '@/shared/utils'

import { icons, type IconMap, type IconMapCamel } from './map'
import type { StrokeLinejoin, StrokeLinecap, Theme } from './types'

const [name] = $bem('x-icon')

const iconProps = {
  type: {
    type: String as PropType<IconMap>,
    required: true as const,
  },
  spin: Boolean,
  strokeWidth: Number,
  size: [Number, String],
  theme: String as PropType<Theme>,
  fill: [String, Array] as PropType<string | string[]>,
  strokeLinecap: String as PropType<StrokeLinecap>,
  strokeLinejoin: String as PropType<StrokeLinejoin>,
}

export type ImageProps = ExtractPropTypes<typeof iconProps>

export default defineComponent({
  name,
  props: iconProps,
  setup(props) {
    IconProvider({
      ...DEFAULT_ICON_CONFIGS,
      prefix: 'x',
    })

    return () => {
      const { type, ...rest } = props
      const name = camelize(`-${type}`) as IconMapCamel
      const Icon = icons[name]

      if (isNil(Icon)) {
        printWarn(`"${type}" 图标类型无效，请添加`)
        return null
      }

      return <Icon {...rest} />
    }
  },
})
