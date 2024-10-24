// Types
import type {
  StrokeLinejoin,
  StrokeLinecap,
  Theme
} from './types'

// Vue
import { defineComponent, type PropType } from 'vue'

// Common
import { camelize } from '@txjs/shared'
import { isNil } from '@txjs/bool'

// Component utils
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next/lib/runtime'
import {
  icons,
  type IconMap,
  type IconMapCamel
} from './map'

const [name] = BEM('icon')

export default defineComponent({
  name,

  props: {
    type: {
      type: String as PropType <IconMap>,
      required: true
    },
    spin: Boolean,
    strokeWidth: Number,
    size: [Number, String],
    theme: String as PropType<Theme>,
    fill: [String, Array] as PropType<string | string[]>,
    strokeLinecap: String as PropType<StrokeLinecap>,
    strokeLinejoin: String as PropType<StrokeLinejoin>
  },

  setup(props) {
    IconProvider({
      ...DEFAULT_ICON_CONFIGS,
      prefix: import.meta.env.VITE_PREFIX
    })

    return () => {
      const { type, ...partial } = props
      const name = camelize(`-${type}`) as IconMapCamel
      const Icon = icons[name]

      if (isNil(Icon)) {
        throw new Error('Icon '.concat(type, ' 图标类型无效'))
      }

      return (
        <Icon {...partial} />
      )
    }
  }
})
