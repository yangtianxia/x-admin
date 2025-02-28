import { defineComponent, KeepAlive } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'ParentWrapper',
  setup() {
    return () => (
      <RouterView
        v-slots={{
          default: ({ Component, route }: IRouterView) => {
            return route.meta.keepAlive ? (
              <Component key={route.fullPath} />
            ) : (
              <KeepAlive>
                <Component key={route.fullPath} />
              </KeepAlive>
            )
          },
        }}
      />
    )
  },
})
