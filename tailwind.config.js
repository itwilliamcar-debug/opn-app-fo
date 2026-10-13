/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'opn-blue': '#2E68B4',
        'opn-navy': '#2E68B4',
        'opn-blue-dark': '#215091',
        'opn-blue-light': '#EBF3FB',
        'opn-green': '#00A651',
        'opn-green-dark': '#008742',
        'opn-green-light': '#E6F7ED',
        'opn-yellow': '#FFDE16',
        'opn-yellow-gold': '#FCD116',
        'gabon-green': '#009E60',
        'gabon-yellow': '#FCD116',
        'gabon-blue': '#3A75C4',
      },
      fontFamily: {
        sans: ['Poppins', 'Plus Jakarta Sans', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '1px',
        'DEFAULT': '2px',
        'md': '2px',
        'lg': '3px',
        'xl': '3px',
        '2xl': '4px',
        '3xl': '4px',
        'full': '4px',
      }
    },
  },
  plugins: [],
}
