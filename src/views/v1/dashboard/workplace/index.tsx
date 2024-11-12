// Vue
import { defineComponent } from 'vue'

// Common
import { useAppContext } from '@/hooks/app-context'

// Components
import { App } from '@/components/app'
import { Breadcrumb } from '@/components/breadcrumb'

// Style
import less from './index.module.less'

const [name] = BEM('dashboard', less)

export default defineComponent({
  name,
  setup () {
    useAppContext({
      loading: false
    })

    return () => (
      <App>
        <Breadcrumb items={['menu.server.workplace']} />
        <App.Body></App.Body>
      </App>
    )
  }
})
