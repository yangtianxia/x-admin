import 'vue-router'
import type { IconMap } from '@/components/icon/map'

declare module 'vue-router' {
  interface RouteMeta {
    /** 控制能够访问页面的角色 */
    roles?: string[]
    /** 是否需要登录才能访问当前页面（每个路由必须声明） */
    requiresAuth: boolean
    /** 登录授权后禁止访问 */
    authNoAccessAfter?: boolean
    /** 在侧边菜单中显示的图标 */
    icon?: IconMap
    /** 在侧边菜单和面包屑中显示的本地化名称 */
    locale?: string
    /** 如果为true，将不在侧边菜单中显示 */
    hideInMenu?: boolean
    /** 如果设置为true，子菜单将不在侧边菜单中显示 */
    hideChildrenInMenu?: boolean
    /** 如果设置了名称，菜单将根据您设置的名称进行高亮显示 */
    activeMenu?: string
    /** 对路由菜单项进行排序。如果设置了键值，数值越大，越靠前显示 */
    order?: number
    /** 如果设置为true，标签将不会在选项卡栏中固定 */
    noAffix?: boolean
    /** 如果设置为true，页面将不会被缓存 */
    ignoreCache?: boolean
  }
}
