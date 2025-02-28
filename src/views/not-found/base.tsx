import { defineComponent } from 'vue'

import { Result } from '@/components/result'

export default defineComponent({
  name: 'NotFoundBase',
  setup() {
    return () => (
      <div class="flex h-full flex-col items-center justify-center">
        <Result status={404} />
      </div>
    )
  },
})
