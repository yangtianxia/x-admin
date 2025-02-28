import { defineComponent, computed } from 'vue'

import { Carousel } from 'ant-design-vue'
import { Icon } from '@/components/icon'

import style from './index.module.less'

const slides = computed(() => [
  {
    id: 1,
    title: '开箱即用的高质量模板',
    subtitle: '丰富的的页面模板，覆盖大多数典型业务场景',
  },
  {
    id: 2,
    title: '开箱即用的高质量模板',
    subtitle: '路由配置，状态管理应有尽有',
  },
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
            <div class="!left-6 z-10 !-mt-3 !h-auto !w-auto !text-3xl !text-white !text-opacity-30 before:!content-none hover:!text-white/50 max-xl:!left-3 max-xl:!text-2xl">
              <Icon
                type="LeftC"
                theme="filled"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          ),
          nextArrow: () => (
            <div class="!right-6 z-10 !-mt-3 !h-auto !w-auto !text-3xl !text-white !text-opacity-30 before:!content-none hover:!text-white/50 max-xl:!right-3 max-xl:!text-2xl">
              <Icon
                type="RightC"
                theme="filled"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          ),
        }}
      >
        {slides.value.map((item) => (
          <div key={item.id} class="h-full">
            <div class="flex h-full flex-col items-center justify-center">
              <h4 class="whitespace-nowrap text-h4 text-white/90 max-xl:text-h5">
                {item.title}
              </h4>
              <p class="mt-2 whitespace-nowrap text-md text-white/75 xl:text-sm">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    )
  },
})
