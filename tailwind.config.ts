import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#F5F5F7',
          dark: '#000000',
        },
        text: {
          light: '#1C1C1E',
          dark: '#F5F5F7',
        },
        accent: {
          light: '#007AFF',
          dark: '#0A84FF',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C1C1E',
        },
        border: {
          light: '#D1D1D1',
          dark: '#4A4A4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '20px',
      },
      boxShadow: {
        'apple': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
}
export default config

