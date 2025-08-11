import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        surface: '#0f172a',
        brand: {
          50: '#e6f6ff',
          100: '#ccecff',
          200: '#99daff',
          300: '#66c8ff',
          400: '#33b6ff',
          500: '#0ea5e9',
          600: '#0987c6',
          700: '#07699e',
          800: '#054d74',
          900: '#033454',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(14, 165, 233, 0.35)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
