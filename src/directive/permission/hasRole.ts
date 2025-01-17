import { type DirectiveBinding } from 'vue'
import { toArray } from '@txjs/shared'
import { useUserStore } from '@/store'

const checkRole = (el: HTMLElement, binding: DirectiveBinding) => {
  const userStore = useUserStore()
  const values = toArray(binding.value)
  const roles = userStore.roles
  const super_admin = 'admin'

  if (values.length) {
    const hasPermission = values.some((el) => {
      return super_admin === el || roles.includes(el)
    })
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
    checkRole(el, binding)
  },
  update(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding)
  }
}
