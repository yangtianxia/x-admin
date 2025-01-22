// Vue
import { defineComponent, ref } from 'vue'

// Common
import {
  useRoute,
  useRouter,
  type RouteRecordRaw,
  type RouteMeta
} from 'vue-router'
import { isAbsoluteUrl } from '@txjs/bool'
import { makeArray } from '@txjs/make'
import { useMenuTree } from '@/hooks/menu-tree'
import { openWindow } from '@/shared/open-window'
import { listenerRouteChange } from '@/shared/route-listener'

// Component
import { Menu } from 'ant-design-vue'
import { Icon, type IconMap } from '@/components/icon'

// Components utils
import { addUnit } from '@/components/_utils/style'

// Style
import style from './index.module.less'

export default defineComponent({
  name: 'LayoutMenu',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const menuTree = useMenuTree()

    const inlineIndent = ref(16)
    const openKeys = ref<string[]>([])
    const selectedKey = ref<string[]>([])

    const goto = (item: RouteRecordRaw) => {
      // 打开外部网站
      if (isAbsoluteUrl(item.path)) {
        openWindow(item.path)
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
        const { activeMenu, hideInMenu } = newRoute.meta

        if (!hideInMenu || activeMenu) {
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

    const renderMenuItem = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((route) => {
            const icon = route?.meta?.icon
              ? () => (
                <Icon
                  size={18}
                  type={route.meta!.icon as IconMap}
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
            const title = route?.meta?.title
              ? () => route.meta?.title
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
      <div class="h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
        <Menu
          mode="inline"
          class={style.menu}
          selectedKeys={selectedKey.value}
          inlineIndent={inlineIndent.value}
          v-model:openKeys={openKeys.value}
        >
          {renderMenuItem()}
        </Menu>
      </div>
    )
  }
})
