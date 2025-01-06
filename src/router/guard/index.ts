import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/shared/route-listener'

import setupLoginAuthorizeGuard from './loginAuthorize'
import setupPermissionGuard from './permission'
import setupPageGuard from './page'

function setupEmitterGuard(router: Router) {
  router.beforeEach(async (to) => {
    setRouteEmitter(to)
  })
}

export default function createRouteGuard(router: Router) {
  setupEmitterGuard(router)
  setupLoginAuthorizeGuard(router)
  setupPermissionGuard(router)
  setupPageGuard(router)
}
