interface LoginReturn {
  token: string
}

export interface LoginQuery {}

export function postLogin(data: LoginQuery) {
  return Promise.resolve<LoginReturn>({
    token: 'ddd'
  })
}
