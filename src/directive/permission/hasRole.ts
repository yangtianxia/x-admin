import { type DirectiveBinding } from 'vue'
import { toArray } from '@txjs/shared'
import { useUserStore } from '@/stores'

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const userStore = useUserStore()
  const values = toArray(binding.value)

  if (values.length > 0) {
    const hasPermission = values.some((role) => userStore.roles.includes(role))
    if (!hasPermission && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  } else {
    // 示例
    // v-hasRole={[['admin', 'user']]}
    // v-hasRole="admin"
    throw new Error(`need roles! Like v-hasRole={[['admin', 'user']]}`)
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
  update(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  }
}
