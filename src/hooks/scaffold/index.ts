import { reactive, onBeforeMount } from 'vue'
import { useChildren } from '@vant/use'
import { isPlainObject, isPromise } from '@txjs/bool'
import { createInjectionKey } from '@/components/_utils/basic'
import type { ResultOptions, ResultStatus } from '@/components/result'
import { hasStatusConfig } from '@/components/result/utils'

interface ScaffoldContextOption {
  /** 页面加载 */
  loading?: boolean
  /** 页面状态 */
  status?: ResultStatus
  /** 是否重试 */
  canRetry?: boolean
  /** 是否即刻执行 */
  immediate?: boolean
}

interface ScaffoldContextReadyCallback {
  (...args: any[]): Promise<void> | void
}

export interface ScaffoldContextProvide {
  state: {
    loading: boolean
    status?: ResultStatus
  }
}

export const SCAFFOLD_CONTEXT_KEY = createInjectionKey<ScaffoldContextProvide>('scaffold-context')

export const useScaffoldContext = (options?: ScaffoldContextOption) => {
  const { linkChildren } = useChildren(SCAFFOLD_CONTEXT_KEY)
  const {
    loading = true,
    canRetry = true,
    immediate = true,
    status
  } = options || {}

  const state = reactive({ loading, status })

  const hideLoading = () => {
    state.loading = false
  }

  const showLoading = () => {
    state.loading = true
  }

  const reset = () => {
    state.loading = loading
    state.status = status
  }

  const nothrow = (callback: ScaffoldContextReadyCallback) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const returnVal = callback()
        if (isPromise(returnVal)) {
          returnVal
            .then(resolve)
            .catch(reject)
        } else {
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  let retry: () => Promise<void>
  const ready = (callback: ScaffoldContextReadyCallback) => {
    if (!retry) {
      retry = async () => {
        try {
          await nothrow(callback)
        } catch (error: any) {
          if (error.code === 401) return

          const result = {} as ResultOptions
          if (error instanceof Error) {
            result.status = 'error'
            result.title = error.message
          } else if (isPlainObject(error)) {
            result.status = hasStatusConfig(error.code) ? error.code : 'error'
            const errMsg = error.msg || error.message || error.errMsg
            if (errMsg) {
              result.title = errMsg
            } else {
              result.desc = JSON.stringify(error)
            }
          } else {
            result.status = 'error'
            result.desc = error
          }
          if (canRetry) {
            result.refresh = () => {
              reset()
              retry()
            }
          }
          state.status = result
        } finally {
          hideLoading()
        }
      }
    }
    return retry
  }

  linkChildren({ state })

  if (immediate) {
    onBeforeMount(() => retry?.())
  }

  return {
    hideLoading,
    showLoading,
    reset,
    ready,
    set loading(value: boolean) {
      state.loading = value
    },
    get loading() {
      return state.loading
    },
    set status(value: ResultStatus | undefined) {
      state.status = value
    },
    get status() {
      return state.status
    }
  }
}
