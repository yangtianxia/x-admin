// Vue
import { defineComponent } from 'vue'

// Common
import { LOCALE_OPTIONS } from '@/locale'
import { useLocale } from '@/hooks/locale'
import { THEME_OPTIONS, useTheme } from '@/hooks/theme'

// Components
import { Icon } from '@/components/icon'
import { Dropdown, Menu, Divider } from 'ant-design-vue'
import LayoutFooter from '@/layout/components/footer'
import LoginBanner from './components/banner'
import LoginForm from './components/form'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const locales = [...LOCALE_OPTIONS]
    const { changeLocale } = useLocale()
    const { currentTheme, changeTheme } = useTheme()

    return () => (
      <div class="flex h-screen min-h-[640px] relative">
        <div class="z-10 absolute top-6 left-6 max-xl:left-4 flex items-center">
          <img
            src="/logo.png"
            alt={$t('page.title')}
            class="w-8"
          />
          <h4 class="text-white/90 max-md:text text-h4 ml-2 mr-1">{$t('page.title')}</h4>
        </div>
        <div class="z-10 absolute top-6 right-6 max-xl:right-6 flex items-center">
          <Dropdown
            placement="bottom"
            trigger="click"
            overlayStyle={{zIndex: 1070}}
            overlay={(
              <Menu onClick={({ key }) => changeLocale(key as string)}>
                {locales.map((item) => (
                  <Menu.Item key={item.value}>
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            )}
          >
            <div class="cursor-pointer inline-flex items-center text hover:text-tertiary">
              <Icon type="Translate" />
              <span class="text-sm ml-1">{$t('login.locale')}</span>
            </div>
          </Dropdown>
          <Divider
            class="border-100 mx-3"
            type="vertical"
          />
          <Dropdown
            placement="bottomRight"
            trigger="click"
            overlayStyle={{zIndex: 1070}}
            overlay={(
              <Menu onClick={({ key }) => changeTheme(key as string)}>
                {THEME_OPTIONS.value.map((item) => (
                  <Menu.Item
                    key={item.value}
                    class={currentTheme.value === item.value ? '!text-primary' : null}
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
              <span class="text-sm ml-1">{$t('login.theme')}</span>
            </div>
          </Dropdown>
        </div>
        <div class="h-full w-[540px] flex-shrink-0 transition-all max-xl:w-[380px] max-md:hidden bg-gradient-to-br from-black/80 to-primary-active">
          <LoginBanner />
        </div>
        <div class="relative flex-1 min-w-0 max-xl:min-w-[420px] max-md:min-w-full flex justify-center items-center px-6 pb-10 bg-container">
          <LoginForm />
          <div class="absolute left-0 bottom-0 w-full h-10 flex items-center justify-center">
            <LayoutFooter />
          </div>
        </div>
      </div>
    )
  }
})
