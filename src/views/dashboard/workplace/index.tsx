// Vue
import { defineComponent } from 'vue'

// Common
import { useScaffoldContext } from '@/hooks/scaffold'

// Components
import { Scaffold } from '@/components/scaffold'
import { Image } from '@/components/image'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    const scaffold = useScaffoldContext()

    scaffold.ready(async () => {})

    return () => (
      <Scaffold>
        <Scaffold.Body shrink>
          <Image
            round
            size={100}
          />
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
