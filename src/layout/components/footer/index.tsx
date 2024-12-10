// Vue
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutFooter',
  setup() {
    return () => (
      <p class="text-quaternary text-sm text-center">{$t('page.copyright')}</p>
    )
  }
})
