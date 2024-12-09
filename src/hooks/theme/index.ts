import { computed } from 'vue'
import { pick, omit, shallowMerge, cloneDeep } from '@txjs/shared'
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/stores'
import { THEME } from '@/shared/constant'

export const useTheme = () => {
  const globalSeedToken = cloneDeep('$seedToken' in window ? $seedToken : {} as typeof $seedToken)
  const appStore = useAppStore()
  const currentTheme = computed(() => {
    const seedToken = shallowMerge({},
      theme.defaultSeed,
      pick(globalSeedToken, [appStore.theme], true),
      omit(globalSeedToken, [appStore.theme])
    )
    switch (appStore.theme) {
      case 'dark':
        return theme.darkAlgorithm(seedToken)
      default:
      case 'light':
        return theme.defaultAlgorithm(seedToken)
    }
  })
  const changeTheme = (value: string) => {
    if (appStore.theme === value) return
    appStore.updateSettings({
      theme: value
    })
    localStorage.setItem(THEME, value)
  }
  return { currentTheme, changeTheme }
}
