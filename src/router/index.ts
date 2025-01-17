import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { useRouteStore } from '@/store'
import { DEFAULT_ROUTE } from '@/constant/route'

import { constantRoutes } from './routes/base'
import createRouteGuard from './guard'

NProgress.configure({
  easing: 'ease',
  showSpinner: false,
  trickleSpeed: 150
})

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
  routes: constantRoutes
})

createRouteGuard(router)

router.onError(() => {
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})

/** 返回上一页 */
export const goBack = () => {
  if (window.history.state.back) {
    history.back()
  } else {
    router.replace(DEFAULT_ROUTE)
  }
}

/** 重置路由 */
export const resetRouter = () => {
  try {
    const routeStore = useRouteStore()
    routeStore.asyncRoutes.forEach((route) => {
      const { name } = route
      if (name && router.hasRoute(name)) {
        router.removeRoute(name)
      }
    })
  } catch {
    window.location.reload()
  }
}

export default router
