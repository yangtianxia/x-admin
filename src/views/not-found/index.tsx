import { defineComponent } from 'vue'
import { goBack } from '@/router'

import { Button } from 'ant-design-vue'
import { Result } from '@/components/result'
import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'NotFoundPage',
  setup() {
    return () => (
      <div class="flex h-screen flex-col items-center justify-center">
        <Result
          status={404}
          bottom={() => (
            <Button type="primary" icon={<Icon type="Left" />} onClick={goBack}>
              返回
            </Button>
          )}
        />
      </div>
    )
  },
})
