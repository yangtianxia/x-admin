import axios from '../with-axios'
import type { UserState } from '@/stores/modules/user/types'

/** 用户资料 */
export async function getUserInfo() {
  return axios.get<UserState>('/user/info')
}
