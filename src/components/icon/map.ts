import { default as LeftC } from '@icon-park/vue-next/lib/icons/LeftC'
import { default as RightC } from '@icon-park/vue-next/lib/icons/RightC'
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
import { default as LoadingOne } from '@icon-park/vue-next/lib/icons/LoadingOne'

export const icons = {
  LeftC,
  RightC,
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
  LoadingOne
} as const

type IconMapTypeOf = typeof icons

export type IconMapCamel = keyof IconMapTypeOf

export type IconMapSnake = KebabCase<keyof IconMapTypeOf>

export type IconMap = IconMapCamel | IconMapSnake
