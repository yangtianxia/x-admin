import 'ant-design-vue/dist/reset.css'
import '@/assets/style/reset.less'
import 'dayjs/locale/zh-cn'

import Dayjs from 'dayjs'
import App from '@/App'
import Router from '@/router'
import Store from '@/store'
import Directive from '@/directive'
import I18n from '@/locale'

import { createApp } from 'vue'
import { message, notification } from 'ant-design-vue'

// BEM配置
BEM.config({
  debugger: import.meta.env.DEV,
  prefixer: {
    page: import.meta.env.VITE_PREFIX,
    comp: import.meta.env.VITE_PREFIX
  }
})

// DAYJS语言配置
Dayjs.locale('zh-cn')

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

createApp(App)
  .use(Router)
  .use(Store)
  .use(Directive)
  .use(I18n)
  .mount('#app')
