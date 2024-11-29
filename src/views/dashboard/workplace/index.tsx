// Vue
import { defineComponent } from 'vue'

// Common
import { useAppContext } from '@/hooks/app-context'

// Components
import { App } from '@/components/app'
import { Breadcrumb } from '@/components/breadcrumb'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    useAppContext({
      loading: false
    })

    return () => (
      <App>
        <Breadcrumb />
        <App.Body></App.Body>
      </App>
    )
  }
})
