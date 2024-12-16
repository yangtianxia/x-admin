/** 菜单列表 */
export function getMenuList() {
  return $request.get<any[]>('/app/menu/list')
}
