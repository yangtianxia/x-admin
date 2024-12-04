// Vue
import { defineComponent } from 'vue'

// Component
import { Result } from '@/components/result'

export default defineComponent({
  name: 'NotFound',
  setup() {
    return () => (
      <div class="h-full flex flex-col items-center justify-center">
        <Result status={404} />
      </div>
    )
  }
})
