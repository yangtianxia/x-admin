import type { Router } from 'vue-router'
import { isValidString } from '@txjs/bool'
import { camelToKebab } from '@/shared/utils'

const bodyElement = document.body ?? document.getElementsByName('body')[0]

const setTitle = (...args: string[]) => {
  document.title = [...args, $t('common.title')].filter(isValidString).join(' - ')
}

export default function setupWebSiteGuard(router: Router) {
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
      .filter(isValidString)
      .map($t)
      .reverse()
    setTitle(...titleList)
    next()
  })
}
