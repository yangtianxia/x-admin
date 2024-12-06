import type { Router, RouteRecordNormalized } from 'vue-router'
import NProgress from 'nprogress'
import { useAppStore, useUserStore } from '@/stores'
import { usePermission } from '@/hooks/permission'
import { useMenuTree } from '@/hooks/menu-tree'
import { useRedirectUri } from '@/hooks/redirect'

import { appRoutes } from '../routes'
import { WHITE_LIST, NOT_FOUND_ROUTE } from '../constant'

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const menuTree = useMenuTree()
    const Permission = usePermission()
    const permissionsAllow = Permission.accessRouter(to)
    const redirectUri = useRedirectUri(to)

    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      if (
        !appStore.appAsyncMenus.length &&
        (!WHITE_LIST.find((el) => el.name === to.name) || !Permission.accessRightsAfterAuth(to))
      ) {
        await appStore.fetchServerMenuConfig()
      }

      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST]

      let exist = false
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift()
        if (element?.name === to.name) {
          exist = true
        }
        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          )
        }
      }

      if (exist && permissionsAllow) {
        next()
      } else if (redirectUri) {
        next({ path: redirectUri })
      } else {
        const serverFirstMenu = menuTree.value[0]
        const destination = serverFirstMenu ? { name: serverFirstMenu.name } : NOT_FOUND_ROUTE
        next(destination)
      }
    } else {
      if (permissionsAllow) {
        next()
      } else if (redirectUri) {
        next({ path: redirectUri })
      } else {
        const destination = Permission.findFirstPermissionRoute(appRoutes, userStore.role) || NOT_FOUND_ROUTE
        next(destination)
      }
    }

    NProgress.done()
  })
}
