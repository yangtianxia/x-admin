// Vue
import { defineComponent } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    return () => (
      <Scaffold loading={false}>
        <Scaffold.Body shrink>
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
