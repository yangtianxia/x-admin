import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/shared/route-listener'

import setupAppGuard from './app'
import setupPermissionGuard from './permission'

function setupEmitterGuard(router: Router) {
  router.beforeEach(async (to) => {
    setRouteEmitter(to)
  })
}

export default function createRouteGuard(router: Router) {
  setupEmitterGuard(router)
  setupAppGuard(router)
  setupPermissionGuard(router)
}
