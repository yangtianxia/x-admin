import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useRouteStore from './modules/route'
import useUserStore from './modules/user'

const pinia = createPinia()

export { useAppStore, useRouteStore, useUserStore }
export default pinia
