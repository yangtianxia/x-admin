import { type DirectiveBinding } from 'vue'
import { toArray } from '@txjs/shared'
import { useUserStore } from '@/stores'

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const userStore = useUserStore()
  const values = toArray(binding.value)

  if (values.length > 0) {
    const hasPermission = values.some((perm) => userStore.perms.includes(perm))
    if (!hasPermission && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  } else {
    // 示例
    // v-hasPerm={[['sys:menu:add', 'sys:menu:edit']]}
    // v-hasPerm="sys:menu:add"
    throw new Error(`need perms! Like v-hasPerm={[['sys:menu:add', 'sys:menu:edit']]}`)
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
