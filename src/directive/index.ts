import { type App } from 'vue'
import hasPerm from './permission/hasPerm'
import hasRole from './permission/hasRole'

export default {
  install(app: App) {
    app.directive('hasPerm', hasPerm)
    app.directive('hasRole', hasRole)
  },
}
