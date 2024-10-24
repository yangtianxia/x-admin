import type { AppRouteRecordRaw } from '../types'
import { DEFAULT_LAYOUT } from '../base'

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  redirect: '/dashboard/workplace',
  meta: {
    icon: 'DashboardOne',
    locale: 'menu.server.dashboard',
    requiresAuth: true,
    order: 0
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/v1/dashboard/workplace'),
      meta: {
        locale: 'menu.server.workplace',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
}

export default DASHBOARD
