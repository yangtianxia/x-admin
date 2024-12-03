// Vue
import { defineComponent } from 'vue'

// Common
import { useScaffoldContext } from '@/hooks/scaffold'

// Components
import { Scaffold } from '@/components/scaffold'
import { Breadcrumb } from '@/components/breadcrumb'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    const scaffold = useScaffoldContext({
      immediate: false
    })

    scaffold.ready(async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('error!'))
        }, 1500)
      })
    })

    return () => (
      <Scaffold>
        <Breadcrumb />
        <Scaffold.Body></Scaffold.Body>
      </Scaffold>
    )
  }
})
