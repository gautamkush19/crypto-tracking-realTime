import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ]
      },
      boxShadow: {
        premium: '0 24px 80px rgba(0, 0, 0, 0.28)'
      }
    }
  },
  plugins: []
} satisfies Config;
