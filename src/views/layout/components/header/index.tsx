// Vue
import { defineComponent, ref } from 'vue'

// Common
import { LOCALE_OPTIONS } from '@/locale'
import { useAssets } from '@/hooks/assets'
import { useLocale } from '@/hooks/locale'

// Components
import { Icon } from '@/components/icon'
import {
  Avatar,
  Button,
  Tooltip,
  Dropdown,
  Menu
} from 'ant-design-vue'

import less from './index.module.less'

const [name, bem] = BEM('header', less)

export default defineComponent({
  name,

  setup() {
    const locales = [...LOCALE_OPTIONS]
    const { changeLocale, currentLocale } = useLocale()

    const triggerBtnRef = ref<HTMLElement>()

    const onDropdownVisible = () => {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      triggerBtnRef.value?.dispatchEvent(event)
    }

    return () => (
      <div class={bem()}>
        <div class={bem('left')}>
          <img
            src={useAssets('logo.png')}
            alt={import.meta.env.VITE_TITLE}
            class={bem('logo')}
          />
          <h5 class={bem('logo-text')}>
            {import.meta.env.VITE_TITLE}
          </h5>
        </div>
        <ul class={bem('right')}>
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
          <li>
            <Tooltip
              placement="bottom"
              title={$t('header.action.language')}
            >
              <Button
                shape="circle"
                onClick={onDropdownVisible}
              >
                <Icon type="Translate" />
              </Button>
            </Tooltip>
            <Dropdown
              overlayStyle={{ zIndex: 1070 }}
              placement="bottom"
              trigger="click"
              v-slots={{
                overlay: () => (
                  <Menu onClick={({ key }) => changeLocale(key as string)}>
                    {locales.map((item) => (
                      <Menu.Item key={item.value}>
                        {item.label}
                      </Menu.Item>
                    ))}
                  </Menu>
                )
              }}
            >
              <div
                ref={triggerBtnRef}
                class={bem('trigger-btn')}
              />
            </Dropdown>
          </li>
          <li>
            <Avatar>
              <Icon type="User" />
            </Avatar>
          </li>
        </ul>
      </div>
    )
  }
})
