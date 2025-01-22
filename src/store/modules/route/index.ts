import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { cloneDeep, omit } from '@txjs/shared'

import { asyncRouteModules } from '@/router/routes/asyncModules'
import { DEFAULT_LAYOUT, constantRoutes } from '@/router/routes/base'
import { transformPathToName } from '@/shared/utils'
import { getMenuList, type MenuItem } from '@/api/app/menu'

import type { RouteState } from './types'

const NotFoundBase = () => import('@/views/not-found/base')

const layoutComponentMap = {
  Layout: DEFAULT_LAYOUT,
  Parent: () => import('@/components/parent-view')
}

const transformComponentView = (component: string) => {
  return layoutComponentMap[component as keyof typeof layoutComponentMap] || asyncRouteModules[component] || NotFoundBase
}

const formatAsyncRoutes = (menus: MenuItem[]) => {
  if (!menus.length) {
    return []
  }

  const nameMap = new Map()

  return menus.reduce(
    (routes, el) => {
      nameMap.set(el.id, el.path)

      if (el.children?.length) {
        el.children.sort((a, b) => (a?.sort ?? 0) - (b?.sort ?? 0))
      }

      if (el.parentId && el.type === 2) {
        el.activeMenu = nameMap.get(el.parentId)
      }

      const route = {
        path: el.path,
        name: el.name || transformPathToName(el.path),
        component: transformComponentView(el.component),
        meta: {
          title: el.title,
          hideInMenu: el.isHidden,
          keepAlive: el.isCache,
          icon: el.icon,
          activeMenu: el.activeMenu
        }
      } as RouteRecordRaw

      if (el.redirect) {
        route.redirect = el.redirect
      }

      if (el.children?.length) {
        route.children = formatAsyncRoutes(el.children)
      }

      routes.push(route)
      return routes
    }, [] as RouteRecordRaw[]
  )
}

export const isMultipleRoute = (route: RouteRecordRaw) => {
  return route.children?.some((child) => child.children?.length) ?? false
}

export const flatMultiLevelRoutes = (routes: RouteRecordRaw[]) => {
  return cloneDeep(routes).map((route) => {
    if (!isMultipleRoute(route)) {
      return route
    }
    return {
      ...route,
      children: route.children?.map((el) => omit(el, ['children'])) as RouteRecordRaw[]
    }
  })
}

const useRouteStore = defineStore('x_admin_route', {
  state: (): RouteState => ({
    routes: [],
    asyncRoutes: []
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = [...constantRoutes].concat(routes)
        .sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0))
      this.asyncRoutes = routes
    },
    async generateRoutes() {
      const result = await getMenuList()
      const asyncRoutes = formatAsyncRoutes(result)
      const flatRoutes = flatMultiLevelRoutes(cloneDeep(asyncRoutes))
      this.setRoutes(asyncRoutes)
      return flatRoutes
    }
  }
})

export default useRouteStore
