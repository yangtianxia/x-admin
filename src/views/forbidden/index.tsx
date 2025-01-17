// Vue
import { defineComponent } from 'vue'

// Component
import { Result } from '@/components/result'

export default defineComponent({
  name: 'ForbiddenPage',
  setup() {
    return () => (
      <div class="h-screen flex flex-col items-center justify-center">
        <Result status={404} />
      </div>
    )
  }
})
