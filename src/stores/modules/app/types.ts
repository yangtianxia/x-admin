import type { RouteRecordNormalized } from 'vue-router'

export interface AppState {
  theme: string
  colorScheme: string
  header: boolean
  menu: boolean
  topMenu: boolean
  hideMenu: boolean
  menuCollapse: boolean
  footer: boolean
  menuWidth: number
  menuCollapseWidth: number
  headerHeight: number
  menuFromServer: boolean
  serverMenu: RouteRecordNormalized[]
  [key: string]: unknown
}
