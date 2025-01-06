import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import { h } from 'vue'
import { Modal } from 'ant-design-vue'
import { useUserStore } from '@/stores'
import { isLogin } from '@/shared/auth'
import { REDIRECT_URI } from '@/shared/constant'
import { LOGIN_ROUTE_PATH } from '../constant'

export default function setupLoginAuthorizeGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()

    if (isLogin()) {
      if (userStore.hasUserInfo) {
        next()
      } else {
        try {
          await userStore.getUserInfo()
          next()
        } catch (error: any) {
          if (error.code === 401) {
            userStore.logoutCallback()
            next({
              path: LOGIN_ROUTE_PATH,
              query: {
                [REDIRECT_URI]: to.fullPath
              }
            })
          } else {
            Modal.error({
              centered: true,
              title: '登录错误',
              content: h('div', [
                h('p', `状态：${error.code}`),
                h('p', `原因：${error.msg || error.message}`)
              ]),
              okText: '刷新',
              onOk() {
                window.location.reload()
              }
            })
          }
        }
      }
    } else if (to.meta.requiresAuth) {
      next({
        path: LOGIN_ROUTE_PATH,
        query: {
          [REDIRECT_URI]: to.fullPath
        }
      })
    } else {
      next()
    }
  })
}
