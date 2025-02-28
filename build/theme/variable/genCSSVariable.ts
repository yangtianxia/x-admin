import { camelToKebab } from '@txjs/shared'
import { toHex } from '../utils/toHex'
import { toRgb } from '../utils/toRgb'
import { hasComprehensiveColor, matchColors } from '../utils'
import type { SeedToken } from '../types'

const ignoreList = [
  'wireframe',
  'motionUnit',
  'lineType',
  'lineWidthBold',
  'motionBase',
  'sizeUnit',
  'sizeStep',
  'colorWhite',
  'opacityImage',
  'colorTextBase',
  'colorBgBase',
  'zIndexBase',
  'zIndexPopupBase',
  'sizePopupArrow'
]

const sizeList = [
  'lineWidth',
  'fontSize',
  'fontSizeSM',
  'fontSizeLG',
  'fontSizeXL',
  'fontSizeHeading1',
  'fontSizeHeading2',
  'fontSizeHeading3',
  'fontSizeHeading4',
  'fontSizeHeading5',
  'size',
  'sizeXXS',
  'sizeXS',
  'sizeSM',
  'sizeMS',
  'sizeMD',
  'sizeLG',
  'sizeXL',
  'sizeXXL',
  'borderRadius',
  'borderRadiusXS',
  'borderRadiusSM',
  'borderRadiusLG',
  'borderRadiusOuter',
  'controlHeight',
  'controlHeightSM',
  'controlHieghtXS',
  'controlHeightLG'
]

const colorList = [
  'colorText',
  'colorTextSecondary',
  'colorTextTertiary',
  'colorTextQuaternary'
]

export const getSeedTokenValue = (key: string, seedToken: SeedToken) => {
  let value = seedToken[key]
  if (sizeList.includes(key)) {
    value = `${value}px`
  } else if (colorList.includes(key)) {
    value = toHex(value)
  }

  if (hasComprehensiveColor(key)) {
    value = toRgb(value)
  }

  // 转成string类型
  // 避免postcss将数字自动添加px
  return value.toString()
}

export const genCSSVariable = (seedToken: SeedToken, isDark = false) => {
  if (isDark) {
    seedToken = matchColors(seedToken)
  }
  return Object.keys(seedToken)
    .reduce(
      (ret, key) => {
        if (!ignoreList.includes(key)) {
          ret.push(`--${camelToKebab(key)}: ${getSeedTokenValue(key, seedToken)}`)
        }
        return ret
      }, [] as string[]
    )
    .join(';')
}
