// Vue
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutFooter',
  setup() {
    return () => (
      <p class="text-quaternary text-sm text-center">
        ©2023-2024 <a href="https://github.com/yangtianxia" target="_blank">yangtianxia</a> All Rights
      </p>
    )
  }
})
