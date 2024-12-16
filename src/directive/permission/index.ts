import { type DirectiveBinding } from 'vue'
import { isArray } from '@txjs/bool'
import { useUserStore } from '@/stores'

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const userStore = useUserStore()
  const { value } = binding

  if (isArray(value)) {
    if (value.length > 0) {
      const permissionValues = value
      const hasPermission = permissionValues.includes(userStore.role)

      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','user']"`)
    }
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
