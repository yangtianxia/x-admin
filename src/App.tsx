// Vue
import { defineComponent, computed } from 'vue'

// Common
import { RouterView } from 'vue-router'
import { useLocale } from '@/hooks/locale'
import { useTheme } from '@/hooks/theme'

// Components
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'

export default defineComponent({
  setup () {
    const { currentLocale } = useLocale()
    const { currentMapToken } = useTheme()

    const locale = computed(() => {
      switch (currentLocale.value) {
        case 'zh-CN':
          return zhCN
        default:
        case 'en-US':
          return enUS
      }
    })

    return () => (
      <ConfigProvider
        locale={locale.value}
        theme={{token: currentMapToken.value}}
      >
        <RouterView />
      </ConfigProvider>
    )
  }
})
