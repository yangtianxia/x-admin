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
import { useAppStore, useUserStore } from '@/stores'
import { NOT_FOUND_ROUTE } from '@/router/constant'
import { usePermission } from '@/hooks/permission'

// Components
import { Icon } from '@/components/icon'
import { Layout } from 'ant-design-vue'
import LayoutHeader from './components/header'
import LayoutMenu from './components/menu'
import LayoutBreadcrumb from './components/breadcrumb'
import LayoutPage from './components/page'

// Component utils
import { addUnit } from '@/components/_utils/style'

export default defineComponent({
  name: 'LayoutWrapper',
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const permission = usePermission()
    const route = useRoute()
    const router = useRouter()

    const ready = ref(false)

    const hasHeader = computed(() => appStore.header)
    const hasMenu = computed(() => appStore.menu && !appStore.topMenu)
    const hideMenu = computed(() => appStore.hideMenu)
    const headerHeight = computed(() => appStore.header ? addUnit(appStore.headerHeight) : '')
    const menuWidth = computed(() =>
      appStore.menuCollapse ? appStore.menuCollapseWidth : appStore.menuWidth
    )
    const collapsed = computed(() => appStore.menuCollapse)
    const triggerIcon = computed(() => collapsed.value ? 'MenuFoldOne' : 'MenuUnfoldOne')
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
      <Layout class="w-full h-full">
        {hasHeader.value ? (
          <LayoutHeader />
        ) : null}
        <Layout>
          {hasMenu.value ? (
            <Layout.Sider
              v-show={!hideMenu.value}
              collapsible
              breakpoint="xl"
              trigger={null}
              width={appStore.menuWidth}
              collapsedWidth={appStore.menuCollapseWidth}
              collapsed={collapsed.value}
              style={{ paddingTop: headerHeight.value }}
              class="!fixed left-0 top-0 h-full !bg-container shadow-[0_2px_8px_-2px_rgba(0,0,0,.1)] after:absolute after:top-0 after:right-0 after:block after:h-full after:border-r"
            >
              <LayoutMenu />
              <div
                class={['cursor-pointer absolute bottom-3 flex items-center justify-center text-secondary text-lg w-6 h-6 rounded-[3px] bg-fill-tertiary transition-all hover:bg-fill-secondary', collapsed.value ? 'left-2/4 translate-x-[-50%]' : 'right-3']}
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
          <Layout
            class="min-h-screen overflow-hidden transition-[padding]"
            style={layoutStyle.value}
          >
            <LayoutBreadcrumb class="m-3" />
            <Layout.Content class="flex flex-col">
              <LayoutPage />
            </Layout.Content>
            {appStore.footer ? (
              <Layout.Footer class="!py-4 !px-0">
                <p class="text-quaternary text-sm text-center">{$t('page.copyright')}</p>
              </Layout.Footer>
            ) : null}
          </Layout>
        </Layout>
      </Layout>
    )
  }
})
