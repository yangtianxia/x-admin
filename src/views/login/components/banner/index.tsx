// Vue
import { defineComponent, computed } from 'vue'

// Components
import { Icon } from '@/components/icon'
import { Carousel } from 'ant-design-vue'

// Style
import style from './index.module.less'

const slides = computed(() => [
  {
    id: 1,
    title: '开箱即用的高质量模板',
    subtitle: '丰富的的页面模板，覆盖大多数典型业务场景'
  },
  {
    id: 2,
    title: '开箱即用的高质量模板',
    subtitle: '路由配置，状态管理应有尽有'
  }
])

export default defineComponent({
  name: 'LoginBanner',
  setup() {
    return () => (
      <Carousel
        arrows
        effect="fade"
        class={style.banner}
        v-slots={{
          prevArrow: () => (
            <div class="z-10 !text-white !text-opacity-30 hover:!text-white/50 !text-3xl !w-auto !h-auto !-mt-3 !left-6 max-xl:!text-2xl max-xl:!left-3 before:!content-none">
              <Icon
                type="LeftC"
                theme="filled"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          ),
          nextArrow: () => (
            <div class="z-10 !text-white !text-opacity-30 hover:!text-white/50 !text-3xl !w-auto !h-auto !-mt-3 !right-6 max-xl:!text-2xl max-xl:!right-3 before:!content-none">
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
        {slides.value.map((item) => (
          <div
            key={item.id}
            class="h-full"
          >
            <div class="h-full flex flex-col items-center justify-center">
              <h4 class="text-white/90 text-h4 max-xl:text-h5 whitespace-nowrap">{item.title}</h4>
              <p class="text-white/75 text-md xl:text-sm mt-2 whitespace-nowrap">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </Carousel>
    )
  }
})
