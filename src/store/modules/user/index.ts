import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { isLogin, setToken, clearToken } from '@/shared/auth'
import { removeRouteListener } from '@/shared/route-listener'
import { TOKEN_HEAD_KEY, REQUEST_TOKEN_KEY } from '@/constant/http'

import {
  postLoginByPwd,
  postLoginBySms,
  type LoginByPwdQuery,
  type LoginBySmsQuery,
  type LoginReturn
} from '@/api/user/login'
import { getUserInfo } from '@/api/user/user-info'
import { postLogout } from '@/api/user/logout'

import type { UserState } from './types'

const useUserStore = defineStore('x_admin_user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    job: undefined,
    avatar: undefined,
    nickName: undefined,
    phone: undefined,
    email: undefined,
    introduction: undefined,
    location: undefined,
    jobName: undefined,
    certification: undefined,
    roles: [],
    permissions: []
  }),
  getters: {
    hasUserInfo(state: UserState) {
      return !!state.id && isLogin()
    },
    userInfo(state: UserState): UserState {
      return { ...state }
    }
  },
  actions: {
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial)
    },
    resetInfo() {
      this.$reset()
    },
    async getUserInfo() {
      const result = await getUserInfo()
      this.setInfo(result)
    },
    async loginByPwd(loginForm: Partial<LoginByPwdQuery>) {
      try {
        const result = await postLoginByPwd(loginForm)
        this.loginAfter(result)
      } catch (err) {
        clearToken()
        throw err
      }
    },
    async loginBySms(loginForm: Partial<LoginBySmsQuery>) {
      try {
        const result = await postLoginBySms(loginForm)
        this.loginAfter(result)
      } catch (err) {
        clearToken()
        throw err
      }
    },
    loginAfter(data: LoginReturn) {
      // TODO 根据业务需要替换TOKEN认证方式
      if (REQUEST_TOKEN_KEY === 'Authorization') {
        const token = [data.tokenHead || TOKEN_HEAD_KEY, data.token].join('')
        setToken(token)
      }
    },
    logoutCallback() {
      this.resetInfo()
      clearToken()
      resetRouter()
      removeRouteListener()
    },
    async logout() {
      try {
        await postLogout()
      } finally {
        this.logoutCallback()
      }
    }
  }
})

export default useUserStore
