import { reactive, computed } from 'vue'
import type { LocationQueryRaw, RouteLocationNormalizedLoaded } from 'vue-router'
import { isValidString } from '@txjs/bool'
import router, { goBack } from '@/router'
import { LOGIN_ROUTE_NAME } from '@/router/constant'
import { REDIRECT_URI, REDIRECT_PARAMS } from '@/shared/constant'

interface GoToOption {
  name?: string
  replace?: boolean
}

const whiteList: string[] = [LOGIN_ROUTE_NAME]

const getRedirectUri = (route: RouteLocationNormalizedLoaded) => {
  const { query } = route
  const redirect_uri = query[REDIRECT_URI] as string
  if (isValidString(redirect_uri)) {
    return decodeURIComponent(redirect_uri)
  }
}

export const useRedirectUri = (route: RouteLocationNormalizedLoaded) => {
  if (route.meta.authNoAccessAfter) {
    return getRedirectUri(route)
  }
}

export const useRedirect = () => {
  const { name, query, fullPath } = router.currentRoute.value
  const redirectUri = getRedirectUri(router.currentRoute.value)
  const ignore = whiteList.includes(name as string)

  const state = reactive({
    [REDIRECT_PARAMS]: redirectUri
  })

  const currentRedirectUri = computed(() => state[REDIRECT_PARAMS])

  const goto = (options?: GoToOption) => {
    const { name = LOGIN_ROUTE_NAME, replace = true } = options || {}
    const query = {} as LocationQueryRaw
    if (replace) {
      query[REDIRECT_URI] = ignore ? redirectUri : fullPath
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
