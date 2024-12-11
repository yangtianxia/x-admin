const createKey = <T extends string>(key: T) => `x_admin_${key}` as const

/** 认证方式 */
export const REQUEST_TOKEN_KEY = 'Authorization'

/** 登录凭证 */
export const TOKEN = createKey('token')

/** 登录凭证前缀 */
export const TOKEN_HEAD = 'Bearer '

/** 网站语言 */
export const LOCALE = createKey('locale')

/** 网站主题 */
export const THEME = createKey('theme')

/** 重定向URL */
export const REDIRECT_URI = createKey('redirect_uri')

/** 重定向PARAMS */
export const REDIRECT_PARAMS = createKey('redirect_params')
