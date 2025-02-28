import { defineComponent } from 'vue'

import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'RedirectPage',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const gotoPath = route.params.path as string

    router.replace({ path: gotoPath })

    return () => <div />
  },
})
