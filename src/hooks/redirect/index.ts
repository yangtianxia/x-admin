import { reactive, computed } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import { isValidString } from '@txjs/bool'
import router, { goBack } from '@/router'
import { LOGIN_ROUTE_NAME } from '@/router/constant'
import { REDIRECT_URI, REDIRECT_PARAMS } from '@/shared/constant'

interface GoToOption {
  name?: string
  replace?: boolean
}

const whiteList: string[] = [LOGIN_ROUTE_NAME]

export const useRedirect = () => {
  const { name, query, fullPath } = router.currentRoute.value
  const ignore = whiteList.includes(name as string)

  let redirect_uri = query[REDIRECT_URI] as string
  if (isValidString(redirect_uri)) {
    redirect_uri = decodeURIComponent(redirect_uri)
  }

  const state = reactive({
    [REDIRECT_PARAMS]: redirect_uri
  })

  const currentRedirectUri = computed(() => state[REDIRECT_PARAMS])

  const goto = (options?: GoToOption) => {
    const { name = LOGIN_ROUTE_NAME, replace = true } = options || {}
    const query = {} as LocationQueryRaw
    if (replace) {
      query[REDIRECT_URI] = ignore ? redirect_uri : fullPath
    }
    router[replace ? 'replace' : 'push']({ name, query })
  }

  const back = (callback?: UnknownCallback) => {
    const redirectURL = state[REDIRECT_PARAMS]
    if (callback) {
      callback(redirectURL)
    } else if (redirectURL) {
      router.replace(redirectURL)
    } else {
      goBack()
    }
  }

  return { currentRedirectUri, goto, back }
}
