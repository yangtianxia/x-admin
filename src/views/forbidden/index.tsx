import { defineComponent } from 'vue'

import { Result } from '@/components/result'

export default defineComponent({
  name: 'ForbiddenPage',
  setup() {
    return () => (
      <div class="flex h-screen flex-col items-center justify-center">
        <Result status={404} />
      </div>
    )
  },
})
