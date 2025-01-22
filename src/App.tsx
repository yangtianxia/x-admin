// Vue
import { defineComponent } from 'vue'

// Common
import dayjs from 'dayjs'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/store'

// Components
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

// dayjs语言配置
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default defineComponent({
  setup () {
    const appStore = useAppStore()

    return () => (
      <ConfigProvider
        locale={zhCN}
        theme={{token: appStore.seedToken}}
      >
        <RouterView />
      </ConfigProvider>
    )
  }
})
