/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fdfcf7',
          100: '#faf7e8',
          200: '#f5efc8',
          300: '#ede39a',
          400: '#e3d46b',
          500: '#d4ba3c',
          600: '#c19f2e',
          700: '#a17f27',
          800: '#856626',
          900: '#6f5422',
        },
        renart: {
          primary: '#B67C52', // Warm brown from the logo
          secondary: '#8B4513', // Deeper brown
          accent: '#D4A574', // Light golden brown
          cream: '#F7F3F0', // Warm cream background
          charcoal: '#2C2C2C', // Deep charcoal for text
          // Brand-specific brown colors - using the preferred darker brown
          brown: '#9A451A', // Brand brown - preferred darker shade
          'brown-2': '#9B4721', // Brand brown-2
          'brown-sugar': '#A75D38', // Brand brown-sugar
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
      },
    },
  },
  plugins: [],
};
