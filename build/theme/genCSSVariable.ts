import { camelToKebab } from '@txjs/shared'
import { LightTheme } from './seed'
import filterExceptColor from './filterExceptColor'
import toHex from './toHex'

const WhiteList = [
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

const PxKeys = [
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

const HexKeys = [
  'colorText',
  'colorTextSecondary',
  'colorTextTertiary',
  'colorTextQuaternary'
]

const needToPx = (key: string) => {
  return PxKeys.includes(key)
}

const needToHex = (key: string) => {
  return HexKeys.includes(key)
}

const addUtil = (value: number) => {
  return `${value}px`
}

const getSeedValueByKey = (key: string, seedToken: Record<string, any>) => {
  let value = seedToken[key]
  if (needToPx(key)) {
    value = addUtil(value)
  } else if (needToHex(key)) {
    value = toHex(value)
  }
  return value
}

const genCSSVariable = (seedToken: Record<string, any>, isLight = true) => {
  if (!isLight) {
    seedToken = filterExceptColor(seedToken)
  }
  return Object
    .keys(seedToken)
    .reduce(
      (ret, key) => {
        if (!WhiteList.includes(key)) {
          let value = seedToken[key]
          if (needToPx(key)) {
            value = addUtil(value)
          } else if (needToHex(key)) {
            value = toHex(value)
          }
          ret.push(`--${camelToKebab(key)}: ${getSeedValueByKey(key, seedToken)}`)
        }
        return ret
      }, [] as string[]
    )
    .join(';')
}

export const withCSSVariable = (token: keyof typeof LightTheme) => {
  return `var(--${camelToKebab(token)}) /* ${getSeedValueByKey(token, LightTheme)} */`
}

export default genCSSVariable
