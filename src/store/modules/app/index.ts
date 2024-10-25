import type { RouteRecordNormalized } from 'vue-router'
import type { AppState } from './types'
import { defineStore } from 'pinia'
import { getMenuList } from '@/api/app/menu'
import defaultSettings from '@/config/settings'

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),
  getters: {
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
