// Vue
import { defineComponent } from 'vue'

// Component
import { Result } from '@/components/result'

import style from './index.module.less'

const [name, bem] = BEM('not-found', style)

export default defineComponent({
  setup() {
    return () => (
      <div class={bem()}>
        <Result status="404" />
      </div>
    )
  }
})