/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./_site/**/*.{html,js}"
  ],
  theme: {
    screens: {
      'sm': '525px',
      // => @media (min-width: 640px) { ... }

      'md': '767px',
      // => @media (min-width: 1024px) { ... }

      'lg': '1200px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      fontFamily: {
        'sans': ['Montserrat', ...defaultTheme.fontFamily.sans],
        'serif': ['Josefin Slab', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}

