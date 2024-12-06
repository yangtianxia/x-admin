/** 菜单列表 */
export function getMenuList() {
  return $fetch.get<any[]>('/app/menu/list')
}
