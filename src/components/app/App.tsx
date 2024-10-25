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
import { APP_CONTEXT_KEY } from '@/hooks/app-context'

// Component
import { resultSharedProps, type ResultStatus } from '../result'

// Component utils
import { APP_LOADING_KEY } from './AppContext'
import { createInjectionKey } from '../_utils/basic'
import { truthProp } from '../_utils/props'

const [name, bem] = BEM('app')

const appProps = shallowMerge({}, resultSharedProps, {
  loading: truthProp,
  breadcrumbs: Array as PropType<string[]>
})

export type AppProps = ExtractPropTypes<typeof appProps>

export type AppProvide = {
  readonly loading: ComputedRef<boolean>
  readonly status: ComputedRef<ResultStatus>
}

export const APP_KEY = createInjectionKey<AppProvide>(name)

export default defineComponent({
  name,
  props: appProps,
  setup(props, { slots }) {
    const { parent: appContext } = useParent(APP_CONTEXT_KEY)

    const loading = computed(() =>
      appContext?.state.loading ?? props.loading
    )
    const status = computed(() =>
      appContext?.state.status ?? props.status
    )

    provide(APP_LOADING_KEY, () => loading.value)
    provide(APP_KEY, { loading, status })

    return () => (
      <div class={bem()}>
        {slots.default?.()}
      </div>
    )
  }
})
