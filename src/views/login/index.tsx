// Vue
import { defineComponent } from 'vue'

// Common
import { useAssets } from '@/hooks/assets'

// Components
import LoginBanner from './components/banner'
import LoginForm from './components/form'

// Style
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
