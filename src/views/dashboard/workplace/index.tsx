// Vue
import { defineComponent } from 'vue'

// Components
import { Scaffold } from '@/components/scaffold'

export default defineComponent({
  name: 'DashboardPage',
  setup () {
    return () => (
      <Scaffold loading={false}>
        <Scaffold.Body
          flex
          shrink
        >
          <div class="flex-1 flex justify-center items-center flex-col">
            <div>
              <h5 class="text-h5 text-right">你好。</h5>
              <h1 class="text text-h1">{$t('global.title')}</h1>
              <h5 class="text-h5">Hello.</h5>
            </div>
          </div>
        </Scaffold.Body>
      </Scaffold>
    )
  }
})
