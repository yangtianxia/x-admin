import { computed } from 'vue'
import type { RouteRecordRaw, RouteRecordNormalized } from 'vue-router'
import { cloneDeep } from '@txjs/shared'
import { useAppStore } from '@/store'
import appClientMenus from '@/router/app-menus'
import { usePermission } from '../permission'

export const useMenuTree = () => {
  const appStore = useAppStore()
  const permission = usePermission()

  const appRoute = computed(() => {
    if (appStore.menuFromServer) {
      return appStore.appAsyncMenus
    }
    return appClientMenus
  })
  const menuTree = computed(() => {
    const copyRoute = cloneDeep(appRoute.value) as RouteRecordNormalized[]

    copyRoute.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) =>
      (a.meta.order || 0) - (b.meta.order || 0)
    )

    function travel(_routes: RouteRecordRaw[], layer: number) {
      if (!_routes) {
        return null
      }

      const collector: any = _routes.map((route) => {
        // no access
        if (!permission.accessRouter(route)) {
          return null
        }

        if (route.meta?.hideChildrenInMenu || !route.children) {
          route.children = []
          return route
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

        if (route.meta?.hideInMenu === false) {
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
