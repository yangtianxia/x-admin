// Vue
import {
  defineComponent,
  ref,
  type Ref
} from 'vue'

// Common
import { useUserStore } from '@/stores'
import { LOCALE_OPTIONS } from '@/locale'
import { useLocale } from '@/hooks/locale'
import { THEME_OPTIONS, useThemes } from '@/hooks/themes'
import { useRedirect } from '@/hooks/redirect'

// Components
import { Icon } from '@/components/icon'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { Avatar, Button, Tooltip, Dropdown, Menu } from 'ant-design-vue'

export default defineComponent({
  name: 'LayoutHeader',
  setup() {
    const locales = [...LOCALE_OPTIONS]
    const { changeLocale } = useLocale()
    const { currentTheme, changeTheme } = useThemes()
    const userStore = useUserStore()
    const { goto } = useRedirect()

    const localeTriggerRef = ref<HTMLElement>()
    const themeTriggerRef = ref<HTMLElement>()

    const onDropdownClick = (elRef: Ref<HTMLElement | undefined>) => {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      elRef.value?.dispatchEvent(event)
    }

    const onLogout = async () => {
      userStore.logout()
      goto()
    }

    return () => (
      <div class="z-50 fixed top-0 left-0 w-full h-[60px] flex justify-between border-b bg-container">
        <div class="flex items-center pl-5">
          <img
            src="/logo.png"
            class="w-8"
            alt={$t('page.title')}
          />
          <h1 class="text-main text-xl font-bold ml-2">
            <span>{$t('page.title')}</span>
          </h1>
        </div>
        <ul class="flex items-center pr-8 space-x-3">
          <li>
            <Tooltip
              placement="bottom"
              title={$t('header.action.search')}
            >
              <Button shape="circle">
                <Icon type="Search" />
              </Button>
            </Tooltip>
          </li>
          <li class="relative">
            <Tooltip
              placement="bottom"
              title={$t('header.action.language')}
            >
              <Button
                shape="circle"
                onClick={() => onDropdownClick(localeTriggerRef)}
              >
                <Icon type="Translate" />
              </Button>
            </Tooltip>
            <Dropdown
              placement="bottom"
              trigger="click"
              overlayStyle={{zIndex: 1070}}
              overlay={(
                <Menu onClick={({ key }) => changeLocale(key as string)}>
                  {locales.map((item) => (
                    <Menu.Item key={item.value}>{item.label}</Menu.Item>
                  ))}
                </Menu>
              )}
            >
              <div
                ref={localeTriggerRef}
                class="absolute bottom-0 left-1/2"
              />
            </Dropdown>
          </li>
          <li class="relative">
            <Tooltip
              placement="bottom"
              title={$t('header.action.theme')}
            >
              <Button
                shape="circle"
                onClick={() => onDropdownClick(themeTriggerRef)}
              >
                <Icon
                  class="dark:hidden"
                  type="SunOne"
                />
                <Icon
                  class="!hidden dark:!inline-block"
                  type="Moon"
                />
              </Button>
            </Tooltip>
            <Dropdown
              placement="bottom"
              trigger="click"
              overlayStyle={{zIndex: 1070}}
              overlay={(
                <Menu onClick={({ key }) => changeTheme(key as string)}>
                  {THEME_OPTIONS.value.map((item) => (
                    <Menu.Item
                      key={item.value}
                      class={currentTheme.value === item.value ? '!text-primary' : ''}
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
              <div
                ref={themeTriggerRef}
                class="absolute bottom-0 left-1/2"
              />
            </Dropdown>
          </li>
          <li>
            <Dropdown
              placement="bottom"
              trigger="click"
              overlayStyle={{ zIndex: 1070 }}
              overlay={(
                <Menu>
                  <Menu.Item
                    icon={<LogoutOutlined />}
                    onClick={onLogout}
                  >退出登录</Menu.Item>
                </Menu>
              )}
            >
              <Avatar
                class="cursor-pointer border-main"
                src={userStore.avatar}
              >
                <Icon type="User" />
              </Avatar>
            </Dropdown>
          </li>
        </ul>
      </div>
    )
  }
})
