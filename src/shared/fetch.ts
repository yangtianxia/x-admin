import qs from 'qs'
import axios, {
  type CancelTokenSource,
  type AxiosError,
  type AxiosRequestConfig,
  type RequestContentType,
  type InternalAxiosRequestConfig
} from 'axios'

import { notification } from 'ant-design-vue'
import { toArray } from '@txjs/shared'
import {
  isPlainObject,
  isUndefined,
  isNil,
  isFunction
} from '@txjs/bool'

import { useRedirect } from '@/hooks/redirect'
import { isLogin, getToken } from '@/shared/auth'
import { currentAPI } from '@/shared/utils'

type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

enum RequestContentTypeEnum {
  JSON = 'application/json',
  FORM_DATA = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data',
  XML = 'application/xml',
  OCTET_STREAM = 'application/octet-stream',
}

const REQUEST_TOKEN_KEY = 'Authorization'

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

const failWrap = (errorText: string = 'An error occurred') => ({
  code: 400,
  data: null,
  success: false,
  msg: errorText,
})

const requestContentType = (type?: RequestContentType) => {
  return RequestContentTypeEnum[type || 'JSON']
}

const errorHandler = (error: RequestError): Promise<any> => {
  return Promise.reject(error)
}

const requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  const contentType = requestContentType(config.type)
  config.headers.set('Content-Type', contentType)
  if (isLogin()) {
    config.headers.set(REQUEST_TOKEN_KEY, getToken())
  }
  return config
}

const responseHandler = (response: { data: any }) => {
  const { data } = response
  if (data.code >= 200 && data.code < 300) {
    return Promise.resolve(data.data)
  }
  if (data.code === 401) {
    useRedirect().goto()
  } else {
    notification.error({
      message: data.msg || 'Response failed'
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

  #configurationAbortToken(method: string, url: string, params: any) {
    const serializedParams = qs.stringify(params, {
      arrayFormat: 'brackets'
    })
    const token = `${method}:${url}:${serializedParams}`
    // 取消相同请求
    this.abort(token)
    // 创建新的取消令牌
    const source = axios.CancelToken.source()
    this.#abortTokens.set(token, source)
    return { source, token }
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
      // 绑定取消Token
      if (!config.cancelToken) {
        const { source, token } = this.#configurationAbortToken(method, url, data)
        config.abortToken = token
        config.cancelToken = source.token
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
      // 绑定取消Token
      if (!config.cancelToken) {
        const { source, token } = this.#configurationAbortToken(method, url, data)
        config.abortToken = token
        config.cancelToken = source.token
      }
      return this.#fetch[method]<T>(url, data, config)
    }
  }

  #formWrap(method: 'postForm' | 'putForm' | 'patchForm') {
    return <T = any>(url: string, data: any = {}, config: Omit<AxiosRequestConfig, 'type'> = {}) => {
      config.transformRequest = toArray(config.transformRequest ?? [])
        .concat(normalizeUndefined)
      // 绑定取消Token
      if (!config.cancelToken) {
        const { source, token } = this.#configurationAbortToken(method, url, data)
        config.abortToken = token
        config.cancelToken = source.token
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
    // 绑定取消Token
    if (!config.cancelToken) {
      const { source, token } = this.#configurationAbortToken('head', url, {})
      config.abortToken = token
      config.cancelToken = source.token
    }
    return this.#fetch.head<T>(url, config)
  }

  options<T = any>(url: string, config: AxiosRequestConfig = {}) {
    // 绑定取消Token
    if (!config.cancelToken) {
      const { source, token } = this.#configurationAbortToken('options', url, {})
      config.abortToken = token
      config.cancelToken = source.token
    }
    return this.#fetch.options<T>(url, config)
  }
}

export { Fetch }

export default new Fetch()
