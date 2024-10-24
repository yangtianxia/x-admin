import type { RouteRecordNormalized } from 'vue-router'

export interface AppState {
  theme: string
  device: string
  header: boolean
  menu: boolean
  topMenu: boolean
  hideMenu: boolean
  menuCollapse: boolean
  footer: boolean
  menuWidth: number
  menuFromServer: boolean
  serverMenu: RouteRecordNormalized[]
  [key: string]: unknown
}
