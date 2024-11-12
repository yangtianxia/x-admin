import Mock from 'mockjs'
import { isLogin } from '@/shared/auth'
import { USER_ROLE_KEY } from '@/shared/constant'
import setupMock, { successResponseWrap, failResponseWrap } from '../setup'
import type { MockParams } from '../types'

setupMock({
  setup() {
    // 登录
    Mock.mock(new RegExp('/login'), (params: MockParams) => {
      const { username, password } = JSON.parse(params.body)
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 403)
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 403)
      }
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem(USER_ROLE_KEY, 'admin')
        return successResponseWrap({
          token: '12345'
        })
      }
      if (username === 'user' && password === 'user') {
        localStorage.setItem(USER_ROLE_KEY, 'user')
        return successResponseWrap({
          token: '54321'
        })
      }
      return failResponseWrap(null, '账号或者密码错误', 403)
    })

    // 登出
    Mock.mock(new RegExp('/logout'), () => {
      return successResponseWrap(null)
    })

    // 用户信息
    Mock.mock(new RegExp('/user/info'), () => {
      if (isLogin()) {
        const role = localStorage.getItem(USER_ROLE_KEY) || 'admin'
        return successResponseWrap({
          name: 'admin',
          avatar: '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role
        })
      }
      return failResponseWrap(null, '未登录', 403)
    })
  }
})
