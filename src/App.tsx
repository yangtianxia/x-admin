// Vue
import { defineComponent, reactive } from 'vue'

// Common
import { RouterView } from 'vue-router'

// Components
import { ConfigProvider, theme } from 'ant-design-vue'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup () {
    const colors = 'themeColors' in window ? themeColors : {}
    const seedToken = {
      // 品牌色
      colorPrimary: colors.primary,
      // 布局背景
      colorBgLayout: colors.gray['50'],
      // 成功色
      colorSuccess: colors.green['500'],
      // 警戒色
      colorWarning: colors.yellow['500'],
      // 错误色
      colorError: colors.red['500'],
      // 信息色
      colorInfo: colors.blue['500']
    }
    const themeConfig = reactive<ThemeConfig>({
      token: {
        ...theme.defaultAlgorithm({
          ...theme.defaultSeed,
          ...seedToken
        })
      }
    })
    return () => (
      <ConfigProvider
        locale={zhCN}
        theme={themeConfig}
      >
        <RouterView />
      </ConfigProvider>
    )
  }
})
