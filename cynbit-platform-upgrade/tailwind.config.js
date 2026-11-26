/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cynbit: {
          DEFAULT: '#056368',
          dark: '#044e52',
          light: '#e6f4f4',
          mint: '#f0f9f9',
          accent: '#0d9488',
        },
      },
    },
  },
  plugins: [],
};
