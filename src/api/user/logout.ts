/** 退出登录 */
export function postLogout() {
  return $fetch.post('/logout')
}
