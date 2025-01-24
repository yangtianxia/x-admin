import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { successResponseWrap } from '../setup'

const getDefaultMenu = () => ({
  id: 0,
  parentId: 0,
  type: 1,
  sort: 0,
  title: '',
  path: '',
  name: '',
  component: '',
  redirect: undefined,
  icon: undefined,
  isExternal: false,
  isCache: false,
  isHidden: false,
  isHiddenChildren: false
})

const data = [
  {
    id: 2000,
    parentId: 0,
    title: '示例管理',
    type: 1,
    path: '/example',
    name: 'Example',
    component: 'Layout',
    redirect: '/example/quill',
    icon: 'Components',
    sort: 1,
    children: [
      {
        id: 2010,
        parentId: 2000,
        title: 'Quill编辑器',
        type: 2,
        path: '/example/quill',
        name: 'ExampleQuill',
        component: 'example/quill/index',
        sort: 1
      },
      {
        id: 2020,
        parentId: 2000,
        title: 'Upload上传',
        type: 2,
        path: '/example/upload',
        name: 'ExampleUpload',
        component: 'example/upload/index',
        sort: 2
      }
    ]
  },
  {
    id: 1000,
    parentId: 0,
    title: '系统管理',
    type: 1,
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: '/system/menu',
    icon: 'Setting',
    sort: 1,
    children: [
      {
        id: 1010,
        parentId: 1000,
        title: '菜单管理',
        type: 2,
        path: '/system/menu',
        name: 'SystemMenu',
        component: 'system/menu/index',
        sort: 1
      },
      {
        id: 1020,
        parentId: 1000,
        title: '角色管理',
        type: 2,
        path: '/system/role',
        name: 'SystemRole',
        component: 'system/role/index',
        sort: 2
      },
      {
        id: 1030,
        parentId: 1000,
        title: '用户管理',
        type: 2,
        path: '/system/user',
        name: 'SystemUser',
        component: 'system/user/index',
        sort: 3
      }
    ]
  }
]

const generateMenu = (options: any) => {
  if (options?.children?.length) {
    options.children = options.children.map(generateMenu)
  }
  return { ...getDefaultMenu(), ...options }
}

export default defineFakeRoute([
  {
    url: '/menu/list',
    method: 'get',
    response: () => {
      const menuList = data.map(generateMenu)
      return successResponseWrap(menuList)
    }
  }
])
