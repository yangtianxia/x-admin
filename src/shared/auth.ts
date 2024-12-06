import { TOKEN } from './constant'

export const isLogin = () => {
  return !!localStorage.getItem(TOKEN)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN)
}

export const setToken = (token: string) => {
  return localStorage.setItem(TOKEN, token)
}

export const clearToken = () => {
  return localStorage.removeItem(TOKEN)
}
