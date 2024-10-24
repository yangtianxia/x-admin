import { Carousel } from 'ant-design-vue'
import { Icon } from '@/components/icon'

import BEM from '@txjs/bem'
import { defineComponent } from 'vue'

import style from '../index.module.less'

const [name, bem] = BEM('login-banner', style)

const slides = [
  {
    id: 1,
    title: '开箱即用的高质量模板',
    subtitle: '丰富的的页面模板，覆盖大多数典型业务场景'
  },
  {
    id: 2,
    title: '内置了常见问题的解决方案',
    subtitle: '路由配置，状态管理应有尽有'
  }
] as const

export default defineComponent({
  name,

  setup() {
    return () => (
      <Carousel
        arrows
        effect="fade"
        class={bem()}
        v-slots={{
          prevArrow: () => (
            <div class={bem('arrow', 'left')}>
              <Icon
                type="LeftC"
                theme="filled"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          ),
          nextArrow: () => (
            <div class={bem('arrow', 'right')}>
              <Icon
                type="RightC"
                theme="filled"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          )
        }}
      >
        {slides.map((item) => (
          <div
            key={item.id}
            class={bem('slide')}
          >
            <div class={bem('slide-inner')}>
              <div class={bem('slide-title')}>{item.title}</div>
              <div class={bem('slide-subtitle')}>{item.subtitle}</div>
            </div>
          </div>
        ))}
      </Carousel>
    )
  }
})
