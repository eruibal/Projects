import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        techaus: {
          primary: '#1e293b',
          accent: '#0ea5e9',
          light: '#f8fafc',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        heading: ['var(--font-montserrat)'],
        sans: ['var(--font-open-sans)'],
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      clipPath: {
        diagonal: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      },
    },
  },
  plugins: [],
}
export default config
