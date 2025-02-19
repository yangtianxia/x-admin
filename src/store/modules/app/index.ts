import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'
import { shallowMerge, cloneDeep } from '@txjs/shared'

import defaultSettings from '@/config/settings'
import { THEME_DARK, THEME_SYSTEM } from '@/constant/theme'
import { rootElement } from '@/shared/element'
import {
  setThemeListener,
  listenerThemeChange,
  removeThemeListener
} from '@/shared/theme-listener'

import type { AppState } from './types'

const seedToken = shallowMerge({}, theme.defaultSeed, cloneDeep(__SEED_TOKEN__))

const dark = theme.darkAlgorithm(seedToken)

const light = theme.defaultAlgorithm(seedToken)

const useAppStore = defineStore('x_admin_app', {
  state: (): AppState => ({ ...defaultSettings }),
  getters: {
    appSettings(state: AppState) {
      return { ...state }
    },
    siderWidth(state: AppState) {
      return state.siderCollapsed ? state.siderWidths[0] : state.siderWidths[1]
    },
    siderCollapseWidth(state: AppState) {
      return state.siderWidths[0]
    },
    seedToken(state: AppState) {
      return state.colorScheme === THEME_DARK ? dark : light
    }
  },
  actions: {
    setSettings(partial: Partial<AppState>) {
      this.$patch(partial)
    },
    toggleSider() {
      this.siderCollapsed = !this.siderCollapsed
    },
    isSelectedTheme(value: string) {
      if (this.systemTheme) {
        return value === THEME_SYSTEM
      } else {
        return this.colorScheme === value
      }
    },
    changeTheme(colorScheme: string) {
      if (colorScheme === THEME_DARK) {
        rootElement.classList.add('dark')
      } else {
        rootElement.classList.remove('dark')
      }
      this.colorScheme = colorScheme
    },
    switchTheme(value: string) {
      this.systemTheme = value === THEME_SYSTEM
      // 跟随系统主题
      if (this.systemTheme) {
        setThemeListener()
        listenerThemeChange(this.changeTheme)
      } else {
        removeThemeListener()
        this.changeTheme(value)
      }
    },
    initTheme() {
      if (this.systemTheme) {
        this.switchTheme(THEME_SYSTEM)
      } else {
        this.switchTheme(this.colorScheme)
      }
    }
  },
  persist: {
    storage: localStorage,
    pick: ['colorScheme', 'systemTheme']
  }
})

export const runAppStore = () => {
  const appStore = useAppStore()
  appStore.initTheme()
}

export default useAppStore
