import type { MockConfig } from 'vite-plugin-mock'
import { successResponseWrap } from '../setup'
import type { MockParams } from '../types'

export default (config: MockConfig) => {
  return [
    {
      url: '/app/menu/list',
      method: 'get',
      response: (params: MockParams) => {
        const menuList = [
          {
            path: '/dashboard',
            name: 'dashboardWrapper',
            meta: {
              locale: 'menu.server.dashboard',
              requiresAuth: true,
              icon: 'DashboardOne',
              order: 1
            },
            children: [
              {
                path: 'workplace',
                name: 'Workplace',
                meta: {
                  locale: 'menu.server.workplace',
                  requiresAuth: true
                }
              },
              {
                path: 'https://www.baidu.com',
                name: 'Baidu',
                meta: {
                  locale: 'menu.baiduWebsite',
                  requiresAuth: true
                }
              }
            ]
          }
        ]
        return successResponseWrap(menuList)
      }
    }
  ]
}
