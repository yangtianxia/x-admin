import type { App as Vue } from 'vue'
import { withInstall } from '../_utils/with-install'
import _App from './App'
import _Body from './Body'

import './index.less'

export const Body = withInstall(_Body)
export const App = withInstall(_App, { Body })

const appInstall = App.install

App.install = (app: Vue) => {
  Body.install(app)
  appInstall(app)
}

export * from './AppContext'
export default App
