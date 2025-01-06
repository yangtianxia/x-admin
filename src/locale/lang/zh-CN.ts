import GlobalLocale from './zh-CN/global'

// Layout
import LayoutLocale from '@/layout/locale/zh-CN'

// Components
import ResultLocale from '@/components/result/locale/zh-CN'
import SendCodeLocale from '@/components/send-code/locale/zh-CN'

// Views
import LoginLocale from '@/views/login/locale/zh-CN'
import WorkplaceLocale from '@/views/dashboard/workplace/locale/zh-CN'

export default {
  ...GlobalLocale,
  ...LayoutLocale,
  ...ResultLocale,
  ...SendCodeLocale,
  ...LoginLocale,
  ...WorkplaceLocale
}
