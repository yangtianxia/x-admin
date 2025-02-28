import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuTree } from '@/hooks/menu-tree'

import { Breadcrumb } from 'ant-design-vue'
import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'LayoutBreadcrumb',
  setup() {
    const currentRoute = useRoute()
    const menuTree = useMenuTree()

    const routes = computed(() => [
      {
        path: '/',
        breadcrumbName: '_HOME_',
      },
      ...currentRoute.matched.map((route) => {
        const children =
          menuTree.value.find((el: any) => el.name === route.name)?.children ||
          []
        return {
          ...formatRoute(route),
          children: children
            .filter((el: any) => el.name !== currentRoute.name)
            .map(formatRoute),
        }
      }),
    ])

    const formatRoute = (route: any) => ({
      path: route.path,
      breadcrumbName: route.name as string,
      locale: route.meta.title,
    })

    return () => (
      <Breadcrumb
        routes={routes.value}
        itemRender={({ route }: any) => {
          // 默认
          if (route.breadcrumbName === '_HOME_') {
            return (
              <a href={route.path}>
                <Icon type='Home' />
              </a>
            )
          }
          // 当前页面或下拉子页面
          if (
            route.breadcrumbName === currentRoute.name ||
            route.children?.length
          ) {
            return <span>{route.locale}</span>
          }
          // 其他
          return <a href={route.path}>{route.locale}</a>
        }}
      />
    )
  },
})
