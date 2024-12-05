import axios from '../with-axios'

interface LoginReturn {
  tokenHead?: string
  token: string
}

interface LoginCodeReturn {
  code: string
}

export interface LoginByPwdQuery {
  username: string
  password: string
}

export interface LoginBySmsQuery {
  telephone: string
  code: string
}

/** 密码登录 */
export function postLoginByPwd(data: Partial<LoginByPwdQuery>) {
  return axios.post<LoginReturn>('/login/pwd', data)
}

/** 验证码登录 */
export function postLoginBySms(data: Partial<LoginBySmsQuery>) {
  return axios.post<LoginReturn>('/login/sms', data)
}

/** 短信验证码 - 登录 */
export function postLoginCode(telephone?: string) {
  return axios.post<LoginCodeReturn>('/login/code', { telephone })
}
