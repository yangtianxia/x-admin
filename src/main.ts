import 'ant-design-vue/dist/reset.css'
import '@/global.less'

import { createApp } from 'vue'
import { message, notification } from 'ant-design-vue'

import app from '@/App'
import router from '@/router'
import store, { runAppStore } from '@/store'
import directive from '@/directive'

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
  .use(router)
  .use(store)
  .use(directive)
  .mount('#app')
  .$nextTick(runAppStore)
