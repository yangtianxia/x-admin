import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/store'

import {
  ConfigProvider,
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup() {
    const appStore = useAppStore()

    return () => (
      <ConfigProvider locale={zhCN} theme={{ token: appStore.seedToken }}>
        <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
          <RouterView />
        </StyleProvider>
      </ConfigProvider>
    )
  },
})
