import type { RouteRecordRaw } from 'vue-router'
import { REDIRECT_ROUTE_NAME } from '../constant'

export const DEFAULT_LAYOUT = () => import('@/views/layout')

export const REDIRECT_MAIN: RouteRecordRaw = {
  path: '/redirect',
  name: 'redirectWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true
  },
  children: [
    {
      path: '/redirect/:path',
      name: REDIRECT_ROUTE_NAME,
      component: () => import('@/views/redirect'),
      meta: {
        requiresAuth: true,
        hideInMenu: true
      }
    }
  ]
}

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@/views/not-found')
}
