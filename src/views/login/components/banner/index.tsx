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
    title: $t('login.slide.title.1'),
    subtitle: $t('login.slide.subtitle.1')
  },
  {
    id: 2,
    title: $t('login.slide.title.2'),
    subtitle: $t('login.slide.subtitle.2')
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
              <div class="text-white/90 text-xl max-xl:text-base font-medium whitespace-nowrap">{item.title}</div>
              <div class="text-white/75 text-sm xl:text-xs mt-2 whitespace-nowrap">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </Carousel>
    )
  }
})
