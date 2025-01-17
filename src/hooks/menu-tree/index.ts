import type { RouteRecordRaw, RouteRecordNormalized } from 'vue-router'
import { computed } from 'vue'
import { cloneDeep } from '@txjs/shared'

import { useRouteStore } from '@/store'
import { isLogin } from '@/shared/auth'
import { hasRoleOr } from '@/shared/has'

const accessRightsAfterAuth = (route: RouteRecordNormalized | RouteRecordRaw) => {
  return isLogin() ? route.meta?.authNoAccessAfter !== true : true
}

export const useMenuTree = () => {
  const routeStore = useRouteStore()

  const menuTree = computed(() => {
    const copyRoute = cloneDeep(routeStore.routes) as RouteRecordNormalized[]

    function travel(_routes: RouteRecordRaw[], layer: number) {
      if (!_routes) {
        return null
      }

      const collector: any = _routes.map((route) => {
        // no access
        if (!accessRightsAfterAuth(route) || (route.meta?.roles && hasRoleOr(route.meta?.roles))) {
          return null
        }

        if (route.meta?.hideChildrenInMenu || !route.children) {
          route.children = []
        }

        // 路由筛选器 hideInMenu true
        route.children = route.children.filter((item) =>
          item.meta?.hideInMenu !== true
        )

        const subItem = travel(route.children, layer + 1)

        if (subItem.length) {
          route.children = subItem
          return route
        }

        if (layer > 1) {
          route.children = subItem
          return route
        }

        if (route.meta?.hideInMenu !== true) {
          return route
        }

        return null
      })
      return collector.filter(Boolean)
    }

    return travel(copyRoute, 0)
  })

  return menuTree
}
