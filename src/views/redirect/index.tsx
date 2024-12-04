// Vue
import { defineComponent } from 'vue'

// Common
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const gotoPath = route.params.path as string

    router.replace({ path: gotoPath })

    return () => (
      <div />
    )
  }
})
