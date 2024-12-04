// Vue
import {
  defineComponent,
  ref,
  computed
} from 'vue'

// Common
import {
  useRoute,
  useRouter,
  type RouteRecordRaw,
  type RouteMeta
} from 'vue-router'
import { isURL } from '@txjs/bool'
import { makeArray } from '@txjs/make'
import { useAppStore } from '@/stores'
import { useMenuTree } from '@/hooks/menu-tree'
import { useOpenWindow } from '@/hooks/open-window'
import { listenerRouteChange } from '@/shared/route-listener'

// Component
import { Menu } from 'ant-design-vue'
import { Icon } from '@/components/icon'

// Components utils
import { addUnit } from '@/components/_utils/style'

// Style
import style from './index.module.less'

const [name, bem] = BEM('menu', style)

export default defineComponent({
  name,

  setup() {
    const appStore = useAppStore()
    const route = useRoute()
    const router = useRouter()
    const menuTree = useMenuTree()

    const inlineIndent = ref(16)
    const openKeys = ref(
      makeArray<string>([])
    )
    const selectedKey = ref(
      makeArray<string>([])
    )
    const topMenu = computed(() =>
      appStore.topMenu
    )

    const goto = (item: RouteRecordRaw) => {
      // 打开外部网站
      if (isURL(item.path)) {
        useOpenWindow(item.path)
        // 打开外部网站后不需要高亮
        // selectedKey.value = [item.name as string]
        return
      }

      const { hideInMenu, activeMenu } = item.meta as RouteMeta
      if (route.name === item.name && !hideInMenu && !activeMenu) {
        selectedKey.value = [item.name as string]
        return
      }

      router.push({ name: item.name })
    }

    const findMenuOpenKeys = (target: string) => {
      const result = makeArray<string>([])
      let isFind = false

      const backTract = (item: RouteRecordRaw, keys: string[]) => {
        if (item.name === target) {
          isFind = true
          result.push(...keys)
          return
        }

        if (item.children?.length) {
          item.children.forEach((route) => {
            backTract(route, [...keys, route.name as string])
          })
        }
      }

      menuTree.value.forEach((route: RouteRecordRaw) => {
        if (isFind) return
        backTract(route, [route.name as string])
      })

      return result
    }

    listenerRouteChange(
      (newRoute) => {
        const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta

        if (requiresAuth && (!hideInMenu || activeMenu)) {
          const menuOpenKeys = findMenuOpenKeys(
            (activeMenu || newRoute.name) as string
          )

          const keySet = new Set([...menuOpenKeys, ...openKeys.value])
          openKeys.value = [...keySet]

          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1]
          ]
        } else {
          selectedKey.value = []
        }
      }, true
    )

    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((route) => {
            const icon = route?.meta?.icon
              ? () => (
                <Icon
                  size={18}
                  type={route.meta!.icon!}
                />
              )
              : () => (
                <div
                  style={{
                    minWidth: 0,
                    marginLeft: addUnit(18 - inlineIndent.value)
                  }}
                />
              )
            const title = route?.meta?.locale
              ? () => $t(route.meta!.locale!)
              : null
            const node = route?.children && route.children.length !== 0 ? (
              <Menu.SubMenu
                key={route.name}
                v-slots={{ icon, title }}
              >
                {travel(route.children)}
              </Menu.SubMenu>
            ) : (
              <Menu.Item
                key={route.name}
                onClick={() => goto(route)}
                v-slots={{ icon }}
              >
                {title?.()}
              </Menu.Item>
            )
            nodes.push(node as never)
          })
        }
        return nodes
      }
      return travel(menuTree.value)
    }

    return () => (
      <div class="h-full overflow-y-auto overflow-x-hidden">
        <Menu
          v-model:openKeys={openKeys.value}
          mode={topMenu.value ? 'horizontal' : 'inline'}
          selectedKeys={selectedKey.value}
          inlineIndent={inlineIndent.value}
          class={bem()}
        >
          {renderSubMenu()}
        </Menu>
      </div>
    )
  }
})
