import qs from 'qs'
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type RequestContentType, type InternalAxiosRequestConfig } from 'axios'
import { notification } from 'ant-design-vue'
import { toArray, shallowMerge } from '@txjs/shared'
import { isPlainObject, isUndefined, isNil, notNil, isFunction } from '@txjs/bool'

import { useRedirect } from '@/hooks/redirect'
import { isLogin, getToken } from '@/shared/auth'
import { REQUEST_TOKEN_KEY, ERROR_CODE_DEFAULT, REQUEST_ERROR } from '@/constant/http'

enum RequestContentTypeEnum {
  JSON = 'application/json',
  FORM_DATA = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data',
  OCTET_STREAM = 'application/octet-stream',
}

const normalizeParams = (data?: any) => {
  if (isPlainObject(data)) {
    for (const key in data) {
      const value = data[key]
      if (isPlainObject(value)) {
        data[key] = normalizeParams(value)
      } else if (isUndefined(value)) {
        data[key] = ''
      }
    }
  }
  return data
}

export const msgWrap = (error: any) => {
  return error.msg || error.message || error.errMsg
}

export const isUnauthorized = (code?: number) => {
  return code === 401
}

const notifyHandler = (message?: string) => {
  notification.error({
    message: message || REQUEST_ERROR['default']
  })
}

const failWrap = (msg?: string) => {
  const data = {
    code: ERROR_CODE_DEFAULT,
    data: null,
    success: false,
    msg
  }
  const update = (partial: Partial<typeof data>) => {
    shallowMerge(data, partial)
  }
  const setCode = (code: number = ERROR_CODE_DEFAULT) => {
    update({ code })
  }
  const setMessage = (msg: string) => {
    update({ msg })
  }
  return { data, update, setCode, setMessage }
}

const requestContentType = (type?: RequestContentType) => {
  return RequestContentTypeEnum[type || 'JSON']
}

const errorHandler = (error: AxiosError<any>): Promise<any> => {
  const fail = failWrap()
  const message = error.message
  let status = error.response?.status

  // 网络异常
  if (message.startsWith('Network Error')) {
    status = 1000
  }
  // 请求超时
  else if (message.startsWith('timeout')) {
    status = 408
  }
  // 服务器异常
  else if (message.endsWith('500')) {
    status = 500
  }
  // 请求地址不存在
  else if (message.endsWith('404')) {
    status = 404
  }

  if (notNil(status)) {
    if (status in REQUEST_ERROR) {
      fail.setMessage(REQUEST_ERROR[status as keyof typeof REQUEST_ERROR])
    }
    fail.setCode(status)
  }

  if (!fail.data.msg) {
    fail.setMessage(msgWrap(error))
  }

  if (isUnauthorized(status)) {
    useRedirect().goto()
  } else if (error.config?.errorNotify !== false) {
    notifyHandler(fail.data.msg)
  }
  return Promise.reject(fail.data)
}

const requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  if (isLogin()) {
    config.headers.set(REQUEST_TOKEN_KEY, getToken())
  }
  return config
}

const responseHandler = (response: AxiosResponse) => {
  const { data, config } = response

  // 二进制数据
  const responseType = response.request?.responseType
  if (responseType === 'blob' || responseType === 'arrayBuffer') {
    return data
  }

  // 请求成功
  if (data.code >= 200 && data.code < 300) {
    return Promise.resolve(data.data)
  }

  // 登录过期
  if (isUnauthorized(data.code)) {
    useRedirect().goto()
  }
  // 响应错误
  else if (config?.errorNotify !== false) {
    notifyHandler(msgWrap(data))
  }
  return Promise.reject(data)
}

class CreateHttp {
  #instance = axios.create({
    baseURL: import.meta.env.API,
    timeout: 1000 * 20
  })

  constructor () {
    this.#requestInterceptor()
    this.#responseInterceptor()
  }

  static CancelToken = axios.CancelToken // eslint-disable-line import/no-named-as-default-member

  #requestInterceptor() {
    this.#instance.interceptors.request.use(requestHandler, errorHandler)
  }

  #responseInterceptor() {
    this.#instance.interceptors.response.use(responseHandler, errorHandler)
  }

  #setConfig(config: AxiosRequestConfig) {
    config.type ??= 'JSON'
    config.headers ??= {}
  }

  #setHeaders(config: AxiosRequestConfig) {
    if (!config.headers!['Content-Type']) {
      config.headers!['Content-Type'] = requestContentType(config.type)
    }
  }

  #getWrap(method: 'get' | 'delete') {
    return <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
      this.#setConfig(config)
      this.#setHeaders(config)
      if (isNil(config.paramsSerializer) || isFunction(config.paramsSerializer)) {
        const paramsSerializer = config.paramsSerializer
        config.paramsSerializer = (params) => {
          params = normalizeParams(params)
          if (notNil(paramsSerializer)) {
            params = paramsSerializer?.bind(null, params)
          }
          return qs.stringify(params)
        }
      }
      config.params ??= data
      return this.#instance[method]<T>(url, config)
    }
  }

  #postWrap(method: 'post' | 'put' | 'patch') {
    return <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
      this.#setConfig(config)
      this.#setHeaders(config)
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeParams)
        .concat((data: any) => config.type === 'JSON'
          ? JSON.stringify(data)
          : qs.stringify(data)
        )
      return this.#instance[method]<T>(url, data, config)
    }
  }

  #formWrap(method: 'postForm' | 'putForm' | 'patchForm') {
    return <T = any>(url: string, data: any = {}, config: Omit<AxiosRequestConfig, 'type'> = {}) => {
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeParams)
      return this.#instance[method]<T>(url, data, {
        ...config,
        type: 'FORM_DATA'
      })
    }
  }

  head<T = any>(url: string, config: AxiosRequestConfig = {}) {
    return this.#instance.head<T>(url, config)
  }

  options<T = any>(url: string, config: AxiosRequestConfig = {}) {
    return this.#instance.options<T>(url, config)
  }

  get = this.#getWrap('get')
  delete = this.#getWrap('delete')

  post = this.#postWrap('post')
  put = this.#postWrap('put')
  patch = this.#postWrap('patch')

  postForm = this.#formWrap('postForm')
  putForm = this.#formWrap('putForm')
  patchForm = this.#formWrap('patchForm')
}

export { CreateHttp }

export default new CreateHttp()
