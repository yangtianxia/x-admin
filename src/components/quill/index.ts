import { type ComponentPublicInstance } from 'vue'
import { withInstall } from '../_utils/with-install'
import _Quill, { type QuillProps, type QuillProvide } from './Quill'

import './index.less'

export const Quill = withInstall(_Quill)
export default Quill

export type QuillInstance = ComponentPublicInstance<QuillProps, QuillProvide>
