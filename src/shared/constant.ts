const createKey = <T extends string>(key: T) => `x_admin_${key}` as const

/** 认证方式 */
export const REQUEST_TOKEN_KEY = 'Authorization'

/** 登录凭证 */
export const TOKEN_KEY = createKey('token')

/** 登录凭证前缀 */
export const TOKEN_HEAD_KEY = 'Bearer '

/** 网站语言 */
export const LOCALE_KEY = createKey('locale')

/** 网站主题 */
export const THEME_KEY = createKey('theme')

/** 明亮模式 */
export const THEME_LIGHT_KEY = 'light'

/** 暗黑模式 */
export const THEME_DARK_KEY = 'dark'

/** 跟随系统模式 */
export const THEME_SYSTEM_KEY = 'system'

/** 重定向URL */
export const REDIRECT_URI = createKey('redirect_uri')

/** 重定向PARAMS */
export const REDIRECT_PARAMS = createKey('redirect_params')
