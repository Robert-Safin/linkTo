import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  extend: {
    fontFamily: {
      instrumental: ['InstrumentSans'],
    },
    colors: {
      strongPurple: '#633CFF',
      midPurple: '#BEADFF',
      lightPurple: '#EFEBFF',

      strongGray: '#333333',
      midGray: '#737373',
      lightGray: '#D9D9D9',
      lightestGray: '#FAFAFA',
      white: '#FFFFFF',
      red: '#FF3939',
    }
  }
  },
  plugins: [],
}
export default config
