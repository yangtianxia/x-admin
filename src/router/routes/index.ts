import type { RouteRecordNormalized } from 'vue-router'
import { isNil, isArray } from '@txjs/bool'

const modules = import.meta.glob('./modules/*.ts', {
  eager: true
})
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: true
})

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object
    .keys(_modules)
    .forEach((key) => {
      const defaultModule = _modules[key].default
      if (isNil(defaultModule)) return

      const moduleList = isArray(defaultModule)
        ? [...defaultModule]
        : [defaultModule]
      result.push(...moduleList)
    })
  return result.sort((a, b) => (b?.meta.order ?? 0) - (a?.meta.order ?? 0))
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, [])

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(externalModules, [])
