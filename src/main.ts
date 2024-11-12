import 'ant-design-vue/dist/reset.css'
import '@/global.less'
import 'dayjs/locale/zh-cn'
import '@/mock'

import { createApp } from 'vue'
import dayjs from 'dayjs'
import app from '@/App'
import router from '@/router'
import store from '@/store'
import directive from '@/directive'
import i18n from '@/locale'
import { message, notification } from 'ant-design-vue'

// BEM配置
BEM.config({
  debugger: import.meta.env.DEV,
  prefixer: {
    page: import.meta.env.VITE_PREFIX,
    comp: import.meta.env.VITE_PREFIX
  }
})

// dayjs语言配置
dayjs.locale('zh-cn')

// MESSAGE配置
message.config({
  duration: 2,
  top: '12px'
})

// NOTIFICATION配置
notification.config({
  duration: 3,
  top: '80px'
})

createApp(app)
  .use(router)
  .use(store)
  .use(directive)
  .use(i18n)
  .mount('#app')
