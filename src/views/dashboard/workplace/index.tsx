// Vue
import { defineComponent } from 'vue'

// Common
import { useUserStore } from '@/stores'
import { useScaffoldContext } from '@/hooks/scaffold'

// Components
import { Scaffold } from '@/components/scaffold'
import { Breadcrumb } from '@/components/breadcrumb'
import { Image } from '@/components/image'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    const userStore = useUserStore()
    const scaffold = useScaffoldContext()

    scaffold.ready(async () => {})

    return () => (
      <Scaffold>
        <Breadcrumb />
        <Scaffold.Body shrink>
          <Image round size={400} src={userStore.avatar} />
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
