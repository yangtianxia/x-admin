import type { Router } from 'vue-router'
import { isNonEmptyString } from '@txjs/bool'
import { camelToKebab } from '@txjs/shared'

const bodyElement = document.body ?? document.getElementsByName('body')[0]

const setPageTitle = (...args: string[]) => {
  document.title = [...args, $t('global.title')].filter(isNonEmptyString).join(' - ')
}

export default function setupPageGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const tname = camelToKebab(to.name as string)
    const fname = camelToKebab(from.name as string)
    const rfname = camelToKebab(to?.redirectedFrom?.name as string)
    if (tname) {
      bodyElement.classList.add(tname)
    }
    if (fname && fname !== tname) {
      bodyElement.classList.remove(fname)
    }
    if (rfname) {
      bodyElement.classList.remove(rfname)
    }
    const titleList = to.matched
      .map((route) => route.meta.locale)
      .filter(isNonEmptyString)
      .map($t)
      .reverse()
    setPageTitle(...titleList)
    next()
  })
}
