// Vue
import {
  defineComponent,
  computed,
  provide,
  type ComputedRef,
  type ExtractPropTypes,
  type PropType
} from 'vue'

// Common
import { shallowMerge } from '@txjs/shared'
import { useParent } from '@vant/use'
import { SCAFFOLD_CONTEXT_KEY } from '@/hooks/scaffold'

// Component
import { resultSharedProps, type ResultStatus } from '../result'

// Component utils
import { createInjectionKey } from '../_utils/basic'
import { truthProp } from '../_utils/props'
import { SCAFFOLD_LOADING_KEY } from './context'

const [name, bem] = BEM('scaffold')

const scaffoldProps = shallowMerge({}, resultSharedProps, {
  loading: truthProp,
  breadcrumbs: Array as PropType<string[]>
})

export type ScaffoldProps = ExtractPropTypes<typeof scaffoldProps>

export type ScaffoldProvide = {
  readonly loading: ComputedRef<boolean>
  readonly status: ComputedRef<ResultStatus>
}

export const SCAFFOLD_KEY = createInjectionKey<ScaffoldProvide>(name)

export default defineComponent({
  name,
  props: scaffoldProps,
  setup(props, { slots }) {
    const { parent } = useParent(SCAFFOLD_CONTEXT_KEY)

    const loading = computed(() =>
      parent?.state.loading ?? props.loading
    )
    const status = computed(() =>
      parent?.state.status ?? props.status
    )

    provide(SCAFFOLD_LOADING_KEY, () => loading.value)
    provide(SCAFFOLD_KEY, { loading, status })

    return () => (
      <div class={bem()}>
        {slots.default?.()}
      </div>
    )
  }
})
