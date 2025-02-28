import { defineComponent } from 'vue'

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
