// Vue
import { defineComponent } from 'vue'

// Common
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useAppStore } from '@/store'

// Components
import { RouterView } from 'vue-router'
import {
  ConfigProvider,
  StyleProvider,
  legacyLogicalPropertiesTransformer
} from 'ant-design-vue'

export default defineComponent({
  setup () {
    const appStore = useAppStore()

    return () => (
      <ConfigProvider
        locale={zhCN}
        theme={{token: appStore.seedToken}}
      >
        <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
          <RouterView />
        </StyleProvider>
      </ConfigProvider>
    )
  }
})
