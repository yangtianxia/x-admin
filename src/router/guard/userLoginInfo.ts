import NProgress from 'nprogress'
import type { Router, LocationQueryRaw } from 'vue-router'
import { useUserStore } from '@/store'
import { isLogin } from '@/shared/auth'
import { REDIRECT_URI } from '@/shared/constant'

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    NProgress.start()
    const userStore = useUserStore()

    if (isLogin()) {
      if (userStore.id) {
        next()
      } else {
        try {
          await userStore.getUserInfo()
          next()
        } catch (err: any) {
          const needReset = err === 'USER_NOT_FOUND' || err?.code === 401

          if (needReset) {
            await userStore.logout()
          }

          if (to.name === 'login' || to.name === 'notPermission') {
            next()
            return
          }

          next({
            name: needReset ? 'login' : 'notPermission',
            query: {
              [REDIRECT_URI]: to.fullPath
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
          [REDIRECT_URI]: to.fullPath
        } as LocationQueryRaw
      })
    }
  })
}
