// Vue
import { defineComponent, reactive } from 'vue'

// Common
import { RouterView } from 'vue-router'

// Components
import { ConfigProvider } from 'ant-design-vue'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup () {
    const colors = 'themeColors' in window ? themeColors : {}
    const theme = reactive<ThemeConfig>({
      token: {
        wireframe: true,
        colorBgLayout: colors.gray['50'],
        colorPrimary: colors.primary,
        colorSuccess: colors.green['500'],
        colorWarning: colors.yellow['500'],
        colorError: colors.red['500'],
        colorInfo: colors.blue['500'],
      }
    })
    return () => (
      <ConfigProvider
        locale={zhCN}
        theme={theme}
      >
        <RouterView />
      </ConfigProvider>
    )
  }
})
