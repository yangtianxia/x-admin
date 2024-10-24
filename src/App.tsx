// Vue
import { defineComponent } from 'vue'

// Common
import { RouterView } from 'vue-router'

// Components
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup () {
    return () => (
      <ConfigProvider
        locale={zhCN}
        theme={THEME}
      >
        <RouterView />
      </ConfigProvider>
    )
  }
})
