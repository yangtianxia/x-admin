/** 退出登录 */
export function postLogout() {
  return $http.post('/logout')
}
