// Vue
import {
  defineComponent,
  Transition,
  KeepAlive
} from 'vue'

// Common
import { RouterView, type RouteLocationNormalized } from 'vue-router'

interface RouterViewEvent  {
  Component: any
  route: RouteLocationNormalized
}

export default defineComponent({
  name: 'LayoutPage',
  setup() {
    return () => (
      <RouterView
        v-slots={{
          default: ({ Component, route }: RouterViewEvent) => (
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
