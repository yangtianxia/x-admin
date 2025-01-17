import type { RouteRecordRaw } from 'vue-router'

export interface RouteState {
  routes: RouteRecordRaw[]
  asyncRoutes: RouteRecordRaw[]
}
