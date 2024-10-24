import type { Router, LocationQueryRaw } from 'vue-router'
import NProgress from 'nprogress'

import { useUserStore } from '@/store'
import { isLogin } from '@/shared/auth'

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    if (isLogin()) {
      if (userStore.role) {
        next()
      } else {
        try {
          await userStore.getUserInfo()
          next()
        } catch (err) {
          await userStore.logout()
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query
            } as LocationQueryRaw
          })
        }
      }
    } else {
      if (to.name === 'login') {
        next()
        return
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query
        } as LocationQueryRaw
      })
    }
  })
}
