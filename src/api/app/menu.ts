/** 菜单列表 */
export function getMenuList() {
  return $http.get<any[]>('/app/menu/list')
}
