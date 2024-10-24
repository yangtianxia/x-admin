import { defineComponent, Transition, KeepAlive, h } from 'vue'
import { RouterView, type RouteLocationNormalized } from 'vue-router'

const [name] = BEM('page')

export default defineComponent({
  name,

  setup() {
    return () => (
      <RouterView
        v-slots={{
          default: ({
            Component,
            route
          }: {
            Component: any,
            route: RouteLocationNormalized
          }) => {
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