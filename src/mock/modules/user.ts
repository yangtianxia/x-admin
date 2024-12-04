import Mock from 'mockjs'
import { isPhoneNumber } from '@txjs/bool'
import { isLogin } from '@/shared/auth'
import { USER_ROLE_KEY } from '@/shared/constant'
import setupMock, { successResponseWrap, failResponseWrap } from '../setup'
import type { MockParams } from '../types'

setupMock({
  setup() {
    // 密码登录
    Mock.mock(new RegExp('/login/pwd'), (params: MockParams) => {
      const { username, password } = JSON.parse(params.body)
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 400)
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 400)
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
      return failResponseWrap(null, '账号或者密码错误', 400)
    })

    // 验证码登录
    Mock.mock(new RegExp('/login/sms'), (params: MockParams) => {
      const { telephone, code } = JSON.parse(params.body)
      if (!telephone) {
        return failResponseWrap(null, '手机号不能为空', 400)
      }
      if (!code) {
        return failResponseWrap(null, '验证码不能为空', 400)
      }
      if (!isPhoneNumber(telephone)) {
        return failResponseWrap(null, '手机号格式错误', 400)
      }
      if (telephone === '13166668888' && code === '123456') {
        localStorage.setItem(USER_ROLE_KEY, 'admin')
        return successResponseWrap({
          token: '12345'
        })
      }
      if (telephone === '13677779999' && code === '123456') {
        localStorage.setItem(USER_ROLE_KEY, 'user')
        return successResponseWrap({
          token: '54321'
        })
      }
      return failResponseWrap(null, '手机号或验证码错误', 400)
    })

    // 发送登录验证码
    Mock.mock(new RegExp('/login/code'), (params: MockParams) => {
      const { telephone } = JSON.parse(params.body)
      if (!telephone) {
        return failResponseWrap(null, '手机号不能为空', 400)
      }
      if (!isPhoneNumber(telephone)) {
        return failResponseWrap(null, '手机号格式错误', 400)
      }
      return successResponseWrap(null)
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
          avatar: 'https://avatars.githubusercontent.com/yangtianxia',
          email: '1399378817@qq.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'xiamen',
          locationName: '厦门',
          introduction: '坚忍刻苦',
          personalWebsite: 'https://github.com/yangtianxia',
          phone: '131****0612',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '13100000612',
          certification: 1,
          role
        })
      }
      return failResponseWrap(null, '未登录', 401)
    })
  }
})
