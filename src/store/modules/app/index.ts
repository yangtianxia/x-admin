import { defineStore } from 'pinia'

import defaultSettings from '@/config/settings'
import { THEME_LIGHT, THEME_DARK } from '@/constant/theme'

import type { AppState } from './types'

const useAppStore = defineStore('app', {
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
    isDark(state: AppState) {
      return state.colorScheme === THEME_DARK
    },
    isLight(state: AppState) {
      return state.colorScheme === THEME_LIGHT
    },
  },
  actions: {
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore
      this.$patch(partial)
    },
    toggleSider() {
      this.siderCollapsed = !this.siderCollapsed
    }
  }
})

export default useAppStore
