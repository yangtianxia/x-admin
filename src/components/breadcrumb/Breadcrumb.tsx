// Vue
import { defineComponent, computed } from 'vue'

// Common
import { useRoute } from 'vue-router'
import { useMenuTree } from '@/hooks/menu-tree'

// Component
import { Icon } from '../icon'
import { Breadcrumb } from 'ant-design-vue'

export default defineComponent({
  name: 'XBreadcrumb',
  setup() {
    const currentRoute = useRoute()
    const matchs = currentRoute.matched
    const menuTree = useMenuTree()

    const routes = computed(() => [
      { path: '/', breadcrumbName: '' },
      ...matchs.map((route) => {
        const children = menuTree.value.find((item: any) => item.name === route.name)?.children || []
        return {
          ...formatRoute(route),
          children: children.map(formatRoute)
        }
      })
    ])

    const formatRoute = (route: any) => ({
      path: route.path,
      breadcrumbName: route.name as string,
      locale: $t(route.meta.locale!)
    })

    return () => (
      <div class="m-3">
        <Breadcrumb
          routes={routes.value}
          itemRender={({ route }: any) => {
            // 默认
            if (route.path === '/') {
              return (
                <a href={route.path}>
                  <Icon type="Home" />
                </a>
              )
            }
            // 当前页面或下拉子页面
            if (route.breadcrumbName === currentRoute.name || route.children?.length) {
              return <span>{route.locale}</span>
            }
            // 其他
            return <a href={route.path}>{route.locale}</a>
          }}
        />
      </div>
    )
  }
})
