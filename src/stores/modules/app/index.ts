import type { RouteRecordNormalized } from 'vue-router'
import { defineStore } from 'pinia'
import { THEME_LIGHT_KEY, THEME_DARK_KEY } from '@/shared/constant'
import { getMenuList } from '@/api/app/menu'
import defaultSettings from '@/config/settings'
import type { AppState } from './types'

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),
  getters: {
    isDark(state: AppState) {
      return state.colorScheme === THEME_DARK_KEY
    },
    isLight(state: AppState) {
      return state.colorScheme === THEME_LIGHT_KEY
    },
    appCurrentSettings(state: AppState) {
      return { ...state }
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu
    }
  },
  actions: {
    updateSettings(settings: Partial<AppState>) {
      // @ts-ignore
      this.$patch(settings)
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value
    },
    async fetchServerMenuConfig() {
      try {
        this.serverMenu = await getMenuList()
      } catch {
        // TODO: notify
      }
    },
    clearServerMenu() {
      this.serverMenu = []
    }
  }
})

export default useAppStore
