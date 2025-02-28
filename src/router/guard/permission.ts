import type { Router } from 'vue-router'
import { h } from 'vue'
import { Modal } from 'ant-design-vue'
import { isHttpUrl } from '@txjs/bool'
import { useUserStore, useRouteStore } from '@/store'
import { msgWrap, isUnauthorized } from '@/shared/http'
import { isLogin } from '@/shared/auth'
import { REDIRECT_URI, LOGIN_NAME, DEFAULT_ROUTE } from '@/constant/route'

/** 免登录白名单 */
const whiteList = ['/login']

const notifyHandler = (error: any) => {
  Modal.error({
    centered: true,
    title: '加载异常',
    content: h('div', [
      h('p', `状态：${error.code}`),
      h('p', `原因：${msgWrap(error)}`),
    ]),
    okText: '刷新',
    onOk() {
      window.location.reload()
    },
  })
}

/** 是否已经生成过路由表 */
let hasRouteFlag = false
export const resetHasRouteFlag = () => {
  hasRouteFlag = false
}

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const routeStore = useRouteStore()

    const nextLogin = () => {
      next({
        name: LOGIN_NAME,
        query: {
          [REDIRECT_URI]: to.fullPath,
        },
      })
    }

    if (isLogin()) {
      // 拦截已登录禁止访问页面
      if (to.meta.authNoAccessAfter !== true) {
        // 获取登录用户数据
        if (!userStore.hasUserInfo) {
          try {
            await userStore.getUserInfo()
          } catch (error: any) {
            if (isUnauthorized(error.code)) {
              userStore.logoutCallback()
              nextLogin()
            } else {
              notifyHandler(error)
            }
          }
        }
        // 验证是否登录
        if (userStore.hasUserInfo) {
          // 获取路由数据
          if (!hasRouteFlag) {
            try {
              const accessRoutes = await routeStore.generateRoutes()
              accessRoutes.forEach((route) => {
                if (!isHttpUrl(route.path)) {
                  router.addRoute(route)
                }
              })
              hasRouteFlag = true
              next({ ...to, replace: true })
            } catch (error: any) {
              if (isUnauthorized(error.code)) {
                userStore.logoutCallback()
                nextLogin()
              } else {
                notifyHandler(error)
              }
            }
          } else {
            next()
          }
        }
      } else {
        next(DEFAULT_ROUTE)
      }
    } else {
      // 白名单路由直接访问
      if (whiteList.includes(to.path)) {
        next()
      } else {
        nextLogin()
      }
    }
  })
}
