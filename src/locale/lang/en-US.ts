import GlobalLocale from './en-US/global'

// Layout
import LayoutLocale from '@/layout/locale/en-US'

// Components
import ResultLocale from '@/components/result/locale/en-US'
import SendCodeLocale from '@/components/send-code/locale/en-US'

// Views
import LoginLocale from '@/views/login/locale/en-US'
import WorkplaceLocale from '@/views/dashboard/workplace/locale/en-US'

export default {
  ...GlobalLocale,
  ...LayoutLocale,
  ...ResultLocale,
  ...SendCodeLocale,
  ...LoginLocale,
  ...WorkplaceLocale
}
