import { default as LeftC } from '@icon-park/vue-next/lib/icons/LeftC'
import { default as Left } from '@icon-park/vue-next/lib/icons/Left'
import { default as RightC } from '@icon-park/vue-next/lib/icons/RightC'
import { default as Right } from '@icon-park/vue-next/lib/icons/Right'
import { default as Plus } from '@icon-park/vue-next/lib/icons/Plus'
import { default as Translate } from '@icon-park/vue-next/lib/icons/Translate'
import { default as People } from '@icon-park/vue-next/lib/icons/People'
import { default as Lock } from '@icon-park/vue-next/lib/icons/Lock'
import { default as Phone } from '@icon-park/vue-next/lib/icons/Phone'
import { default as Message } from '@icon-park/vue-next/lib/icons/Message'
import { default as User } from '@icon-park/vue-next/lib/icons/User'
import { default as Search } from '@icon-park/vue-next/lib/icons/Search'
import { default as Moon } from '@icon-park/vue-next/lib/icons/Moon'
import { default as Computer } from '@icon-park/vue-next/lib/icons/Computer'
import { default as SunOne } from '@icon-park/vue-next/lib/icons/SunOne'
import { default as MenuFoldOne } from '@icon-park/vue-next/lib/icons/MenuFoldOne'
import { default as MenuUnfoldOne } from '@icon-park/vue-next/lib/icons/MenuUnfoldOne'
import { default as DashboardOne } from '@icon-park/vue-next/lib/icons/DashboardOne'
import { default as Home } from '@icon-park/vue-next/lib/icons/Home'
import { default as DamageMap } from '@icon-park/vue-next/lib/icons/DamageMap'
import { default as Picture } from '@icon-park/vue-next/lib/icons/Picture'
import { default as GithubOne } from '@icon-park/vue-next/lib/icons/GithubOne'
import { default as Logout } from '@icon-park/vue-next/lib/icons/Logout'
import { default as Setting } from '@icon-park/vue-next/lib/icons/Setting'
import { default as Components } from '@icon-park/vue-next/lib/icons/Components'
import { default as CloseSmall } from '@icon-park/vue-next/lib/icons/CloseSmall'
import { default as ZoomIn } from '@icon-park/vue-next/lib/icons/ZoomIn'
import { default as PreviewOpen } from '@icon-park/vue-next/lib/icons/PreviewOpen'

export const icons = {
  LeftC,
  Left,
  RightC,
  Right,
  Plus,
  Translate,
  People,
  Lock,
  Phone,
  Message,
  User,
  Search,
  Moon,
  SunOne,
  Computer,
  MenuFoldOne,
  MenuUnfoldOne,
  DashboardOne,
  Home,
  DamageMap,
  Picture,
  GithubOne,
  Logout,
  Setting,
  Components,
  CloseSmall,
  ZoomIn,
  PreviewOpen
} as const

type IconMapTypeOf = typeof icons

export type IconMapCamel = keyof IconMapTypeOf

export type IconMapSnake = KebabCase<keyof IconMapTypeOf>

export type IconMap = IconMapCamel | IconMapSnake
