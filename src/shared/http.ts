import qs from 'qs'
import axios, {
  type CancelTokenSource,
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type RequestContentType,
  type InternalAxiosRequestConfig
} from 'axios'

import { notification } from 'ant-design-vue'
import { toArray, shallowMerge } from '@txjs/shared'
import {
  isPlainObject,
  isUndefined,
  isNil,
  notNil,
  isFunction
} from '@txjs/bool'

import { useRedirect } from '@/hooks/redirect'
import { isLogin, getToken } from '@/shared/auth'
import { currentAPI } from '@/shared/utils'
import { REQUEST_TOKEN_KEY } from '@/shared/constant'

enum RequestContentTypeEnum {
  JSON = 'application/json',
  FORM_DATA = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data',
  OCTET_STREAM = 'application/octet-stream',
}

const normalizeUndefined = (data?: any) => {
  if (isPlainObject(data)) {
    for (const key in data) {
      const value = data[key]
      if (isPlainObject(value)) {
        data[key] = normalizeUndefined(value)
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

const notifyHandler = (message?: string) => {
  notification.error({
    message: message || $t('request.default')
  })
}

const failWrap = (msg?: string) => {
  const CODE = 500
  // TODO 根据业务，自行修改字段
  const data = {
    code: CODE,
    data: null,
    success: false,
    msg
  }
  const update = (partial: Partial<typeof data>) => {
    shallowMerge(data, partial)
  }
  const code = (code: number = CODE) => {
    update({ code })
  }
  const message = (msg: string) => {
    update({ msg })
  }
  return { data, code, message }
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

  switch (status) {
    case 400:
      fail.message($t('request.400'))
      break
    case 403:
      fail.message($t('request.403'))
      break
    case 404:
      fail.message($t('request.404'))
      break
    case 405:
      fail.message($t('request.405'))
      break
    case 408:
      fail.message($t('request.408'))
      break
    case 500:
      fail.message($t('request.500'))
      break
    case 501:
      fail.message($t('request.501'))
      break
    case 502:
      fail.message($t('request.502'))
      break
    case 503:
      fail.message($t('request.503'))
      break
    case 504:
      fail.message($t('request.504'))
      break
    case 505:
      fail.message($t('request.505'))
      break
    case 1000:
      fail.message($t('request.1000'))
      break
  }

  fail.code(status)

  if (!fail.data.msg) {
    fail.message(msgWrap(error))
  }

  if (status === 401) {
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

  // Token过期
  if (data.code === 401) {
    useRedirect().goto()
  } else if (config?.errorNotify !== false) {
    notifyHandler(msgWrap(data))
  }
  return Promise.reject(data)
}

class CreateHttp {
  // 储存终止令牌
  #abortTokens: Map<string, CancelTokenSource> = new Map()

  #instance = axios.create({
    baseURL: currentAPI(),
    timeout: 1000 * 20
  })

  constructor () {
    this.#requestInterceptor()
    this.#responseInterceptor()
  }

  static CancelToken = axios.CancelToken // eslint-disable-line import/no-named-as-default-member

  #abortTokenProvide(method: string, url: string, params: any, config: any) {
    const serializedParams = qs.stringify(params, {
      arrayFormat: 'brackets'
    })
    const token = [method, url, serializedParams].filter(Boolean).join(':')
    // 取消相同请求
    this.abort(token)
    // 创建新的取消令牌
    const source = axios.CancelToken.source() // eslint-disable-line import/no-named-as-default-member
    this.#abortTokens.set(token, source)
    // 绑定取消令牌
    config.abortToken = token
    config.cancelToken = source.token
  }

  #deleteAbortToken(token?: string) {
    if (token) {
      this.#abortTokens.delete(token)
    }
  }

  #requestInterceptor() {
    this.#instance.interceptors.request.use(requestHandler, errorHandler)
  }

  #responseInterceptor() {
    this.#instance.interceptors.response.use(
      (response) => {
        this.#deleteAbortToken(response.config.abortToken)
        return response
      },
      (error) => {
        this.#deleteAbortToken(error.config.abortToken)
        return Promise.reject(error)
      }
    )
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
      if (!config.cancelToken) {
        this.#abortTokenProvide(method, url, data, config)
      }
      if (isNil(config.paramsSerializer) || isFunction(config.paramsSerializer)) {
        const paramsSerializer = config.paramsSerializer
        config.paramsSerializer = (params) => {
          params = normalizeUndefined(params)
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
      if (!config.cancelToken) {
        this.#abortTokenProvide(method, url, data, config)
      }
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeUndefined)
        .concat((data: any) => config.type === 'JSON'
          ? JSON.stringify(data)
          : qs.stringify(data)
        )
      return this.#instance[method]<T>(url, data, config)
    }
  }

  #formWrap(method: 'postForm' | 'putForm' | 'patchForm') {
    return <T = any>(url: string, data: any = {}, config: Omit<AxiosRequestConfig, 'type'> = {}) => {
      if (!config.cancelToken) {
        this.#abortTokenProvide(method, url, data, config)
      }
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeUndefined)
      return this.#instance[method]<T>(url, data, {
        ...config,
        type: 'FORM_DATA'
      })
    }
  }

  abort(token: string) {
    const source = this.#abortTokens.get(token)
    if (source) {
      source.cancel(`Abort ${token} request.`)
      this.#abortTokens.delete(token)
    }
  }

  abortAll() {
    this.#abortTokens.forEach((source, token) => {
      source.cancel(`Abort ${token} request.`)
    })
    this.#abortTokens.clear()
  }

  get = this.#getWrap('get')
  delete = this.#getWrap('delete')

  post = this.#postWrap('post')
  put = this.#postWrap('put')
  patch = this.#postWrap('patch')

  postForm = this.#formWrap('postForm')
  putForm = this.#formWrap('putForm')
  patchForm = this.#formWrap('patchForm')

  head<T = any>(url: string, config: AxiosRequestConfig = {}) {
    if (!config.cancelToken) {
      this.#abortTokenProvide('head', url, {}, config)
    }
    return this.#instance.head<T>(url, config)
  }

  options<T = any>(url: string, config: AxiosRequestConfig = {}) {
    if (!config.cancelToken) {
      this.#abortTokenProvide('options', url, {}, config)
    }
    return this.#instance.options<T>(url, config)
  }
}

export { CreateHttp }

export default new CreateHttp()
