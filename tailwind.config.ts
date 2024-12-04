import type { Config } from 'tailwindcss'

const config: Config = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#468ff5',
        green: '#52c41a',
        yellow: '#eca311',
        red: '#ff4d4f',
        blue: '#1677ff'
      }
    }
  },
  plugins: []
}

export default config
