// Vue
import { defineComponent } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'

export default defineComponent({
  name: 'SystemMenuPage',
  setup() {
    return () => (
      <Scaffold>
        <Scaffold.Body></Scaffold.Body>
      </Scaffold>
    )
  }
})
