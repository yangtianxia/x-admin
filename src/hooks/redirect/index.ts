import { reactive, computed } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import { isValidString } from '@txjs/bool'
import router, { goBack } from '@/router'
import { LOGIN_ROUTE_NAME } from '@/router/constant'
import { REDIRECT_URI, REDIRECT_PARAMS } from '@/shared/constant'

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

  const goto = (options: {
    name?: string
    replace?: boolean
  } = {
    name: LOGIN_ROUTE_NAME,
    replace: true
  }) => {
    const query = {} as LocationQueryRaw
    if (options.replace) {
      query[REDIRECT_URI] = ignore ? redirect_uri : fullPath
    }
    router[options.replace ? 'replace' : 'push']({
      query,
      name: options.name
    })
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
