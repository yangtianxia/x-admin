export const DEFAULT_ROUTE_NAME = 'Workplace'

export const REDIRECT_ROUTE_NAME = 'Redirect'

export const NOT_FOUND_ROUTE_NAME = 'NotFound'

export const LOGIN_ROUTE_NAME = 'Login'

export const LOGIN_ROUTE_PATH = '/login'

export const WHITE_LIST = [
  { name: NOT_FOUND_ROUTE_NAME, children: [] },
  { name: LOGIN_ROUTE_NAME, children: [] }
]

export const NOT_FOUND_ROUTE = {
  name: NOT_FOUND_ROUTE_NAME
}

export const DEFAULT_ROUTE = {
  name: DEFAULT_ROUTE_NAME
}
