import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { successResponseWrap } from '../setup'

export default defineFakeRoute([
  {
    url: '/app/menu/list',
    method: 'get',
    response: () => {
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
])
