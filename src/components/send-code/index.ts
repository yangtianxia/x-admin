import { withInstall } from '../_utils/with-install'
import _SendCode from './SendCode'

export const SendCode = withInstall(_SendCode)
export default SendCode

export type { SendCodeProps } from './SendCode'
