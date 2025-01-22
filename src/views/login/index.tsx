// Vue
import { defineComponent } from 'vue'

// Common
import { useAppStore } from '@/store'
import { THEME_OPTIONS } from '@/constant/theme'

// Components
import { Icon } from '@/components/icon'
import { Dropdown, Menu } from 'ant-design-vue'
import LayoutFooter from '@/layout/components/footer'
import LoginBanner from './components/banner'
import LoginForm from './components/form'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const appStore = useAppStore()
    return () => (
      <div class="flex h-screen min-h-[640px] relative">
        <div class="z-10 absolute top-6 left-6 max-xl:left-4 flex items-center">
          <img
            src="/logo.png"
            alt={import.meta.env.VITE_TITLE}
            class="w-8"
          />
          <h4 class="text-white/90 max-md:text text-h4 ml-2 mr-1">{import.meta.env.VITE_TITLE}</h4>
        </div>
        <div class="z-10 absolute top-6 right-6 max-xl:right-6 flex items-center">
          <Dropdown
            placement="bottomRight"
            trigger="click"
            overlayStyle={{zIndex: 1070}}
            overlay={(
              <Menu onClick={({ key }) => appStore.switchTheme(key as string)}>
                {THEME_OPTIONS.map((item) => (
                  <Menu.Item
                    key={item.value}
                    class={appStore.isSelectedTheme(item.value) ? '!text-primary' : null}
                  >
                    <Icon
                      class="mr-1"
                      type={item.icon}
                    />
                    <span>{item.label}</span>
                  </Menu.Item>
                ))}
              </Menu>
            )}
          >
            <div class="cursor-pointer inline-flex items-center space-x-1 text hover:text-tertiary">
              <Icon
                class="dark:hidden"
                type="SunOne"
              />
              <Icon
                class="!hidden dark:!inline-block"
                type="Moon"
              />
              <span class="text-sm ml-1">主题</span>
            </div>
          </Dropdown>
        </div>
        <div class="h-full w-[540px] flex-shrink-0 transition-all max-xl:w-[380px] max-md:hidden bg-gradient-to-br from-black/80 to-primary-active">
          <LoginBanner />
        </div>
        <div class="relative flex-1 min-w-0 max-xl:min-w-[420px] max-md:min-w-full flex justify-center items-center px-6 pb-10 bg-container">
          <LoginForm />
          {appStore.footer ? (
            <div class="absolute left-0 bottom-0 w-full h-10 flex items-center justify-center">
              <LayoutFooter />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
})
