import { type DirectiveBinding } from 'vue'
import { toArray } from '@txjs/shared'
import { useUserStore } from '@/store'
import { ALL_PERMISSION } from '@/constant/auth'

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const userStore = useUserStore()
  const values = toArray(binding.value)
  const permissions = userStore.permissions

  if (values.length) {
    const hasPermission = values.some((el) => {
      return ALL_PERMISSION === el || permissions.includes(el)
    })
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
