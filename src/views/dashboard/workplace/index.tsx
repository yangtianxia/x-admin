// Vue
import { defineComponent } from 'vue'

// Common
import { useScaffoldContext } from '@/hooks/scaffold'

// Components
import { Scaffold } from '@/components/scaffold'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    const scaffold = useScaffoldContext()

    return () => (
      <Scaffold>
        <Scaffold.Body shrink>
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
