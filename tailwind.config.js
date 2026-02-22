/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d8e7ff',
          500: '#2a7fff',
          600: '#1765dc',
          700: '#124fb0',
        },
        ink: {
          900: '#252b42',
          700: '#4f5665',
          600: '#626b7d',
          500: '#73788c',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        card: '0 14px 24px -14px rgb(37 43 66 / 28%)',
      },
    },
  },
  plugins: [],
}
