export function getMenuList() {
  return Promise.resolve<any[]>([
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        locale: 'menu.server.dashboard',
        icon: 'dashboard-one',
        requiresAuth: true,
        order: 0,
      },
      children: [
        {
          path: 'workplace',
          name: 'Workplace',
          meta: {
            locale: 'menu.server.workplace',
            requiresAuth: true,
          },
        }
      ],
    },
    {
      path: 'https://baidu.com',
      name: 'baiduWebsite',
      meta: {
        locale: 'menu.baiduWebsite',
        icon: 'search',
        requiresAuth: true,
        order: 0
      },
    },
  ])
}
