import type { AppRouteRecordRaw } from '../types'
import { DEFAULT_LAYOUT } from '../base'
import { DEFAULT_ROUTE_NAME } from '../../constant'

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboardWrapper',
  component: DEFAULT_LAYOUT,
  redirect: '/dashboard/workplace',
  meta: {
    icon: 'DashboardOne',
    locale: 'menu.dashboard',
    requiresAuth: true,
    order: 0
  },
  children: [
    {
      path: 'workplace',
      name: DEFAULT_ROUTE_NAME,
      component: () => import('@/views/dashboard/workplace'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true
      }
    }
  ]
}

export default DASHBOARD
