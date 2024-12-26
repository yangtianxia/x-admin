import { computed } from 'vue'
import { theme, message } from 'ant-design-vue'
import {
  pick,
  omit,
  shallowMerge,
  cloneDeep
} from '@txjs/shared'
import { useAppStore } from '@/stores'
import { setThemeListener, listenerThemeChange, removeThemeListener } from '@/shared/theme-listener'
import {
  THEME_KEY,
  THEME_DARK_KEY,
  THEME_LIGHT_KEY,
  THEME_SYSTEM_KEY
} from '@/shared/constant'

const SEED_TOKEN = cloneDeep('seedToken' in window ? seedToken : {} as typeof seedToken)

export const THEME_OPTIONS = computed(() => [
  { label: $t('theme.light'), value: THEME_LIGHT_KEY, icon: 'SunOne' as const },
  { label: $t('theme.dark'), value: THEME_DARK_KEY, icon: 'Moon' as const },
  { label: $t('theme.system'), value: THEME_SYSTEM_KEY, icon: 'Computer' as const }
])

const useDark = () => {
  document.documentElement.classList.add('dark')
}

const removeDark = () => {
  document.documentElement.classList.remove('dark')
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
    if (value === THEME_SYSTEM_KEY) {
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
      message.success($t('theme.switch', [$t(`theme.${value}`)]))
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
