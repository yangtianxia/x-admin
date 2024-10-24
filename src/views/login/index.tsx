import BEM from '@txjs/bem'
import { defineComponent } from 'vue'
import { useAssets } from '@/hooks/assets'

import LoginBanner from './components/LoginBanner'
import LoginForm from './components/LoginForm'

import style from './index.module.less'

const [name, bem] = BEM('login', style)

export default defineComponent({
  name,

  setup() {
    return () => (
      <div class={bem()}>
        <div class={bem('logo')}>
          <img
            src={useAssets('logo.png')}
            alt={import.meta.env.VITE_TITLE}
            class={bem('logo-img')}
          />
          <div class={bem('logo-text')}>{import.meta.env.VITE_TITLE}</div>
        </div>
        <div class={bem('banner')}>
          <div class={bem('banner-inner')}>
            <LoginBanner />
          </div>
        </div>
        <div class={bem('content')}>
          <div class={bem('content-inner')}>
            <LoginForm />
          </div>
          <div class={bem('footer')}>
            <div class={bem('footer-text')}>©{import.meta.env.VITE_COPYRIGHT}</div>
          </div>
        </div>
      </div>
    )
  }
})