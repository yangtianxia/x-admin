import type { UserState } from '@/store/modules/user/types'

export function getUserInfo() {
  return Promise.resolve<UserState>({
    id: 1,
    name: 'John Doe',
    job: '前端开发',
    avatar: 'https://example.com/avatar.jpg',
    nickName: 'JD',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    introduction: '我是一名前端开发工程师。',
    location: '城市名称',
    jobName: '职位名称',
    certification: 12345,
    role: 'user'
  })
}
