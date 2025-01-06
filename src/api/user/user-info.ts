import type { UserState } from '@/stores/modules/user/types'

/** 用户资料 */
export async function getUserInfo() {
  return $http.get<UserState>('/user/info', {}, {
    errorNotify: false
  })
}
