/** 网站主题 */
export const THEME_KEY = 'x_admin_theme'

/** 明亮模式 */
export const THEME_LIGHT = 'light'

/** 暗黑模式 */
export const THEME_DARK = 'dark'

/** 跟随系统模式 */
export const THEME_SYSTEM = 'system'

/** 主题选项 */
export const THEME_OPTIONS = [
  {
    label: '明亮',
    value: THEME_LIGHT,
    icon: 'SunOne' as const
  },
  {
    label: '暗黑',
    value: THEME_DARK,
    icon: 'Moon' as const
  },
  {
    label: '系统',
    value: THEME_SYSTEM,
    icon: 'Computer' as const
  }
]
