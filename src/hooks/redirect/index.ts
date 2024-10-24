import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidString } from '@txjs/bool'
import { REDIRECT_URI, REDIRECT_PARAMS } from '@/shared/constant'

export const useRedirect = () => {
  const { params } = useRoute()
  const router = useRouter()

  let redirect_uri = params[REDIRECT_URI] as string

  if (isValidString(redirect_uri)) {
    redirect_uri = decodeURIComponent(redirect_uri)
  }

  const from = reactive({
    [REDIRECT_PARAMS]: redirect_uri
  })

  const redirectTo = (callback?: UnknownCallback) => {
    const redirectURL = from[REDIRECT_PARAMS]

    if (redirectURL) {
      callback?.(redirectURL) ?? router.replace(redirectURL)
    } else {
      router.back()
    }
  }

  return { from, params, redirectTo }
}
