import { appRoutes, appExternalRoutes } from '../routes'

const mixinRoutes = [...appRoutes, ...appExternalRoutes]

const appClientMenus = mixinRoutes.map((route) => {
  const { name, path, meta, redirect, children } = route
  return {
    name,
    path,
    meta,
    redirect,
    children
  }
})

export default appClientMenus
