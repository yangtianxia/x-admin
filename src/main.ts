import 'ant-design-vue/dist/reset.css'
import '@/global.less'
import 'dayjs/locale/zh-cn'

import { createApp } from 'vue'
import dayjs from 'dayjs'
import app from '@/App'
import router from '@/router'
import store from '@/stores'
import directive from '@/directive'
import i18n from '@/locale'
import { message, notification } from 'ant-design-vue'
import { Lazyload } from '@/components/lazy-load'

// bem配置
$bem.config({
  mode: import.meta.env.DEV ? 'always' : 'match',
  prefix: 'x'
})

// dayjs语言配置
dayjs.locale('zh-cn')

// message配置
message.config({
  duration: 2,
  top: '12px'
})

// notification配置
notification.config({
  duration: 3,
  top: '80px'
})

createApp(app)
  .use(Lazyload)
  .use(router)
  .use(store)
  .use(directive)
  .use(i18n)
  .mount('#app')
