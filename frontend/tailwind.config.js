/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: '#7DAEDF',
        dusk: '#E2CABE',
        aqua: '#1336AB',
        water: '#65A2DE',
        stone: '#7E7E7E',
        eggshell: '#FAFAFA',
        shimmer: '#F4F7FA',
      },
      fontFamily: {
        mono: ['ibm-plex-mono', ...defaultTheme.fontFamily.mono],
        sans: ['source-sans-3', ...defaultTheme.fontFamily.sans],
        serif: [...defaultTheme.fontFamily.serif]
      }
    },
  },
  plugins: [],

}
