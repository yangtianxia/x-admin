import { defineComponent } from 'vue'

import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'LayoutFooter',
  setup() {
    return () => (
      <p class='text-center text-sm text-quaternary'>
        <a href='https://github.com/yangtianxia/x-admin' target='_blank'>
          <Icon type='GithubOne' /> x-admin
        </a>
      </p>
    )
  },
})
