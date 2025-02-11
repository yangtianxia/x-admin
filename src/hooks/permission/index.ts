import { useUserStore } from '@/store'
import { isNonEmptyString } from '@txjs/bool'
import { ALL_PERMISSION, SUPER_ADMIN } from '@/constant/auth'

export const usePermission = () => {
  const userStore = useUserStore()
  const permissions = userStore.permissions
  const roles = userStore.roles

  function authPermission(permission: string) {
    if (isNonEmptyString(permission)) {
      return permissions.some((el) => {
        return ALL_PERMISSION === el || el === permission
      })
    } else {
      return false
    }
  }

  function authRole(role: string) {
    if (isNonEmptyString(role)) {
      return roles.some((el) => {
        return SUPER_ADMIN === el || el === role
      })
    } else {
      return false
    }
  }

  /** 验证是否具有指定权限 */
  function hasPerm(permission: string) {
    return authPermission(permission)
  }

  /** 验证是否具有某项权限 - 只需包含一项 */
  function hasPermOr(permissions: string[]) {
    return permissions.some((el) => authPermission(el))
  }

  /** 验证是否具有多项权限 - 必须全部通过 */
  function hasPermAnd(permissions: string[]) {
    return permissions.every((el) => authPermission(el))
  }

  /** 验证是否具有指定角色权限 */
  function hasRole(role: string) {
    return authRole(role)
  }

  /** 验证是否具有某个角色权限 - 只需包含一项 */
  function hasRoleOr(roles: string[]) {
    return roles.some((el) => authRole(el))
  }

  /** 验证是否具有多个角色权限 - 必须全部通过 */
  function hasRoleAnd(roles: string[]) {
    return roles.every((el) => authRole(el))
  }

  return {
    hasPerm,
    hasPermOr,
    hasPermAnd,
    hasRole,
    hasRoleOr,
    hasRoleAnd
  }
}
