import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9effe',
          200: '#d6defc',
          300: '#b6c3f9',
          400: '#8e9cf4',
          500: '#6c7ae8',
          600: '#535ed6',
          700: '#4249b6',
          800: '#353c90',
          900: '#2e3474'
        }
      }
    }
  },
  plugins: [],
} satisfies Config
