/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E8621A',
          dark:    '#C44E10',
          light:   '#FF8C42',
          amber:   '#F59E0B',
        },
        forge: {
          black:   '#0B0907',
          dark:    '#13100A',
          surface: '#1A1510',
          card:    '#221A0F',
          border:  '#2D2318',
          muted:   '#7A6B58',
          cream:   '#F0E6D3',
          dim:     '#B8A898',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
