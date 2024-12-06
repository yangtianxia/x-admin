// Vue
import { defineComponent, ref } from 'vue'

// Common
import { useUserStore } from '@/stores'
import { LOCALE_OPTIONS } from '@/locale'
import { useLocale } from '@/hooks/locale'
import { useRedirect } from '@/hooks/redirect'

// Components
import { LogoutOutlined } from '@ant-design/icons-vue'
import { Icon } from '@/components/icon'
import {
  Avatar,
  Button,
  Tooltip,
  Dropdown,
  Menu
} from 'ant-design-vue'

export default defineComponent({
  name: 'LayoutHeader',
  setup() {
    const locales = [...LOCALE_OPTIONS]
    const { changeLocale } = useLocale()
    const userStore = useUserStore()
    const redirect = useRedirect()

    const localeTriggerRef = ref<HTMLElement>()

    const onLocaleDropdownShow = () => {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      localeTriggerRef.value?.dispatchEvent(event)
    }

    const onLogout = async () => {
      userStore.logout()
      redirect.goto()
    }

    return () => (
      <div class="h-full flex justify-between border-b late-200 bg-white">
        <div class="flex items-center pl-5">
          <img
            src="/logo.png"
            class="w-8"
            alt={$t('page.title')}
          />
          <h5 class="text-gray-900 text-xl font-bold ml-2">
            <span>{$t('page.title')}</span>
          </h5>
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
                onClick={onLocaleDropdownShow}
              >
                <Icon type="Translate" />
              </Button>
            </Tooltip>
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
              <div
                ref={localeTriggerRef}
                class="absolute bottom-[14px] left-[50%]"
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
                class="cursor-pointer border-gray-400"
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
