/** 退出登录 */
export function postLogout() {
  return $request.post('/logout')
}
