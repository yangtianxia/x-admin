// Vue
import { defineComponent, computed } from 'vue'

// Common
import { useRoute } from 'vue-router'

// Component
import { Icon } from '@/components/icon'
import { Breadcrumb } from 'ant-design-vue'

export default defineComponent({
  name: 'LayoutBreadcrumb',
  setup() {
    const currentRoute = useRoute()

    const routes = computed(() => [
      ...currentRoute.matched.map(formatRoute)
    ])

    const formatRoute = (route: any) => ({
      path: route.path,
      breadcrumbName: route.name as string,
      locale: route.meta.title
    })

    return () => (
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
    )
  }
})
