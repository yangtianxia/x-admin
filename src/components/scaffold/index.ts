import type { App } from 'vue'
import { withInstall } from '../_utils/with-install'
import _Scaffold from './Scaffold'
import _ScaffoldBody from './Body'

import './index.less'

export const ScaffoldBody = withInstall(_ScaffoldBody)
export const Scaffold = withInstall(_Scaffold, { Body: ScaffoldBody })

const scaffoldInstall = Scaffold.install

Scaffold.install = (app: App) => {
  ScaffoldBody.install(app)
  scaffoldInstall(app)
}

export * from './context'
export default Scaffold
