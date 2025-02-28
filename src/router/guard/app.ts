import type { Router, RouteLocationNormalizedGeneric } from 'vue-router'
import NProgress from 'nprogress'
import { isNonEmptyString } from '@txjs/bool'
import { camelToKebab } from '@txjs/shared'
import { rootElement } from '@/shared/element'

const setTitle = (...args: (string | undefined)[]) => {
  document.title = [...args, import.meta.env.VITE_TITLE]
    .filter(isNonEmptyString)
    .join(' - ')
}

const setRouteTitle = (to: RouteLocationNormalizedGeneric) => {
  const matchs = to.matched.map((el) => el.meta?.title).reverse()
  setTitle(...matchs)
}

export default function setupAppGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start()

    const toClass = camelToKebab(to.name as string)
    const fromClass = camelToKebab(from.name as string)
    const redirectedFromClass = camelToKebab(to?.redirectedFrom?.name as string)

    if (toClass) {
      rootElement.classList.add(toClass)
    }

    if (fromClass && fromClass !== toClass) {
      rootElement.classList.remove(fromClass)
    }

    if (redirectedFromClass) {
      rootElement.classList.remove(redirectedFromClass)
    }

    setRouteTitle(to)
    next()
  })
}
