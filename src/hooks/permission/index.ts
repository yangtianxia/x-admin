import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'
import { isLogin } from '@/shared/auth'

export const usePermission = () => {
  const userStore = useUserStore()

  return {
    accessRightsAfterAuth(route: RouteLocationNormalized | RouteRecordRaw) {
      return isLogin() ? route.meta?.authNoAccessAfter !== true : true
    },
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const canAccess = !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.some((role) => userStore.roles.includes(role))
      return this.accessRightsAfterAuth(route) && canAccess
    },
    findFirstPermissionRoute(_routers: any, roles: string[]) {
      const cloneRouters = [..._routers]
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift()
        if (
          firstElement?.meta?.roles?.find((role: string) => {
            return role.includes('*') || roles.includes(role)
          })
        ) {
          return { name: firstElement.name }
        }

        if (firstElement && firstElement?.children) {
          cloneRouters.push(...firstElement!.children)
        }
      }
      return null
    }
  }
}
