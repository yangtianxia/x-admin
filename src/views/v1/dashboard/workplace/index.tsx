// Vue
import { defineComponent } from 'vue'

// Common
import { useAppContext } from '@/hooks/app-context'

// Components
import { App } from '@/components/app'
import { Breadcrumb } from '@/components/breadcrumb'

import less from './index.module.less'

const [name, bem] = BEM('dashboard', less)

export default defineComponent({
  name,

  setup () {
    const appContext = useAppContext({
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