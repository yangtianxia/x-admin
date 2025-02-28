import { defineComponent, ref, type Ref } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import { useRedirect } from '@/hooks/redirect'
import { THEME_OPTIONS } from '@/constant/theme'

import { Avatar, Button, Tooltip, Dropdown, Menu } from 'ant-design-vue'
import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'LayoutHeader',
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()

    const themeRef = ref<HTMLElement>()

    const onClick = (el: Ref<HTMLElement | undefined>) => {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      el.value?.dispatchEvent(event)
    }

    const onLogout = async () => {
      await userStore.logout()
      useRedirect().goto()
    }

    return () => (
      <div class='fixed left-0 top-0 z-50 flex h-[60px] w-full justify-between border-b bg-container'>
        <div class='flex items-center pl-5'>
          <img src='/logo.png' class='w-8' alt={import.meta.env.VITE_TITLE} />
          <h4 class='ml-2 text-h4 text'>{import.meta.env.VITE_TITLE}</h4>
        </div>
        <ul class='flex items-center space-x-3 pr-8'>
          <li>
            <Tooltip placement='bottom' title='搜索'>
              <Button shape='circle'>
                <Icon type='Search' />
              </Button>
            </Tooltip>
          </li>
          <li class='relative'>
            <Tooltip placement='bottom' title='主题'>
              <Button shape='circle' onClick={() => onClick(themeRef)}>
                <Icon class='dark:hidden' type='SunOne' />
                <Icon class='!hidden dark:!inline-block' type='Moon' />
              </Button>
            </Tooltip>
            <Dropdown
              placement='bottom'
              trigger='click'
              overlayStyle={{ zIndex: 1070 }}
              overlay={
                <Menu
                  onClick={({ key }) => appStore.switchTheme(key as string)}
                >
                  {THEME_OPTIONS.map((item) => (
                    <Menu.Item
                      key={item.value}
                      class={
                        appStore.isSelectedTheme(item.value)
                          ? '!text-primary'
                          : ''
                      }
                    >
                      <Icon class='mr-1' type={item.icon} />
                      <span>{item.label}</span>
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <div class='absolute bottom-0 left-1/2' ref={themeRef} />
            </Dropdown>
          </li>
          <li>
            <Dropdown
              placement='bottom'
              trigger='click'
              overlayStyle={{ zIndex: 1070 }}
              overlay={
                <Menu>
                  <Menu.Item icon={<Icon type='Logout' />} onClick={onLogout}>
                    退出登录
                  </Menu.Item>
                </Menu>
              }
            >
              <Avatar
                class='cursor-pointer border border-100'
                src={userStore.avatar}
              >
                <Icon type='User' />
              </Avatar>
            </Dropdown>
          </li>
        </ul>
      </div>
    )
  },
})
