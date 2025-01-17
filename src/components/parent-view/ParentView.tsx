// Vue
import { defineComponent, KeepAlive } from 'vue'

// Components
import { RouterView } from 'vue-router'

const [name] = $bem('parent-view')

export default defineComponent({
  name,
  setup() {
    return () => (
      <RouterView
        v-slots={{
          default: ({ Component, route }: RouterViewEvent) => {
            return route.meta.keepAlive ? <Component key={route.fullPath} /> : (
              <KeepAlive>
                <Component key={route.fullPath} />
              </KeepAlive>
            )
          }
        }}
      />
    )
  }
})
