import type { RouteRecordRaw } from 'vue-router'
import {
  LOGIN_NAME,
  DEFAULT_NAME,
  FORBIDDEN_NAME,
  REDIRECT_NAME,
} from '@/constant/route'

export const DEFAULT_LAYOUT = () => import('@/layout')

/** 固定路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: DEFAULT_LAYOUT,
    redirect: '/dashboard/workplace',
    meta: {
      title: '仪表盘',
      icon: 'DashboardOne',
    },
    children: [
      {
        path: '/dashboard/workplace',
        name: DEFAULT_NAME,
        component: () => import('@/views/dashboard/workplace'),
        meta: {
          title: '工作台',
        },
      },
    ],
  },
  {
    path: '/login',
    name: LOGIN_NAME,
    component: () => import('@/views/login'),
    meta: {
      title: '登录',
      authNoAccessAfter: true,
    },
  },
  {
    path: '/redirect',
    name: 'RedirectWrapper',
    component: DEFAULT_LAYOUT,
    meta: {
      hideInMenu: true,
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: REDIRECT_NAME,
        component: () => import('@/views/redirect'),
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'ForbiddenWrapper',
    component: DEFAULT_LAYOUT,
    meta: {
      hideInMenu: true,
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: '/forbidden/:path(.*)',
        name: FORBIDDEN_NAME,
        component: () => import('@/views/forbidden'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not-found'),
    meta: {
      hideInMenu: true,
    },
  },
]
