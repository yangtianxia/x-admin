import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { isPhone } from '@txjs/bool'
import { toArray } from '@txjs/shared'
import { successResponseWrap, failResponseWrap } from '../setup'

export default defineFakeRoute([
  // 密码登录
  {
    url: '/login/pwd',
    method: 'post',
    response: (params) => {
      const { username, password } = params.body
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 400)
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 400)
      }
      if (username === 'admin' && password === 'admin') {
        return successResponseWrap({
          token: '12345'
        })
      }
      if (username === 'user' && password === 'user') {
        return successResponseWrap({
          token: '54321'
        })
      }
      return failResponseWrap(null, '账号或者密码错误', 400)
    }
  },
  // 验证码登录
  {
    url: '/login/sms',
    method: 'post',
    response: (params) => {
      const { telephone, code } = params.body
      if (!telephone) {
        return failResponseWrap(null, '手机号不能为空', 400)
      }
      if (!code) {
        return failResponseWrap(null, '验证码不能为空', 400)
      }
      if (!isPhone(telephone)) {
        return failResponseWrap(null, '手机号格式错误', 400)
      }
      if (telephone === '13166668888' && code === '123456') {
        return successResponseWrap({
          token: '12345'
        })
      }
      if (telephone === '13677779999' && code === '123456') {
        return successResponseWrap({
          token: '54321'
        })
      }
      return failResponseWrap(null, '手机号或验证码错误', 400)
    }
  },
  // 发送登录验证码
  {
    url: '/login/sms',
    method: 'post',
    response: (params) => {
      const { telephone } = params.body
      if (!telephone) {
        return failResponseWrap(null, '手机号不能为空', 400)
      }
      if (!isPhone(telephone)) {
        return failResponseWrap(null, '手机号格式错误', 400)
      }
      return successResponseWrap(null)
    }
  },
  // 登出
  {
    url: '/logout',
    method: 'post',
    response: () => {
      return successResponseWrap(null)
    }
  },
  // 用户信息
  {
    url: '/user/info',
    method: 'get',
    response: (params) => {
      const authorization = params.headers['authorization']
      if (authorization?.startsWith('Bearer')) {
        const roles = authorization.endsWith('12345') ? 'admin' : 'user'
        return successResponseWrap({
          id: 1,
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
          roles: toArray(roles),
          perms: []
        })
      }
      return failResponseWrap(null, '未登录', 401)
    }
  }
])
