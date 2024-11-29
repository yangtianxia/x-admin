import Mock from 'mockjs'
import setupMock, { successResponseWrap } from '../setup'

setupMock({
  setup() {
    // 用户的服务端菜单
    Mock.mock(new RegExp('/app/menu/list'), () => {
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
    })
  }
})
