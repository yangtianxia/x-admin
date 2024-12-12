import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'

import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base'
import createRouteGuard from './guard'
import { appRoutes } from './routes'
import {
  LOGIN_ROUTE_NAME,
  LOGIN_ROUTE_PATH,
  DEFAULT_ROUTE
} from './constant'

NProgress.configure({
  showSpinner: false
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
  routes: [
    {
      path: '/',
      redirect: LOGIN_ROUTE_PATH
    },
    {
      path: LOGIN_ROUTE_PATH,
      name: LOGIN_ROUTE_NAME,
      component: () => import('@/views/login'),
      meta: {
        locale: 'menu.login',
        requiresAuth: false,
        authNoAccessAfter: true
      }
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE
  ]
})

createRouteGuard(router)

export const goBack = () => {
  if (window.history.state.back) {
    history.back()
  } else {
    router.replace(DEFAULT_ROUTE)
  }
}

export default router
