import type { AppRouteRecordRaw } from '../types'
import { DEFAULT_LAYOUT } from '../base'

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboardWrapper',
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
      component: () => import('@/views/dashboard/workplace'),
      meta: {
        locale: 'menu.server.workplace',
        requiresAuth: true,
        roles: ['*']
      }
    }
  ]
}

export default DASHBOARD
