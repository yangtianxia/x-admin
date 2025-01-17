// Vue
import { defineComponent } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'

export default defineComponent({
  name: 'themePage',
  setup() {
    return () => (
      <Scaffold loading={false}>
        <Scaffold.Body>
          <div class="size-8 bg-primary/100 rounded-sm"></div>
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
