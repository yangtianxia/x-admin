export type RoleType =
  | ''
  | '*'
  | 'admin'
  | 'user'

export interface UserState {
  id?: number
  name?: string
  job?: string
  avatar?: string
  nickName?: string
  phone?: string
  email?: string
  introduction?: string
  location?: string
  jobName?: string
  certification?: number
  role: RoleType
}
