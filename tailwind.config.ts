import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import colors from 'tailwindcss/colors'
import theme from 'tailwindcss/defaultTheme'
import scrollbar from 'tailwind-scrollbar'
import { AntDesignThemeColor, withCSSVariable } from './build/theme'

const config: Config = {
  mode: 'jit',
  darkMode: ['class'],
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      inherit: colors.inherit,
      transparent: colors.transparent,
      current: colors.current,
      white: colors.white,
      black: colors.black
    },
    extend: {
      ...AntDesignThemeColor,
      textColor: {
        DEFAULT: withCSSVariable('colorText'),
        secondary: withCSSVariable('colorTextSecondary'),
        tertiary: withCSSVariable('colorTextTertiary'),
        quaternary: withCSSVariable('colorTextQuaternary')
      },
      backgroundColor: {
        container: withCSSVariable('colorBgContainer'),
        elevated: withCSSVariable('colorBgElevated'),
        layout: withCSSVariable('colorBgLayout'),
        spotlight: withCSSVariable('colorBgSpotlight'),
        mask: withCSSVariable('colorBgMask'),
        fill: {
          DEFAULT: withCSSVariable('colorFill'),
          secondary: withCSSVariable('colorFillSecondary'),
          tertiary: withCSSVariable('colorFillTertiary'),
          quaternary: withCSSVariable('colorFillQuaternary')
        }
      },
      borderColor: {
        DEFAULT: withCSSVariable('colorBorderSecondary'),
        100: withCSSVariable('colorBorder')
      },
      borderWidth: {
        DEFAULT: withCSSVariable('lineWidth')
      },
      borderRadius: {
        DEFAULT: withCSSVariable('borderRadius'),
        xs: withCSSVariable('borderRadiusSM'),
        sm: withCSSVariable('borderRadiusSM'),
        lg: withCSSVariable('borderRadiusLG'),
        outer: withCSSVariable('borderRadiusOuter')
      },
      fontFamily: {
        system: withCSSVariable('fontFamily')
      },
      fontSize: {
        sm: [withCSSVariable('fontSizeSM'), withCSSVariable('lineHeightSM')],
        md: [ withCSSVariable('fontSize'), withCSSVariable('lineHeight')],
        lg: [withCSSVariable('fontSizeLG'), withCSSVariable('lineHeightLG')],
        xl: [withCSSVariable('fontSizeXL'), withCSSVariable('lineHeightLG')],
        h1: [withCSSVariable('fontSizeHeading1'), {
          lineHeight: withCSSVariable('lineHeightHeading1'),
          fontWeight: theme.fontWeight.semibold
        }],
        h2: [withCSSVariable('fontSizeHeading2'), {
          lineHeight: withCSSVariable('lineHeightHeading2'),
          fontWeight: theme.fontWeight.semibold
        }],
        h3: [withCSSVariable('fontSizeHeading3'), {
          lineHeight: withCSSVariable('lineHeightHeading3'),
          fontWeight: theme.fontWeight.semibold
        }],
        h4: [withCSSVariable('fontSizeHeading4'), {
          lineHeight: withCSSVariable('lineHeightHeading4'),
          fontWeight: theme.fontWeight.semibold
        }],
        h5: [withCSSVariable('fontSizeHeading5'), {
          lineHeight: withCSSVariable('lineHeightHeading5'),
          fontWeight: theme.fontWeight.semibold
        }]
      },
      spacing: {
        base: withCSSVariable('size'),
        xxs: withCSSVariable('sizeXXS'),
        xs: withCSSVariable('sizeXS'),
        sm: withCSSVariable('sizeSM'),
        ms: withCSSVariable('sizeMS'),
        md: withCSSVariable('sizeMD'),
        lg: withCSSVariable('sizeLG'),
        xl: withCSSVariable('sizeXL'),
        xxl: withCSSVariable('sizeXXS')
      },
      lineHeight: {
        DEFAULT: withCSSVariable('lineHeight'),
        sm: withCSSVariable('lineHeightSM'),
        lg: withCSSVariable('lineHeightLG'),
        heading1: withCSSVariable('lineHeightHeading1'),
        heading2: withCSSVariable('lineHeightHeading2'),
        heading3: withCSSVariable('lineHeightHeading3'),
        heading4: withCSSVariable('lineHeightHeading4'),
        heading5: withCSSVariable('lineHeightHeading5'),
      },
      height: {
        control: withCSSVariable('controlHeight'),
        'control-xs': withCSSVariable('controlHeightXS'),
        'control-sm': withCSSVariable('controlHeightSM'),
        'control-lg': withCSSVariable('controlHeightLG')
      },
      transitionTimingFunction: {
        'ease-out-circ': withCSSVariable('motionEaseOutCirc'),
        'ease-in-out-circ': withCSSVariable('motionEaseInOutCirc'),
        'ease-out': withCSSVariable('motionEaseOut'),
        'ease-in-out': withCSSVariable('motionEaseInOut'),
        'ease-out-back': withCSSVariable('motionEaseOutBack'),
        'ease-in-back': withCSSVariable('motionEaseInBack'),
        'ease-in-quint': withCSSVariable('motionEaseInQuint'),
        'ease-out-quint': withCSSVariable('motionEaseOutQuint')
      },
      transitionDuration: {
        fast: withCSSVariable('motionDurationFast'),
        mid: withCSSVariable('motionDurationMid'),
        slow: withCSSVariable('motionDurationSlow')
      }
    }
  },
  plugins: [
    scrollbar,
    plugin(function({ addBase }) {
      addBase({
        'html,:host': {
          fontFamily: withCSSVariable('fontFamily')
        },
        'html,body': {
          backgroundColor: withCSSVariable('colorBgContainer')
        },
        'a:hover': {
          color: withCSSVariable('colorPrimaryHover')
        }
      })
    })
  ]
}

export default config
