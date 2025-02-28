import { defineComponent, computed, type CSSProperties } from 'vue'
import { useAppStore } from '@/store'

import { Layout } from 'ant-design-vue'
import { Icon } from '@/components/icon'
import { addUnit } from '@/components/_utils/style'

import LayoutHeader from './components/header'
import LayoutBreadcrumb from './components/breadcrumb'
import LayoutMenu from './components/menu'
import LayoutPage from './components/page'
import LayoutFooter from './components/footer'

export default defineComponent({
  name: 'LayoutWrapper',
  setup() {
    const appStore = useAppStore()

    const layoutStyle = computed(() => {
      const style = {} as CSSProperties
      if (appStore.header) {
        style.paddingTop = addUnit(appStore.headerHeight)
      }
      if (appStore.sider) {
        style.paddingLeft = addUnit(appStore.siderWidth)
      }
      return style
    })

    const onCollapsed = () => {
      appStore.toggleSider()
    }

    return () => (
      <Layout class="h-full w-full">
        {appStore.header ? <LayoutHeader /> : null}
        <Layout>
          {appStore.sider ? (
            <Layout.Sider
              collapsible
              trigger={null}
              breakpoint="xl"
              class="!fixed left-0 top-0 h-full !bg-container after:absolute after:right-0 after:top-0 after:block after:h-full after:border-r"
              width={appStore.siderWidth}
              collapsedWidth={appStore.siderCollapseWidth}
              collapsed={appStore.siderCollapsed}
              style={{ paddingTop: layoutStyle.value.paddingTop }}
            >
              <LayoutMenu />
              <div
                class={[
                  'absolute bottom-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3px] bg-fill-tertiary text-lg text-secondary transition-all hover:bg-fill-secondary',
                  appStore.siderCollapsed
                    ? 'left-2/4 translate-x-[-50%]'
                    : 'right-3',
                ]}
                onClick={onCollapsed}
              >
                <Icon
                  theme="filled"
                  strokeWidth={2}
                  type={
                    appStore.siderCollapsed ? 'MenuFoldOne' : 'MenuUnfoldOne'
                  }
                />
              </div>
            </Layout.Sider>
          ) : null}
          <Layout
            class="min-h-screen overflow-hidden transition-[padding]"
            style={layoutStyle.value}
          >
            <LayoutBreadcrumb class="mx-3 my-2" />
            <Layout.Content class="flex flex-col">
              <LayoutPage />
            </Layout.Content>
            {appStore.footer ? (
              <Layout.Footer class="!px-0 !py-4">
                <LayoutFooter />
              </Layout.Footer>
            ) : null}
          </Layout>
        </Layout>
      </Layout>
    )
  },
})
