import { useUserStore } from '@/store'
import { isNonEmptyString } from '@txjs/bool'

function authPermission(permission: string) {
  const userStore = useUserStore()
  const all_permission = '*:*:*'
  const permissions = userStore.permissions
  if (isNonEmptyString(permission)) {
    return permissions.some((el) => {
      return all_permission === el || el === permission
    })
  } else {
    return false
  }
}

function authRole(role: string) {
  const userStore = useUserStore()
  const super_admin = 'admin'
  const roles = userStore.roles
  if (isNonEmptyString(role)) {
    return roles.some((el) => {
      return super_admin === el || el === role
    })
  } else {
    return false
  }
}

/** 验证是否具有指定权限 */
export const hasPerm = (permission: string) => {
  return authPermission(permission)
}

/** 验证是否具有某项权限 - 只需包含一项 */
export const hasPermOr = (permissions: string[]) => {
  return permissions.some((el) => authPermission(el))
}

/** 验证是否具有多项权限 - 必须全部通过 */
export const hasPermAnd = (permissions: string[]) => {
  return permissions.every((el) => authPermission(el))
}

/** 验证是否具有指定角色权限 */
export const hasRole = (role: string) => {
  return authRole(role)
}

/** 验证是否具有某个角色权限 - 只需包含一项 */
export const hasRoleOr = (roles: string[]) => {
  return roles.some((el) => authRole(el))
}

/** 验证是否具有多个角色权限 - 必须全部通过 */
export const hasRoleAnd = (roles: string[]) => {
  return roles.every((el) => authRole(el))
}
