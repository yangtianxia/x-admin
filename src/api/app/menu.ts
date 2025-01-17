export interface MenuItem {
  id: string
  parentId: string
  type: number
  sort: number
  title: string
  name: string
  path: string
  redirect: string
  icon: string
  noAffix: boolean
  isCache: boolean
  isHidden: boolean
  isHiddenChildren: boolean
  isExternal: boolean
  component: string
  children?: MenuItem[]
  [x: string]: any
}

/** 菜单列表 */
export function getMenuList() {
  return $http.get<MenuItem[]>('/menu/list')
}
