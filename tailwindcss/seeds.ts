import colors from 'tailwindcss/colors'

const colorPrimary = colors.blue[500]

const colorTokens = {
  // 品牌色
  colorPrimary: colorPrimary,
  // 成功色
  colorSuccess: colors.green['500'],
  // 警戒色
  colorWarning: colors.yellow['500'],
  // 错误色
  colorError: colors.red['500'],
  // 信息色
  colorInfo: colors.blue['500']
}

export const seedToken = {
  ...colorTokens
}
