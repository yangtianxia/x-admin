import { reactive, computed } from 'vue'
import type { LocationQueryRaw, RouteLocationNormalizedLoaded } from 'vue-router'
import { isNonEmptyString } from '@txjs/bool'

import router, { goBack } from '@/router'
import { REDIRECT_URI, LOGIN_NAME } from '@/constant/route'

interface GoToOption {
  name?: string
  replace?: boolean
}

const whiteList: string[] = [LOGIN_NAME]

const getRedirectUri = (route: RouteLocationNormalizedLoaded) => {
  const { query } = route
  const redirect_uri = query[REDIRECT_URI] as string
  if (isNonEmptyString(redirect_uri)) {
    return decodeURIComponent(redirect_uri)
  }
}

export const useRedirectUri = (route: RouteLocationNormalizedLoaded) => {
  if (route.meta.authNoAccessAfter) {
    return getRedirectUri(route)
  }
}

export const useRedirect = () => {
  const { name, fullPath } = router.currentRoute.value
  const redirectUri = getRedirectUri(router.currentRoute.value)
  const ignore = whiteList.includes(name as string)

  const state = reactive({
    redirectUri: redirectUri
  })

  const currentRedirectUri = computed(() => state.redirectUri)

  const goto = (options?: GoToOption) => {
    const { name = LOGIN_NAME, replace = true } = options || {}
    const query = {} as LocationQueryRaw
    if (replace) {
      query[REDIRECT_URI] = ignore ? redirectUri : fullPath
    }

    router[replace ? 'replace' : 'push']({ name, query })
  }

  const back = (callback?: UnknownCallback) => {
    const redirectURL = currentRedirectUri.value
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
