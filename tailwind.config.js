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
          primary: '#C94A10',
          dark:    '#A83C0B',
          light:   '#FF7A1A', // logo flame, for text and marks on graphite
          amber:   '#F59E0B',
        },
        // Dark surfaces: site header, hero, closing bands, admin panel
        forge: {
          black:   '#20252A',
          dark:    '#1A1E22',
          surface: '#2A3036',
          card:    '#30373E',
          border:  '#414A52',
          muted:   '#A3ACB3',
          cream:   '#F1F2EF',
          dim:     '#C9CED2',
        },
        // Light surfaces: page content
        plaster: '#ECEDEA',
        paper:   '#F9F9F7',
        ink:     '#20252A',
        steel:   '#565F67',
        flue:    '#B9BFC3',
      },
      fontFamily: {
        display: ['Geologica', 'system-ui', 'sans-serif'],
        sans:    ['Geologica', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
