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
  XML = 'application/xml',
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
  const status = error.response?.status
  switch (status) {
    case 400:
      fail.message($t('fetch.400'))
      break
    case 403:
      fail.message($t('fetch.403'))
      break
    case 404:
      fail.message($t('fetch.404'))
      break
    case 405:
      fail.message($t('fetch.405'))
      break
    case 408:
      fail.message($t('fetch.408'))
      break
    case 500:
      fail.message($t('fetch.500'))
      break
    case 501:
      fail.message($t('fetch.501'))
      break
    case 502:
      fail.message($t('fetch.502'))
      break
    case 503:
      fail.message($t('fetch.503'))
      break
    case 504:
      fail.message($t('fetch.504'))
      break
    case 505:
      fail.message($t('fetch.505'))
      break
  }

  fail.code(status)

  if (!fail.data.msg) {
    fail.message(msgWrap(error))
  }

  if (status === 401) {
    useRedirect().goto()
  } else {
    notification.error({
      message: fail.data.msg || 'Response failed'
    })
  }
  return Promise.reject(fail.data)
}

const requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  const contentType = requestContentType(config.type)
  config.headers.set('Content-Type', contentType)
  if (isLogin()) {
    config.headers.set(REQUEST_TOKEN_KEY, getToken())
  }
  return config
}

const responseHandler = (response: AxiosResponse) => {
  const { data } = response

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
  } else {
    notification.error({
      message: msgWrap(data) || 'Response failed'
    })
  }
  return Promise.reject(data)
}

class Fetch {
  // 储存终止令牌
  #abortTokens: Map<string, CancelTokenSource> = new Map()

  #fetch = axios.create({
    baseURL: currentAPI(),
    timeout: 1000 * 20
  })

  constructor () {
    this.#requestInterceptor()
    this.#responseInterceptor()
  }

  #configurationAbortToken(method: string, url: string, params: any, config: any) {
    const serializedParams = qs.stringify(params, {
      arrayFormat: 'brackets'
    })
    const token = [method, url, serializedParams].filter(Boolean).join(':')
    // 取消相同请求
    this.abort(token)
    // 创建新的取消令牌
    const source = axios.CancelToken.source()
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
    this.#fetch.interceptors.request.use(requestHandler, errorHandler)
  }

  #responseInterceptor() {
    this.#fetch.interceptors.response.use(
      (response) => {
        this.#deleteAbortToken(response.config.abortToken)
        return response
      },
      (error) => {
        this.#deleteAbortToken(error.config.abortToken)
        return Promise.reject(error)
      }
    )
    this.#fetch.interceptors.response.use(responseHandler, errorHandler)
  }

  #getWrap(method: 'get' | 'delete') {
    return <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
      const paramsSerializer = config.paramsSerializer
      config.params ??= data
      config.paramsSerializer = (params) => {
        params = normalizeUndefined(params)
        if (isFunction(paramsSerializer)) {
          params = paramsSerializer.bind(null, params)
        }
        return qs.stringify(params)
      }
      if (!config.cancelToken) {
        this.#configurationAbortToken(method, url, data, config)
      }
      return this.#fetch[method]<T>(url, config)
    }
  }

  #postWrap(method: 'post' | 'put' | 'patch') {
    return <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
      const isJSON = isNil(config.type) || config.type == 'JSON'
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeUndefined)
        .concat((data: any) => isJSON ? JSON.stringify(data) : qs.stringify(data))
      if (!config.cancelToken) {
        this.#configurationAbortToken(method, url, data, config)
      }
      return this.#fetch[method]<T>(url, data, config)
    }
  }

  #formWrap(method: 'postForm' | 'putForm' | 'patchForm') {
    return <T = any>(url: string, data: any = {}, config: Omit<AxiosRequestConfig, 'type'> = {}) => {
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeUndefined)
      if (!config.cancelToken) {
        this.#configurationAbortToken(method, url, data, config)
      }
      return this.#fetch[method]<T>(url, data, {
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
      this.#configurationAbortToken('head', url, {}, config)
    }
    return this.#fetch.head<T>(url, config)
  }

  options<T = any>(url: string, config: AxiosRequestConfig = {}) {
    if (!config.cancelToken) {
      this.#configurationAbortToken('options', url, {}, config)
    }
    return this.#fetch.options<T>(url, config)
  }
}

export { Fetch }

export default new Fetch()
