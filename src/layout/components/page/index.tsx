import { defineComponent, Transition, KeepAlive } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'LayoutPage',
  setup() {
    return () => (
      <RouterView
        v-slots={{
          default: ({ Component, route }: IRouterView) => (
            <Transition appear name='fade' mode='out-in'>
              {route.meta.keepAlive ? (
                <Component key={route.fullPath} />
              ) : (
                <KeepAlive>
                  <Component key={route.fullPath} />
                </KeepAlive>
              )}
            </Transition>
          ),
        }}
      />
    )
  },
})
