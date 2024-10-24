import { defineStore } from 'pinia'
import { setToken, clearToken } from '@/shared/auth'
import { removeRouteListener } from '@/shared/route-listener'

import { getUserInfo } from '@/api/user/user-info'
import { postLogin, type LoginQuery } from '@/api/user/login'
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

    async login(loginForm: LoginQuery) {
      try {
        const result = await postLogin(loginForm)
        setToken(result.token)
      } catch (err) {
        clearToken()
        throw err
      }
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
