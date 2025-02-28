import { defineComponent } from 'vue'
import { useAppStore } from '@/store'
import { THEME_OPTIONS } from '@/constant/theme'

import { Dropdown, Menu } from 'ant-design-vue'
import { Icon } from '@/components/icon'
import LayoutFooter from '@/layout/components/footer'

import LoginBanner from './components/banner'
import LoginForm from './components/form'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const appStore = useAppStore()
    return () => (
      <div class='relative flex h-screen min-h-[640px]'>
        <div class='absolute left-6 top-6 z-10 flex items-center max-xl:left-4'>
          <img src='/logo.png' alt={import.meta.env.VITE_TITLE} class='w-8' />
          <h4 class='ml-2 mr-1 text-h4 text-white/90 max-md:text'>
            {import.meta.env.VITE_TITLE}
          </h4>
        </div>
        <div class='absolute right-6 top-6 z-10 flex items-center max-xl:right-6'>
          <Dropdown
            placement='bottomRight'
            trigger='click'
            overlayStyle={{ zIndex: 1070 }}
            overlay={
              <Menu onClick={({ key }) => appStore.switchTheme(key as string)}>
                {THEME_OPTIONS.map((item) => (
                  <Menu.Item
                    key={item.value}
                    class={
                      appStore.isSelectedTheme(item.value)
                        ? '!text-primary'
                        : null
                    }
                  >
                    <Icon class='mr-1' type={item.icon} />
                    <span>{item.label}</span>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <div class='inline-flex cursor-pointer items-center space-x-1 text hover:text-tertiary'>
              <Icon class='dark:hidden' type='SunOne' />
              <Icon class='!hidden dark:!inline-block' type='Moon' />
              <span class='ml-1 text-sm'>主题</span>
            </div>
          </Dropdown>
        </div>
        <div class='h-full w-[540px] flex-shrink-0 bg-gradient-to-br from-black/80 to-primary-active transition-all max-xl:w-[380px] max-md:hidden'>
          <LoginBanner />
        </div>
        <div class='relative flex min-w-0 flex-1 items-center justify-center bg-container px-6 pb-10 max-xl:min-w-[420px] max-md:min-w-full'>
          <LoginForm />
          {appStore.footer ? (
            <div class='absolute bottom-0 left-0 flex h-10 w-full items-center justify-center'>
              <LayoutFooter />
            </div>
          ) : null}
        </div>
      </div>
    )
  },
})
