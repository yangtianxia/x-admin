import { default as LeftC } from '@icon-park/vue-next/lib/icons/LeftC'
import { default as RightC } from '@icon-park/vue-next/lib/icons/RightC'
import { default as People } from '@icon-park/vue-next/lib/icons/People'
import { default as Lock } from '@icon-park/vue-next/lib/icons/Lock'
import { default as User } from '@icon-park/vue-next/lib/icons/User'
import { default as Search } from '@icon-park/vue-next/lib/icons/Search'
import { default as Translate } from '@icon-park/vue-next/lib/icons/Translate'
import { default as MenuFoldOne } from '@icon-park/vue-next/lib/icons/MenuFoldOne'
import { default as MenuUnfoldOne } from '@icon-park/vue-next/lib/icons/MenuUnfoldOne'
import { default as DashboardOne } from '@icon-park/vue-next/lib/icons/DashboardOne'
import { default as Home } from '@icon-park/vue-next/lib/icons/Home'

export const icons = {
  LeftC,
  RightC,
  People,
  Lock,
  User,
  Search,
  Translate,
  MenuFoldOne,
  MenuUnfoldOne,
  DashboardOne,
  Home
} as const

type IconMapTypeOf = typeof icons

export type IconMapCamel = keyof IconMapTypeOf

export type IconMapSnake = KebabCase<keyof IconMapTypeOf>

export type IconMap = IconMapCamel | IconMapSnake
