import axios from '../with-axios'

/** 菜单列表 */
export function getMenuList() {
  return axios.get<any[]>('/app/menu/list')
}
