import { withInstall } from '../_utils/with-install'
import _Upload from './Upload'

import './index.less'

export const Upload = withInstall(_Upload)
export default Upload

export {
  makeUpload,
  makeUploadLimit,
  makeUploadException,
  formatAccept,
  formatFile
} from './utils'
export type { UploadFile } from './types'
