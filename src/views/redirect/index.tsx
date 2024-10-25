// Vue
import { defineComponent } from 'vue'

// Common
import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {
    return () => (
      <RouterView />
    )
  }
})
