import { defineComponent } from 'vue'

import { Scaffold } from '@/components/scaffold'

export default defineComponent({
  name: 'DashboardPage',
  setup() {
    return () => (
      <Scaffold loading={false}>
        <Scaffold.Body flex>
          <div class='flex flex-1 flex-col items-center justify-center'>
            <div>
              <h5 class='text-right text-h5 text-primary/85'>你好。</h5>
              <h1 class='text-h1 text'>x-admin</h1>
              <h5 class='text-h5'>Hello.</h5>
            </div>
          </div>
        </Scaffold.Body>
      </Scaffold>
    )
  },
})
