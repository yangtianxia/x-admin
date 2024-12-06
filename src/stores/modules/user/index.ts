import { defineStore } from 'pinia'
import { isLogin, setToken, clearToken } from '@/shared/auth'
import { removeRouteListener } from '@/shared/route-listener'
import { TOKEN_HEAD, REQUEST_TOKEN_KEY } from '@/shared/constant'

import {
  postLoginByPwd,
  postLoginBySms,
  type LoginByPwdQuery,
  type LoginBySmsQuery,
  type LoginReturn
} from '@/api/user/login'
import { getUserInfo } from '@/api/user/user-info'
import { postLogout } from '@/api/user/logout'

import useAppStore from '../app'
import type { UserState } from './types'

const useUserStore = defineStore('user', {
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
    role: ''
  }),
  getters: {
    isLogin(state: UserState) {
      return !!state.id && isLogin()
    },
    userInfo(state: UserState): UserState {
      return { ...state }
    }
  },
  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user'
        resolve(this.role)
      })
    },
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
      if (REQUEST_TOKEN_KEY === 'Authorization') {
        const token = [data.tokenHead || TOKEN_HEAD, data.token].join('')
        setToken(token)
      }
      // TODO 其他TOKEN认证方式
    },
    logoutCallback() {
      const appStore = useAppStore()
      this.resetInfo()
      clearToken()
      removeRouteListener()
      appStore.clearServerMenu()
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
