// Vue
import { defineComponent } from 'vue'

// Common
import { useUserStore } from '@/stores'
import { useScaffoldContext } from '@/hooks/scaffold'

// Components
import { Scaffold } from '@/components/scaffold'
import { Image } from '@/components/image'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    const userStore = useUserStore()
    const scaffold = useScaffoldContext()

    scaffold.ready(async () => {})

    return () => (
      <Scaffold>
        <Scaffold.Body shrink>
          <Image
            round
            size={100}
            src={userStore.avatar}
          />
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
