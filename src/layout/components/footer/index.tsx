// Vue
import { defineComponent } from 'vue'

// Components
import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'LayoutFooter',
  setup() {
    return () => (
      <p class="text-quaternary text-sm text-center">
        <a href="https://github.com/yangtianxia/x-admin" target="_blank">
          <Icon type="GithubOne" /> x-admin
        </a>
      </p>
    )
  }
})
