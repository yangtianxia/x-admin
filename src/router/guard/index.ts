import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/shared/route-listener'

import setupUserLoginInfoGuard from './userLoginInfo'
import setupPermissionGuard from './permission'
import setupPageGuard from './page'

function setupEmitterGuard(router: Router) {
  router.beforeEach(async (to) => {
    setRouteEmitter(to)
  })
}

export default function createRouteGuard(router: Router) {
  setupEmitterGuard(router)
  setupUserLoginInfoGuard(router)
  setupPermissionGuard(router)
  setupPageGuard(router)
}
