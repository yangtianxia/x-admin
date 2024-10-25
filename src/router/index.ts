import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import createRouteGuard from './guard'
import { appRoutes } from './routes'
import { LOGIN_ROUTE_NAME } from './constant'
import { NOT_FOUND_ROUTE } from './routes/base'

NProgress.configure({
  showSpinner: false
})

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: LOGIN_ROUTE_NAME
    },
    {
      path: '/login',
      name: LOGIN_ROUTE_NAME,
      component: () => import('@/views/login'),
      meta: {
        requiresAuth: false,
        authNoAccessAfter: true
      }
    },
    ...appRoutes,
    NOT_FOUND_ROUTE
  ]
})

createRouteGuard(router)

export default router
