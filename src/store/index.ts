import { createPinia } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'
import useAppStore, { runAppStore } from './modules/app'
import useRouteStore from './modules/route'
import useUserStore from './modules/user'

const pinia = createPinia()

pinia.use(persistedState)

export { useAppStore, runAppStore, useRouteStore, useUserStore }
export default pinia
