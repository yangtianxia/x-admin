import { computed } from 'vue'
import { theme, message } from 'ant-design-vue'
import {
  pick,
  omit,
  shallowMerge,
  cloneDeep
} from '@txjs/shared'

import { useAppStore } from '@/store'
import {
  THEME_KEY,
  THEME_SYSTEM,
  THEME_OPTIONS
} from '@/constant/theme'
import {
  setThemeListener,
  listenerThemeChange,
  removeThemeListener
} from '@/shared/theme-listener'
import { rootElement } from '@/shared/element'

const SEED_TOKEN = cloneDeep('seedToken' in window ? seedToken : {} as typeof seedToken)

const useDark = () => {
  rootElement.classList.add('dark')
}

const removeDark = () => {
  rootElement.classList.remove('dark')
}

const notifyHandler = (text?: string) => {
  if (text) {
    message.success(`切换${text}模式`)
  }
}

export const useTheme = () => {
  const appStore = useAppStore()

  const currentTheme = computed(() => appStore.theme)
  const currentMapToken = computed(() => {
    const seedToken = shallowMerge({},
      theme.defaultSeed,
      pick(SEED_TOKEN, [appStore.colorScheme], true),
      omit(SEED_TOKEN, [appStore.colorScheme])
    )
    return appStore.isDark
      ? theme.darkAlgorithm(seedToken)
      : theme.defaultAlgorithm(seedToken)
  })

  const switchTheme = (value: string) => {
    if (appStore.colorScheme === value) return
    appStore.updateSettings({ colorScheme: value })
    appStore.isDark ? useDark() : removeDark()
  }

  const changeTheme = (value: string, prompt = true) => {
    if (appStore.theme === value) return

    // 打开跟随系统主题
    if (value === THEME_SYSTEM) {
      setThemeListener()
      listenerThemeChange(switchTheme)
    } else {
      switchTheme(value)
      removeThemeListener()
    }

    // 缓存主题模式
    appStore.updateSettings({ theme: value })
    localStorage.setItem(THEME_KEY, value)

    // 切换成功提示
    if (prompt) {
      const result = THEME_OPTIONS.find((el) => el.value === value)
      notifyHandler(result?.label)
    }
  }

  const loadTheme = () => {
    const defaultTheme = localStorage.getItem(THEME_KEY)
    if (defaultTheme) {
      changeTheme(defaultTheme, false)
    }
  }

  return {
    currentTheme,
    currentMapToken,
    changeTheme,
    loadTheme
  }
}
