// Vue
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  type CSSProperties
} from 'vue'

// Common
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/store'
import { NOT_FOUND_ROUTE } from '@/router/constant'
import { usePermission } from '@/hooks/permission'

// Components
import { Layout } from 'ant-design-vue'
import { Icon } from '@/components/icon'
import LayoutHeader from './components/header'
import LayoutMenu from './components/menu'
import LayoutPage from './components/page'

// Component utils
import { addUnit } from '@/components/_utils/style'

// Style
import style from './index.module.less'

const [name, bem] = BEM('layout', style)

export default defineComponent({
  name,

  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const permission = usePermission()
    const route = useRoute()
    const router = useRouter()

    const ready = ref(false)
    const hasHeader = computed(() =>
      appStore.header
    )
    const hasFooter = computed(() =>
      appStore.footer
    )
    const hasMenu = computed(() =>
      appStore.menu && !appStore.topMenu
    )
    const hideMenu = computed(() =>
      appStore.hideMenu
    )
    const headerHeight = computed(() =>
      appStore.header ? addUnit(60) : ''
    )
    const menuWidth = computed(() =>
      appStore.menuCollapse ? 60 : appStore.menuWidth
    )
    const collapsed = computed(() =>
      appStore.menuCollapse
    )
    const triggerIcon = computed(() =>
      collapsed.value ? 'MenuFoldOne' : 'MenuUnfoldOne'
    )
    const layoutStyle = computed(() => {
      const style = {} as CSSProperties

      if (hasMenu.value && !hideMenu.value) {
        style.paddingLeft = addUnit(menuWidth.value)
      }

      if (hasHeader.value) {
        style.paddingTop = headerHeight.value
      }

      return style
    })

    const onCollapsed = () => {
      if (!ready.value) return

      appStore.updateSettings({
        menuCollapse: !collapsed.value
      })
    }

    watch(
      () => userStore.role,
      (roleValue) => {
        if (roleValue && !permission.accessRouter(route)) {
          router.push(NOT_FOUND_ROUTE)
        }
      }
    )

    onMounted(() => {
      ready.value = true
    })

    return () => (
      <Layout class={bem()}>
        {hasHeader.value ? (
          <Layout.Header>
            <LayoutHeader />
          </Layout.Header>
        ) : null}
        <Layout>
          {hasMenu.value ? (
            <Layout.Sider
              v-show={!hideMenu.value}
              collapsible
              breakpoint="xl"
              width={menuWidth.value}
              trigger={null}
              collapsed={collapsed.value}
              style={{ paddingTop: headerHeight.value }}
            >
              <LayoutMenu />
              <div
                class={bem('trigger', { collapsed: collapsed.value })}
                onClick={onCollapsed}
              >
                <Icon
                  type={triggerIcon.value}
                  theme="filled"
                  strokeWidth={2}
                />
              </div>
            </Layout.Sider>
          ) : null}
          <Layout style={layoutStyle.value}>
            <Layout.Content>
              <LayoutPage />
            </Layout.Content>
            {hasFooter.value ? <Layout.Footer /> : null}
          </Layout>
        </Layout>
      </Layout>
    )
  }
})
