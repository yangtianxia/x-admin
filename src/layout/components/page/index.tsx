// Vue
import {
  defineComponent,
  Transition,
  KeepAlive,
  h
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
          default: ({ Component, route }: RouterViewSlot) => {
            if (!Component) return

            Component.key = route.fullPath
            Component.type.name = route.name

            return (
              <Transition
                appear
                name="fade"
                mode="out-in"
              >
                {route.meta.ignoreCache ? h(Component) : (
                  <KeepAlive>
                    {h(Component)}
                  </KeepAlive>
                )}
              </Transition>
            )
          }
        }}
      />
    )
  }
})
