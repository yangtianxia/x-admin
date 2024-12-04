import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/shared/route-listener'

import setupUserLoginInfoGuard from './userLoginInfo'
import setupPermissionGuard from './permission'
import setupWebSiteGuard from './webSite'

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    setRouteEmitter(to)
  })
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router)
  setupUserLoginInfoGuard(router)
  setupPermissionGuard(router)
  setupWebSiteGuard(router)
}
