const createKey = <T extends string>(key: T) => `${import.meta.env.VITE_PREFIX}_${key}` as const

/** 用户TOKEN */
export const TOKEN_KEY = createKey('token')

/** 本地存储LOCALE */
export const LOCALE_KEY = createKey('locale')

/** 重定向URL */
export const REDIRECT_URI = createKey('redirect_uri')

/** 重定向PARAMS */
export const REDIRECT_PARAMS = createKey('redirect_params')
