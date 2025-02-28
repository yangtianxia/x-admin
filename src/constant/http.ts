/** 认证方式 */
export const REQUEST_TOKEN_KEY = 'Authorization'

/** 凭证前缀 */
export const TOKEN_HEAD_KEY = 'Bearer '

/** 错误代码 - 默认 */
export const ERROR_CODE_DEFAULT = 500

/** 请求错误 */
export const REQUEST_ERROR = {
  default: '响应失败',
  400: '请求错误',
  403: '拒绝访问',
  404: '请求地址错误',
  405: '请求方法不可用',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP 版本不受支持',
  1000: '网络错误',
}
