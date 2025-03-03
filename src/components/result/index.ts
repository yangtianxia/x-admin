import { withInstall } from '../_utils/with-install'
import _Result from './Result'

import './index.less'

export const Result = withInstall(_Result)
export default Result

export * from './types'
export { resultSharedProps } from './utils'
