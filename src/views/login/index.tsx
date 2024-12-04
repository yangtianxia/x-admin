// Vue
import { defineComponent } from 'vue'

// Common
import { LOCALE_OPTIONS } from '@/locale'
import { useLocale } from '@/hooks/locale'

// Components
import { Icon } from '@/components/icon'
import { Dropdown, Menu } from 'ant-design-vue'
import LoginBanner from './components/banner'
import LoginForm from './components/form'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const locales = [...LOCALE_OPTIONS]
    const { changeLocale } = useLocale()

    return () => (
      <div class="flex h-screen min-h-[640px] relative">
        <div class="absolute top-6 left-0 z-10 w-full px-6 max-xl:px-4 flex items-center justify-between">
          <div class="inline-flex items-center">
            <img
              src="/logo.png"
              alt={$t('common.title')}
              class="w-8"
            />
            <div class="text-gray-100 max-md:text-gray-900 text-xl font-semibold ml-2 mr-1">{$t('common.title')}</div>
          </div>
          <Dropdown
            placement="bottom"
            trigger="click"
            overlayStyle={{ zIndex: 1070 }}
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
            <div class="cursor-pointer inline-flex text-grey-700 hover:text-gray-500 items-center space-x-1">
              <Icon type="Translate" />
              <span class="text-sm">{$t('login.locale')}</span>
            </div>
          </Dropdown>
        </div>
        <div class="h-full w-[540px] flex-shrink-0 transition-all max-xl:w-[380px] max-md:hidden bg-gradient-to-r from-slate-900 to-slate-700">
          <LoginBanner />
        </div>
        <div class="relative flex-1 min-w-0 max-xl:min-w-[420px] max-md:min-w-full flex justify-center items-center px-6 pb-10">
          <LoginForm />
          <div class="absolute left-0 bottom-0 w-full h-10 flex items-center justify-center">
            <div class="text-gray-400 text-sm">©{$t('common.copyright')}</div>
          </div>
        </div>
      </div>
    )
  }
})
