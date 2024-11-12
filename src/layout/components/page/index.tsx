// Vue
import {
  defineComponent,
  Transition,
  KeepAlive
} from 'vue'

// Common
import { RouterView, type RouteLocationNormalized } from 'vue-router'

interface RouterViewSlot  {
  Component: any
  route: RouteLocationNormalized
}

const [name] = BEM('page')

export default defineComponent({
  name,
  setup() {
    return () => (
      <RouterView
        v-slots={{
          default: ({ Component, route }: RouterViewSlot) => (
            <Transition
              appear
              name="fade"
              mode="out-in"
            >
              {route.meta.ignoreCache ? <Component key={route.fullPath} /> : (
                <KeepAlive>
                  <Component key={route.fullPath} />
                </KeepAlive>
              )}
            </Transition>
          )
        }}
      />
    )
  }
})
