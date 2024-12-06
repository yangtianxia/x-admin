import type { Config } from 'tailwindcss'
import tailwindScrollbar from 'tailwind-scrollbar'
import colors from 'tailwindcss/colors'

const config: Config = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      inherit: colors.inherit,
      transparent: colors.transparent,
      current: colors.current,
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      red: colors.red,
      yellow: colors.yellow,
      blue: colors.blue,
      green: colors.green,
      slate: colors.slate,
      primary: colors.blue[500],
    },
    extend: {
      textColor: {
        main: colors.gray[700],
        secondary: colors.gray[600],
        tertiary: colors.gray[500],
        quaternary: colors.gray[400]
      },
      backgroundColor: {
        100: colors.gray[50],
        200: colors.gray[100]
      }
    }
  },
  plugins: [
    tailwindScrollbar
  ]
}

export default config
