import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import scrollbar from 'tailwind-scrollbar'
import theme from './build/theme'

const config: Config = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      inherit: colors.inherit,
      transparent: colors.transparent,
      current: colors.current,
      white: colors.white,
      black: colors.black
    }
  },
  plugins: [
    scrollbar,
    theme
  ]
}

export default config
